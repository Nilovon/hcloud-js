/**
 * Types for Hetzner Storage Boxes API
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes
 */

import type { z } from "zod";
import type { ActionResponse } from "../actions/types";
import type { OneOrMany, PageParams, SortParam } from "../common/types";
import type {
  changeStorageBoxProtectionRequestSchema,
  changeStorageBoxSubaccountHomeDirectoryRequestSchema,
  changeStorageBoxTypeRequestSchema,
  createStorageBoxRequestSchema,
  createStorageBoxResponseSchema,
  createStorageBoxSnapshotRequestSchema,
  createStorageBoxSnapshotResponseSchema,
  createStorageBoxSubaccountRequestSchema,
  createStorageBoxSubaccountResponseSchema,
  enableStorageBoxSnapshotPlanRequestSchema,
  getStorageBoxResponseSchema,
  getStorageBoxSnapshotResponseSchema,
  getStorageBoxSubaccountResponseSchema,
  listStorageBoxesResponseSchema,
  listStorageBoxFoldersResponseSchema,
  listStorageBoxSnapshotsResponseSchema,
  listStorageBoxSubaccountsResponseSchema,
  resetStorageBoxPasswordRequestSchema,
  resetStorageBoxSubaccountPasswordRequestSchema,
  rollbackStorageBoxSnapshotRequestSchema,
  storageBoxAccessSettingsSchema,
  storageBoxProtectionSchema,
  storageBoxSchema,
  storageBoxSnapshotPlanSchema,
  storageBoxSnapshotSchema,
  storageBoxSnapshotStatsSchema,
  storageBoxStatsSchema,
  storageBoxStatusSchema,
  storageBoxSubaccountAccessSettingsSchema,
  storageBoxSubaccountSchema,
  updateStorageBoxAccessSettingsRequestSchema,
  updateStorageBoxRequestSchema,
  updateStorageBoxResponseSchema,
  updateStorageBoxSnapshotRequestSchema,
  updateStorageBoxSnapshotResponseSchema,
  updateStorageBoxSubaccountAccessSettingsRequestSchema,
  updateStorageBoxSubaccountRequestSchema,
  updateStorageBoxSubaccountResponseSchema,
} from "./schemas";

// Storage Boxes
// ----------------------------------------------------------------------------

/**
 * Hetzner Storage Box
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes
 */
export type StorageBox = z.infer<typeof storageBoxSchema>;

/**
 * Storage Box status values
 */
export type StorageBoxStatus = z.infer<typeof storageBoxStatusSchema>;

/**
 * Storage Box protection
 */
export type StorageBoxProtection = z.infer<typeof storageBoxProtectionSchema>;

/**
 * Storage Box access settings
 */
export type StorageBoxAccessSettings = z.infer<typeof storageBoxAccessSettingsSchema>;

/**
 * Storage Box snapshot plan
 */
export type StorageBoxSnapshotPlan = z.infer<typeof storageBoxSnapshotPlanSchema>;

/**
 * Storage Box usage statistics (sizes in bytes)
 */
export type StorageBoxStats = z.infer<typeof storageBoxStatsSchema>;

/**
 * Sort parameter of the Storage Box list endpoints. The well-known fields are
 * suggested, other fields are accepted as well.
 */
export type StorageBoxSort = SortParam<"id" | "name" | "created"> | (string & {});

/**
 * List Storage Boxes query parameters
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-list-storage-boxes
 */
