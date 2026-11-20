/**
 * Types for Hetzner Cloud Certificates API
 * @see https://docs.hetzner.cloud/reference/cloud#certificates
 */

import type { z } from "zod";
import type {
  ActionResponse,
  GetActionResponse,
  ListActionsParams,
  ListActionsResponse,
} from "../actions/types";
import type { OneOrMany, PageParams, SortParam } from "../common/types";
import type {
  certificateSchema,
  certificateStatusErrorSchema,
  certificateStatusSchema,
  certificateTypeSchema,
  certificateUsedBySchema,
  createCertificateRequestSchema,
  createCertificateResponseSchema,
  createManagedCertificateRequestSchema,
  createManagedCertificateResponseSchema,
  createUploadedCertificateRequestSchema,
  getCertificateResponseSchema,
  listCertificatesResponseSchema,
  updateCertificateRequestSchema,
  updateCertificateResponseSchema,
} from "./schemas";

/**
 * Hetzner Cloud Certificate
 * @see https://docs.hetzner.cloud/reference/cloud#certificates
 */
export type Certificate = z.infer<typeof certificateSchema>;

/**
 * Certificate type values
 */
export type CertificateType = z.infer<typeof certificateTypeSchema>;

/**
 * Issuance and renewal status of a managed Certificate
 */
export type CertificateStatus = z.infer<typeof certificateStatusSchema>;

/**
 * Error of a failed issuance or renewal of a managed Certificate
 */
export type CertificateStatusError = z.infer<typeof certificateStatusErrorSchema>;

/**
 * Resource using a Certificate
 */
export type CertificateUsedBy = z.infer<typeof certificateUsedBySchema>;

/**
 * Fields Certificates can be sorted by
 */
export type CertificateSort = SortParam<"id" | "name" | "created">;

/**
 * List Certificates query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-list-certificates
 */
export interface ListCertificatesParams extends PageParams {
  /**
   * Only return the Certificate with this exact name.
   */
  name?: string;
  /**
   * Only return Certificates matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
  /**
   * Only return Certificates of the given type(s).
   */
  type?: OneOrMany<CertificateType>;
  /**
   * Sort the result.
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: OneOrMany<CertificateSort>;
}

/**
 * List Certificates response
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-list-certificates
 */
export type ListCertificatesResponse = z.infer<typeof listCertificatesResponseSchema>;

/**
 * Create Certificate request parameters: an uploaded (default) or a managed Certificate
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-create-a-certificate
 */
export type CreateCertificateParams = z.input<typeof createCertificateRequestSchema>;

/**
 * Create uploaded Certificate request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-create-a-certificate
 */
export type CreateUploadedCertificateParams = z.input<
  typeof createUploadedCertificateRequestSchema
>;

/**
 * Create managed Certificate request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-create-a-certificate
 */
export type CreateManagedCertificateParams = z.input<typeof createManagedCertificateRequestSchema>;

/**
 * Create Certificate response. `action` is only present for managed Certificates.
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-create-a-certificate
 */
export type CreateCertificateResponse = z.infer<typeof createCertificateResponseSchema>;

/**
 * Create managed Certificate response
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-create-a-certificate
 */
export type CreateManagedCertificateResponse = z.infer<
  typeof createManagedCertificateResponseSchema
>;

/**
 * Get Certificate response
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-get-a-certificate
 */
export type GetCertificateResponse = z.infer<typeof getCertificateResponseSchema>;

/**
 * Update Certificate request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-update-a-certificate
 */
export type UpdateCertificateParams = z.input<typeof updateCertificateRequestSchema>;

/**
 * Update Certificate response
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-update-a-certificate
 */
export type UpdateCertificateResponse = z.infer<typeof updateCertificateResponseSchema>;

/**
 * List Certificate Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-list-actions-for-a-certificate
 */
export type ListCertificateActionsParams = ListActionsParams;

/**
 * List Certificate Actions response
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-list-actions-for-a-certificate
 */
export type ListCertificateActionsResponse = ListActionsResponse;

/**
 * Get Certificate Action response
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-get-an-action-for-a-certificate
 */
export type GetCertificateActionResponse = GetActionResponse;

/**
 * Retry Certificate Issuance/Renewal response
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-retry-issuance-or-renewal
 */
export type RetryCertificateIssuanceResponse = ActionResponse;
