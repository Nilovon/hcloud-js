import { describe, expect, test } from "bun:test";
import { FirewallsClient } from "../../src/apis/firewalls/index";
import type { Firewall } from "../../src/apis/firewalls/types";
import { HCloudValidationError } from "../../src/core/errors";
import { metaFixture, mockClient } from "../helpers";

const ips = ["28.239.13.1/32", "28.239.14.0/24", "ff21:1eac:9a3b:ee58:5ca:990c:8bc9:c03b/128"];

const firewall: Firewall = {
  id: 38,
  name: "Corporate Intranet Protection",
  labels: {},
  created: "2016-01-30T23:50:00+00:00",
  rules: [
    {
      direction: "in",
      source_ips: ips,
      destination_ips: [],
      protocol: "tcp",
      port: "80",
      description: null,
    },
    {
      direction: "out",
      source_ips: [],
      destination_ips: ips,
      protocol: "tcp",
      port: "80",
      description: "allow http out",
    },
    {
      direction: "in",
      source_ips: ["0.0.0.0/0", "::/0"],
      destination_ips: [],
      protocol: "icmp",
      port: null,
      description: null,
    },
  ],
  applied_to: [
    { server: { id: 42 }, type: "server" },
    {
      type: "label_selector",
      label_selector: { selector: "key==value" },
      applied_to_resources: [{ type: "server", server: { id: 42 } }],
    },
  ],
};

const otherFirewall: Firewall = {
  id: 39,
  name: "Corporate Extranet Protection",
  labels: {},
  created: "2016-01-30T23:50:00+00:00",
  rules: [
    {
      direction: "in",
      destination_ips: [],
      source_ips: ips,
      protocol: "tcp",
      port: "443",
      description: "allow https in",
    },
  ],
  applied_to: [{ server: { id: 42 }, type: "server" }],
};

const actions = [
  {
    id: 13,
    command: "set_firewall_rules",
    status: "success",
    progress: 100,
    started: "2016-01-30T23:55:00+00:00",
    finished: "2016-01-30T23:56:00+00:00",
    resources: [{ id: 38, type: "firewall" }],
    error: { code: "action_failed", message: "Action failed" },
  },
  {
    id: 14,
    command: "apply_firewall",
    status: "success",
    progress: 100,
    started: "2016-01-30T23:55:00+00:00",
    finished: "2016-01-30T23:56:00+00:00",
    resources: [
      { id: 38, type: "firewall" },
      { id: 42, type: "server" },
    ],
    error: { code: "action_failed", message: "Action failed" },
  },
];

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, firewalls: new FirewallsClient(mock.client) };
}

