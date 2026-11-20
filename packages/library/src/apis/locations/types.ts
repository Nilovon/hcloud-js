/**
 * Types for Hetzner Cloud Locations API
 * @see https://docs.hetzner.cloud/reference/cloud#locations
 */

import type { z } from "zod";
import type { OneOrMany, PageParams, SortParam } from "../common/types";
import type {
  getLocationResponseSchema,
  listLocationsResponseSchema,
  locationSchema,
} from "./schemas";

/**
 * Hetzner Cloud Location
 * @see https://docs.hetzner.cloud/reference/cloud#locations
 */
export type Location = z.infer<typeof locationSchema>;

/**
 * Fields locations can be sorted by
 */
export type LocationSort = SortParam<"id" | "name">;

/**
 * List Locations query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#locations-list-locations
 */
export interface ListLocationsParams extends PageParams {
  /**
   * Only return the location with this exact name.
   */
  name?: string;
  /**
   * Sort the result.
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: OneOrMany<LocationSort>;
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
