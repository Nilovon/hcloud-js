import { describe, expect, test } from "bun:test";
import { z } from "zod";
import { SSHKeysClient } from "../../src/apis/ssh-keys/index";
import { HCloudValidationError } from "../../src/core/errors";
import { getAllPages, paginate } from "../../src/core/pagination";
import { path } from "../../src/core/resource";
import { safeValidate, validate } from "../../src/core/validation";
import { metaFixture, mockClient, type MockReply } from "../helpers";

const key = (id: number) => ({
  id,
  name: `key-${id}`,
  fingerprint: "b7:2f:30:a0:2f:6c:58:6c:21:04:58:61:ba:06:3b:2f",
  public_key: "ssh-ed25519 AAAA",
  labels: {},
  created: "2026-01-01T00:00:00+00:00",
});

/** Three pages with two keys each (last page has one). */
const pages: MockReply = (request) => {
  const page = Number(request.query.page?.[0] ?? 1);
  const perPage = Number(request.query.per_page?.[0] ?? 50);
  const all = [1, 2, 3, 4, 5].map(key);
  const start = (page - 1) * perPage;
  const lastPage = Math.ceil(all.length / perPage);
  return {
    ssh_keys: all.slice(start, start + perPage),
    meta: metaFixture({
      page,
      per_page: perPage,
      previous_page: page > 1 ? page - 1 : null,
      next_page: page < lastPage ? page + 1 : null,
      last_page: lastPage,
      total_entries: all.length,
    }),
  };
};

describe("path", () => {
  test("encodes interpolated values", () => {
    expect(path`/servers/${42}`).toBe("/servers/42");
    expect(path`/zones/${"example.com"}/rrsets/${"@"}/${"A"}`).toBe(
      "/zones/example.com/rrsets/%40/A",
    );
    expect(path`/zones/${"a/b?c"}`).toBe("/zones/a%2Fb%3Fc");
  });
});

describe("pagination helpers", () => {
  test("iterate yields every item of every page", async () => {
    const mock = mockClient(pages);
    const ids: number[] = [];
    for await (const item of new SSHKeysClient(mock.client).iterate({ per_page: 2 })) {
      ids.push(item.id);
    }
    expect(ids).toEqual([1, 2, 3, 4, 5]);
    expect(mock.requests.map((r) => r.query.page?.[0])).toEqual(["1", "2", "3"]);
  });

  test("iterate can stop early without fetching more pages", async () => {
    const mock = mockClient(pages);
    for await (const item of new SSHKeysClient(mock.client).iterate({ per_page: 2 })) {
      if (item.id === 2) break;
    }
    expect(mock.requests).toHaveLength(1);
  });

  test("iteratePages yields list responses", async () => {
    const mock = mockClient(pages);
    const sizes: number[] = [];
    for await (const page of new SSHKeysClient(mock.client).iteratePages({ per_page: 2 })) {
      sizes.push(page.ssh_keys.length);
    }
    expect(sizes).toEqual([2, 2, 1]);
  });

  test("listAll keeps filters, defaults to 50 per page and honors a start page", async () => {
    const mock = mockClient(pages);
    const client = new SSHKeysClient(mock.client);

    expect(await client.listAll({ label_selector: "env=prod" })).toHaveLength(5);
    expect(mock.last().query).toEqual({
      label_selector: ["env=prod"],
      page: ["1"],
      per_page: ["50"],
    });

    const fromSecond = await client.listAll({ per_page: 2, page: 2 });
    expect(fromSecond.map((k) => k.id)).toEqual([3, 4, 5]);
  });

  test("first requests a single item", async () => {
    const mock = mockClient(pages);
    const client = new SSHKeysClient(mock.client);
    expect((await client.first({ sort: "id:asc" }))?.id).toBe(1);
    expect(mock.last().query).toEqual({ sort: ["id:asc"], per_page: ["1"] });

    const empty = mockClient({ ssh_keys: [] });
    expect(await new SSHKeysClient(empty.client).first()).toBeUndefined();
  });

  test("request options are forwarded to every page", async () => {
    const mock = mockClient(pages);
    await new SSHKeysClient(mock.client).listAll({ per_page: 2 }, { headers: { "x-test": "1" } });
    expect(mock.requests.every((r) => r.headers.get("x-test") === "1")).toBe(true);
  });

  test("paginate and getAllPages work with any list function", async () => {
    const mock = mockClient(pages);
    const client = new SSHKeysClient(mock.client);

    const sizes: number[] = [];
    for await (const items of paginate((params) => client.list(params), "ssh_keys", {
      perPage: 2,
    })) {
      sizes.push(items.length);
    }
    expect(sizes).toEqual([2, 2, 1]);

    const limited = await getAllPages((params) => client.list(params), "ssh_keys", {
      perPage: 2,
      maxPages: 2,
    });
    expect(limited.map((k) => k.id)).toEqual([1, 2, 3, 4]);

    const all = await getAllPages((params) => client.list(params), "ssh_keys");
    expect(all[0]?.fingerprint).toBeString();
    expect(all).toHaveLength(5);
  });
});

