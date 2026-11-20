import { describe, expect, test } from "bun:test";
import { StorageBoxesClient } from "../../src/apis/storage-boxes/index";
import { HCloudValidationError } from "../../src/core/errors";
import { actionFixture, metaFixture, mockClient } from "../helpers";

const HETZNER_HOST = "api.hetzner.com";

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

const storageBoxType1 = {
  id: 42,
  name: "bx11",
  description: "BX11",
  snapshot_limit: 10,
  automatic_snapshot_limit: 10,
  subaccounts_limit: 100,
  size: 1099511627776,
  prices: [
    {
      location: "fsn1",
      price_hourly: { gross: "0.0051", net: "0.0051" },
      price_monthly: { gross: "3.2000", net: "3.2000" },
      setup_fee: { gross: "0.0000", net: "0.0000" },
    },
  ],
  deprecation: null,
};

const storageBox1 = {
  id: 42,
  name: "storage-box1",
  created: "2025-01-30T23:55:00+00:00",
  status: "active" as const,
  system: "FSN1-BX355",
  server: "u1337.your-storagebox.de",
  username: "u12345",
  storage_box_type: storageBoxType1,
  location,
  access_settings: {
    reachable_externally: false,
    samba_enabled: false,
    ssh_enabled: false,
    webdav_enabled: false,
    zfs_enabled: false,
  },
  snapshot_plan: {
    max_snapshots: 20,
    minute: 0,
    hour: 7,
    day_of_week: 7,
    day_of_month: null,
  },
  stats: {
    size: 2342236717056,
    size_data: 2102612983808,
    size_snapshots: 239623733248,
  },
  labels: { key: "value" },
  protection: { delete: false },
};

const storageBox2 = {
  ...storageBox1,
  id: 43,
  name: "storage-box2",
  created: "2022-09-30T10:30:09.000Z",
  storage_box_type: { ...storageBoxType1, id: 1334, name: "bx21", description: "BX21" },
  access_settings: {
    webdav_enabled: false,
    zfs_enabled: false,
    samba_enabled: false,
    ssh_enabled: true,
    reachable_externally: true,
  },
  snapshot_plan: null,
  labels: {},
};

const snapshot1 = {
  id: 34,
  name: "storage-box-snapshot1",
  description: "",
  is_automatic: false,
  stats: { size: 394957594, size_filesystem: 3949572745 },
  labels: { key: "value" },
  created: "2025-11-10T19:16:57Z",
  storage_box: 42,
};

const snapshot2 = {
  id: 35,
  name: "storage-box-snapshot2",
  description: "",
  is_automatic: true,
  stats: { size: 0, size_filesystem: 0 },
  labels: {},
  created: "2025-11-10T19:18:57Z",
  storage_box: 42,
};

const subaccount1 = {
  id: 45,
  name: "subaccount1",
  username: "u42-sub1",
  server: "u42-sub1.your-storagebox.de",
  home_directory: "tmp/",
  description: "Required by foo",
  access_settings: {
    samba_enabled: false,
    ssh_enabled: true,
    webdav_enabled: false,
    reachable_externally: true,
    readonly: false,
  },
  labels: { key: "value" },
  created: "2025-11-10T19:18:57Z",
  storage_box: 42,
};

// Subaccount as returned before `name` was added to the API.
const subaccount2 = {
  id: 46,
  username: "u42-sub2",
  server: "u42-sub2.your-storagebox.de",
  home_directory: "backup/",
  description: "",
  access_settings: {
    samba_enabled: false,
    ssh_enabled: true,
    webdav_enabled: false,
    reachable_externally: true,
    readonly: false,
  },
  labels: {},
  created: "2025-11-10T19:18:57Z",
  storage_box: 42,
};

const action = actionFixture({
  command: "create_storage_box",
  resources: [{ id: 42, type: "storage_box" }],
});

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, storageBoxes: new StorageBoxesClient(mock.client) };
}

