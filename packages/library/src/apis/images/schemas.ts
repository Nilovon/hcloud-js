/**
 * Zod schemas for Hetzner Cloud Images API
 * @see https://docs.hetzner.cloud/reference/cloud#images
 */

import { z } from "zod";
import { deprecationInfoSchema, labelsSchema, metaSchema } from "../common/schemas";
import { cpuArchitectureSchema } from "../server-types/schemas";

/**
 * Image status schema
 */
export const imageStatusSchema = z.enum(["available", "creating", "unavailable"]);

/**
 * Image type schema
 */
export const imageTypeSchema = z.enum(["system", "app", "snapshot", "backup"]);

/**
 * Server an image was created from
 */
export const imageCreatedFromSchema = z.object({
  id: z.number(),
  name: z.string(),
});

/**
 * Image protection schema
 */
export const imageProtectionSchema = z.object({
  delete: z.boolean(),
});

/**
 * Image schema
 */
export const imageSchema = z.object({
  id: z.number(),
  type: imageTypeSchema,
  status: imageStatusSchema,
  /** Unique identifier of the image. Only set for system images. */
  name: z.string().nullable(),
  description: z.string(),
  /** Size of the image file in GB. Relevant for the costs of snapshots. */
  image_size: z.number().nullable(),
  /** Size of the disk contained in the image in GB. */
  disk_size: z.number(),
  created: z.string(),
  /** Server the image was created from. */
  created_from: imageCreatedFromSchema.nullable(),
  /** ID of the server the image is bound to. Only set for images of type `backup`. */
  bound_to: z.number().nullable(),
  os_flavor: z.string(),
  os_version: z.string().nullable(),
  /** CPU architecture the image is compatible with. */
  architecture: cpuArchitectureSchema,
  rapid_deploy: z.boolean().optional(),
  protection: imageProtectionSchema,
  /** Deprecation of the image, `null` if it is not deprecated. */
  deprecation: deprecationInfoSchema.nullable().optional(),
  /**
   * @deprecated Removed from the API by Hetzner. Use `deprecation` instead.
   * @see https://docs.hetzner.cloud/changelog#2026-09-08-removing-the-deprecated-field
   */
  deprecated: z.string().nullable().optional(),
  labels: labelsSchema,
  deleted: z.string().nullable().optional(),
});

/**
 * List Images response schema
 * @see https://docs.hetzner.cloud/reference/cloud#images-list-images
 */
export const listImagesResponseSchema = z.object({
  images: z.array(imageSchema),
  meta: metaSchema.optional(),
});

/**
 * Get Image response schema
 * @see https://docs.hetzner.cloud/reference/cloud#images-get-an-image
 */
export const getImageResponseSchema = z.object({
  image: imageSchema,
});

/**
 * Update Image request schema
 * @see https://docs.hetzner.cloud/reference/cloud#images-update-an-image
 */
export const updateImageRequestSchema = z.object({
  description: z.string().optional(),
  /** Converts a `backup` image into a `snapshot` image. */
  type: z.enum(["snapshot"]).optional(),
  labels: labelsSchema.optional(),
});

/**
 * Update Image response schema
 * @see https://docs.hetzner.cloud/reference/cloud#images-update-an-image
 */
export const updateImageResponseSchema = z.object({
  image: imageSchema,
});

/**
 * Change Image Protection request schema
 * @see https://docs.hetzner.cloud/reference/cloud#images-change-image-protection
 */
export const changeImageProtectionRequestSchema = z.object({
  /** If `true`, prevents the snapshot from being deleted. */
  delete: z.boolean().optional(),
});
