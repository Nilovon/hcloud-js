/**
 * Hetzner Cloud Volumes API
 * @see https://docs.hetzner.cloud/reference/cloud#volumes
 */

import { NamedResource, path } from "../../core/resource";
import type { RequestOptions } from "../../core/types";
import { ResourceActionsClient } from "../actions/index";
import {
  actionResponseSchema,
  getActionResponseSchema,
  listActionsResponseSchema,
} from "../actions/schemas";
import {
  attachVolumeToServerRequestSchema,
  changeVolumeProtectionRequestSchema,
  createVolumeRequestSchema,
  createVolumeResponseSchema,
  getVolumeResponseSchema,
  listVolumesResponseSchema,
  resizeVolumeRequestSchema,
  updateVolumeRequestSchema,
  updateVolumeResponseSchema,
} from "./schemas";
import type {
  AttachVolumeToServerParams,
  AttachVolumeToServerResponse,
  ChangeVolumeProtectionParams,
  ChangeVolumeProtectionResponse,
  CreateVolumeParams,
  CreateVolumeResponse,
  DetachVolumeResponse,
  GetVolumeActionResponse,
  GetVolumeResponse,
  ListVolumeActionsParams,
  ListVolumeActionsResponse,
  ListVolumesParams,
  ListVolumesResponse,
  ResizeVolumeParams,
  ResizeVolumeResponse,
  UpdateVolumeParams,
  UpdateVolumeResponse,
  Volume,
} from "./types";

/**
 * Volumes API client
 *
 * Volumes are block storage devices that can be attached to a server in the
 * same location.
 *
 * In addition to the methods below, the pagination helpers `iterate()`,
 * `iteratePages()`, `listAll()` and `first()` as well as `getByName()` are
 * available.
 *
 * @see https://docs.hetzner.cloud/reference/cloud#volumes
 */
export class VolumesClient extends NamedResource<Volume, ListVolumesParams, "volumes"> {
  protected readonly itemsKey = "volumes";

  /**
   * Actions of all volumes (`GET /volumes/actions`), including `waitFor()` and
   * `waitForAll()`.
   *
   * @example
   * ```typescript
   * const { actions } = await client.volumes.actions.list({ status: "running" });
   * ```
   */
  public readonly actions = new ResourceActionsClient(this.client, "/volumes");

  /**
   * Returns a page of volumes.
   *
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-list-volumes
   *
   * @example
   * ```typescript
   * const { volumes } = await client.volumes.list({
   *   status: "available",
   *   label_selector: "environment=production",
   *   sort: "name:asc",
   * });
   *
   * // All volumes across all pages
   * const all = await client.volumes.listAll();
   * ```
   */
  list(params?: ListVolumesParams, options?: RequestOptions): Promise<ListVolumesResponse> {
    return this._get("/volumes", listVolumesResponseSchema, params, options);
  }

  /**
   * Returns a specific volume.
   *
   * @param id - ID of the volume
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-get-a-volume
   *
   * @example
   * ```typescript
   * const { volume } = await client.volumes.get(12345);
   * console.log(volume.size, volume.linux_device);
   * ```
   */
  get(id: number, options?: RequestOptions): Promise<GetVolumeResponse> {
    return this._get(path`/volumes/${id}`, getVolumeResponseSchema, undefined, options);
  }

  /**
   * Creates a new volume, either in a location or attached to a server.
   *
   * Exactly one of `location` and `server` must be given. If a server is
   * given, attaching the volume is tracked by `next_actions`.
   *
   * @param params - Name, size and either `location` or `server`
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-create-a-volume
   *
   * @example
   * ```typescript
   * const created = await client.volumes.create({
   *   name: "database-storage",
   *   size: 50,
   *   server: 42,
   *   format: "ext4",
   *   automount: true,
   * });
   * await client.actions.waitForAll(created); // waits for `action` and `next_actions`
   * ```
   */
  create(params: CreateVolumeParams, options?: RequestOptions): Promise<CreateVolumeResponse> {
    return this._post(
      "/volumes",
      createVolumeResponseSchema,
      params,
      createVolumeRequestSchema,
      options,
    );
  }

  /**
   * Updates the name and/or labels of a volume.
   *
   * @param id - ID of the volume
   * @param params - Fields to update
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-update-a-volume
   *
   * @example
   * ```typescript
   * const { volume } = await client.volumes.update(12345, {
   *   name: "new-name",
   *   labels: { environment: "production" },
   * });
   * ```
   */
  update(
    id: number,
    params: UpdateVolumeParams,
    options?: RequestOptions,
  ): Promise<UpdateVolumeResponse> {
    return this._put(
      path`/volumes/${id}`,
      updateVolumeResponseSchema,
      params,
      updateVolumeRequestSchema,
      options,
    );
  }

