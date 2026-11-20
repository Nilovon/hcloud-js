import { describe, expect, test } from "bun:test";
import { VolumesClient } from "../../src/apis/volumes/index";
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

const volume = {
  id: 1,
  created: "2016-01-30T23:50:11+00:00",
  name: "database-storage",
  server: 12,
  location,
  size: 42,
  linux_device: "/dev/disk/by-id/scsi-0HC_Volume_4711",
  protection: { delete: false },
  format: "xfs",
  labels: {},
  status: "available" as "available" | "creating",
};

const volume2 = { ...volume, id: 2, name: "vault-storage", server: 10 };

const action = actionFixture({
  id: 13,
  command: "attach_volume",
  started: "2016-01-30T23:50+00:00",
  resources: [
    { id: 12, type: "server" },
    { id: 1, type: "volume" },
  ],
});

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, volumes: new VolumesClient(mock.client) };
}

describe("VolumesClient", () => {
  test("list sends filters as query parameters", async () => {
    const { volumes, last } = setup({
      volumes: [volume, volume2],
      meta: metaFixture({ total_entries: 2 }),
    });

    const result = await volumes.list({
      name: "database-storage",
      label_selector: "environment=prod",
      status: ["available", "creating"],
      sort: ["name:asc", "created:desc"],
      page: 2,
      per_page: 25,
    });

    expect(result.volumes).toEqual([volume, volume2]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/volumes");
    expect(last().query).toEqual({
      name: ["database-storage"],
      label_selector: ["environment=prod"],
      status: ["available", "creating"],
      sort: ["name:asc", "created:desc"],
      page: ["2"],
      per_page: ["25"],
    });
  });

  test("get", async () => {
    const { volumes, last } = setup({ volume });
    const result = await volumes.get(1);
    expect(result.volume.linux_device).toBe("/dev/disk/by-id/scsi-0HC_Volume_4711");
    expect(result.volume.location.name).toBe("fsn1");
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/volumes/1");
  });

  test("accepts a detached, unformatted volume that is being created", async () => {
    const creating = { ...volume, server: null, format: null, status: "creating" };
    const { volumes } = setup({ volume: creating });
    const result = await volumes.get(1);
    expect(result.volume.server).toBeNull();
    expect(result.volume.format).toBeNull();
  });

  test("getByName returns the exact match or undefined", async () => {
    const { volumes, last } = setup({ volumes: [volume] }, { volumes: [] });
    expect(await volumes.getByName("database-storage")).toEqual(volume);
    expect(last().query).toEqual({ name: ["database-storage"] });

    expect(await volumes.getByName("missing")).toBeUndefined();
    expect(last().query).toEqual({ name: ["missing"] });
  });

  test("create attached to a server returns the volume, action and next actions", async () => {
    const created = {
      volume: { ...volume, id: 4711 },
      action: actionFixture({
        id: 13,
        command: "create_volume",
        started: "2016-01-30T23:50+00:00",
        resources: [{ id: 4711, type: "volume" }],
      }),
      next_actions: [action],
    };
    const { volumes, last } = setup(created);

    const result = await volumes.create({
      name: "database-storage",
      size: 42,
      server: 12,
      automount: true,
      format: "xfs",
      labels: { environment: "prod" },
    });
    expect(result.volume.id).toBe(4711);
    expect(result.action.command).toBe("create_volume");
    expect(result.next_actions).toEqual([action]);
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/volumes");
    expect(last().body).toEqual({
      name: "database-storage",
      size: 42,
      server: 12,
      automount: true,
      format: "xfs",
      labels: { environment: "prod" },
    });
  });

  test("create in a location", async () => {
    const { volumes, last } = setup({
      volume: { ...volume, server: null, format: null },
      action: actionFixture({ command: "create_volume" }),
      next_actions: [],
    });
    const result = await volumes.create({ name: "database-storage", size: 42, location: "fsn1" });
    expect(result.next_actions).toEqual([]);
    expect(last().body).toEqual({ name: "database-storage", size: 42, location: "fsn1" });
  });

  test("create rejects invalid parameters before sending a request", async () => {
    const { volumes, requests } = setup({});

    // Neither location nor server
    await expect(volumes.create({ name: "a", size: 10 })).rejects.toBeInstanceOf(
      HCloudValidationError,
    );
    // Both location and server
    await expect(
      volumes.create({ name: "a", size: 10, location: "fsn1", server: 12 }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    await expect(volumes.create({ name: "a", size: 0, location: "fsn1" })).rejects.toBeInstanceOf(
      HCloudValidationError,
    );
    await expect(
      // @ts-expect-error unsupported filesystem
      volumes.create({ name: "a", size: 10, location: "fsn1", format: "ntfs" }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    expect(requests).toHaveLength(0);
  });

  test("update", async () => {
    const { volumes, last } = setup({ volume: { ...volume, id: 4711, name: "new-name" } });
    const result = await volumes.update(4711, { name: "new-name", labels: { key: "value" } });
    expect(result.volume.name).toBe("new-name");
    expect(last().method).toBe("PUT");
    expect(last().path).toBe("/volumes/4711");
    expect(last().body).toEqual({ name: "new-name", labels: { key: "value" } });
  });

  test("delete resolves without a value", async () => {
    const { volumes, last } = setup(undefined);
    expect(await volumes.delete(1)).toBeUndefined();
    expect(last().method).toBe("DELETE");
    expect(last().path).toBe("/volumes/1");
  });

  test("listActions", async () => {
    const finished = actionFixture({
      id: 13,
      command: "attach_volume",
      status: "success",
      progress: 100,
      started: "2016-01-30T23:55:00+00:00",
      finished: "2016-01-30T23:56:00+00:00",
    });
    const { volumes, last } = setup({ actions: [finished], meta: metaFixture() });

    const result = await volumes.listActions(1, { status: ["success"], sort: "id:desc" });
    expect(result.actions).toEqual([finished]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/volumes/1/actions");
    expect(last().query).toEqual({ status: ["success"], sort: ["id:desc"] });
  });

  test("getAction", async () => {
    const { volumes, last } = setup({ action });
    const result = await volumes.getAction(1, 13);
    expect(result.action.command).toBe("attach_volume");
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/volumes/1/actions/13");
  });

  test("actions lists and fetches actions of all volumes", async () => {
    const { volumes, last } = setup({ actions: [action], meta: metaFixture() }, { action });
    const { actions } = await volumes.actions.list({ status: "running" });
    expect(actions).toEqual([action]);
    expect(last().path).toBe("/volumes/actions");
    expect(last().query).toEqual({ status: ["running"] });

    await volumes.actions.get(13);
    expect(last().path).toBe("/volumes/actions/13");
  });

  test("attachToServer", async () => {
    const { volumes, last, requests } = setup({ action });
    const result = await volumes.attachToServer(1, { server: 12, automount: true });
    expect(result.action).toEqual(action);
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/volumes/1/actions/attach");
    expect(last().body).toEqual({ server: 12, automount: true });

    await volumes.attachToServer(1, { server: 12 });
    expect(last().body).toEqual({ server: 12 });

    await expect(
      // @ts-expect-error `server` is required
      volumes.attachToServer(1, { automount: true }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    expect(requests).toHaveLength(2);
  });

  test("detach sends no body", async () => {
    const { volumes, last } = setup({ action: { ...action, command: "detach_volume" } });
    const result = await volumes.detach(1);
    expect(result.action.command).toBe("detach_volume");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/volumes/1/actions/detach");
    expect(last().body).toBeUndefined();
  });

  test("resize", async () => {
    const { volumes, last, requests } = setup({ action: { ...action, command: "resize_volume" } });
    const result = await volumes.resize(1, { size: 50 });
    expect(result.action.command).toBe("resize_volume");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/volumes/1/actions/resize");
    expect(last().body).toEqual({ size: 50 });

    await expect(volumes.resize(1, { size: -1 })).rejects.toBeInstanceOf(HCloudValidationError);
    expect(requests).toHaveLength(1);
  });

  test("changeProtection", async () => {
    const { volumes, last } = setup({ action: { ...action, command: "change_protection" } });
    const result = await volumes.changeProtection(1, { delete: true });
    expect(result.action.command).toBe("change_protection");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/volumes/1/actions/change_protection");
    expect(last().body).toEqual({ delete: true });
  });

  test("forwards request options", async () => {
    const { volumes, last } = setup({ action });
    await volumes.detach(1, { headers: { "x-test": "1" } });
    expect(last().headers.get("x-test")).toBe("1");
  });

  test("listAll follows pagination", async () => {
    const { volumes, requests } = setup(
      { volumes: [volume], meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }) },
      { volumes: [volume2], meta: metaFixture({ page: 2, previous_page: 1 }) },
    );
    const all = await volumes.listAll();
    expect(all.map((item) => item.id)).toEqual([1, 2]);
    expect(requests.map((request) => request.query.page)).toEqual([["1"], ["2"]]);
  });
});
