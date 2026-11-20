import { describe, expect, test } from "bun:test";
import { ISOsClient } from "../../src/apis/isos/index";
import type { ISO } from "../../src/apis/isos/types";
import { HCloudValidationError } from "../../src/core/errors";
import { metaFixture, mockClient } from "../helpers";

const freebsd: ISO = {
  id: 4711,
  name: "FreeBSD-11.0-RELEASE-amd64-dvd1",
  description: "FreeBSD 11.0 x64",
  type: "public",
  architecture: "x86",
  deprecated: "2018-02-28T00:00:00+00:00",
  deprecation: {
    announced: "2018-01-28T00:00:00+00:00",
    unavailable_after: "2018-02-28T00:00:00+00:00",
  },
};

// Shape of older responses: no `deprecation`.
const freebsd2: ISO = {
  id: 4712,
  name: "FreeBSD-11.0-RELEASE-amd64-dvd1",
  description: "FreeBSD 11.0 x64",
  type: "public",
  architecture: "x86",
  deprecated: null,
};

// A custom ISO: no name, no architecture, no deprecated field.
const custom: ISO = {
  id: 9001,
  name: null,
  description: "my-custom.iso",
  type: "private",
  architecture: null,
  deprecation: null,
};

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, isos: new ISOsClient(mock.client) };
}

describe("ISOsClient", () => {
  test("list sends filters as query parameters", async () => {
    const { isos, last } = setup({ isos: [freebsd, freebsd2, custom], meta: metaFixture() });

    const result = await isos.list({
      name: "FreeBSD-11.0-RELEASE-amd64-dvd1",
      architecture: ["x86", "arm"],
      include_architecture_wildcard: true,
      page: 2,
      per_page: 25,
    });

    expect(result.isos).toEqual([freebsd, freebsd2, custom]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/isos");
    expect(last().query).toEqual({
      name: ["FreeBSD-11.0-RELEASE-amd64-dvd1"],
      architecture: ["x86", "arm"],
      include_architecture_wildcard: ["true"],
      page: ["2"],
      per_page: ["25"],
    });
  });

  test("get", async () => {
    const { isos, last } = setup({ iso: freebsd });
    const result = await isos.get(4711);
    expect(result.iso.deprecation?.unavailable_after).toBe("2018-02-28T00:00:00+00:00");
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/isos/4711");
  });

  test("getByName returns the exact match or undefined", async () => {
    const { isos, last } = setup({ isos: [freebsd] }, { isos: [] });
    expect(await isos.getByName("FreeBSD-11.0-RELEASE-amd64-dvd1")).toEqual(freebsd);
    expect(last().query).toEqual({ name: ["FreeBSD-11.0-RELEASE-amd64-dvd1"] });

    expect(await isos.getByName("missing")).toBeUndefined();
  });

  test("first requests a single item", async () => {
    const { isos, last } = setup({ isos: [custom] });
    expect(await isos.first({ architecture: "arm", include_architecture_wildcard: true })).toEqual(
      custom,
    );
    expect(last().query).toEqual({
      architecture: ["arm"],
      include_architecture_wildcard: ["true"],
      per_page: ["1"],
    });
  });

  test("listAll follows pagination", async () => {
    const { isos, requests } = setup(
      { isos: [freebsd], meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }) },
      { isos: [freebsd2], meta: metaFixture({ page: 2, previous_page: 1 }) },
    );
    const all = await isos.listAll();
    expect(all.map((iso) => iso.id)).toEqual([4711, 4712]);
    expect(requests.map((request) => request.query.page)).toEqual([["1"], ["2"]]);
  });

  test("rejects responses that do not match the schema", async () => {
    const { isos } = setup({ iso: { ...freebsd, type: "floppy" } });
    expect(isos.get(4711)).rejects.toBeInstanceOf(HCloudValidationError);
  });
});
