import { describe, expect, test } from "bun:test";
import { ActionsClient, ResourceActionsClient } from "../../src/apis/actions/index";
import { HCloudActionError, HCloudActionTimeoutError } from "../../src/core/errors";
import { actionFixture, mockClient, type MockReply } from "../helpers";

function setup(replies: MockReply[], options?: Parameters<typeof mockClient>[1]) {
  const mock = mockClient(replies, options);
  return { ...mock, actions: new ActionsClient(mock.client) };
}

const running = (id = 1) => actionFixture({ id, status: "running", progress: 50 });
const success = (id = 1) =>
  actionFixture({ id, status: "success", progress: 100, finished: "2026-01-01T00:00:05+00:00" });
const failed = (id = 1) =>
  actionFixture({
    id,
    status: "error",
    progress: 100,
    finished: "2026-01-01T00:00:05+00:00",
    error: { code: "action_failed", message: "Action failed" },
  });

describe("ActionsClient", () => {
  test("get", async () => {
    const { actions, last } = setup([{ action: success(7) }]);
    const result = await actions.get(7);
    expect(result.action.id).toBe(7);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/actions/7");
  });

  test("list sends repeated id and status filters", async () => {
    const { actions, last } = setup([{ actions: [success(1), running(2)] }]);
    await actions.list({ id: [1, 2], status: ["running", "success"], sort: "id:desc" });
    expect(last().path).toBe("/actions");
    expect(last().query).toEqual({
      id: ["1", "2"],
      status: ["running", "success"],
      sort: ["id:desc"],
    });
  });

  test("resource scoped clients use the resource path", async () => {
    const mock = mockClient([{ actions: [] }, { action: success(3) }]);
    const actions = new ResourceActionsClient(mock.client, "/servers");
    await actions.list({ status: "running" });
    expect(mock.last().path).toBe("/servers/actions");
    await actions.get(3);
    expect(mock.last().path).toBe("/servers/actions/3");
  });

  test("resource scoped clients can target the Hetzner API", async () => {
    const mock = mockClient([{ action: success(3) }]);
    await new ResourceActionsClient(mock.client, "/storage_boxes", "hetzner").get(3);
    expect(mock.last().url.href).toBe("https://api.hetzner.com/v1/storage_boxes/actions/3");
  });
});

describe("waitFor", () => {
  test("polls an action ID until it succeeds", async () => {
    const { actions, requests } = setup([
      { action: running() },
      { action: running() },
      { action: success() },
    ]);
    const progress: number[] = [];
    const action = await actions.waitFor(1, { onProgress: (a) => progress.push(a.progress) });

    expect(action.status).toBe("success");
    expect(requests.map((r) => r.path)).toEqual(["/actions/1", "/actions/1", "/actions/1"]);
    expect(progress).toEqual([50, 50, 100]);
  });

  test("accepts actions and responses containing an action", async () => {
    const { actions, requests } = setup([{ action: success() }]);
    expect((await actions.waitFor(running())).status).toBe("success");
    expect((await actions.waitFor({ action: running() })).status).toBe("success");
    expect(requests).toHaveLength(2);
  });

  test("returns finished actions without a request", async () => {
    const { actions, requests } = setup([{}]);
    expect(await actions.waitFor(success(9))).toEqual(success(9));
    expect(requests).toHaveLength(0);
  });

  test("throws HCloudActionError for failed actions", async () => {
    const { actions } = setup([{ action: running() }, { action: failed() }]);
    const error = await actions.waitFor(1).catch((e) => e);
    expect(error).toBeInstanceOf(HCloudActionError);
    expect(error.code).toBe("action_failed");
    expect(error.message).toBe("Action failed");
    expect(error.action.id).toBe(1);
  });

  test("throws immediately for actions that already failed", async () => {
    const { actions, requests } = setup([{}]);
    await expect(actions.waitFor(failed())).rejects.toBeInstanceOf(HCloudActionError);
    expect(requests).toHaveLength(0);
  });

  test("returns failed actions when throwOnError is false", async () => {
    const { actions } = setup([{ action: failed() }]);
    const action = await actions.waitFor(1, { throwOnError: false });
    expect(action.status).toBe("error");
  });

  test("times out", async () => {
    const { actions } = setup([{ action: running() }]);
    const error = await actions.waitFor(1, { timeout: 30, pollInterval: 5 }).catch((e) => e);
    expect(error).toBeInstanceOf(HCloudActionTimeoutError);
    expect(error.code).toBe("ACTION_TIMEOUT");
    expect(error.actionIds).toEqual([1]);
    expect(error.timeout).toBe(30);
  });

  test("supports poll interval functions and the deprecated interval option", async () => {
    const attempts: number[] = [];
    const first = setup([{ action: running() }, { action: running() }, { action: success() }]);
    await first.actions.waitFor(running(), {
      pollInterval: (attempt) => {
        attempts.push(attempt);
        return 1;
      },
    });
    expect(attempts).toEqual([0, 1, 2]);

    const second = setup([{ action: success() }]);
    expect((await second.actions.waitFor(1, { interval: 1 })).status).toBe("success");
  });

  test("can be aborted", async () => {
    const controller = new AbortController();
    const { actions } = setup([{ action: running() }]);
    setTimeout(() => controller.abort(), 10);
    await expect(
      actions.waitFor(running(), { pollInterval: 10_000, signal: controller.signal }),
    ).rejects.toMatchObject({ code: "ABORTED" });
  });
});

