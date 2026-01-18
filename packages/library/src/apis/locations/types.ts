/**
 * Types for Hetzner Cloud Locations API
 * Types are inferred from Zod schemas
 * @see https://docs.hetzner.cloud/reference/cloud#locations
 */

// biome-ignore assist/source/organizeImports: we need to import the schemas first
import {
  listLocationsResponseSchema,
  getLocationResponseSchema,
  listDataCentersResponseSchema,
  getDataCenterResponseSchema,
  locationSchema,
  datacenterSchema,
  datacenterServerTypesSchema,
} from "@/apis/locations/schemas";
import type { z } from "zod";

/**
 * Hetzner Cloud Location
 * @see https://docs.hetzner.cloud/reference/cloud#locations-list-locations
 */
export type Location = z.infer<typeof locationSchema>;

/**
 * Datacenter server types information
 */
export type DatacenterServerTypes = z.infer<typeof datacenterServerTypesSchema>;

/**
 * Hetzner Cloud Datacenter
 * @see https://docs.hetzner.cloud/reference/cloud#data-centers-list-data-centers
 */
export type Datacenter = z.infer<typeof datacenterSchema>;

/**
 * Pagination metadata
 * @see https://docs.hetzner.cloud/reference/cloud#pagination
 * Re-exported from servers module for consistency
 */
export type { PaginationMeta } from "@/apis/servers/types";

/**
 * List Locations query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#locations-list-locations
 */
export interface ListLocationsParams {
  /**
   * Can be used to filter Locations by their name. The response will only contain the Location matching the specified name.
   */
  name?: string;
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, name, name:asc, name:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
  /**
   * Page number to return. For more information, see [Pagination](https://docs.hetzner.cloud/reference/cloud#pagination).
   */
  page?: number;
  /**
   * Maximum number of entries returned per page. For more information, see [Pagination](https://docs.hetzner.cloud/reference/cloud#pagination).
   */
  per_page?: number;
}

/**
 * List Locations response
 * @see https://docs.hetzner.cloud/reference/cloud#locations-list-locations
 */
export type ListLocationsResponse = z.infer<typeof listLocationsResponseSchema>;

/**
 * Get Location response
 * @see https://docs.hetzner.cloud/reference/cloud#locations-get-a-location
 */
export type GetLocationResponse = z.infer<typeof getLocationResponseSchema>;

/**
 * List Data Centers query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#data-centers-list-data-centers
 */
export interface ListDataCentersParams {
  /**
   * Can be used to filter Data Centers by their name. The response will only contain the Data Center matching the specified name.
   */
  name?: string;
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, name, name:asc, name:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
  /**
   * Page number to return. For more information, see [Pagination](https://docs.hetzner.cloud/reference/cloud#pagination).
   */
  page?: number;
  /**
   * Maximum number of entries returned per page. For more information, see [Pagination](https://docs.hetzner.cloud/reference/cloud#pagination).
   */
  per_page?: number;
}

/**
 * List Data Centers response
 * @see https://docs.hetzner.cloud/reference/cloud#data-centers-list-data-centers
 */
export type ListDataCentersResponse = z.infer<typeof listDataCentersResponseSchema>;

/**
 * Get Data Center response
 * @see https://docs.hetzner.cloud/reference/cloud#data-centers-get-a-data-center
 */
export type GetDataCenterResponse = z.infer<typeof getDataCenterResponseSchema>;
