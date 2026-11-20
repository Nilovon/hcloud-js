/**
 * Zod schemas for Hetzner Storage Boxes API
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes
 */

import { z } from "zod";
import { actionSchema } from "../actions/schemas";
import { labelsSchema, metaSchema } from "../common/schemas";
import { locationSchema } from "../locations/schemas";
import { storageBoxTypeSchema } from "../storage-box-types/schemas";

/**
 * ID or name of a referenced resource, as accepted in request bodies.
 */
const idOrNameSchema = z.union([z.string().min(1), z.number().int()]);

// Storage Boxes
// ----------------------------------------------------------------------------

/**
 * Storage Box status schema
 */
export const storageBoxStatusSchema = z.enum(["active", "initializing", "locked"]);

/**
 * Storage Box protection schema
 */
export const storageBoxProtectionSchema = z.object({
  delete: z.boolean(),
});

/**
 * Storage Box access settings schema
 */
export const storageBoxAccessSettingsSchema = z.object({
  reachable_externally: z.boolean(),
  samba_enabled: z.boolean(),
  ssh_enabled: z.boolean(),
  webdav_enabled: z.boolean(),
  zfs_enabled: z.boolean(),
});

/**
 * Storage Box snapshot plan schema
 *
 * `day_of_week` and `day_of_month` are `null` if the plan is not restricted to
 * a specific day.
 */
export const storageBoxSnapshotPlanSchema = z.object({
  max_snapshots: z.number(),
  minute: z.number(),
  hour: z.number(),
  day_of_week: z.number().nullable(),
  day_of_month: z.number().nullable(),
});

/**
 * Storage Box usage statistics schema (sizes in bytes)
 */
export const storageBoxStatsSchema = z.object({
  size: z.number(),
  size_data: z.number(),
  size_snapshots: z.number(),
});

/**
 * Storage Box schema
 */
export const storageBoxSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: storageBoxStatusSchema,
  username: z.string().nullable(),
  server: z.string().nullable(),
  system: z.string().nullable(),
  storage_box_type: storageBoxTypeSchema,
  location: locationSchema,
  access_settings: storageBoxAccessSettingsSchema,
  snapshot_plan: storageBoxSnapshotPlanSchema.nullable(),
  stats: storageBoxStatsSchema,
  labels: labelsSchema,
  protection: storageBoxProtectionSchema,
  created: z.string(),
});

/**
 * List Storage Boxes response schema
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-list-storage-boxes
 */
export const listStorageBoxesResponseSchema = z.object({
  storage_boxes: z.array(storageBoxSchema),
  meta: metaSchema.optional(),
});

/**
 * Get Storage Box response schema
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-get-a-storage-box
 */
export const getStorageBoxResponseSchema = z.object({
  storage_box: storageBoxSchema,
});

/**
 * Access settings of a Storage Box in request bodies. Omitted settings keep
 * their current (or default) value.
 */
export const updateStorageBoxAccessSettingsRequestSchema = z.object({
  reachable_externally: z.boolean().optional(),
  samba_enabled: z.boolean().optional(),
  ssh_enabled: z.boolean().optional(),
  webdav_enabled: z.boolean().optional(),
  zfs_enabled: z.boolean().optional(),
});

/**
 * Create Storage Box request schema
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-create-a-storage-box
 */
export const createStorageBoxRequestSchema = z.object({
  name: z.string().min(1),
  password: z.string().min(1),
  location: idOrNameSchema,
  storage_box_type: idOrNameSchema,
  ssh_keys: z.array(z.string().min(1)).optional(),
  access_settings: updateStorageBoxAccessSettingsRequestSchema.optional(),
  labels: labelsSchema.optional(),
});

/**
 * Create Storage Box response schema
 */
export const createStorageBoxResponseSchema = z.object({
  storage_box: storageBoxSchema,
  action: actionSchema,
});

/**
 * Update Storage Box request schema
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-update-a-storage-box
 */
export const updateStorageBoxRequestSchema = z.object({
  name: z.string().min(1).optional(),
  labels: labelsSchema.optional(),
});

/**
 * Update Storage Box response schema
 */
export const updateStorageBoxResponseSchema = z.object({
  storage_box: storageBoxSchema,
});

/**
 * List Storage Box folders response schema
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-list-folders-of-a-storage-box
 */
export const listStorageBoxFoldersResponseSchema = z.object({
  folders: z.array(z.string()),
});

// Storage Box actions
// ----------------------------------------------------------------------------

/**
 * Change Storage Box protection request schema
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions-change-protection
 */
export const changeStorageBoxProtectionRequestSchema = z.object({
  delete: z.boolean().optional(),
});

/**
 * Change Storage Box type request schema
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions-change-type
 */
export const changeStorageBoxTypeRequestSchema = z.object({
  storage_box_type: idOrNameSchema,
});

/**
 * Reset Storage Box password request schema
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions-reset-password
 */
export const resetStorageBoxPasswordRequestSchema = z.object({
  password: z.string().min(1),
});

/**
 * Rollback Storage Box snapshot request schema
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions-rollback-snapshot
 */
export const rollbackStorageBoxSnapshotRequestSchema = z.object({
  snapshot: idOrNameSchema,
});

/**
 * Enable Storage Box snapshot plan request schema
 *
 * `day_of_week` (1 = Monday ... 7 = Sunday) and `day_of_month` (1-31) restrict
 * the plan to a specific day; `null` (the default) means every day.
 *
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions-enable-snapshot-plan
 */
export const enableStorageBoxSnapshotPlanRequestSchema = z.object({
  max_snapshots: z.number().int().min(0),
  minute: z.number().int().min(0).max(59),
  hour: z.number().int().min(0).max(23),
  day_of_week: z.number().int().min(1).max(7).nullable().optional(),
  day_of_month: z.number().int().min(1).max(31).nullable().optional(),
});

