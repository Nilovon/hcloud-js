/**
 * Types for Hetzner Cloud Actions API
 * Types are inferred from Zod schemas
 * @see https://docs.hetzner.cloud/reference/cloud#actions-get-multiple-actions
 */

// biome-ignore assist/source/organizeImports: we need to import the schemas first
import {
  listActionsResponseSchema,
  getActionResponseSchema,
} from "@hcloud-js/apis/actions/schemas.js";
import { actionSchema, actionResourceSchema } from "@hcloud-js/apis/actions/schemas.js";
import type { z } from "zod";

/**
 * Action resource information
 */
export type ActionResource = z.infer<typeof actionResourceSchema>;

/**
 * Hetzner Cloud Action
 * @see https://docs.hetzner.cloud/reference/cloud#actions-get-multiple-actions
 */
export type Action = z.infer<typeof actionSchema>;

/**
 * Action status values
 */
export type ActionStatus = "running" | "success" | "error";

/**
 * Pagination metadata
 * @see https://docs.hetzner.cloud/reference/cloud#pagination
 * Re-exported from servers module for consistency
 */
export type { PaginationMeta } from "@hcloud-js/apis/servers/types.js";

/**
 * List Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#actions-get-multiple-actions
 */
export interface ListActionsParams {
  /**
   * Can be used multiple times. The response will only contain Actions matching the specified IDs.
   */
  id?: number | number[];
  /**
   * Can be used multiple times. The response will only contain Actions matching the specified status.
   * Choices: running, success, error
   */
  status?: ActionStatus | ActionStatus[];
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, command, command:asc, command:desc, status, status:asc, status:desc, progress, progress:asc, progress:desc, started, started:asc, started:desc, finished, finished:asc, finished:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
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
 * List Actions response
 * @see https://docs.hetzner.cloud/reference/cloud#actions-get-multiple-actions
 */
export type ListActionsResponse = z.infer<typeof listActionsResponseSchema>;

/**
 * Get Action response
 * @see https://docs.hetzner.cloud/reference/cloud#actions-get-an-action
 */
export type GetActionResponse = z.infer<typeof getActionResponseSchema>;
