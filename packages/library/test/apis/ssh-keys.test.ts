import { describe, expect, test } from "bun:test";
import { SSHKeysClient } from "../../src/apis/ssh-keys/index";
import { HCloudValidationError } from "../../src/core/errors";
import { metaFixture, mockClient } from "../helpers";

const sshKey = {
  id: 2323,
  name: "my-ssh-key",
  fingerprint: "b7:2f:30:a0:2f:6c:58:6c:21:04:58:61:ba:06:3b:2f",
  public_key: "ssh-rsa AAAjjk76kgf...Xt",
  labels: { environment: "prod" },
  created: "2016-01-30T23:55:00+00:00",
};

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, sshKeys: new SSHKeysClient(mock.client) };
}

describe("SSHKeysClient", () => {
  test("list sends filters as query parameters", async () => {
    const { sshKeys, last } = setup({ ssh_keys: [sshKey], meta: metaFixture() });

    const result = await sshKeys.list({
      name: "my-ssh-key",
      label_selector: "environment=prod",
      sort: ["name:asc", "id:desc"],
      page: 2,
      per_page: 25,
    });

    expect(result.ssh_keys).toEqual([sshKey]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/ssh_keys");
    expect(last().query).toEqual({
      name: ["my-ssh-key"],
      label_selector: ["environment=prod"],
      sort: ["name:asc", "id:desc"],
      page: ["2"],
      per_page: ["25"],
    });
  });

  test("get", async () => {
    const { sshKeys, last } = setup({ ssh_key: sshKey });
    const result = await sshKeys.get(2323);
    expect(result.ssh_key.name).toBe("my-ssh-key");
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/ssh_keys/2323");
  });

  test("getByName returns the exact match or undefined", async () => {
    const { sshKeys, last, reply } = setup({ ssh_keys: [sshKey] });
    expect(await sshKeys.getByName("my-ssh-key")).toEqual(sshKey);
    expect(last().query).toEqual({ name: ["my-ssh-key"] });

    reply({ ssh_keys: [] });
    expect(await sshKeys.getByName("missing")).toBeUndefined();
  });

  test("getByFingerprint", async () => {
    const { sshKeys, last } = setup({ ssh_keys: [sshKey] });
    expect(await sshKeys.getByFingerprint(sshKey.fingerprint)).toEqual(sshKey);
    expect(last().query).toEqual({ fingerprint: [sshKey.fingerprint] });
  });

  test("create validates and sends the body", async () => {
    const { sshKeys, last, requests } = setup({ ssh_key: sshKey });

    await sshKeys.create({ name: "my-ssh-key", public_key: "ssh-rsa AAAjjk76kgf...Xt" });
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/ssh_keys");
    expect(last().body).toEqual({ name: "my-ssh-key", public_key: "ssh-rsa AAAjjk76kgf...Xt" });

    await expect(sshKeys.create({ name: "", public_key: "x" })).rejects.toBeInstanceOf(
      HCloudValidationError,
    );
    expect(requests).toHaveLength(1);
  });

  test("update", async () => {
    const { sshKeys, last } = setup({ ssh_key: sshKey });
    await sshKeys.update(2323, { labels: { environment: "dev" } });
    expect(last().method).toBe("PUT");
    expect(last().path).toBe("/ssh_keys/2323");
    expect(last().body).toEqual({ labels: { environment: "dev" } });
  });

  test("delete resolves without a value", async () => {
    const { sshKeys, last } = setup(undefined);
    expect(await sshKeys.delete(2323)).toBeUndefined();
    expect(last().method).toBe("DELETE");
    expect(last().path).toBe("/ssh_keys/2323");
  });

  test("listAll follows pagination", async () => {
    const { sshKeys, requests } = setup(
      { ssh_keys: [sshKey], meta: metaFixture({ next_page: 2, last_page: 2, total_entries: 2 }) },
      { ssh_keys: [{ ...sshKey, id: 2 }], meta: metaFixture({ page: 2, previous_page: 1 }) },
    );
    const all = await sshKeys.listAll();
    expect(all.map((key) => key.id)).toEqual([2323, 2]);
    expect(requests.map((request) => request.query.page)).toEqual([["1"], ["2"]]);
  });
});
