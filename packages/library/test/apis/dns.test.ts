import { describe, expect, test } from "bun:test";
import { ResourceActionsClient } from "../../src/apis/actions/index";
import { DNSClient } from "../../src/apis/dns/index";
import { rrsetSchema, zoneSchema } from "../../src/apis/dns/schemas";
import type { RRSet, RRSetType, Zone } from "../../src/apis/dns/types";
import { HCloudValidationError } from "../../src/core/errors";
import { actionFixture, metaFixture, mockClient } from "../helpers";

const zone1: Zone = {
  id: 42,
  name: "example1.com",
  created: "2016-01-30T23:55:00+00:00",
  mode: "primary",
  ttl: 10800,
  protection: { delete: false },
  labels: { key: "value" },
  primary_nameservers: [
    { address: "198.51.100.1", port: 53 },
    { address: "203.0.113.1", port: 53 },
  ],
  record_count: 0,
  status: "ok",
  registrar: "hetzner",
  authoritative_nameservers: {
    assigned: ["hydrogen.ns.hetzner.com.", "oxygen.ns.hetzner.com.", "helium.ns.hetzner.de."],
    delegated: ["hydrogen.ns.hetzner.com.", "oxygen.ns.hetzner.com.", "helium.ns.hetzner.de."],
    delegation_last_check: "2016-01-30T23:55:00+00:00",
    delegation_status: "valid",
  },
};

const zone2: Zone = {
  ...zone1,
  id: 43,
  name: "example2.com",
  mode: "secondary",
  authoritative_nameservers: { ...zone1.authoritative_nameservers, assigned: [] },
};

const rrset1: RRSet = {
  zone: 42,
  id: "www/A",
  name: "www",
  type: "A",
  ttl: 3600,
  labels: { key: "value" },
  protection: { change: false },
  records: [{ value: "198.51.100.1", comment: "web server" }],
};

const rrset2: RRSet = { ...rrset1, id: "blog/A", name: "blog" };

const action = actionFixture({ command: "command", resources: [{ id: 42, type: "zone" }] });

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, dns: new DNSClient(mock.client) };
}

