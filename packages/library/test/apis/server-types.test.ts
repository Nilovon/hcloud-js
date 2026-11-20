import { describe, expect, test } from "bun:test";
import { ServerTypesClient } from "../../src/apis/server-types/index";
import type { ServerType } from "../../src/apis/server-types/types";
import { HCloudValidationError } from "../../src/core/errors";
import { metaFixture, mockClient } from "../helpers";

const cx11: ServerType = {
  id: 1,
  name: "cx11",
  description: "CX11",
  category: "Shared vCPU",
  cores: 1,
  memory: 1,
  disk: 25,
  prices: [
    {
      location: "fsn1",
      price_hourly: { net: "1.0000000000", gross: "1.1900000000000000" },
      price_monthly: { net: "1.0000000000", gross: "1.1900000000000000" },
    },
  ],
  storage_type: "local",
  cpu_type: "shared",
  architecture: "x86",
  included_traffic: 21990232555520,
  deprecated: true,
  deprecation: {
    announced: "2023-06-01T00:00:00Z",
    unavailable_after: "2023-09-01T00:00:00Z",
  },
  locations: [
    { id: 1, name: "nbg1", deprecation: null, available: true, recommended: false },
    {
      id: 2,
      name: "fsn1",
      deprecation: {
        announced: "2023-06-01T00:00:00Z",
        unavailable_after: "2023-09-01T00:00:00Z",
      },
      available: true,
      recommended: true,
    },
  ],
};

// Shape of older responses: no `category` and no `locations`.
const cx21: ServerType = {
  id: 2,
  name: "cx21",
  description: "CX21",
  cores: 2,
  memory: 4.0,
  disk: 40,
  prices: [
    {
      location: "fsn1",
      price_hourly: { net: "0.0080000000", gross: "0.0095200000000000" },
      price_monthly: { net: "4.9000000000", gross: "5.8310000000000000" },
    },
    {
      location: "nbg1",
      price_hourly: { net: "0.0080000000", gross: "0.0095200000000000" },
      price_monthly: { net: "4.9000000000", gross: "5.8310000000000000" },
    },
  ],
  storage_type: "local",
  cpu_type: "shared",
  architecture: "x86",
  included_traffic: 21990232555520,
  deprecated: false,
  deprecation: null,
};

// Shape of current responses: the deprecated top-level fields are gone,
// traffic information is part of the prices.
const cax11: ServerType = {
  id: 45,
  name: "cax11",
  description: "CAX11",
  category: "Shared vCPU",
  cores: 2,
  memory: 4,
  disk: 40,
  prices: [
    {
      location: "fsn1",
      price_hourly: { net: "0.0053000000", gross: "0.0063070000000000" },
      price_monthly: { net: "3.2900000000", gross: "3.9151000000000000" },
      included_traffic: 21990232555520,
      price_per_tb_traffic: { net: "1.0000000000", gross: "1.1900000000000000" },
    },
  ],
  storage_type: "network",
  cpu_type: "dedicated",
  architecture: "arm",
  locations: [{ id: 2, name: "fsn1", deprecation: null, available: false, recommended: false }],
};

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, serverTypes: new ServerTypesClient(mock.client) };
}

describe("ServerTypesClient", () => {
  test("list sends filters as query parameters", async () => {
    const { serverTypes, last } = setup({
      server_types: [cx11, cx21, cax11],
      meta: metaFixture(),
    });

    const result = await serverTypes.list({ name: "cx11", page: 2, per_page: 25 });

    expect(result.server_types).toEqual([cx11, cx21, cax11]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/server_types");
    expect(last().query).toEqual({ name: ["cx11"], page: ["2"], per_page: ["25"] });
  });

  test("get returns per-location information", async () => {
    const { serverTypes, last } = setup({ server_type: cx11 });
    const result = await serverTypes.get(1);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/server_types/1");
    expect(result.server_type.category).toBe("Shared vCPU");
    expect(result.server_type.locations?.map((location) => location.name)).toEqual([
      "nbg1",
      "fsn1",
    ]);
    expect(result.server_type.locations?.[1]?.deprecation?.unavailable_after).toBe(
      "2023-09-01T00:00:00Z",
    );
  });

  test("accepts server types without the deprecated top-level fields", async () => {
    const { serverTypes } = setup({ server_type: cax11 });
    const { server_type } = await serverTypes.get(45);
    expect(server_type.deprecated).toBeUndefined();
    expect(server_type.deprecation).toBeUndefined();
    expect(server_type.included_traffic).toBeUndefined();
    expect(server_type.prices[0]?.included_traffic).toBe(21990232555520);
  });

  test("getByName returns the exact match or undefined", async () => {
    const { serverTypes, last } = setup({ server_types: [cx11] }, { server_types: [] });
    expect(await serverTypes.getByName("cx11")).toEqual(cx11);
    expect(last().query).toEqual({ name: ["cx11"] });

    expect(await serverTypes.getByName("missing")).toBeUndefined();
  });

  test("listAll follows pagination", async () => {
    const { serverTypes, requests } = setup(
      { server_types: [cx11], meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }) },
      { server_types: [cx21], meta: metaFixture({ page: 2, previous_page: 1 }) },
    );
    const all = await serverTypes.listAll();
    expect(all.map((serverType) => serverType.name)).toEqual(["cx11", "cx21"]);
    expect(requests.map((request) => request.query.page)).toEqual([["1"], ["2"]]);
  });

  test("rejects responses that do not match the schema", async () => {
    const { serverTypes } = setup({ server_type: { ...cx11, prices: null } });
    expect(serverTypes.get(1)).rejects.toBeInstanceOf(HCloudValidationError);
  });
});
