/**
 * Types for Hetzner Cloud Volumes API
 * @see https://docs.hetzner.cloud/reference/cloud#volumes
 */

import type { z } from "zod";
import type {
  ActionResponse,
  GetActionResponse,
  ListActionsParams,
  ListActionsResponse,
} from "../actions/types";
import type { OneOrMany, PageParams, SortParam } from "../common/types";
import type {
  attachVolumeToServerRequestSchema,
  changeVolumeProtectionRequestSchema,
  createVolumeRequestSchema,
  createVolumeResponseSchema,
  getVolumeResponseSchema,
  listVolumesResponseSchema,
  resizeVolumeRequestSchema,
  updateVolumeRequestSchema,
  updateVolumeResponseSchema,
  volumeFormatSchema,
  volumeProtectionSchema,
  volumeSchema,
  volumeStatusSchema,
} from "./schemas";

/**
 * Volume status
 */
export type VolumeStatus = z.infer<typeof volumeStatusSchema>;

/**
 * Filesystems a volume can be formatted with on creation
 */
export type VolumeFormat = z.infer<typeof volumeFormatSchema>;

/**
 * Volume protection
 */
export type VolumeProtection = z.infer<typeof volumeProtectionSchema>;

/**
 * Hetzner Cloud Volume
 * @see https://docs.hetzner.cloud/reference/cloud#volumes
 */
export type Volume = z.infer<typeof volumeSchema>;

/**
 * Fields volumes can be sorted by
 */
export type VolumeSort = SortParam<"id" | "name" | "created">;

/**
 * List Volumes query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-list-volumes
 */
export interface ListVolumesParams extends PageParams {
  /**
   * Only return the volume with this exact name.
   */
  name?: string;
  /**
   * Only return volumes matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
  /**
   * Only return volumes with the given status.
   */
  status?: OneOrMany<VolumeStatus>;
  /**
   * Sort the result.
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: OneOrMany<VolumeSort>;
}

/**
 * List Volumes response
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-list-volumes
 */
export type ListVolumesResponse = z.infer<typeof listVolumesResponseSchema>;

/**
 * Create Volume request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-create-a-volume
 */
export type CreateVolumeParams = z.input<typeof createVolumeRequestSchema>;

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
 * Update Volume request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-update-a-volume
 */
export type UpdateVolumeParams = z.input<typeof updateVolumeRequestSchema>;

/**
 * Update Volume response
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-update-a-volume
 */
export type UpdateVolumeResponse = z.infer<typeof updateVolumeResponseSchema>;

/**
 * List Volume Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-list-actions-for-a-volume
 */
export type ListVolumeActionsParams = ListActionsParams;

/**
 * List Volume Actions response
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-list-actions-for-a-volume
 */
export type ListVolumeActionsResponse = ListActionsResponse;

/**
 * Get Volume Action response
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-get-an-action-for-a-volume
 */
export type GetVolumeActionResponse = GetActionResponse;

/**
 * Attach Volume to Server request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-attach-volume-to-a-server
 */
export type AttachVolumeToServerParams = z.input<typeof attachVolumeToServerRequestSchema>;

/**
 * Attach Volume to Server response
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-attach-volume-to-a-server
 */
export type AttachVolumeToServerResponse = ActionResponse;

/**
 * Detach Volume response
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-detach-volume
 */
export type DetachVolumeResponse = ActionResponse;

/**
 * Resize Volume request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-resize-volume
 */
export type ResizeVolumeParams = z.input<typeof resizeVolumeRequestSchema>;

/**
 * Resize Volume response
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-resize-volume
 */
export type ResizeVolumeResponse = ActionResponse;

/**
 * Change Volume Protection request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-change-volume-protection
 */
export type ChangeVolumeProtectionParams = z.input<typeof changeVolumeProtectionRequestSchema>;

/**
 * Change Volume Protection response
 * @see https://docs.hetzner.cloud/reference/cloud#volumes-change-volume-protection
 */
export type ChangeVolumeProtectionResponse = ActionResponse;
