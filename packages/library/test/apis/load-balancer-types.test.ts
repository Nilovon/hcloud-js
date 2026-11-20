import { describe, expect, test } from "bun:test";
import { LoadBalancerTypesClient } from "../../src/apis/load-balancer-types/index";
import { loadBalancerTypeSchema } from "../../src/apis/load-balancer-types/schemas";
import { HCloudValidationError } from "../../src/core/errors";
import { metaFixture, mockClient } from "../helpers";

const lb11 = {
  id: 1,
  name: "lb11",
  description: "LB11",
  max_connections: 10000,
  max_services: 5,
  max_targets: 25,
  max_assigned_certificates: 10,
  deprecation: {
    announced: "2023-06-01T00:00:00Z",
    unavailable_after: "2023-09-01T00:00:00Z",
  },
  prices: [
    {
      location: "fsn1",
      price_hourly: { net: "0.0120", gross: "0.0120" },
      price_monthly: { net: "7.4900", gross: "7.4900" },
      price_per_tb_traffic: { net: "1.0000", gross: "1.0000" },
      included_traffic: 21990232555520,
    },
  ],
};

const lb21 = {
  id: 2,
  name: "lb21",
  description: "LB21",
  max_connections: 20000,
  max_services: 15,
  max_targets: 75,
  max_assigned_certificates: 25,
  deprecation: null,
  prices: [
    {
      location: "fsn1",
      price_hourly: { net: "0.0344", gross: "0.0344" },
      price_monthly: { net: "21.4900", gross: "21.4900" },
      price_per_tb_traffic: { net: "1.0000", gross: "1.0000" },
      included_traffic: 21990232555520,
    },
  ],
};

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, loadBalancerTypes: new LoadBalancerTypesClient(mock.client) };
}

describe("LoadBalancerTypesClient", () => {
  test("list sends filters as query parameters", async () => {
    const { loadBalancerTypes, last } = setup({
      load_balancer_types: [lb11, lb21],
      meta: metaFixture({ total_entries: 2 }),
    });

    const result = await loadBalancerTypes.list({ name: "lb11", page: 2, per_page: 25 });

    expect(result.load_balancer_types).toEqual([lb11, lb21]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/load_balancer_types");
    expect(last().query).toEqual({ name: ["lb11"], page: ["2"], per_page: ["25"] });
  });

  test("list without parameters sends no query", async () => {
    const { loadBalancerTypes, last } = setup({ load_balancer_types: [lb11] });
    await loadBalancerTypes.list();
    expect(last().query).toEqual({});
  });

  test("get", async () => {
    const { loadBalancerTypes, last } = setup({ load_balancer_type: lb11 });
    const result = await loadBalancerTypes.get(1);
    expect(result.load_balancer_type.deprecation?.unavailable_after).toBe("2023-09-01T00:00:00Z");
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/load_balancer_types/1");
  });

  test("getByName returns the exact match or undefined", async () => {
    const { loadBalancerTypes, last } = setup(
      { load_balancer_types: [lb21] },
      { load_balancer_types: [] },
    );
    expect(await loadBalancerTypes.getByName("lb21")).toEqual(lb21);
    expect(last().query).toEqual({ name: ["lb21"] });

    expect(await loadBalancerTypes.getByName("missing")).toBeUndefined();
    expect(last().query).toEqual({ name: ["missing"] });
  });

  test("listAll follows pagination", async () => {
    const { loadBalancerTypes, requests } = setup(
      {
        load_balancer_types: [lb11],
        meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }),
      },
      { load_balancer_types: [lb21], meta: metaFixture({ page: 2, previous_page: 1 }) },
    );
    const all = await loadBalancerTypes.listAll();
    expect(all.map((type) => type.name)).toEqual(["lb11", "lb21"]);
    expect(requests.map((request) => request.query.page)).toEqual([["1"], ["2"]]);
  });

  test("accepts the legacy deprecated timestamp and types without deprecation info", () => {
    const { deprecation: _deprecation, ...withoutDeprecation } = lb11;
    expect(loadBalancerTypeSchema.safeParse(withoutDeprecation).success).toBe(true);
    expect(
      loadBalancerTypeSchema.safeParse({
        ...withoutDeprecation,
        deprecated: "2016-01-30T23:50:00+00:00",
      }).success,
    ).toBe(true);
  });

  test("rejects responses that do not match the schema", async () => {
    const { loadBalancerTypes } = setup({ load_balancer_type: { ...lb11, max_connections: "many" } });
    await expect(loadBalancerTypes.get(1)).rejects.toBeInstanceOf(HCloudValidationError);
  });
});
