import { describe, expect, test } from "bun:test";
import { ImagesClient } from "../../src/apis/images/index";
import type { Image } from "../../src/apis/images/types";
import { HCloudValidationError } from "../../src/core/errors";
import { actionFixture, metaFixture, mockClient } from "../helpers";

const image1: Image = {
  id: 45557056,
  name: "debian-11",
  architecture: "x86",
  bound_to: null,
  created: "2021-08-16T11:12:01Z",
  created_from: null,
  deleted: null,
  deprecation: {
    announced: "2026-08-31T06:21:44Z",
    unavailable_after: "2026-12-01T00:00:00Z",
  },
  description: "Debian 11",
  disk_size: 5,
  image_size: null,
  labels: {},
  os_flavor: "debian",
  os_version: "11",
  protection: { delete: false },
  rapid_deploy: true,
  status: "available",
  type: "system",
};

const image2: Image = {
  id: 429564329,
  name: null,
  architecture: "x86",
  bound_to: 159969127,
  created: "2026-09-08T13:44:08Z",
  created_from: { id: 159969127, name: "server1" },
  deleted: null,
  deprecation: null,
  description: "snapshot 2026-09-08T13:44:08Z",
  disk_size: 80,
  image_size: 0.7237785009765625,
  labels: { key: "value" },
  os_flavor: "debian",
  os_version: "13",
  protection: { delete: true },
  rapid_deploy: false,
  status: "available",
  type: "snapshot",
};

// Response from before 2026-09-08, still carrying the removed `deprecated` field.
const legacyImage: Image = { ...image1, id: 4711, deprecated: "2026-08-31T06:21:44Z" };

const imageAction = actionFixture({
  id: 13,
  command: "change_protection",
  resources: [{ id: 429564329, type: "image" }],
});

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, images: new ImagesClient(mock.client) };
}

