/**
 * Hetzner Cloud Certificates API
 * @see https://docs.hetzner.cloud/reference/cloud#certificates
 */

import { NamedResource, path } from "../../core/resource";
import type { RequestOptions } from "../../core/types";
import { ResourceActionsClient } from "../actions/index";
import {
  actionResponseSchema,
  getActionResponseSchema,
  listActionsResponseSchema,
} from "../actions/schemas";
import {
  createCertificateRequestSchema,
  createCertificateResponseSchema,
  createManagedCertificateRequestSchema,
  createManagedCertificateResponseSchema,
  getCertificateResponseSchema,
  listCertificatesResponseSchema,
  updateCertificateRequestSchema,
  updateCertificateResponseSchema,
} from "./schemas";
import type {
  Certificate,
  CreateCertificateParams,
  CreateCertificateResponse,
  CreateManagedCertificateParams,
  CreateManagedCertificateResponse,
  GetCertificateActionResponse,
  GetCertificateResponse,
  ListCertificateActionsParams,
  ListCertificateActionsResponse,
  ListCertificatesParams,
  ListCertificatesResponse,
  RetryCertificateIssuanceResponse,
  UpdateCertificateParams,
  UpdateCertificateResponse,
} from "./types";

/**
 * Certificates API client
 *
 * TLS/SSL Certificates are used by Load Balancers to terminate HTTPS. They are
 * either uploaded or managed (issued and renewed by Hetzner via Let's Encrypt).
 *
 * In addition to the methods below, the pagination helpers `iterate()`,
 * `iteratePages()`, `listAll()` and `first()` as well as `getByName()` are
 * available.
 *
 * @see https://docs.hetzner.cloud/reference/cloud#certificates
 */
export class CertificatesClient extends NamedResource<
  Certificate,
  ListCertificatesParams,
  "certificates"
