/**
 * Hetzner Cloud Primary IPs API
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips
 */

import { NamedResource, path } from "../../core/resource";
import type { RequestOptions } from "../../core/types";
import { ResourceActionsClient } from "../actions/index";
import {
  actionResponseSchema,
  getActionResponseSchema,
  listActionsResponseSchema,
} from "../actions/schemas";
import {
  assignPrimaryIPToResourceRequestSchema,
  changePrimaryIPProtectionRequestSchema,
  changePrimaryIPReverseDNSRequestSchema,
  createPrimaryIPRequestSchema,
  createPrimaryIPResponseSchema,
  getPrimaryIPResponseSchema,
  listPrimaryIPsResponseSchema,
  updatePrimaryIPRequestSchema,
  updatePrimaryIPResponseSchema,
} from "./schemas";
import type {
  AssignPrimaryIPToResourceParams,
  AssignPrimaryIPToResourceResponse,
  ChangePrimaryIPProtectionParams,
  ChangePrimaryIPProtectionResponse,
  ChangePrimaryIPReverseDNSParams,
  ChangePrimaryIPReverseDNSResponse,
  CreatePrimaryIPParams,
  CreatePrimaryIPResponse,
  GetPrimaryIPActionResponse,
  GetPrimaryIPResponse,
  ListPrimaryIPActionsParams,
  ListPrimaryIPActionsResponse,
  ListPrimaryIPsParams,
  ListPrimaryIPsResponse,
  PrimaryIP,
  UnassignPrimaryIPResponse,
  UpdatePrimaryIPParams,
  UpdatePrimaryIPResponse,
} from "./types";

/**
 * Primary IPs API client
 *
 * Primary IPs are the public IPs of servers and load balancers. They belong to
 * a location and can only be assigned to resources in that location.
 *
 * In addition to the methods below, the pagination helpers `iterate()`,
 * `iteratePages()`, `listAll()` and `first()` as well as `getByName()` are
 * available.
 *
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips
 */
export class PrimaryIPsClient extends NamedResource<
  PrimaryIP,
  ListPrimaryIPsParams,
  "primary_ips"
