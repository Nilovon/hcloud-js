/**
 * Types for Hetzner Cloud Volumes API
 * Types are inferred from Zod schemas
 * @see https://docs.hetzner.cloud/reference/cloud#volumes
 */

// biome-ignore assist/source/organizeImports: we need to import the schemas first
import {
  listVolumesResponseSchema,
  createVolumeRequestSchema,
  createVolumeResponseSchema,
  getVolumeResponseSchema,
  updateVolumeRequestSchema,
  updateVolumeResponseSchema,
  deleteVolumeResponseSchema,
  listVolumeActionsResponseSchema,
  getVolumeActionResponseSchema,
  attachVolumeToServerRequestSchema,
  attachVolumeToServerResponseSchema,
  detachVolumeRequestSchema,
  detachVolumeResponseSchema,
  resizeVolumeRequestSchema,
  resizeVolumeResponseSchema,
  changeVolumeProtectionRequestSchema,
  changeVolumeProtectionResponseSchema,
  volumeSchema,
  volumeStatusSchema,
  volumeProtectionSchema,
} from "../../apis/volumes/schemas";
import type { z } from "zod";

/**
 * Volume status
 */
export type VolumeStatus = z.infer<typeof volumeStatusSchema>;

/**
 * Volume protection
 */
export type VolumeProtection = z.infer<typeof volumeProtectionSchema>;

/**
 * Volume
 */
export type Volume = z.infer<typeof volumeSchema>;

/**
 * List Volumes query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-list-volumes
 */
export interface ListVolumesParams {
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
 * List Volumes response
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-list-volumes
 */
export type ListVolumesResponse = z.infer<typeof listVolumesResponseSchema>;

/**
 * Create Volume parameters
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-create-a-volume
 */
export type CreateVolumeParams = z.infer<typeof createVolumeRequestSchema>;

/**
 * Create Volume response
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-create-a-volume
 */
export type CreateVolumeResponse = z.infer<typeof createVolumeResponseSchema>;

/**
 * Get Volume response
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-get-a-volume
 */
export type GetVolumeResponse = z.infer<typeof getVolumeResponseSchema>;

/**
 * Update Volume parameters
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-update-a-volume
 */
export type UpdateVolumeParams = z.infer<typeof updateVolumeRequestSchema>;

/**
 * Update Volume response
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-update-a-volume
 */
export type UpdateVolumeResponse = z.infer<typeof updateVolumeResponseSchema>;

/**
 * Delete Volume response
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-delete-a-volume
 */
export type DeleteVolumeResponse = z.infer<typeof deleteVolumeResponseSchema>;

/**
 * List Volume Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-list-actions-for-a-volume
 */
export interface ListVolumeActionsParams {
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, command, command:asc, command:desc, status, status:asc, status:desc, progress, progress:asc, progress:desc, started, started:asc, started:desc, finished, finished:asc, finished:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
  /**
   * Can be used to filter Actions by status. The response will only contain Actions matching the status.
   */
  status?: string | string[];
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
 * List Volume Actions response
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-list-actions-for-a-volume
 */
export type ListVolumeActionsResponse = z.infer<typeof listVolumeActionsResponseSchema>;

/**
 * Get Volume Action response
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-get-an-action-for-a-volume
 */
export type GetVolumeActionResponse = z.infer<typeof getVolumeActionResponseSchema>;

/**
 * Attach Volume to Server parameters
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-attach-volume-to-a-server
 */
export type AttachVolumeToServerParams = z.infer<typeof attachVolumeToServerRequestSchema>;

/**
 * Attach Volume to Server response
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-attach-volume-to-a-server
 */
export type AttachVolumeToServerResponse = z.infer<typeof attachVolumeToServerResponseSchema>;

/**
 * Detach Volume response
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-detach-volume
 */
export type DetachVolumeResponse = z.infer<typeof detachVolumeResponseSchema>;

/**
 * Resize Volume parameters
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-resize-volume
 */
export type ResizeVolumeParams = z.infer<typeof resizeVolumeRequestSchema>;

/**
 * Resize Volume response
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-resize-volume
 */
export type ResizeVolumeResponse = z.infer<typeof resizeVolumeResponseSchema>;

/**
 * Change Volume Protection parameters
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-change-volume-protection
 */
export type ChangeVolumeProtectionParams = z.infer<
  typeof changeVolumeProtectionRequestSchema
>;

/**
 * Change Volume Protection response
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-change-volume-protection
 */
export type ChangeVolumeProtectionResponse = z.infer<
  typeof changeVolumeProtectionResponseSchema
>;
