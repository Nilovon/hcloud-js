import { describe, expect, test } from "bun:test";
import { ServersClient } from "../../src/apis/servers/index";
import {
  ErrorCode,
  HCloudAbortError,
  HCloudActionError,
  HCloudError,
  HCloudValidationError,
} from "../../src/core/errors";
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

const serverType = {
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
      included_traffic: 21990232555520,
      price_per_tb_traffic: { net: "1.0000000000", gross: "1.1900000000000000" },
    },
  ],
  storage_type: "local",
  cpu_type: "shared",
  architecture: "x86",
  locations: [{ id: 1, name: "fsn1", deprecation: null, available: true, recommended: true }],
};

const image = {
  id: 4711,
  type: "snapshot",
  status: "available",
  name: "ubuntu-20.04",
  description: "Ubuntu 20.04 Standard 64 bit",
  image_size: 2.3,
  disk_size: 10,
  created: "2016-01-30T23:50+00:00",
  created_from: { id: 1, name: "Server" },
  bound_to: null,
  os_flavor: "ubuntu",
  os_version: "16.04",
  architecture: "x86",
  rapid_deploy: false,
  protection: { delete: false },
  deprecated: null,
  deleted: null,
  labels: {},
};

const iso = {
  id: 4711,
  name: "FreeBSD-11.0-RELEASE-amd64-dvd1",
  description: "FreeBSD 11.0 x64",
  type: "public",
  architecture: "x86",
  deprecation: {
    announced: "2018-01-28T00:00:00+00:00",
    unavailable_after: "2018-02-28T00:00:00+00:00",
  },
};

const placementGroup = {
  created: "2019-01-08T12:10:00+00:00",
  id: 897,
  labels: { key: "value" },
  name: "my Placement Group",
  servers: [4711, 4712],
  type: "spread",
};

/** Full server as returned by the API today (no `datacenter`). */
const server = {
  id: 42,
  name: "my-server",
  status: "running",
  created: "2016-01-30T23:50+00:00",
  primary_disk_size: 20,
  public_net: {
    ipv4: { ip: "1.2.3.4", blocked: false, id: 1, dns_ptr: "server01.example.com" },
    ipv6: {
      ip: "2001:db8::/64",
      blocked: false,
      id: 2,
      dns_ptr: [{ ip: "2001:db8::1", dns_ptr: "server.example.com" }],
    },
    floating_ips: [478],
    firewalls: [{ id: 38, status: "applied" }],
  },
  private_net: [
    {
      network: 4711,
      ip: "10.1.1.5",
      alias_ips: ["10.1.1.8"],
      mac_address: "86:00:ff:2a:7d:e1",
    },
  ],
  server_type: serverType,
  location,
  image,
  iso,
  placement_group: placementGroup,
  rescue_enabled: false,
  locked: false,
  backup_window: "22-02",
  outgoing_traffic: 123456,
  ingoing_traffic: 123456,
  included_traffic: 654321,
  protection: { delete: false, rebuild: false },
  labels: {},
  volumes: [1, 2],
  load_balancers: [],
};

/** Server without the optional/nullable parts: no IPs, image, ISO, backups or placement group. */
const minimalServer = {
  ...server,
  id: 43,
  name: "my-server2",
  status: "off",
  public_net: { ipv4: null, ipv6: null, floating_ips: [], firewalls: [] },
  private_net: [],
  image: null,
  iso: null,
  placement_group: null,
  backup_window: null,
  outgoing_traffic: null,
  ingoing_traffic: null,
  volumes: [],
};

const serverAction = (command: string, overrides: Record<string, unknown> = {}) =>
  actionFixture({ command, ...overrides });

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, servers: new ServersClient(mock.client) };
}

