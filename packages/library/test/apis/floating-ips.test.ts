import { describe, expect, test } from "bun:test";
import { FloatingIPsClient } from "../../src/apis/floating-ips/index";
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

const floatingIP = {
  id: 4711,
  description: "Web Frontend",
  name: "Web Frontend",
  created: "2016-01-30T23:50+00:00",
  ip: "131.232.99.1",
  type: "ipv4" as const,
  server: 42,
  dns_ptr: [{ ip: "2001:db8::1", dns_ptr: "server.example.com" }],
  home_location: location,
  blocked: false,
  protection: { delete: false },
  labels: {},
};

const floatingIP2 = {
  ...floatingIP,
  id: 4712,
  description: "Web Backend",
  name: "Web Backend",
  ip: "131.232.99.2",
};

const action = actionFixture({
  id: 13,
  command: "assign_floating_ip",
  started: "2016-01-30T23:50+00:00",
  resources: [
    { id: 42, type: "server" },
    { id: 4711, type: "floating_ip" },
  ],
});

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, floatingIPs: new FloatingIPsClient(mock.client) };
}

describe("FloatingIPsClient", () => {
  test("list sends filters as query parameters", async () => {
    const { floatingIPs, last } = setup({
      floating_ips: [floatingIP, floatingIP2],
      meta: metaFixture({ total_entries: 2 }),
    });

    const result = await floatingIPs.list({
      name: "Web Frontend",
      label_selector: "environment=prod",
      sort: ["id:asc", "created:desc"],
      page: 2,
      per_page: 25,
    });

    expect(result.floating_ips).toEqual([floatingIP, floatingIP2]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/floating_ips");
    expect(last().query).toEqual({
      name: ["Web Frontend"],
      label_selector: ["environment=prod"],
      sort: ["id:asc", "created:desc"],
      page: ["2"],
      per_page: ["25"],
    });
  });

  test("get", async () => {
    const { floatingIPs, last } = setup({ floating_ip: floatingIP });
    const result = await floatingIPs.get(4711);
    expect(result.floating_ip.home_location.name).toBe("fsn1");
    expect(result.floating_ip.blocked).toBe(false);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/floating_ips/4711");
  });

  test("accepts an unassigned Floating IP without description", async () => {
    const unassigned = { ...floatingIP, server: null, description: null, dns_ptr: [] };
    const { floatingIPs } = setup({ floating_ip: unassigned });
    const { floating_ip } = await floatingIPs.get(4711);
    expect(floating_ip.server).toBeNull();
  });

  test("getByName returns the exact match or undefined", async () => {
    const { floatingIPs, last } = setup({ floating_ips: [floatingIP] }, { floating_ips: [] });
    expect(await floatingIPs.getByName("Web Frontend")).toEqual(floatingIP);
    expect(last().query).toEqual({ name: ["Web Frontend"] });

    expect(await floatingIPs.getByName("missing")).toBeUndefined();
    expect(last().query).toEqual({ name: ["missing"] });
  });

  test("getByIP searches all pages", async () => {
    const { floatingIPs, requests } = setup(
      {
        floating_ips: [floatingIP],
        meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }),
      },
      { floating_ips: [floatingIP2], meta: metaFixture({ page: 2, previous_page: 1 }) },
    );

    expect(await floatingIPs.getByIP("131.232.99.2")).toEqual(floatingIP2);
    expect(requests.map((request) => request.path)).toEqual(["/floating_ips", "/floating_ips"]);
    expect(requests.map((request) => request.query.page)).toEqual([["1"], ["2"]]);
  });

  test("getByIP stops at the first match and returns undefined without one", async () => {
    const { floatingIPs, requests } = setup(
      {
        floating_ips: [floatingIP],
        meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }),
      },
      { floating_ips: [floatingIP2], meta: metaFixture() },
    );
    expect(await floatingIPs.getByIP("131.232.99.1")).toEqual(floatingIP);
    expect(requests).toHaveLength(1);

    expect(await floatingIPs.getByIP("10.0.0.1")).toBeUndefined();
    expect(requests).toHaveLength(2);
  });

  test("create validates and sends the body", async () => {
    const { floatingIPs, last, requests } = setup({ floating_ip: floatingIP, action });

    const result = await floatingIPs.create({
      type: "ipv4",
      name: "Web Frontend",
      description: "Web Frontend",
      server: 42,
      labels: { environment: "prod" },
    });
    expect(result.floating_ip).toEqual(floatingIP);
    expect(result.action?.id).toBe(13);
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/floating_ips");
    expect(last().body).toEqual({
      type: "ipv4",
      name: "Web Frontend",
      description: "Web Frontend",
      server: 42,
      labels: { environment: "prod" },
    });

    await expect(
      // @ts-expect-error invalid type
      floatingIPs.create({ type: "ipv5", home_location: "fsn1" }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    expect(requests).toHaveLength(1);
  });

  test("create in a home location returns no action", async () => {
    const { floatingIPs, last } = setup({ floating_ip: { ...floatingIP, server: null } });
    const result = await floatingIPs.create({ type: "ipv6", home_location: "fsn1" });
    expect(result.action).toBeUndefined();
    expect(last().body).toEqual({ type: "ipv6", home_location: "fsn1" });
  });

  test("update", async () => {
    const { floatingIPs, last } = setup({
      floating_ip: { ...floatingIP, description: "New description", name: "New name" },
    });
    const result = await floatingIPs.update(4711, {
      name: "New name",
      description: "New description",
      labels: { environment: "dev" },
    });
    expect(result.floating_ip.name).toBe("New name");
    expect(last().method).toBe("PUT");
    expect(last().path).toBe("/floating_ips/4711");
    expect(last().body).toEqual({
      name: "New name",
      description: "New description",
      labels: { environment: "dev" },
    });
  });

  test("delete resolves without a value", async () => {
    const { floatingIPs, last } = setup(undefined);
    expect(await floatingIPs.delete(4711)).toBeUndefined();
    expect(last().method).toBe("DELETE");
    expect(last().path).toBe("/floating_ips/4711");
  });

  test("listActions", async () => {
    const finished = actionFixture({
      id: 13,
      command: "assign_floating_ip",
      status: "success",
      progress: 100,
      started: "2016-01-30T23:55:00+00:00",
      finished: "2016-01-30T23:56:00+00:00",
    });
    const { floatingIPs, last } = setup({ actions: [finished], meta: metaFixture() });

    const result = await floatingIPs.listActions(4711, {
      status: ["running", "success"],
      sort: "started:desc",
      page: 1,
    });
    expect(result.actions).toEqual([finished]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/floating_ips/4711/actions");
    expect(last().query).toEqual({
      status: ["running", "success"],
      sort: ["started:desc"],
      page: ["1"],
    });
  });

  test("getAction", async () => {
    const { floatingIPs, last } = setup({ action });
    const result = await floatingIPs.getAction(4711, 13);
    expect(result.action.command).toBe("assign_floating_ip");
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/floating_ips/4711/actions/13");
  });

  test("actions lists and fetches actions of all Floating IPs", async () => {
    const { floatingIPs, last } = setup({ actions: [action], meta: metaFixture() }, { action });
    const { actions } = await floatingIPs.actions.list({ status: "running" });
    expect(actions).toEqual([action]);
    expect(last().path).toBe("/floating_ips/actions");
    expect(last().query).toEqual({ status: ["running"] });

    await floatingIPs.actions.get(13);
    expect(last().path).toBe("/floating_ips/actions/13");
  });

  test("assignToServer sends the server ID", async () => {
    const { floatingIPs, last, requests } = setup({ action });
    const result = await floatingIPs.assignToServer(4711, { server: 42 });
    expect(result.action).toEqual(action);
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/floating_ips/4711/actions/assign");
    expect(last().body).toEqual({ server: 42 });

    await expect(
      // @ts-expect-error `assignee_id` was the wrong field name used by v1
      floatingIPs.assignToServer(4711, { assignee_id: 42 }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    expect(requests).toHaveLength(1);
  });

  test("unassign sends no body", async () => {
    const { floatingIPs, last } = setup({
      action: { ...action, command: "unassign_floating_ip" },
    });
    const result = await floatingIPs.unassign(4711);
    expect(result.action.command).toBe("unassign_floating_ip");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/floating_ips/4711/actions/unassign");
    expect(last().body).toBeUndefined();
  });

  test("changeReverseDNS", async () => {
    const { floatingIPs, last } = setup({ action: { ...action, command: "change_dns_ptr" } });
    await floatingIPs.changeReverseDNS(4711, { ip: "131.232.99.1", dns_ptr: "server.example.com" });
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/floating_ips/4711/actions/change_dns_ptr");
    expect(last().body).toEqual({ ip: "131.232.99.1", dns_ptr: "server.example.com" });

    await floatingIPs.changeReverseDNS(4711, { ip: "131.232.99.1", dns_ptr: null });
    expect(last().body).toEqual({ ip: "131.232.99.1", dns_ptr: null });
  });

  test("changeProtection", async () => {
    const { floatingIPs, last } = setup({
      action: { ...action, command: "change_protection" },
    });
    const result = await floatingIPs.changeProtection(4711, { delete: true });
    expect(result.action.command).toBe("change_protection");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/floating_ips/4711/actions/change_protection");
    expect(last().body).toEqual({ delete: true });
  });

  test("forwards request options", async () => {
    const { floatingIPs, last } = setup({ floating_ip: floatingIP });
    await floatingIPs.get(4711, { headers: { "x-test": "1" } });
    expect(last().headers.get("x-test")).toBe("1");
  });

  test("listAll follows pagination", async () => {
    const { floatingIPs, requests } = setup(
      {
        floating_ips: [floatingIP],
        meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }),
      },
      { floating_ips: [floatingIP2], meta: metaFixture({ page: 2, previous_page: 1 }) },
    );
    const all = await floatingIPs.listAll();
    expect(all.map((item) => item.id)).toEqual([4711, 4712]);
    expect(requests.map((request) => request.query.page)).toEqual([["1"], ["2"]]);
  });
});
