/**
 * Hetzner Cloud Firewalls API
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls
 */

import { ResourceActionsClient } from "../actions/index";
import {
  actionsResponseSchema,
  getActionResponseSchema,
  listActionsResponseSchema,
} from "../actions/schemas";
import { NamedResource, path } from "../../core/resource";
import type { RequestOptions } from "../../core/types";
import {
  applyFirewallToResourcesRequestSchema,
  createFirewallRequestSchema,
  createFirewallResponseSchema,
  getFirewallResponseSchema,
  listFirewallsResponseSchema,
  removeFirewallFromResourcesRequestSchema,
  setFirewallRulesRequestSchema,
  updateFirewallRequestSchema,
  updateFirewallResponseSchema,
} from "./schemas";
import type {
  ApplyFirewallToResourcesParams,
  ApplyFirewallToResourcesResponse,
  CreateFirewallParams,
  CreateFirewallResponse,
  Firewall,
  GetFirewallActionResponse,
  GetFirewallResponse,
  ListFirewallActionsParams,
  ListFirewallActionsResponse,
  ListFirewallsParams,
  ListFirewallsResponse,
  RemoveFirewallFromResourcesParams,
  RemoveFirewallFromResourcesResponse,
  SetFirewallRulesParams,
  SetFirewallRulesResponse,
  UpdateFirewallParams,
  UpdateFirewallResponse,
} from "./types";

/**
 * Firewalls API client
 *
 * Firewalls restrict inbound and outbound traffic of the servers they are
 * applied to, either directly or through a label selector.
 *
 * In addition to the methods below, the pagination helpers `iterate()`,
 * `iteratePages()`, `listAll()` and `first()` as well as `getByName()` are
 * available.
 *
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls
 */
export class FirewallsClient extends NamedResource<Firewall, ListFirewallsParams, "firewalls"> {
  protected readonly itemsKey = "firewalls";

  /**
   * Actions of all firewalls: `list()`, `get()`, `waitFor()` and `waitForAll()`.
   *
   * @example
   * ```typescript
   * const { actions } = await client.firewalls.actions.list({ status: "running" });
   * ```
   */
  public readonly actions = new ResourceActionsClient(this.client, "/firewalls");

  /**
   * Returns a page of firewalls.
   *
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-list-firewalls
   *
   * @example
   * ```typescript
   * const { firewalls } = await client.firewalls.list({
   *   label_selector: "environment=production",
   *   sort: "name:asc",
   * });
   *
   * // All firewalls across all pages
   * const all = await client.firewalls.listAll();
   * ```
   */
  list(params?: ListFirewallsParams, options?: RequestOptions): Promise<ListFirewallsResponse> {
    return this._get("/firewalls", listFirewallsResponseSchema, params, options);
  }

  /**
   * Returns a specific firewall.
   *
   * @param id - ID of the firewall
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-get-a-firewall
   *
   * @example
   * ```typescript
   * const { firewall } = await client.firewalls.get(12345);
   * console.log(firewall.rules.length);
   * ```
   */
  get(id: number, options?: RequestOptions): Promise<GetFirewallResponse> {
    return this._get(path`/firewalls/${id}`, getFirewallResponseSchema, undefined, options);
  }

  /**
   * Creates a new firewall, optionally with rules and applied to resources.
   *
   * The returned `actions` track setting the rules and applying the firewall.
   *
   * @param params - Name and optional labels, rules and resources to apply the firewall to
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-create-a-firewall
   *
   * @example
   * ```typescript
   * const created = await client.firewalls.create({
   *   name: "web",
   *   rules: [
   *     { direction: "in", protocol: "tcp", port: "443", source_ips: ["0.0.0.0/0", "::/0"] },
   *     { direction: "in", protocol: "icmp", source_ips: ["0.0.0.0/0", "::/0"] },
   *   ],
   *   apply_to: [{ type: "label_selector", label_selector: { selector: "role=web" } }],
   * });
   * await client.actions.waitForAll(created);
   * ```
   */
  create(params: CreateFirewallParams, options?: RequestOptions): Promise<CreateFirewallResponse> {
    return this._post(
      "/firewalls",
      createFirewallResponseSchema,
      params,
      createFirewallRequestSchema,
      options,
    );
  }

  /**
   * Updates the name and/or labels of a firewall.
   *
   * @param id - ID of the firewall
   * @param params - Fields to update
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-update-a-firewall
   *
   * @example
   * ```typescript
   * const { firewall } = await client.firewalls.update(12345, {
   *   name: "new-name",
   *   labels: { environment: "production" },
   * });
   * ```
   */
  update(
    id: number,
    params: UpdateFirewallParams,
    options?: RequestOptions,
  ): Promise<UpdateFirewallResponse> {
    return this._put(
      path`/firewalls/${id}`,
      updateFirewallResponseSchema,
      params,
      updateFirewallRequestSchema,
      options,
    );
  }

