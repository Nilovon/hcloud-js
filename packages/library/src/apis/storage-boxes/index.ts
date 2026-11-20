/**
 * Hetzner Storage Boxes API
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes
 */

import { NamedResource, path } from "../../core/resource";
import type { ApiTarget, RequestOptions } from "../../core/types";
import { ResourceActionsClient } from "../actions/index";
import { actionResponseSchema, listActionsResponseSchema } from "../actions/schemas";
import type { ListActionsParams, ListActionsResponse } from "../actions/types";
import {
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
  updateStorageBoxAccessSettingsRequestSchema,
  updateStorageBoxRequestSchema,
  updateStorageBoxResponseSchema,
  updateStorageBoxSnapshotRequestSchema,
  updateStorageBoxSnapshotResponseSchema,
  updateStorageBoxSubaccountAccessSettingsRequestSchema,
  updateStorageBoxSubaccountRequestSchema,
  updateStorageBoxSubaccountResponseSchema,
} from "./schemas";
import type {
  ChangeStorageBoxProtectionParams,
  ChangeStorageBoxProtectionResponse,
  ChangeStorageBoxSubaccountHomeDirectoryParams,
  ChangeStorageBoxSubaccountHomeDirectoryResponse,
  ChangeStorageBoxTypeParams,
  ChangeStorageBoxTypeResponse,
  CreateStorageBoxParams,
  CreateStorageBoxResponse,
  CreateStorageBoxSnapshotParams,
  CreateStorageBoxSnapshotResponse,
  CreateStorageBoxSubaccountParams,
  CreateStorageBoxSubaccountResponse,
  DeleteStorageBoxResponse,
  DeleteStorageBoxSnapshotResponse,
  DeleteStorageBoxSubaccountResponse,
  DisableStorageBoxSnapshotPlanResponse,
  EnableStorageBoxSnapshotPlanParams,
  EnableStorageBoxSnapshotPlanResponse,
  GetStorageBoxResponse,
  GetStorageBoxSnapshotResponse,
  GetStorageBoxSubaccountResponse,
  ListStorageBoxesParams,
  ListStorageBoxesResponse,
  ListStorageBoxFoldersParams,
  ListStorageBoxFoldersResponse,
  ListStorageBoxSnapshotsParams,
  ListStorageBoxSnapshotsResponse,
  ListStorageBoxSubaccountsParams,
  ListStorageBoxSubaccountsResponse,
  ResetStorageBoxPasswordParams,
  ResetStorageBoxPasswordResponse,
  ResetStorageBoxSubaccountPasswordParams,
  ResetStorageBoxSubaccountPasswordResponse,
  RollbackStorageBoxSnapshotParams,
  RollbackStorageBoxSnapshotResponse,
  StorageBox,
  StorageBoxSnapshot,
  StorageBoxSubaccount,
  UpdateStorageBoxAccessSettingsParams,
  UpdateStorageBoxAccessSettingsResponse,
  UpdateStorageBoxParams,
  UpdateStorageBoxResponse,
  UpdateStorageBoxSnapshotParams,
  UpdateStorageBoxSnapshotResponse,
  UpdateStorageBoxSubaccountAccessSettingsParams,
  UpdateStorageBoxSubaccountAccessSettingsResponse,
  UpdateStorageBoxSubaccountParams,
  UpdateStorageBoxSubaccountResponse,
} from "./types";

/**
 * Storage Boxes API client
 *
 * Storage Boxes are managed online storage, reachable via SSH/SFTP, Samba and
 * WebDAV. This client also covers their snapshots and subaccounts.
 *
 * Storage Boxes are served by the Hetzner API (`https://api.hetzner.com/v1`),
 * not by the Hetzner Cloud API. The client selects the right host
 * automatically, but it has one important consequence: actions returned by the
 * methods below live on the Hetzner API as well and must be awaited with
 * `client.storageBoxes.actions.waitFor()` / `waitForAll()`. The global
 * `client.actions` talks to the Hetzner Cloud API and does not know them.
 *
 * In addition to the methods below, the pagination helpers `iterate()`,
 * `iteratePages()`, `listAll()` and `first()` as well as `getByName()` are
 * available.
 *
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes
 */
