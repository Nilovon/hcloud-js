import { describe, expect, test } from "bun:test";
import { PrimaryIPsClient } from "../../src/apis/primary-ips/index";
import { HCloudValidationError } from "../../src/core/errors";
import { actionFixture, metaFixture, mockClient } from "../helpers";

const location = {
  id: 1,
  name: "fsn1",
  description: "Falkenstein DC Park 1",
  country: "DE",
  city: "Falkenstein",
  latitude: 50.47612,
  longitude: 12.370071,
  network_zone: "eu-central",
};

const primaryIP1 = {
  id: 42,
  name: "primary-ip1",
  type: "ipv4" as const,
  ip: "131.232.99.1",
  assignee_id: 17,
  assignee_type: "server",
  auto_delete: true,
  blocked: false,
  location,
  dns_ptr: [{ dns_ptr: "server.example.com", ip: "131.232.99.1" }],
  labels: { key: "value" },
  protection: { delete: false },
  created: "2016-01-30T23:55:00Z",
};

const primaryIP2 = {
  ...primaryIP1,
  id: 52,
  name: "primary-ip2",
  ip: "131.232.99.2",
  assignee_id: null,
  assignee_type: "unassigned",
};

const action = actionFixture({
  id: 13,
  command: "assign_primary_ip",
  started: "2016-01-30T23:50+00:00",
  resources: [
    { id: 17, type: "server" },
    { id: 42, type: "primary_ip" },
  ],
});

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, primaryIPs: new PrimaryIPsClient(mock.client) };
}