export interface ListStorageBoxesParams extends PageParams {
  /**
   * Only return the Storage Box with this exact name.
   */
  name?: string;
  /**
   * Only return Storage Boxes matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
  /**
   * Sort the result.
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: OneOrMany<StorageBoxSort>;
}

/**
 * List Storage Boxes response
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-list-storage-boxes
 */
export type ListStorageBoxesResponse = z.infer<typeof listStorageBoxesResponseSchema>;

/**
 * Get Storage Box response
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-get-a-storage-box
 */
export type GetStorageBoxResponse = z.infer<typeof getStorageBoxResponseSchema>;

/**
 * Create Storage Box request parameters
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-create-a-storage-box
 */
export type CreateStorageBoxParams = z.input<typeof createStorageBoxRequestSchema>;

/**
 * Create Storage Box response
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-create-a-storage-box
 */
export type CreateStorageBoxResponse = z.infer<typeof createStorageBoxResponseSchema>;

/**
 * Update Storage Box request parameters
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-update-a-storage-box
 */
export type UpdateStorageBoxParams = z.input<typeof updateStorageBoxRequestSchema>;

/**
 * Update Storage Box response
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-update-a-storage-box
 */
export type UpdateStorageBoxResponse = z.infer<typeof updateStorageBoxResponseSchema>;

/**
 * Delete Storage Box response
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-delete-a-storage-box
 */
export type DeleteStorageBoxResponse = ActionResponse;

/**
 * List Storage Box folders query parameters
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-list-folders-of-a-storage-box
 */
export interface ListStorageBoxFoldersParams {
  /**
   * Relative path to list the folders of. Defaults to the root of the Storage Box.
   */
  path?: string;
}

/**
 * List Storage Box folders response
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-list-folders-of-a-storage-box
 */
export type ListStorageBoxFoldersResponse = z.infer<typeof listStorageBoxFoldersResponseSchema>;

// Storage Box actions
// ----------------------------------------------------------------------------

/**
 * Change Storage Box protection request parameters
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions-change-protection
 */
export type ChangeStorageBoxProtectionParams = z.input<
  typeof changeStorageBoxProtectionRequestSchema
>;

/**
 * Change Storage Box protection response
 */
export type ChangeStorageBoxProtectionResponse = ActionResponse;

/**
 * Change Storage Box type request parameters
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions-change-type
 */
export type ChangeStorageBoxTypeParams = z.input<typeof changeStorageBoxTypeRequestSchema>;

/**
 * Change Storage Box type response
 */
export type ChangeStorageBoxTypeResponse = ActionResponse;

/**
 * Reset Storage Box password request parameters
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions-reset-password
 */
export type ResetStorageBoxPasswordParams = z.input<typeof resetStorageBoxPasswordRequestSchema>;

/**
 * Reset Storage Box password response
 */
export type ResetStorageBoxPasswordResponse = ActionResponse;

/**
 * Update Storage Box access settings request parameters
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions-update-access-settings
 */
export type UpdateStorageBoxAccessSettingsParams = z.input<
  typeof updateStorageBoxAccessSettingsRequestSchema
>;

/**
 * Update Storage Box access settings response
 */
export type UpdateStorageBoxAccessSettingsResponse = ActionResponse;

/**
 * Rollback Storage Box snapshot request parameters
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions-rollback-snapshot
 */
export type RollbackStorageBoxSnapshotParams = z.input<
  typeof rollbackStorageBoxSnapshotRequestSchema
>;

/**
 * Rollback Storage Box snapshot response
 */
export type RollbackStorageBoxSnapshotResponse = ActionResponse;

/**
 * Enable Storage Box snapshot plan request parameters
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions-enable-snapshot-plan
 */
export type EnableStorageBoxSnapshotPlanParams = z.input<
  typeof enableStorageBoxSnapshotPlanRequestSchema
>;

/**
 * Enable Storage Box snapshot plan response
 */
export type EnableStorageBoxSnapshotPlanResponse = ActionResponse;

/**
 * Disable Storage Box snapshot plan response
 */
export type DisableStorageBoxSnapshotPlanResponse = ActionResponse;

// Snapshots
// ----------------------------------------------------------------------------

/**
 * Storage Box Snapshot
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-snapshots
 */
export type StorageBoxSnapshot = z.infer<typeof storageBoxSnapshotSchema>;

/**
 * Storage Box Snapshot statistics (sizes in bytes)
 */
export type StorageBoxSnapshotStats = z.infer<typeof storageBoxSnapshotStatsSchema>;

/**
 * List Storage Box Snapshots query parameters. The endpoint is not paginated.
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-snapshots-list-snapshots
 */
export interface ListStorageBoxSnapshotsParams {
  /**
   * Only return the snapshot with this exact name.
   */
  name?: string;
  /**
   * Only return snapshots that were (`true`) or were not (`false`) created by
   * the snapshot plan.
   */
  is_automatic?: boolean;
  /**
   * Only return snapshots matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
  /**
   * Sort the result.
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: OneOrMany<StorageBoxSort>;
}

/**
 * List Storage Box Snapshots response
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-snapshots-list-snapshots
 */
export type ListStorageBoxSnapshotsResponse = z.infer<typeof listStorageBoxSnapshotsResponseSchema>;

/**
 * Get Storage Box Snapshot response
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-snapshots-get-a-snapshot
 */
export type GetStorageBoxSnapshotResponse = z.infer<typeof getStorageBoxSnapshotResponseSchema>;

/**
 * Create Storage Box Snapshot request parameters
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-snapshots-create-a-snapshot
 */
export type CreateStorageBoxSnapshotParams = z.input<typeof createStorageBoxSnapshotRequestSchema>;

/**
 * Create Storage Box Snapshot response. `snapshot` is partial (`id` and `storage_box`).
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-snapshots-create-a-snapshot
 */
export type CreateStorageBoxSnapshotResponse = z.infer<
  typeof createStorageBoxSnapshotResponseSchema
>;

/**
 * Update Storage Box Snapshot request parameters
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-snapshots-update-a-snapshot
 */
export type UpdateStorageBoxSnapshotParams = z.input<typeof updateStorageBoxSnapshotRequestSchema>;

/**
 * Update Storage Box Snapshot response
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-snapshots-update-a-snapshot
 */
export type UpdateStorageBoxSnapshotResponse = z.infer<
  typeof updateStorageBoxSnapshotResponseSchema
>;

/**
 * Delete Storage Box Snapshot response
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-snapshots-delete-a-snapshot
 */
export type DeleteStorageBoxSnapshotResponse = ActionResponse;

// Subaccounts
// ----------------------------------------------------------------------------

/**
 * Storage Box Subaccount
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccounts
 */
export type StorageBoxSubaccount = z.infer<typeof storageBoxSubaccountSchema>;

/**
 * Storage Box Subaccount access settings
 */
export type StorageBoxSubaccountAccessSettings = z.infer<
  typeof storageBoxSubaccountAccessSettingsSchema
>;

/**
 * Sort parameter of the Storage Box Subaccount list endpoint. The well-known
 * fields are suggested, other fields are accepted as well.
 */
export type StorageBoxSubaccountSort =
  | SortParam<"id" | "name" | "username" | "created">
  | (string & {});

/**
 * List Storage Box Subaccounts query parameters. The endpoint is not paginated.
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccounts-list-subaccounts
 */
export interface ListStorageBoxSubaccountsParams {
  /**
   * Only return the subaccount with this exact name.
   */
  name?: string;
  /**
   * Only return the subaccount with this exact username.
   */
  username?: string;
  /**
   * Only return subaccounts matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
  /**
   * Sort the result.
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: OneOrMany<StorageBoxSubaccountSort>;
}

/**
 * List Storage Box Subaccounts response
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccounts-list-subaccounts
 */
export type ListStorageBoxSubaccountsResponse = z.infer<
  typeof listStorageBoxSubaccountsResponseSchema
>;

/**
 * Get Storage Box Subaccount response
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccounts-get-a-subaccount
 */
export type GetStorageBoxSubaccountResponse = z.infer<typeof getStorageBoxSubaccountResponseSchema>;

/**
 * Create Storage Box Subaccount request parameters
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccounts-create-a-subaccount
 */
export type CreateStorageBoxSubaccountParams = z.input<
  typeof createStorageBoxSubaccountRequestSchema
>;

/**
 * Create Storage Box Subaccount response. `subaccount` is partial (`id` and `storage_box`).
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccounts-create-a-subaccount
 */
export type CreateStorageBoxSubaccountResponse = z.infer<
  typeof createStorageBoxSubaccountResponseSchema
>;

/**
 * Update Storage Box Subaccount request parameters
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccounts-update-a-subaccount
 */
export type UpdateStorageBoxSubaccountParams = z.input<
  typeof updateStorageBoxSubaccountRequestSchema
>;

/**
 * Update Storage Box Subaccount response
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccounts-update-a-subaccount
 */
export type UpdateStorageBoxSubaccountResponse = z.infer<
  typeof updateStorageBoxSubaccountResponseSchema
>;

/**
 * Delete Storage Box Subaccount response
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccounts-delete-a-subaccount
 */
export type DeleteStorageBoxSubaccountResponse = ActionResponse;

/**
 * Change Storage Box Subaccount home directory request parameters
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccount-actions-change-home-directory
 */
export type ChangeStorageBoxSubaccountHomeDirectoryParams = z.input<
  typeof changeStorageBoxSubaccountHomeDirectoryRequestSchema
>;

/**
 * Change Storage Box Subaccount home directory response
 */
export type ChangeStorageBoxSubaccountHomeDirectoryResponse = ActionResponse;

/**
 * Reset Storage Box Subaccount password request parameters
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccount-actions-reset-password
 */
export type ResetStorageBoxSubaccountPasswordParams = z.input<
  typeof resetStorageBoxSubaccountPasswordRequestSchema
>;

/**
 * Reset Storage Box Subaccount password response
 */
export type ResetStorageBoxSubaccountPasswordResponse = ActionResponse;

/**
 * Update Storage Box Subaccount access settings request parameters
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccount-actions-update-access-settings
 */
export type UpdateStorageBoxSubaccountAccessSettingsParams = z.input<
  typeof updateStorageBoxSubaccountAccessSettingsRequestSchema
>;

/**
 * Update Storage Box Subaccount access settings response
 */
export type UpdateStorageBoxSubaccountAccessSettingsResponse = ActionResponse;
