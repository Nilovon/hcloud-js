/**
 * Hetzner Cloud Floating IPs API
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips
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
  assignFloatingIPToServerRequestSchema,
  changeFloatingIPProtectionRequestSchema,
  changeFloatingIPReverseDNSRequestSchema,
  createFloatingIPRequestSchema,
  createFloatingIPResponseSchema,
  getFloatingIPResponseSchema,
  listFloatingIPsResponseSchema,
  updateFloatingIPRequestSchema,
  updateFloatingIPResponseSchema,
} from "./schemas";
import type {
  AssignFloatingIPToServerParams,
  AssignFloatingIPToServerResponse,
  ChangeFloatingIPProtectionParams,
  ChangeFloatingIPProtectionResponse,
  ChangeFloatingIPReverseDNSParams,
  ChangeFloatingIPReverseDNSResponse,
  CreateFloatingIPParams,
  CreateFloatingIPResponse,
  FloatingIP,
  GetFloatingIPActionResponse,
  GetFloatingIPResponse,
  ListFloatingIPActionsParams,
  ListFloatingIPActionsResponse,
  ListFloatingIPsParams,
  ListFloatingIPsResponse,
  UnassignFloatingIPResponse,
  UpdateFloatingIPParams,
  UpdateFloatingIPResponse,
} from "./types";

/**
 * Floating IPs API client
 *
 * Floating IPs are additional public IPs that can be moved between servers of
 * the same network zone.
 *
 * In addition to the methods below, the pagination helpers `iterate()`,
 * `iteratePages()`, `listAll()` and `first()` as well as `getByName()` are
 * available.
 *
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips
 */
export class FloatingIPsClient extends NamedResource<
  FloatingIP,
  ListFloatingIPsParams,
  "floating_ips"
