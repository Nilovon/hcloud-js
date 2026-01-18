/**
 * Hetzner Cloud Networks API
 * @see https://docs.hetzner.cloud/reference/cloud#networks
 */

import type { HCloudClient } from "@hcloud-js/client/index.js";
import type {
  ListNetworksParams,
  ListNetworksResponse,
  CreateNetworkParams,
  CreateNetworkResponse,
  GetNetworkResponse,
  UpdateNetworkParams,
  UpdateNetworkResponse,
  DeleteNetworkResponse,
  ListNetworkActionsParams,
  ListNetworkActionsResponse,
  GetNetworkActionResponse,
  AddNetworkRouteParams,
  AddNetworkRouteResponse,
  DeleteNetworkRouteParams,
  DeleteNetworkRouteResponse,
  AddNetworkSubnetParams,
  AddNetworkSubnetResponse,
  DeleteNetworkSubnetParams,
  DeleteNetworkSubnetResponse,
  ChangeNetworkIpRangeParams,
  ChangeNetworkIpRangeResponse,
  ChangeNetworkProtectionParams,
  ChangeNetworkProtectionResponse,
} from "@hcloud-js/apis/networks/types.js";
import { validate } from "@hcloud-js/validation/index.js";
import {
  listNetworksResponseSchema,
  createNetworkRequestSchema,
  createNetworkResponseSchema,
  getNetworkResponseSchema,
  updateNetworkRequestSchema,
  updateNetworkResponseSchema,
  deleteNetworkResponseSchema,
  listNetworkActionsResponseSchema,
  getNetworkActionResponseSchema,
  addNetworkRouteRequestSchema,
  addNetworkRouteResponseSchema,
  deleteNetworkRouteRequestSchema,
  deleteNetworkRouteResponseSchema,
  addNetworkSubnetRequestSchema,
  addNetworkSubnetResponseSchema,
  deleteNetworkSubnetRequestSchema,
  deleteNetworkSubnetResponseSchema,
  changeNetworkIpRangeRequestSchema,
  changeNetworkIpRangeResponseSchema,
  changeNetworkProtectionRequestSchema,
  changeNetworkProtectionResponseSchema,
} from "@hcloud-js/apis/networks/schemas.js";

/**
 * Networks API client
 */
export class NetworksClient {
  constructor(private readonly client: HCloudClient) {}

  /**
   * Returns all Network objects.
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of networks with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#networks-list-networks
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all networks
   * const result = await client.networks.list();
   *
   * // List networks with filters
   * const networks = await client.networks.list({
   *   name: 'my-network',
   *   label_selector: 'environment=production',
   *   sort: ['name:asc'],
   *   page: 1,
   *   per_page: 50
   * });
   * ```
   */
  async list(params?: ListNetworksParams): Promise<ListNetworksResponse> {
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

    const response = await this.client.get<unknown>("/networks", queryParams);

    return validate(listNetworksResponseSchema, response, {
      context: "List networks response",
      detailed: true,
    });
  }