describe("FirewallsClient", () => {
  test("list sends filters as query parameters", async () => {
    const { firewalls, last } = setup({ firewalls: [firewall, otherFirewall], meta: metaFixture() });

    const result = await firewalls.list({
      name: "Corporate Intranet Protection",
      label_selector: "environment=prod",
      sort: ["name:asc", "created:desc"],
      page: 2,
      per_page: 25,
    });

    expect(result.firewalls.map((item) => item.id)).toEqual([38, 39]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/firewalls");
    expect(last().query).toEqual({
      name: ["Corporate Intranet Protection"],
      label_selector: ["environment=prod"],
      sort: ["name:asc", "created:desc"],
      page: ["2"],
      per_page: ["25"],
    });
  });

  test("get", async () => {
    const { firewalls, last } = setup({ firewall });
    const result = await firewalls.get(38);
    expect(result.firewall.rules[0]?.port).toBe("80");
    expect(result.firewall.applied_to[1]?.label_selector?.selector).toBe("key==value");
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/firewalls/38");
  });

  test("getByName returns the exact match or undefined", async () => {
    const { firewalls, last } = setup({ firewalls: [firewall] }, { firewalls: [] });
    expect(await firewalls.getByName(firewall.name)).toEqual(firewall);
    expect(last().query).toEqual({ name: [firewall.name] });

    expect(await firewalls.getByName("missing")).toBeUndefined();
  });

  test("listAll follows pagination", async () => {
    const { firewalls, requests } = setup(
      { firewalls: [firewall], meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }) },
      { firewalls: [otherFirewall], meta: metaFixture({ page: 2, previous_page: 1 }) },
    );
    const all = await firewalls.listAll();
    expect(all.map((item) => item.id)).toEqual([38, 39]);
    expect(requests.map((request) => request.query.page)).toEqual([["1"], ["2"]]);
  });

  test("create sends rules and resources and returns the firewall with actions", async () => {
    const { firewalls, last } = setup({ firewall, actions });

    const result = await firewalls.create({
      name: "Corporate Intranet Protection",
      labels: { environment: "prod" },
      rules: [{ direction: "in", protocol: "icmp", source_ips: ["0.0.0.0/0"] }],
      apply_to: [
        { type: "server", server: { id: 4711 } },
        { type: "label_selector", label_selector: { selector: "key==value" } },
      ],
    });

    expect(result.firewall.id).toBe(38);
    expect(result.actions?.map((action) => action.id)).toEqual([13, 14]);
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/firewalls");
    expect(last().body).toEqual({
      name: "Corporate Intranet Protection",
      labels: { environment: "prod" },
      rules: [{ direction: "in", protocol: "icmp", source_ips: ["0.0.0.0/0"] }],
      apply_to: [
        { type: "server", server: { id: 4711 } },
        { type: "label_selector", label_selector: { selector: "key==value" } },
      ],
    });
  });

  test("create accepts a response without actions and a name only", async () => {
    const { firewalls, last } = setup({ firewall });
    const result = await firewalls.create({ name: "empty" });
    expect(result.actions).toBeUndefined();
    expect(last().body).toEqual({ name: "empty" });
  });

  test("create rejects invalid parameters without sending a request", async () => {
    const { firewalls, requests } = setup({ firewall, actions });

    await expect(firewalls.create({ name: "" })).rejects.toBeInstanceOf(HCloudValidationError);
    await expect(
      firewalls.create({
        name: "web",
        // @ts-expect-error unknown protocol
        rules: [{ direction: "in", protocol: "sctp", source_ips: ["0.0.0.0/0"] }],
      }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    await expect(
      firewalls.create({ name: "web", apply_to: [{ type: "server" }] }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    expect(requests).toHaveLength(0);
  });

  test("update", async () => {
    const { firewalls, last } = setup({ firewall: { ...firewall, name: "New name" } });
    const result = await firewalls.update(38, { name: "New name", labels: { key: "value" } });
    expect(result.firewall.name).toBe("New name");
    expect(last().method).toBe("PUT");
    expect(last().path).toBe("/firewalls/38");
    expect(last().body).toEqual({ name: "New name", labels: { key: "value" } });
  });

  test("delete resolves without a value", async () => {
    const { firewalls, last } = setup(undefined);
    expect(await firewalls.delete(38)).toBeUndefined();
    expect(last().method).toBe("DELETE");
    expect(last().path).toBe("/firewalls/38");
  });

  test("listActions", async () => {
    const { firewalls, last } = setup({ actions, meta: metaFixture() });
    const result = await firewalls.listActions(38, { status: ["running"], sort: "id:desc" });
    expect(result.actions).toHaveLength(2);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/firewalls/38/actions");
    expect(last().query).toEqual({ status: ["running"], sort: ["id:desc"] });
  });

  test("getAction", async () => {
    const { firewalls, last } = setup({ action: actions[0] });
    const result = await firewalls.getAction(38, 13);
    expect(result.action.command).toBe("set_firewall_rules");
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/firewalls/38/actions/13");
  });

  test("actions lists and gets actions of all firewalls", async () => {
    const { firewalls, last } = setup({ actions, meta: metaFixture() }, { action: actions[0] });
    await firewalls.actions.list({ status: "running" });
    expect(last().path).toBe("/firewalls/actions");
    expect(last().query).toEqual({ status: ["running"] });

    await firewalls.actions.get(13);
    expect(last().path).toBe("/firewalls/actions/13");
  });

  test("setRules sends a flat list of rules", async () => {
    const { firewalls, last } = setup({ actions });

    const result = await firewalls.setRules(38, {
      rules: [
        {
          direction: "in",
          protocol: "icmp",
          source_ips: ["0.0.0.0/0", "::/0"],
          description: "Allow ICMP from everywhere",
        },
        {
          direction: "in",
          protocol: "tcp",
          port: "80",
          source_ips: ["0.0.0.0/0", "::/0"],
          description: "Allow HTTP from everywhere",
        },
        { direction: "out", protocol: "udp", port: "1024-5000", destination_ips: ["10.0.0.0/8"] },
        { direction: "in", protocol: "esp", source_ips: ["0.0.0.0/0"] },
        { direction: "in", protocol: "gre", source_ips: ["0.0.0.0/0"] },
      ],
    });

    expect(result.actions.map((action) => action.id)).toEqual([13, 14]);
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/firewalls/38/actions/set_rules");
    expect(last().body).toEqual({
      rules: [
        {
          direction: "in",
          protocol: "icmp",
          source_ips: ["0.0.0.0/0", "::/0"],
          description: "Allow ICMP from everywhere",
        },
        {
          direction: "in",
          protocol: "tcp",
          port: "80",
          source_ips: ["0.0.0.0/0", "::/0"],
          description: "Allow HTTP from everywhere",
        },
        { direction: "out", protocol: "udp", port: "1024-5000", destination_ips: ["10.0.0.0/8"] },
        { direction: "in", protocol: "esp", source_ips: ["0.0.0.0/0"] },
        { direction: "in", protocol: "gre", source_ips: ["0.0.0.0/0"] },
      ],
    });
  });

  test("setRules accepts rules returned by the API and drops null and empty values", async () => {
    const { firewalls, last } = setup({ actions });

    await firewalls.setRules(38, { rules: firewall.rules });

    expect(last().body).toEqual({
      rules: [
        { direction: "in", protocol: "tcp", port: "80", source_ips: ips },
        {
          direction: "out",
          protocol: "tcp",
          port: "80",
          destination_ips: ips,
          description: "allow http out",
        },
        { direction: "in", protocol: "icmp", source_ips: ["0.0.0.0/0", "::/0"] },
      ],
    });
  });

  test("setRules removes all rules with an empty list", async () => {
    const { firewalls, last } = setup({ actions: [] });
    const result = await firewalls.setRules(38, { rules: [] });
    expect(result.actions).toEqual([]);
    expect(last().body).toEqual({ rules: [] });
  });

  test("setRules validates the port against the protocol", async () => {
    const { firewalls, requests } = setup({ actions });

    const invalid = [
      { direction: "in" as const, protocol: "tcp" as const, source_ips: ["0.0.0.0/0"] },
      { direction: "in" as const, protocol: "udp" as const, port: null },
      { direction: "in" as const, protocol: "icmp" as const, port: "80" },
      { direction: "in" as const, protocol: "gre" as const, port: "80" },
      { direction: "in" as const, protocol: "tcp" as const, port: "http" },
      { direction: "in" as const, protocol: "tcp" as const, port: "80-" },
    ];
    for (const rule of invalid) {
      await expect(firewalls.setRules(38, { rules: [rule] })).rejects.toBeInstanceOf(
        HCloudValidationError,
      );
    }
    // @ts-expect-error rules is required
    await expect(firewalls.setRules(38, {})).rejects.toBeInstanceOf(HCloudValidationError);
    expect(requests).toHaveLength(0);
  });

  test("applyToResources", async () => {
    const { firewalls, last } = setup({ actions });

    const result = await firewalls.applyToResources(38, {
      apply_to: [
        { type: "server", server: { id: 5 } },
        { type: "label_selector", label_selector: { selector: "role=web" } },
      ],
    });

    expect(result.actions[0]?.id).toBe(13);
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/firewalls/38/actions/apply_to_resources");
    expect(last().body).toEqual({
      apply_to: [
        { type: "server", server: { id: 5 } },
        { type: "label_selector", label_selector: { selector: "role=web" } },
      ],
    });
  });

  test("removeFromResources accepts resources returned by the API", async () => {
    const { firewalls, last, requests } = setup({ actions });

    const result = await firewalls.removeFromResources(38, { remove_from: firewall.applied_to });

    expect(result.actions[0]?.id).toBe(13);
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/firewalls/38/actions/remove_from_resources");
    expect(last().body).toEqual({
      remove_from: [
        { type: "server", server: { id: 42 } },
        { type: "label_selector", label_selector: { selector: "key==value" } },
      ],
    });

    await expect(
      firewalls.removeFromResources(38, {
        remove_from: [{ type: "label_selector", server: { id: 42 } }],
      }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    expect(requests).toHaveLength(1);
  });

  test("forwards request options", async () => {
    const { firewalls, last } = setup({ firewall });
    await firewalls.get(38, { headers: { "x-test": "1" } });
    expect(last().headers.get("x-test")).toBe("1");
  });
});