> {
  protected readonly itemsKey = "certificates";

  /**
   * Actions of all Certificates: `list()`, `get()`, `waitFor()` and `waitForAll()`.
   *
   * @example
   * ```typescript
   * const { actions } = await client.certificates.actions.list({ status: "running" });
   * ```
   */
  public readonly actions = new ResourceActionsClient(this.client, "/certificates");

  /**
   * Returns a page of Certificates.
   *
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#certificates-list-certificates
   *
   * @example
   * ```typescript
   * const { certificates } = await client.certificates.list({
   *   type: "managed",
   *   label_selector: "environment=production",
   *   sort: "name:asc",
   * });
   *
   * // All Certificates across all pages
   * const all = await client.certificates.listAll();
   * ```
   */
  list(
    params?: ListCertificatesParams,
    options?: RequestOptions,
  ): Promise<ListCertificatesResponse> {
    return this._get("/certificates", listCertificatesResponseSchema, params, options);
  }

  /**
   * Returns a specific Certificate.
   *
   * @param id - ID of the Certificate
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#certificates-get-a-certificate
   *
   * @example
   * ```typescript
   * const { certificate } = await client.certificates.get(12345);
   * console.log(certificate.not_valid_after);
   * ```
   */
  get(id: number, options?: RequestOptions): Promise<GetCertificateResponse> {
    return this._get(path`/certificates/${id}`, getCertificateResponseSchema, undefined, options);
  }

  /**
   * Creates a new Certificate.
   *
   * Without `type` (or with `type: "uploaded"`) a certificate and its private
   * key are uploaded. With `type: "managed"` a certificate for `domain_names`
   * is issued by Hetzner; the response then contains the issuance `action`
   * (see also {@link CertificatesClient.createManaged}).
   *
   * @param params - Name and either `certificate` + `private_key` or `type: "managed"` + `domain_names`
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#certificates-create-a-certificate
   *
   * @example
   * ```typescript
   * const { certificate } = await client.certificates.create({
   *   name: "my-certificate",
   *   certificate: "-----BEGIN CERTIFICATE-----\n...",
   *   private_key: "-----BEGIN PRIVATE KEY-----\n...",
   * });
   * ```
   */
  create(
    params: CreateCertificateParams,
    options?: RequestOptions,
  ): Promise<CreateCertificateResponse> {
    return this._post(
      "/certificates",
      createCertificateResponseSchema,
      params,
      createCertificateRequestSchema,
      options,
    );
  }

  /**
   * Creates a new managed Certificate, issued and renewed by Hetzner. The
   * domains must use Hetzner DNS.
   *
   * Same endpoint as {@link CertificatesClient.create}, but the response is
   * guaranteed to contain the issuance `action`.
   *
   * @param params - Name, domain names and optional labels
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#certificates-create-a-certificate
   *
   * @example
   * ```typescript
   * const { certificate, action } = await client.certificates.createManaged({
   *   name: "my-managed-certificate",
   *   domain_names: ["example.com", "www.example.com"],
   * });
   * await client.actions.waitFor(action);
   * ```
   */
  createManaged(
    params: Omit<CreateManagedCertificateParams, "type">,
    options?: RequestOptions,
  ): Promise<CreateManagedCertificateResponse> {
    return this._post(
      "/certificates",
      createManagedCertificateResponseSchema,
      { ...params, type: "managed" },
      createManagedCertificateRequestSchema,
      options,
    );
  }

  /**
   * Updates the name and/or labels of a Certificate.
   *
   * @param id - ID of the Certificate
   * @param params - Fields to update
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#certificates-update-a-certificate
   *
   * @example
   * ```typescript
   * const { certificate } = await client.certificates.update(12345, {
   *   name: "new-name",
   *   labels: { environment: "production" },
   * });
   * ```
   */
  update(
    id: number,
    params: UpdateCertificateParams,
    options?: RequestOptions,
  ): Promise<UpdateCertificateResponse> {
    return this._put(
      path`/certificates/${id}`,
      updateCertificateResponseSchema,
      params,
      updateCertificateRequestSchema,
      options,
    );
  }

  /**
   * Deletes a Certificate. It must not be in use by a Load Balancer.
   *
   * @param id - ID of the Certificate
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#certificates-delete-a-certificate
   *
   * @example
   * ```typescript
   * await client.certificates.delete(12345);
   * ```
   */
  delete(id: number, options?: RequestOptions): Promise<void> {
    return this._delete(path`/certificates/${id}`, null, options);
  }

  /**
   * Returns a page of actions of a Certificate.
   *
   * @param id - ID of the Certificate
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#certificates-list-actions-for-a-certificate
   *
   * @example
   * ```typescript
   * const { actions } = await client.certificates.listActions(12345, {
   *   status: "running",
   *   sort: "started:desc",
   * });
   * ```
   */
  listActions(
    id: number,
    params?: ListCertificateActionsParams,
    options?: RequestOptions,
  ): Promise<ListCertificateActionsResponse> {
    return this._get(path`/certificates/${id}/actions`, listActionsResponseSchema, params, options);
  }

  /**
   * Returns a specific action of a Certificate.
   *
   * @param id - ID of the Certificate
   * @param actionId - ID of the action
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#certificates-get-an-action-for-a-certificate
   *
   * @example
   * ```typescript
   * const { action } = await client.certificates.getAction(12345, 67890);
   * console.log(action.status);
   * ```
   */
  getAction(
    id: number,
    actionId: number,
    options?: RequestOptions,
  ): Promise<GetCertificateActionResponse> {
    return this._get(
      path`/certificates/${id}/actions/${actionId}`,
      getActionResponseSchema,
      undefined,
      options,
    );
  }

  /**
   * Retries a failed issuance or renewal of a managed Certificate.
   *
   * @param id - ID of the Certificate
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#certificates-retry-issuance-or-renewal
   *
   * @example
   * ```typescript
   * const { action } = await client.certificates.retryIssuance(12345);
   * await client.actions.waitFor(action);
   * ```
   */
  retryIssuance(id: number, options?: RequestOptions): Promise<RetryCertificateIssuanceResponse> {
    return this._post(
      path`/certificates/${id}/actions/retry`,
      actionResponseSchema,
      undefined,
      undefined,
      options,
    );
  }
}