  /**
   * Deletes a firewall. It must not be applied to any resource anymore.
   *
   * @param id - ID of the firewall
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-delete-a-firewall
   *
   * @example
   * ```typescript
   * await client.firewalls.delete(12345);
   * ```
   */
  delete(id: number, options?: RequestOptions): Promise<void> {
    return this._delete(path`/firewalls/${id}`, null, options);
  }

  /**
   * Returns a page of actions of a firewall.
   *
   * @param id - ID of the firewall
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-list-actions-for-a-firewall
   *
   * @example
   * ```typescript
   * const { actions } = await client.firewalls.listActions(12345, {
   *   status: "running",
   *   sort: "started:desc",
   * });
   * ```
   */
  listActions(
    id: number,
    params?: ListFirewallActionsParams,
    options?: RequestOptions,
  ): Promise<ListFirewallActionsResponse> {
    return this._get(path`/firewalls/${id}/actions`, listActionsResponseSchema, params, options);
  }

  /**
   * Returns a specific action of a firewall.
   *
   * @param id - ID of the firewall
   * @param actionId - ID of the action
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-get-an-action-for-a-firewall
   *
   * @example
   * ```typescript
   * const { action } = await client.firewalls.getAction(12345, 67890);
   * console.log(action.status);
   * ```
   */
  getAction(
    id: number,
    actionId: number,
    options?: RequestOptions,
  ): Promise<GetFirewallActionResponse> {
    return this._get(
      path`/firewalls/${id}/actions/${actionId}`,
      getActionResponseSchema,
      undefined,
      options,
    );
  }

  /**
   * Sets the rules of a firewall. All existing rules are replaced; pass an
   * empty array to remove all rules.
   *
   * Rules returned by the API (`firewall.rules`) can be passed back as they are.
   *
   * @param id - ID of the firewall
   * @param params - The complete list of rules
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-set-rules
   *
   * @example
   * ```typescript
   * // Add a rule to the existing ones
   * const { firewall } = await client.firewalls.get(12345);
   * const { actions } = await client.firewalls.setRules(12345, {
   *   rules: [
   *     ...firewall.rules,
   *     { direction: "in", protocol: "tcp", port: "22", source_ips: ["203.0.113.7/32"] },
   *   ],
   * });
   * await client.actions.waitForAll(actions);
   * ```
   */
  setRules(
    id: number,
    params: SetFirewallRulesParams,
    options?: RequestOptions,
  ): Promise<SetFirewallRulesResponse> {
    return this._post(
      path`/firewalls/${id}/actions/set_rules`,
      actionsResponseSchema,
      params,
      setFirewallRulesRequestSchema,
      options,
    );
  }

  /**
   * Applies a firewall to servers and/or label selectors.
   *
   * @param id - ID of the firewall
   * @param params - Resources to apply the firewall to
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-apply-to-resources
   *
   * @example
   * ```typescript
   * const { actions } = await client.firewalls.applyToResources(12345, {
   *   apply_to: [
   *     { type: "server", server: { id: 42 } },
   *     { type: "label_selector", label_selector: { selector: "role=web" } },
   *   ],
   * });
   * await client.actions.waitForAll(actions);
   * ```
   */
  applyToResources(
    id: number,
    params: ApplyFirewallToResourcesParams,
    options?: RequestOptions,
  ): Promise<ApplyFirewallToResourcesResponse> {
    return this._post(
      path`/firewalls/${id}/actions/apply_to_resources`,
      actionsResponseSchema,
      params,
      applyFirewallToResourcesRequestSchema,
      options,
    );
  }

  /**
   * Removes a firewall from servers and/or label selectors.
   *
   * Resources returned by the API (`firewall.applied_to`) can be passed back as they are.
   *
   * @param id - ID of the firewall
   * @param params - Resources to remove the firewall from
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls-remove-from-resources
   *
   * @example
   * ```typescript
   * const { actions } = await client.firewalls.removeFromResources(12345, {
   *   remove_from: [{ type: "server", server: { id: 42 } }],
   * });
   * await client.actions.waitForAll(actions);
   * ```
   */
  removeFromResources(
    id: number,
    params: RemoveFirewallFromResourcesParams,
    options?: RequestOptions,
  ): Promise<RemoveFirewallFromResourcesResponse> {
    return this._post(
      path`/firewalls/${id}/actions/remove_from_resources`,
      actionsResponseSchema,
      params,
      removeFirewallFromResourcesRequestSchema,
      options,
    );
  }
}
