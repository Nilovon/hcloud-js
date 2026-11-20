import { describe, expect, test } from "bun:test";
import { LoadBalancersClient } from "../../src/apis/load-balancers/index";
import { loadBalancerSchema } from "../../src/apis/load-balancers/schemas";
import { HCloudValidationError } from "../../src/core/errors";
import { actionFixture, json, metaFixture, mockClient } from "../helpers";

const loadBalancer = {
  id: 4711,
  name: "Web Frontend",
  public_net: {
    enabled: true,
    ipv4: { id: 4712, ip: "131.232.99.1", blocked: false, dns_ptr: "lb1.example.com" },
    ipv6: { id: 4713, ip: "2001:db8::1", blocked: false, dns_ptr: "lb1.example.com" },
  },
  private_net: [{ network: 4711, ip: "10.0.255.1" }],
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
  load_balancer_type: {
    id: 1,
    name: "lb11",
    description: "lb11",
    max_connections: 20000,
    max_services: 5,
    max_targets: 25,
    max_assigned_certificates: 10,
    deprecated: "2016-01-30T23:50:00+00:00",
    prices: [
      {
        location: "fsn-1",
        price_hourly: { net: "1.0000000000", gross: "1.1900000000000000" },
        price_monthly: { net: "1.0000000000", gross: "1.1900000000000000" },
      },
    ],
  },
  protection: { delete: false },
  labels: {},
  created: "2016-01-30T23:50:00+00:00",
  outgoing_traffic: 123456,
  ingoing_traffic: 123456,
  included_traffic: 654321,
  services: [
    {
      protocol: "https",
      listen_port: 443,
      destination_port: 80,
      proxyprotocol: false,
      http: {
        cookie_name: "HCLBSTICKY",
        cookie_lifetime: 300,
        certificates: [897],
        redirect_http: true,
        sticky_sessions: true,
        timeout_idle: 60,
      },
      health_check: {
        protocol: "http",
        port: 4711,
        interval: 15,
        timeout: 10,
        retries: 3,
        http: {
          domain: "example.com",
          path: "/",
          response: '{"status": "ok"}',
          status_codes: ["2??", "3??"],
          tls: false,
        },
      },
    },
  ],
  targets: [
    {
      type: "server",
      server: { id: 80 },
      health_status: [
        { listen_port: 443, status: "healthy" },
        {
          listen_port: 80,
          status: "unhealthy",
          detail: "unexpected_http_status",
          http_status_code: 503,
        },
      ],
      label_selector: null,
      use_private_ip: false,
    },
    {
      type: "label_selector",
      label_selector: { selector: "env=prod" },
      use_private_ip: true,
      targets: [
        {
          type: "server",
          server: { id: 105054278 },
          use_private_ip: true,
          health_status: [
            { listen_port: 443, status: "healthy" },
            {
              listen_port: 3000,
              status: "unhealthy",
              detail: "unexpected_http_status",
              http_status_code: 503,
            },
          ],
        },
      ],
    },
    {
      type: "ip",
      ip: { ip: "203.0.113.1" },
      health_status: [{ listen_port: 443, status: "unknown" }],
    },
  ],
  algorithm: { type: "round_robin" },
};

function lbAction(command: string) {
  return actionFixture({
    id: 13,
    command,
    status: "success",
    progress: 100,
    started: "2016-01-30T23:55:00+00:00",
    finished: "2016-01-30T23:56:00+00:00",
    resources: [{ id: 4711, type: "load_balancer" }],
    error: { code: "action_failed", message: "Action failed" },
  });
}

/** A `201 Created` reply. A function, so that every request gets a fresh `Response`. */
function created(body: unknown) {
  return () => json(body, 201);
}

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, loadBalancers: new LoadBalancersClient(mock.client) };
}

