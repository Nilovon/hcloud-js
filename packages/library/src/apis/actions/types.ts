/**
 * Types for Hetzner Cloud Actions API
 * @see https://docs.hetzner.cloud/reference/cloud#actions
 */

import type { z } from "zod";
import type { OneOrMany, PageParams, SortParam } from "../common/types";
import type {
  actionErrorSchema,
  actionResourceSchema,
  actionResponseSchema,
  actionSchema,
  actionsResponseSchema,
  actionStatusSchema,
  getActionResponseSchema,
  listActionsResponseSchema,
} from "./schemas";

/**
 * Resource an action relates to
 */
export type ActionResource = z.infer<typeof actionResourceSchema>;

/**
 * Error of a failed action
 */
export type ActionError = z.infer<typeof actionErrorSchema>;

/**
 * Hetzner Cloud Action: an asynchronous operation on one or more resources
 * @see https://docs.hetzner.cloud/reference/cloud#actions
 */
export type Action = z.infer<typeof actionSchema>;

/**
 * Action status values
 */
export type ActionStatus = z.infer<typeof actionStatusSchema>;

/**
 * Fields actions can be sorted by
 */
export type ActionSort = SortParam<"id" | "command" | "status" | "started" | "finished">;

/**
 * List Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#actions-get-multiple-actions
 */
export interface ListActionsParams extends PageParams {
  /**
   * Only return actions with the given IDs.
   */
  id?: OneOrMany<number>;
  /**
   * Only return actions with the given status.
   */
  status?: OneOrMany<ActionStatus>;
  /**
   * Sort the result.
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: OneOrMany<ActionSort>;
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

/**
 * Response containing a single action
 */
export type ActionResponse = z.infer<typeof actionResponseSchema>;

/**
 * Response containing multiple actions
 */
export type ActionsResponse = z.infer<typeof actionsResponseSchema>;

/**
 * An action, its ID, or a response containing an action.
 */
export type ActionInput = number | Action | { action: Action };

/**
 * A list of actions (or IDs), or a response containing actions. For responses,
 * `action`, `actions` and `next_actions` are all taken into account.
 */
export type ActionsInput =
  | ReadonlyArray<number | Action>
  | {
      action?: Action | null;
      actions?: readonly Action[] | null;
      next_actions?: readonly Action[] | null;
    };

/**
 * Options for waiting on actions
 */
export interface WaitForActionOptions {
  /**
   * Delay between polls in milliseconds, or a function computing the delay for
   * the n-th poll (starting at `0`).
   *
   * Default: the client's `actions.pollInterval`, which itself defaults to an
   * exponential backoff from 500ms up to 5s.
   */
  pollInterval?: number | ((attempt: number) => number);
  /**
   * @deprecated Use `pollInterval` instead.
   */
  interval?: number;
  /**
   * Maximum time to wait in milliseconds.
   * Default: the client's `actions.timeout` (5 minutes).
   */
  timeout?: number;
  /**
   * Throw a `HCloudActionError` if an action fails. If `false`, failed actions
   * are returned like successful ones. Default: `true`.
   */
  throwOnError?: boolean;
  /**
   * Called with the current state of an action after every poll.
   */
  onProgress?: (action: Action) => void;
  /**
   * Abort waiting.
   */
  signal?: AbortSignal;
}
