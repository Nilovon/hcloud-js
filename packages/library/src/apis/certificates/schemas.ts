/**
 * Zod schemas for Hetzner Cloud Certificates API
 * @see https://docs.hetzner.cloud/reference/cloud#certificates
 */

import { z } from "zod";
import { actionSchema, actionResourceSchema } from "@hcloud-js/apis/actions/schemas.js";
import { paginationMetaSchema } from "@hcloud-js/apis/common/schemas.js";

/**
 * Certificate status schema
 */
export const certificateStatusSchema = z.enum(["ready", "verification_process", "pending_deletion"]);

/**
 * Certificate type schema
 */
export const certificateTypeSchema = z.enum(["uploaded", "managed"]);

/**
 * Certificate schema
 */
export const certificateSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    labels: z.record(z.string(), z.string()),
    type: certificateTypeSchema,
    certificate: z.string().nullable(),
    created: z.string(),
    not_valid_before: z.string(),
    not_valid_after: z.string(),
    domain_names: z.array(z.string()),
    fingerprint: z.string().nullable(),
    status: certificateStatusSchema.optional(),
    used_by: z
      .array(
        z.object({
          id: z.number(),
          type: z.string(),
        }),
      )
      .optional(),
  })
  .passthrough();

/**
 * List Certificates response schema
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-list-certificates
 */
export const listCertificatesResponseSchema = z.object({
  certificates: z.array(certificateSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Create Certificate request schema
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-create-a-certificate
 */
export const createCertificateRequestSchema = z.object({
  name: z.string().min(1),
  type: certificateTypeSchema.optional(),
  certificate: z.string().optional(),
  private_key: z.string().optional(),
  domain_names: z.array(z.string()).optional(),
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Create Certificate response schema
 */
export const createCertificateResponseSchema = z.object({
  certificate: certificateSchema,
  action: actionSchema.nullable(),
});

/**
 * Get Certificate response schema
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-get-a-certificate
 */
export const getCertificateResponseSchema = z.object({
  certificate: certificateSchema,
});

/**
 * Update Certificate request schema
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-update-a-certificate
 */
export const updateCertificateRequestSchema = z.object({
  name: z.string().min(1).optional(),
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Update Certificate response schema
 */
export const updateCertificateResponseSchema = z.object({
  certificate: certificateSchema,
});

/**
 * Delete Certificate response schema
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-delete-a-certificate
 */
export const deleteCertificateResponseSchema = z.object({
  action: actionSchema,
});

/**
 * List Certificate Actions response schema
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-list-actions-for-a-certificate
 */
export const listCertificateActionsResponseSchema = z.object({
  actions: z.array(actionSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Get Certificate Action response schema
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-get-an-action-for-a-certificate
 */
export const getCertificateActionResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Retry Certificate Issuance/Renewal response schema
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-retry-issuance-or-renewal
 */
export const retryCertificateIssuanceResponseSchema = z.object({
  action: actionSchema,
});