describe("DNSClient zones", () => {
  test("listZones sends filters as query parameters", async () => {
    const { dns, last } = setup({ zones: [zone1, zone2], meta: metaFixture() });

    const result = await dns.listZones({
      name: "example1.com",
      mode: "primary",
      label_selector: "key=value",
      sort: ["name:asc", "created:desc"],
      page: 2,
      per_page: 10,
    });

    expect(result.zones).toEqual([zone1, zone2]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/zones");
    expect(last().query).toEqual({
      name: ["example1.com"],
      mode: ["primary"],
      label_selector: ["key=value"],
      sort: ["name:asc", "created:desc"],
      page: ["2"],
      per_page: ["10"],
    });
  });

  test("listZones accepts a response without meta", async () => {
    const { dns, last } = setup({ zones: [zone1] });
    const { zones } = await dns.listZones();
    expect(zones).toHaveLength(1);
    expect(last().query).toEqual({});
  });

  test("iterateZones and listAllZones follow pagination", async () => {
    const pages = [
      { zones: [zone1], meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }) },
      { zones: [zone2], meta: metaFixture({ page: 2, previous_page: 1, total_entries: 2 }) },
    ];

    const iterated = setup(...pages);
    const names: string[] = [];
    for await (const zone of iterated.dns.iterateZones({ mode: "primary", per_page: 1 })) {
      names.push(zone.name);
    }
    expect(names).toEqual(["example1.com", "example2.com"]);
    expect(iterated.requests.map((request) => request.query)).toEqual([
      { mode: ["primary"], page: ["1"], per_page: ["1"] },
      { mode: ["primary"], page: ["2"], per_page: ["1"] },
    ]);

    const listed = setup(...pages);
    const all: Zone[] = await listed.dns.listAllZones({ label_selector: "key=value" });
    expect(all.map((zone) => zone.id)).toEqual([42, 43]);
    expect(listed.requests.map((request) => request.path)).toEqual(["/zones", "/zones"]);
    expect(listed.requests.map((request) => request.query)).toEqual([
      { label_selector: ["key=value"], page: ["1"], per_page: ["50"] },
      { label_selector: ["key=value"], page: ["2"], per_page: ["50"] },
    ]);
  });

  test("createZone validates and sends the body", async () => {
    const { dns, last, requests } = setup({ zone: zone1, action });

    const result = await dns.createZone({
      name: "example.com",
      mode: "primary",
      ttl: 3600,
      labels: { key: "value" },
      primary_nameservers: [{ address: "198.51.100.1", port: 53 }, { address: "203.0.113.1" }],
      rrsets: [{ name: "www", type: "A", records: [{ value: "127.0.0.1" }] }],
    });

    expect(result.zone.id).toBe(42);
    expect(result.action.id).toBe(1);
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/zones");
    expect(last().body).toEqual({
      name: "example.com",
      mode: "primary",
      ttl: 3600,
      labels: { key: "value" },
      primary_nameservers: [{ address: "198.51.100.1", port: 53 }, { address: "203.0.113.1" }],
      rrsets: [{ name: "www", type: "A", records: [{ value: "127.0.0.1" }] }],
    });

    // @ts-expect-error - `mode` is required
    await expect(dns.createZone({ name: "example.com" })).rejects.toBeInstanceOf(
      HCloudValidationError,
    );
    await expect(dns.createZone({ name: "", mode: "primary" })).rejects.toBeInstanceOf(
      HCloudValidationError,
    );
    expect(requests).toHaveLength(1);
  });

  test("createZone from a zone file", async () => {
    const { dns, last } = setup({ zone: zone1, action });
    await dns.createZone({
      name: "example.com",
      mode: "primary",
      zonefile: "$ORIGIN example.com.",
    });
    expect(last().body).toEqual({
      name: "example.com",
      mode: "primary",
      zonefile: "$ORIGIN example.com.",
    });
  });

  test("getZone by ID and by name", async () => {
    const { dns, last } = setup({ zone: zone1 });

    const byId = await dns.getZone(42);
    expect(byId.zone.name).toBe("example1.com");
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/zones/42");

    await dns.getZone("example1.com");
    expect(last().path).toBe("/zones/example1.com");
  });

  test("zone identifiers are URI-encoded", async () => {
    const { dns, last } = setup({ zone: zone1 });
    await dns.getZone("bad/name?x=1");
    expect(last().path).toBe("/zones/bad%2Fname%3Fx%3D1");
    expect(last().query).toEqual({});
  });

  test("updateZone", async () => {
    const { dns, last } = setup({ zone: zone1 });
    const result = await dns.updateZone("example1.com", { labels: { key: "new value" } });
    expect(result.zone.id).toBe(42);
    expect(last().method).toBe("PUT");
    expect(last().path).toBe("/zones/example1.com");
    expect(last().body).toEqual({ labels: { key: "new value" } });
  });

  test("deleteZone returns the action", async () => {
    const { dns, last } = setup({ action });
    const result = await dns.deleteZone(42);
    expect(result.action.id).toBe(1);
    expect(last().method).toBe("DELETE");
    expect(last().path).toBe("/zones/42");
    expect(last().body).toBeUndefined();
  });

  test("exportZone reads the zone file", async () => {
    const { dns, last } = setup({ zonefile: "content" });
    const result = await dns.exportZone("example1.com");
    expect(result.zonefile).toBe("content");
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/zones/example1.com/zonefile");
  });

  test("request options are forwarded", async () => {
    const { dns, last } = setup({ zone: zone1 });
    await dns.getZone(42, { headers: { "x-test": "1" } });
    expect(last().headers.get("x-test")).toBe("1");
  });

  test("a zone without primary nameservers is valid", () => {
    const { primary_nameservers: _omitted, ...withoutNameservers } = zone1;
    expect(zoneSchema.safeParse(withoutNameservers).success).toBe(true);
    expect(zoneSchema.safeParse({ ...zone1, primary_nameservers: null }).success).toBe(true);
    expect(
      zoneSchema.safeParse({
        ...zone1,
        authoritative_nameservers: {
          ...zone1.authoritative_nameservers,
          delegation_last_check: null,
        },
      }).success,
    ).toBe(true);
  });
});

