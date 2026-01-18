/**
 * Common Zod schemas shared across multiple API modules
 * @see https://docs.hetzner.cloud/reference/cloud#pagination
 */

import { z } from "zod";

/**
 * Pagination metadata schema
 * @see https://docs.hetzner.cloud/reference/cloud#pagination
 */
export const paginationMetaSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  previous_page: z.number().nullable(),
  next_page: z.number().nullable(),
  last_page: z.number(),
  total_entries: z.number(),
});
