import { describe, expect, test } from "bun:test";
import { PricingClient } from "../../src/apis/pricing/index";
import { HCloudValidationError } from "../../src/core/errors";
import { mockClient } from "../helpers";

const price = { net: "1.0000000000", gross: "1.1900000000000000" };

const pricing = {
  currency: "EUR",
  vat_rate: "19.000000",
  image: { price_per_gb_month: price },
  volume: { price_per_gb_month: price },
  server_backup: { percentage: "20.0000000000" },
  primary_ips: [
    {
      type: "ipv4",
      prices: [{ location: "fsn1", price_hourly: price, price_monthly: price }],
    },
  ],
  floating_ips: [{ type: "ipv4", prices: [{ location: "fsn1", price_monthly: price }] }],
  server_types: [
    {
      id: 104,
      name: "cpx22",
      prices: [
        {
          location: "fsn1",
          price_hourly: price,
          price_monthly: price,
          included_traffic: 21990232555520,
          price_per_tb_traffic: price,
        },
      ],
    },
  ],
  load_balancer_types: [
    {
      id: 1,
      name: "lb11",
      prices: [
        {
          location: "fsn1",
          price_hourly: price,
          price_monthly: price,
          included_traffic: 1099511627776,
          price_per_tb_traffic: price,
        },
      ],
    },
  ],
};

// Fields of older responses, deprecated by Hetzner.
const legacyPricing = {
  ...pricing,
  floating_ip: { price_monthly: price },
  floating_ip_price_monthly: price,
  traffic: { price_per_tb: price },
  primary_ips: [{ price_monthly: price }],
};

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, pricing: new PricingClient(mock.client) };
}

describe("PricingClient", () => {
  test("getAll", async () => {
    const { pricing: client, last } = setup({ pricing });
    const result = await client.getAll();
    expect(result.pricing).toEqual(pricing);
    expect(result.pricing.server_types?.[0]?.prices[0]?.price_monthly?.gross).toBe(
      "1.1900000000000000",
    );
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/pricing");
    expect(last().query).toEqual({});
  });

  test("getAll accepts deprecated and missing fields", async () => {
    const { pricing: client } = setup(
      { pricing: legacyPricing },
      { pricing: { currency: "EUR", vat_rate: "19.000000" } },
    );
    expect((await client.getAll()).pricing.traffic?.price_per_tb).toEqual(price);

    expect((await client.getAll()).pricing.server_types).toBeUndefined();
  });

  test("getAll forwards request options", async () => {
    const { pricing: client, last } = setup({ pricing });
    await client.getAll({ headers: { "x-test": "1" } });
    expect(last().headers.get("x-test")).toBe("1");
  });

  test("rejects responses that do not match the schema", async () => {
    const { pricing: client } = setup({ pricing: { ...pricing, currency: 978 } });
    expect(client.getAll()).rejects.toBeInstanceOf(HCloudValidationError);
  });
});
