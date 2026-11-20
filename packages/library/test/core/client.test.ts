import { afterEach, describe, expect, test } from "bun:test";
import { BaseClient } from "../../src/core/base-client";
import { HCloudError } from "../../src/core/errors";
import { VERSION } from "../../src/version";
import packageJson from "../../package.json";
import { json, mockClient, mockOptions } from "../helpers";

describe("client construction", () => {
  const original = process.env.HCLOUD_TOKEN;
  afterEach(() => {
    if (original === undefined) delete process.env.HCLOUD_TOKEN;
    else process.env.HCLOUD_TOKEN = original;
  });

  test("throws without a token", () => {
    delete process.env.HCLOUD_TOKEN;
    expect(() => new BaseClient()).toThrow(HCloudError);
    expect(() => new BaseClient({ token: "  " })).toThrow("API token is required");
    try {
      new BaseClient({});
    } catch (error) {
      expect((error as HCloudError).code).toBe("INVALID_TOKEN");
    }
  });

  test("reads the token from HCLOUD_TOKEN", async () => {
    process.env.HCLOUD_TOKEN = "env-token";
    const { options, requests } = mockOptions({});
    const client = new BaseClient({ ...options, token: undefined });
    await client.get("/servers");
    expect(requests[0]?.headers.get("authorization")).toBe("Bearer env-token");
  });

  test("accepts the token as a string argument", () => {
    expect(new BaseClient("my-token").config.baseUrl).toBe("https://api.hetzner.cloud/v1");
  });

  test("supports token providers", async () => {
    let calls = 0;
    const { client, requests } = mockClient({}, { token: async () => `token-${++calls}` });
    await client.get("/a");
    await client.get("/b");
    expect(requests.map((r) => r.headers.get("authorization"))).toEqual([
      "Bearer token-1",
      "Bearer token-2",
    ]);
  });

  test("rejects empty tokens from providers", async () => {
    const { client } = mockClient({}, { token: () => "" });
    await expect(client.get("/a")).rejects.toMatchObject({ code: "INVALID_TOKEN" });
  });

  test("version matches package.json", () => {
    expect(VERSION).toBe(packageJson.version);
  });

  test("applies defaults", () => {
    const { config } = new BaseClient("token");
    expect(config.timeout).toBe(30_000);
    expect(config.retry.maxRetries).toBe(5);
    expect(config.responseValidation).toBe("warn");
    expect(config.requestValidation).toBe(true);
    expect(config.hetznerBaseUrl).toBe("https://api.hetzner.com/v1");
    expect(config.userAgent).toBe(`hcloud-js/${VERSION}`);
  });
});

