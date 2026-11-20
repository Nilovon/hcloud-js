/**
 * Hetzner Cloud Load Balancers API
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers
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
  addLoadBalancerServiceRequestSchema,
  addLoadBalancerTargetRequestSchema,
  attachLoadBalancerToNetworkRequestSchema,
  changeLoadBalancerAlgorithmRequestSchema,
  changeLoadBalancerProtectionRequestSchema,
  changeLoadBalancerReverseDNSRequestSchema,
  changeLoadBalancerTypeRequestSchema,
  createLoadBalancerRequestSchema,
  createLoadBalancerResponseSchema,
  deleteLoadBalancerServiceRequestSchema,
  detachLoadBalancerFromNetworkRequestSchema,
  getLoadBalancerMetricsResponseSchema,
  getLoadBalancerResponseSchema,
  listLoadBalancersResponseSchema,
  removeLoadBalancerTargetRequestSchema,
  updateLoadBalancerRequestSchema,
  updateLoadBalancerResponseSchema,
  updateLoadBalancerServiceRequestSchema,
} from "./schemas";
import type {
  AddLoadBalancerServiceParams,
  AddLoadBalancerServiceResponse,
  AddLoadBalancerTargetParams,
  AddLoadBalancerTargetResponse,
  AttachLoadBalancerToNetworkParams,
  AttachLoadBalancerToNetworkResponse,
  ChangeLoadBalancerAlgorithmParams,
  ChangeLoadBalancerAlgorithmResponse,
  ChangeLoadBalancerProtectionParams,
  ChangeLoadBalancerProtectionResponse,
  ChangeLoadBalancerReverseDNSParams,
  ChangeLoadBalancerReverseDNSResponse,
  ChangeLoadBalancerTypeParams,
  ChangeLoadBalancerTypeResponse,
  CreateLoadBalancerParams,
  CreateLoadBalancerResponse,
  DeleteLoadBalancerResponse,
  DeleteLoadBalancerServiceResponse,
  DetachLoadBalancerFromNetworkResponse,
  DisableLoadBalancerPublicInterfaceResponse,
  EnableLoadBalancerPublicInterfaceResponse,
  GetLoadBalancerActionResponse,
  GetLoadBalancerMetricsParams,
  GetLoadBalancerMetricsResponse,
  GetLoadBalancerResponse,
  ListLoadBalancerActionsParams,
  ListLoadBalancerActionsResponse,
  ListLoadBalancersParams,
  ListLoadBalancersResponse,
  LoadBalancer,
  RemoveLoadBalancerTargetParams,
  RemoveLoadBalancerTargetResponse,
  UpdateLoadBalancerParams,
  UpdateLoadBalancerResponse,
  UpdateLoadBalancerServiceParams,
  UpdateLoadBalancerServiceResponse,
} from "./types";

/**
 * Load Balancers API client
 *
 * Load Balancers distribute traffic of their services to their targets
 * (servers, label selectors or IPs).
 *
 * In addition to the methods below, the pagination helpers `iterate()`,
 * `iteratePages()`, `listAll()` and `first()` as well as `getByName()` are
 * available.
 *
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers
 */
export class LoadBalancersClient extends NamedResource<
  LoadBalancer,
  ListLoadBalancersParams,
  "load_balancers"