// Snapshots
// ----------------------------------------------------------------------------

/**
 * Storage Box Snapshot statistics schema (sizes in bytes)
 */
export const storageBoxSnapshotStatsSchema = z.object({
  size: z.number(),
  size_filesystem: z.number(),
});

/**
 * Storage Box Snapshot schema
 */
export const storageBoxSnapshotSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  is_automatic: z.boolean(),
  stats: storageBoxSnapshotStatsSchema,
  labels: labelsSchema,
  created: z.string(),
  /** ID of the Storage Box the snapshot belongs to */
  storage_box: z.number(),
});

/**
 * List Storage Box Snapshots response schema. The endpoint is not paginated.
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-snapshots-list-snapshots
 */
export const listStorageBoxSnapshotsResponseSchema = z.object({
  snapshots: z.array(storageBoxSnapshotSchema),
  meta: metaSchema.optional(),
});

/**
 * Get Storage Box Snapshot response schema
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-snapshots-get-a-snapshot
 */
export const getStorageBoxSnapshotResponseSchema = z.object({
  snapshot: storageBoxSnapshotSchema,
});

/**
 * Create Storage Box Snapshot request schema
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-snapshots-create-a-snapshot
 */
export const createStorageBoxSnapshotRequestSchema = z.object({
  description: z.string().optional(),
  labels: labelsSchema.optional(),
});

/**
 * Create Storage Box Snapshot response schema
 *
 * The API only returns a partial snapshot (`id` and `storage_box`). Fetch the
 * full snapshot once the action has finished.
 */
export const createStorageBoxSnapshotResponseSchema = z.object({
  snapshot: storageBoxSnapshotSchema.pick({ id: true, storage_box: true }),
  action: actionSchema,
});

/**
 * Update Storage Box Snapshot request schema
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-snapshots-update-a-snapshot
 */
export const updateStorageBoxSnapshotRequestSchema = z.object({
  description: z.string().optional(),
  labels: labelsSchema.optional(),
});

/**
 * Update Storage Box Snapshot response schema
 */
export const updateStorageBoxSnapshotResponseSchema = z.object({
  snapshot: storageBoxSnapshotSchema,
});

// Subaccounts
// ----------------------------------------------------------------------------

/**
 * Storage Box Subaccount access settings schema
 */
export const storageBoxSubaccountAccessSettingsSchema = z.object({
  reachable_externally: z.boolean(),
  samba_enabled: z.boolean(),
  ssh_enabled: z.boolean(),
  webdav_enabled: z.boolean(),
  readonly: z.boolean(),
});

/**
 * Storage Box Subaccount schema
 */
export const storageBoxSubaccountSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  username: z.string(),
  description: z.string(),
  server: z.string(),
  home_directory: z.string(),
  access_settings: storageBoxSubaccountAccessSettingsSchema,
  labels: labelsSchema,
  created: z.string(),
  /** ID of the Storage Box the subaccount belongs to */
  storage_box: z.number(),
});

/**
 * List Storage Box Subaccounts response schema. The endpoint is not paginated.
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccounts-list-subaccounts
 */
export const listStorageBoxSubaccountsResponseSchema = z.object({
  subaccounts: z.array(storageBoxSubaccountSchema),
  meta: metaSchema.optional(),
});

/**
 * Get Storage Box Subaccount response schema
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccounts-get-a-subaccount
 */
export const getStorageBoxSubaccountResponseSchema = z.object({
  subaccount: storageBoxSubaccountSchema,
});

/**
 * Access settings of a Storage Box Subaccount in request bodies. Omitted
 * settings keep their current (or default) value.
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccount-actions-update-access-settings
 */
export const updateStorageBoxSubaccountAccessSettingsRequestSchema = z.object({
  reachable_externally: z.boolean().optional(),
  samba_enabled: z.boolean().optional(),
  ssh_enabled: z.boolean().optional(),
  webdav_enabled: z.boolean().optional(),
  readonly: z.boolean().optional(),
});

/**
 * Create Storage Box Subaccount request schema
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccounts-create-a-subaccount
 */
export const createStorageBoxSubaccountRequestSchema = z.object({
  name: z.string().min(1).optional(),
  home_directory: z.string().min(1),
  password: z.string().min(1),
  access_settings: updateStorageBoxSubaccountAccessSettingsRequestSchema.optional(),
  description: z.string().optional(),
  labels: labelsSchema.optional(),
});

/**
 * Create Storage Box Subaccount response schema
 *
 * The API only returns a partial subaccount (`id` and `storage_box`). Fetch the
 * full subaccount once the action has finished.
 */
export const createStorageBoxSubaccountResponseSchema = z.object({
  subaccount: storageBoxSubaccountSchema.pick({ id: true, storage_box: true }),
  action: actionSchema,
});

/**
 * Update Storage Box Subaccount request schema
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccounts-update-a-subaccount
 */
export const updateStorageBoxSubaccountRequestSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  labels: labelsSchema.optional(),
});

/**
 * Update Storage Box Subaccount response schema
 */
export const updateStorageBoxSubaccountResponseSchema = z.object({
  subaccount: storageBoxSubaccountSchema,
});

/**
 * Change Storage Box Subaccount home directory request schema
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccount-actions-change-home-directory
 */
export const changeStorageBoxSubaccountHomeDirectoryRequestSchema = z.object({
  home_directory: z.string().min(1),
});

/**
 * Reset Storage Box Subaccount password request schema
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccount-actions-reset-password
 */
export const resetStorageBoxSubaccountPasswordRequestSchema = z.object({
  password: z.string().min(1),
});
