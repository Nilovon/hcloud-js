/**
 * Types for Hetzner Cloud Placement Groups API
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups
 */

import type { z } from "zod";
import type { OneOrMany, PageParams, SortParam } from "../common/types";
import type {
  createPlacementGroupRequestSchema,
  createPlacementGroupResponseSchema,
  getPlacementGroupResponseSchema,
  listPlacementGroupsResponseSchema,
  placementGroupSchema,
  placementGroupTypeSchema,
  updatePlacementGroupRequestSchema,
  updatePlacementGroupResponseSchema,
} from "./schemas";

/**
 * Placement Group type
 */
export type PlacementGroupType = z.infer<typeof placementGroupTypeSchema>;

/**
 * Hetzner Cloud Placement Group
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups
 */
export type PlacementGroup = z.infer<typeof placementGroupSchema>;

/**
 * Fields placement groups can be sorted by
 */
export type PlacementGroupSort = SortParam<"id" | "name" | "created">;

/**
 * List Placement Groups query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-list-placement-groups
 */
export interface ListPlacementGroupsParams extends PageParams {
  /**
   * Only return the placement group with this exact name.
   */
  name?: string;
  /**
   * Only return placement groups matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
  /**
   * Only return placement groups of the given type.
   */
  type?: OneOrMany<PlacementGroupType>;
  /**
   * Sort the result.
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: OneOrMany<PlacementGroupSort>;
}

/**
 * List Placement Groups response
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-list-placement-groups
 */
export type ListPlacementGroupsResponse = z.infer<typeof listPlacementGroupsResponseSchema>;

/**
 * Create Placement Group request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-create-a-placement-group
 */
export type CreatePlacementGroupParams = z.input<typeof createPlacementGroupRequestSchema>;

/**
 * Create Placement Group response
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-create-a-placement-group
 */
export type CreatePlacementGroupResponse = z.infer<typeof createPlacementGroupResponseSchema>;

/**
 * Get Placement Group response
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-get-a-placement-group
 */
export type GetPlacementGroupResponse = z.infer<typeof getPlacementGroupResponseSchema>;

/**
 * Update Placement Group request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-update-a-placement-group
 */
export type UpdatePlacementGroupParams = z.input<typeof updatePlacementGroupRequestSchema>;

/**
 * Update Placement Group response
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-update-a-placement-group
 */
export type UpdatePlacementGroupResponse = z.infer<typeof updatePlacementGroupResponseSchema>;
