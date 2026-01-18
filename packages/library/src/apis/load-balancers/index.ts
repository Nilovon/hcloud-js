/**
 * Hetzner Cloud Load Balancers API
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers
 */

import type { HCloudClient } from "@/client/index";
import type {
  ListLoadBalancersParams,
  ListLoadBalancersResponse,
  CreateLoadBalancerParams,
  CreateLoadBalancerResponse,
  GetLoadBalancerResponse,
  UpdateLoadBalancerParams,
  UpdateLoadBalancerResponse,
  DeleteLoadBalancerResponse,
  ListLoadBalancerActionsParams,
  ListLoadBalancerActionsResponse,
  GetLoadBalancerActionResponse,
  AddLoadBalancerServiceParams,
  AddLoadBalancerServiceResponse,
  UpdateLoadBalancerServiceParams,
  UpdateLoadBalancerServiceResponse,
  DeleteLoadBalancerServiceResponse,
  AddLoadBalancerTargetParams,
  AddLoadBalancerTargetResponse,
  RemoveLoadBalancerTargetParams,
  RemoveLoadBalancerTargetResponse,
  ChangeLoadBalancerAlgorithmParams,
  ChangeLoadBalancerAlgorithmResponse,
  ChangeLoadBalancerReverseDNSParams,
  ChangeLoadBalancerReverseDNSResponse,
  ChangeLoadBalancerProtectionParams,
  ChangeLoadBalancerProtectionResponse,
  ChangeLoadBalancerTypeParams,
  ChangeLoadBalancerTypeResponse,
  AttachLoadBalancerToNetworkParams,
  AttachLoadBalancerToNetworkResponse,
  DetachLoadBalancerFromNetworkResponse,
  EnableLoadBalancerPublicInterfaceResponse,
  DisableLoadBalancerPublicInterfaceResponse,
  GetLoadBalancerMetricsParams,
  GetLoadBalancerMetricsResponse,
} from "@/apis/load-balancers/types";
import { validate } from "@/validation/index";
import {
  listLoadBalancersResponseSchema,
  createLoadBalancerRequestSchema,
  createLoadBalancerResponseSchema,
  getLoadBalancerResponseSchema,
  updateLoadBalancerRequestSchema,
  updateLoadBalancerResponseSchema,
  deleteLoadBalancerResponseSchema,
  listLoadBalancerActionsResponseSchema,
  getLoadBalancerActionResponseSchema,
  addLoadBalancerServiceRequestSchema,
  addLoadBalancerServiceResponseSchema,
  updateLoadBalancerServiceRequestSchema,
  updateLoadBalancerServiceResponseSchema,
  deleteLoadBalancerServiceRequestSchema,
  deleteLoadBalancerServiceResponseSchema,
  addLoadBalancerTargetRequestSchema,
  addLoadBalancerTargetResponseSchema,
  removeLoadBalancerTargetRequestSchema,
  removeLoadBalancerTargetResponseSchema,
  changeLoadBalancerAlgorithmRequestSchema,
  changeLoadBalancerAlgorithmResponseSchema,
  changeLoadBalancerReverseDNSRequestSchema,
  changeLoadBalancerReverseDNSResponseSchema,
  changeLoadBalancerProtectionRequestSchema,
  changeLoadBalancerProtectionResponseSchema,
  changeLoadBalancerTypeRequestSchema,
  changeLoadBalancerTypeResponseSchema,
  attachLoadBalancerToNetworkRequestSchema,
  attachLoadBalancerToNetworkResponseSchema,
  detachLoadBalancerFromNetworkRequestSchema,
  detachLoadBalancerFromNetworkResponseSchema,
  enableLoadBalancerPublicInterfaceRequestSchema,
  enableLoadBalancerPublicInterfaceResponseSchema,
  disableLoadBalancerPublicInterfaceRequestSchema,
  disableLoadBalancerPublicInterfaceResponseSchema,
  getLoadBalancerMetricsRequestSchema,
  getLoadBalancerMetricsResponseSchema,
} from "@/apis/load-balancers/schemas";

/**
 * Load Balancers API client
 */
export class LoadBalancersClient {
  constructor(private readonly client: HCloudClient) {}

