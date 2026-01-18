/**
 * Hetzner Cloud Certificates API
 * @see https://docs.hetzner.cloud/reference/cloud#certificates
 */

import type { HCloudClient } from "@hcloud-js/client/index.js";
import type {
  ListCertificatesParams,
  ListCertificatesResponse,
  CreateCertificateParams,
  CreateCertificateResponse,
  GetCertificateResponse,
  UpdateCertificateParams,
  UpdateCertificateResponse,
  DeleteCertificateResponse,
  ListCertificateActionsParams,
  ListCertificateActionsResponse,
  GetCertificateActionResponse,
  RetryCertificateIssuanceResponse,
} from "@hcloud-js/apis/certificates/types.js";
import { validate } from "@hcloud-js/validation/index.js";
import {
  listCertificatesResponseSchema,
  createCertificateRequestSchema,
  createCertificateResponseSchema,
  getCertificateResponseSchema,
  updateCertificateRequestSchema,
  updateCertificateResponseSchema,
  deleteCertificateResponseSchema,
  listCertificateActionsResponseSchema,
  getCertificateActionResponseSchema,
  retryCertificateIssuanceResponseSchema,
} from "@hcloud-js/apis/certificates/schemas.js";

/**
 * Certificates API client
 */
export class CertificatesClient {
  constructor(private readonly client: HCloudClient) {}

  /**
   * Returns all Certificate objects.
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of certificates with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#certificates-list-certificates
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all certificates
   * const result = await client.certificates.list();
   *
   * // List certificates with filters
   * const managedCerts = await client.certificates.list({
   *   type: ['managed'],
   *   label_selector: 'environment=production',
   *   sort: ['name:asc'],
   *   page: 1,
   *   per_page: 50
   * });
   * ```
   */
  async list(params?: ListCertificatesParams): Promise<ListCertificatesResponse> {
    const queryParams: Record<string, string | number | string[] | undefined> = {};

    if (params?.name) {
      queryParams.name = params.name;
    }

    if (params?.label_selector) {
      queryParams.label_selector = params.label_selector;
    }

    if (params?.sort) {
      queryParams.sort = Array.isArray(params.sort) ? params.sort : [params.sort];
    }

    if (params?.type) {
      queryParams.type = Array.isArray(params.type) ? params.type : [params.type];
    }

    if (params?.page !== undefined) {
      queryParams.page = params.page;
    }

    if (params?.per_page !== undefined) {
      queryParams.per_page = params.per_page;
    }

    const response = await this.client.get<unknown>("/certificates", queryParams);

    return validate(listCertificatesResponseSchema, response, {
      context: "List certificates response",
      detailed: true,
    });
  }

