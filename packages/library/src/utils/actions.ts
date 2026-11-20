/**
 * Legacy action polling helpers.
 */

import type { Action, WaitForActionOptions } from "../apis/actions/types";
import type { HCloudClient } from "../client";

/**
 * Options for polling an action.
 * @deprecated Use {@link WaitForActionOptions} instead.
 */
export type PollActionOptions = WaitForActionOptions;

/**
 * Poll an action until it completes.
 *
 * @deprecated Use `client.actions.waitFor(action)` instead.
 */
export function pollAction(
  client: HCloudClient,
  actionId: number,
  options?: WaitForActionOptions,
): Promise<Action> {
  return client.actions.waitFor(actionId, options);
}

/**
 * Wait for multiple actions to complete.
 *
 * @deprecated Use `client.actions.waitForAll(actions)` instead.
 */
export function pollActions(
  client: HCloudClient,
  actionIds: number[],
  options?: WaitForActionOptions,
): Promise<Action[]> {
  return client.actions.waitForAll(actionIds, options);
}
