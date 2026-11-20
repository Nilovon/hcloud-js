/**
 * Hetzner Cloud Images API
 * @see https://docs.hetzner.cloud/reference/cloud#images
 */

import { ResourceActionsClient } from "../actions/index";
import {
  actionResponseSchema,
  getActionResponseSchema,
  listActionsResponseSchema,
} from "../actions/schemas";
import type { GetActionResponse, ListActionsParams, ListActionsResponse } from "../actions/types";
import { NamedResource, path } from "../../core/resource";
import type { RequestOptions } from "../../core/types";
import type { CpuArchitecture } from "../server-types/types";
import {
  changeImageProtectionRequestSchema,
  getImageResponseSchema,
  listImagesResponseSchema,
  updateImageRequestSchema,
  updateImageResponseSchema,
} from "./schemas";
import type {
  ChangeImageProtectionParams,
  ChangeImageProtectionResponse,
  GetImageByNameAndArchitectureParams,
  GetImageResponse,
  Image,
  ListImagesParams,
  ListImagesResponse,
  UpdateImageParams,
  UpdateImageResponse,
} from "./types";

/**
 * Images API client
 *
 * Images are blueprints for the disks of servers: system images provided by
 * Hetzner, apps, and the snapshots and backups of your own servers.
 *
 * In addition to the methods below, the pagination helpers `iterate()`,
 * `iteratePages()`, `listAll()` and `first()` as well as `getByName()` are
 * available. System images have the same name for every architecture, so
 * prefer {@link ImagesClient.getByNameAndArchitecture} over `getByName()`.
 *
 * @see https://docs.hetzner.cloud/reference/cloud#images
 */
export class ImagesClient extends NamedResource<Image, ListImagesParams, "images"> {
  protected readonly itemsKey = "images";

  /**
   * Actions of all images: `GET /images/actions` and `GET /images/actions/{id}`.
   */
  public readonly actions = new ResourceActionsClient(this.client, "/images");

  /**
   * Returns a page of images.
   *
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#images-list-images
   *
   * @example
   * ```typescript
   * const { images } = await client.images.list({
   *   type: "snapshot",
   *   label_selector: "environment=production",
   *   sort: "created:desc",
   * });
   *
   * // All images across all pages
   * const all = await client.images.listAll({ type: ["snapshot", "backup"] });
   * ```
   */
  list(params?: ListImagesParams, options?: RequestOptions): Promise<ListImagesResponse> {
    return this._get("/images", listImagesResponseSchema, params, options);
  }

  /**
   * Returns a specific image.
   *
   * @param id - ID of the image
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#images-get-an-image
   *
   * @example
   * ```typescript
   * const { image } = await client.images.get(45557056);
   * console.log(image.name, image.architecture);
   * ```
   */
  get(id: number, options?: RequestOptions): Promise<GetImageResponse> {
    return this._get(path`/images/${id}`, getImageResponseSchema, undefined, options);
  }

  /**
   * Finds an image by its name and architecture.
   *
   * @param name - Name of the image, e.g. `ubuntu-24.04`
   * @param architecture - CPU architecture of the image
   * @param params - Additional filters, e.g. `include_deprecated`
   * @param options - Request options
   * @returns The image, or `undefined` if none matches
   *
   * @example
   * ```typescript
   * const image = await client.images.getByNameAndArchitecture("ubuntu-24.04", "arm");
   * ```
   */
  async getByNameAndArchitecture(
    name: string,
    architecture: CpuArchitecture,
    params?: GetImageByNameAndArchitectureParams,
    options?: RequestOptions,
  ): Promise<Image | undefined> {
    const { images } = await this.list(
      { name, architecture: [architecture], include_deprecated: params?.include_deprecated },
      options,
    );
    return images.find((image) => image.name === name && image.architecture === architecture);
  }

  /**
   * Updates the description and/or labels of an image, or converts a backup
   * into a snapshot. Only available for images of type `snapshot` and `backup`.
   *
   * @param id - ID of the image
   * @param params - Fields to update
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#images-update-an-image
   *
   * @example
   * ```typescript
   * const { image } = await client.images.update(429564329, {
   *   description: "Before the upgrade",
   *   labels: { environment: "production" },
   * });
   * ```
   */
  update(
    id: number,
    params: UpdateImageParams,
    options?: RequestOptions,
  ): Promise<UpdateImageResponse> {
    return this._put(
      path`/images/${id}`,
      updateImageResponseSchema,
      params,
      updateImageRequestSchema,
      options,
    );
  }

  /**
   * Deletes an image. Only available for images of type `snapshot` and `backup`.
   *
   * @param id - ID of the image
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#images-delete-an-image
   *
   * @example
   * ```typescript
   * await client.images.delete(429564329);
   * ```
   */
  delete(id: number, options?: RequestOptions): Promise<void> {
    return this._delete(path`/images/${id}`, null, options);
  }

  /**
   * Returns a page of actions of an image.
   *
   * @param id - ID of the image
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#images-list-actions-for-an-image
   *
   * @example
   * ```typescript
   * const { actions } = await client.images.listActions(429564329, { status: "running" });
   * ```
   */
  listActions(
    id: number,
    params?: ListActionsParams,
    options?: RequestOptions,
  ): Promise<ListActionsResponse> {
    return this._get(path`/images/${id}/actions`, listActionsResponseSchema, params, options);
  }

  /**
   * Returns a specific action of an image.
   *
   * @param id - ID of the image
   * @param actionId - ID of the action
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#images-get-an-action-for-an-image
   *
   * @example
   * ```typescript
   * const { action } = await client.images.getAction(429564329, 13);
   * console.log(action.status);
   * ```
   */
  getAction(id: number, actionId: number, options?: RequestOptions): Promise<GetActionResponse> {
    return this._get(
      path`/images/${id}/actions/${actionId}`,
      getActionResponseSchema,
      undefined,
      options,
    );
  }

  /**
   * Changes the protection configuration of an image. Only available for snapshots.
   *
   * @param id - ID of the image
   * @param params - Protection settings
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#images-change-image-protection
   *
   * @example
   * ```typescript
   * const { action } = await client.images.changeProtection(429564329, { delete: true });
   * await client.actions.waitFor(action);
   * ```
   */
  changeProtection(
    id: number,
    params: ChangeImageProtectionParams,
    options?: RequestOptions,
  ): Promise<ChangeImageProtectionResponse> {
    return this._post(
      path`/images/${id}/actions/change_protection`,
      actionResponseSchema,
      params,
      changeImageProtectionRequestSchema,
      options,
    );
  }
}
