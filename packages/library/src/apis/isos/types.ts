/**
 * Types for Hetzner Cloud ISOs API
 * @see https://docs.hetzner.cloud/reference/cloud#isos
 */

import type { z } from "zod";
import type { OneOrMany, PageParams } from "../common/types";
import type { CpuArchitecture } from "../server-types/types";
import type {
  getISOResponseSchema,
  isoSchema,
  isoTypeSchema,
  listISOsResponseSchema,
} from "./schemas";

/**
 * ISO type
 */
export type ISOType = z.infer<typeof isoTypeSchema>;

/**
 * Hetzner Cloud ISO
 * @see https://docs.hetzner.cloud/reference/cloud#isos
 */
export type ISO = z.infer<typeof isoSchema>;

/**
 * List ISOs query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#isos-list-isos
 */
export interface ListISOsParams extends PageParams {
  /**
   * Only return the ISO with this exact name.
   */
  name?: string;
  /**
   * Only return ISOs compatible with the given architectures.
   */
  architecture?: OneOrMany<CpuArchitecture>;
  /**
   * Custom (private) ISOs have no architecture set. Set this to `true` to
   * include them when filtering by `architecture`.
   */
  include_architecture_wildcard?: boolean;
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
