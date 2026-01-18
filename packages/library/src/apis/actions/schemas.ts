/**
 * Zod schemas for Hetzner Cloud Actions API
 * @see https://docs.hetzner.cloud/reference/cloud#actions-get-multiple-actions
 */

import { z } from "zod";
import { paginationMetaSchema } from "../common/schemas";

/**
 * Action resource schema
 * Common schema for action resources
 */
export const actionResourceSchema = z.object({
  id: z.number(),
  type: z.string(),
});

/**
 * Action schema
 * Common schema for all Hetzner Cloud Actions
 */
export const actionSchema = z
  .object({
    id: z.number(),
    command: z.string(),
    status: z.enum(["running", "success", "error"]),
    progress: z.number(),
    started: z.string(),
    finished: z.string().nullable(),
    resources: z.array(actionResourceSchema),
    error: z
      .object({
        code: z.string(),
        message: z.string(),
      })
      .nullable(),
  })
  .passthrough();

/**
 * List Actions response schema
 * @see https://docs.hetzner.cloud/reference/cloud#actions-get-multiple-actions
 */
export const listActionsResponseSchema = z.object({
  actions: z.array(actionSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Get Action response schema
 * @see https://docs.hetzner.cloud/reference/cloud#actions-get-an-action
 */
export const getActionResponseSchema = z.object({
  action: actionSchema,
});