describe("requests", () => {
  test("sends default headers", async () => {
    const { client, last } = mockClient(
      {},
      { userAgent: "my-app/1.0", headers: { "X-Custom": "1" } },
    );
    await client.get("/servers", { headers: { "X-Request": "2" } });

    expect(last().headers.get("authorization")).toBe("Bearer test-token");
    expect(last().headers.get("accept")).toBe("application/json");
    expect(last().headers.get("user-agent")).toBe(`my-app/1.0 hcloud-js/${VERSION}`);
    expect(last().headers.get("x-custom")).toBe("1");
    expect(last().headers.get("x-request")).toBe("2");
    expect(last().headers.get("content-type")).toBeNull();
  });

  test("serializes query parameters", async () => {
    const { client, last } = mockClient({});
    await client.get("/servers", {
      query: {
        name: "web",
        status: ["running", "off"],
        page: 2,
        include_deprecated: false,
        skipped: undefined,
        empty: null,
      },
    });
    expect(last().url.search).toBe(
      "?name=web&status=running&status=off&page=2&include_deprecated=false",
    );
  });

  test("builds URLs regardless of slashes", async () => {
    const { client, requests } = mockClient({}, { baseUrl: "https://example.test/v1/" });
    await client.get("servers");
    await client.get("/servers/1");
    expect(requests.map((r) => r.url.href)).toEqual([
      "https://example.test/v1/servers",
      "https://example.test/v1/servers/1",
    ]);
  });

  test("routes to the Hetzner API", async () => {
    const { client, last } = mockClient({});
    await client.get("/storage_boxes", { api: "hetzner" });
    expect(last().url.href).toBe("https://api.hetzner.com/v1/storage_boxes");
  });

  test("sends JSON bodies without undefined values", async () => {
    const { client, last } = mockClient({});
    await client.post("/servers", {
      name: "web",
      labels: undefined,
      nested: { keep: null, drop: undefined, list: [{ a: 1, b: undefined }] },
    });
    expect(last().method).toBe("POST");
    expect(last().headers.get("content-type")).toBe("application/json");
    expect(last().body).toEqual({ name: "web", nested: { keep: null, list: [{ a: 1 }] } });
  });

  test("omits the body when none is given", async () => {
    const { client, last } = mockClient({});
    await client.post("/servers/1/actions/poweron");
    expect(last().body).toBeUndefined();
    expect(last().headers.get("content-type")).toBeNull();
  });

  test("supports all low-level helpers", async () => {
    const { client, requests } = mockClient({});
    await client.get("/a");
    await client.post("/a", {});
    await client.put("/a", {});
    await client.patch("/a", {});
    await client.delete("/a");
    await client.request({ path: "/a" });
    expect(requests.map((r) => r.method)).toEqual(["GET", "POST", "PUT", "PATCH", "DELETE", "GET"]);
  });

  test("returns undefined for empty responses", async () => {
    const { client } = mockClient([undefined, new Response("", { status: 200 })]);
    expect(await client.delete("/ssh_keys/1")).toBeUndefined();
    expect(await client.delete("/ssh_keys/1")).toBeUndefined();
  });

  test("rejects invalid JSON", async () => {
    const { client } = mockClient(new Response("<html>", { status: 200 }));
    await expect(client.get("/servers")).rejects.toMatchObject({ code: "INVALID_RESPONSE" });
  });

  test("exposes response metadata and rate limits", async () => {
    const { client } = mockClient(
      json({ servers: [] }, 200, {
        "x-correlation-id": "abc123",
        "ratelimit-limit": "3600",
        "ratelimit-remaining": "3599",
        "ratelimit-reset": "1767225600",
      }),
    );
    expect(client.rateLimit).toBeUndefined();

    const result = await client.requestWithResponse<{ servers: unknown[] }>({ path: "/servers" });
    expect(result.data).toEqual({ servers: [] });
    expect(result.status).toBe(200);
    expect(result.requestId).toBe("abc123");
    expect(result.rateLimit).toEqual({
      limit: 3600,
      remaining: 3599,
      reset: new Date(1767225600 * 1000),
    });
    expect(client.rateLimit?.remaining).toBe(3599);
  });
});

describe("hooks and debugging", () => {
  test("calls hooks in order", async () => {
    const events: string[] = [];
    const { client } = mockClient(
      { ok: true },
      {
        hooks: {
          onRequest: (ctx) => {
            events.push(`request ${ctx.method} ${ctx.path} #${ctx.attempt}`);
            ctx.headers.set("x-trace", "1");
          },
          onResponse: (ctx) => {
            events.push(`response ${ctx.response.status} ${JSON.stringify(ctx.data)}`);
            expect(ctx.request.headers.get("x-trace")).toBe("1");
            expect(ctx.durationMs).toBeGreaterThanOrEqual(0);
          },
        },
      },
    );
    await client.get("/servers");
    expect(events).toEqual(["request GET /servers #0", 'response 200 {"ok":true}']);
  });

  test("hook headers are sent", async () => {
    const { client, last } = mockClient(
      {},
      { hooks: { onRequest: (ctx) => ctx.headers.set("x-trace", "abc") } },
    );
    await client.get("/servers");
    expect(last().headers.get("x-trace")).toBe("abc");
  });

  test("errors thrown by onResponse are not swallowed or retried", async () => {
    const { client, requests } = mockClient(
      {},
      {
        hooks: {
          onResponse: () => {
            throw new Error("hook failed");
          },
        },
      },
    );
    await expect(client.get("/servers")).rejects.toThrow("hook failed");
    await Promise.resolve();
    expect(requests).toHaveLength(1);
  });

  test("debug logger never sees the token", async () => {
    const lines: string[] = [];
    const { client } = mockClient(
      {},
      { debug: (message, data) => lines.push(`${message} ${JSON.stringify(data ?? {})}`) },
    );
    await client.get("/servers", { query: { name: "web" } });
    expect(lines.some((line) => line.includes("→ GET /v1/servers?name=web"))).toBe(true);
    expect(lines.some((line) => line.includes("← 200 GET /v1/servers"))).toBe(true);
    expect(lines.join("\n")).not.toContain("test-token");
  });
});
