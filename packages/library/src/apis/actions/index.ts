/**
 * Hetzner Cloud Actions API
 * @see https://docs.hetzner.cloud/reference/cloud#actions
 */

import type { BaseClient } from "../../core/base-client";
import { HCloudActionError, HCloudActionTimeoutError } from "../../core/errors";
import { sleep } from "../../core/http";
import { MAX_PER_PAGE } from "../../core/pagination";
import { ListableResource, path } from "../../core/resource";
import type { ApiTarget, RequestOptions } from "../../core/types";
import { getActionResponseSchema, listActionsResponseSchema } from "./schemas";
import type {
  Action,
  ActionInput,
  ActionsInput,
  GetActionResponse,
  ListActionsParams,
  ListActionsResponse,
  WaitForActionOptions,
} from "./types";

/**
 * Actions of a resource type, e.g. all actions of servers.
 *
 * Available as `client.<resource>.actions`, for example `client.servers.actions`.
 */
export class ResourceActionsClient extends ListableResource<Action, ListActionsParams, "actions"> {
  protected readonly itemsKey = "actions";
  protected override readonly api: ApiTarget;

  /**
   * @param client - The client
   * @param basePath - Path of the resource, e.g. `/servers`. Empty for the global actions endpoint.
   * @param api - API the resource is served by
   */
  constructor(
    client: BaseClient,
    private readonly basePath: string = "",
    api: ApiTarget = "cloud",
  ) {
    super(client);
    this.api = api;
  }

  /**
   * Returns multiple actions.
   *
   * For the global `client.actions` endpoint, the `id` filter is required by the API.
   *
   * @param params - Filters and pagination
   * @see https://docs.hetzner.cloud/reference/cloud#actions-get-multiple-actions
   *
   * @example
   * ```typescript
   * const { actions } = await client.servers.actions.list({ status: "running" });
   * ```
   */
  list(params?: ListActionsParams, options?: RequestOptions): Promise<ListActionsResponse> {
    return this._get(`${this.basePath}/actions`, listActionsResponseSchema, params, options);
  }

  /**
   * Returns a specific action.
   *
   * @param id - ID of the action
   * @see https://docs.hetzner.cloud/reference/cloud#actions-get-an-action
   *
   * @example
   * ```typescript
   * const { action } = await client.actions.get(12345);
   * console.log(action.status, action.progress);
   * ```
   */
  get(id: number, options?: RequestOptions): Promise<GetActionResponse> {
    return this._get(
      `${this.basePath}${path`/actions/${id}`}`,
      getActionResponseSchema,
      undefined,
      options,
    );
  }

  /**
   * Wait until an action has finished.
   *
   * Accepts an action ID, an action object or any response containing an
   * `action`, so the result of most mutating calls can be passed directly.
   *
   * @param action - Action, action ID or response containing an action
   * @param options - Polling options
   * @returns The finished action
   * @throws {HCloudActionError} If the action failed (unless `throwOnError` is `false`)
   * @throws {HCloudActionTimeoutError} If the action did not finish in time
   *
   * @example
   * ```typescript
   * const action = await client.actions.waitFor(await client.servers.powerOn(42));
   * console.log(action.status); // "success"
   * ```
   */
  async waitFor(action: ActionInput, options?: WaitForActionOptions): Promise<Action> {
    const input = typeof action === "object" && "action" in action ? action.action : action;
    const [finished] = await this.waitForAll([input], options);
    return finished as Action;
  }

  /**
   * Wait until multiple actions have finished. Pending actions are polled
   * together in a single request per poll.
   *
   * Accepts a list of actions or action IDs, or any response containing
   * `action`, `actions` and/or `next_actions` (e.g. the result of
   * `client.servers.create()`).
   *
   * @param actions - Actions, action IDs or a response containing actions
   * @param options - Polling options
   * @returns The finished actions, in the order they were passed
   * @throws {HCloudActionError} If an action failed (unless `throwOnError` is `false`)
   * @throws {HCloudActionTimeoutError} If the actions did not finish in time
   *
   * @example
   * ```typescript
   * const created = await client.servers.create({ name: "web-1", server_type: "cx22", image: "ubuntu-24.04" });
   * await client.actions.waitForAll(created); // waits for `action` and `next_actions`
   * ```
   */
  async waitForAll(actions: ActionsInput, options: WaitForActionOptions = {}): Promise<Action[]> {
    const defaults = this.client.config.actions;
    const pollInterval = options.pollInterval ?? options.interval ?? defaults.pollInterval;
    const timeout = options.timeout ?? defaults.timeout;
    const throwOnError = options.throwOnError ?? true;
    const { onProgress, signal } = options;

    const inputs = normalizeActions(actions);
    const order = inputs.map((input) => (typeof input === "number" ? input : input.id));
    const finished = new Map<number, Action>();
    const pending = new Set<number>();
    let pollImmediately = false;

    const settle = (action: Action): void => {
      if (action.status === "running") {
        pending.add(action.id);
        return;
      }
      if (action.status === "error" && throwOnError) throw new HCloudActionError(action);
      pending.delete(action.id);
      finished.set(action.id, action);
    };

    for (const input of inputs) {
      if (typeof input === "number") {
        // Nothing is known about the action yet, so ask the API right away.
        if (!finished.has(input)) pending.add(input);
        pollImmediately = true;
      } else {
        settle(input);
      }
    }

    const startedAt = Date.now();
    for (let attempt = 0; pending.size > 0; attempt++) {
      if (attempt > 0 || !pollImmediately) {
        const delay = typeof pollInterval === "function" ? pollInterval(attempt) : pollInterval;
        const remaining = timeout - (Date.now() - startedAt);
        if (remaining <= 0) throw new HCloudActionTimeoutError([...pending], timeout);
        await sleep(Math.min(delay, remaining), signal);
      }

      for (const action of await this.fetchActions([...pending], { signal })) {
        onProgress?.(action);
        settle(action);
      }
    }

    return order.map((id) => finished.get(id) as Action);
  }

  private async fetchActions(ids: number[], options: RequestOptions): Promise<Action[]> {
    if (ids.length === 1) {
      const { action } = await this.get(ids[0] as number, options);
      return [action];
    }
    const actions: Action[] = [];
    for (let i = 0; i < ids.length; i += MAX_PER_PAGE) {
      const chunk = ids.slice(i, i + MAX_PER_PAGE);
      const page = await this.list({ id: chunk, per_page: MAX_PER_PAGE }, options);
      actions.push(...page.actions);
    }
    return actions;
  }
}

/**
 * Actions API client
 *
 * Actions represent asynchronous operations. Most mutating API calls return an
 * action that can be awaited with {@link ResourceActionsClient.waitFor}.
 *
 * @see https://docs.hetzner.cloud/reference/cloud#actions
 */
export class ActionsClient extends ResourceActionsClient {
  constructor(client: BaseClient) {
    super(client, "");
  }
}

function normalizeActions(input: ActionsInput): Array<number | Action> {
  if (Array.isArray(input)) return [...input];
  const response = input as Exclude<ActionsInput, ReadonlyArray<number | Action>>;
  const actions: Action[] = [];
  if (response.action) actions.push(response.action);
  if (response.actions) actions.push(...response.actions);
  if (response.next_actions) actions.push(...response.next_actions);
  return actions;
}
