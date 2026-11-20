/**
 * Hetzner Cloud Networks API
 * @see https://docs.hetzner.cloud/reference/cloud#networks
 */

import { ResourceActionsClient } from "../actions/index";
import {
  actionResponseSchema,
  getActionResponseSchema,
  listActionsResponseSchema,
} from "../actions/schemas";
import { iteratePages } from "../../core/pagination";
import { NamedResource, path } from "../../core/resource";
import type { RequestOptions } from "../../core/types";
import {
  addNetworkRouteRequestSchema,
  addNetworkSubnetRequestSchema,
  changeNetworkIpRangeRequestSchema,
  changeNetworkProtectionRequestSchema,
  createNetworkRequestSchema,
  createNetworkResponseSchema,
  deleteNetworkRouteRequestSchema,
  deleteNetworkSubnetRequestSchema,
  getNetworkResponseSchema,
  listNetworkMembersResponseSchema,
  listNetworksResponseSchema,
  updateNetworkRequestSchema,
  updateNetworkResponseSchema,
} from "./schemas";
import type {
  AddNetworkRouteParams,
  AddNetworkRouteResponse,
  AddNetworkSubnetParams,
  AddNetworkSubnetResponse,
  ChangeNetworkIpRangeParams,
  ChangeNetworkIpRangeResponse,
  ChangeNetworkProtectionParams,
  ChangeNetworkProtectionResponse,
  CreateNetworkParams,
  CreateNetworkResponse,
  DeleteNetworkRouteParams,
  DeleteNetworkRouteResponse,
  DeleteNetworkSubnetParams,
  DeleteNetworkSubnetResponse,
  GetNetworkActionResponse,
  GetNetworkResponse,
  ListNetworkActionsParams,
  ListNetworkActionsResponse,
  ListNetworkMembersParams,
  ListNetworkMembersResponse,
  ListNetworksParams,
  ListNetworksResponse,
  Network,
  NetworkMember,
  UpdateNetworkParams,
  UpdateNetworkResponse,
} from "./types";

/**
 * Networks API client
 *
 * Networks are private networks servers and load balancers can be attached to.
 * A network consists of subnets (IP ranges resources get their IPs from) and
 * routes.
 *
 * In addition to the methods below, the pagination helpers `iterate()`,
 * `iteratePages()`, `listAll()` and `first()` as well as `getByName()` are
 * available.
 *
 * @see https://docs.hetzner.cloud/reference/cloud#networks
 */
export class NetworksClient extends NamedResource<Network, ListNetworksParams, "networks"> {
  protected readonly itemsKey = "networks";

  /**
   * Actions of all networks: `list()`, `get()`, `waitFor()` and `waitForAll()`.
   *
   * @example
   * ```typescript
   * const { actions } = await client.networks.actions.list({ status: "running" });
   * ```
   */
  public readonly actions = new ResourceActionsClient(this.client, "/networks");

  /**
   * Returns a page of networks.
   *
   * @param params - Filters and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#networks-list-networks
   *
   * @example
   * ```typescript
   * const { networks } = await client.networks.list({ label_selector: "environment=production" });
   *
   * // All networks across all pages
   * const all = await client.networks.listAll();
   * ```
   */
  list(params?: ListNetworksParams, options?: RequestOptions): Promise<ListNetworksResponse> {
    return this._get("/networks", listNetworksResponseSchema, params, options);
  }

  /**
   * Returns a specific network.
   *
   * @param id - ID of the network
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#networks-get-a-network
   *
   * @example
   * ```typescript
   * const { network } = await client.networks.get(12345);
   * console.log(network.ip_range);
   * ```
   */
  get(id: number, options?: RequestOptions): Promise<GetNetworkResponse> {
    return this._get(path`/networks/${id}`, getNetworkResponseSchema, undefined, options);
  }

  /**
   * Creates a new network.
   *
   * @param params - Name, IP range and optional subnets, routes and labels
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#networks-create-a-network
   *
   * @example
   * ```typescript
   * const { network } = await client.networks.create({
   *   name: "my-network",
   *   ip_range: "10.0.0.0/16",
   *   subnets: [{ type: "cloud", network_zone: "eu-central", ip_range: "10.0.1.0/24" }],
   * });
   * ```
   */
  create(params: CreateNetworkParams, options?: RequestOptions): Promise<CreateNetworkResponse> {
    return this._post(
      "/networks",
      createNetworkResponseSchema,
      params,
      createNetworkRequestSchema,
      options,
    );
  }

