import { describe, expect, test } from "bun:test";
import { CertificatesClient } from "../../src/apis/certificates/index";
import { certificateSchema } from "../../src/apis/certificates/schemas";
import { HCloudValidationError } from "../../src/core/errors";
import { actionFixture, json, metaFixture, mockClient } from "../helpers";

const uploaded = {
  id: 2323,
  name: "My Certificate",
  labels: {},
  type: "uploaded",
  certificate: "-----BEGIN CERTIFICATE-----\n...",
  created: "2019-01-08T12:10:00+00:00",
  not_valid_before: "2019-01-08T10:00:00+00:00",
  not_valid_after: "2019-07-08T09:59:59+00:00",
  domain_names: ["example.com", "webmail.example.com", "www.example.com"],
  fingerprint: "03:c7:55:9b:2a:d1:04:17:09:f6:d0:7f:18:34:63:d4:3e:5f",
  status: null,
  used_by: [{ id: 42, type: "load_balancer" }],
};

const managed = {
  ...uploaded,
  type: "managed",
  status: {
    issuance: "failed",
    renewal: "scheduled",
    error: { code: "error_code", message: "error message" },
  },
  used_by: [{ id: 42, type: "server" }],
};

const issueAction = actionFixture({
  id: 14,
  command: "issue_certificate",
  status: "success",
  progress: 100,
  started: "2021-01-30T23:55:00+00:00",
  finished: "2021-01-30T23:57:00+00:00",
  resources: [{ id: 896, type: "certificate" }],
});

function setup(...replies: Parameters<typeof mockClient>[0][]) {
  const mock = mockClient(replies.length > 0 ? replies : [{}]);
  return { ...mock, certificates: new CertificatesClient(mock.client) };
}

