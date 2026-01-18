/**
 * Zod schemas for Hetzner Cloud Placement Groups API
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups
 */

import { z } from "zod";
import { actionSchema } from "../../apis/actions/schemas";
import { paginationMetaSchema } from "../../apis/common/schemas";

/**
 * Placement Group type schema
 */
export const placementGroupTypeSchema = z.enum(["spread"]);

/**
 * Placement Group schema
 */
export const placementGroupSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    labels: z.record(z.string(), z.string()),
    created: z.string(),
    servers: z.array(z.number()),
    type: placementGroupTypeSchema,
  })
  .passthrough();

/**
 * List Placement Groups response schema
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-list-placement-groups
 */
export const listPlacementGroupsResponseSchema = z.object({
  placement_groups: z.array(placementGroupSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Create Placement Group request schema
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-create-a-placement-group
 */
export const createPlacementGroupRequestSchema = z.object({
  name: z.string(),
  type: placementGroupTypeSchema,
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Create Placement Group response schema
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-create-a-placement-group
 */
export const createPlacementGroupResponseSchema = z.object({
  placement_group: placementGroupSchema,
  action: actionSchema.optional(),
});

/**
 * Get Placement Group response schema
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-get-a-placement-group
 */
export const getPlacementGroupResponseSchema = z.object({
  placement_group: placementGroupSchema,
});

/**
 * Update Placement Group request schema
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-update-a-placement-group
 */
export const updatePlacementGroupRequestSchema = z.object({
  name: z.string().optional(),
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Update Placement Group response schema
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-update-a-placement-group
 */
export const updatePlacementGroupResponseSchema = z.object({
  placement_group: placementGroupSchema,
});

/**
 * Delete Placement Group response schema
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-delete-a-placement-group
 */
export const deletePlacementGroupResponseSchema = z.object({});
