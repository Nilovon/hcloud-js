/**
 * Zod schemas for Hetzner Storage Box Types API
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-types
 */

import { z } from "zod";
import { deprecationInfoSchema, metaSchema, priceSchema } from "../common/schemas";

/**
 * Price of a Storage Box Type in a location
 */
export const storageBoxTypePriceSchema = z.object({
  location: z.string(),
  price_hourly: priceSchema,
  price_monthly: priceSchema,
  setup_fee: priceSchema,
});

/**
 * Storage Box Type schema
 */
export const storageBoxTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  snapshot_limit: z.number().nullable(),
  automatic_snapshot_limit: z.number().nullable(),
  subaccounts_limit: z.number(),
  size: z.number(),
  prices: z.array(storageBoxTypePriceSchema),
  deprecation: deprecationInfoSchema.nullable(),
});

/**
 * List Storage Box Types response schema
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-types-list-storage-box-types
 */
export const listStorageBoxTypesResponseSchema = z.object({
  storage_box_types: z.array(storageBoxTypeSchema),
  meta: metaSchema.optional(),
});

/**
 * Get Storage Box Type response schema
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-types-get-a-storage-box-type
 */
export const getStorageBoxTypeResponseSchema = z.object({
  storage_box_type: storageBoxTypeSchema,
});
