/**
 * Zod schemas for Hetzner Cloud Server Types API
 * @see https://docs.hetzner.cloud/reference/cloud#server-types
 */

import { z } from "zod";
import { paginationMetaSchema } from "@hcloud-js/apis/common/schemas.js";
import { serverTypeSchema } from "@hcloud-js/apis/servers/schemas.js";

/**
 * List Server Types response schema
 * @see https://docs.hetzner.cloud/reference/cloud#server-types-list-server-types
 */
export const listServerTypesResponseSchema = z.object({
  server_types: z.array(serverTypeSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Get Server Type response schema
 * @see https://docs.hetzner.cloud/reference/cloud#server-types-get-a-server-type
 */
export const getServerTypeResponseSchema = z.object({
  server_type: serverTypeSchema,
});