> {
  protected readonly itemsKey = "primary_ips";

  /**
   * Actions of all Primary IPs (`GET /primary_ips/actions`), including
   * `waitFor()` and `waitForAll()`.
   *
   * @example
   * ```typescript
   * const { actions } = await client.primaryIPs.actions.list({ status: "running" });
   * ```
   */
  public readonly actions = new ResourceActionsClient(this.client, "/primary_ips");

  /**
   * Returns a page of Primary IPs.
   *
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-list-primary-ips
   *
   * @example
   * ```typescript
   * const { primary_ips } = await client.primaryIPs.list({
   *   label_selector: "environment=production",
   *   sort: "created:desc",
   * });
   *
   * // All Primary IPs across all pages
   * const all = await client.primaryIPs.listAll();
   * ```
   */
  list(params?: ListPrimaryIPsParams, options?: RequestOptions): Promise<ListPrimaryIPsResponse> {
    return this._get("/primary_ips", listPrimaryIPsResponseSchema, params, options);
  }

  /**
   * Returns a specific Primary IP.
   *
   * @param id - ID of the Primary IP
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-get-a-primary-ip
   *
   * @example
   * ```typescript
   * const { primary_ip } = await client.primaryIPs.get(12345);
   * console.log(primary_ip.ip, primary_ip.location.name);
   * ```
   */
  get(id: number, options?: RequestOptions): Promise<GetPrimaryIPResponse> {
    return this._get(path`/primary_ips/${id}`, getPrimaryIPResponseSchema, undefined, options);
  }

  /**
   * Finds a Primary IP by its IP address.
   *
   * @param ip - IP address of the Primary IP
   * @param options - Request options
   * @returns The Primary IP, or `undefined` if none matches
   *
   * @example
   * ```typescript
   * const primaryIP = await client.primaryIPs.getByIP("131.232.99.1");
   * ```
   */
  async getByIP(ip: string, options?: RequestOptions): Promise<PrimaryIP | undefined> {
    const { primary_ips } = await this.list({ ip }, options);
    return primary_ips.find((primaryIP) => primaryIP.ip === ip);
  }

  /**
   * Creates a new Primary IP, optionally assigned to a resource.
   *
   * Pass either `location` or `assignee_id` together with `assignee_type`. The
   * returned `action` is only set if the Primary IP is assigned on creation.
   *
   * @param params - Name, type and either `location` or an assignee
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-create-a-primary-ip
   *
   * @example
   * ```typescript
   * const { primary_ip } = await client.primaryIPs.create({
   *   name: "my-primary-ip",
   *   type: "ipv4",
   *   location: "fsn1",
   * });
   * ```
   */
  create(
    params: CreatePrimaryIPParams,
    options?: RequestOptions,
  ): Promise<CreatePrimaryIPResponse> {
    return this._post(
      "/primary_ips",
      createPrimaryIPResponseSchema,
      params,
      createPrimaryIPRequestSchema,
      options,
    );
  }

  /**
   * Updates the name, `auto_delete` and/or labels of a Primary IP.
   *
   * @param id - ID of the Primary IP
   * @param params - Fields to update
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-update-a-primary-ip
   *
   * @example
   * ```typescript
   * const { primary_ip } = await client.primaryIPs.update(12345, {
   *   name: "new-name",
   *   auto_delete: false,
   * });
   * ```
   */
  update(
    id: number,
    params: UpdatePrimaryIPParams,
    options?: RequestOptions,
  ): Promise<UpdatePrimaryIPResponse> {
    return this._put(
      path`/primary_ips/${id}`,
      updatePrimaryIPResponseSchema,
      params,
      updatePrimaryIPRequestSchema,
      options,
    );
  }

  /**
   * Deletes a Primary IP. If it is assigned to a resource, it is unassigned first.
   *
   * @param id - ID of the Primary IP
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-delete-a-primary-ip
   *
   * @example
   * ```typescript
   * await client.primaryIPs.delete(12345);
   * ```
   */
  delete(id: number, options?: RequestOptions): Promise<void> {
    return this._delete(path`/primary_ips/${id}`, null, options);
  }

  /**
   * Returns a page of actions of a Primary IP.
   *
   * @param id - ID of the Primary IP
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-list-actions-for-a-primary-ip
   *
   * @example
   * ```typescript
   * const { actions } = await client.primaryIPs.listActions(12345, {
   *   status: "running",
   *   sort: "started:desc",
   * });
   * ```
   */
  listActions(
    id: number,
    params?: ListPrimaryIPActionsParams,
    options?: RequestOptions,
  ): Promise<ListPrimaryIPActionsResponse> {
    return this._get(path`/primary_ips/${id}/actions`, listActionsResponseSchema, params, options);
  }

  /**
   * Returns a specific action of a Primary IP.
   *
   * @param id - ID of the Primary IP
   * @param actionId - ID of the action
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-get-an-action-for-a-primary-ip
   *
   * @example
   * ```typescript
   * const { action } = await client.primaryIPs.getAction(12345, 67890);
   * console.log(action.status);
   * ```
   */
  getAction(
    id: number,
    actionId: number,
    options?: RequestOptions,
  ): Promise<GetPrimaryIPActionResponse> {
    return this._get(
      path`/primary_ips/${id}/actions/${actionId}`,
      getActionResponseSchema,
      undefined,
      options,
    );
  }

  /**
   * Assigns a Primary IP to a resource. A server must be powered off for this.
   *
   * @param id - ID of the Primary IP
   * @param params - ID and type of the resource to assign the Primary IP to
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-assign-a-primary-ip-to-a-resource
   *
   * @example
   * ```typescript
   * const { action } = await client.primaryIPs.assignToResource(12345, {
   *   assignee_id: 42,
   *   assignee_type: "server",
   * });
   * await client.actions.waitFor(action);
   * ```
   */
  assignToResource(
    id: number,
    params: AssignPrimaryIPToResourceParams,
    options?: RequestOptions,
  ): Promise<AssignPrimaryIPToResourceResponse> {
    return this._post(
      path`/primary_ips/${id}/actions/assign`,
      actionResponseSchema,
      params,
      assignPrimaryIPToResourceRequestSchema,
      options,
    );
  }

  /**
   * Unassigns a Primary IP from the resource it is assigned to. It can be
   * assigned again later.
   *
   * @param id - ID of the Primary IP
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-unassign-a-primary-ip-from-a-resource
   *
   * @example
   * ```typescript
   * const { action } = await client.primaryIPs.unassign(12345);
   * await client.actions.waitFor(action);
   * ```
   */
  unassign(id: number, options?: RequestOptions): Promise<UnassignPrimaryIPResponse> {
    return this._post(
      path`/primary_ips/${id}/actions/unassign`,
      actionResponseSchema,
      undefined,
      undefined,
      options,
    );
  }

  /**
   * Changes the hostname that appears when resolving the reverse DNS entry of
   * a Primary IP.
   *
   * @param id - ID of the Primary IP
   * @param params - IP address and hostname. A `dns_ptr` of `null` resets the entry to its default.
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-change-reverse-dns-records-for-a-primary-ip
   *
   * @example
   * ```typescript
   * const { action } = await client.primaryIPs.changeReverseDNS(12345, {
   *   ip: "131.232.99.1",
   *   dns_ptr: "server.example.com",
   * });
   * ```
   */
  changeReverseDNS(
    id: number,
    params: ChangePrimaryIPReverseDNSParams,
    options?: RequestOptions,
  ): Promise<ChangePrimaryIPReverseDNSResponse> {
    return this._post(
      path`/primary_ips/${id}/actions/change_dns_ptr`,
      actionResponseSchema,
      params,
      changePrimaryIPReverseDNSRequestSchema,
      options,
    );
  }

  /**
   * Changes the protection configuration of a Primary IP.
   *
   * @param id - ID of the Primary IP
   * @param params - Protection configuration
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-change-primary-ip-protection
   *
   * @example
   * ```typescript
   * const { action } = await client.primaryIPs.changeProtection(12345, { delete: true });
   * ```
   */
  changeProtection(
    id: number,
    params: ChangePrimaryIPProtectionParams,
    options?: RequestOptions,
  ): Promise<ChangePrimaryIPProtectionResponse> {
    return this._post(
      path`/primary_ips/${id}/actions/change_protection`,
      actionResponseSchema,
      params,
      changePrimaryIPProtectionRequestSchema,
      options,
    );
  }
}