describe("PrimaryIPsClient", () => {
  test("list sends filters as query parameters", async () => {
    const { primaryIPs, last } = setup({
      primary_ips: [primaryIP1, primaryIP2],
      meta: metaFixture({ total_entries: 2 }),
    });

    const result = await primaryIPs.list({
      name: "primary-ip1",
      label_selector: "key=value",
      ip: "131.232.99.1",
      sort: ["id:asc", "created:desc"],
      page: 2,
      per_page: 25,
    });

    expect(result.primary_ips).toEqual([primaryIP1, primaryIP2]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/primary_ips");
    expect(last().query).toEqual({
      name: ["primary-ip1"],
      label_selector: ["key=value"],
      ip: ["131.232.99.1"],
      sort: ["id:asc", "created:desc"],
      page: ["2"],
      per_page: ["25"],
    });
  });

  test("get", async () => {
    const { primaryIPs, last } = setup({ primary_ip: primaryIP1 });
    const result = await primaryIPs.get(42);
    expect(result.primary_ip.location.name).toBe("fsn1");
    expect(result.primary_ip.datacenter).toBeUndefined();
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/primary_ips/42");
  });

  test("accepts Primary IPs assigned to a load balancer", async () => {
    const assigned = { ...primaryIP1, assignee_id: 4711, assignee_type: "load_balancer" };
    const { primaryIPs } = setup({ primary_ip: assigned });
    const { primary_ip } = await primaryIPs.get(42);
    expect(primary_ip.assignee_type).toBe("load_balancer");
  });

  test("accepts the deprecated datacenter property", async () => {
    const legacy = {
      ...primaryIP1,
      datacenter: {
        id: 4,
        name: "fsn1-dc14",
        description: "Falkenstein 1 virtual DC 14",
        location,
        server_types: { supported: [1, 2], available: [1], available_for_migration: [1] },
      },
    };
    const { primaryIPs } = setup({ primary_ip: legacy });
    const { primary_ip } = await primaryIPs.get(42);
    expect(primary_ip.datacenter?.name).toBe("fsn1-dc14");
  });

  test("getByName returns the exact match or undefined", async () => {
    const { primaryIPs, last } = setup({ primary_ips: [primaryIP1] }, { primary_ips: [] });
    expect(await primaryIPs.getByName("primary-ip1")).toEqual(primaryIP1);
    expect(last().query).toEqual({ name: ["primary-ip1"] });

    expect(await primaryIPs.getByName("missing")).toBeUndefined();
    expect(last().query).toEqual({ name: ["missing"] });
  });

  test("getByIP uses the ip filter", async () => {
    const { primaryIPs, last } = setup({ primary_ips: [primaryIP1] }, { primary_ips: [] });
    expect(await primaryIPs.getByIP("131.232.99.1")).toEqual(primaryIP1);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/primary_ips");
    expect(last().query).toEqual({ ip: ["131.232.99.1"] });

    expect(await primaryIPs.getByIP("10.0.0.1")).toBeUndefined();
    expect(last().query).toEqual({ ip: ["10.0.0.1"] });
  });

  test("create in a location", async () => {
    const { primaryIPs, last } = setup({ primary_ip: primaryIP2 });

    const result = await primaryIPs.create({
      name: "primary-ip2",
      type: "ipv4",
      location: "fsn1",
      auto_delete: true,
      labels: { key: "value" },
    });
    expect(result.primary_ip).toEqual(primaryIP2);
    expect(result.action).toBeUndefined();
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/primary_ips");
    expect(last().body).toEqual({
      name: "primary-ip2",
      type: "ipv4",
      location: "fsn1",
      auto_delete: true,
      labels: { key: "value" },
    });
  });

  test("create with an assignee validates and sends the body", async () => {
    const { primaryIPs, last, requests } = setup({ primary_ip: primaryIP1, action });

    const result = await primaryIPs.create({
      name: "primary-ip1",
      type: "ipv4",
      assignee_id: 17,
      assignee_type: "server",
    });
    expect(result.action?.id).toBe(13);
    expect(last().body).toEqual({
      name: "primary-ip1",
      type: "ipv4",
      assignee_id: 17,
      assignee_type: "server",
    });

    await expect(
      // @ts-expect-error `name` is required
      primaryIPs.create({ type: "ipv4", location: "fsn1" }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    await expect(
      // @ts-expect-error `unassigned` is not a valid assignee type for requests
      primaryIPs.create({ name: "a", type: "ipv4", assignee_id: 1, assignee_type: "unassigned" }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    expect(requests).toHaveLength(1);
  });

  test("update", async () => {
    const { primaryIPs, last } = setup({ primary_ip: { ...primaryIP1, auto_delete: false } });
    const result = await primaryIPs.update(42, {
      name: "my-primary-ip",
      auto_delete: false,
      labels: { key: "value" },
    });
    expect(result.primary_ip.auto_delete).toBe(false);
    expect(last().method).toBe("PUT");
    expect(last().path).toBe("/primary_ips/42");
    expect(last().body).toEqual({
      name: "my-primary-ip",
      auto_delete: false,
      labels: { key: "value" },
    });
  });

  test("delete resolves without a value", async () => {
    const { primaryIPs, last } = setup(undefined);
    expect(await primaryIPs.delete(42)).toBeUndefined();
    expect(last().method).toBe("DELETE");
    expect(last().path).toBe("/primary_ips/42");
  });

  test("listActions", async () => {
    const finished = actionFixture({
      id: 13,
      command: "assign_primary_ip",
      status: "success",
      progress: 100,
      started: "2016-01-30T23:55:00+00:00",
      finished: "2016-01-30T23:56:00+00:00",
    });
    const { primaryIPs, last } = setup({ actions: [finished], meta: metaFixture() });

    const result = await primaryIPs.listActions(42, {
      status: "success",
      sort: ["finished:desc"],
      per_page: 10,
    });
    expect(result.actions).toEqual([finished]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/primary_ips/42/actions");
    expect(last().query).toEqual({
      status: ["success"],
      sort: ["finished:desc"],
      per_page: ["10"],
    });
  });

  test("getAction", async () => {
    const { primaryIPs, last } = setup({ action });
    const result = await primaryIPs.getAction(42, 13);
    expect(result.action.command).toBe("assign_primary_ip");
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/primary_ips/42/actions/13");
  });

  test("actions lists and fetches actions of all Primary IPs", async () => {
    const { primaryIPs, last } = setup({ actions: [action], meta: metaFixture() }, { action });
    const { actions } = await primaryIPs.actions.list({ id: [13], status: "running" });
    expect(actions).toEqual([action]);
    expect(last().path).toBe("/primary_ips/actions");
    expect(last().query).toEqual({ id: ["13"], status: ["running"] });

    await primaryIPs.actions.get(13);
    expect(last().path).toBe("/primary_ips/actions/13");
  });

  test("assignToResource sends assignee ID and type", async () => {
    const { primaryIPs, last, requests } = setup({ action });
    const result = await primaryIPs.assignToResource(42, {
      assignee_id: 17,
      assignee_type: "server",
    });
    expect(result.action).toEqual(action);
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/primary_ips/42/actions/assign");
    expect(last().body).toEqual({ assignee_id: 17, assignee_type: "server" });

    await expect(
      // @ts-expect-error `assignee_type` is required
      primaryIPs.assignToResource(42, { assignee_id: 17 }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    expect(requests).toHaveLength(1);
  });

  test("unassign sends no body", async () => {
    const { primaryIPs, last } = setup({ action: { ...action, command: "unassign_primary_ip" } });
    const result = await primaryIPs.unassign(42);
    expect(result.action.command).toBe("unassign_primary_ip");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/primary_ips/42/actions/unassign");
    expect(last().body).toBeUndefined();
  });

  test("changeReverseDNS", async () => {
    const { primaryIPs, last } = setup({ action: { ...action, command: "change_dns_ptr" } });
    await primaryIPs.changeReverseDNS(42, { ip: "131.232.99.1", dns_ptr: "server.example.com" });
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/primary_ips/42/actions/change_dns_ptr");
    expect(last().body).toEqual({ ip: "131.232.99.1", dns_ptr: "server.example.com" });

    await primaryIPs.changeReverseDNS(42, { ip: "131.232.99.1", dns_ptr: null });
    expect(last().body).toEqual({ ip: "131.232.99.1", dns_ptr: null });
  });

  test("changeProtection", async () => {
    const { primaryIPs, last } = setup({ action: { ...action, command: "change_protection" } });
    const result = await primaryIPs.changeProtection(42, { delete: true });
    expect(result.action.command).toBe("change_protection");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/primary_ips/42/actions/change_protection");
    expect(last().body).toEqual({ delete: true });
  });

  test("forwards request options", async () => {
    const { primaryIPs, last } = setup({ action });
    await primaryIPs.unassign(42, { headers: { "x-test": "1" } });
    expect(last().headers.get("x-test")).toBe("1");
  });

  test("listAll follows pagination", async () => {
    const { primaryIPs, requests } = setup(
      {
        primary_ips: [primaryIP1],
        meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }),
      },
      { primary_ips: [primaryIP2], meta: metaFixture({ page: 2, previous_page: 1 }) },
    );
    const all = await primaryIPs.listAll();
    expect(all.map((item) => item.id)).toEqual([42, 52]);
    expect(requests.map((request) => request.query.page)).toEqual([["1"], ["2"]]);
  });
});
