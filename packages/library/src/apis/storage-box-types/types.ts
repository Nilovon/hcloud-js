/**
 * Types for Hetzner Storage Box Types API
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-types
 */

import type { z } from "zod";
import type { PageParams } from "../common/types";
import type {
  getStorageBoxTypeResponseSchema,
  listStorageBoxTypesResponseSchema,
  storageBoxTypePriceSchema,
  storageBoxTypeSchema,
} from "./schemas";

/**
 * Price of a Storage Box Type in a location
 */
export type StorageBoxTypePrice = z.infer<typeof storageBoxTypePriceSchema>;

/**
 * Hetzner Storage Box Type
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-types
 */
export type StorageBoxType = z.infer<typeof storageBoxTypeSchema>;

/**
 * List Storage Box Types query parameters
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-types-list-storage-box-types
 */
export interface ListStorageBoxTypesParams extends PageParams {
  /**
   * Only return the Storage Box Type with this exact name.
   */
  name?: string;
}

/**
 * List Storage Box Types response
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-types-list-storage-box-types
 */
export type ListStorageBoxTypesResponse = z.infer<typeof listStorageBoxTypesResponseSchema>;

/**
 * Get Storage Box Type response
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-types-get-a-storage-box-type
 */
export type GetStorageBoxTypeResponse = z.infer<typeof getStorageBoxTypeResponseSchema>;
