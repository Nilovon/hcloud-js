/**
 * Types for Hetzner Cloud Datacenters API
 *
 * The Datacenters API is deprecated by Hetzner and is removed after 2026-10-01.
 * @see https://docs.hetzner.cloud/changelog#2026-06-02-datacenters-deprecated
 */

import type { z } from "zod";
import type { OneOrMany, PageParams, SortParam } from "../common/types";
import type {
  datacenterSchema,
  datacenterServerTypesSchema,
  getDataCenterResponseSchema,
  listDataCentersResponseSchema,
} from "./schemas";

/**
 * Server types of a datacenter
 *
 * @deprecated Use `locations[]` of a server type instead.
 * @see https://docs.hetzner.cloud/changelog#2026-04-01-datacenter-deprecations
 */
export type DatacenterServerTypes = z.infer<typeof datacenterServerTypesSchema>;

/**
 * Hetzner Cloud Datacenter
 *
 * @deprecated Datacenters are deprecated by Hetzner. Use locations instead.
 * @see https://docs.hetzner.cloud/changelog#2026-06-02-datacenters-deprecated
 */
export type Datacenter = z.infer<typeof datacenterSchema>;

/**
 * Fields datacenters can be sorted by
 *
 * @deprecated Datacenters are deprecated by Hetzner. Use locations instead.
 */
export type DatacenterSort = SortParam<"id" | "name">;

/**
 * List Datacenters query parameters
 *
 * @deprecated Datacenters are deprecated by Hetzner. Use locations instead.
 * @see https://docs.hetzner.cloud/reference/cloud#data-centers-list-data-centers
 */
export interface ListDataCentersParams extends PageParams {
  /**
   * Only return the datacenter with this exact name.
   */
  name?: string;
  /**
   * Sort the result.
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: OneOrMany<DatacenterSort>;
}

/**
 * List Datacenters response
 *
 * @deprecated Datacenters are deprecated by Hetzner. Use locations instead.
 * @see https://docs.hetzner.cloud/reference/cloud#data-centers-list-data-centers
 */
export type ListDataCentersResponse = z.infer<typeof listDataCentersResponseSchema>;

/**
 * Get Datacenter response
 *
 * @deprecated Datacenters are deprecated by Hetzner. Use locations instead.
 * @see https://docs.hetzner.cloud/reference/cloud#data-centers-get-a-data-center
 */
export type GetDataCenterResponse = z.infer<typeof getDataCenterResponseSchema>;