describe("validation", () => {
  test("request validation rejects invalid parameters before sending", async () => {
    const mock = mockClient({ ssh_key: key(1) });
    const error = await new SSHKeysClient(mock.client)
      .create({ name: "", public_key: 5 as never })
      .catch((e) => e);

    expect(error).toBeInstanceOf(HCloudValidationError);
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.target).toBe("request");
    expect(error.message).toStartWith("POST /ssh_keys request validation failed: name: ");
    expect(error.issues.map((issue: { path: unknown[] }) => issue.path)).toEqual([
      ["name"],
      ["public_key"],
    ]);
    expect(mock.requests).toHaveLength(0);
  });

  test("request validation can be disabled", async () => {
    const mock = mockClient({ ssh_key: key(1) }, { requestValidation: false });
    await new SSHKeysClient(mock.client).create({ name: "", public_key: "x" });
    expect(mock.last().body).toEqual({ name: "", public_key: "x" });
  });

  test('responseValidation "throw" rejects unexpected responses', async () => {
    const mock = mockClient({ ssh_key: { id: "not-a-number" } }, { responseValidation: "throw" });
    const error = await new SSHKeysClient(mock.client).get(1).catch((e) => e);
    expect(error).toBeInstanceOf(HCloudValidationError);
    expect(error.target).toBe("response");
    expect(error.message).toStartWith("GET /ssh_keys/1 response validation failed: ssh_key.id: ");
  });

  test('responseValidation "warn" returns the response and reports a warning', async () => {
    const warnings: string[] = [];
    const broken = { ssh_key: { ...key(1), fingerprint: null } };
    const mock = mockClient(broken, {
      responseValidation: "warn",
      onWarning: (message) => warnings.push(message),
    });
    const result = await new SSHKeysClient(mock.client).get(1);
    expect(result).toEqual(broken as never);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain(
      "GET /ssh_keys/1 response validation failed: ssh_key.fingerprint",
    );
  });

  test("the same schema mismatch is only reported once per client", async () => {
    const warnings: string[] = [];
    const mock = mockClient(
      (request) => ({ ssh_key: { ...key(1), fingerprint: null }, path: request.path }),
      {
        responseValidation: "warn",
        onWarning: (message) => warnings.push(message),
      },
    );
    const client = new SSHKeysClient(mock.client);
    await client.get(1);
    await client.get(2);
    await client.get(1);
    expect(warnings).toHaveLength(1);

    mock.reply({ ssh_keys: [{ id: "x" }] });
    await client.list();
    expect(warnings).toHaveLength(2);
  });

  test('responseValidation "off" skips validation', async () => {
    const warnings: string[] = [];
    const mock = mockClient(
      { anything: true },
      { responseValidation: "off", onWarning: (message) => warnings.push(message) },
    );
    expect(await new SSHKeysClient(mock.client).get(1)).toEqual({ anything: true } as never);
    expect(warnings).toHaveLength(0);
  });

  test("unknown response fields are preserved", async () => {
    const mock = mockClient({ ssh_key: { ...key(1), brand_new_field: "hello" } });
    const { ssh_key } = await new SSHKeysClient(mock.client).get(1);
    expect((ssh_key as Record<string, unknown>).brand_new_field).toBe("hello");
  });

  test("validate and safeValidate", () => {
    const schema = z.object({ name: z.string() });
    expect(validate(schema, { name: "a" }, { context: "Thing" })).toEqual({ name: "a" });
    expect(() => validate(schema, { name: 1 }, { context: "Thing" })).toThrow(
      /^Thing validation failed: name: /,
    );
    try {
      validate(schema, { name: 1 }, { context: "Thing", detailed: false });
      throw new Error("expected validate to throw");
    } catch (error) {
      expect((error as Error).message).toStartWith("Thing validation failed: ");
      expect((error as Error).message).not.toContain("name: ");
    }
    expect(safeValidate(schema, { name: "a" })).toEqual({ success: true, data: { name: "a" } });
    expect(safeValidate(schema, {}).success).toBe(false);
  });
});
