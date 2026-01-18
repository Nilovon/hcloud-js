/**
 * Action utilities for polling and waiting on Hetzner Cloud Actions
 * @see https://docs.hetzner.cloud/reference/cloud#actions
 */

import type { HCloudClient } from "../client/index";
import type { Action } from "../apis/actions/types";
import { HCloudError } from "../errors/index";

/**
 * Options for polling an action
 */
export interface PollActionOptions {
  /**
   * Interval between polls in milliseconds (default: 1000)
   */
  interval?: number;
  /**
   * Maximum time to wait in milliseconds (default: 300000 = 5 minutes)
   */
  timeout?: number;
  /**
   * Whether to throw an error if the action fails (default: true)
   */
  throwOnError?: boolean;
}

/**
 * Poll an action until it completes
 *
 * @param client - HCloudClient instance
 * @param actionId - ID of the action to poll
 * @param options - Polling options
 * @returns Promise resolving to the completed action
 * @throws {HCloudError} If the action fails or times out
 *
 * @example
 * ```typescript
 * const client = new HCloudClient({ token: 'your-token' });
 *
 * // Start a server
 * const action = await client.servers.powerOn(12345);
 *
 * // Wait for it to complete
 * const completed = await pollAction(client, action.action.id);
 * console.log(`Server is now running!`);
 * ```
 */
export async function pollAction(
  client: HCloudClient,
  actionId: number,
  options: PollActionOptions = {},
): Promise<Action> {
  const {
    interval = 1000,
    timeout = 300000, // 5 minutes default
    throwOnError = true,
  } = options;

  const startTime = Date.now();

  while (true) {
    const elapsed = Date.now() - startTime;
    if (elapsed > timeout) {
      throw new HCloudError(
        `Action ${actionId} did not complete within ${timeout}ms`,
        "TIMEOUT",
        0,
      );
    }

    const action = await client.actions.get(actionId);

    if (action.action.status === "success") {
      return action.action;
    }

    if (action.action.status === "error") {
      if (throwOnError) {
        const errorMessage =
          action.action.error?.message || `Action ${actionId} failed`;
        throw new HCloudError(
          errorMessage,
          action.action.error?.code || "ACTION_ERROR",
          0,
        );
      }
      return action.action;
    }

    // Action is still running, wait before next poll
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

/**
 * Wait for multiple actions to complete
 *
 * @param client - HCloudClient instance
 * @param actionIds - Array of action IDs to wait for
 * @param options - Polling options
 * @returns Promise resolving to array of completed actions
 *
 * @example
 * ```typescript
 * const client = new HCloudClient({ token: 'your-token' });
 *
 * // Start multiple servers
 * const actions = await Promise.all([
 *   client.servers.powerOn(1),
 *   client.servers.powerOn(2),
 *   client.servers.powerOn(3),
 * ]);
 *
 * // Wait for all to complete
 * const completed = await pollActions(
 *   client,
 *   actions.map((a) => a.action.id)
 * );
 * ```
 */
export async function pollActions(
  client: HCloudClient,
  actionIds: number[],
  options: PollActionOptions = {},
): Promise<Action[]> {
  return Promise.all(actionIds.map((id) => pollAction(client, id, options)));
}