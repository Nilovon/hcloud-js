/**
 * Hetzner Cloud Actions API
 * @see https://docs.hetzner.cloud/reference/cloud#actions
 */

import type { HCloudClient } from "@hcloud-js/client/index.js";
import type {
  ListActionsParams,
  ListActionsResponse,
  GetActionResponse,
} from "@hcloud-js/apis/actions/types.js";
import { validate } from "@hcloud-js/validation/index.js";
import {
  listActionsResponseSchema,
  getActionResponseSchema,
} from "@hcloud-js/apis/actions/schemas.js";

/**
 * Actions API client
 */
export class ActionsClient {
  constructor(private readonly client: HCloudClient) {}

  /**
   * Returns all Action objects.
   *
   * ⚠️ **Note:** As of 2025-01-30, the Hetzner Cloud API removed the ability to list arbitrary actions.
   * This endpoint may return a 410 error. Actions should be retrieved individually by ID
   * (typically obtained from resource operations).
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of actions with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#actions-get-multiple-actions
   * @see https://docs.hetzner.cloud/changelog#2025-01-30-listing-arbitrary-actions-in-the-actions-list-endpoint-is-removed
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Note: This may fail with 410 error
   * // Use client.actions.get(id) instead with an action ID from a resource operation
   * try {
   *   const result = await client.actions.list();
   * } catch (error) {
   *   // Handle 410 error (deprecated endpoint)
   * }
   * ```
   * @deprecated This endpoint may be deprecated. Use {@link ActionsClient.get} with an action ID instead.
   */
  async list(params?: ListActionsParams): Promise<ListActionsResponse> {
    // Build query parameters
    const queryParams: Record<string, string | number | string[] | undefined> = {};

    if (params?.id !== undefined) {
      // Convert id(s) to array of strings for query params
      const ids = Array.isArray(params.id) ? params.id : [params.id];
      queryParams.id = ids.map(String);
    }

    if (params?.status) {
      // Convert single status to array for consistent handling
      queryParams.status = Array.isArray(params.status) ? params.status : [params.status];
    }

    if (params?.sort) {
      // Convert single string to array for consistent handling
      queryParams.sort = Array.isArray(params.sort) ? params.sort : [params.sort];
    }

    if (params?.page !== undefined) {
      queryParams.page = params.page;
    }

    if (params?.per_page !== undefined) {
      queryParams.per_page = params.per_page;
    }

    const response = await this.client.get<unknown>("/actions", queryParams);

    // Validate response with Zod
    return validate(listActionsResponseSchema, response, {
      context: "List actions response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Action object.
   *
   * @param id - ID of the Action
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#actions-get-an-action
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get an action by ID
   * const action = await client.actions.get(12345);
   * console.log(action.action.command);
   * console.log(action.action.status);
   * ```
   */
  async get(id: number): Promise<GetActionResponse> {
    const response = await this.client.get<unknown>(`/actions/${id}`);

    // Validate response with Zod
    return validate(getActionResponseSchema, response, {
      context: "Get action response",
      detailed: true,
    });
  }
}
