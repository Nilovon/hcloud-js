/**
 * Zod schemas for Hetzner Cloud Volumes API
 * @see https://docs.hetzner.cloud/reference/cloud#volumes
 */

import { z } from "zod";
import { actionSchema } from "../actions/schemas";
import { labelsSchema, metaSchema } from "../common/schemas";
import { locationSchema } from "../locations/schemas";

/**
 * Volume status schema
 */
export const volumeStatusSchema = z.enum(["creating", "available"]);

/**
 * Filesystems a volume can be formatted with on creation
 */
export const volumeFormatSchema = z.enum(["xfs", "ext4"]);

/**
 * Volume protection schema
 */
export const volumeProtectionSchema = z.object({
  delete: z.boolean(),
});

/**
 * Volume schema
 */
export const volumeSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: volumeStatusSchema,
  /** ID of the server the volume is attached to, `null` if it is not attached. */
  server: z.number().nullable(),
  /** Location of the volume. It can only be attached to servers in the same location. */
  location: locationSchema,
  /** Size in GB. */
  size: z.number(),
  /** Device path of the volume on the file system of the server. */
  linux_device: z.string(),
  /** Filesystem of the volume if it was formatted on creation, `null` otherwise. */
  format: z.string().nullable(),
  protection: volumeProtectionSchema,
  labels: labelsSchema,
  created: z.string(),
});

/**
 * List Volumes response schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-list-volumes
 */
export const listVolumesResponseSchema = z.object({
  volumes: z.array(volumeSchema),
  meta: metaSchema.optional(),
});

/**
 * Create Volume request schema
 *
 * Exactly one of `location` and `server` must be given.
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-create-a-volume
 */
export const createVolumeRequestSchema = z
  .object({
    name: z.string().min(1),
    /** Size in GB. */
    size: z.number().int().positive(),
    /** ID or name of the location to create the volume in. Omit if `server` is passed. */
    location: z.string().min(1).optional(),
    /** ID of the server to attach the volume to. It is created in the location of the server. */
    server: z.number().int().optional(),
    /** Mount the volume after attaching it. Requires `server`. */
    automount: z.boolean().optional(),
    /** Format the volume after creation. */
    format: volumeFormatSchema.optional(),
    labels: labelsSchema.optional(),
  })
  .refine((params) => (params.location === undefined) !== (params.server === undefined), {
    message: "Exactly one of `location` and `server` must be given",
    path: ["location"],
  });

/**
 * Create Volume response schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-create-a-volume
 */
export const createVolumeResponseSchema = z.object({
  volume: volumeSchema,
  /** Action tracking the creation of the volume. */
  action: actionSchema,
  /** Actions performed after the creation, e.g. attaching the volume to a server. */
  next_actions: z.array(actionSchema),
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
  name: z.string().min(1).optional(),
  labels: labelsSchema.optional(),
});

/**
 * Update Volume response schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-update-a-volume
 */
export const updateVolumeResponseSchema = z.object({
  volume: volumeSchema,
});

/**
 * Attach Volume to Server request schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-attach-volume-to-a-server
 */
export const attachVolumeToServerRequestSchema = z.object({
  /** ID of the server the volume is attached to. */
  server: z.number().int(),
  /** Mount the volume after attaching it. */
  automount: z.boolean().optional(),
});

/**
 * Resize Volume request schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-resize-volume
 */
export const resizeVolumeRequestSchema = z.object({
  /** New size in GB. Must be greater than the current size. */
  size: z.number().int().positive(),
});

/**
 * Change Volume Protection request schema
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-change-volume-protection
 */
export const changeVolumeProtectionRequestSchema = z.object({
  /** If `true`, prevents the volume from being deleted. */
  delete: z.boolean().optional(),
});
