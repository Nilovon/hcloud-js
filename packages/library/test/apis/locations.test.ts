import { describe, expect, test } from "bun:test";
import type { Datacenter } from "../../src/apis/datacenters/types";
import { LocationsClient } from "../../src/apis/locations/index";
import type { Location } from "../../src/apis/locations/types";
import { HCloudValidationError } from "../../src/core/errors";
import { metaFixture, mockClient } from "../helpers";

const fsn1: Location = {
  id: 1,
  name: "fsn1",
  description: "Falkenstein DC Park 1",
  country: "DE",
  city: "Falkenstein",
  latitude: 50.47612,
  longitude: 12.370071,
  network_zone: "eu-central",
};

const nbg1: Location = {
  id: 2,
  name: "nbg1",
  description: "Nuremberg DC Park 1",
  country: "DE",
  city: "Nuremberg",
  latitude: 49.452102,
  longitude: 11.076665,
  network_zone: "eu-central",
};

const datacenter: Datacenter = {
  id: 1,
  name: "fsn1-dc8",
  description: "Falkenstein 1 DC 8",
  location: fsn1,
  server_types: {
    supported: [1, 2, 3],
    available: [1, 2, 3],
    available_for_migration: [1, 2, 3],
  },
};

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, locations: new LocationsClient(mock.client) };
}

describe("LocationsClient", () => {
  test("list sends filters as query parameters", async () => {
    const { locations, last } = setup({ locations: [fsn1, nbg1], meta: metaFixture() });

    const result = await locations.list({
      name: "fsn1",
      sort: ["name:asc", "id:desc"],
      page: 2,
      per_page: 25,
    });

    expect(result.locations).toEqual([fsn1, nbg1]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/locations");
    expect(last().query).toEqual({
      name: ["fsn1"],
      sort: ["name:asc", "id:desc"],
      page: ["2"],
      per_page: ["25"],
    });
  });

  test("list without parameters sends no query", async () => {
    const { locations, last } = setup({ locations: [fsn1] });
    await locations.list();
    expect(last().query).toEqual({});
  });

  test("get", async () => {
    const { locations, last } = setup({ location: fsn1 });
    const result = await locations.get(1);
    expect(result.location.network_zone).toBe("eu-central");
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/locations/1");
  });

  test("getByName returns the exact match or undefined", async () => {
    const { locations, last } = setup({ locations: [fsn1] }, { locations: [] });
    expect(await locations.getByName("fsn1")).toEqual(fsn1);
    expect(last().path).toBe("/locations");
    expect(last().query).toEqual({ name: ["fsn1"] });

    expect(await locations.getByName("missing")).toBeUndefined();
  });

  test("listAll follows pagination", async () => {
    const { locations, requests } = setup(
      { locations: [fsn1], meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }) },
      { locations: [nbg1], meta: metaFixture({ page: 2, previous_page: 1 }) },
    );
    const all = await locations.listAll();
    expect(all.map((location) => location.name)).toEqual(["fsn1", "nbg1"]);
    expect(requests.map((request) => request.query.page)).toEqual([["1"], ["2"]]);
  });

  test("rejects responses that do not match the schema", async () => {
    const { locations } = setup({ location: { ...fsn1, id: "1" } });
    expect(locations.get(1)).rejects.toBeInstanceOf(HCloudValidationError);
  });

  test("listDataCenters delegates to the datacenters API", async () => {
    const { locations, last } = setup({ datacenters: [datacenter], recommendation: 1 });
    const result = await locations.listDataCenters({ name: "fsn1-dc8" });
    expect(result.datacenters).toEqual([datacenter]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/datacenters");
    expect(last().query).toEqual({ name: ["fsn1-dc8"] });
  });

  test("getDataCenter delegates to the datacenters API", async () => {
    const { locations, last } = setup({ datacenter });
    const result = await locations.getDataCenter(1);
    expect(result.datacenter.name).toBe("fsn1-dc8");
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/datacenters/1");
  });
});