describe("ServersClient", () => {
  test("list sends filters as query parameters", async () => {
    const { servers, last } = setup({ servers: [server, minimalServer], meta: metaFixture() });

    const result = await servers.list({
      name: "my-server",
      label_selector: "environment=prod",
      status: ["running", "off"],
      sort: ["name:asc", "created:desc"],
      page: 2,
      per_page: 25,
    });

    expect<unknown>(result.servers).toEqual([server, minimalServer]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/servers");
    expect(last().query).toEqual({
      name: ["my-server"],
      label_selector: ["environment=prod"],
      status: ["running", "off"],
      sort: ["name:asc", "created:desc"],
      page: ["2"],
      per_page: ["25"],
    });
  });

  test("get", async () => {
    const { servers, last } = setup({ server });
    const result = await servers.get(42);
    expect(result.server.location.name).toBe("fsn1");
    expect(result.server.datacenter).toBeUndefined();
    expect(result.server.backup_window).toBe("22-02");
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/servers/42");
  });

  test("get accepts servers still carrying the removed datacenter property", async () => {
    const datacenter = {
      id: 1,
      name: "fsn1-dc8",
      description: "Falkenstein 1 DC 8",
      location,
      server_types: { supported: [1, 2], available: [1], available_for_migration: [1] },
    };
    const { servers } = setup({ server: { ...server, datacenter } });
    const result = await servers.get(42);
    expect(result.server.datacenter?.name).toBe("fsn1-dc8");
  });

  test("get rejects a server without location", async () => {
    const { location: _location, ...withoutLocation } = server;
    const { servers } = setup({ server: withoutLocation });
    const error = await servers.get(42).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(HCloudValidationError);
    expect((error as HCloudValidationError).target).toBe("response");
  });

  test("getByName returns the exact match or undefined", async () => {
    const { servers, last } = setup({ servers: [server] }, { servers: [] });
    expect<unknown>(await servers.getByName("my-server")).toEqual(server);
    expect(last().query).toEqual({ name: ["my-server"] });

    expect(await servers.getByName("missing")).toBeUndefined();
    expect(last().query).toEqual({ name: ["missing"] });
  });

  test("listAll follows pagination", async () => {
    const { servers, requests } = setup(
      { servers: [server], meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }) },
      { servers: [minimalServer], meta: metaFixture({ page: 2, previous_page: 1 }) },
    );
    const all = await servers.listAll({ status: "running" });
    expect(all.map((item) => item.id)).toEqual([42, 43]);
    expect(requests.map((request) => request.query.page)).toEqual([["1"], ["2"]]);
    expect(requests[1]?.query.status).toEqual(["running"]);
  });

  test("create validates and sends the body", async () => {
    const response = {
      server: { ...server, status: "initializing" },
      action: serverAction("create_server"),
      next_actions: [serverAction("start_server", { id: 13 })],
      root_password: "YItygq1v3GYjjMomLaKc",
    };
    const { servers, last, requests } = setup(response);

    const params = {
      name: "my-server",
      server_type: "cx11",
      image: 4711,
      location: "fsn1",
      ssh_keys: ["my-key", 2323],
      volumes: [1, 2],
      networks: [4711],
      firewalls: [{ firewall: 38 }],
      user_data: "#cloud-config\nruncmd:\n- [touch, /root/cloud-init-worked]\n",
      labels: { environment: "prod" },
      start_after_create: false,
      automount: false,
      placement_group: 897,
      public_net: { enable_ipv4: true, enable_ipv6: false, ipv4: 1 },
    };
    const result = await servers.create(params);

    expect(result.root_password).toBe("YItygq1v3GYjjMomLaKc");
    expect(result.next_actions[0]?.command).toBe("start_server");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/servers");
    expect(last().body).toEqual(params);

    await expect(
      servers.create({ name: "", server_type: "cx11", image: "ubuntu-24.04" }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    await expect(
      // @ts-expect-error firewalls are passed as `{ firewall: id }`
      servers.create({ name: "a", server_type: "cx11", image: "ubuntu-24.04", firewalls: [38] }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    expect(requests).toHaveLength(1);
  });

  test("create does not send the removed datacenter parameter", async () => {
    const { servers, last } = setup({
      server,
      action: serverAction("create_server"),
      next_actions: [],
      root_password: null,
    });
    const params = {
      name: "a",
      server_type: "cx11",
      image: "ubuntu-24.04",
      datacenter: "fsn1-dc8",
    };
    await servers.create(params);
    expect(last().body).toEqual({ name: "a", server_type: "cx11", image: "ubuntu-24.04" });
  });

  test("createAndWait waits for all actions and returns the fresh server", async () => {
    const { servers, requests } = setup(
      {
        server: { ...server, status: "initializing" },
        action: serverAction("create_server"),
        next_actions: [serverAction("start_server", { id: 13 })],
        root_password: null,
      },
      {
        actions: [
          serverAction("create_server", { status: "success", progress: 100 }),
          serverAction("start_server", { id: 13, status: "success", progress: 100 }),
        ],
      },
      { server },
    );

    const progress: number[] = [];
    const result = await servers.createAndWait(
      { name: "my-server", server_type: "cx11", image: "ubuntu-20.04" },
      { onProgress: (action) => progress.push(action.id) },
    );

    expect(result.server.status).toBe("running");
    expect(result.root_password).toBeNull();
    expect(result.action.status).toBe("success");
    expect(result.next_actions.map((action) => [action.id, action.status])).toEqual([
      [13, "success"],
    ]);
    expect(progress).toEqual([1, 13]);
    expect(requests.map((request) => `${request.method} ${request.path}`)).toEqual([
      "POST /servers",
      "GET /servers/actions",
      "GET /servers/42",
    ]);
    expect(requests[1]?.query.id).toEqual(["1", "13"]);
  });

  test("createAndWait rejects if an action fails", async () => {
    const { servers, requests } = setup(
      {
        server: { ...server, status: "initializing" },
        action: serverAction("create_server"),
        next_actions: [],
        root_password: null,
      },
      {
        action: serverAction("create_server", {
          status: "error",
          error: { code: "action_failed", message: "Action failed" },
        }),
      },
    );

    await expect(
      servers.createAndWait({ name: "my-server", server_type: "cx11", image: "ubuntu-20.04" }),
    ).rejects.toBeInstanceOf(HCloudActionError);
    expect(requests.at(-1)?.path).toBe("/servers/actions/1");
  });

  test("createAndWait forwards request options", async () => {
    const { servers, requests } = setup(
      {
        server,
        action: serverAction("create_server", { status: "success", progress: 100 }),
        next_actions: [],
        root_password: null,
      },
      { server },
    );

    await servers.createAndWait(
      { name: "my-server", server_type: "cx11", image: "ubuntu-20.04" },
      undefined,
      { headers: { "x-test": "1" } },
    );
    expect(requests).toHaveLength(2);
    expect(requests.map((request) => request.headers.get("x-test"))).toEqual(["1", "1"]);
  });

  test("update", async () => {
    const { servers, last } = setup({ server: { ...server, name: "new-name" } });
    const result = await servers.update(42, { name: "new-name", labels: {} });
    expect(result.server.name).toBe("new-name");
    expect(last().method).toBe("PUT");
    expect(last().path).toBe("/servers/42");
    expect(last().body).toEqual({ name: "new-name", labels: {} });
  });

  test("delete returns the action", async () => {
    const { servers, last } = setup({ action: serverAction("delete_server") });
    const result = await servers.delete(42);
    expect(result.action.command).toBe("delete_server");
    expect(last().method).toBe("DELETE");
    expect(last().path).toBe("/servers/42");
    expect(last().body).toBeUndefined();
  });

  describe("waitForStatus", () => {
    test("polls until the server has the status", async () => {
      const { servers, requests } = setup(
        { server: { ...server, status: "stopping" } },
        { server: { ...server, status: "stopping" } },
        { server: { ...server, status: "off" } },
      );
      const result = await servers.waitForStatus(42, "off", { pollInterval: 1 });
      expect(result.status).toBe("off");
      expect(requests).toHaveLength(3);
      expect(requests.every((request) => request.path === "/servers/42")).toBe(true);
    });

    test("accepts multiple statuses and returns immediately on a match", async () => {
      const { servers, requests } = setup({ server });
      const result = await servers.waitForStatus(42, ["off", "running"]);
      expect(result.id).toBe(42);
      expect(requests).toHaveLength(1);
    });

    test("throws a WAIT_TIMEOUT error on timeout", async () => {
      const { servers } = setup({ server });
      const error = await servers
        .waitForStatus(42, "off", { pollInterval: 2, timeout: 15 })
        .catch((e: unknown) => e);
      expect(error).toBeInstanceOf(HCloudError);
      expect((error as HCloudError).code).toBe(ErrorCode.WaitTimeout);
      expect((error as HCloudError).statusCode).toBe(0);
      expect((error as HCloudError).message).toContain("Server 42 did not reach status off");
    });

    test("can be aborted", async () => {
      const { servers } = setup({ server });
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 5);
      await expect(
        servers.waitForStatus(42, "off", { pollInterval: 60_000, signal: controller.signal }),
      ).rejects.toBeInstanceOf(HCloudAbortError);
    });
  });

  describe("getMetrics", () => {
    const metrics = {
      start: "2023-12-14T17:40:00+01:00",
      end: "2023-12-14T17:50:00+01:00",
      step: 3.0,
      time_series: {
        cpu: {
          values: [
            [1702572594, "0.3746000025854892"],
            [1702572597, "0.35842215349409734"],
            [1702572600, "0.7381525488039541"],
          ],
        },
        "disk.0.iops.read": {
          values: [
            [1702572594, "0"],
            [1702572597, "0"],
            [1702572600, "0"],
          ],
        },
        "disk.0.bandwidth.write": {
          values: [
            [1702572594, "24064"],
            [1702572597, "2048"],
            [1702572600, "0"],
          ],
        },
      },
    };

    test("joins types and converts dates to ISO strings", async () => {
      const { servers, last } = setup({ metrics });
      const result = await servers.getMetrics(42, {
        type: ["cpu", "disk"],
        start: new Date("2023-12-14T16:40:00.000Z"),
        end: new Date("2023-12-14T16:50:00.000Z"),
        step: 3,
      });

      expect(result.metrics.time_series.cpu?.values).toHaveLength(3);
      expect(last().method).toBe("GET");
      expect(last().path).toBe("/servers/42/metrics");
      expect(last().query).toEqual({
        type: ["cpu,disk"],
        start: ["2023-12-14T16:40:00.000Z"],
        end: ["2023-12-14T16:50:00.000Z"],
        step: ["3"],
      });
    });

    test("passes a single type and string dates through", async () => {
      const { servers, last } = setup({ metrics });
      await servers.getMetrics(42, {
        type: "network",
        start: "2023-12-14T17:40:00+01:00",
        end: "2023-12-14T17:50:00+01:00",
      });
      expect(last().query).toEqual({
        type: ["network"],
        start: ["2023-12-14T17:40:00+01:00"],
        end: ["2023-12-14T17:50:00+01:00"],
      });
    });
  });

  test("listActions", async () => {
    const actions = [serverAction("start_server", { id: 13, status: "success", progress: 100 })];
    const { servers, last } = setup({ actions, meta: metaFixture() });
    const result = await servers.listActions(42, { status: "running", sort: ["started:desc"] });
    expect(result.actions).toEqual(actions);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/servers/42/actions");
    expect(last().query).toEqual({ status: ["running"], sort: ["started:desc"] });
  });

  test("getAction", async () => {
    const { servers, last } = setup({ action: serverAction("start_server", { id: 13 }) });
    const result = await servers.getAction(42, 13);
    expect(result.action.id).toBe(13);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/servers/42/actions/13");
  });

  test("actions lists and gets actions of all servers", async () => {
    const { servers, last } = setup(
      { actions: [serverAction("start_server")] },
      { action: serverAction("start_server", { id: 13 }) },
    );
    await servers.actions.list({ status: "running" });
    expect(last().path).toBe("/servers/actions");
    expect(last().query).toEqual({ status: ["running"] });

    await servers.actions.get(13);
    expect(last().path).toBe("/servers/actions/13");
  });

  describe("actions without a request body", () => {
    const cases = [
      ["powerOn", "poweron"],
      ["powerOff", "poweroff"],
      ["reboot", "reboot"],
      ["reset", "reset"],
      ["shutdown", "shutdown"],
      ["detachISO", "detach_iso"],
      ["disableRescueMode", "disable_rescue"],
      ["enableBackups", "enable_backup"],
      ["disableBackups", "disable_backup"],
      ["removeFromPlacementGroup", "remove_from_placement_group"],
    ] as const;

    for (const [method, command] of cases) {
      test(method, async () => {
        const { servers, last } = setup({ action: serverAction(command) });
        const result = await servers[method](42, { headers: { "x-test": "1" } });
        expect(result.action.command).toBe(command);
        expect(last().method).toBe("POST");
        expect(last().path).toBe(`/servers/42/actions/${command}`);
        expect(last().body).toBeUndefined();
        expect(last().headers.get("x-test")).toBe("1");
      });
    }
  });

  describe("actions with a request body", () => {
    test("attachISO", async () => {
      const { servers, last } = setup({ action: serverAction("attach_iso") });
      await servers.attachISO(42, { iso: "FreeBSD-11.0-RELEASE-amd64-dvd1" });
      expect(last().method).toBe("POST");
      expect(last().path).toBe("/servers/42/actions/attach_iso");
      expect(last().body).toEqual({ iso: "FreeBSD-11.0-RELEASE-amd64-dvd1" });
    });

    test("changeProtection", async () => {
      const { servers, last } = setup({ action: serverAction("change_protection") });
      await servers.changeProtection(42, { delete: true, rebuild: true });
      expect(last().method).toBe("POST");
      expect(last().path).toBe("/servers/42/actions/change_protection");
      expect(last().body).toEqual({ delete: true, rebuild: true });
    });

    test("changeType requires upgrade_disk", async () => {
      const { servers, last, requests } = setup({ action: serverAction("change_server_type") });
      await servers.changeType(42, { server_type: "cx11", upgrade_disk: true });
      expect(last().method).toBe("POST");
      expect(last().path).toBe("/servers/42/actions/change_type");
      expect(last().body).toEqual({ server_type: "cx11", upgrade_disk: true });

      await servers.changeType(42, { server_type: 1, upgrade_disk: false });
      expect(last().body).toEqual({ server_type: 1, upgrade_disk: false });

      await expect(
        // @ts-expect-error upgrade_disk is required
        servers.changeType(42, { server_type: "cx11" }),
      ).rejects.toBeInstanceOf(HCloudValidationError);
      expect(requests).toHaveLength(2);
    });

    test("attachToNetwork", async () => {
      const action = serverAction("attach_to_network", {
        resources: [
          { id: 42, type: "server" },
          { id: 4711, type: "network" },
        ],
      });
      const { servers, last } = setup({ action });
      const params = {
        network: 4711,
        ip: "10.0.1.1",
        alias_ips: ["10.0.1.2", "10.0.1.3"],
        ip_range: "10.0.1.0/24",
      };
      const result = await servers.attachToNetwork(42, params);
      expect(result.action.resources).toHaveLength(2);
      expect(last().method).toBe("POST");
      expect(last().path).toBe("/servers/42/actions/attach_to_network");
      expect(last().body).toEqual(params);
    });

    test("detachFromNetwork", async () => {
      const { servers, last } = setup({ action: serverAction("detach_from_network") });
      await servers.detachFromNetwork(42, { network: 4711 });
      expect(last().method).toBe("POST");
      expect(last().path).toBe("/servers/42/actions/detach_from_network");
      expect(last().body).toEqual({ network: 4711 });
    });

    test("changeAliasIPs", async () => {
      const { servers, last } = setup({ action: serverAction("change_alias_ips") });
      await servers.changeAliasIPs(42, { network: 4711, alias_ips: ["10.0.1.2", "10.0.1.3"] });
      expect(last().method).toBe("POST");
      expect(last().path).toBe("/servers/42/actions/change_alias_ips");
      expect(last().body).toEqual({ network: 4711, alias_ips: ["10.0.1.2", "10.0.1.3"] });
    });

    test("changeReverseDNS sets and resets the entry", async () => {
      const { servers, last } = setup({ action: serverAction("change_dns_ptr") });
      await servers.changeReverseDNS(42, { ip: "1.2.3.4", dns_ptr: "example.com" });
      expect(last().method).toBe("POST");
      expect(last().path).toBe("/servers/42/actions/change_dns_ptr");
      expect(last().body).toEqual({ ip: "1.2.3.4", dns_ptr: "example.com" });

      await servers.changeReverseDNS(42, { ip: "1.2.3.4", dns_ptr: null });
      expect(last().body).toEqual({ ip: "1.2.3.4", dns_ptr: null });
    });

    test("addToPlacementGroup", async () => {
      const { servers, last } = setup({ action: serverAction("add_to_placement_group") });
      await servers.addToPlacementGroup(42, { placement_group: 897 });
      expect(last().method).toBe("POST");
      expect(last().path).toBe("/servers/42/actions/add_to_placement_group");
      expect(last().body).toEqual({ placement_group: 897 });
    });
  });

  describe("actions with additional response data", () => {
    test("resetRootPassword", async () => {
      const { servers, last } = setup({
        action: serverAction("reset_password"),
        root_password: "YItygq1v3GYjjMomLaKc",
      });
      const result = await servers.resetRootPassword(42);
      expect(result.root_password).toBe("YItygq1v3GYjjMomLaKc");
      expect(last().method).toBe("POST");
      expect(last().path).toBe("/servers/42/actions/reset_password");
      expect(last().body).toBeUndefined();
    });

    test("enableRescueMode", async () => {
      const { servers, last, requests } = setup({
        action: serverAction("enable_rescue"),
        root_password: "YItygq1v3GYjjMomLaKc",
      });
      const result = await servers.enableRescueMode(42, { type: "linux64", ssh_keys: [2323] });
      expect(result.root_password).toBe("YItygq1v3GYjjMomLaKc");
      expect(last().method).toBe("POST");
      expect(last().path).toBe("/servers/42/actions/enable_rescue");
      expect(last().body).toEqual({ type: "linux64", ssh_keys: [2323] });

      await servers.enableRescueMode(42);
      expect(last().body).toEqual({});

      await expect(
        // @ts-expect-error SSH keys are passed by ID
        servers.enableRescueMode(42, { ssh_keys: ["my-key"] }),
      ).rejects.toBeInstanceOf(HCloudValidationError);
      expect(requests).toHaveLength(2);
    });

    test("createImage", async () => {
      const { servers, last } = setup({
        image: { ...image, status: "creating", name: null, description: "my image" },
        action: serverAction("create_image"),
      });
      const params = {
        description: "my image",
        type: "snapshot",
        labels: { key: "value" },
      } as const;
      const result = await servers.createImage(42, params);
      expect(result.image.description).toBe("my image");
      expect(result.action.command).toBe("create_image");
      expect(last().method).toBe("POST");
      expect(last().path).toBe("/servers/42/actions/create_image");
      expect(last().body).toEqual(params);

      await servers.createImage(42);
      expect(last().body).toEqual({});
    });

    test("rebuild", async () => {
      const { servers, last } = setup(
        { action: serverAction("rebuild_server"), root_password: "YItygq1v3GYjjMomLaKc" },
        { action: serverAction("rebuild_server"), root_password: null },
      );
      const result = await servers.rebuild(42, {
        image: "ubuntu-20.04",
        user_data: "#cloud-config",
      });
      expect(result.root_password).toBe("YItygq1v3GYjjMomLaKc");
      expect(last().method).toBe("POST");
      expect(last().path).toBe("/servers/42/actions/rebuild");
      expect(last().body).toEqual({ image: "ubuntu-20.04", user_data: "#cloud-config" });

      expect((await servers.rebuild(42, { image: 4711 })).root_password).toBeNull();
      expect(last().body).toEqual({ image: 4711 });
    });

    test("requestConsole", async () => {
      const { servers, last } = setup({
        wss_url:
          "wss://console.hetzner.cloud/?server_id=1&token=3db32d15-af2f-459c-8bf8-dee1fd05f49c",
        password: "9MQaTg2VAGI0FIpc10k3UpRXcHj2wQ6x",
        action: serverAction("request_console", {
          status: "success",
          finished: "2016-01-30T23:56:00+00:00",
        }),
      });
      const result = await servers.requestConsole(42);
      expect(result.wss_url).toStartWith("wss://console.hetzner.cloud/");
      expect(result.password).toBe("9MQaTg2VAGI0FIpc10k3UpRXcHj2wQ6x");
      expect(last().method).toBe("POST");
      expect(last().path).toBe("/servers/42/actions/request_console");
      expect(last().body).toBeUndefined();
    });
  });
});