> {
  protected readonly itemsKey = "floating_ips";

  /**
   * Actions of all Floating IPs (`GET /floating_ips/actions`), including
   * `waitFor()` and `waitForAll()`.
   *
   * @example
   * ```typescript
   * const { actions } = await client.floatingIPs.actions.list({ status: "running" });
   * ```
   */
  public readonly actions = new ResourceActionsClient(this.client, "/floating_ips");

  /**
   * Returns a page of Floating IPs.
   *
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-list-floating-ips
   *
   * @example
   * ```typescript
   * const { floating_ips } = await client.floatingIPs.list({
   *   label_selector: "environment=production",
   *   sort: "created:desc",
   * });
   *
   * // All Floating IPs across all pages
   * const all = await client.floatingIPs.listAll();
   * ```
   */
  list(params?: ListFloatingIPsParams, options?: RequestOptions): Promise<ListFloatingIPsResponse> {
    return this._get("/floating_ips", listFloatingIPsResponseSchema, params, options);
  }

  /**
   * Returns a specific Floating IP.
   *
   * @param id - ID of the Floating IP
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-get-a-floating-ip
   *
   * @example
   * ```typescript
   * const { floating_ip } = await client.floatingIPs.get(12345);
   * console.log(floating_ip.ip, floating_ip.home_location.name);
   * ```
   */
  get(id: number, options?: RequestOptions): Promise<GetFloatingIPResponse> {
    return this._get(path`/floating_ips/${id}`, getFloatingIPResponseSchema, undefined, options);
  }

  /**
   * Finds a Floating IP by its IP address.
   *
   * The API has no filter for the address, so all Floating IPs are fetched page
   * by page until a match is found. IPv6 Floating IPs are matched by their
   * network, e.g. `2001:db8::/64`.
   *
   * @param ip - IP address (IPv4) or network (IPv6) of the Floating IP
   * @param options - Request options
   * @returns The Floating IP, or `undefined` if none matches
   *
   * @example
   * ```typescript
   * const floatingIP = await client.floatingIPs.getByIP("131.232.99.1");
   * ```
   */
  async getByIP(ip: string, options?: RequestOptions): Promise<FloatingIP | undefined> {
    for await (const floatingIP of this.iterate(undefined, options)) {
      if (floatingIP.ip === ip) return floatingIP;
    }
    return undefined;
  }

  /**
   * Creates a new Floating IP, optionally assigned to a server.
   *
   * The returned `action` is only set if the Floating IP is assigned to a
   * server on creation.
   *
   * @param params - Type and either `home_location` or `server`
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-create-a-floating-ip
   *
   * @example
   * ```typescript
   * const { floating_ip } = await client.floatingIPs.create({
   *   type: "ipv4",
   *   home_location: "fsn1",
   *   name: "web-frontend",
   * });
   * ```
   */
  create(
    params: CreateFloatingIPParams,
    options?: RequestOptions,
  ): Promise<CreateFloatingIPResponse> {
    return this._post(
      "/floating_ips",
      createFloatingIPResponseSchema,
      params,
      createFloatingIPRequestSchema,
      options,
    );
  }

  /**
   * Updates the name, description and/or labels of a Floating IP.
   *
   * @param id - ID of the Floating IP
   * @param params - Fields to update
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-update-a-floating-ip
   *
   * @example
   * ```typescript
   * const { floating_ip } = await client.floatingIPs.update(12345, {
   *   description: "Web Frontend",
   *   labels: { environment: "production" },
   * });
   * ```
   */
  update(
    id: number,
    params: UpdateFloatingIPParams,
    options?: RequestOptions,
  ): Promise<UpdateFloatingIPResponse> {
    return this._put(
      path`/floating_ips/${id}`,
      updateFloatingIPResponseSchema,
      params,
      updateFloatingIPRequestSchema,
      options,
    );
  }

  /**
   * Deletes a Floating IP. If it is assigned to a server, it is unassigned first.
   *
   * @param id - ID of the Floating IP
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-delete-a-floating-ip
   *
   * @example
   * ```typescript
   * await client.floatingIPs.delete(12345);
   * ```
   */
  delete(id: number, options?: RequestOptions): Promise<void> {
    return this._delete(path`/floating_ips/${id}`, null, options);
  }

  /**
   * Returns a page of actions of a Floating IP.
   *
   * @param id - ID of the Floating IP
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-list-actions-for-a-floating-ip
   *
   * @example
   * ```typescript
   * const { actions } = await client.floatingIPs.listActions(12345, {
   *   status: "running",
   *   sort: "started:desc",
   * });
   * ```
   */
  listActions(
    id: number,
    params?: ListFloatingIPActionsParams,
    options?: RequestOptions,
  ): Promise<ListFloatingIPActionsResponse> {
    return this._get(path`/floating_ips/${id}/actions`, listActionsResponseSchema, params, options);
  }

  /**
   * Returns a specific action of a Floating IP.
   *
   * @param id - ID of the Floating IP
   * @param actionId - ID of the action
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-get-an-action-for-a-floating-ip
   *
   * @example
   * ```typescript
   * const { action } = await client.floatingIPs.getAction(12345, 67890);
   * console.log(action.status);
   * ```
   */
  getAction(
    id: number,
    actionId: number,
    options?: RequestOptions,
  ): Promise<GetFloatingIPActionResponse> {
    return this._get(
      path`/floating_ips/${id}/actions/${actionId}`,
      getActionResponseSchema,
      undefined,
      options,
    );
  }

  /**
   * Assigns a Floating IP to a server.
   *
   * @param id - ID of the Floating IP
   * @param params - Server to assign the Floating IP to
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-assign-a-floating-ip-to-a-server
   *
   * @example
   * ```typescript
   * const { action } = await client.floatingIPs.assignToServer(12345, { server: 42 });
   * await client.actions.waitFor(action);
   * ```
   */
  assignToServer(
    id: number,
    params: AssignFloatingIPToServerParams,
    options?: RequestOptions,
  ): Promise<AssignFloatingIPToServerResponse> {
    return this._post(
      path`/floating_ips/${id}/actions/assign`,
      actionResponseSchema,
      params,
      assignFloatingIPToServerRequestSchema,
      options,
    );
  }

  /**
   * Unassigns a Floating IP, making it unreachable. It can be assigned to a
   * server again later.
   *
   * @param id - ID of the Floating IP
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-unassign-a-floating-ip
   *
   * @example
   * ```typescript
   * const { action } = await client.floatingIPs.unassign(12345);
   * await client.actions.waitFor(action);
   * ```
   */
  unassign(id: number, options?: RequestOptions): Promise<UnassignFloatingIPResponse> {
    return this._post(
      path`/floating_ips/${id}/actions/unassign`,
      actionResponseSchema,
      undefined,
      undefined,
      options,
    );
  }

  /**
   * Changes the hostname that appears when resolving the reverse DNS entry of
   * a Floating IP.
   *
   * @param id - ID of the Floating IP
   * @param params - IP address and hostname. A `dns_ptr` of `null` resets the entry to its default.
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-change-reverse-dns-records-for-a-floating-ip
   *
   * @example
   * ```typescript
   * const { action } = await client.floatingIPs.changeReverseDNS(12345, {
   *   ip: "131.232.99.1",
   *   dns_ptr: "server.example.com",
   * });
   * ```
   */
  changeReverseDNS(
    id: number,
    params: ChangeFloatingIPReverseDNSParams,
    options?: RequestOptions,
  ): Promise<ChangeFloatingIPReverseDNSResponse> {
    return this._post(
      path`/floating_ips/${id}/actions/change_dns_ptr`,
      actionResponseSchema,
      params,
      changeFloatingIPReverseDNSRequestSchema,
      options,
    );
  }

  /**
   * Changes the protection configuration of a Floating IP.
   *
   * @param id - ID of the Floating IP
   * @param params - Protection configuration
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-change-floating-ip-protection
   *
   * @example
   * ```typescript
   * const { action } = await client.floatingIPs.changeProtection(12345, { delete: true });
   * ```
   */
  changeProtection(
    id: number,
    params: ChangeFloatingIPProtectionParams,
    options?: RequestOptions,
  ): Promise<ChangeFloatingIPProtectionResponse> {
    return this._post(
      path`/floating_ips/${id}/actions/change_protection`,
      actionResponseSchema,
      params,
      changeFloatingIPProtectionRequestSchema,
      options,
    );
  }
}
