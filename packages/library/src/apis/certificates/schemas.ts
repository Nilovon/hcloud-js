/**
 * Zod schemas for Hetzner Cloud Certificates API
 * @see https://docs.hetzner.cloud/reference/cloud#certificates
 */

import { z } from "zod";
import { actionSchema } from "../actions/schemas";
import { labelsSchema, metaSchema } from "../common/schemas";

/**
 * Certificate type schema
 */
export const certificateTypeSchema = z.enum(["uploaded", "managed"]);

/**
 * Error of a failed issuance or renewal of a managed Certificate
 */
export const certificateStatusErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
});

/**
 * Issuance and renewal status of a managed Certificate
 */
export const certificateStatusSchema = z.object({
  issuance: z.enum(["pending", "completed", "failed"]).optional(),
  renewal: z.enum(["scheduled", "pending", "failed", "unavailable"]).optional(),
  error: certificateStatusErrorSchema.nullable().optional(),
});

/**
 * Resource using a Certificate
 */
export const certificateUsedBySchema = z.object({
  id: z.number(),
  type: z.string(),
});

/**
 * Certificate schema
 *
 * `status` is only set for managed Certificates. While a managed Certificate
 * is being issued, `certificate`, `fingerprint` and the validity period are `null`.
 */
export const certificateSchema = z.object({
  id: z.number(),
  name: z.string(),
  labels: labelsSchema,
  type: certificateTypeSchema,
  certificate: z.string().nullable(),
  created: z.string(),
  not_valid_before: z.string().nullable(),
  not_valid_after: z.string().nullable(),
  domain_names: z.array(z.string()),
  fingerprint: z.string().nullable(),
  status: certificateStatusSchema.nullable().optional(),
  used_by: z.array(certificateUsedBySchema).optional(),
});

/**
 * List Certificates response schema
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-list-certificates
 */
export const listCertificatesResponseSchema = z.object({
  certificates: z.array(certificateSchema),
  meta: metaSchema.optional(),
});

/**
 * Create uploaded Certificate request schema
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-create-a-certificate
 */
export const createUploadedCertificateRequestSchema = z.object({
  name: z.string().min(1),
  type: z.literal("uploaded").optional(),
  certificate: z.string().min(1),
  private_key: z.string().min(1),
  labels: labelsSchema.optional(),
});

/**
 * Create managed Certificate request schema
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-create-a-certificate
 */
export const createManagedCertificateRequestSchema = z.object({
  name: z.string().min(1),
  type: z.literal("managed"),
  domain_names: z.array(z.string().min(1)).min(1),
  labels: labelsSchema.optional(),
});

/**
 * Create Certificate request schema: an uploaded (default) or a managed Certificate
 * @see https://docs.hetzner.cloud/reference/cloud#certificates-create-a-certificate
 */
export const createCertificateRequestSchema = z.discriminatedUnion("type", [
  createUploadedCertificateRequestSchema,
  createManagedCertificateRequestSchema,
]);

/**
 * Create Certificate response schema. `action` is only present for managed Certificates.
 */
export const createCertificateResponseSchema = z.object({
  certificate: certificateSchema,
  action: actionSchema.nullable().optional(),
});

/**
 * Create managed Certificate response schema
 */
export const createManagedCertificateResponseSchema = z.object({
  certificate: certificateSchema,
  action: actionSchema,
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
  labels: labelsSchema.optional(),
});

/**
 * Update Certificate response schema
 */
export const updateCertificateResponseSchema = z.object({
  certificate: certificateSchema,
});
