import { describe, expect, test } from "bun:test";
import { PlacementGroupsClient } from "../../src/apis/placement-groups/index";
import type { PlacementGroup } from "../../src/apis/placement-groups/types";
import { HCloudValidationError } from "../../src/core/errors";
import { actionFixture, metaFixture, mockClient } from "../helpers";

const placementGroup: PlacementGroup = {
  created: "2019-01-08T12:10:00+00:00",
  id: 897,
  labels: { key: "value" },
  name: "my Placement Group",
  servers: [4711, 4712],
  type: "spread",
};

const placementGroup2: PlacementGroup = {
  created: "2019-01-08T12:10:00+00:00",
  id: 898,
  labels: { key: "value" },
  name: "my Placement Group",
  servers: [4713, 4714, 4715],
  type: "spread",
};

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, placementGroups: new PlacementGroupsClient(mock.client) };
}

describe("PlacementGroupsClient", () => {
  test("list sends filters as query parameters", async () => {
    const { placementGroups, last } = setup({
      placement_groups: [placementGroup, placementGroup2],
      meta: metaFixture(),
    });

    const result = await placementGroups.list({
      name: "my Placement Group",
      label_selector: "key=value",
      type: "spread",
      sort: ["name:asc", "created:desc"],
      page: 2,
      per_page: 25,
    });

    expect(result.placement_groups).toEqual([placementGroup, placementGroup2]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/placement_groups");
    expect(last().query).toEqual({
      name: ["my Placement Group"],
      label_selector: ["key=value"],
      type: ["spread"],
      sort: ["name:asc", "created:desc"],
      page: ["2"],
      per_page: ["25"],
    });
  });

  test("get", async () => {
    const { placementGroups, last } = setup({ placement_group: placementGroup });
    const result = await placementGroups.get(897);
    expect(result.placement_group.servers).toEqual([4711, 4712]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/placement_groups/897");
  });

  test("getByName returns the exact match or undefined", async () => {
    const { placementGroups, last } = setup(
      { placement_groups: [placementGroup] },
      { placement_groups: [] },
    );
    expect(await placementGroups.getByName("my Placement Group")).toEqual(placementGroup);
    expect(last().query).toEqual({ name: ["my Placement Group"] });

    expect(await placementGroups.getByName("missing")).toBeUndefined();
  });

  test("create validates and sends the body", async () => {
    const created: PlacementGroup = { ...placementGroup, servers: [] };
    const { placementGroups, last, requests } = setup({ placement_group: created });

    const result = await placementGroups.create({
      name: "my Placement Group",
      type: "spread",
      labels: { key: "value" },
    });
    expect(result.placement_group).toEqual(created);
    expect(result.action).toBeUndefined();
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/placement_groups");
    expect(last().body).toEqual({
      name: "my Placement Group",
      type: "spread",
      labels: { key: "value" },
    });

    expect(
      // @ts-expect-error - "cluster" is not a valid placement group type
      placementGroups.create({ name: "my Placement Group", type: "cluster" }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    expect(placementGroups.create({ name: "", type: "spread" })).rejects.toBeInstanceOf(
      HCloudValidationError,
    );
    expect(requests).toHaveLength(1);
  });

  test("create accepts a response with an action", async () => {
    const action = actionFixture({
      command: "create_placement_group",
      resources: [{ id: 897, type: "placement_group" }],
    });
    const { placementGroups } = setup(
      { placement_group: placementGroup, action },
      { placement_group: placementGroup, action: null },
    );
    const withAction = await placementGroups.create({ name: "a", type: "spread" });
    expect(withAction.action?.id).toBe(1);
    const withNull = await placementGroups.create({ name: "a", type: "spread" });
    expect(withNull.action).toBeNull();
  });

  test("update", async () => {
    const { placementGroups, last } = setup({ placement_group: placementGroup });
    const result = await placementGroups.update(897, {
      name: "new-name",
      labels: { key: "value" },
    });
    expect(result.placement_group.id).toBe(897);
    expect(last().method).toBe("PUT");
    expect(last().path).toBe("/placement_groups/897");
    expect(last().body).toEqual({ name: "new-name", labels: { key: "value" } });
  });

  test("delete resolves without a value", async () => {
    const { placementGroups, last } = setup(undefined);
    expect(await placementGroups.delete(897)).toBeUndefined();
    expect(last().method).toBe("DELETE");
    expect(last().path).toBe("/placement_groups/897");
  });

  test("listAll follows pagination", async () => {
    const { placementGroups, requests } = setup(
      {
        placement_groups: [placementGroup],
        meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }),
      },
      { placement_groups: [placementGroup2], meta: metaFixture({ page: 2, previous_page: 1 }) },
    );
    const all = await placementGroups.listAll();
    expect(all.map((group) => group.id)).toEqual([897, 898]);
    expect(requests.map((request) => request.query.page)).toEqual([["1"], ["2"]]);
  });
});