  /**
   * Creates a new Certificate.
   *
   * @param params - Parameters for creating the certificate
   * @returns Promise resolving to the created certificate with action
   * @see https://docs.hetzner.cloud/reference/cloud#certificates-create-a-certificate
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Create an uploaded certificate
   * const result = await client.certificates.create({
   *   name: 'my-certificate',
   *   type: 'uploaded',
   *   certificate: '-----BEGIN CERTIFICATE-----...',
   *   private_key: '-----BEGIN PRIVATE KEY-----...'
   * });
   *
   * // Create a managed certificate
   * const result = await client.certificates.create({
   *   name: 'my-managed-cert',
   *   type: 'managed',
   *   domain_names: ['example.com', 'www.example.com']
   * });
   * ```
   */
  async create(params: CreateCertificateParams): Promise<CreateCertificateResponse> {
    const validatedParams = validate(createCertificateRequestSchema, params, {
      context: "Create certificate request",
      detailed: true,
    });

    const response = await this.client.post<unknown>("/certificates", validatedParams);

    return validate(createCertificateResponseSchema, response, {
      context: "Create certificate response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Certificate object.
   *
   * @param id - ID of the Certificate
   * @returns Promise resolving to the certificate
   * @see https://docs.hetzner.cloud/reference/cloud#certificates-get-a-certificate
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const certificate = await client.certificates.get(12345);
   * console.log(certificate.certificate.name);
   * ```
   */
  async get(id: number): Promise<GetCertificateResponse> {
    const response = await this.client.get<unknown>(`/certificates/${id}`);

    return validate(getCertificateResponseSchema, response, {
      context: "Get certificate response",
      detailed: true,
    });
  }

  /**
   * Updates a Certificate.
   *
   * You can update a Certificate's name and labels.
   *
   * @param id - ID of the Certificate
   * @param params - Parameters to update (name and/or labels)
   * @returns Promise resolving to the updated certificate
   * @see https://docs.hetzner.cloud/reference/cloud#certificates-update-a-certificate
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const updated = await client.certificates.update(12345, {
   *   name: 'new-certificate-name',
   *   labels: { environment: 'production' }
   * });
   * ```
   */
  async update(id: number, params: UpdateCertificateParams): Promise<UpdateCertificateResponse> {
    const validatedParams = validate(updateCertificateRequestSchema, params, {
      context: "Update certificate request",
      detailed: true,
    });

    const response = await this.client.put<unknown>(`/certificates/${id}`, validatedParams);

    return validate(updateCertificateResponseSchema, response, {
      context: "Update certificate response",
      detailed: true,
    });
  }

  /**
   * Deletes a Certificate.
   *
   * @param id - ID of the Certificate
   * @returns Promise resolving to the delete action
   * @see https://docs.hetzner.cloud/reference/cloud#certificates-delete-a-certificate
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.certificates.delete(12345);
   * console.log(`Delete action ID: ${result.action.id}`);
   * ```
   */
  async delete(id: number): Promise<DeleteCertificateResponse> {
    const response = await this.client.delete<unknown>(`/certificates/${id}`);

    return validate(deleteCertificateResponseSchema, response, {
      context: "Delete certificate response",
      detailed: true,
    });
  }

  /**
   * Returns all Action objects for a Certificate.
   *
   * @param id - ID of the Certificate
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of actions with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#certificates-list-actions-for-a-certificate
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const actions = await client.certificates.listActions(12345, {
   *   status: ['running'],
   *   sort: ['started:desc']
   * });
   * ```
   */
  async listActions(
    id: number,
    params?: ListCertificateActionsParams,
  ): Promise<ListCertificateActionsResponse> {
    const queryParams: Record<string, string | number | string[] | undefined> = {};

    if (params?.id !== undefined) {
      const ids = Array.isArray(params.id) ? params.id : [params.id];
      queryParams.id = ids.map(String);
    }

    if (params?.status) {
      queryParams.status = Array.isArray(params.status) ? params.status : [params.status];
    }

    if (params?.sort) {
      queryParams.sort = Array.isArray(params.sort) ? params.sort : [params.sort];
    }

    if (params?.page !== undefined) {
      queryParams.page = params.page;
    }

    if (params?.per_page !== undefined) {
      queryParams.per_page = params.per_page;
    }

    const response = await this.client.get<unknown>(`/certificates/${id}/actions`, queryParams);

    return validate(listCertificateActionsResponseSchema, response, {
      context: "List certificate actions response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Action object for a Certificate.
   *
   * @param id - ID of the Certificate
   * @param actionId - ID of the Action
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#certificates-get-an-action-for-a-certificate
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const action = await client.certificates.getAction(12345, 67890);
   * console.log(action.action.command);
   * ```
   */
  async getAction(id: number, actionId: number): Promise<GetCertificateActionResponse> {
    const response = await this.client.get<unknown>(`/certificates/${id}/actions/${actionId}`);

    return validate(getCertificateActionResponseSchema, response, {
      context: "Get certificate action response",
      detailed: true,
    });
  }

  /**
   * Retries the issuance or renewal of a managed Certificate.
   *
   * Only works for managed Certificates in state `verification_process`.
   *
   * @param id - ID of the Certificate
   * @returns Promise resolving to the retry action
   * @see https://docs.hetzner.cloud/reference/cloud#certificates-retry-issuance-or-renewal
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.certificates.retryIssuance(12345);
   * console.log(`Retry action ID: ${result.action.id}`);
   * ```
   */
  async retryIssuance(id: number): Promise<RetryCertificateIssuanceResponse> {
    const response = await this.client.post<unknown>(`/certificates/${id}/actions/retry`, {});

    return validate(retryCertificateIssuanceResponseSchema, response, {
      context: "Retry certificate issuance response",
      detailed: true,
    });
  }
}
