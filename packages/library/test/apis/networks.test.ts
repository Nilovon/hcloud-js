import { describe, expect, test } from "bun:test";
import { NetworksClient } from "../../src/apis/networks/index";
import type { Network, NetworkMember } from "../../src/apis/networks/types";
import { HCloudValidationError } from "../../src/core/errors";
import { metaFixture, mockClient } from "../helpers";

const network: Network = {
  id: 1,
  name: "mynet",
  created: "2016-01-30T23:50:11+00:00",
  ip_range: "10.0.0.0/16",
  subnets: [
    {
      type: "cloud",
      ip_range: "10.0.1.0/24",
      network_zone: "eu-central",
      gateway: "10.0.0.1",
    },
    {
      type: "vswitch",
      ip_range: "10.0.3.0/24",
      network_zone: "eu-central",
      gateway: "10.0.3.1",
      vswitch_id: 1000,
    },
  ],
  routes: [{ destination: "10.100.1.0/24", gateway: "10.0.1.1" }],
  expose_routes_to_vswitch: false,
  servers: [42],
  load_balancers: [7],
  protection: { delete: false },
  labels: {},
};

const otherNetwork: Network = {
  id: 2,
  name: "myanothernet",
  created: "2016-01-30T23:50:11+00:00",
  ip_range: "12.0.0.0/8",
  subnets: [
    {
      type: "cloud",
      ip_range: "12.0.1.0/24",
      network_zone: "eu-central",
      gateway: "12.0.0.1",
      vswitch_id: null,
    },
  ],
  routes: [{ destination: "12.100.1.0/24", gateway: "12.0.1.1" }],
  expose_routes_to_vswitch: false,
  servers: [45],
  protection: { delete: false },
  labels: {},
};

const member1: NetworkMember = {
  type: "server",
  id: 123,
  ip: "10.0.1.2",
  status: "attaching",
  alias_ips: ["10.0.1.20"],
  subnet: "10.0.1.0/24",
};

const member2: NetworkMember = {
  type: "load_balancer",
  id: 456,
  ip: "10.0.1.3",
  status: "updating",
  alias_ips: [],
  subnet: "10.0.1.0/24",
};

const action = {
  id: 13,
  command: "add_subnet",
  status: "success",
  progress: 100,
  started: "2016-01-30T23:55:00+00:00",
  finished: "2016-01-30T23:56:00+00:00",
  resources: [{ id: 4711, type: "network" }],
  error: { code: "action_failed", message: "Action failed" },
};

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, networks: new NetworksClient(mock.client) };
}