describe("ImagesClient", () => {
  test("list sends filters as query parameters", async () => {
    const { images, last } = setup({ images: [image1, image2], meta: metaFixture() });

    const result = await images.list({
      name: "debian-11",
      label_selector: "k==v",
      type: ["system", "snapshot"],
      status: "available",
      architecture: ["x86", "arm"],
      bound_to: [159969127],
      include_deprecated: true,
      sort: ["name:asc", "created:desc"],
      page: 2,
      per_page: 25,
    });

    expect(result.images).toEqual([image1, image2]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/images");
    expect(last().query).toEqual({
      name: ["debian-11"],
      label_selector: ["k==v"],
      type: ["system", "snapshot"],
      status: ["available"],
      architecture: ["x86", "arm"],
      bound_to: ["159969127"],
      include_deprecated: ["true"],
      sort: ["name:asc", "created:desc"],
      page: ["2"],
      per_page: ["25"],
    });
  });

  test("get", async () => {
    const { images, last } = setup({ image: image2 });
    const result = await images.get(429564329);
    expect(result.image.created_from).toEqual({ id: 159969127, name: "server1" });
    expect(result.image.name).toBeNull();
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/images/429564329");
  });

  test("accepts images with and without the removed deprecated field", async () => {
    const { images } = setup({ images: [legacyImage, image1] });
    const result = await images.list();
    expect(result.images[0]?.deprecated).toBe("2026-08-31T06:21:44Z");
    expect(result.images[1]?.deprecated).toBeUndefined();
    expect(result.images[1]?.deprecation?.unavailable_after).toBe("2026-12-01T00:00:00Z");
  });

  test("getByName returns the exact match or undefined", async () => {
    const { images, last } = setup({ images: [image1] }, { images: [] });
    expect(await images.getByName("debian-11")).toEqual(image1);
    expect(last().query).toEqual({ name: ["debian-11"] });

    expect(await images.getByName("missing")).toBeUndefined();
  });

  test("getByNameAndArchitecture filters by name and architecture", async () => {
    const arm: Image = { ...image1, id: 45557057, architecture: "arm" };
    const { images, last } = setup(
      { images: [image1] },
      { images: [image1, arm] },
      { images: [] },
    );

    expect(await images.getByNameAndArchitecture("debian-11", "x86")).toEqual(image1);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/images");
    expect(last().query).toEqual({ name: ["debian-11"], architecture: ["x86"] });

    // Results of other architectures are never returned
    expect(await images.getByNameAndArchitecture("debian-11", "arm")).toEqual(arm);
    expect(last().query).toEqual({ name: ["debian-11"], architecture: ["arm"] });

    expect(await images.getByNameAndArchitecture("debian-11", "arm")).toBeUndefined();
  });

  test("getByNameAndArchitecture can include deprecated images", async () => {
    const { images, last } = setup({ images: [image1] });
    await images.getByNameAndArchitecture("debian-11", "x86", { include_deprecated: true });
    expect(last().query).toEqual({
      name: ["debian-11"],
      architecture: ["x86"],
      include_deprecated: ["true"],
    });
  });

  test("update validates and sends the body", async () => {
    const { images, last, requests } = setup({ image: image2 });

    const result = await images.update(429564329, {
      description: "My new Image description",
      type: "snapshot",
      labels: {},
    });
    expect(result.image.id).toBe(429564329);
    expect(last().method).toBe("PUT");
    expect(last().path).toBe("/images/429564329");
    expect(last().body).toEqual({
      description: "My new Image description",
      type: "snapshot",
      labels: {},
    });

    expect(
      // @ts-expect-error - images can only be converted to snapshots
      images.update(429564329, { type: "backup" }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    expect(requests).toHaveLength(1);
  });

  test("delete resolves without a value", async () => {
    const { images, last } = setup(undefined);
    expect(await images.delete(429564329)).toBeUndefined();
    expect(last().method).toBe("DELETE");
    expect(last().path).toBe("/images/429564329");
  });

  test("changeProtection", async () => {
    const { images, last, requests } = setup({ action: imageAction });

    const result = await images.changeProtection(429564329, { delete: true });
    expect(result.action.command).toBe("change_protection");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/images/429564329/actions/change_protection");
    expect(last().body).toEqual({ delete: true });

    expect(
      // @ts-expect-error - delete must be a boolean
      images.changeProtection(429564329, { delete: "yes" }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    expect(requests).toHaveLength(1);
  });

  test("listActions", async () => {
    const { images, last } = setup({ actions: [imageAction], meta: metaFixture() });
    const result = await images.listActions(429564329, {
      status: ["running", "error"],
      sort: "id:desc",
      page: 1,
      per_page: 10,
    });
    expect(result.actions).toEqual([imageAction]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/images/429564329/actions");
    expect(last().query).toEqual({
      status: ["running", "error"],
      sort: ["id:desc"],
      page: ["1"],
      per_page: ["10"],
    });
  });

  test("getAction", async () => {
    const { images, last } = setup({ action: imageAction });
    const result = await images.getAction(429564329, 13);
    expect(result.action.id).toBe(13);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/images/429564329/actions/13");
  });

  test("actions lists and waits for image actions", async () => {
    const finished = { ...imageAction, status: "success", progress: 100 };
    const { images, requests } = setup(
      { actions: [imageAction], meta: metaFixture() },
      { action: imageAction },
      { action: finished },
    );

    const { actions } = await images.actions.list({ status: "running" });
    expect(actions).toEqual([imageAction]);
    expect(requests[0]?.path).toBe("/images/actions");
    expect(requests[0]?.query).toEqual({ status: ["running"] });

    const { action } = await images.actions.get(13);
    expect(action.id).toBe(13);
    expect(requests[1]?.path).toBe("/images/actions/13");

    const result = await images.actions.waitFor(action);
    expect(result.status).toBe("success");
    expect(requests[2]?.path).toBe("/images/actions/13");
  });

  test("listAll follows pagination", async () => {
    const { images, requests } = setup(
      { images: [image1], meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }) },
      { images: [image2], meta: metaFixture({ page: 2, previous_page: 1 }) },
    );
    const all = await images.listAll({ type: "snapshot" });
    expect(all.map((image) => image.id)).toEqual([45557056, 429564329]);
    expect(requests.map((request) => request.query.page)).toEqual([["1"], ["2"]]);
    expect(requests.map((request) => request.query.type)).toEqual([["snapshot"], ["snapshot"]]);
  });

  test("rejects responses that do not match the schema", async () => {
    const { images } = setup({ image: { ...image1, type: "floppy" } });
    expect(images.get(45557056)).rejects.toBeInstanceOf(HCloudValidationError);
  });
});
