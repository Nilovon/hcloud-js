/**
 * Hetzner Cloud Images API
 * @see https://docs.hetzner.cloud/reference/cloud#images
 */

import type { HCloudClient } from "../../client/index";
import { validate } from "../../validation/index";
import { deleteImageResponseSchema, getImageResponseSchema, listImagesResponseSchema, updateImageRequestSchema, updateImageResponseSchema } from "../../apis/images/schemas";
import type {
  ListImagesParams,
  ListImagesResponse,
  GetImageResponse,
  UpdateImageParams,
  UpdateImageResponse,
  DeleteImageResponse,
} from "./types";

/**
 * Images API client
 */
export class ImagesClient {
  constructor(private readonly client: HCloudClient) {}

  /**
   * Returns all Image objects.
   *
   * You can select specific Image types only and sort the results by using URI parameters.
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of images with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#images-list-images
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all images
   * const result = await client.images.list();
   *
   * // List images with filters
   * const snapshots = await client.images.list({
   *   type: ['snapshot'],
   *   status: ['available'],
   *   label_selector: 'environment=production',
   *   sort: ['created:desc'],
   *   page: 1,
   *   per_page: 50
   * });
   * ```
   */
  async list(params?: ListImagesParams): Promise<ListImagesResponse> {
    // Build query parameters
    const queryParams: Record<string, string | number | boolean | string[] | undefined> = {};

    if (params?.type) {
      // Convert single type to array for consistent handling
      queryParams.type = Array.isArray(params.type) ? params.type : [params.type];
    }

    if (params?.status) {
      // Convert single status to array for consistent handling
      queryParams.status = Array.isArray(params.status) ? params.status : [params.status];
    }

    if (params?.name) {
      queryParams.name = params.name;
    }

    if (params?.label_selector) {
      queryParams.label_selector = params.label_selector;
    }

    if (params?.sort) {
      // Convert single string to array for consistent handling
      queryParams.sort = Array.isArray(params.sort) ? params.sort : [params.sort];
    }

    if (params?.architecture) {
      // Convert single architecture to array for consistent handling
      queryParams.architecture = Array.isArray(params.architecture)
        ? params.architecture
        : [params.architecture];
    }

    if (params?.bound_to !== undefined) {
      queryParams.bound_to = params.bound_to;
    }

    if (params?.include_deprecated !== undefined) {
      queryParams.include_deprecated = params.include_deprecated;
    }

    if (params?.page !== undefined) {
      queryParams.page = params.page;
    }

    if (params?.per_page !== undefined) {
      queryParams.per_page = params.per_page;
    }

    const response = await this.client.get<unknown>("/images", queryParams);

    // Validate response with Zod
    return validate(listImagesResponseSchema, response, { context: "List images response" });
  }

  /**
   * Returns a specific Image object.
   *
   * @param id - ID of the Image
   * @returns Promise resolving to the image
   * @see https://docs.hetzner.cloud/reference/cloud#images-get-an-image
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get an image by ID
   * const image = await client.images.get(12345);
   * console.log(image.image.name);
   * ```
   */
  async get(id: number): Promise<GetImageResponse> {
    const response = await this.client.get<unknown>(`/images/${id}`);

    // Validate response with Zod
    return validate(getImageResponseSchema, response, { context: "Get image response" });
  }

  /**
   * Updates the Image. You may change the description or convert a Snapshot to a backup Image.
   *
   * Only callable on `snapshot` and `backup` image types.
   *
   * @param id - ID of the Image
   * @param params - Parameters to update (description, type, and/or labels)
   * @returns Promise resolving to the updated image
   * @see https://docs.hetzner.cloud/reference/cloud#images-update-an-image
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Update image description
   * const updated = await client.images.update(12345, {
   *   description: 'Updated description'
   * });
   *
   * // Update labels
   * const updated = await client.images.update(12345, {
   *   labels: { environment: 'production', team: 'backend' }
   * });
   *
   * // Convert snapshot to backup
   * const updated = await client.images.update(12345, {
   *   type: 'snapshot'
   * });
   * ```
   */
  async update(id: number, params: UpdateImageParams): Promise<UpdateImageResponse> {
    // Validate request parameters
    const validatedParams = validate(updateImageRequestSchema, params, { context: "Update image request" });

    // Make API request
    const response = await this.client.put<unknown>(`/images/${id}`, validatedParams);

    // Validate response with Zod
    return validate(updateImageResponseSchema, response, { context: "Update image response" });
  }

  /**
   * Deletes an Image.
   *
   * Only available for `snapshot` and `backup` image types.
   *
   * @param id - ID of the Image
   * @returns Promise resolving to the delete action
   * @see https://docs.hetzner.cloud/reference/cloud#images-delete-an-image
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Delete an image
   * const result = await client.images.delete(12345);
   * console.log(`Delete action ID: ${result.action.id}`);
   * ```
   */
  async delete(id: number): Promise<DeleteImageResponse> {
    const response = await this.client.delete<unknown>(`/images/${id}`);

    // Validate response with Zod
    return validate(deleteImageResponseSchema, response, { context: "Delete image response" });
  }
}