> {
  protected readonly itemsKey = "load_balancers";

  /**
   * Actions of all Load Balancers: `list()`, `get()`, `waitFor()` and `waitForAll()`.
   *
   * @example
   * ```typescript
   * const { actions } = await client.loadBalancers.actions.list({ status: "running" });
   * ```
   */
  public readonly actions = new ResourceActionsClient(this.client, "/load_balancers");

  /**
   * Returns a page of Load Balancers.
   *
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-list-load-balancers
   *
   * @example
   * ```typescript
   * const { load_balancers } = await client.loadBalancers.list({
   *   label_selector: "environment=production",
   *   sort: "name:asc",
   * });
   *
   * // All Load Balancers across all pages
   * const all = await client.loadBalancers.listAll();
   * ```
   */
  list(
    params?: ListLoadBalancersParams,
    options?: RequestOptions,
  ): Promise<ListLoadBalancersResponse> {
    return this._get("/load_balancers", listLoadBalancersResponseSchema, params, options);
  }

  /**
   * Returns a specific Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-get-a-load-balancer
   *
   * @example
   * ```typescript
   * const { load_balancer } = await client.loadBalancers.get(12345);
   * console.log(load_balancer.public_net.ipv4.ip);
   * ```
   */
  get(id: number, options?: RequestOptions): Promise<GetLoadBalancerResponse> {
    return this._get(
      path`/load_balancers/${id}`,
      getLoadBalancerResponseSchema,
      undefined,
      options,
    );
  }

  /**
   * Creates a new Load Balancer.
   *
   * Either `location` or `network_zone` is required. Existing Primary IPs can
   * be assigned with `public_net`; for an omitted IP version a new one is allocated.
   *
   * @param params - Name, type, location and optional algorithm, services, targets, ...
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-create-a-load-balancer
   *
   * @example
   * ```typescript
   * const { load_balancer, action } = await client.loadBalancers.create({
   *   name: "my-lb",
   *   load_balancer_type: "lb11",
   *   location: "nbg1",
   *   services: [{ protocol: "http", listen_port: 80, destination_port: 80 }],
   *   targets: [{ type: "label_selector", label_selector: { selector: "role=web" } }],
   * });
   * await client.actions.waitFor(action);
   * ```
   */
  create(
    params: CreateLoadBalancerParams,
    options?: RequestOptions,
  ): Promise<CreateLoadBalancerResponse> {
    return this._post(
      "/load_balancers",
      createLoadBalancerResponseSchema,
      params,
      createLoadBalancerRequestSchema,
      options,
    );
  }

  /**
   * Updates the name and/or labels of a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param params - Fields to update
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-update-a-load-balancer
   *
   * @example
   * ```typescript
   * const { load_balancer } = await client.loadBalancers.update(12345, {
   *   name: "new-name",
   *   labels: { environment: "production" },
   * });
   * ```
   */
  update(
    id: number,
    params: UpdateLoadBalancerParams,
    options?: RequestOptions,
  ): Promise<UpdateLoadBalancerResponse> {
    return this._put(
      path`/load_balancers/${id}`,
      updateLoadBalancerResponseSchema,
      params,
      updateLoadBalancerRequestSchema,
      options,
    );
  }

  /**
   * Deletes a Load Balancer.
   *
   * The deletion is tracked by the returned action. (Until October 2026 the API
   * answered with an empty response instead.)
   *
   * @param id - ID of the Load Balancer
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-delete-a-load-balancer
   *
   * @example
   * ```typescript
   * const { action } = await client.loadBalancers.delete(12345);
   * await client.actions.waitFor(action);
   * ```
   */
  delete(id: number, options?: RequestOptions): Promise<DeleteLoadBalancerResponse> {
    return this._delete(path`/load_balancers/${id}`, actionResponseSchema, options);
  }

  /**
   * Returns metrics of a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param params - Metric type(s), period (`Date` or ISO-8601 string) and optional resolution
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-get-metrics-for-a-load-balancer
   *
   * @example
   * ```typescript
   * const { metrics } = await client.loadBalancers.getMetrics(12345, {
   *   type: ["open_connections", "requests_per_second"],
   *   start: new Date(Date.now() - 60 * 60 * 1000),
   *   end: new Date(),
   * });
   * console.log(metrics.time_series.open_connections?.values);
   * ```
   */
  getMetrics(
    id: number,
    params: GetLoadBalancerMetricsParams,
    options?: RequestOptions,
  ): Promise<GetLoadBalancerMetricsResponse> {
    const types = typeof params.type === "string" ? [params.type] : params.type;
    const query = {
      type: types.join(","),
      start: toISOString(params.start),
      end: toISOString(params.end),
      step: params.step,
    };
    return this._get(
      path`/load_balancers/${id}/metrics`,
      getLoadBalancerMetricsResponseSchema,
      query,
      options,
    );
  }

  /**
   * Returns a page of actions of a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-list-actions-for-a-load-balancer
   *
   * @example
   * ```typescript
   * const { actions } = await client.loadBalancers.listActions(12345, {
   *   status: "running",
   *   sort: "started:desc",
   * });
   * ```
   */
  listActions(
    id: number,
    params?: ListLoadBalancerActionsParams,
    options?: RequestOptions,
  ): Promise<ListLoadBalancerActionsResponse> {
    return this._get(
      path`/load_balancers/${id}/actions`,
      listActionsResponseSchema,
      params,
      options,
    );
  }

  /**
   * Returns a specific action of a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param actionId - ID of the action
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-get-an-action-for-a-load-balancer
   *
   * @example
   * ```typescript
   * const { action } = await client.loadBalancers.getAction(12345, 67890);
   * console.log(action.status);
   * ```
   */
  getAction(
    id: number,
    actionId: number,
    options?: RequestOptions,
  ): Promise<GetLoadBalancerActionResponse> {
    return this._get(
      path`/load_balancers/${id}/actions/${actionId}`,
      getActionResponseSchema,
      undefined,
      options,
    );
  }

  /**
   * Adds a service to a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param params - Service configuration. Only defined fields are sent.
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-add-service
   *
   * @example
   * ```typescript
   * const { action } = await client.loadBalancers.addService(12345, {
   *   protocol: "https",
   *   listen_port: 443,
   *   destination_port: 80,
   *   http: { certificates: [897], redirect_http: true },
   *   health_check: { protocol: "http", port: 80, http: { path: "/health" } },
   * });
   * ```
   */
  addService(
    id: number,
    params: AddLoadBalancerServiceParams,
    options?: RequestOptions,
  ): Promise<AddLoadBalancerServiceResponse> {
    return this._post(
      path`/load_balancers/${id}/actions/add_service`,
      actionResponseSchema,
      params,
      addLoadBalancerServiceRequestSchema,
      options,
    );
  }

  /**
   * Updates a service of a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param listenPort - Listen port of the service to update
   * @param params - Fields to update. Only defined fields are sent.
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-update-service
   *
   * @example
   * ```typescript
   * const { action } = await client.loadBalancers.updateService(12345, 443, {
   *   destination_port: 8080,
   *   http: { sticky_sessions: true, timeout_idle: 120 },
   * });
   * ```
   */
  updateService(
    id: number,
    listenPort: number,
    params: UpdateLoadBalancerServiceParams,
    options?: RequestOptions,
  ): Promise<UpdateLoadBalancerServiceResponse> {
    return this._post(
      path`/load_balancers/${id}/actions/update_service`,
      actionResponseSchema,
      { ...params, listen_port: listenPort },
      updateLoadBalancerServiceRequestSchema,
      options,
    );
  }

  /**
   * Deletes a service of a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param listenPort - Listen port of the service to delete
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-delete-service
   *
   * @example
   * ```typescript
   * const { action } = await client.loadBalancers.deleteService(12345, 443);
   * ```
   */
  deleteService(
    id: number,
    listenPort: number,
    options?: RequestOptions,
  ): Promise<DeleteLoadBalancerServiceResponse> {
    return this._post(
      path`/load_balancers/${id}/actions/delete_service`,
      actionResponseSchema,
      { listen_port: listenPort },
      deleteLoadBalancerServiceRequestSchema,
      options,
    );
  }

  /**
   * Adds a target to a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param params - Target: a server, a label selector or an IP
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-add-target
   *
   * @example
   * ```typescript
   * const { action } = await client.loadBalancers.addTarget(12345, {
   *   type: "server",
   *   server: { id: 67890 },
   *   use_private_ip: true,
   * });
   * ```
   */
  addTarget(
    id: number,
    params: AddLoadBalancerTargetParams,
    options?: RequestOptions,
  ): Promise<AddLoadBalancerTargetResponse> {
    return this._post(
      path`/load_balancers/${id}/actions/add_target`,
      actionResponseSchema,
      params,
      addLoadBalancerTargetRequestSchema,
      options,
    );
  }

  /**
   * Removes a target from a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param params - Target to remove
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-remove-target
   *
   * @example
   * ```typescript
   * const { action } = await client.loadBalancers.removeTarget(12345, {
   *   type: "server",
   *   server: { id: 67890 },
   * });
   * ```
   */
  removeTarget(
    id: number,
    params: RemoveLoadBalancerTargetParams,
    options?: RequestOptions,
  ): Promise<RemoveLoadBalancerTargetResponse> {
    return this._post(
      path`/load_balancers/${id}/actions/remove_target`,
      actionResponseSchema,
      params,
      removeLoadBalancerTargetRequestSchema,
      options,
    );
  }

  /**
   * Changes the algorithm of a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param params - New algorithm
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-algorithm
   *
   * @example
   * ```typescript
   * const { action } = await client.loadBalancers.changeAlgorithm(12345, {
   *   type: "least_connections",
   * });
   * ```
   */
  changeAlgorithm(
    id: number,
    params: ChangeLoadBalancerAlgorithmParams,
    options?: RequestOptions,
  ): Promise<ChangeLoadBalancerAlgorithmResponse> {
    return this._post(
      path`/load_balancers/${id}/actions/change_algorithm`,
      actionResponseSchema,
      params,
      changeLoadBalancerAlgorithmRequestSchema,
      options,
    );
  }

  /**
   * Changes the reverse DNS entry of a public IP of a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param params - IP and hostname. `dns_ptr: null` resets the entry to its default.
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-reverse-dns-entry-for-this-load-balancer
   *
   * @example
   * ```typescript
   * const { action } = await client.loadBalancers.changeReverseDNS(12345, {
   *   ip: "1.2.3.4",
   *   dns_ptr: "lb1.example.com",
   * });
   * ```
   */
  changeReverseDNS(
    id: number,
    params: ChangeLoadBalancerReverseDNSParams,
    options?: RequestOptions,
  ): Promise<ChangeLoadBalancerReverseDNSResponse> {
    return this._post(
      path`/load_balancers/${id}/actions/change_dns_ptr`,
      actionResponseSchema,
      params,
      changeLoadBalancerReverseDNSRequestSchema,
      options,
    );
  }

  /**
   * Changes the protection configuration of a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param params - `delete: true` prevents the Load Balancer from being deleted
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-load-balancer-protection
   *
   * @example
   * ```typescript
   * const { action } = await client.loadBalancers.changeProtection(12345, { delete: true });
   * ```
   */
  changeProtection(
    id: number,
    params: ChangeLoadBalancerProtectionParams,
    options?: RequestOptions,
  ): Promise<ChangeLoadBalancerProtectionResponse> {
    return this._post(
      path`/load_balancers/${id}/actions/change_protection`,
      actionResponseSchema,
      params,
      changeLoadBalancerProtectionRequestSchema,
      options,
    );
  }

  /**
   * Changes the type (capacity) of a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param params - ID or name of the new Load Balancer Type
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-the-type-of-a-load-balancer
   *
   * @example
   * ```typescript
   * const { action } = await client.loadBalancers.changeType(12345, {
   *   load_balancer_type: "lb21",
   * });
   * ```
   */
  changeType(
    id: number,
    params: ChangeLoadBalancerTypeParams,
    options?: RequestOptions,
  ): Promise<ChangeLoadBalancerTypeResponse> {
    return this._post(
      path`/load_balancers/${id}/actions/change_type`,
      actionResponseSchema,
      params,
      changeLoadBalancerTypeRequestSchema,
      options,
    );
  }

  /**
   * Attaches a Load Balancer to a Network.
   *
   * @param id - ID of the Load Balancer
   * @param params - Network ID and optionally the IP or the subnet (`ip_range`) to use
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-attach-a-load-balancer-to-a-network
   *
   * @example
   * ```typescript
   * const { action } = await client.loadBalancers.attachToNetwork(12345, {
   *   network: 4711,
   *   ip: "10.0.1.1",
   * });
   * ```
   */
  attachToNetwork(
    id: number,
    params: AttachLoadBalancerToNetworkParams,
    options?: RequestOptions,
  ): Promise<AttachLoadBalancerToNetworkResponse> {
    return this._post(
      path`/load_balancers/${id}/actions/attach_to_network`,
      actionResponseSchema,
      params,
      attachLoadBalancerToNetworkRequestSchema,
      options,
    );
  }

  /**
   * Detaches a Load Balancer from a Network.
   *
   * @param id - ID of the Load Balancer
   * @param networkId - ID of the Network
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-detach-a-load-balancer-from-a-network
   *
   * @example
   * ```typescript
   * const { action } = await client.loadBalancers.detachFromNetwork(12345, 4711);
   * ```
   */
  detachFromNetwork(
    id: number,
    networkId: number,
    options?: RequestOptions,
  ): Promise<DetachLoadBalancerFromNetworkResponse> {
    return this._post(
      path`/load_balancers/${id}/actions/detach_from_network`,
      actionResponseSchema,
      { network: networkId },
      detachLoadBalancerFromNetworkRequestSchema,
      options,
    );
  }

  /**
   * Enables the public interface of a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-enable-the-public-interface-of-a-load-balancer
   *
   * @example
   * ```typescript
   * const { action } = await client.loadBalancers.enablePublicInterface(12345);
   * ```
   */
  enablePublicInterface(
    id: number,
    options?: RequestOptions,
  ): Promise<EnableLoadBalancerPublicInterfaceResponse> {
    return this._post(
      path`/load_balancers/${id}/actions/enable_public_interface`,
      actionResponseSchema,
      undefined,
      undefined,
      options,
    );
  }

  /**
   * Disables the public interface of a Load Balancer.
   *
   * @param id - ID of the Load Balancer
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-disable-the-public-interface-of-a-load-balancer
   *
   * @example
   * ```typescript
   * const { action } = await client.loadBalancers.disablePublicInterface(12345);
   * ```
   */
  disablePublicInterface(
    id: number,
    options?: RequestOptions,
  ): Promise<DisableLoadBalancerPublicInterfaceResponse> {
    return this._post(
      path`/load_balancers/${id}/actions/disable_public_interface`,
      actionResponseSchema,
      undefined,
      undefined,
      options,
    );
  }
}

function toISOString(value: string | Date): string {
  return typeof value === "string" ? value : value.toISOString();
}