export class StorageBoxesClient extends NamedResource<
  StorageBox,
  ListStorageBoxesParams,
  "storage_boxes"
> {
  protected readonly itemsKey = "storage_boxes";
  protected override readonly api: ApiTarget = "hetzner";

  /**
   * Actions of Storage Boxes (`GET /storage_boxes/actions` and
   * `GET /storage_boxes/actions/{id}`), including `waitFor()` and `waitForAll()`.
   *
   * Always wait for Storage Box actions with this client, never with
   * `client.actions`: Storage Box actions are served by the Hetzner API
   * (`api.hetzner.com`), which the global actions client does not query.
   *
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions
   *
   * @example
   * ```typescript
   * const created = await client.storageBoxes.create({ ... });
   * await client.storageBoxes.actions.waitFor(created);
   * ```
   */
  public readonly actions = new ResourceActionsClient(this.client, "/storage_boxes", "hetzner");

  // Storage Boxes
  // --------------------------------------------------------------------------

  /**
   * Returns a page of Storage Boxes.
   *
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-list-storage-boxes
   *
   * @example
   * ```typescript
   * const { storage_boxes } = await client.storageBoxes.list({
   *   label_selector: "environment=production",
   *   sort: "name:asc",
   * });
   *
   * // All Storage Boxes across all pages
   * const all = await client.storageBoxes.listAll();
   * ```
   */
  list(
    params?: ListStorageBoxesParams,
    options?: RequestOptions,
  ): Promise<ListStorageBoxesResponse> {
    return this._get("/storage_boxes", listStorageBoxesResponseSchema, params, options);
  }

  /**
   * Returns a specific Storage Box.
   *
   * @param id - ID of the Storage Box
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-get-a-storage-box
   *
   * @example
   * ```typescript
   * const { storage_box } = await client.storageBoxes.get(42);
   * console.log(storage_box.server, storage_box.stats.size);
   * ```
   */
  get(id: number, options?: RequestOptions): Promise<GetStorageBoxResponse> {
    return this._get(path`/storage_boxes/${id}`, getStorageBoxResponseSchema, undefined, options);
  }

  /**
   * Creates a new Storage Box.
   *
   * The Storage Box is usable once the returned action has finished.
   *
   * @param params - Name, password, location, type and optional settings
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-create-a-storage-box
   *
   * @example
   * ```typescript
   * const created = await client.storageBoxes.create({
   *   name: "backups",
   *   password: "my-secret-password",
   *   location: "fsn1",
   *   storage_box_type: "bx11",
   *   access_settings: { ssh_enabled: true },
   * });
   * await client.storageBoxes.actions.waitFor(created);
   * ```
   */
  create(
    params: CreateStorageBoxParams,
    options?: RequestOptions,
  ): Promise<CreateStorageBoxResponse> {
    return this._post(
      "/storage_boxes",
      createStorageBoxResponseSchema,
      params,
      createStorageBoxRequestSchema,
      options,
    );
  }

  /**
   * Updates the name and/or labels of a Storage Box.
   *
   * @param id - ID of the Storage Box
   * @param params - Fields to update
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-update-a-storage-box
   *
   * @example
   * ```typescript
   * const { storage_box } = await client.storageBoxes.update(42, {
   *   name: "new-name",
   *   labels: { environment: "production" },
   * });
   * ```
   */
  update(
    id: number,
    params: UpdateStorageBoxParams,
    options?: RequestOptions,
  ): Promise<UpdateStorageBoxResponse> {
    return this._put(
      path`/storage_boxes/${id}`,
      updateStorageBoxResponseSchema,
      params,
      updateStorageBoxRequestSchema,
      options,
    );
  }

  /**
   * Deletes a Storage Box. Deletion is asynchronous, the API answers with an action.
   *
   * @param id - ID of the Storage Box
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-delete-a-storage-box
   *
   * @example
   * ```typescript
   * const { action } = await client.storageBoxes.delete(42);
   * await client.storageBoxes.actions.waitFor(action);
   * ```
   */
  delete(id: number, options?: RequestOptions): Promise<DeleteStorageBoxResponse> {
    return this._delete(path`/storage_boxes/${id}`, actionResponseSchema, options);
  }

  /**
   * Lists the (sub)folders of a Storage Box. Files are not part of the response.
   *
   * @param id - ID of the Storage Box
   * @param params - Relative path to list the folders of
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes-list-folders-of-a-storage-box
   *
   * @example
   * ```typescript
   * const { folders } = await client.storageBoxes.listFolders(42, { path: "backups/daily" });
   * ```
   */
  listFolders(
    id: number,
    params?: ListStorageBoxFoldersParams,
    options?: RequestOptions,
  ): Promise<ListStorageBoxFoldersResponse> {
    return this._get(
      path`/storage_boxes/${id}/folders`,
      listStorageBoxFoldersResponseSchema,
      params,
      options,
    );
  }

  // Storage Box actions
  // --------------------------------------------------------------------------

  /**
   * Returns a page of actions of a specific Storage Box.
   *
   * @param id - ID of the Storage Box
   * @param params - Status filter, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions-list-actions-for-a-storage-box
   *
   * @example
   * ```typescript
   * const { actions } = await client.storageBoxes.listActions(42, { status: "running" });
   * ```
   */
  listActions(
    id: number,
    params?: ListActionsParams,
    options?: RequestOptions,
  ): Promise<ListActionsResponse> {
    return this._get(
      path`/storage_boxes/${id}/actions`,
      listActionsResponseSchema,
      params,
      options,
    );
  }

  /**
   * Changes the protection of a Storage Box.
   *
   * @param id - ID of the Storage Box
   * @param params - Protection settings
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions-change-protection
   *
   * @example
   * ```typescript
   * const { action } = await client.storageBoxes.changeProtection(42, { delete: true });
   * ```
   */
  changeProtection(
    id: number,
    params: ChangeStorageBoxProtectionParams,
    options?: RequestOptions,
  ): Promise<ChangeStorageBoxProtectionResponse> {
    return this._post(
      path`/storage_boxes/${id}/actions/change_protection`,
      actionResponseSchema,
      params,
      changeStorageBoxProtectionRequestSchema,
      options,
    );
  }

  /**
   * Changes the type (size) of a Storage Box.
   *
   * @param id - ID of the Storage Box
   * @param params - ID or name of the Storage Box Type to change to
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions-change-type
   *
   * @example
   * ```typescript
   * const { action } = await client.storageBoxes.changeType(42, { storage_box_type: "bx21" });
   * ```
   */
  changeType(
    id: number,
    params: ChangeStorageBoxTypeParams,
    options?: RequestOptions,
  ): Promise<ChangeStorageBoxTypeResponse> {
    return this._post(
      path`/storage_boxes/${id}/actions/change_type`,
      actionResponseSchema,
      params,
      changeStorageBoxTypeRequestSchema,
      options,
    );
  }

  /**
   * Resets the password of a Storage Box.
   *
   * @param id - ID of the Storage Box
   * @param params - The new password
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions-reset-password
   *
   * @example
   * ```typescript
   * const { action } = await client.storageBoxes.resetPassword(42, {
   *   password: "my-new-secret-password",
   * });
   * ```
   */
  resetPassword(
    id: number,
    params: ResetStorageBoxPasswordParams,
    options?: RequestOptions,
  ): Promise<ResetStorageBoxPasswordResponse> {
    return this._post(
      path`/storage_boxes/${id}/actions/reset_password`,
      actionResponseSchema,
      params,
      resetStorageBoxPasswordRequestSchema,
      options,
    );
  }

  /**
   * Updates the access settings of a Storage Box. Omitted settings are left unchanged.
   *
   * @param id - ID of the Storage Box
   * @param params - Access settings to change
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions-update-access-settings
   *
   * @example
   * ```typescript
   * const { action } = await client.storageBoxes.updateAccessSettings(42, {
   *   reachable_externally: true,
   *   ssh_enabled: true,
   * });
   * ```
   */
  updateAccessSettings(
    id: number,
    params: UpdateStorageBoxAccessSettingsParams,
    options?: RequestOptions,
  ): Promise<UpdateStorageBoxAccessSettingsResponse> {
    return this._post(
      path`/storage_boxes/${id}/actions/update_access_settings`,
      actionResponseSchema,
      params,
      updateStorageBoxAccessSettingsRequestSchema,
      options,
    );
  }

  /**
   * Rolls a Storage Box back to one of its snapshots. Data written after the
   * snapshot was taken is lost.
   *
   * @param id - ID of the Storage Box
   * @param params - ID or name of the snapshot to roll back to
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions-rollback-snapshot
   *
   * @example
   * ```typescript
   * const { action } = await client.storageBoxes.rollbackSnapshot(42, { snapshot: 34 });
   * ```
   */
  rollbackSnapshot(
    id: number,
    params: RollbackStorageBoxSnapshotParams,
    options?: RequestOptions,
  ): Promise<RollbackStorageBoxSnapshotResponse> {
    return this._post(
      path`/storage_boxes/${id}/actions/rollback_snapshot`,
      actionResponseSchema,
      params,
      rollbackStorageBoxSnapshotRequestSchema,
      options,
    );
  }

  /**
   * Enables (or replaces) the snapshot plan of a Storage Box.
   *
   * `day_of_week` and `day_of_month` are sent as `null` (every day) when omitted.
   *
   * @param id - ID of the Storage Box
   * @param params - Schedule and number of snapshots to keep
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions-enable-snapshot-plan
   *
   * @example
   * ```typescript
   * // Every day at 03:30, keep the 10 most recent snapshots
   * const { action } = await client.storageBoxes.enableSnapshotPlan(42, {
   *   max_snapshots: 10,
   *   hour: 3,
   *   minute: 30,
   * });
   * ```
   */
  enableSnapshotPlan(
    id: number,
    params: EnableStorageBoxSnapshotPlanParams,
    options?: RequestOptions,
  ): Promise<EnableStorageBoxSnapshotPlanResponse> {
    return this._post(
      path`/storage_boxes/${id}/actions/enable_snapshot_plan`,
      actionResponseSchema,
      {
        ...params,
        day_of_week: params.day_of_week ?? null,
        day_of_month: params.day_of_month ?? null,
      },
      enableStorageBoxSnapshotPlanRequestSchema,
      options,
    );
  }

  /**
   * Disables the snapshot plan of a Storage Box. Existing snapshots are kept.
   *
   * @param id - ID of the Storage Box
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-actions-disable-snapshot-plan
   *
   * @example
   * ```typescript
   * const { action } = await client.storageBoxes.disableSnapshotPlan(42);
   * ```
   */
  disableSnapshotPlan(
    id: number,
    options?: RequestOptions,
  ): Promise<DisableStorageBoxSnapshotPlanResponse> {
    return this._post(
      path`/storage_boxes/${id}/actions/disable_snapshot_plan`,
      actionResponseSchema,
      undefined,
      undefined,
      options,
    );
  }

  // Snapshots
  // --------------------------------------------------------------------------

  /**
   * Returns all snapshots of a Storage Box. The endpoint is not paginated.
   *
   * @param storageBoxId - ID of the Storage Box
   * @param params - Filters and sorting
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-snapshots-list-snapshots
   *
   * @example
   * ```typescript
   * const { snapshots } = await client.storageBoxes.listSnapshots(42, { is_automatic: false });
   * ```
   */
  listSnapshots(
    storageBoxId: number,
    params?: ListStorageBoxSnapshotsParams,
    options?: RequestOptions,
  ): Promise<ListStorageBoxSnapshotsResponse> {
    return this._get(
      path`/storage_boxes/${storageBoxId}/snapshots`,
      listStorageBoxSnapshotsResponseSchema,
      params,
      options,
    );
  }

  /**
   * Returns a specific snapshot of a Storage Box.
   *
   * @param storageBoxId - ID of the Storage Box
   * @param snapshotId - ID of the snapshot
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-snapshots-get-a-snapshot
   *
   * @example
   * ```typescript
   * const { snapshot } = await client.storageBoxes.getSnapshot(42, 34);
   * ```
   */
  getSnapshot(
    storageBoxId: number,
    snapshotId: number,
    options?: RequestOptions,
  ): Promise<GetStorageBoxSnapshotResponse> {
    return this._get(
      path`/storage_boxes/${storageBoxId}/snapshots/${snapshotId}`,
      getStorageBoxSnapshotResponseSchema,
      undefined,
      options,
    );
  }

  /**
   * Finds a snapshot of a Storage Box by its exact name.
   *
   * @param storageBoxId - ID of the Storage Box
   * @param name - Name of the snapshot
   * @param options - Request options
   * @returns The snapshot, or `undefined` if none matches
   *
   * @example
   * ```typescript
   * const snapshot = await client.storageBoxes.getSnapshotByName(42, "before-migration");
   * ```
   */
  async getSnapshotByName(
    storageBoxId: number,
    name: string,
    options?: RequestOptions,
  ): Promise<StorageBoxSnapshot | undefined> {
    const { snapshots } = await this.listSnapshots(storageBoxId, { name }, options);
    return snapshots.find((snapshot) => snapshot.name === name);
  }

  /**
   * Creates a snapshot of a Storage Box.
   *
   * The response only contains a partial snapshot (`id` and `storage_box`).
   * Wait for the action and fetch the snapshot with `getSnapshot()` to get all fields.
   *
   * @param storageBoxId - ID of the Storage Box
   * @param params - Optional description and labels
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-snapshots-create-a-snapshot
   *
   * @example
   * ```typescript
   * const created = await client.storageBoxes.createSnapshot(42, { description: "before migration" });
   * await client.storageBoxes.actions.waitFor(created);
   * const { snapshot } = await client.storageBoxes.getSnapshot(42, created.snapshot.id);
   * ```
   */
  createSnapshot(
    storageBoxId: number,
    params: CreateStorageBoxSnapshotParams = {},
    options?: RequestOptions,
  ): Promise<CreateStorageBoxSnapshotResponse> {
    return this._post(
      path`/storage_boxes/${storageBoxId}/snapshots`,
      createStorageBoxSnapshotResponseSchema,
      params,
      createStorageBoxSnapshotRequestSchema,
      options,
    );
  }

  /**
   * Updates the description and/or labels of a snapshot.
   *
   * @param storageBoxId - ID of the Storage Box
   * @param snapshotId - ID of the snapshot
   * @param params - Fields to update
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-snapshots-update-a-snapshot
   *
   * @example
   * ```typescript
   * const { snapshot } = await client.storageBoxes.updateSnapshot(42, 34, {
   *   description: "keep until 2027",
   * });
   * ```
   */
  updateSnapshot(
    storageBoxId: number,
    snapshotId: number,
    params: UpdateStorageBoxSnapshotParams,
    options?: RequestOptions,
  ): Promise<UpdateStorageBoxSnapshotResponse> {
    return this._put(
      path`/storage_boxes/${storageBoxId}/snapshots/${snapshotId}`,
      updateStorageBoxSnapshotResponseSchema,
      params,
      updateStorageBoxSnapshotRequestSchema,
      options,
    );
  }

  /**
   * Deletes a snapshot. Deletion is asynchronous, the API answers with an action.
   *
   * @param storageBoxId - ID of the Storage Box
   * @param snapshotId - ID of the snapshot
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-snapshots-delete-a-snapshot
   *
   * @example
   * ```typescript
   * const { action } = await client.storageBoxes.deleteSnapshot(42, 34);
   * ```
   */
  deleteSnapshot(
    storageBoxId: number,
    snapshotId: number,
    options?: RequestOptions,
  ): Promise<DeleteStorageBoxSnapshotResponse> {
    return this._delete(
      path`/storage_boxes/${storageBoxId}/snapshots/${snapshotId}`,
      actionResponseSchema,
      options,
    );
  }

  // Subaccounts
  // --------------------------------------------------------------------------

  /**
   * Returns all subaccounts of a Storage Box. The endpoint is not paginated.
   *
   * @param storageBoxId - ID of the Storage Box
   * @param params - Filters and sorting
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccounts-list-subaccounts
   *
   * @example
   * ```typescript
   * const { subaccounts } = await client.storageBoxes.listSubaccounts(42, {
   *   label_selector: "team=backup",
   * });
   * ```
   */
  listSubaccounts(
    storageBoxId: number,
    params?: ListStorageBoxSubaccountsParams,
    options?: RequestOptions,
  ): Promise<ListStorageBoxSubaccountsResponse> {
    return this._get(
      path`/storage_boxes/${storageBoxId}/subaccounts`,
      listStorageBoxSubaccountsResponseSchema,
      params,
      options,
    );
  }

  /**
   * Returns a specific subaccount of a Storage Box.
   *
   * @param storageBoxId - ID of the Storage Box
   * @param subaccountId - ID of the subaccount
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccounts-get-a-subaccount
   *
   * @example
   * ```typescript
   * const { subaccount } = await client.storageBoxes.getSubaccount(42, 45);
   * ```
   */
  getSubaccount(
    storageBoxId: number,
    subaccountId: number,
    options?: RequestOptions,
  ): Promise<GetStorageBoxSubaccountResponse> {
    return this._get(
      path`/storage_boxes/${storageBoxId}/subaccounts/${subaccountId}`,
      getStorageBoxSubaccountResponseSchema,
      undefined,
      options,
    );
  }

  /**
   * Finds a subaccount of a Storage Box by its exact name.
   *
   * @param storageBoxId - ID of the Storage Box
   * @param name - Name of the subaccount
   * @param options - Request options
   * @returns The subaccount, or `undefined` if none matches
   *
   * @example
   * ```typescript
   * const subaccount = await client.storageBoxes.getSubaccountByName(42, "ci-uploads");
   * ```
   */
  async getSubaccountByName(
    storageBoxId: number,
    name: string,
    options?: RequestOptions,
  ): Promise<StorageBoxSubaccount | undefined> {
    const { subaccounts } = await this.listSubaccounts(storageBoxId, { name }, options);
    return subaccounts.find((subaccount) => subaccount.name === name);
  }

  /**
   * Finds a subaccount of a Storage Box by its username.
   *
   * @param storageBoxId - ID of the Storage Box
   * @param username - Username of the subaccount, e.g. `u42-sub1`
   * @param options - Request options
   * @returns The subaccount, or `undefined` if none matches
   *
   * @example
   * ```typescript
   * const subaccount = await client.storageBoxes.getSubaccountByUsername(42, "u42-sub1");
   * ```
   */
  async getSubaccountByUsername(
    storageBoxId: number,
    username: string,
    options?: RequestOptions,
  ): Promise<StorageBoxSubaccount | undefined> {
    const { subaccounts } = await this.listSubaccounts(storageBoxId, { username }, options);
    return subaccounts.find((subaccount) => subaccount.username === username);
  }

  /**
   * Creates a subaccount of a Storage Box.
   *
   * The response only contains a partial subaccount (`id` and `storage_box`).
   * Wait for the action and fetch the subaccount with `getSubaccount()` to get all fields.
   *
   * @param storageBoxId - ID of the Storage Box
   * @param params - Home directory, password and optional settings
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccounts-create-a-subaccount
   *
   * @example
   * ```typescript
   * const created = await client.storageBoxes.createSubaccount(42, {
   *   name: "ci-uploads",
   *   home_directory: "ci/",
   *   password: "my-secret-password",
   *   access_settings: { ssh_enabled: true, readonly: false },
   * });
   * await client.storageBoxes.actions.waitFor(created);
   * ```
   */
  createSubaccount(
    storageBoxId: number,
    params: CreateStorageBoxSubaccountParams,
    options?: RequestOptions,
  ): Promise<CreateStorageBoxSubaccountResponse> {
    return this._post(
      path`/storage_boxes/${storageBoxId}/subaccounts`,
      createStorageBoxSubaccountResponseSchema,
      params,
      createStorageBoxSubaccountRequestSchema,
      options,
    );
  }

  /**
   * Updates the name, description and/or labels of a subaccount.
   *
   * @param storageBoxId - ID of the Storage Box
   * @param subaccountId - ID of the subaccount
   * @param params - Fields to update
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccounts-update-a-subaccount
   *
   * @example
   * ```typescript
   * const { subaccount } = await client.storageBoxes.updateSubaccount(42, 45, {
   *   description: "Used by the CI pipeline",
   * });
   * ```
   */
  updateSubaccount(
    storageBoxId: number,
    subaccountId: number,
    params: UpdateStorageBoxSubaccountParams,
    options?: RequestOptions,
  ): Promise<UpdateStorageBoxSubaccountResponse> {
    return this._put(
      path`/storage_boxes/${storageBoxId}/subaccounts/${subaccountId}`,
      updateStorageBoxSubaccountResponseSchema,
      params,
      updateStorageBoxSubaccountRequestSchema,
      options,
    );
  }

  /**
   * Deletes a subaccount. Deletion is asynchronous, the API answers with an action.
   *
   * @param storageBoxId - ID of the Storage Box
   * @param subaccountId - ID of the subaccount
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccounts-delete-a-subaccount
   *
   * @example
   * ```typescript
   * const { action } = await client.storageBoxes.deleteSubaccount(42, 45);
   * ```
   */
  deleteSubaccount(
    storageBoxId: number,
    subaccountId: number,
    options?: RequestOptions,
  ): Promise<DeleteStorageBoxSubaccountResponse> {
    return this._delete(
      path`/storage_boxes/${storageBoxId}/subaccounts/${subaccountId}`,
      actionResponseSchema,
      options,
    );
  }

  /**
   * Changes the home directory of a subaccount.
   *
   * @param storageBoxId - ID of the Storage Box
   * @param subaccountId - ID of the subaccount
   * @param params - The new home directory, relative to the root of the Storage Box
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccount-actions-change-home-directory
   *
   * @example
   * ```typescript
   * const { action } = await client.storageBoxes.changeSubaccountHomeDirectory(42, 45, {
   *   home_directory: "backups/ci/",
   * });
   * ```
   */
  changeSubaccountHomeDirectory(
    storageBoxId: number,
    subaccountId: number,
    params: ChangeStorageBoxSubaccountHomeDirectoryParams,
    options?: RequestOptions,
  ): Promise<ChangeStorageBoxSubaccountHomeDirectoryResponse> {
    return this._post(
      path`/storage_boxes/${storageBoxId}/subaccounts/${subaccountId}/actions/change_home_directory`,
      actionResponseSchema,
      params,
      changeStorageBoxSubaccountHomeDirectoryRequestSchema,
      options,
    );
  }

  /**
   * Resets the password of a subaccount.
   *
   * @param storageBoxId - ID of the Storage Box
   * @param subaccountId - ID of the subaccount
   * @param params - The new password
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccount-actions-reset-password
   *
   * @example
   * ```typescript
   * const { action } = await client.storageBoxes.resetSubaccountPassword(42, 45, {
   *   password: "my-new-secret-password",
   * });
   * ```
   */
  resetSubaccountPassword(
    storageBoxId: number,
    subaccountId: number,
    params: ResetStorageBoxSubaccountPasswordParams,
    options?: RequestOptions,
  ): Promise<ResetStorageBoxSubaccountPasswordResponse> {
    return this._post(
      path`/storage_boxes/${storageBoxId}/subaccounts/${subaccountId}/actions/reset_subaccount_password`,
      actionResponseSchema,
      params,
      resetStorageBoxSubaccountPasswordRequestSchema,
      options,
    );
  }

  /**
   * Updates the access settings of a subaccount. Omitted settings are left unchanged.
   *
   * @param storageBoxId - ID of the Storage Box
   * @param subaccountId - ID of the subaccount
   * @param params - Access settings to change
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-subaccount-actions-update-access-settings
   *
   * @example
   * ```typescript
   * const { action } = await client.storageBoxes.updateSubaccountAccessSettings(42, 45, {
   *   readonly: true,
   * });
   * ```
   */
  updateSubaccountAccessSettings(
    storageBoxId: number,
    subaccountId: number,
    params: UpdateStorageBoxSubaccountAccessSettingsParams,
    options?: RequestOptions,
  ): Promise<UpdateStorageBoxSubaccountAccessSettingsResponse> {
    return this._post(
      path`/storage_boxes/${storageBoxId}/subaccounts/${subaccountId}/actions/update_access_settings`,
      actionResponseSchema,
      params,
      updateStorageBoxSubaccountAccessSettingsRequestSchema,
      options,
    );
  }
}
