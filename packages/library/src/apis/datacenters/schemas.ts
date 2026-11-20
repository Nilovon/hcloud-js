/**
 * Zod schemas for Hetzner Cloud Datacenters API
 *
 * The Datacenters API is deprecated by Hetzner and is removed after 2026-10-01.
 * @see https://docs.hetzner.cloud/changelog#2026-06-02-datacenters-deprecated
 */

import { z } from "zod";
import { metaSchema } from "../common/schemas";
import { locationSchema } from "../locations/schemas";

/**
 * Datacenter server types schema: IDs of the server types of a datacenter
 *
 * @deprecated Use `locations[]` of a server type instead.
 * @see https://docs.hetzner.cloud/changelog#2026-04-01-datacenter-deprecations
 */
export const datacenterServerTypesSchema = z.object({
  supported: z.array(z.number()),
  available: z.array(z.number()),
  available_for_migration: z.array(z.number()),
});

/**
 * Datacenter schema
 *
 * @deprecated Datacenters are deprecated by Hetzner. Use locations instead.
 * @see https://docs.hetzner.cloud/changelog#2026-06-02-datacenters-deprecated
 */
export const datacenterSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  location: locationSchema,
  /**
   * @deprecated Use `locations[]` of a server type instead.
   * @see https://docs.hetzner.cloud/changelog#2026-04-01-datacenter-deprecations
   */
  server_types: datacenterServerTypesSchema.optional(),
});

/**
 * List Datacenters response schema
 *
 * @deprecated Datacenters are deprecated by Hetzner. Use locations instead.
 * @see https://docs.hetzner.cloud/reference/cloud#data-centers-list-data-centers
 */
export const listDataCentersResponseSchema = z.object({
  datacenters: z.array(datacenterSchema),
  /** ID of the datacenter recommended for creating new resources. */
  recommendation: z.number().optional(),
  meta: metaSchema.optional(),
});

/**
 * Get Datacenter response schema
 *
 * @deprecated Datacenters are deprecated by Hetzner. Use locations instead.
 * @see https://docs.hetzner.cloud/reference/cloud#data-centers-get-a-data-center
 */
export const getDataCenterResponseSchema = z.object({
  datacenter: datacenterSchema,
});
