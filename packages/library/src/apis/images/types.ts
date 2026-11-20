/**
 * Types for Hetzner Cloud Images API
 * @see https://docs.hetzner.cloud/reference/cloud#images
 */

import type { z } from "zod";
import type { ActionResponse } from "../actions/types";
import type { OneOrMany, PageParams, SortParam } from "../common/types";
import type { CpuArchitecture } from "../server-types/types";
import type {
  changeImageProtectionRequestSchema,
  getImageResponseSchema,
  imageCreatedFromSchema,
  imageProtectionSchema,
  imageSchema,
  imageStatusSchema,
  imageTypeSchema,
  listImagesResponseSchema,
  updateImageRequestSchema,
  updateImageResponseSchema,
} from "./schemas";

/**
 * Image status values
 */
export type ImageStatus = z.infer<typeof imageStatusSchema>;

/**
 * Image type values
 */
export type ImageType = z.infer<typeof imageTypeSchema>;

/**
 * Server an image was created from
 */
export type ImageCreatedFrom = z.infer<typeof imageCreatedFromSchema>;

/**
 * Image protection configuration
 */
export type ImageProtection = z.infer<typeof imageProtectionSchema>;

/**
 * Hetzner Cloud Image
 * @see https://docs.hetzner.cloud/reference/cloud#images
 */
export type Image = z.infer<typeof imageSchema>;

/**
 * Fields images can be sorted by
 */
export type ImageSort = SortParam<"id" | "name" | "created">;

/**
 * List Images query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#images-list-images
 */
export interface ListImagesParams extends PageParams {
  /**
   * Only return images of the given types.
   */
  type?: OneOrMany<ImageType>;
  /**
   * Only return images with the given status.
   */
  status?: OneOrMany<ImageStatus>;
  /**
   * Only return images with this exact name. System images share their name
   * across architectures, so combine it with `architecture`.
   */
  name?: string;
  /**
   * Only return images matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
  /**
   * Only return images compatible with the given architectures.
   */
  architecture?: OneOrMany<CpuArchitecture>;
  /**
   * Only return images bound to the servers with the given IDs. Only
   * available for images of type `backup`.
   */
  bound_to?: OneOrMany<number | string>;
  /**
   * Include deprecated images in the response. Default: `false`.
   */
  include_deprecated?: boolean;
  /**
   * Sort the result.
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: OneOrMany<ImageSort>;
}

/**
 * List Images response
 * @see https://docs.hetzner.cloud/reference/cloud#images-list-images
 */
export type ListImagesResponse = z.infer<typeof listImagesResponseSchema>;

/**
 * Get Image response
 * @see https://docs.hetzner.cloud/reference/cloud#images-get-an-image
 */
export type GetImageResponse = z.infer<typeof getImageResponseSchema>;

/**
 * Additional filters for `client.images.getByNameAndArchitecture()`
 */
export interface GetImageByNameAndArchitectureParams {
  /**
   * Also find deprecated images. Default: `false`.
   */
  include_deprecated?: boolean;
}

/**
 * Update Image request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#images-update-an-image
 */
export type UpdateImageParams = z.input<typeof updateImageRequestSchema>;

/**
 * Update Image response
 * @see https://docs.hetzner.cloud/reference/cloud#images-update-an-image
 */
export type UpdateImageResponse = z.infer<typeof updateImageResponseSchema>;

/**
 * Change Image Protection request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#images-change-image-protection
 */
export type ChangeImageProtectionParams = z.input<typeof changeImageProtectionRequestSchema>;

/**
 * Change Image Protection response
 * @see https://docs.hetzner.cloud/reference/cloud#images-change-image-protection
 */
export type ChangeImageProtectionResponse = ActionResponse;
