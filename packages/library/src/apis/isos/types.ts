/**
 * Types for Hetzner Cloud ISOs API
 * Types are inferred from Zod schemas
 * @see https://docs.hetzner.cloud/reference/cloud#isos
 */

// biome-ignore assist/source/organizeImports: we need to import the schemas first
import {
  listISOsResponseSchema,
  getISOResponseSchema,
  isoSchema,
  isoTypeSchema,
} from "@/apis/isos/schemas";
import type { z } from "zod";

/**
 * ISO type
 */
export type ISOType = z.infer<typeof isoTypeSchema>;

/**
 * Hetzner Cloud ISO
 */
export type ISO = z.infer<typeof isoSchema>;

/**
 * List ISOs query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#isos-list-isos
 */
export interface ListISOsParams {
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, name, name:asc, name:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
  /**
   * Can be used to filter ISOs by their name. The response will only contain the ISO matching the specified name.
   */
  name?: string;
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
 * List ISOs response
 * @see https://docs.hetzner.cloud/reference/cloud#isos-list-isos
 */
export type ListISOsResponse = z.infer<typeof listISOsResponseSchema>;

/**
 * Get ISO response
 * @see https://docs.hetzner.cloud/reference/cloud#isos-get-an-iso
 */
export type GetISOResponse = z.infer<typeof getISOResponseSchema>;