describe("DNSClient zone actions", () => {
  test("actions client is scoped to /zones", async () => {
    const { dns, last } = setup({ actions: [action], meta: metaFixture() });
    expect(dns.actions).toBeInstanceOf(ResourceActionsClient);

    await dns.actions.list({ status: "running" });
    expect(last().path).toBe("/zones/actions");
    expect(last().query).toEqual({ status: ["running"] });
  });

  test("actions.get", async () => {
    const { dns, last } = setup({ action });
    const result = await dns.actions.get(1);
    expect(result.action.id).toBe(1);
    expect(last().path).toBe("/zones/actions/1");
  });

  test("listZoneActions", async () => {
    const { dns, last } = setup({ actions: [action], meta: metaFixture() });
    const result = await dns.listZoneActions("example1.com", {
      status: ["running", "error"],
      sort: "id:desc",
      page: 2,
      per_page: 10,
    });
    expect(result.actions).toHaveLength(1);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/zones/example1.com/actions");
    expect(last().query).toEqual({
      status: ["running", "error"],
      sort: ["id:desc"],
      page: ["2"],
      per_page: ["10"],
    });
  });

  test("getZoneAction", async () => {
    const { dns, last } = setup({ action });
    const result = await dns.getZoneAction(42, 1);
    expect(result.action.command).toBe("command");
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/zones/42/actions/1");
  });

  test("changeZonePrimaryNameservers", async () => {
    const { dns, last, requests } = setup({ action });
    const result = await dns.changeZonePrimaryNameservers("example1.com", {
      primary_nameservers: [
        { address: "198.51.100.1", port: 53 },
        { address: "203.0.113.1", tsig_algorithm: "hmac-sha256", tsig_key: "c2VjcmV0" },
      ],
    });
    expect(result.action.id).toBe(1);
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/zones/example1.com/actions/change_primary_nameservers");
    expect(last().body).toEqual({
      primary_nameservers: [
        { address: "198.51.100.1", port: 53 },
        { address: "203.0.113.1", tsig_algorithm: "hmac-sha256", tsig_key: "c2VjcmV0" },
      ],
    });

    await expect(
      // @ts-expect-error - v1 sent `nameservers`, the API expects `primary_nameservers`
      dns.changeZonePrimaryNameservers("example1.com", { nameservers: ["198.51.100.1"] }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    expect(requests).toHaveLength(1);
  });

  test("changeZoneProtection", async () => {
    const { dns, last } = setup({ action });
    await dns.changeZoneProtection(42, { delete: true });
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/zones/42/actions/change_protection");
    expect(last().body).toEqual({ delete: true });
  });

  test("changeZoneDefaultTTL", async () => {
    const { dns, last, requests } = setup({ action });
    await dns.changeZoneDefaultTTL(42, { ttl: 3600 });
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/zones/42/actions/change_ttl");
    expect(last().body).toEqual({ ttl: 3600 });

    // @ts-expect-error - `ttl` must be a number
    await expect(dns.changeZoneDefaultTTL(42, { ttl: "3600" })).rejects.toBeInstanceOf(
      HCloudValidationError,
    );
    expect(requests).toHaveLength(1);
  });

  test("importZoneFile", async () => {
    const { dns, last, requests } = setup({ action });
    const result = await dns.importZoneFile("example1.com", { zonefile: "content" });
    expect(result.action.id).toBe(1);
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/zones/example1.com/actions/import_zonefile");
    expect(last().body).toEqual({ zonefile: "content" });

    // v1 sent `zone_file`, the API expects `zonefile`
    const v1Params = { zone_file: "content" } as unknown as { zonefile: string };
    await expect(dns.importZoneFile("example1.com", v1Params)).rejects.toBeInstanceOf(
      HCloudValidationError,
    );
    expect(requests).toHaveLength(1);
  });
});

describe("DNSClient RRSets", () => {
  test("listRRSets sends filters as query parameters", async () => {
    const { dns, last } = setup({ rrsets: [rrset1, rrset2], meta: metaFixture() });

    const result = await dns.listRRSets("example1.com", {
      name: "www",
      type: ["A", "AAAA"],
      label_selector: "key=value",
      sort: "name:asc",
      page: 2,
      per_page: 10,
    });

    expect(result.rrsets).toEqual([rrset1, rrset2]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/zones/example1.com/rrsets");
    expect(last().query).toEqual({
      name: ["www"],
      type: ["A", "AAAA"],
      label_selector: ["key=value"],
      sort: ["name:asc"],
      page: ["2"],
      per_page: ["10"],
    });
  });

  test("iterateRRSets and listAllRRSets follow pagination", async () => {
    const pages = [
      { rrsets: [rrset1], meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }) },
      { rrsets: [rrset2], meta: metaFixture({ page: 2, previous_page: 1, total_entries: 2 }) },
    ];

    const iterated = setup(...pages);
    const ids: string[] = [];
    for await (const rrset of iterated.dns.iterateRRSets(42, { type: "A" })) ids.push(rrset.id);
    expect(ids).toEqual(["www/A", "blog/A"]);
    expect(iterated.requests.map((request) => request.path)).toEqual([
      "/zones/42/rrsets",
      "/zones/42/rrsets",
    ]);
    expect(iterated.requests.map((request) => request.query)).toEqual([
      { type: ["A"], page: ["1"], per_page: ["50"] },
      { type: ["A"], page: ["2"], per_page: ["50"] },
    ]);

    const listed = setup(...pages);
    const all: RRSet[] = await listed.dns.listAllRRSets("example1.com", { per_page: 1 });
    expect(all.map((rrset) => rrset.name)).toEqual(["www", "blog"]);
    expect(listed.requests.map((request) => request.query.page)).toEqual([["1"], ["2"]]);
    expect(listed.requests.map((request) => request.query.per_page)).toEqual([["1"], ["1"]]);
  });

  test("getRRSet", async () => {
    const { dns, last } = setup({ rrset: rrset1 });
    const result = await dns.getRRSet(42, "www", "A");
    expect(result.rrset.records).toEqual([{ value: "198.51.100.1", comment: "web server" }]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/zones/42/rrsets/www/A");
  });

  test("RRSet names and types are URI-encoded", async () => {
    const { dns, last } = setup({ rrset: { ...rrset1, id: "@/A", name: "@" } });

    await dns.getRRSet("example1.com", "@", "A");
    expect(last().path).toBe("/zones/example1.com/rrsets/%40/A");

    await dns.getRRSet("example1.com", "a/b", "A");
    expect(last().path).toBe("/zones/example1.com/rrsets/a%2Fb/A");
  });

  test("RRSet types unknown to the SDK are accepted", async () => {
    const future: RRSetType = "NAPTR";
    const { dns, last } = setup({ rrset: { ...rrset1, id: "www/NAPTR", type: future }, action });

    const { rrset } = await dns.createRRSet(42, { name: "www", type: future });
    expect(rrset.type).toBe("NAPTR");
    expect(last().body).toEqual({ name: "www", type: "NAPTR" });

    expect(rrsetSchema.safeParse({ ...rrset1, type: "" }).success).toBe(false);
    expect(rrsetSchema.safeParse({ ...rrset1, type: 1 }).success).toBe(false);
  });

  test("createRRSet validates and sends the body", async () => {
    const { dns, last, requests } = setup({ rrset: rrset1, action });

    const result = await dns.createRRSet("example1.com", {
      name: "www",
      type: "A",
      ttl: 3600,
      labels: { key: "value" },
      records: [{ value: "198.51.100.1", comment: "web server" }, { value: "127.0.0.1" }],
    });

    expect(result.rrset.id).toBe("www/A");
    expect(result.action.id).toBe(1);
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/zones/example1.com/rrsets");
    expect(last().body).toEqual({
      name: "www",
      type: "A",
      ttl: 3600,
      labels: { key: "value" },
      records: [{ value: "198.51.100.1", comment: "web server" }, { value: "127.0.0.1" }],
    });

    await expect(
      dns.createRRSet("example1.com", { name: "www", type: "A", records: [{ value: "" }] }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    await expect(dns.createRRSet("example1.com", { name: "www", type: "" })).rejects.toBeInstanceOf(
      HCloudValidationError,
    );
    expect(requests).toHaveLength(1);
  });

  test("updateRRSet", async () => {
    const { dns, last } = setup({ rrset: rrset1 });
    const result = await dns.updateRRSet(42, "www", "A", { labels: { key: "new value" } });
    expect(result.rrset.name).toBe("www");
    expect(last().method).toBe("PUT");
    expect(last().path).toBe("/zones/42/rrsets/www/A");
    expect(last().body).toEqual({ labels: { key: "new value" } });
  });

  test("deleteRRSet returns the action", async () => {
    const { dns, last } = setup({ action });
    const result = await dns.deleteRRSet(42, "www", "A");
    expect(result.action.id).toBe(1);
    expect(last().method).toBe("DELETE");
    expect(last().path).toBe("/zones/42/rrsets/www/A");
  });

  test("an RRSet using the default TTL of the zone is valid", () => {
    expect(rrsetSchema.safeParse({ ...rrset1, ttl: null }).success).toBe(true);
    expect(rrsetSchema.safeParse({ ...rrset1, records: [{ value: "198.51.100.1" }] }).success).toBe(
      true,
    );
  });
});

describe("DNSClient RRSet actions", () => {
  test("changeRRSetProtection", async () => {
    const { dns, last } = setup({ action });
    const result = await dns.changeRRSetProtection(42, "www", "A", { change: true });
    expect(result.action.id).toBe(1);
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/zones/42/rrsets/www/A/actions/change_protection");
    expect(last().body).toEqual({ change: true });
  });

  test("changeRRSetTTL sets or resets the TTL", async () => {
    const { dns, last, requests } = setup({ action });

    await dns.changeRRSetTTL(42, "www", "A", { ttl: 3600 });
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/zones/42/rrsets/www/A/actions/change_ttl");
    expect(last().body).toEqual({ ttl: 3600 });

    await dns.changeRRSetTTL(42, "www", "A", { ttl: null });
    expect(last().body).toEqual({ ttl: null });

    // @ts-expect-error - `ttl` is required
    await expect(dns.changeRRSetTTL(42, "www", "A", {})).rejects.toBeInstanceOf(
      HCloudValidationError,
    );
    expect(requests).toHaveLength(2);
  });

  test("setRRSetRecords", async () => {
    const { dns, last } = setup({ action });
    await dns.setRRSetRecords("example1.com", "@", "A", {
      records: [{ value: "198.51.100.1", comment: "web server" }, { value: "127.0.0.1" }],
    });
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/zones/example1.com/rrsets/%40/A/actions/set_records");
    expect(last().body).toEqual({
      records: [{ value: "198.51.100.1", comment: "web server" }, { value: "127.0.0.1" }],
    });
  });

  test("addRRSetRecords", async () => {
    const { dns, last } = setup({ action });
    await dns.addRRSetRecords(42, "www", "A", {
      records: [{ value: "198.51.100.1", comment: "web server" }, { value: "127.0.0.1" }],
      ttl: 300,
    });
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/zones/42/rrsets/www/A/actions/add_records");
    expect(last().body).toEqual({
      records: [{ value: "198.51.100.1", comment: "web server" }, { value: "127.0.0.1" }],
      ttl: 300,
    });
  });

  test("removeRRSetRecords", async () => {
    const { dns, last, requests } = setup({ action });
    await dns.removeRRSetRecords(42, "www", "A", {
      records: [{ value: "198.51.100.1", comment: "web server" }, { value: "127.0.0.1" }],
    });
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/zones/42/rrsets/www/A/actions/remove_records");
    expect(last().body).toEqual({
      records: [{ value: "198.51.100.1", comment: "web server" }, { value: "127.0.0.1" }],
    });

    // @ts-expect-error - `records` is required
    await expect(dns.removeRRSetRecords(42, "www", "A", {})).rejects.toBeInstanceOf(
      HCloudValidationError,
    );
    expect(requests).toHaveLength(1);
  });

  test("updateRRSetRecords", async () => {
    const { dns, last } = setup({ action });
    await dns.updateRRSetRecords(42, "www", "A", {
      records: [
        { value: "198.51.100.1", comment: "web server" },
        { value: "198.51.100.2", comment: "" },
        { value: "127.0.0.1" },
      ],
    });
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/zones/42/rrsets/www/A/actions/update_records");
    expect(last().body).toEqual({
      records: [
        { value: "198.51.100.1", comment: "web server" },
        { value: "198.51.100.2", comment: "" },
        { value: "127.0.0.1" },
      ],
    });
  });
});