  /**
   * Returns all Load Balancer objects.
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of load balancers with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-list-load-balancers
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all load balancers
   * const result = await client.loadBalancers.list();
   *
   * // List load balancers with filters
   * const loadBalancers = await client.loadBalancers.list({
   *   name: 'my-lb',
   *   label_selector: 'environment=production',
   *   sort: ['name:asc'],
   *   page: 1,
   *   per_page: 50
   * });
   * ```
   */
  async list(params?: ListLoadBalancersParams): Promise<ListLoadBalancersResponse> {
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

    const response = await this.client.get<unknown>("/load_balancers", queryParams);

    return validate(listLoadBalancersResponseSchema, response, {
      context: "List load balancers response",
      detailed: true,
    });
  }

  /**
   * Creates a new Load Balancer.
   *
   * @param params - Parameters for creating the load balancer
   * @returns Promise resolving to the created load balancer and action
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-create-a-load-balancer
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Create a load balancer
   * const lb = await client.loadBalancers.create({
   *   name: 'my-lb',
   *   load_balancer_type: 'lb11',
   *   location: 'nbg1',
   *   algorithm: { type: 'round_robin' },
   *   services: [{
   *     protocol: 'http',
   *     listen_port: 80,
   *     destination_port: 80,
   *     proxyprotocol: false,
   *     health_check: {
   *       protocol: 'http',
   *       port: 80,
   *       interval: 15,
   *       timeout: 10,
   *       retries: 3,
   *       http: {
   *         domain: null,
   *         path: '/',
   *         response: null,
   *         status_codes: null
   *       }
   *     }
   *   }]
   * });
   * ```
   */
  async create(params: CreateLoadBalancerParams): Promise<CreateLoadBalancerResponse> {
    const validatedParams = validate(createLoadBalancerRequestSchema, params, {
      context: "Create load balancer request",
      detailed: true,
    });

    const response = await this.client.post<unknown>("/load_balancers", validatedParams);

    return validate(createLoadBalancerResponseSchema, response, {
      context: "Create load balancer response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Load Balancer object.
   *
   * @param id - ID of the Load Balancer
   * @returns Promise resolving to the load balancer
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-get-a-load-balancer
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get a load balancer by ID
   * const lb = await client.loadBalancers.get(12345);
   * console.log(lb.load_balancer.name);
   * ```
   */
  async get(id: number): Promise<GetLoadBalancerResponse> {
    const response = await this.client.get<unknown>(`/load_balancers/${id}`);

    return validate(getLoadBalancerResponseSchema, response, {
      context: "Get load balancer response",
      detailed: true,
    });
  }

  /**
   * Updates the Load Balancer.
   *
   * You can update a Load Balancer's name and labels.
   *
   * @param id - ID of the Load Balancer
   * @param params - Parameters to update (name and/or labels)
   * @returns Promise resolving to the updated load balancer
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-update-a-load-balancer
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Update load balancer name
   * const updated = await client.loadBalancers.update(12345, {
   *   name: 'new-lb-name'
   * });
   *
   * // Update labels
   * const updated = await client.loadBalancers.update(12345, {
   *   labels: { environment: 'production', team: 'backend' }
   * });
   * ```
   */
  async update(
    id: number,
    params: UpdateLoadBalancerParams,
  ): Promise<UpdateLoadBalancerResponse> {
    const validatedParams = validate(updateLoadBalancerRequestSchema, params, {
      context: "Update load balancer request",
      detailed: true,
    });

    const response = await this.client.put<unknown>(`/load_balancers/${id}`, validatedParams);

    return validate(updateLoadBalancerResponseSchema, response, {
      context: "Update load balancer response",
      detailed: true,
    });
  }

  /**
   * Deletes a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @returns Promise resolving to the delete action
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-delete-a-load-balancer
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Delete a load balancer
   * const result = await client.loadBalancers.delete(12345);
   * if (result.action) {
   *   console.log(`Delete action ID: ${result.action.id}`);
   * }
   * ```
   */
  async delete(id: number): Promise<DeleteLoadBalancerResponse> {
    const response = await this.client.delete<unknown>(`/load_balancers/${id}`);

    return validate(deleteLoadBalancerResponseSchema, response, {
      context: "Delete load balancer response",
      detailed: true,
    });
  }

  /**
   * Returns all Action objects for a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of actions with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-list-actions-for-a-load-balancer
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all actions for a load balancer
   * const actions = await client.loadBalancers.listActions(12345);
   *
   * // List actions with filters
   * const runningActions = await client.loadBalancers.listActions(12345, {
   *   status: ['running'],
   *   sort: ['started:desc']
   * });
   * ```
   */
  async listActions(
    id: number,
    params?: ListLoadBalancerActionsParams,
  ): Promise<ListLoadBalancerActionsResponse> {
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

    const response = await this.client.get<unknown>(`/load_balancers/${id}/actions`, queryParams);

    return validate(listLoadBalancerActionsResponseSchema, response, {
      context: "List load balancer actions response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Action object for a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param actionId - ID of the Action
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-get-an-action-for-a-load-balancer
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get an action by ID
   * const action = await client.loadBalancers.getAction(12345, 67890);
   * console.log(action.action.command);
   * ```
   */
  async getAction(id: number, actionId: number): Promise<GetLoadBalancerActionResponse> {
    const response = await this.client.get<unknown>(`/load_balancers/${id}/actions/${actionId}`);

    return validate(getLoadBalancerActionResponseSchema, response, {
      context: "Get load balancer action response",
      detailed: true,
    });
  }

  /**
   * Adds a service to a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param params - Service configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-add-service
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.loadBalancers.addService(12345, {
   *   protocol: 'http',
   *   listen_port: 80,
   *   destination_port: 80,
   *   proxyprotocol: false,
   *   health_check: {
   *     protocol: 'http',
   *     port: 80,
   *     interval: 15,
   *     timeout: 10,
   *     retries: 3,
   *     http: {
   *       domain: null,
   *       path: '/',
   *       response: null,
   *       status_codes: null
   *     }
   *   }
   * });
   * ```
   */
  async addService(
    id: number,
    params: AddLoadBalancerServiceParams,
  ): Promise<AddLoadBalancerServiceResponse> {
    const validatedParams = validate(addLoadBalancerServiceRequestSchema, params, {
      context: "Add load balancer service request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/load_balancers/${id}/actions/add_service`,
      validatedParams,
    );

    return validate(addLoadBalancerServiceResponseSchema, response, {
      context: "Add load balancer service response",
      detailed: true,
    });
  }

  /**
   * Updates a service for a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param listenPort - Listen port of the service to update
   * @param params - Service configuration updates
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-update-service
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.loadBalancers.updateService(12345, 80, {
   *   destination_port: 8080,
   *   http: {
   *     sticky_sessions: true,
   *     cookie_name: 'session'
   *   }
   * });
   * ```
   */
  async updateService(
    id: number,
    listenPort: number,
    params: UpdateLoadBalancerServiceParams,
  ): Promise<UpdateLoadBalancerServiceResponse> {
    const validatedParams = validate(updateLoadBalancerServiceRequestSchema, params, {
      context: "Update load balancer service request",
      detailed: true,
    });

    const response = await this.client.put<unknown>(
      `/load_balancers/${id}/actions/update_service`,
      { listen_port: listenPort, ...validatedParams },
    );

    return validate(updateLoadBalancerServiceResponseSchema, response, {
      context: "Update load balancer service response",
      detailed: true,
    });
  }

  /**
   * Deletes a service from a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param listenPort - Listen port of the service to delete
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-delete-service
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.loadBalancers.deleteService(12345, 80);
   * console.log(`Action ID: ${result.action.id}`);
   * ```
   */
  async deleteService(
    id: number,
    listenPort: number,
  ): Promise<DeleteLoadBalancerServiceResponse> {
    const response = await this.client.post<unknown>(
      `/load_balancers/${id}/actions/delete_service`,
      { listen_port: listenPort },
    );

    return validate(deleteLoadBalancerServiceResponseSchema, response, {
      context: "Delete load balancer service response",
      detailed: true,
    });
  }

  /**
   * Adds a target to a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param params - Target configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-add-target
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Add a server target
   * const result = await client.loadBalancers.addTarget(12345, {
   *   type: 'server',
   *   server: { id: 67890 }
   * });
   * ```
   */
  async addTarget(
    id: number,
    params: AddLoadBalancerTargetParams,
  ): Promise<AddLoadBalancerTargetResponse> {
    const validatedParams = validate(addLoadBalancerTargetRequestSchema, params, {
      context: "Add load balancer target request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/load_balancers/${id}/actions/add_target`,
      validatedParams,
    );

    return validate(addLoadBalancerTargetResponseSchema, response, {
      context: "Add load balancer target response",
      detailed: true,
    });
  }

  /**
   * Removes a target from a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param params - Target to remove
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-remove-target
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.loadBalancers.removeTarget(12345, {
   *   type: 'server',
   *   server: { id: 67890 }
   * });
   * ```
   */
  async removeTarget(
    id: number,
    params: RemoveLoadBalancerTargetParams,
  ): Promise<RemoveLoadBalancerTargetResponse> {
    const validatedParams = validate(removeLoadBalancerTargetRequestSchema, params, {
      context: "Remove load balancer target request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/load_balancers/${id}/actions/remove_target`,
      validatedParams,
    );

    return validate(removeLoadBalancerTargetResponseSchema, response, {
      context: "Remove load balancer target response",
      detailed: true,
    });
  }

  /**
   * Changes the algorithm of a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param params - Algorithm configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-algorithm
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.loadBalancers.changeAlgorithm(12345, {
   *   type: 'least_connections'
   * });
   * ```
   */
  async changeAlgorithm(
    id: number,
    params: ChangeLoadBalancerAlgorithmParams,
  ): Promise<ChangeLoadBalancerAlgorithmResponse> {
    const validatedParams = validate(changeLoadBalancerAlgorithmRequestSchema, params, {
      context: "Change load balancer algorithm request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/load_balancers/${id}/actions/change_algorithm`,
      validatedParams,
    );

    return validate(changeLoadBalancerAlgorithmResponseSchema, response, {
      context: "Change load balancer algorithm response",
      detailed: true,
    });
  }

  /**
   * Changes the reverse DNS entry for a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param params - Reverse DNS configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-reverse-dns-entry-for-this-load-balancer
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.loadBalancers.changeReverseDNS(12345, {
   *   ip: '1.2.3.4',
   *   dns_ptr: 'lb.example.com'
   * });
   * ```
   */
  async changeReverseDNS(
    id: number,
    params: ChangeLoadBalancerReverseDNSParams,
  ): Promise<ChangeLoadBalancerReverseDNSResponse> {
    const validatedParams = validate(changeLoadBalancerReverseDNSRequestSchema, params, {
      context: "Change load balancer reverse DNS request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/load_balancers/${id}/actions/change_dns_ptr`,
      validatedParams,
    );

    return validate(changeLoadBalancerReverseDNSResponseSchema, response, {
      context: "Change load balancer reverse DNS response",
      detailed: true,
    });
  }

  /**
   * Changes the Protection configuration of a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param params - Protection configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-load-balancer-protection
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.loadBalancers.changeProtection(12345, {
   *   delete: true
   * });
   * ```
   */
  async changeProtection(
    id: number,
    params: ChangeLoadBalancerProtectionParams,
  ): Promise<ChangeLoadBalancerProtectionResponse> {
    const validatedParams = validate(changeLoadBalancerProtectionRequestSchema, params, {
      context: "Change load balancer protection request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/load_balancers/${id}/actions/change_protection`,
      validatedParams,
    );

    return validate(changeLoadBalancerProtectionResponseSchema, response, {
      context: "Change load balancer protection response",
      detailed: true,
    });
  }

  /**
   * Changes the type of a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param params - New load balancer type
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-the-type-of-a-load-balancer
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.loadBalancers.changeType(12345, {
   *   load_balancer_type: 'lb21'
   * });
   * ```
   */
  async changeType(
    id: number,
    params: ChangeLoadBalancerTypeParams,
  ): Promise<ChangeLoadBalancerTypeResponse> {
    const validatedParams = validate(changeLoadBalancerTypeRequestSchema, params, {
      context: "Change load balancer type request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/load_balancers/${id}/actions/change_type`,
      validatedParams,
    );

    return validate(changeLoadBalancerTypeResponseSchema, response, {
      context: "Change load balancer type response",
      detailed: true,
    });
  }

  /**
   * Attaches a Load Balancer to a Network.
   *
   * @param id - ID of the Load Balancer
   * @param params - Network configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-attach-a-load-balancer-to-a-network
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.loadBalancers.attachToNetwork(12345, {
   *   network: 67890
   * });
   * ```
   */
  async attachToNetwork(
    id: number,
    params: AttachLoadBalancerToNetworkParams,
  ): Promise<AttachLoadBalancerToNetworkResponse> {
    const validatedParams = validate(attachLoadBalancerToNetworkRequestSchema, params, {
      context: "Attach load balancer to network request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/load_balancers/${id}/actions/attach_to_network`,
      validatedParams,
    );

    return validate(attachLoadBalancerToNetworkResponseSchema, response, {
      context: "Attach load balancer to network response",
      detailed: true,
    });
  }

  /**
   * Detaches a Load Balancer from a Network.
   *
   * @param id - ID of the Load Balancer
   * @param networkId - ID of the Network
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-detach-a-load-balancer-from-a-network
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.loadBalancers.detachFromNetwork(12345, 67890);
   * ```
   */
  async detachFromNetwork(
    id: number,
    networkId: number,
  ): Promise<DetachLoadBalancerFromNetworkResponse> {
    const response = await this.client.post<unknown>(
      `/load_balancers/${id}/actions/detach_from_network`,
      { network: networkId },
    );

    return validate(detachLoadBalancerFromNetworkResponseSchema, response, {
      context: "Detach load balancer from network response",
      detailed: true,
    });
  }

  /**
   * Enables the public interface of a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-enable-the-public-interface-of-a-load-balancer
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.loadBalancers.enablePublicInterface(12345);
   * ```
   */
  async enablePublicInterface(
    id: number,
  ): Promise<EnableLoadBalancerPublicInterfaceResponse> {
    const response = await this.client.post<unknown>(
      `/load_balancers/${id}/actions/enable_public_interface`,
      {},
    );

    return validate(enableLoadBalancerPublicInterfaceResponseSchema, response, {
      context: "Enable load balancer public interface response",
      detailed: true,
    });
  }

  /**
   * Disables the public interface of a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-disable-the-public-interface-of-a-load-balancer
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.loadBalancers.disablePublicInterface(12345);
   * ```
   */
  async disablePublicInterface(
    id: number,
  ): Promise<DisableLoadBalancerPublicInterfaceResponse> {
    const response = await this.client.post<unknown>(
      `/load_balancers/${id}/actions/disable_public_interface`,
      {},
    );

    return validate(disableLoadBalancerPublicInterfaceResponseSchema, response, {
      context: "Disable load balancer public interface response",
      detailed: true,
    });
  }

  /**
   * Gets metrics for a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param params - Metrics query parameters
   * @returns Promise resolving to the metrics
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-get-metrics-for-a-load-balancer
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const metrics = await client.loadBalancers.getMetrics(12345, {
   *   type: ['connections_per_second'],
   *   start: '2024-01-01T00:00:00Z',
   *   end: '2024-01-01T01:00:00Z',
   *   step: 60
   * });
   * ```
   */
  async getMetrics(
    id: number,
    params: GetLoadBalancerMetricsParams,
  ): Promise<GetLoadBalancerMetricsResponse> {
    const queryParams: Record<string, string | number | string[] | undefined> = {};

    if (params.type) {
      const types = Array.isArray(params.type) ? params.type : [params.type];
      queryParams.type = types;
    }

    queryParams.start = params.start;
    queryParams.end = params.end;

    if (params.step !== undefined) {
      queryParams.step = params.step;
    }

    const response = await this.client.get<unknown>(`/load_balancers/${id}/metrics`, queryParams);

    return validate(getLoadBalancerMetricsResponseSchema, response, {
      context: "Get load balancer metrics response",
      detailed: true,
    });
  }
}