describe("NetworksClient", () => {
  test("list sends filters as query parameters", async () => {
    const { networks, last } = setup({ networks: [network, otherNetwork], meta: metaFixture() });

    const result = await networks.list({
      name: "mynet",
      label_selector: "environment=prod",
      page: 2,
      per_page: 25,
    });

    expect(result.networks).toEqual([network, otherNetwork]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/networks");
    expect(last().query).toEqual({
      name: ["mynet"],
      label_selector: ["environment=prod"],
      page: ["2"],
      per_page: ["25"],
    });
  });

  test("get", async () => {
    const { networks, last } = setup({ network });
    const result = await networks.get(1);
    expect(result.network.subnets[1]?.type).toBe("vswitch");
    expect(result.network.routes[0]).toEqual({ destination: "10.100.1.0/24", gateway: "10.0.1.1" });
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/networks/1");
  });

  test("getByName returns the exact match or undefined", async () => {
    const { networks, last } = setup({ networks: [network] }, { networks: [] });
    expect(await networks.getByName("mynet")).toEqual(network);
    expect(last().path).toBe("/networks");
    expect(last().query).toEqual({ name: ["mynet"] });

    expect(await networks.getByName("missing")).toBeUndefined();
  });

  test("listAll follows pagination", async () => {
    const { networks, requests } = setup(
      { networks: [network], meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }) },
      { networks: [otherNetwork], meta: metaFixture({ page: 2, previous_page: 1 }) },
    );
    const all = await networks.listAll();
    expect(all.map((item) => item.id)).toEqual([1, 2]);
    expect(requests.map((request) => request.query.page)).toEqual([["1"], ["2"]]);
  });

  test("create validates and sends the body", async () => {
    const { networks, last, requests } = setup({ network: { ...network, id: 4711 } });

    const body = {
      name: "mynet",
      ip_range: "10.0.0.0/16",
      subnets: [
        { type: "cloud" as const, ip_range: "10.0.1.0/24", network_zone: "eu-central" },
        {
          type: "vswitch" as const,
          ip_range: "10.0.3.0/24",
          network_zone: "eu-central",
          vswitch_id: 1000,
        },
      ],
      routes: [{ destination: "10.100.1.0/24", gateway: "10.0.1.1" }],
      expose_routes_to_vswitch: true,
      labels: { environment: "prod" },
    };
    const result = await networks.create(body);

    expect(result.network.id).toBe(4711);
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/networks");
    expect(last().body).toEqual(body);

    await expect(networks.create({ name: "", ip_range: "10.0.0.0/16" })).rejects.toBeInstanceOf(
      HCloudValidationError,
    );
    await expect(
      networks.create({
        name: "mynet",
        ip_range: "10.0.0.0/16",
        // @ts-expect-error unknown subnet type
        subnets: [{ type: "dedicated", network_zone: "eu-central" }],
      }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    expect(requests).toHaveLength(1);
  });

  test("update", async () => {
    const { networks, last } = setup({ network: { ...network, name: "new-name" } });
    const result = await networks.update(1, { name: "new-name", expose_routes_to_vswitch: true });
    expect(result.network.name).toBe("new-name");
    expect(last().method).toBe("PUT");
    expect(last().path).toBe("/networks/1");
    expect(last().body).toEqual({ name: "new-name", expose_routes_to_vswitch: true });
  });

  test("delete resolves without a value", async () => {
    const { networks, last } = setup(undefined);
    expect(await networks.delete(1)).toBeUndefined();
    expect(last().method).toBe("DELETE");
    expect(last().path).toBe("/networks/1");
  });

  test("listMembers sends filters as query parameters", async () => {
    const { networks, last } = setup({ members: [member1, member2], meta: metaFixture() });

    const result = await networks.listMembers(1, {
      type: ["server", "load_balancer"],
      status: "ok",
      subnet: ["10.0.1.0/24"],
      sort: ["ip:asc"],
      page: 1,
      per_page: 50,
    });

    expect(result.members).toEqual([member1, member2]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/networks/1/members");
    expect(last().query).toEqual({
      type: ["server", "load_balancer"],
      status: ["ok"],
      subnet: ["10.0.1.0/24"],
      sort: ["ip:asc"],
      page: ["1"],
      per_page: ["50"],
    });
  });

  test("listAllMembers and iterateMembers follow pagination", async () => {
    const pages = [
      { members: [member1], meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }) },
      { members: [member2], meta: metaFixture({ page: 2, previous_page: 1, total_entries: 2 }) },
    ];

    const all = setup(...pages);
    const members = await all.networks.listAllMembers(1, { type: "server" });
    expect(members.map((member) => member.id)).toEqual([123, 456]);
    expect(all.requests.map((request) => request.path)).toEqual([
      "/networks/1/members",
      "/networks/1/members",
    ]);
    expect(all.requests.map((request) => request.query)).toEqual([
      { type: ["server"], page: ["1"], per_page: ["50"] },
      { type: ["server"], page: ["2"], per_page: ["50"] },
    ]);

    const iterated = setup(...pages);
    const ids: number[] = [];
    for await (const member of iterated.networks.iterateMembers(1, { per_page: 1 })) {
      ids.push(member.id);
    }
    expect(ids).toEqual([123, 456]);
    expect(iterated.requests.map((request) => request.query.per_page)).toEqual([["1"], ["1"]]);
  });

  test("listActions", async () => {
    const { networks, last } = setup({ actions: [action], meta: metaFixture() });
    const result = await networks.listActions(1, { status: "running", sort: ["started:desc"] });
    expect(result.actions[0]?.command).toBe("add_subnet");
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/networks/1/actions");
    expect(last().query).toEqual({ status: ["running"], sort: ["started:desc"] });
  });

  test("getAction", async () => {
    const { networks, last } = setup({ action });
    const result = await networks.getAction(1, 13);
    expect(result.action.id).toBe(13);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/networks/1/actions/13");
  });

  test("actions lists and gets actions of all networks", async () => {
    const { networks, last } = setup({ actions: [action], meta: metaFixture() }, { action });
    await networks.actions.list({ id: [13] });
    expect(last().path).toBe("/networks/actions");
    expect(last().query).toEqual({ id: ["13"] });

    await networks.actions.get(13);
    expect(last().path).toBe("/networks/actions/13");
  });

  test("addRoute", async () => {
    const { networks, last, requests } = setup({ action });
    const result = await networks.addRoute(1, { destination: "10.100.1.0/24", gateway: "10.0.1.1" });
    expect(result.action.id).toBe(13);
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/networks/1/actions/add_route");
    expect(last().body).toEqual({ destination: "10.100.1.0/24", gateway: "10.0.1.1" });

    // @ts-expect-error gateway is required
    await expect(networks.addRoute(1, { destination: "10.100.1.0/24" })).rejects.toBeInstanceOf(
      HCloudValidationError,
    );
    expect(requests).toHaveLength(1);
  });

  test("deleteRoute", async () => {
    const { networks, last } = setup({ action });
    await networks.deleteRoute(1, { destination: "10.100.1.0/24", gateway: "10.0.1.1" });
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/networks/1/actions/delete_route");
    expect(last().body).toEqual({ destination: "10.100.1.0/24", gateway: "10.0.1.1" });
  });

  test("addSubnet", async () => {
    const { networks, last } = setup({ action });

    await networks.addSubnet(1, { type: "cloud", network_zone: "eu-central" });
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/networks/1/actions/add_subnet");
    expect(last().body).toEqual({ type: "cloud", network_zone: "eu-central" });

    await networks.addSubnet(1, {
      type: "vswitch",
      network_zone: "eu-central",
      ip_range: "10.0.3.0/24",
      vswitch_id: 1000,
    });
    expect(last().body).toEqual({
      type: "vswitch",
      network_zone: "eu-central",
      ip_range: "10.0.3.0/24",
      vswitch_id: 1000,
    });
  });

  test("deleteSubnet", async () => {
    const { networks, last } = setup({ action });
    await networks.deleteSubnet(1, { ip_range: "10.0.1.0/24" });
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/networks/1/actions/delete_subnet");
    expect(last().body).toEqual({ ip_range: "10.0.1.0/24" });
  });

  test("changeIpRange", async () => {
    const { networks, last } = setup({ action });
    await networks.changeIpRange(1, { ip_range: "10.0.0.0/12" });
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/networks/1/actions/change_ip_range");
    expect(last().body).toEqual({ ip_range: "10.0.0.0/12" });
  });

  test("changeProtection", async () => {
    const { networks, last } = setup({ action });
    await networks.changeProtection(1, { delete: true });
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/networks/1/actions/change_protection");
    expect(last().body).toEqual({ delete: true });
  });

  test("forwards request options", async () => {
    const { networks, last } = setup({ network });
    await networks.get(1, { headers: { "x-test": "1" } });
    expect(last().headers.get("x-test")).toBe("1");
  });
});