describe("LoadBalancersClient", () => {
  test("list sends filters as query parameters", async () => {
    const { loadBalancers, last } = setup({
      load_balancers: [loadBalancer, { ...loadBalancer, id: 4712, name: "Web Frontend2" }],
      meta: metaFixture({ total_entries: 2 }),
    });

    const result = await loadBalancers.list({
      name: "Web Frontend",
      label_selector: "env=prod",
      sort: ["name:asc", "created:desc"],
      page: 2,
      per_page: 25,
    });

    expect(result.load_balancers.map((lb) => lb.id)).toEqual([4711, 4712]);
    expect<unknown>(result.load_balancers[0]).toEqual(loadBalancer);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/load_balancers");
    expect(last().query).toEqual({
      name: ["Web Frontend"],
      label_selector: ["env=prod"],
      sort: ["name:asc", "created:desc"],
      page: ["2"],
      per_page: ["25"],
    });
  });

  test("get returns health check diagnostics and primary IP ids", async () => {
    const { loadBalancers, last } = setup({ load_balancer: loadBalancer });

    const { load_balancer } = await loadBalancers.get(4711);

    expect(load_balancer.public_net.ipv4.id).toBe(4712);
    expect(load_balancer.load_balancer_type.name).toBe("lb11");
    expect(load_balancer.targets[0]?.health_status?.[1]).toEqual({
      listen_port: 80,
      status: "unhealthy",
      detail: "unexpected_http_status",
      http_status_code: 503,
    });
    expect(load_balancer.targets[1]?.targets?.[0]?.server?.id).toBe(105054278);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/load_balancers/4711");
  });

  test("getByName returns the exact match or undefined", async () => {
    const { loadBalancers, last } = setup(
      { load_balancers: [loadBalancer] },
      { load_balancers: [] },
    );
    expect<unknown>(await loadBalancers.getByName("Web Frontend")).toEqual(loadBalancer);
    expect(last().query).toEqual({ name: ["Web Frontend"] });

    expect(await loadBalancers.getByName("missing")).toBeUndefined();
    expect(last().query).toEqual({ name: ["missing"] });
  });

  test("listAll follows pagination", async () => {
    const { loadBalancers, requests } = setup(
      {
        load_balancers: [loadBalancer],
        meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }),
      },
      {
        load_balancers: [{ ...loadBalancer, id: 4712 }],
        meta: metaFixture({ page: 2, previous_page: 1 }),
      },
    );
    const all = await loadBalancers.listAll({ label_selector: "env=prod" });
    expect(all.map((lb) => lb.id)).toEqual([4711, 4712]);
    expect(requests.map((request) => request.query.page)).toEqual([["1"], ["2"]]);
  });

  test("create sends primary IPs and only the defined service fields", async () => {
    const { loadBalancers, last } = setup(
      created({ load_balancer: loadBalancer, action: lbAction("create_load_balancer") }),
    );

    const result = await loadBalancers.create({
      name: "my-balancer",
      load_balancer_type: "lb11",
      location: "fsn1",
      algorithm: { type: "round_robin" },
      network: 4711,
      public_interface: true,
      public_net: { ipv4: 4712, ipv6: 4713 },
      labels: { env: "prod" },
      services: [
        {
          protocol: "https",
          listen_port: 443,
          destination_port: 80,
          proxyprotocol: false,
          http: { cookie_name: "HCLBSTICKY", sticky_sessions: true, certificates: undefined },
          health_check: { protocol: "http", port: 4711, http: { path: "/", tls: undefined } },
        },
        { protocol: "http" },
      ],
      targets: [
        { type: "server", server: { id: 80 }, use_private_ip: false },
        { type: "label_selector", label_selector: { selector: "env=prod" } },
        { type: "ip", ip: { ip: "203.0.113.1" } },
      ],
    });

    expect(result.load_balancer.id).toBe(4711);
    expect(result.action.command).toBe("create_load_balancer");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/load_balancers");
    expect(last().body).toEqual({
      name: "my-balancer",
      load_balancer_type: "lb11",
      location: "fsn1",
      algorithm: { type: "round_robin" },
      network: 4711,
      public_interface: true,
      public_net: { ipv4: 4712, ipv6: 4713 },
      labels: { env: "prod" },
      services: [
        {
          protocol: "https",
          listen_port: 443,
          destination_port: 80,
          proxyprotocol: false,
          http: { cookie_name: "HCLBSTICKY", sticky_sessions: true },
          health_check: { protocol: "http", port: 4711, http: { path: "/" } },
        },
        { protocol: "http" },
      ],
      targets: [
        { type: "server", server: { id: 80 }, use_private_ip: false },
        { type: "label_selector", label_selector: { selector: "env=prod" } },
        { type: "ip", ip: { ip: "203.0.113.1" } },
      ],
    });
  });

  test("create validates the request", async () => {
    const { loadBalancers, requests } = setup({ load_balancer: loadBalancer });

    await expect(
      loadBalancers.create({ name: "", load_balancer_type: "lb11", location: "fsn1" }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    await expect(
      loadBalancers.create({
        name: "my-balancer",
        load_balancer_type: "lb11",
        network_zone: "eu-central",
        // @ts-expect-error a server target needs a server
        targets: [{ type: "server", ip: { ip: "203.0.113.1" } }],
      }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    expect(requests).toHaveLength(0);
  });

  test("update", async () => {
    const { loadBalancers, last } = setup({
      load_balancer: { ...loadBalancer, name: "new-name", labels: { labelkey: "value" } },
    });
    const result = await loadBalancers.update(4711, {
      name: "new-name",
      labels: { labelkey: "value" },
    });
    expect(result.load_balancer.name).toBe("new-name");
    expect(last().method).toBe("PUT");
    expect(last().path).toBe("/load_balancers/4711");
    expect(last().body).toEqual({ name: "new-name", labels: { labelkey: "value" } });
  });

  test("delete returns the action tracking the deletion", async () => {
    const action = lbAction("delete_load_balancer");
    const { loadBalancers, last } = setup(created({ action }));

    const result = await loadBalancers.delete(4711);

    expect(result.action).toEqual(action);
    expect(last().method).toBe("DELETE");
    expect(last().path).toBe("/load_balancers/4711");
    expect(last().body).toBeUndefined();
  });

  test("getMetrics joins types and converts dates", async () => {
    const metrics = {
      start: "2023-12-14T16:55:32+01:00",
      end: "2023-12-14T17:25:32+01:00",
      step: 9.0,
      time_series: {
        requests_per_second: {
          values: [
            [1702571114, "0.000000"],
            [1702571123, "0.000000"],
            [1702571132, "0.000000"],
          ],
        },
      },
    };
    const { loadBalancers, last } = setup({ metrics });

    const result = await loadBalancers.getMetrics(4711, {
      type: ["requests_per_second", "open_connections"],
      start: new Date("2023-12-14T15:55:32.000Z"),
      end: "2023-12-14T17:25:32+01:00",
      step: 9,
    });

    expect(result.metrics.time_series.requests_per_second?.values).toHaveLength(3);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/load_balancers/4711/metrics");
    expect(last().query).toEqual({
      type: ["requests_per_second,open_connections"],
      start: ["2023-12-14T15:55:32.000Z"],
      end: ["2023-12-14T17:25:32+01:00"],
      step: ["9"],
    });

    await loadBalancers.getMetrics(4711, {
      type: "bandwidth",
      start: "2023-12-14T16:55:32+01:00",
      end: new Date("2023-12-14T16:25:32.000Z"),
    });
    expect(last().query).toEqual({
      type: ["bandwidth"],
      start: ["2023-12-14T16:55:32+01:00"],
      end: ["2023-12-14T16:25:32.000Z"],
    });
  });

  test("listActions", async () => {
    const action = lbAction("change_protection");
    const { loadBalancers, last } = setup({ actions: [action], meta: metaFixture() });

    const result = await loadBalancers.listActions(4711, {
      status: ["running", "success"],
      sort: "started:desc",
      per_page: 10,
    });

    expect(result.actions).toEqual([action]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/load_balancers/4711/actions");
    expect(last().query).toEqual({
      status: ["running", "success"],
      sort: ["started:desc"],
      per_page: ["10"],
    });
  });

  test("getAction", async () => {
    const { loadBalancers, last } = setup({ action: lbAction("add_service") });
    const result = await loadBalancers.getAction(4711, 13);
    expect(result.action.id).toBe(13);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/load_balancers/4711/actions/13");
  });

  test("actions client is scoped to load balancers", async () => {
    const action = lbAction("add_service");
    const { loadBalancers, last } = setup({ actions: [action], meta: metaFixture() }, { action });

    await loadBalancers.actions.list({ status: "running" });
    expect(last().path).toBe("/load_balancers/actions");
    expect(last().query).toEqual({ status: ["running"] });

    await loadBalancers.actions.get(13);
    expect(last().path).toBe("/load_balancers/actions/13");

    expect((await loadBalancers.actions.waitFor(13)).status).toBe("success");
  });

  test("addService", async () => {
    const { loadBalancers, last, requests } = setup(created({ action: lbAction("add_service") }));

    const result = await loadBalancers.addService(4711, {
      protocol: "https",
      listen_port: 443,
      destination_port: 80,
      proxyprotocol: false,
      http: {
        cookie_name: "HCLBSTICKY",
        cookie_lifetime: 300,
        certificates: [897],
        redirect_http: true,
        sticky_sessions: true,
        timeout_idle: 60,
      },
      health_check: {
        protocol: "http",
        port: 4711,
        interval: 15,
        timeout: 10,
        retries: 3,
        http: {
          domain: "example.com",
          path: "/",
          response: '{"status": "ok"}',
          status_codes: ["2??", "3??"],
          tls: false,
        },
      },
    });

    expect(result.action.command).toBe("add_service");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/load_balancers/4711/actions/add_service");
    expect(last().body).toEqual({
      protocol: "https",
      listen_port: 443,
      destination_port: 80,
      proxyprotocol: false,
      http: {
        cookie_name: "HCLBSTICKY",
        cookie_lifetime: 300,
        certificates: [897],
        redirect_http: true,
        sticky_sessions: true,
        timeout_idle: 60,
      },
      health_check: {
        protocol: "http",
        port: 4711,
        interval: 15,
        timeout: 10,
        retries: 3,
        http: {
          domain: "example.com",
          path: "/",
          response: '{"status": "ok"}',
          status_codes: ["2??", "3??"],
          tls: false,
        },
      },
    });

    await expect(
      loadBalancers.addService(4711, { protocol: "tcp", listen_port: 70000 }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    expect(requests).toHaveLength(1);
  });

  test("updateService posts the listen port with the changed fields", async () => {
    const { loadBalancers, last } = setup(created({ action: lbAction("update_service") }));

    const result = await loadBalancers.updateService(4711, 443, {
      destination_port: 8080,
      http: { sticky_sessions: true, timeout_idle: 120 },
      health_check: { interval: 30 },
    });

    expect(result.action.command).toBe("update_service");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/load_balancers/4711/actions/update_service");
    expect(last().body).toEqual({
      listen_port: 443,
      destination_port: 8080,
      http: { sticky_sessions: true, timeout_idle: 120 },
      health_check: { interval: 30 },
    });
  });

  test("deleteService", async () => {
    const { loadBalancers, last } = setup(created({ action: lbAction("delete_service") }));
    const result = await loadBalancers.deleteService(4711, 443);
    expect(result.action.command).toBe("delete_service");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/load_balancers/4711/actions/delete_service");
    expect(last().body).toEqual({ listen_port: 443 });
  });

  test("addTarget", async () => {
    const { loadBalancers, last } = setup(created({ action: lbAction("add_target") }));

    const result = await loadBalancers.addTarget(4711, {
      type: "server",
      server: { id: 80 },
      use_private_ip: true,
    });
    expect(result.action.command).toBe("add_target");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/load_balancers/4711/actions/add_target");
    expect(last().body).toEqual({ type: "server", server: { id: 80 }, use_private_ip: true });

    await loadBalancers.addTarget(4711, {
      type: "label_selector",
      label_selector: { selector: "env=prod" },
    });
    expect(last().body).toEqual({
      type: "label_selector",
      label_selector: { selector: "env=prod" },
    });

    await loadBalancers.addTarget(4711, { type: "ip", ip: { ip: "203.0.113.1" } });
    expect(last().body).toEqual({ type: "ip", ip: { ip: "203.0.113.1" } });
  });

  test("removeTarget does not send use_private_ip", async () => {
    const { loadBalancers, last } = setup(created({ action: lbAction("remove_target") }));
    const target = { type: "server" as const, server: { id: 80 }, use_private_ip: true };

    const result = await loadBalancers.removeTarget(4711, target);

    expect(result.action.command).toBe("remove_target");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/load_balancers/4711/actions/remove_target");
    expect(last().body).toEqual({ type: "server", server: { id: 80 } });
  });

  test("changeAlgorithm", async () => {
    const { loadBalancers, last } = setup(created({ action: lbAction("change_algorithm") }));
    const result = await loadBalancers.changeAlgorithm(4711, { type: "least_connections" });
    expect(result.action.command).toBe("change_algorithm");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/load_balancers/4711/actions/change_algorithm");
    expect(last().body).toEqual({ type: "least_connections" });
  });

  test("changeReverseDNS sets and resets the entry", async () => {
    const { loadBalancers, last } = setup(created({ action: lbAction("change_dns_ptr") }));

    const result = await loadBalancers.changeReverseDNS(4711, {
      ip: "1.2.3.4",
      dns_ptr: "lb1.example.com",
    });
    expect(result.action.command).toBe("change_dns_ptr");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/load_balancers/4711/actions/change_dns_ptr");
    expect(last().body).toEqual({ ip: "1.2.3.4", dns_ptr: "lb1.example.com" });

    await loadBalancers.changeReverseDNS(4711, { ip: "1.2.3.4", dns_ptr: null });
    expect(last().body).toEqual({ ip: "1.2.3.4", dns_ptr: null });
  });

  test("changeProtection", async () => {
    const { loadBalancers, last } = setup(created({ action: lbAction("change_protection") }));
    const result = await loadBalancers.changeProtection(4711, { delete: true });
    expect(result.action.command).toBe("change_protection");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/load_balancers/4711/actions/change_protection");
    expect(last().body).toEqual({ delete: true });
  });

  test("changeType accepts a name or an id", async () => {
    const { loadBalancers, last } = setup(created({ action: lbAction("change_type") }));

    const result = await loadBalancers.changeType(4711, { load_balancer_type: "lb21" });
    expect(result.action.command).toBe("change_type");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/load_balancers/4711/actions/change_type");
    expect(last().body).toEqual({ load_balancer_type: "lb21" });

    await loadBalancers.changeType(4711, { load_balancer_type: 2 });
    expect(last().body).toEqual({ load_balancer_type: 2 });
  });

  test("attachToNetwork", async () => {
    const { loadBalancers, last } = setup(created({ action: lbAction("attach_to_network") }));
    const result = await loadBalancers.attachToNetwork(4711, {
      network: 4711,
      ip: "10.0.1.1",
      ip_range: "10.0.1.0/24",
    });
    expect(result.action.command).toBe("attach_to_network");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/load_balancers/4711/actions/attach_to_network");
    expect(last().body).toEqual({ network: 4711, ip: "10.0.1.1", ip_range: "10.0.1.0/24" });
  });

  test("detachFromNetwork", async () => {
    const { loadBalancers, last } = setup(created({ action: lbAction("detach_from_network") }));
    const result = await loadBalancers.detachFromNetwork(4711, 4712);
    expect(result.action.command).toBe("detach_from_network");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/load_balancers/4711/actions/detach_from_network");
    expect(last().body).toEqual({ network: 4712 });
  });

  test("enablePublicInterface and disablePublicInterface post without a body", async () => {
    const { loadBalancers, last } = setup(
      created({ action: lbAction("enable_public_interface") }),
      created({ action: lbAction("disable_public_interface") }),
    );

    const enabled = await loadBalancers.enablePublicInterface(4711);
    expect(enabled.action.command).toBe("enable_public_interface");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/load_balancers/4711/actions/enable_public_interface");
    expect(last().body).toBeUndefined();

    const disabled = await loadBalancers.disablePublicInterface(4711);
    expect(disabled.action.command).toBe("disable_public_interface");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/load_balancers/4711/actions/disable_public_interface");
    expect(last().body).toBeUndefined();
  });

  test("forwards request options", async () => {
    const { loadBalancers, last } = setup(created({ action: lbAction("change_algorithm") }));
    await loadBalancers.changeAlgorithm(
      4711,
      { type: "round_robin" },
      { headers: { "x-test": "1" } },
    );
    expect(last().headers.get("x-test")).toBe("1");
  });

  test("accepts tcp services and load balancers without traffic counters", () => {
    const result = loadBalancerSchema.safeParse({
      ...loadBalancer,
      outgoing_traffic: null,
      ingoing_traffic: null,
      private_net: [],
      targets: [],
      services: [
        {
          protocol: "tcp",
          listen_port: 5432,
          destination_port: 5432,
          proxyprotocol: true,
          health_check: { protocol: "tcp", port: 5432, interval: 15, timeout: 10, retries: 3 },
        },
      ],
    });
    expect(result.success).toBe(true);
  });
});
