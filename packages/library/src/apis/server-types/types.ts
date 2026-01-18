/**
 * Types for Hetzner Cloud Server Types API
 * Types are inferred from Zod schemas
 * @see https://docs.hetzner.cloud/reference/cloud#server-types
 */

// biome-ignore assist/source/organizeImports: we need to import the schemas first
import {
  listServerTypesResponseSchema,
  getServerTypeResponseSchema,
} from "../../apis/server-types/schemas";
import type { z } from "zod";

/**
 * List Server Types query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#server-types-list-server-types
 */
export interface ListServerTypesParams {
  /**
   * Can be used to filter Server Types by their name. The response will only contain the Server Type matching the specified name.
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
 * List Server Types response
 * @see https://docs.hetzner.cloud/reference/cloud#server-types-list-server-types
 */
export type ListServerTypesResponse = z.infer<typeof listServerTypesResponseSchema>;

/**
 * Get Server Type response
 * @see https://docs.hetzner.cloud/reference/cloud#server-types-get-a-server-type
 */
export type GetServerTypeResponse = z.infer<typeof getServerTypeResponseSchema>;