describe("waitForAll", () => {
  test("polls pending actions in one request and keeps the input order", async () => {
    const { actions, requests } = setup([
      { actions: [success(2), running(1), running(3)] },
      { actions: [success(3), success(1)] },
    ]);
    const result = await actions.waitForAll([1, 2, 3]);

    expect(result.map((a) => [a.id, a.status])).toEqual([
      [1, "success"],
      [2, "success"],
      [3, "success"],
    ]);
    expect(requests.map((r) => [r.path, r.query.id])).toEqual([
      ["/actions", ["1", "2", "3"]],
      ["/actions", ["1", "3"]],
    ]);
  });

  test("accepts responses with action, actions and next_actions", async () => {
    const { actions, last } = setup([{ actions: [success(1), success(2), success(3)] }]);
    const result = await actions.waitForAll({
      action: running(1),
      actions: [running(2)],
      next_actions: [running(3), success(4)],
    });
    expect(result.map((a) => a.id)).toEqual([1, 2, 3, 4]);
    expect(last().query.id).toEqual(["1", "2", "3"]);
  });

  test("resolves immediately for empty input", async () => {
    const { actions, requests } = setup([{}]);
    expect(await actions.waitForAll([])).toEqual([]);
    expect(await actions.waitForAll({ next_actions: [] })).toEqual([]);
    expect(requests).toHaveLength(0);
  });

  test("fails fast when one action fails", async () => {
    const { actions } = setup([{ actions: [running(1), failed(2)] }]);
    await expect(actions.waitForAll([running(1), running(2)])).rejects.toBeInstanceOf(
      HCloudActionError,
    );
  });

  test("chunks large batches", async () => {
    const ids = Array.from({ length: 60 }, (_, i) => i + 1);
    const { actions, requests } = setup([
      (request) => ({ actions: (request.query.id ?? []).map((id) => success(Number(id))) }),
    ]);
    const result = await actions.waitForAll(ids);
    expect(result).toHaveLength(60);
    expect(requests.map((r) => r.query.id?.length)).toEqual([50, 10]);
  });

  test("uses client level polling defaults", async () => {
    const { actions } = setup([{ action: running() }], {
      actions: { pollInterval: 5, timeout: 25 },
    });
    await expect(actions.waitFor(1)).rejects.toBeInstanceOf(HCloudActionTimeoutError);
  });
});
