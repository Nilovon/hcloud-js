/**
 * Zod schemas for Hetzner Cloud Images API
 * @see https://docs.hetzner.cloud/reference/cloud#images-list-images
 */

import { z } from "zod";
import { paginationMetaSchema } from "@/apis/common/schemas";
import { actionSchema } from "@/apis/actions/schemas";

/**
 * Image status schema
 */
export const imageStatusSchema = z.enum(["available", "creating", "unavailable"]);

/**
 * Image type schema
 */
export const imageTypeSchema = z.enum(["system", "app", "snapshot", "backup"]);

/**
 * Image created from schema
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
 * Image deprecation schema
 */
export const imageDeprecationSchema = z.object({
  announced: z.string(),
  unavailable_after: z.string(),
});

/**
 * Image schema
 */
export const imageSchema = z
  .object({
    id: z.number(),
    type: imageTypeSchema,
    status: imageStatusSchema,
    name: z.string(),
    description: z.string(),
    image_size: z.number().nullable(),
    disk_size: z.number(),
    created: z.string(),
    created_from: imageCreatedFromSchema.nullable(),
    bound_to: z.number().nullable(),
    os_flavor: z.string(),
    os_version: z.string().nullable(),
    rapid_deploy: z.boolean(),
    protection: imageProtectionSchema,
    deprecation: imageDeprecationSchema.nullable().optional(),
    labels: z.record(z.string(), z.string()),
    deleted: z.string().nullable(),
  })
  .passthrough();

/**
 * List Images response schema
 * @see https://docs.hetzner.cloud/reference/cloud#images-list-images
 */
export const listImagesResponseSchema = z.object({
  images: z.array(imageSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Update Image request schema
 * @see https://docs.hetzner.cloud/reference/cloud#images-update-an-image
 */
export const updateImageRequestSchema = z.object({
  description: z.string().optional(),
  type: z.enum(["snapshot"]).optional(),
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Get Image response schema
 * @see https://docs.hetzner.cloud/reference/cloud#images-get-an-image
 */
export const getImageResponseSchema = z.object({
  image: imageSchema,
});

/**
 * Update Image response schema
 * @see https://docs.hetzner.cloud/reference/cloud#images-update-an-image
 */
export const updateImageResponseSchema = z.object({
  image: imageSchema,
});

/**
 * Delete Image response schema
 * @see https://docs.hetzner.cloud/reference/cloud#images-delete-an-image
 */
export const deleteImageResponseSchema = z.object({
  action: actionSchema,
});