  /**
   * Updates the name, labels and/or `expose_routes_to_vswitch` of a network.
   *
   * @param id - ID of the network
   * @param params - Fields to update
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#networks-update-a-network
   *
   * @example
   * ```typescript
   * const { network } = await client.networks.update(12345, {
   *   name: "new-name",
   *   labels: { environment: "production" },
   * });
   * ```
   */
  update(
    id: number,
    params: UpdateNetworkParams,
    options?: RequestOptions,
  ): Promise<UpdateNetworkResponse> {
    return this._put(
      path`/networks/${id}`,
      updateNetworkResponseSchema,
      params,
      updateNetworkRequestSchema,
      options,
    );
  }

  /**
   * Deletes a network. Attached servers and load balancers are detached first.
   *
   * @param id - ID of the network
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-network
   *
   * @example
   * ```typescript
   * await client.networks.delete(12345);
   * ```
   */
  delete(id: number, options?: RequestOptions): Promise<void> {
    return this._delete(path`/networks/${id}`, null, options);
  }

  /**
   * Returns a page of members of a network: the servers and load balancers
   * attached to it, with their IPs, subnet and attachment status.
   *
   * @param id - ID of the network
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#networks
   *
   * @example
   * ```typescript
   * const { members } = await client.networks.listMembers(12345, {
   *   type: "server",
   *   sort: "ip:asc",
   * });
   * ```
   */
  listMembers(
    id: number,
    params?: ListNetworkMembersParams,
    options?: RequestOptions,
  ): Promise<ListNetworkMembersResponse> {
    return this._get(
      path`/networks/${id}/members`,
      listNetworkMembersResponseSchema,
      params,
      options,
    );
  }

  /**
   * Iterates over all members of a network, transparently fetching page after page.
   *
   * @param id - ID of the network
   * @param params - Same filters as `listMembers()`
   * @param options - Request options applied to every page request
   *
   * @example
   * ```typescript
   * for await (const member of client.networks.iterateMembers(12345, { status: "error" })) {
   *   console.log(member.type, member.id, member.ip);
   * }
   * ```
   */
  async *iterateMembers(
    id: number,
    params?: ListNetworkMembersParams,
    options?: RequestOptions,
  ): AsyncGenerator<NetworkMember, void, undefined> {
    const pages = iteratePages(
      (pageParams: ListNetworkMembersParams) => this.listMembers(id, pageParams, options),
      params,
    );
    for await (const page of pages) {
      yield* page.members;
    }
  }

  /**
   * Fetches all members of a network across all pages.
   *
   * @param id - ID of the network
   * @param params - Same filters as `listMembers()`
   * @param options - Request options applied to every page request
   *
   * @example
   * ```typescript
   * const loadBalancers = await client.networks.listAllMembers(12345, { type: "load_balancer" });
   * ```
   */
  async listAllMembers(
    id: number,
    params?: ListNetworkMembersParams,
    options?: RequestOptions,
  ): Promise<NetworkMember[]> {
    const members: NetworkMember[] = [];
    for await (const member of this.iterateMembers(id, params, options)) {
      members.push(member);
    }
    return members;
  }

  /**
   * Returns a page of actions of a network.
   *
   * @param id - ID of the network
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#networks-list-actions-for-a-network
   *
   * @example
   * ```typescript
   * const { actions } = await client.networks.listActions(12345, {
   *   status: "running",
   *   sort: "started:desc",
   * });
   * ```
   */
  listActions(
    id: number,
    params?: ListNetworkActionsParams,
    options?: RequestOptions,
  ): Promise<ListNetworkActionsResponse> {
    return this._get(path`/networks/${id}/actions`, listActionsResponseSchema, params, options);
  }

  /**
   * Returns a specific action of a network.
   *
   * @param id - ID of the network
   * @param actionId - ID of the action
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#networks-get-an-action-for-a-network
   *
   * @example
   * ```typescript
   * const { action } = await client.networks.getAction(12345, 67890);
   * console.log(action.status);
   * ```
   */
  getAction(
    id: number,
    actionId: number,
    options?: RequestOptions,
  ): Promise<GetNetworkActionResponse> {
    return this._get(
      path`/networks/${id}/actions/${actionId}`,
      getActionResponseSchema,
      undefined,
      options,
    );
  }

