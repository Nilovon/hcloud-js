/**
 * Hetzner Cloud Firewalls API
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls
 */

import type { HCloudClient } from "../../client/index";
import type {
  ListFirewallsParams,
  ListFirewallsResponse,
  CreateFirewallParams,
  CreateFirewallResponse,
  GetFirewallResponse,
  UpdateFirewallParams,
  UpdateFirewallResponse,
  DeleteFirewallResponse,
  ListFirewallActionsParams,
  ListFirewallActionsResponse,
  GetFirewallActionResponse,
  ApplyFirewallToResourcesParams,
  ApplyFirewallToResourcesResponse,
  RemoveFirewallFromResourcesParams,
  RemoveFirewallFromResourcesResponse,
  SetFirewallRulesParams,
  SetFirewallRulesResponse,
} from "../../apis/firewalls/types";
import { validate } from "../../validation/index";
import {
  listFirewallsResponseSchema,
  createFirewallRequestSchema,
  createFirewallResponseSchema,
  getFirewallResponseSchema,
  updateFirewallRequestSchema,
  updateFirewallResponseSchema,
  deleteFirewallResponseSchema,
  listFirewallActionsResponseSchema,
  getFirewallActionResponseSchema,
  applyFirewallToResourcesRequestSchema,
  applyFirewallToResourcesResponseSchema,
  removeFirewallFromResourcesRequestSchema,
  removeFirewallFromResourcesResponseSchema,
  setFirewallRulesRequestSchema,
  setFirewallRulesResponseSchema,
} from "../../apis/firewalls/schemas";

/**
 * Firewalls API client
 */
export class FirewallsClient {
  constructor(private readonly client: HCloudClient) {}

  /**
   * Returns all Firewall objects.
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of firewalls with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-list-firewalls
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all firewalls
   * const result = await client.firewalls.list();
   *
   * // List firewalls with filters
   * const firewalls = await client.firewalls.list({
   *   name: 'my-firewall',
   *   label_selector: 'environment=production',
   *   sort: ['name:asc'],
   *   page: 1,
   *   per_page: 50
   * });
   * ```
   */
  async list(params?: ListFirewallsParams): Promise<ListFirewallsResponse> {
    const queryParams: Record<string, string | number | string[] | undefined> = {};

    if (params?.name) {
      queryParams.name = params.name;
    }

    if (params?.label_selector) {
      queryParams.label_selector = params.label_selector;
    }

    if (params?.sort) {
      queryParams.sort = Array.isArray(params.sort) ? params.sort : [params.sort];
    }

    if (params?.page !== undefined) {
      queryParams.page = params.page;
    }

    if (params?.per_page !== undefined) {
      queryParams.per_page = params.per_page;
    }

    const response = await this.client.get<unknown>("/firewalls", queryParams);

    return validate(listFirewallsResponseSchema, response, {
      context: "List firewalls response",
      detailed: true,
    });
  }