describe("CertificatesClient", () => {
  test("list sends filters as query parameters", async () => {
    const { certificates, last } = setup({
      certificates: [uploaded, { ...uploaded, id: 2324, name: "My website cert" }],
      meta: metaFixture({ total_entries: 2 }),
    });

    const result = await certificates.list({
      name: "My Certificate",
      label_selector: "environment=prod",
      type: ["uploaded", "managed"],
      sort: ["name:asc", "created:desc"],
      page: 2,
      per_page: 25,
    });

    expect(result.certificates.map((certificate) => certificate.id)).toEqual([2323, 2324]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/certificates");
    expect(last().query).toEqual({
      name: ["My Certificate"],
      label_selector: ["environment=prod"],
      type: ["uploaded", "managed"],
      sort: ["name:asc", "created:desc"],
      page: ["2"],
      per_page: ["25"],
    });
  });

  test("get", async () => {
    const { certificates, last } = setup({ certificate: managed });
    const result = await certificates.get(2323);
    expect(result.certificate.status?.issuance).toBe("failed");
    expect(result.certificate.status?.error?.code).toBe("error_code");
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/certificates/2323");
  });

  test("getByName returns the exact match or undefined", async () => {
    const { certificates, last } = setup({ certificates: [uploaded] }, { certificates: [] });
    expect<unknown>(await certificates.getByName("My Certificate")).toEqual(uploaded);
    expect(last().query).toEqual({ name: ["My Certificate"] });

    expect(await certificates.getByName("missing")).toBeUndefined();
    expect(last().query).toEqual({ name: ["missing"] });
  });

  test("create uploads a certificate", async () => {
    const { certificates, last } = setup({ certificate: uploaded });

    const result = await certificates.create({
      name: "My Certificate",
      certificate: "-----BEGIN CERTIFICATE-----\n...",
      private_key: "-----BEGIN PRIVATE KEY-----\n...",
      labels: { environment: "prod" },
    });

    expect(result.certificate.id).toBe(2323);
    expect(result.action).toBeUndefined();
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/certificates");
    expect(last().body).toEqual({
      name: "My Certificate",
      certificate: "-----BEGIN CERTIFICATE-----\n...",
      private_key: "-----BEGIN PRIVATE KEY-----\n...",
      labels: { environment: "prod" },
    });
  });

  test("create with type managed returns the issuance action", async () => {
    const pending = { ...managed, status: { issuance: "pending", renewal: "scheduled", error: null } };
    const { certificates, last } = setup({ certificate: pending, action: issueAction });

    const result = await certificates.create({
      name: "My Certificate",
      type: "managed",
      domain_names: ["example.com", "webmail.example.com", "www.example.com"],
    });

    expect(result.action?.command).toBe("issue_certificate");
    expect(last().body).toEqual({
      name: "My Certificate",
      type: "managed",
      domain_names: ["example.com", "webmail.example.com", "www.example.com"],
    });
  });

  test("create validates the request", async () => {
    const { certificates, requests } = setup({ certificate: uploaded });

    // A managed certificate needs domain names
    await expect(
      certificates.create({ name: "My Certificate", type: "managed", domain_names: [] }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    // An uploaded certificate needs a private key
    await expect(
      certificates.create({ name: "My Certificate", certificate: "x", private_key: "" }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
    expect(requests).toHaveLength(0);
  });

  test("createManaged sets the type and guarantees an action", async () => {
    const { certificates, last } = setup(
      { certificate: managed, action: issueAction },
      { certificate: managed },
    );

    const { certificate, action } = await certificates.createManaged({
      name: "My Certificate",
      domain_names: ["example.com"],
      labels: { environment: "prod" },
    });

    expect(certificate.type).toBe("managed");
    expect(action.id).toBe(14);
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/certificates");
    expect(last().body).toEqual({
      name: "My Certificate",
      type: "managed",
      domain_names: ["example.com"],
      labels: { environment: "prod" },
    });

    // A response without an action does not match a managed certificate
    await expect(
      certificates.createManaged({ name: "My Certificate", domain_names: ["example.com"] }),
    ).rejects.toBeInstanceOf(HCloudValidationError);
  });

  test("update", async () => {
    const { certificates, last } = setup({ certificate: { ...uploaded, name: "New name" } });
    const result = await certificates.update(2323, { name: "New name", labels: {} });
    expect(result.certificate.name).toBe("New name");
    expect(last().method).toBe("PUT");
    expect(last().path).toBe("/certificates/2323");
    expect(last().body).toEqual({ name: "New name", labels: {} });
  });

  test("delete resolves without a value", async () => {
    const { certificates, last } = setup(undefined);
    expect(await certificates.delete(2323)).toBeUndefined();
    expect(last().method).toBe("DELETE");
    expect(last().path).toBe("/certificates/2323");
    expect(last().body).toBeUndefined();
  });

  test("listActions", async () => {
    const action = actionFixture({
      id: 13,
      command: "change_protection",
      status: "success",
      progress: 100,
      finished: "2016-01-30T23:56:00+00:00",
      resources: [{ id: 14, type: "certificate" }],
    });
    const { certificates, last } = setup({ actions: [action], meta: metaFixture() });

    const result = await certificates.listActions(2323, {
      status: ["running", "success"],
      sort: "started:desc",
    });

    expect(result.actions).toEqual([action]);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/certificates/2323/actions");
    expect(last().query).toEqual({ status: ["running", "success"], sort: ["started:desc"] });
  });

  test("getAction", async () => {
    const { certificates, last } = setup({ action: issueAction });
    const result = await certificates.getAction(2323, 14);
    expect(result.action.id).toBe(14);
    expect(last().method).toBe("GET");
    expect(last().path).toBe("/certificates/2323/actions/14");
  });

  test("retryIssuance posts without a body", async () => {
    const action = actionFixture({
      id: 14,
      command: "issue_certificate",
      started: "2016-01-30T23:50+00:00",
      resources: [{ id: 42, type: "certificate" }],
      error: { code: "action_failed", message: "Action failed" },
    });
    const { certificates, last } = setup(json({ action }, 201));

    const result = await certificates.retryIssuance(2323);

    expect(result.action.command).toBe("issue_certificate");
    expect(last().method).toBe("POST");
    expect(last().path).toBe("/certificates/2323/actions/retry");
    expect(last().body).toBeUndefined();
  });

  test("actions client is scoped to certificates", async () => {
    const { certificates, last } = setup(
      { actions: [issueAction], meta: metaFixture() },
      { action: issueAction },
    );

    await certificates.actions.list({ id: [14] });
    expect(last().path).toBe("/certificates/actions");
    expect(last().query).toEqual({ id: ["14"] });

    await certificates.actions.get(14);
    expect(last().path).toBe("/certificates/actions/14");

    expect((await certificates.actions.waitFor(14)).status).toBe("success");
  });

  test("forwards request options", async () => {
    const { certificates, last } = setup({ certificate: uploaded });
    await certificates.get(2323, { headers: { "x-test": "1" } });
    expect(last().headers.get("x-test")).toBe("1");
  });

  test("accepts a managed certificate that has not been issued yet", () => {
    const result = certificateSchema.safeParse({
      ...managed,
      certificate: null,
      fingerprint: null,
      not_valid_before: null,
      not_valid_after: null,
      status: { issuance: "pending", renewal: "unavailable", error: null },
      used_by: [],
    });
    expect(result.success).toBe(true);
  });
});