  /**
   * Adds a route to a network.
   *
   * @param id - ID of the network
   * @param params - Destination and gateway of the route
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#networks-add-a-route-to-a-network
   *
   * @example
   * ```typescript
   * const { action } = await client.networks.addRoute(12345, {
   *   destination: "10.100.1.0/24",
   *   gateway: "10.0.1.1",
   * });
   * await client.actions.waitFor(action);
   * ```
   */
  addRoute(
    id: number,
    params: AddNetworkRouteParams,
    options?: RequestOptions,
  ): Promise<AddNetworkRouteResponse> {
    return this._post(
      path`/networks/${id}/actions/add_route`,
      actionResponseSchema,
      params,
      addNetworkRouteRequestSchema,
      options,
    );
  }

  /**
   * Deletes a route from a network.
   *
   * @param id - ID of the network
   * @param params - Destination and gateway of the route to delete
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-route-from-a-network
   *
   * @example
   * ```typescript
   * const { action } = await client.networks.deleteRoute(12345, {
   *   destination: "10.100.1.0/24",
   *   gateway: "10.0.1.1",
   * });
   * ```
   */
  deleteRoute(
    id: number,
    params: DeleteNetworkRouteParams,
    options?: RequestOptions,
  ): Promise<DeleteNetworkRouteResponse> {
    return this._post(
      path`/networks/${id}/actions/delete_route`,
      actionResponseSchema,
      params,
      deleteNetworkRouteRequestSchema,
      options,
    );
  }

  /**
   * Adds a subnet to a network. If `ip_range` is omitted, the API picks a free range.
   *
   * @param id - ID of the network
   * @param params - Subnet type, network zone and optional IP range / vSwitch ID
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#networks-add-a-subnet-to-a-network
   *
   * @example
   * ```typescript
   * const { action } = await client.networks.addSubnet(12345, {
   *   type: "cloud",
   *   network_zone: "eu-central",
   *   ip_range: "10.0.2.0/24",
   * });
   * ```
   */
  addSubnet(
    id: number,
    params: AddNetworkSubnetParams,
    options?: RequestOptions,
  ): Promise<AddNetworkSubnetResponse> {
    return this._post(
      path`/networks/${id}/actions/add_subnet`,
      actionResponseSchema,
      params,
      addNetworkSubnetRequestSchema,
      options,
    );
  }

  /**
   * Deletes a subnet from a network. No resources may be attached to the subnet.
   *
   * @param id - ID of the network
   * @param params - IP range of the subnet to delete
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-subnet-from-a-network
   *
   * @example
   * ```typescript
   * const { action } = await client.networks.deleteSubnet(12345, { ip_range: "10.0.2.0/24" });
   * ```
   */
  deleteSubnet(
    id: number,
    params: DeleteNetworkSubnetParams,
    options?: RequestOptions,
  ): Promise<DeleteNetworkSubnetResponse> {
    return this._post(
      path`/networks/${id}/actions/delete_subnet`,
      actionResponseSchema,
      params,
      deleteNetworkSubnetRequestSchema,
      options,
    );
  }

  /**
   * Changes the IP range of a network. The range can only be extended, not shrunk.
   *
   * @param id - ID of the network
   * @param params - New IP range of the whole network
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#networks-change-ip-range-of-a-network
   *
   * @example
   * ```typescript
   * const { action } = await client.networks.changeIpRange(12345, { ip_range: "10.0.0.0/12" });
   * ```
   */
  changeIpRange(
    id: number,
    params: ChangeNetworkIpRangeParams,
    options?: RequestOptions,
  ): Promise<ChangeNetworkIpRangeResponse> {
    return this._post(
      path`/networks/${id}/actions/change_ip_range`,
      actionResponseSchema,
      params,
      changeNetworkIpRangeRequestSchema,
      options,
    );
  }

  /**
   * Changes the protection configuration of a network.
   *
   * @param id - ID of the network
   * @param params - Protection configuration
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#networks-change-network-protection
   *
   * @example
   * ```typescript
   * const { action } = await client.networks.changeProtection(12345, { delete: true });
   * ```
   */
  changeProtection(
    id: number,
    params: ChangeNetworkProtectionParams,
    options?: RequestOptions,
  ): Promise<ChangeNetworkProtectionResponse> {
    return this._post(
      path`/networks/${id}/actions/change_protection`,
      actionResponseSchema,
      params,
      changeNetworkProtectionRequestSchema,
      options,
    );
  }
}
