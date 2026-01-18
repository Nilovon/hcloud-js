/**
 * Zod schemas for Hetzner Cloud ISOs API
 * @see https://docs.hetzner.cloud/reference/cloud#isos-list-isos
 */

import { z } from "zod";
import { paginationMetaSchema } from "../../apis/common/schemas";

/**
 * ISO type schema
 */
export const isoTypeSchema = z.enum(["public", "private"]);

/**
 * ISO schema
 */
export const isoSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  type: isoTypeSchema,
});

/**
 * List ISOs response schema
 * @see https://docs.hetzner.cloud/reference/cloud#isos-list-isos
 */
export const listISOsResponseSchema = z.object({
  isos: z.array(isoSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Get ISO response schema
 * @see https://docs.hetzner.cloud/reference/cloud#isos-get-an-iso
 */
export const getISOResponseSchema = z.object({
  iso: isoSchema,
});