  /**
   * Deletes a volume. All data on it is irreversibly destroyed. The volume must
   * not be attached to a server and must not have delete protection enabled.
   *
   * @param id - ID of the volume
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-delete-a-volume
   *
   * @example
   * ```typescript
   * await client.volumes.delete(12345);
   * ```
   */
  delete(id: number, options?: RequestOptions): Promise<void> {
    return this._delete(path`/volumes/${id}`, null, options);
  }

  /**
   * Returns a page of actions of a volume.
   *
   * @param id - ID of the volume
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-list-actions-for-a-volume
   *
   * @example
   * ```typescript
   * const { actions } = await client.volumes.listActions(12345, {
   *   status: "running",
   *   sort: "started:desc",
   * });
   * ```
   */
  listActions(
    id: number,
    params?: ListVolumeActionsParams,
    options?: RequestOptions,
  ): Promise<ListVolumeActionsResponse> {
    return this._get(path`/volumes/${id}/actions`, listActionsResponseSchema, params, options);
  }

  /**
   * Returns a specific action of a volume.
   *
   * @param id - ID of the volume
   * @param actionId - ID of the action
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-get-an-action-for-a-volume
   *
   * @example
   * ```typescript
   * const { action } = await client.volumes.getAction(12345, 67890);
   * console.log(action.status);
   * ```
   */
  getAction(
    id: number,
    actionId: number,
    options?: RequestOptions,
  ): Promise<GetVolumeActionResponse> {
    return this._get(
      path`/volumes/${id}/actions/${actionId}`,
      getActionResponseSchema,
      undefined,
      options,
    );
  }

  /**
   * Attaches a volume to a server. The server must be in the same location as
   * the volume.
   *
   * @param id - ID of the volume
   * @param params - Server to attach the volume to
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-attach-volume-to-a-server
   *
   * @example
   * ```typescript
   * const { action } = await client.volumes.attachToServer(12345, {
   *   server: 42,
   *   automount: true,
   * });
   * await client.actions.waitFor(action);
   * ```
   */
  attachToServer(
    id: number,
    params: AttachVolumeToServerParams,
    options?: RequestOptions,
  ): Promise<AttachVolumeToServerResponse> {
    return this._post(
      path`/volumes/${id}/actions/attach`,
      actionResponseSchema,
      params,
      attachVolumeToServerRequestSchema,
      options,
    );
  }

  /**
   * Detaches a volume from the server it is attached to. It can be attached to
   * a server again later.
   *
   * @param id - ID of the volume
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-detach-volume
   *
   * @example
   * ```typescript
   * const { action } = await client.volumes.detach(12345);
   * await client.actions.waitFor(action);
   * ```
   */
  detach(id: number, options?: RequestOptions): Promise<DetachVolumeResponse> {
    return this._post(
      path`/volumes/${id}/actions/detach`,
      actionResponseSchema,
      undefined,
      undefined,
      options,
    );
  }

  /**
   * Changes the size of a volume. Downsizing a volume is not possible.
   *
   * @param id - ID of the volume
   * @param params - New size in GB
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-resize-volume
   *
   * @example
   * ```typescript
   * const { action } = await client.volumes.resize(12345, { size: 100 });
   * await client.actions.waitFor(action);
   * ```
   */
  resize(
    id: number,
    params: ResizeVolumeParams,
    options?: RequestOptions,
  ): Promise<ResizeVolumeResponse> {
    return this._post(
      path`/volumes/${id}/actions/resize`,
      actionResponseSchema,
      params,
      resizeVolumeRequestSchema,
      options,
    );
  }

  /**
   * Changes the protection configuration of a volume.
   *
   * @param id - ID of the volume
   * @param params - Protection configuration
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-change-volume-protection
   *
   * @example
   * ```typescript
   * const { action } = await client.volumes.changeProtection(12345, { delete: true });
   * ```
   */
  changeProtection(
    id: number,
    params: ChangeVolumeProtectionParams,
    options?: RequestOptions,
  ): Promise<ChangeVolumeProtectionResponse> {
    return this._post(
      path`/volumes/${id}/actions/change_protection`,
      actionResponseSchema,
      params,
      changeVolumeProtectionRequestSchema,
      options,
    );
  }
}