describe("StorageBoxesClient", () => {
  describe("storage boxes", () => {
    test("list sends filters to the Hetzner API", async () => {
      const { storageBoxes, last } = setup({
        storage_boxes: [storageBox1, storageBox2],
        meta: metaFixture({ total_entries: 2 }),
      });

      const result = await storageBoxes.list({
        name: "storage-box1",
        label_selector: "key=value",
        sort: ["id:asc", "name:desc"],
        page: 1,
        per_page: 10,
      });

      expect(result.storage_boxes).toEqual([storageBox1, storageBox2]);
      expect(result.storage_boxes[1]?.snapshot_plan).toBeNull();
      expect(last().method).toBe("GET");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes");
      expect(last().query).toEqual({
        name: ["storage-box1"],
        label_selector: ["key=value"],
        sort: ["id:asc", "name:desc"],
        page: ["1"],
        per_page: ["10"],
      });
    });

    test("list accepts a storage box that is still initializing", async () => {
      const initializing = {
        ...storageBox1,
        status: "initializing",
        username: null,
        server: null,
        system: null,
      };
      const { storageBoxes } = setup({ storage_boxes: [initializing] });
      const { storage_boxes } = await storageBoxes.list();
      expect(storage_boxes[0]?.server).toBeNull();
    });

    test("get", async () => {
      const { storageBoxes, last } = setup({ storage_box: storageBox1 });
      const result = await storageBoxes.get(42);
      expect(result.storage_box.name).toBe("storage-box1");
      expect(result.storage_box.storage_box_type.name).toBe("bx11");
      expect(result.storage_box.location.name).toBe("fsn1");
      expect(last().method).toBe("GET");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42");
    });

    test("getByName returns the exact match or undefined", async () => {
      const { storageBoxes, last } = setup({ storage_boxes: [storageBox1] }, { storage_boxes: [] });
      expect(await storageBoxes.getByName("storage-box1")).toEqual(storageBox1);
      expect(last().path).toBe("/storage_boxes");
      expect(last().query).toEqual({ name: ["storage-box1"] });

      expect(await storageBoxes.getByName("missing")).toBeUndefined();
    });

    test("listAll follows pagination", async () => {
      const { storageBoxes, requests } = setup(
        {
          storage_boxes: [storageBox1],
          meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }),
        },
        {
          storage_boxes: [storageBox2],
          meta: metaFixture({ page: 2, previous_page: 1, last_page: 2, total_entries: 2 }),
        },
      );
      const all = await storageBoxes.listAll({ label_selector: "key" });
      expect(all.map((box) => box.id)).toEqual([42, 43]);
      expect(requests.map((request) => request.query.page)).toEqual([["1"], ["2"]]);
      expect(requests.every((request) => request.host === HETZNER_HOST)).toBe(true);
    });

    test("create validates and sends the body", async () => {
      const { storageBoxes, last, requests } = setup({ storage_box: storageBox1, action });

      const result = await storageBoxes.create({
        name: "storage-box1",
        password: "secret-password",
        location: "fsn1",
        storage_box_type: "bx11",
        ssh_keys: [],
        access_settings: { reachable_externally: true, ssh_enabled: true, samba_enabled: false },
        labels: { key: "value" },
      });

      expect(result.storage_box.id).toBe(42);
      expect(result.action.id).toBe(1);
      expect(last().method).toBe("POST");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes");
      expect(last().body).toEqual({
        name: "storage-box1",
        password: "secret-password",
        location: "fsn1",
        storage_box_type: "bx11",
        ssh_keys: [],
        access_settings: { reachable_externally: true, samba_enabled: false, ssh_enabled: true },
        labels: { key: "value" },
      });

      expect(
        storageBoxes.create({ name: "", password: "x", location: "fsn1", storage_box_type: "bx11" }),
      ).rejects.toBeInstanceOf(HCloudValidationError);
      expect(
        // @ts-expect-error password is required
        storageBoxes.create({ name: "box", location: "fsn1", storage_box_type: "bx11" }),
      ).rejects.toBeInstanceOf(HCloudValidationError);
      expect(requests).toHaveLength(1);
    });

    test("create accepts IDs for location and type", async () => {
      const { storageBoxes, last } = setup({ storage_box: storageBox1, action });
      await storageBoxes.create({
        name: "storage-box1",
        password: "secret-password",
        location: 1,
        storage_box_type: 42,
      });
      expect(last().body).toEqual({
        name: "storage-box1",
        password: "secret-password",
        location: 1,
        storage_box_type: 42,
      });
    });

    test("update", async () => {
      const { storageBoxes, last } = setup({ storage_box: storageBox1 });
      const result = await storageBoxes.update(42, { name: "name", labels: { key: "value" } });
      expect(result.storage_box.id).toBe(42);
      expect(last().method).toBe("PUT");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42");
      expect(last().body).toEqual({ name: "name", labels: { key: "value" } });
    });

    test("delete returns an action", async () => {
      const { storageBoxes, last } = setup({ action });
      const result = await storageBoxes.delete(42);
      expect(result.action.id).toBe(1);
      expect(last().method).toBe("DELETE");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42");
      expect(last().body).toBeUndefined();
    });

    test("listFolders", async () => {
      const { storageBoxes, last } = setup({ folders: ["dir1", "dir2"] });

      expect(await storageBoxes.listFolders(42, { path: "dir1/path" })).toEqual({
        folders: ["dir1", "dir2"],
      });
      expect(last().method).toBe("GET");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/folders");
      expect(last().query).toEqual({ path: ["dir1/path"] });

      await storageBoxes.listFolders(42);
      expect(last().query).toEqual({});
    });
  });

  describe("actions", () => {
    test("actions sub-client uses the Hetzner API", async () => {
      const { storageBoxes, last } = setup({ actions: [action], meta: metaFixture() }, { action });

      const list = await storageBoxes.actions.list({ status: "running", sort: "id:desc" });
      expect(list.actions).toHaveLength(1);
      expect(last().method).toBe("GET");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/actions");
      expect(last().query).toEqual({ status: ["running"], sort: ["id:desc"] });

      const single = await storageBoxes.actions.get(1);
      expect(single.action.command).toBe("create_storage_box");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/actions/1");
    });

    test("actions.waitFor polls the Hetzner API until the action finished", async () => {
      const finished = { ...action, status: "success", progress: 100, finished: action.started };
      const { storageBoxes, requests } = setup(
        { storage_box: storageBox1, action },
        { action },
        { action: finished },
      );

      const created = await storageBoxes.create({
        name: "storage-box1",
        password: "secret-password",
        location: "fsn1",
        storage_box_type: "bx11",
      });
      const result = await storageBoxes.actions.waitFor(created);

      expect(result.status).toBe("success");
      expect(requests.map((request) => `${request.method} ${request.host}${request.path}`)).toEqual([
        "POST api.hetzner.com/storage_boxes",
        "GET api.hetzner.com/storage_boxes/actions/1",
        "GET api.hetzner.com/storage_boxes/actions/1",
      ]);
    });

    test("listActions", async () => {
      const { storageBoxes, last } = setup({ actions: [action], meta: metaFixture() });
      const result = await storageBoxes.listActions(42, {
        status: ["running", "error"],
        sort: "id:asc",
        page: 2,
        per_page: 5,
      });
      expect(result.actions[0]?.id).toBe(1);
      expect(last().method).toBe("GET");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/actions");
      expect(last().query).toEqual({
        status: ["running", "error"],
        sort: ["id:asc"],
        page: ["2"],
        per_page: ["5"],
      });
    });

    test("changeProtection", async () => {
      const { storageBoxes, last } = setup({ action });
      const result = await storageBoxes.changeProtection(42, { delete: true });
      expect(result.action.id).toBe(1);
      expect(last().method).toBe("POST");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/actions/change_protection");
      expect(last().body).toEqual({ delete: true });
    });

    test("changeType", async () => {
      const { storageBoxes, last, requests } = setup({ action });
      await storageBoxes.changeType(42, { storage_box_type: "bx21" });
      expect(last().method).toBe("POST");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/actions/change_type");
      expect(last().body).toEqual({ storage_box_type: "bx21" });

      expect(storageBoxes.changeType(42, { storage_box_type: "" })).rejects.toBeInstanceOf(
        HCloudValidationError,
      );
      expect(requests).toHaveLength(1);
    });

    test("resetPassword", async () => {
      const { storageBoxes, last, requests } = setup({ action });
      await storageBoxes.resetPassword(42, { password: "password" });
      expect(last().method).toBe("POST");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/actions/reset_password");
      expect(last().body).toEqual({ password: "password" });

      expect(storageBoxes.resetPassword(42, { password: "" })).rejects.toBeInstanceOf(
        HCloudValidationError,
      );
      expect(requests).toHaveLength(1);
    });

    test("updateAccessSettings sends only the given settings", async () => {
      const { storageBoxes, last } = setup({ action });
      await storageBoxes.updateAccessSettings(42, {
        reachable_externally: true,
        ssh_enabled: true,
        webdav_enabled: false,
      });
      expect(last().method).toBe("POST");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/actions/update_access_settings");
      expect(last().body).toEqual({
        reachable_externally: true,
        ssh_enabled: true,
        webdav_enabled: false,
      });
    });

    test("rollbackSnapshot accepts an ID or a name", async () => {
      const { storageBoxes, last } = setup({ action });
      await storageBoxes.rollbackSnapshot(42, { snapshot: 32 });
      expect(last().method).toBe("POST");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/actions/rollback_snapshot");
      expect(last().body).toEqual({ snapshot: 32 });

      await storageBoxes.rollbackSnapshot(42, { snapshot: "storage-box-snapshot1" });
      expect(last().body).toEqual({ snapshot: "storage-box-snapshot1" });
    });

    test("enableSnapshotPlan sends null for omitted days", async () => {
      const { storageBoxes, last, requests } = setup({ action });

      await storageBoxes.enableSnapshotPlan(42, { max_snapshots: 10, hour: 3, minute: 30 });
      expect(last().method).toBe("POST");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/actions/enable_snapshot_plan");
      expect(last().body).toEqual({
        max_snapshots: 10,
        hour: 3,
        minute: 30,
        day_of_week: null,
        day_of_month: null,
      });

      await storageBoxes.enableSnapshotPlan(42, {
        max_snapshots: 5,
        hour: 0,
        minute: 0,
        day_of_week: 7,
        day_of_month: undefined,
      });
      expect(last().body).toEqual({
        max_snapshots: 5,
        hour: 0,
        minute: 0,
        day_of_week: 7,
        day_of_month: null,
      });

      expect(
        storageBoxes.enableSnapshotPlan(42, { max_snapshots: 10, hour: 24, minute: 0 }),
      ).rejects.toBeInstanceOf(HCloudValidationError);
      expect(requests).toHaveLength(2);
    });

    test("disableSnapshotPlan sends no body", async () => {
      const { storageBoxes, last } = setup({ action });
      const result = await storageBoxes.disableSnapshotPlan(42);
      expect(result.action.id).toBe(1);
      expect(last().method).toBe("POST");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/actions/disable_snapshot_plan");
      expect(last().body).toBeUndefined();
    });
  });

  describe("snapshots", () => {
    test("listSnapshots", async () => {
      const { storageBoxes, last } = setup({ snapshots: [snapshot1, snapshot2] });

      const result = await storageBoxes.listSnapshots(42, {
        name: "storage-box-snapshot1",
        is_automatic: true,
        label_selector: "key=value",
        sort: ["id:asc"],
      });

      expect(result.snapshots).toEqual([snapshot1, snapshot2]);
      expect(last().method).toBe("GET");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/snapshots");
      expect(last().query).toEqual({
        name: ["storage-box-snapshot1"],
        is_automatic: ["true"],
        label_selector: ["key=value"],
        sort: ["id:asc"],
      });

      await storageBoxes.listSnapshots(42);
      expect(last().query).toEqual({});
    });

    test("getSnapshot", async () => {
      const { storageBoxes, last } = setup({ snapshot: snapshot1 });
      const result = await storageBoxes.getSnapshot(42, 34);
      expect(result.snapshot.name).toBe("storage-box-snapshot1");
      expect(result.snapshot.storage_box).toBe(42);
      expect(last().method).toBe("GET");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/snapshots/34");
    });

    test("getSnapshotByName returns the exact match or undefined", async () => {
      const { storageBoxes, last } = setup({ snapshots: [snapshot1] }, { snapshots: [] });
      expect(await storageBoxes.getSnapshotByName(42, "storage-box-snapshot1")).toEqual(snapshot1);
      expect(last().path).toBe("/storage_boxes/42/snapshots");
      expect(last().query).toEqual({ name: ["storage-box-snapshot1"] });

      expect(await storageBoxes.getSnapshotByName(42, "missing")).toBeUndefined();
    });

    test("createSnapshot accepts the partial snapshot of the response", async () => {
      const { storageBoxes, last } = setup({ snapshot: { id: 34, storage_box: 42 }, action });

      const result = await storageBoxes.createSnapshot(42, {
        description: "something",
        labels: { key: "value" },
      });

      expect(result.snapshot).toEqual({ id: 34, storage_box: 42 });
      expect(result.action.id).toBe(1);
      expect(last().method).toBe("POST");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/snapshots");
      expect(last().body).toEqual({ description: "something", labels: { key: "value" } });

      await storageBoxes.createSnapshot(42);
      expect(last().body).toEqual({});
    });

    test("updateSnapshot", async () => {
      const { storageBoxes, last, requests } = setup({ snapshot: snapshot1 });
      const result = await storageBoxes.updateSnapshot(42, 34, {
        description: "something",
        labels: { key: "value" },
      });
      expect(result.snapshot.id).toBe(34);
      expect(last().method).toBe("PUT");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/snapshots/34");
      expect(last().body).toEqual({ description: "something", labels: { key: "value" } });

      expect(
        // @ts-expect-error labels must be strings
        storageBoxes.updateSnapshot(42, 34, { labels: { key: 1 } }),
      ).rejects.toBeInstanceOf(HCloudValidationError);
      expect(requests).toHaveLength(1);
    });

    test("deleteSnapshot returns an action", async () => {
      const { storageBoxes, last } = setup({ action });
      const result = await storageBoxes.deleteSnapshot(42, 34);
      expect(result.action.id).toBe(1);
      expect(last().method).toBe("DELETE");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/snapshots/34");
    });
  });

  describe("subaccounts", () => {
    test("listSubaccounts", async () => {
      const { storageBoxes, last } = setup({ subaccounts: [subaccount1, subaccount2] });

      const result = await storageBoxes.listSubaccounts(42, {
        name: "subaccount1",
        username: "u42-sub1",
        label_selector: "key=value",
        sort: ["id:asc"],
      });

      expect(result.subaccounts).toEqual([subaccount1, subaccount2]);
      expect(result.subaccounts[1]?.name).toBeUndefined();
      expect(last().method).toBe("GET");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/subaccounts");
      expect(last().query).toEqual({
        name: ["subaccount1"],
        username: ["u42-sub1"],
        label_selector: ["key=value"],
        sort: ["id:asc"],
      });
    });

    test("getSubaccount", async () => {
      const { storageBoxes, last } = setup({ subaccount: subaccount1 });
      const result = await storageBoxes.getSubaccount(42, 45);
      expect(result.subaccount.username).toBe("u42-sub1");
      expect(last().method).toBe("GET");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/subaccounts/45");
    });

    test("getSubaccountByName returns the exact match or undefined", async () => {
      const { storageBoxes, last } = setup({ subaccounts: [subaccount1] }, { subaccounts: [] });
      expect(await storageBoxes.getSubaccountByName(42, "subaccount1")).toEqual(subaccount1);
      expect(last().path).toBe("/storage_boxes/42/subaccounts");
      expect(last().query).toEqual({ name: ["subaccount1"] });

      expect(await storageBoxes.getSubaccountByName(42, "missing")).toBeUndefined();
    });

    test("getSubaccountByUsername returns the exact match or undefined", async () => {
      const { storageBoxes, last } = setup({ subaccounts: [subaccount2] }, { subaccounts: [] });
      expect(await storageBoxes.getSubaccountByUsername(42, "u42-sub2")).toEqual(subaccount2);
      expect(last().path).toBe("/storage_boxes/42/subaccounts");
      expect(last().query).toEqual({ username: ["u42-sub2"] });

      expect(await storageBoxes.getSubaccountByUsername(42, "missing")).toBeUndefined();
    });

    test("createSubaccount validates and sends the body", async () => {
      const { storageBoxes, last, requests } = setup({
        subaccount: { id: 45, storage_box: 42 },
        action,
      });

      const result = await storageBoxes.createSubaccount(42, {
        name: "subaccount1",
        home_directory: "tmp",
        password: "secret",
        access_settings: { reachable_externally: true, ssh_enabled: true, readonly: false },
        description: "something",
        labels: { key: "value" },
      });

      expect(result.subaccount).toEqual({ id: 45, storage_box: 42 });
      expect(result.action.id).toBe(1);
      expect(last().method).toBe("POST");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/subaccounts");
      expect(last().body).toEqual({
        name: "subaccount1",
        home_directory: "tmp",
        password: "secret",
        access_settings: { reachable_externally: true, ssh_enabled: true, readonly: false },
        description: "something",
        labels: { key: "value" },
      });

      expect(
        // @ts-expect-error home_directory is required
        storageBoxes.createSubaccount(42, { password: "secret" }),
      ).rejects.toBeInstanceOf(HCloudValidationError);
      expect(requests).toHaveLength(1);
    });

    test("updateSubaccount", async () => {
      const { storageBoxes, last } = setup({ subaccount: subaccount1 });
      const result = await storageBoxes.updateSubaccount(42, 45, {
        name: "subaccount1",
        description: "something",
        labels: { key: "value" },
      });
      expect(result.subaccount.id).toBe(45);
      expect(last().method).toBe("PUT");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/subaccounts/45");
      expect(last().body).toEqual({
        name: "subaccount1",
        description: "something",
        labels: { key: "value" },
      });
    });

    test("deleteSubaccount returns an action", async () => {
      const { storageBoxes, last } = setup({ action });
      const result = await storageBoxes.deleteSubaccount(42, 45);
      expect(result.action.id).toBe(1);
      expect(last().method).toBe("DELETE");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/subaccounts/45");
    });

    test("changeSubaccountHomeDirectory", async () => {
      const { storageBoxes, last } = setup({ action });
      await storageBoxes.changeSubaccountHomeDirectory(42, 45, { home_directory: "path" });
      expect(last().method).toBe("POST");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/subaccounts/45/actions/change_home_directory");
      expect(last().body).toEqual({ home_directory: "path" });
    });

    test("resetSubaccountPassword", async () => {
      const { storageBoxes, last } = setup({ action });
      await storageBoxes.resetSubaccountPassword(42, 45, { password: "password" });
      expect(last().method).toBe("POST");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe(
        "/storage_boxes/42/subaccounts/45/actions/reset_subaccount_password",
      );
      expect(last().body).toEqual({ password: "password" });
    });

    test("updateSubaccountAccessSettings", async () => {
      const { storageBoxes, last } = setup({ action });
      await storageBoxes.updateSubaccountAccessSettings(42, 45, {
        reachable_externally: true,
        ssh_enabled: true,
        samba_enabled: false,
      });
      expect(last().method).toBe("POST");
      expect(last().host).toBe(HETZNER_HOST);
      expect(last().path).toBe("/storage_boxes/42/subaccounts/45/actions/update_access_settings");
      expect(last().body).toEqual({
        reachable_externally: true,
        ssh_enabled: true,
        samba_enabled: false,
      });
    });
  });

  test("request options are forwarded", async () => {
    const { storageBoxes, last } = setup({ storage_box: storageBox1 });
    await storageBoxes.get(42, { headers: { "x-test": "1" } });
    expect(last().headers.get("x-test")).toBe("1");
  });
});
