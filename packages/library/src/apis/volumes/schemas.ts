/**
 * Zod schemas for Hetzner Cloud Volumes API
 * @see https://docs.hetzner.cloud/reference/cloud#volumes
 */

import { z } from "zod";
import { actionSchema, actionResourceSchema } from "../../apis/actions/schemas";
import { paginationMetaSchema } from "../../apis/common/schemas";
import { locationSchema } from "../../apis/servers/schemas";

/**
 * Volume status schema
 */
export const volumeStatusSchema = z.enum(["creating", "available", "deleting"]);

/**
 * Volume protection schema
 */
export const volumeProtectionSchema = z.object({
  delete: z.boolean(),
});

/**
 * Volume schema
 */
export const volumeSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    status: volumeStatusSchema,
    server: z.number().nullable(),
    location: locationSchema,
    size: z.number(),
    linux_device: z.string(),
    created: z.string(),
    format: z.string().nullable(),
    labels: z.record(z.string(), z.string()),
    protection: volumeProtectionSchema,
    blocking: z.array(actionResourceSchema).optional(),
  })
  .passthrough();

/**
 * List Volumes response schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-list-volumes
 */
export const listVolumesResponseSchema = z.object({
  volumes: z.array(volumeSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Create Volume request schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-create-a-volume
 */
export const createVolumeRequestSchema = z.object({
  name: z.string(),
  size: z.number(),
  location: z.string().optional(),
  format: z.string().optional(),
  labels: z.record(z.string(), z.string()).optional(),
  automount: z.boolean().optional(),
  server: z.number().optional(),
});

/**
 * Create Volume response schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-create-a-volume
 */
export const createVolumeResponseSchema = z.object({
  volume: volumeSchema,
  action: actionSchema,
  next_actions: z.array(actionSchema).optional(),
});

/**
 * Get Volume response schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-get-a-volume
 */
export const getVolumeResponseSchema = z.object({
  volume: volumeSchema,
});

/**
 * Update Volume request schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-update-a-volume
 */
export const updateVolumeRequestSchema = z.object({
  name: z.string().optional(),
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Update Volume response schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-update-a-volume
 */
export const updateVolumeResponseSchema = z.object({
  volume: volumeSchema,
});

/**
 * Delete Volume response schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-delete-a-volume
 */
export const deleteVolumeResponseSchema = z.object({
  action: actionSchema.optional(),
});

/**
 * List Volume Actions response schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-list-actions-for-a-volume
 */
export const listVolumeActionsResponseSchema = z.object({
  actions: z.array(actionSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Get Volume Action response schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-get-an-action-for-a-volume
 */
export const getVolumeActionResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Attach Volume to Server request schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-attach-volume-to-a-server
 */
export const attachVolumeToServerRequestSchema = z.object({
  server: z.number(),
  automount: z.boolean().optional(),
});

/**
 * Attach Volume to Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-attach-volume-to-a-server
 */
export const attachVolumeToServerResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Detach Volume request schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-detach-volume
 */
export const detachVolumeRequestSchema = z.object({});

/**
 * Detach Volume response schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-detach-volume
 */
export const detachVolumeResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Resize Volume request schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-resize-volume
 */
export const resizeVolumeRequestSchema = z.object({
  size: z.number(),
});

/**
 * Resize Volume response schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-resize-volume
 */
export const resizeVolumeResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Change Volume Protection request schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-change-volume-protection
 */
export const changeVolumeProtectionRequestSchema = z.object({
  delete: z.boolean(),
});

/**
 * Change Volume Protection response schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-change-volume-protection
 */
export const changeVolumeProtectionResponseSchema = z.object({
  action: actionSchema,
});
