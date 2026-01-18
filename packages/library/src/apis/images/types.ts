/**
 * Types for Hetzner Cloud Images API
 * Types are inferred from Zod schemas
 * @see https://docs.hetzner.cloud/reference/cloud#images-list-images
 */

// biome-ignore assist/source/organizeImports: we need to import the schemas first
import {
  imageStatusSchema,
  imageTypeSchema,
  listImagesResponseSchema,
  updateImageRequestSchema,
  getImageResponseSchema,
  updateImageResponseSchema,
  deleteImageResponseSchema,
} from "./schemas";
import { imageSchema } from "./schemas";
import type { z } from "zod";

/**
 * Image status values
 */
export type ImageStatus = z.infer<typeof imageStatusSchema>;

/**
 * Image type values
 */
export type ImageType = z.infer<typeof imageTypeSchema>;

/**
 * Hetzner Cloud Image
 * @see https://docs.hetzner.cloud/reference/cloud#images-list-images
 */
export type Image = z.infer<typeof imageSchema>;

/**
 * Pagination metadata
 * @see https://docs.hetzner.cloud/reference/cloud#pagination
 * Re-exported from servers module for consistency
 */
export type { PaginationMeta } from "../servers/types";

/**
 * List Images query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#images-list-images
 */
export interface ListImagesParams {
  /**
   * Can be used multiple times. The response will only contain Images matching the type.
   * Choices: system, app, snapshot, backup
   */
  type?: ImageType | ImageType[];
  /**
   * Can be used multiple times. The response will only contain Images matching the status.
   * Choices: available, creating, unavailable
   */
  status?: ImageStatus | ImageStatus[];
  /**
   * Can be used to filter Images by their name. The response will only contain the Image matching the specified name.
   */
  name?: string;
  /**
   * Can be used to filter Images by labels. The response will only contain Images matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, name, name:asc, name:desc, created, created:asc, created:desc, type, type:asc, type:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
  /**
   * Can be used multiple times, the response will only contain Images matching the specified architecture.
   * Choices: x86, arm
   */
  architecture?: "x86" | "arm" | ("x86" | "arm")[];
  /**
   * Can be used to filter Images by their bound server. The response will only contain the Image matching the specified server ID.
   */
  bound_to?: number;
  /**
   * Can be used to filter Images by their include_deprecated status.
   * If set to true, deprecated Images are included in the response. If set to false, deprecated Images are excluded from the response.
   */
  include_deprecated?: boolean;
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
 * List Images response
 * @see https://docs.hetzner.cloud/reference/cloud#images-list-images
 */
export type ListImagesResponse = z.infer<typeof listImagesResponseSchema>;

/**
 * Update Image request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#images-update-an-image
 */
export type UpdateImageParams = z.infer<typeof updateImageRequestSchema>;

/**
 * Get Image response
 * @see https://docs.hetzner.cloud/reference/cloud#images-get-an-image
 */
export type GetImageResponse = z.infer<typeof getImageResponseSchema>;

/**
 * Update Image response
 * @see https://docs.hetzner.cloud/reference/cloud#images-update-an-image
 */
export type UpdateImageResponse = z.infer<typeof updateImageResponseSchema>;

/**
 * Delete Image response
 * @see https://docs.hetzner.cloud/reference/cloud#images-delete-an-image
 */
export type DeleteImageResponse = z.infer<typeof deleteImageResponseSchema>;
