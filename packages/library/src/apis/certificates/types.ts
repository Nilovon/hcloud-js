/**
 * Types for Hetzner Cloud Certificates API
 * Types are inferred from Zod schemas
 * @see https://docs.hetzner.cloud/reference/cloud#certificates
 */

// biome-ignore assist/source/organizeImports: we need to import the schemas first
import {
  certificateStatusSchema,
  certificateTypeSchema,
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
  certificateSchema,
} from "../../apis/certificates/schemas";
import { actionSchema } from "../../apis/actions/schemas";
import type { z } from "zod";

/**
 * Certificate status values
 */
export type CertificateStatus = z.infer<typeof certificateStatusSchema>;

/**
 * Certificate type values
 */
export type CertificateType = z.infer<typeof certificateTypeSchema>;

/**
 * Hetzner Cloud Certificate
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-list-certificates
 */
export type Certificate = z.infer<typeof certificateSchema>;

/**
 * Pagination metadata
 * @see https://docs.hetzner.cloud/reference/cloud#pagination
 * Re-exported from servers module for consistency
 */
export type { PaginationMeta } from "../../apis/servers/types";

/**
 * Action information
 * Re-exported from servers module for consistency
 */
export type Action = z.infer<typeof actionSchema>;

/**
 * List Certificates query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-list-certificates
 */
export interface ListCertificatesParams {
  /**
   * Can be used to filter Certificates by their name. The response will only contain the Certificate matching the specified name.
   */
  name?: string;
  /**
   * Can be used to filter Certificates by labels. The response will only contain Certificates matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, name, name:asc, name:desc, created, created:asc, created:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
  /**
   * Can be used multiple times. The response will only contain Certificates matching the specified type.
   * Choices: uploaded, managed
   */
  type?: CertificateType | CertificateType[];
  /**
   * Page number to return. For more information, see [Pagination](https://docs.hetzner.cloud/reference/cloud#pagination).
   */
  page?: number;
  /**
   * Maximum number of entries returned per page. For more information, see [Pagination](https://docs.hetzner.cloud/reference/cloud#pagination).
   */
  per_page?: number;
}

/**
 * List Certificates response
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-list-certificates
 */
export type ListCertificatesResponse = z.infer<typeof listCertificatesResponseSchema>;

/**
 * Create Certificate request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-create-a-certificate
 */
export type CreateCertificateParams = z.infer<typeof createCertificateRequestSchema>;

/**
 * Create Certificate response
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-create-a-certificate
 */
export type CreateCertificateResponse = z.infer<typeof createCertificateResponseSchema>;

/**
 * Get Certificate response
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-get-a-certificate
 */
export type GetCertificateResponse = z.infer<typeof getCertificateResponseSchema>;

/**
 * Update Certificate request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-update-a-certificate
 */
export type UpdateCertificateParams = z.infer<typeof updateCertificateRequestSchema>;

/**
 * Update Certificate response
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-update-a-certificate
 */
export type UpdateCertificateResponse = z.infer<typeof updateCertificateResponseSchema>;

/**
 * Delete Certificate response
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-delete-a-certificate
 */
export type DeleteCertificateResponse = z.infer<typeof deleteCertificateResponseSchema>;

/**
 * List Certificate Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-list-actions-for-a-certificate
 */
export interface ListCertificateActionsParams {
  /**
   * Can be used multiple times. The response will only contain Actions matching the specified IDs.
   */
  id?: number | number[];
  /**
   * Can be used multiple times. The response will only contain Actions matching the specified status.
   * Choices: running, success, error
   */
  status?: "running" | "success" | "error" | Array<"running" | "success" | "error">;
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, command, command:asc, command:desc, status, status:asc, status:desc, progress, progress:asc, progress:desc, started, started:asc, started:desc, finished, finished:asc, finished:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
  /**
   * Page number to return. For more information, see [Pagination](https://docs.hetzner.cloud/reference/cloud#pagination).
   */
  page?: number;
  /**
   * Maximum number of entries returned per page. For more information, see [Pagination](https://docs.hetzner.cloud/reference/cloud#pagination).
   */
  per_page?: number;
}

/**
 * List Certificate Actions response
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-list-actions-for-a-certificate
 */
export type ListCertificateActionsResponse = z.infer<typeof listCertificateActionsResponseSchema>;

/**
 * Get Certificate Action response
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-get-an-action-for-a-certificate
 */
export type GetCertificateActionResponse = z.infer<typeof getCertificateActionResponseSchema>;

/**
 * Retry Certificate Issuance/Renewal response
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-retry-issuance-or-renewal
 */
export type RetryCertificateIssuanceResponse = z.infer<typeof retryCertificateIssuanceResponseSchema>;
