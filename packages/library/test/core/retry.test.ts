import { describe, expect, test } from "bun:test";
import { HCloudApiError, HCloudConnectionError, HCloudRateLimitError } from "../../src/core/errors";
import {
  DEFAULT_RETRY_OPTIONS,
  parseRetryAfter,
  resolveRetryOptions,
  retryDelay,
} from "../../src/core/http";
import type { RetryContext } from "../../src/core/types";
import { apiError, mockClient } from "../helpers";

describe("retries", () => {
  test.each([
    [429, "rate_limit_exceeded"],
    [409, "conflict"],
    [502, "bad_gateway"],
    [504, "timeout"],
  ])("retries HTTP %i (%s)", async (status, code) => {
    const { client, requests } = mockClient([apiError(status, code), apiError(status, code), { ok: 1 }]);
    expect(await client.post<{ ok: number }>("/servers", {})).toEqual({ ok: 1 });
    expect(requests).toHaveLength(3);
  });

  test.each([
    [400, "json_error"],
    [401, "unauthorized"],
    [404, "not_found"],
    [422, "invalid_input"],
    [423, "locked"],
    [500, "server_error"],
  ])("does not retry HTTP %i (%s)", async (status, code) => {
    const { client, requests } = mockClient([apiError(status, code), { ok: 1 }]);
    await expect(client.get("/servers")).rejects.toBeInstanceOf(HCloudApiError);
    await Bun.sleep(20);
    expect(requests).toHaveLength(1);
  });

  test("gives up after maxRetries", async () => {
    const { client, requests } = mockClient(apiError(429, "rate_limit_exceeded"), { retry: 2 });
    await expect(client.get("/servers")).rejects.toBeInstanceOf(HCloudRateLimitError);
    await Bun.sleep(50);
    expect(requests).toHaveLength(3);
  });

  test("retries network errors for idempotent requests only", async () => {
    const failure = new TypeError("socket hang up");

    const get = mockClient([failure, { ok: 1 }]);
    expect(await get.client.get<{ ok: number }>("/servers")).toEqual({ ok: 1 });
    expect(get.requests).toHaveLength(2);

    const del = mockClient([failure, undefined]);
    await del.client.delete("/servers/1");
    expect(del.requests).toHaveLength(2);

    const post = mockClient([failure, { ok: 1 }]);
    await expect(post.client.post("/servers", {})).rejects.toBeInstanceOf(HCloudConnectionError);
    await Bun.sleep(20);
    expect(post.requests).toHaveLength(1);
  });

  test("can be disabled per client and per request", async () => {
    const perClient = mockClient(apiError(502, "bad_gateway"), { retry: false });
    await expect(perClient.client.get("/servers")).rejects.toBeInstanceOf(HCloudApiError);
    await Bun.sleep(20);
    expect(perClient.requests).toHaveLength(1);

    const perRequest = mockClient(apiError(502, "bad_gateway"));
    await expect(perRequest.client.get("/servers", { retry: false })).rejects.toBeInstanceOf(
      HCloudApiError,
    );
    await Bun.sleep(20);
    expect(perRequest.requests).toHaveLength(1);
  });

  test("custom shouldRetry overrides the default policy", async () => {
    const { client, requests } = mockClient([apiError(423, "locked"), { ok: 1 }], {
      retry: {
        baseDelay: 1,
        shouldRetry: ({ error }) => (error.code === "locked" ? true : undefined),
      },
    });
    expect(await client.post<{ ok: number }>("/servers/1/actions/reboot")).toEqual({ ok: 1 });
    expect(requests).toHaveLength(2);
  });

  test("calls onRetry and onError hooks", async () => {
    const retries: RetryContext[] = [];
    const errors: string[] = [];
    const { client } = mockClient(apiError(502, "bad_gateway"), {
      retry: { maxRetries: 2, baseDelay: 1, maxDelay: 2 },
      hooks: {
        onRetry: (ctx) => void retries.push(ctx),
        onError: (ctx) => void errors.push(`${ctx.request.attempt}:${ctx.error.code}`),
      },
    });

    await client.get("/servers").catch(() => {});
    expect(retries.map((r) => r.nextAttempt)).toEqual([1, 2]);
    expect(retries.every((r) => r.delayMs >= 1 && r.delayMs <= 2)).toBe(true);
    expect(errors).toEqual(["2:bad_gateway"]);
  });

  test("honors Retry-After", async () => {
    const delays: number[] = [];
    const { client } = mockClient(
      [apiError(429, "rate_limit_exceeded", "slow down", { headers: { "retry-after": "0.02" } }), {}],
      { retry: { baseDelay: 5000 }, hooks: { onRetry: (ctx) => void delays.push(ctx.delayMs) } },
    );
    await client.get("/servers");
    expect(delays).toEqual([20]);
  });

  test("aborting stops pending retries", async () => {
    const controller = new AbortController();
    const { client, requests } = mockClient(apiError(502, "bad_gateway"), {
      retry: { baseDelay: 10_000, jitter: false },
      hooks: { onRetry: () => void setTimeout(() => controller.abort(), 5) },
    });
    await expect(client.get("/servers", { signal: controller.signal })).rejects.toMatchObject({
      code: "ABORTED",
    });
    await Bun.sleep(30);
    expect(requests).toHaveLength(1);
  });
});

describe("retry helpers", () => {
  test("resolveRetryOptions merges settings", () => {
    expect(resolveRetryOptions()).toEqual(DEFAULT_RETRY_OPTIONS);
    expect(resolveRetryOptions(false).maxRetries).toBe(0);
    expect(resolveRetryOptions(3).maxRetries).toBe(3);
    expect(resolveRetryOptions({ baseDelay: 10 }, 2)).toMatchObject({ baseDelay: 10, maxRetries: 2 });
    expect(resolveRetryOptions({ maxRetries: undefined }).maxRetries).toBe(5);
  });

  test("retryDelay grows exponentially and is capped", () => {
    const retry = resolveRetryOptions({ baseDelay: 100, maxDelay: 1000, jitter: false });
    expect([0, 1, 2, 3, 4, 5].map((attempt) => retryDelay(retry, attempt))).toEqual([
      100, 200, 400, 800, 1000, 1000,
    ]);
  });

  test("retryDelay applies jitter between base and interval", () => {
    const retry = resolveRetryOptions({ baseDelay: 100, maxDelay: 1000 });
    expect(retryDelay(retry, 2, undefined, () => 0)).toBe(100);
    expect(retryDelay(retry, 2, undefined, () => 1)).toBe(400);
    expect(retryDelay(retry, 2, undefined, () => 0.5)).toBe(250);
  });

  test("retryDelay prefers Retry-After, capped at maxDelay", () => {
    const retry = resolveRetryOptions({ baseDelay: 100, maxDelay: 1000 });
    expect(retryDelay(retry, 0, 0.5)).toBe(500);
    expect(retryDelay(retry, 0, 30)).toBe(1000);
  });

  test("parseRetryAfter understands seconds and dates", () => {
    const now = Date.parse("2026-01-01T00:00:00Z");
    expect(parseRetryAfter(new Headers({ "retry-after": "12" }))).toBe(12);
    expect(
      parseRetryAfter(new Headers({ "retry-after": "Thu, 01 Jan 2026 00:00:30 GMT" }), now),
    ).toBe(30);
    expect(parseRetryAfter(new Headers({ "retry-after": "soon" }))).toBeUndefined();
    expect(parseRetryAfter(new Headers())).toBeUndefined();
  });
});
