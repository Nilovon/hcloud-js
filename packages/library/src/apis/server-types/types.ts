/**
 * Types for Hetzner Cloud Server Types API
 * @see https://docs.hetzner.cloud/reference/cloud#server-types
 */

import type { z } from "zod";
import type { PageParams } from "../common/types";
import type {
  cpuArchitectureSchema,
  getServerTypeResponseSchema,
  listServerTypesResponseSchema,
  serverTypeCpuTypeSchema,
  serverTypeLocationSchema,
  serverTypePriceSchema,
  serverTypeSchema,
  serverTypeStorageTypeSchema,
} from "./schemas";

/**
 * CPU architecture of server types, images and ISOs
 */
export type CpuArchitecture = z.infer<typeof cpuArchitectureSchema>;

/**
 * Storage type of the boot drive of a server type
 */
export type ServerTypeStorageType = z.infer<typeof serverTypeStorageTypeSchema>;

/**
 * CPU type of a server type
 */
export type ServerTypeCpuType = z.infer<typeof serverTypeCpuTypeSchema>;

/**
 * Price of a server type in a location
 */
export type ServerTypePrice = z.infer<typeof serverTypePriceSchema>;

/**
 * A location a server type is supported in, with per-location details
 */
export type ServerTypeLocation = z.infer<typeof serverTypeLocationSchema>;

/**
 * Hetzner Cloud Server Type
 * @see https://docs.hetzner.cloud/reference/cloud#server-types
 */
export type ServerType = z.infer<typeof serverTypeSchema>;

/**
 * List Server Types query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#server-types-list-server-types
 */
export interface ListServerTypesParams extends PageParams {
  /**
   * Only return the server type with this exact name.
   */
  name?: string;
}

/**
 * List Server Types response
 * @see https://docs.hetzner.cloud/reference/cloud#server-types-list-server-types
 */
export type ListServerTypesResponse = z.infer<typeof listServerTypesResponseSchema>;

/**
 * Get Server Type response
 * @see https://docs.hetzner.cloud/reference/cloud#server-types-get-a-server-type
 */
export type GetServerTypeResponse = z.infer<typeof getServerTypeResponseSchema>;
