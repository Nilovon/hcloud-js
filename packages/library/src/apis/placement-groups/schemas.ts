/**
 * Zod schemas for Hetzner Cloud Placement Groups API
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups
 */

import { z } from "zod";
import { actionSchema } from "../actions/schemas";
import { labelsSchema, metaSchema } from "../common/schemas";

/**
 * Placement Group type schema
 */
export const placementGroupTypeSchema = z.enum(["spread"]);

/**
 * Placement Group schema
 */
export const placementGroupSchema = z.object({
  id: z.number(),
  name: z.string(),
  labels: labelsSchema,
  created: z.string(),
  /** IDs of the servers assigned to the placement group. */
  servers: z.array(z.number()),
  type: placementGroupTypeSchema,
});

/**
 * List Placement Groups response schema
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-list-placement-groups
 */
export const listPlacementGroupsResponseSchema = z.object({
  placement_groups: z.array(placementGroupSchema),
  meta: metaSchema.optional(),
});

/**
 * Create Placement Group request schema
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-create-a-placement-group
 */
export const createPlacementGroupRequestSchema = z.object({
  name: z.string().min(1),
  type: placementGroupTypeSchema,
  labels: labelsSchema.optional(),
});

/**
 * Create Placement Group response schema
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-create-a-placement-group
 */
export const createPlacementGroupResponseSchema = z.object({
  placement_group: placementGroupSchema,
  action: actionSchema.nullable().optional(),
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
  name: z.string().min(1).optional(),
  labels: labelsSchema.optional(),
});

/**
 * Update Placement Group response schema
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-update-a-placement-group
 */
export const updatePlacementGroupResponseSchema = z.object({
  placement_group: placementGroupSchema,
});
