import { describe, expect, test } from "bun:test";
import { StorageBoxTypesClient } from "../../src/apis/storage-box-types/index";
import { HCloudValidationError } from "../../src/core/errors";
import { metaFixture, mockClient } from "../helpers";

const storageBoxType1 = {
  id: 42,
  name: "bx11",
  description: "BX11",
  snapshot_limit: 10,
  automatic_snapshot_limit: 10,
  subaccounts_limit: 100,
  size: 1099511627776,
  prices: [
    {
      location: "fsn1",
      price_hourly: { gross: "0.0051", net: "0.0051" },
      price_monthly: { gross: "3.2000", net: "3.2000" },
      setup_fee: { gross: "0.0000", net: "0.0000" },
    },
  ],
  deprecation: {
    unavailable_after: "2023-09-01T00:00:00+00:00",
    announced: "2023-06-01T00:00:00+00:00",
  },
};

const storageBoxType2 = {
  id: 43,
  name: "bx21",
  description: "BX21",
  snapshot_limit: 20,
  automatic_snapshot_limit: 20,
  subaccounts_limit: 100,
  size: 5497558138880,
  prices: [
    {
      location: "fsn1",
      price_hourly: { net: "1.0000", gross: "1.1900" },
      price_monthly: { net: "1.0000", gross: "1.1900" },
      setup_fee: { net: "1.0000", gross: "1.1900" },
    },
  ],
  deprecation: null,
};

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, storageBoxTypes: new StorageBoxTypesClient(mock.client) };
}

describe("StorageBoxTypesClient", () => {
  test("list sends filters to the Hetzner API", async () => {
    const { storageBoxTypes, last } = setup({
      storage_box_types: [storageBoxType1, storageBoxType2],
      meta: metaFixture({ total_entries: 2 }),
    });

    const result = await storageBoxTypes.list({ name: "bx11", page: 2, per_page: 10 });

    expect(result.storage_box_types).toEqual([storageBoxType1, storageBoxType2]);
    expect(last().method).toBe("GET");
    expect(last().host).toBe("api.hetzner.com");
    expect(last().path).toBe("/storage_box_types");
    expect(last().query).toEqual({ name: ["bx11"], page: ["2"], per_page: ["10"] });
  });

  test("list accepts a response without meta", async () => {
    const { storageBoxTypes, last } = setup({ storage_box_types: [storageBoxType2] });
    const { storage_box_types } = await storageBoxTypes.list();
    expect(storage_box_types[0]?.deprecation).toBeNull();
    expect(last().query).toEqual({});
  });

  test("get", async () => {
    const { storageBoxTypes, last } = setup({ storage_box_type: storageBoxType1 });
    const result = await storageBoxTypes.get(42);
    expect(result.storage_box_type.name).toBe("bx11");
    expect(result.storage_box_type.prices[0]?.price_monthly.gross).toBe("3.2000");
    expect(last().method).toBe("GET");
    expect(last().host).toBe("api.hetzner.com");
    expect(last().path).toBe("/storage_box_types/42");
  });

  test("getByName returns the exact match or undefined", async () => {
    const { storageBoxTypes, last } = setup(
      { storage_box_types: [storageBoxType1] },
      { storage_box_types: [] },
    );
    expect(await storageBoxTypes.getByName("bx11")).toEqual(storageBoxType1);
    expect(last().path).toBe("/storage_box_types");
    expect(last().query).toEqual({ name: ["bx11"] });

    expect(await storageBoxTypes.getByName("missing")).toBeUndefined();
  });

  test("first requests a single item", async () => {
    const { storageBoxTypes, last } = setup({ storage_box_types: [storageBoxType1] });
    expect(await storageBoxTypes.first()).toEqual(storageBoxType1);
    expect(last().query).toEqual({ per_page: ["1"] });
  });

  test("listAll follows pagination", async () => {
    const { storageBoxTypes, requests } = setup(
      {
        storage_box_types: [storageBoxType1],
        meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }),
      },
      {
        storage_box_types: [storageBoxType2],
        meta: metaFixture({ page: 2, previous_page: 1, last_page: 2, total_entries: 2 }),
      },
    );
    const all = await storageBoxTypes.listAll();
    expect(all.map((type) => type.name)).toEqual(["bx11", "bx21"]);
    expect(requests.map((request) => request.query.page)).toEqual([["1"], ["2"]]);
    expect(requests.every((request) => request.host === "api.hetzner.com")).toBe(true);
  });

  test("rejects responses that do not match the schema", async () => {
    const { storageBoxTypes } = setup({ storage_box_type: { ...storageBoxType1, size: "big" } });
    expect(storageBoxTypes.get(42)).rejects.toBeInstanceOf(HCloudValidationError);
  });
});
