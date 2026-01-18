/**
 * Types for Hetzner Cloud Placement Groups API
 * Types are inferred from Zod schemas
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups
 */

// biome-ignore assist/source/organizeImports: we need to import the schemas first
import {
  listPlacementGroupsResponseSchema,
  createPlacementGroupRequestSchema,
  createPlacementGroupResponseSchema,
  getPlacementGroupResponseSchema,
  updatePlacementGroupRequestSchema,
  updatePlacementGroupResponseSchema,
  deletePlacementGroupResponseSchema,
  placementGroupSchema,
  placementGroupTypeSchema,
} from "@hcloud-js/apis/placement-groups/schemas.js";
import type { z } from "zod";

/**
 * Placement Group type
 */
export type PlacementGroupType = z.infer<typeof placementGroupTypeSchema>;

/**
 * Hetzner Cloud Placement Group
 */
export type PlacementGroup = z.infer<typeof placementGroupSchema>;

/**
 * List Placement Groups query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-list-placement-groups
 */
export interface ListPlacementGroupsParams {
  /**
   * Can be used to filter resources by their name. The response will only contain the resources matching the specified name.
   */
  name?: string;
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, name, name:asc, name:desc, created, created:asc, created:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
  /**
   * Can be used to filter resources by labels. The response will only contain resources matching the label selector.
   */
  label_selector?: string;
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
 * List Placement Groups response
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-list-placement-groups
 */
export type ListPlacementGroupsResponse = z.infer<typeof listPlacementGroupsResponseSchema>;

/**
 * Create Placement Group parameters
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-create-a-placement-group
 */
export type CreatePlacementGroupParams = z.infer<typeof createPlacementGroupRequestSchema>;

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
 * Update Placement Group parameters
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-update-a-placement-group
 */
export type UpdatePlacementGroupParams = z.infer<typeof updatePlacementGroupRequestSchema>;

/**
 * Update Placement Group response
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-update-a-placement-group
 */
export type UpdatePlacementGroupResponse = z.infer<typeof updatePlacementGroupResponseSchema>;

/**
 * Delete Placement Group response
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-delete-a-placement-group
 */
export type DeletePlacementGroupResponse = z.infer<typeof deletePlacementGroupResponseSchema>;
