/**
 * Zod schemas for Hetzner Cloud ISOs API
 * @see https://docs.hetzner.cloud/reference/cloud#isos
 */

import { z } from "zod";
import { deprecationInfoSchema, metaSchema } from "../common/schemas";
import { cpuArchitectureSchema } from "../server-types/schemas";

/**
 * ISO type schema
 */
export const isoTypeSchema = z.enum(["public", "private"]);

/**
 * ISO schema
 */
export const isoSchema = z.object({
  id: z.number(),
  /** Unique identifier of the ISO. Only set for public ISOs. */
  name: z.string().nullable(),
  description: z.string(),
  type: isoTypeSchema.nullable(),
  /** CPU architecture the ISO is compatible with. `null` if the compatibility is unknown. */
  architecture: cpuArchitectureSchema.nullable().optional(),
  /** Deprecation of the ISO, `null` if it is not deprecated. */
  deprecation: deprecationInfoSchema.nullable().optional(),
  /**
   * @deprecated Removed from the API by Hetzner. Use `deprecation.unavailable_after` instead.
   */
  deprecated: z.string().nullable().optional(),
});

/**
 * List ISOs response schema
 * @see https://docs.hetzner.cloud/reference/cloud#isos-list-isos
 */
export const listISOsResponseSchema = z.object({
  isos: z.array(isoSchema),
  meta: metaSchema.optional(),
});

/**
 * Get ISO response schema
 * @see https://docs.hetzner.cloud/reference/cloud#isos-get-an-iso
 */
export const getISOResponseSchema = z.object({
  iso: isoSchema,
});
