/**
 * Zod schemas for Hetzner Cloud Actions API
 * @see https://docs.hetzner.cloud/reference/cloud#actions
 */

import { z } from "zod";
import { metaSchema } from "../common/schemas";

/**
 * Action status schema
 */
export const actionStatusSchema = z.enum(["running", "success", "error"]);

/**
 * Resource an action relates to
 */
export const actionResourceSchema = z.object({
  id: z.number(),
  type: z.string(),
});

/**
 * Error of a failed action
 */
export const actionErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
});

/**
 * Action schema
 *
 * Actions represent asynchronous operations on resources.
 */
export const actionSchema = z.object({
  id: z.number(),
  command: z.string(),
  status: actionStatusSchema,
  progress: z.number(),
  started: z.string(),
  finished: z.string().nullable(),
  resources: z.array(actionResourceSchema),
  error: actionErrorSchema.nullable().optional(),
});

/**
 * List Actions response schema
 * @see https://docs.hetzner.cloud/reference/cloud#actions-get-multiple-actions
 */
export const listActionsResponseSchema = z.object({
  actions: z.array(actionSchema),
  meta: metaSchema.optional(),
});

/**
 * Get Action response schema
 * @see https://docs.hetzner.cloud/reference/cloud#actions-get-an-action
 */
export const getActionResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Response containing a single action. Returned by most resource actions.
 */
export const actionResponseSchema = getActionResponseSchema;

/**
 * Response containing multiple actions.
 */
export const actionsResponseSchema = z.object({
  actions: z.array(actionSchema),
});