  /**
   * Creates a new Firewall.
   *
   * @param params - Parameters for creating the firewall
   * @returns Promise resolving to the created firewall and action
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-create-a-firewall
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Create a firewall with rules
   * const firewall = await client.firewalls.create({
   *   name: 'my-firewall',
   *   rules: {
   *     inbound: [
   *       {
   *         direction: 'in',
   *         protocol: 'tcp',
   *         port: '80',
   *         source_ips: ['0.0.0.0/0']
   *       }
   *     ]
   *   },
   *   apply_to: [
   *     {
   *       type: 'server',
   *       server: { id: 12345 }
   *     }
   *   ]
   * });
   * ```
   */
  async create(params: CreateFirewallParams): Promise<CreateFirewallResponse> {
    const validatedParams = validate(createFirewallRequestSchema, params, {
      context: "Create firewall request",
      detailed: true,
    });

    const response = await this.client.post<unknown>("/firewalls", validatedParams);

    return validate(createFirewallResponseSchema, response, {
      context: "Create firewall response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Firewall object.
   *
   * @param id - ID of the Firewall
   * @returns Promise resolving to the firewall
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-get-a-firewall
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get a firewall by ID
   * const firewall = await client.firewalls.get(12345);
   * console.log(firewall.firewall.name);
   * ```
   */
  async get(id: number): Promise<GetFirewallResponse> {
    const response = await this.client.get<unknown>(`/firewalls/${id}`);

    return validate(getFirewallResponseSchema, response, {
      context: "Get firewall response",
      detailed: true,
    });
  }

  /**
   * Updates the Firewall.
   *
   * You can update a Firewall's name and labels.
   *
   * @param id - ID of the Firewall
   * @param params - Parameters to update (name and/or labels)
   * @returns Promise resolving to the updated firewall
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-update-a-firewall
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Update firewall name
   * const updated = await client.firewalls.update(12345, {
   *   name: 'new-firewall-name'
   * });
   *
   * // Update labels
   * const updated = await client.firewalls.update(12345, {
   *   labels: { environment: 'production', team: 'backend' }
   * });
   * ```
   */
  async update(id: number, params: UpdateFirewallParams): Promise<UpdateFirewallResponse> {
    const validatedParams = validate(updateFirewallRequestSchema, params, {
      context: "Update firewall request",
      detailed: true,
    });

    const response = await this.client.put<unknown>(`/firewalls/${id}`, validatedParams);

    return validate(updateFirewallResponseSchema, response, {
      context: "Update firewall response",
      detailed: true,
    });
  }

  /**
   * Deletes a Firewall.
   *
   * @param id - ID of the Firewall
   * @returns Promise resolving to the delete action
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-delete-a-firewall
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Delete a firewall
   * const result = await client.firewalls.delete(12345);
   * if (result.action) {
   *   console.log(`Delete action ID: ${result.action.id}`);
   * }
   * ```
   */
  async delete(id: number): Promise<DeleteFirewallResponse> {
    const response = await this.client.delete<unknown>(`/firewalls/${id}`);

    return validate(deleteFirewallResponseSchema, response, {
      context: "Delete firewall response",
      detailed: true,
    });
  }

  /**
   * Returns all Action objects for a Firewall.
   *
   * @param id - ID of the Firewall
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of actions with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-list-actions-for-a-firewall
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all actions for a firewall
   * const actions = await client.firewalls.listActions(12345);
   *
   * // List actions with filters
   * const runningActions = await client.firewalls.listActions(12345, {
   *   status: ['running'],
   *   sort: ['started:desc']
   * });
   * ```
   */
  async listActions(
    id: number,
    params?: ListFirewallActionsParams,
  ): Promise<ListFirewallActionsResponse> {
    const queryParams: Record<string, string | number | string[] | undefined> = {};

    if (params?.sort) {
      queryParams.sort = Array.isArray(params.sort) ? params.sort : [params.sort];
    }

    if (params?.status) {
      queryParams.status = Array.isArray(params.status) ? params.status : [params.status];
    }

    if (params?.page !== undefined) {
      queryParams.page = params.page;
    }

    if (params?.per_page !== undefined) {
      queryParams.per_page = params.per_page;
    }

    const response = await this.client.get<unknown>(`/firewalls/${id}/actions`, queryParams);

    return validate(listFirewallActionsResponseSchema, response, {
      context: "List firewall actions response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Action object for a Firewall.
   *
   * @param id - ID of the Firewall
   * @param actionId - ID of the Action
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-get-an-action-for-a-firewall
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get an action by ID
   * const action = await client.firewalls.getAction(12345, 67890);
   * console.log(action.action.command);
   * ```
   */
  async getAction(id: number, actionId: number): Promise<GetFirewallActionResponse> {
    const response = await this.client.get<unknown>(`/firewalls/${id}/actions/${actionId}`);

    return validate(getFirewallActionResponseSchema, response, {
      context: "Get firewall action response",
      detailed: true,
    });
  }

  /**
   * Applies one Firewall to multiple resources.
   *
   * @param id - ID of the Firewall
   * @param params - Resources to apply the firewall to
   * @returns Promise resolving to list of actions
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-apply-to-resources
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Apply firewall to a server
   * const result = await client.firewalls.applyToResources(12345, {
   *   apply_to: [
   *     {
   *       type: 'server',
   *       server: { id: 67890 }
   *     }
   *   ]
   * });
   *
   * // Apply firewall using label selector
   * const result = await client.firewalls.applyToResources(12345, {
   *   apply_to: [
   *     {
   *       type: 'label_selector',
   *       label_selector: { selector: 'environment=production' }
   *     }
   *   ]
   * });
   * ```
   */
  async applyToResources(
    id: number,
    params: ApplyFirewallToResourcesParams,
  ): Promise<ApplyFirewallToResourcesResponse> {
    const validatedParams = validate(applyFirewallToResourcesRequestSchema, params, {
      context: "Apply firewall to resources request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/firewalls/${id}/actions/apply_to_resources`,
      validatedParams,
    );

    return validate(applyFirewallToResourcesResponseSchema, response, {
      context: "Apply firewall to resources response",
      detailed: true,
    });
  }

  /**
   * Removes one Firewall from multiple resources.
   *
   * @param id - ID of the Firewall
   * @param params - Resources to remove the firewall from
   * @returns Promise resolving to list of actions
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-remove-from-resources
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Remove firewall from a server
   * const result = await client.firewalls.removeFromResources(12345, {
   *   remove_from: [
   *     {
   *       type: 'server',
   *       server: { id: 67890 }
   *     }
   *   ]
   * });
   * ```
   */
  async removeFromResources(
    id: number,
    params: RemoveFirewallFromResourcesParams,
  ): Promise<RemoveFirewallFromResourcesResponse> {
    const validatedParams = validate(removeFirewallFromResourcesRequestSchema, params, {
      context: "Remove firewall from resources request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/firewalls/${id}/actions/remove_from_resources`,
      validatedParams,
    );

    return validate(removeFirewallFromResourcesResponseSchema, response, {
      context: "Remove firewall from resources response",
      detailed: true,
    });
  }

  /**
   * Sets the rules of a Firewall.
   *
   * @param id - ID of the Firewall
   * @param params - Firewall rules to set
   * @returns Promise resolving to list of actions
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-set-rules
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Set firewall rules
   * const result = await client.firewalls.setRules(12345, {
   *   rules: {
   *     inbound: [
   *       {
   *         direction: 'in',
   *         protocol: 'tcp',
   *         port: '443',
   *         source_ips: ['0.0.0.0/0']
   *       }
   *     ],
   *     outbound: [
   *       {
   *         direction: 'out',
   *         protocol: 'tcp',
   *         port: '80',
   *         destination_ips: ['0.0.0.0/0']
   *       }
   *     ]
   *   }
   * });
   * ```
   */
  async setRules(id: number, params: SetFirewallRulesParams): Promise<SetFirewallRulesResponse> {
    const validatedParams = validate(setFirewallRulesRequestSchema, params, {
      context: "Set firewall rules request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/firewalls/${id}/actions/set_rules`,
      validatedParams,
    );

    return validate(setFirewallRulesResponseSchema, response, {
      context: "Set firewall rules response",
      detailed: true,
    });
  }
}