  /**
   * Creates a new Network.
   *
   * @param params - Parameters for creating the network
   * @returns Promise resolving to the created network and action
   * @see https://docs.hetzner.cloud/reference/cloud#networks-create-a-network
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Create a network
   * const network = await client.networks.create({
   *   name: 'my-network',
   *   ip_range: '10.0.0.0/16',
   *   subnets: [{
   *     type: 'cloud',
   *     network_zone: 'eu-central'
   *   }],
   *   labels: { environment: 'production' }
   * });
   * ```
   */
  async create(params: CreateNetworkParams): Promise<CreateNetworkResponse> {
    const validatedParams = validate(createNetworkRequestSchema, params, {
      context: "Create network request",
      detailed: true,
    });

    const response = await this.client.post<unknown>("/networks", validatedParams);

    return validate(createNetworkResponseSchema, response, {
      context: "Create network response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Network object.
   *
   * @param id - ID of the Network
   * @returns Promise resolving to the network
   * @see https://docs.hetzner.cloud/reference/cloud#networks-get-a-network
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get a network by ID
   * const network = await client.networks.get(12345);
   * console.log(network.network.name);
   * ```
   */
  async get(id: number): Promise<GetNetworkResponse> {
    const response = await this.client.get<unknown>(`/networks/${id}`);

    return validate(getNetworkResponseSchema, response, {
      context: "Get network response",
      detailed: true,
    });
  }

  /**
   * Updates the Network.
   *
   * You can update a Network's name, labels, and expose_routes_to_vswitch.
   *
   * @param id - ID of the Network
   * @param params - Parameters to update (name, labels, and/or expose_routes_to_vswitch)
   * @returns Promise resolving to the updated network
   * @see https://docs.hetzner.cloud/reference/cloud#networks-update-a-network
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Update network name
   * const updated = await client.networks.update(12345, {
   *   name: 'new-network-name'
   * });
   *
   * // Update labels
   * const updated = await client.networks.update(12345, {
   *   labels: { environment: 'production', team: 'backend' }
   * });
   * ```
   */
  async update(id: number, params: UpdateNetworkParams): Promise<UpdateNetworkResponse> {
    const validatedParams = validate(updateNetworkRequestSchema, params, {
      context: "Update network request",
      detailed: true,
    });

    const response = await this.client.put<unknown>(`/networks/${id}`, validatedParams);

    return validate(updateNetworkResponseSchema, response, {
      context: "Update network response",
      detailed: true,
    });
  }

  /**
   * Deletes a Network.
   *
   * @param id - ID of the Network
   * @returns Promise resolving to empty object
   * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-network
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Delete a network
   * await client.networks.delete(12345);
   * ```
   */
  async delete(id: number): Promise<DeleteNetworkResponse> {
    const response = await this.client.delete<unknown>(`/networks/${id}`);

    return validate(deleteNetworkResponseSchema, response, {
      context: "Delete network response",
      detailed: true,
    });
  }

  /**
   * Returns all Action objects for a Network.
   *
   * @param id - ID of the Network
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of actions with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#networks-list-actions-for-a-network
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all actions for a network
   * const actions = await client.networks.listActions(12345);
   *
   * // List actions with filters
   * const runningActions = await client.networks.listActions(12345, {
   *   status: ['running'],
   *   sort: ['started:desc']
   * });
   * ```
   */
  async listActions(
    id: number,
    params?: ListNetworkActionsParams,
  ): Promise<ListNetworkActionsResponse> {
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

    const response = await this.client.get<unknown>(`/networks/${id}/actions`, queryParams);

    return validate(listNetworkActionsResponseSchema, response, {
      context: "List network actions response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Action object for a Network.
   *
   * @param id - ID of the Network
   * @param actionId - ID of the Action
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#networks-get-an-action-for-a-network
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get an action by ID
   * const action = await client.networks.getAction(12345, 67890);
   * console.log(action.action.command);
   * ```
   */
  async getAction(id: number, actionId: number): Promise<GetNetworkActionResponse> {
    const response = await this.client.get<unknown>(`/networks/${id}/actions/${actionId}`);

    return validate(getNetworkActionResponseSchema, response, {
      context: "Get network action response",
      detailed: true,
    });
  }

  /**
   * Adds a route to a Network.
   *
   * @param id - ID of the Network
   * @param params - Route configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#networks-add-a-route-to-a-network
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.networks.addRoute(12345, {
   *   destination: '10.0.1.0/24',
   *   gateway: '10.0.0.1'
   * });
   * ```
   */
  async addRoute(id: number, params: AddNetworkRouteParams): Promise<AddNetworkRouteResponse> {
    const validatedParams = validate(addNetworkRouteRequestSchema, params, {
      context: "Add network route request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/networks/${id}/actions/add_route`,
      validatedParams,
    );

    return validate(addNetworkRouteResponseSchema, response, {
      context: "Add network route response",
      detailed: true,
    });
  }

  /**
   * Deletes a route from a Network.
   *
   * @param id - ID of the Network
   * @param params - Route to delete
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-route-from-a-network
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.networks.deleteRoute(12345, {
   *   destination: '10.0.1.0/24',
   *   gateway: '10.0.0.1'
   * });
   * ```
   */
  async deleteRoute(
    id: number,
    params: DeleteNetworkRouteParams,
  ): Promise<DeleteNetworkRouteResponse> {
    const validatedParams = validate(deleteNetworkRouteRequestSchema, params, {
      context: "Delete network route request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/networks/${id}/actions/delete_route`,
      validatedParams,
    );

    return validate(deleteNetworkRouteResponseSchema, response, {
      context: "Delete network route response",
      detailed: true,
    });
  }

  /**
   * Adds a subnet to a Network.
   *
   * @param id - ID of the Network
   * @param params - Subnet configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#networks-add-a-subnet-to-a-network
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.networks.addSubnet(12345, {
   *   type: 'cloud',
   *   network_zone: 'eu-central',
   *   ip_range: '10.0.1.0/24'
   * });
   * ```
   */
  async addSubnet(
    id: number,
    params: AddNetworkSubnetParams,
  ): Promise<AddNetworkSubnetResponse> {
    const validatedParams = validate(addNetworkSubnetRequestSchema, params, {
      context: "Add network subnet request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/networks/${id}/actions/add_subnet`,
      validatedParams,
    );

    return validate(addNetworkSubnetResponseSchema, response, {
      context: "Add network subnet response",
      detailed: true,
    });
  }

  /**
   * Deletes a subnet from a Network.
   *
   * @param id - ID of the Network
   * @param params - Subnet to delete
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-subnet-from-a-network
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.networks.deleteSubnet(12345, {
   *   ip_range: '10.0.1.0/24'
   * });
   * ```
   */
  async deleteSubnet(
    id: number,
    params: DeleteNetworkSubnetParams,
  ): Promise<DeleteNetworkSubnetResponse> {
    const validatedParams = validate(deleteNetworkSubnetRequestSchema, params, {
      context: "Delete network subnet request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/networks/${id}/actions/delete_subnet`,
      validatedParams,
    );

    return validate(deleteNetworkSubnetResponseSchema, response, {
      context: "Delete network subnet response",
      detailed: true,
    });
  }

  /**
   * Changes the IP range of a Network.
   *
   * @param id - ID of the Network
   * @param params - New IP range
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#networks-change-ip-range-of-a-network
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.networks.changeIpRange(12345, {
   *   ip_range: '10.0.0.0/16'
   * });
   * ```
   */
  async changeIpRange(
    id: number,
    params: ChangeNetworkIpRangeParams,
  ): Promise<ChangeNetworkIpRangeResponse> {
    const validatedParams = validate(changeNetworkIpRangeRequestSchema, params, {
      context: "Change network IP range request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/networks/${id}/actions/change_ip_range`,
      validatedParams,
    );

    return validate(changeNetworkIpRangeResponseSchema, response, {
      context: "Change network IP range response",
      detailed: true,
    });
  }

  /**
   * Changes the Protection configuration of a Network.
   *
   * @param id - ID of the Network
   * @param params - Protection configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#networks-change-network-protection
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Enable delete protection
   * const result = await client.networks.changeProtection(12345, {
   *   delete: true
   * });
   * ```
   */
  async changeProtection(
    id: number,
    params: ChangeNetworkProtectionParams,
  ): Promise<ChangeNetworkProtectionResponse> {
    const validatedParams = validate(changeNetworkProtectionRequestSchema, params, {
      context: "Change network protection request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/networks/${id}/actions/change_protection`,
      validatedParams,
    );

    return validate(changeNetworkProtectionResponseSchema, response, {
      context: "Change network protection response",
      detailed: true,
    });
  }
}
