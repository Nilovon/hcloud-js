import { describe, expect, test } from "bun:test";
import {
  ErrorCode,
  HCloudAbortError,
  HCloudApiError,
  HCloudConflictError,
  HCloudConnectionError,
  HCloudError,
  HCloudForbiddenError,
  HCloudInvalidInputError,
  HCloudNotFoundError,
  HCloudRateLimitError,
  HCloudServerError,
  HCloudTimeoutError,
  HCloudUnauthorizedError,
  isHCloudError,
} from "../../src/core/errors";
import { apiError, mockClient } from "../helpers";

async function catchError(promise: Promise<unknown>): Promise<HCloudError> {
  try {
    await promise;
  } catch (error) {
    return error as HCloudError;
  }
  throw new Error("Expected the promise to reject");
}

describe("API errors", () => {
  test.each([
    [401, "unauthorized", HCloudUnauthorizedError],
    [403, "forbidden", HCloudForbiddenError],
    [404, "not_found", HCloudNotFoundError],
    [409, "conflict", HCloudConflictError],
    [422, "invalid_input", HCloudInvalidInputError],
    [429, "rate_limit_exceeded", HCloudRateLimitError],
    [500, "server_error", HCloudServerError],
    [423, "locked", HCloudApiError],
  ] as const)("maps HTTP %i (%s) to the matching class", async (status, code, ErrorClass) => {
    const { client } = mockClient(apiError(status, code, "nope"), { retry: false });
    const error = await catchError(client.get("/servers/1"));

    expect(error).toBeInstanceOf(ErrorClass);
    expect(error).toBeInstanceOf(HCloudApiError);
    expect(error).toBeInstanceOf(HCloudError);
    expect(error.name).toBe(ErrorClass.name);
    expect(error.code).toBe(code);
    expect(error.statusCode).toBe(status);
    expect(error.message).toBe("nope");
    expect(error.is(code)).toBe(true);
  });

  test("exposes request details and field errors", async () => {
    const { client } = mockClient(
      apiError(422, "invalid_input", "invalid input in field 'name'", {
        details: { fields: [{ name: "name", messages: ["is too long"] }] },
        headers: { "x-correlation-id": "corr-1" },
      }),
    );
    const error = (await catchError(client.post("/servers", { name: "x" }))) as HCloudApiError;

    expect(error.requestId).toBe("corr-1");
    expect(error.method).toBe("POST");
    expect(error.url).toBe("https://api.hetzner.cloud/v1/servers");
    expect(error.status).toBe(422);
    expect(error.hasFieldErrors()).toBe(true);
    expect(error.getFieldErrors()).toEqual([{ name: "name", messages: ["is too long"] }]);
    expect(JSON.parse(JSON.stringify(error))).toMatchObject({
      name: "HCloudInvalidInputError",
      code: "invalid_input",
      requestId: "corr-1",
    });
  });

  test("handles non-JSON error bodies", async () => {
    const { client } = mockClient(new Response("Bad Gateway", { status: 502 }), { retry: false });
    const error = await catchError(client.get("/servers"));
    expect(error).toBeInstanceOf(HCloudServerError);
    expect(error.code).toBe("bad_gateway");
    expect(error.message).toContain("HTTP 502");
  });

  test("rate limit errors expose retry information", async () => {
    const { client } = mockClient(
      apiError(429, "rate_limit_exceeded", "limit reached", {
        headers: {
          "retry-after": "7",
          "ratelimit-limit": "3600",
          "ratelimit-remaining": "0",
          "ratelimit-reset": "1767225600",
        },
      }),
      { retry: false },
    );
    const error = (await catchError(client.get("/servers"))) as HCloudRateLimitError;
    expect(error).toBeInstanceOf(HCloudRateLimitError);
    expect(error.retryAfter).toBe(7);
    expect(error.rateLimit?.remaining).toBe(0);
  });

  test("isHCloudError narrows and matches codes", async () => {
    const { client } = mockClient(apiError(404, "not_found"));
    const error = await catchError(client.get("/servers/1"));
    expect(isHCloudError(error)).toBe(true);
    expect(isHCloudError(error, ErrorCode.NotFound)).toBe(true);
    expect(isHCloudError(error, "conflict")).toBe(false);
    expect(isHCloudError(new Error("x"))).toBe(false);
  });
});

describe("connection errors", () => {
  test("wraps network failures", async () => {
    const cause = new TypeError("fetch failed");
    const { client } = mockClient(cause, { retry: false });
    const error = await catchError(client.get("/servers"));
    expect(error).toBeInstanceOf(HCloudConnectionError);
    expect(error.code).toBe("NETWORK_ERROR");
    expect(error.message).toBe("Request failed: fetch failed");
    expect(error.cause).toBe(cause);
  });

  test("times out", async () => {
    const { client } = mockClient(
      (request) =>
        new Promise<Response>((_, reject) => {
          request.signal.addEventListener("abort", () => reject(request.signal.reason));
        }),
      { retry: false, timeout: 20 },
    );
    const error = (await catchError(client.get("/servers"))) as HCloudTimeoutError;
    expect(error).toBeInstanceOf(HCloudTimeoutError);
    expect(error).toBeInstanceOf(HCloudConnectionError);
    expect(error.code).toBe("TIMEOUT");
    expect(error.timeout).toBe(20);
    expect(error.message).toBe("Request timeout after 20ms");
  });

  test("per-request timeout overrides the client timeout", async () => {
    const { client } = mockClient(
      (request) =>
        new Promise<Response>((_, reject) => {
          request.signal.addEventListener("abort", () => reject(request.signal.reason));
        }),
      { retry: false, timeout: 60_000 },
    );
    const error = await catchError(client.get("/servers", { timeout: 10 }));
    expect(error).toBeInstanceOf(HCloudTimeoutError);
  });

  test("aborts through a caller signal", async () => {
    const controller = new AbortController();
    const { client, requests } = mockClient((request) => {
      return new Promise<Response>((_, reject) => {
        request.signal.addEventListener("abort", () => reject(request.signal.reason));
        controller.abort();
      });
    });
    const error = await catchError(client.get("/servers", { signal: controller.signal }));
    expect(error).toBeInstanceOf(HCloudAbortError);
    expect(error.code).toBe("ABORTED");
    expect(requests).toHaveLength(1);
  });

  test("does not send requests for already aborted signals", async () => {
    const { client } = mockClient({});
    const error = await catchError(client.get("/servers", { signal: AbortSignal.abort() }));
    expect(error).toBeInstanceOf(HCloudAbortError);
  });
});
