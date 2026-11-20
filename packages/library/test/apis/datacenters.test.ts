import { describe, expect, test } from "bun:test";
import { DatacentersClient } from "../../src/apis/datacenters/index";
import type { Datacenter } from "../../src/apis/datacenters/types";
import { HCloudValidationError } from "../../src/core/errors";
import { metaFixture, mockClient } from "../helpers";

const fsn1Dc8: Datacenter = {
  id: 1,
  name: "fsn1-dc8",
  description: "Falkenstein 1 DC 8",
  location: {
    id: 1,
    name: "fsn1",
    description: "Falkenstein DC Park 1",
    country: "DE",
    city: "Falkenstein",
    latitude: 50.47612,
    longitude: 12.370071,
    network_zone: "eu-central",
  },
  server_types: {
    supported: [1, 2, 3],
    available: [1, 2, 3],
    available_for_migration: [1, 2, 3],
  },
};

const nbg1Dc3: Datacenter = {
  id: 2,
  name: "nbg1-dc3",
  description: "Nuremberg 1 DC 3",
  location: {
    id: 2,
    name: "nbg1",
    description: "Nuremberg DC Park 1",
    country: "DE",
    city: "Nuremberg",
    latitude: 49.452102,
    longitude: 11.076665,
    network_zone: "eu-central",
  },
  server_types: {
    supported: [1, 2, 3],
    available: [1, 2, 3],
    available_for_migration: [1, 2, 3],
  },
};

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, datacenters: new DatacentersClient(mock.client) };
}

describe("DatacentersClient", () => {
  test("list sends filters as query parameters", async () => {
    const { datacenters, last } = setup({
      datacenters: [fsn1Dc8, nbg1Dc3],
      recommendation: 1,
      meta: metaFixture(),
    });

    const result = await datacenters.list({
      name: "fsn1-dc8",
      sort: "name:desc",
      page: 1,
      per_page: 10,
    });

    expect(result.datacenters).toEqual([fsn1Dc8, nbg1Dc3]);
    expect(result.recommendation).toBe(1);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/datacenters");
    expect(last().query).toEqual({
      name: ["fsn1-dc8"],
      sort: ["name:desc"],
      page: ["1"],
      per_page: ["10"],
    });
  });

  test("get", async () => {
    const { datacenters, last } = setup({ datacenter: fsn1Dc8 });
    const result = await datacenters.get(1);
    expect(result.datacenter.location.name).toBe("fsn1");
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/datacenters/1");
  });

  test("accepts datacenters without the deprecated server_types", async () => {
    const { server_types: _removed, ...withoutServerTypes } = fsn1Dc8;
    const { datacenters } = setup({ datacenter: withoutServerTypes });
    const result = await datacenters.get(1);
    expect(result.datacenter.server_types).toBeUndefined();
  });

  test("getByName returns the exact match or undefined", async () => {
    const { datacenters, last } = setup(
      { datacenters: [fsn1Dc8], recommendation: 1 },
      { datacenters: [] },
    );
    expect(await datacenters.getByName("fsn1-dc8")).toEqual(fsn1Dc8);
    expect(last().query).toEqual({ name: ["fsn1-dc8"] });

    expect(await datacenters.getByName("missing")).toBeUndefined();
  });

  test("listAll follows pagination", async () => {
    const { datacenters, requests } = setup(
      {
        datacenters: [fsn1Dc8],
        recommendation: 1,
        meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }),
      },
      {
        datacenters: [nbg1Dc3],
        recommendation: 1,
        meta: metaFixture({ page: 2, previous_page: 1 }),
      },
    );
    const all = await datacenters.listAll();
    expect(all.map((datacenter) => datacenter.id)).toEqual([1, 2]);
    expect(requests.map((request) => request.query.page)).toEqual([["1"], ["2"]]);
  });

  test("rejects responses that do not match the schema", async () => {
    const { datacenters } = setup({ datacenter: { ...fsn1Dc8, location: null } });
    expect(datacenters.get(1)).rejects.toBeInstanceOf(HCloudValidationError);
  });
});
