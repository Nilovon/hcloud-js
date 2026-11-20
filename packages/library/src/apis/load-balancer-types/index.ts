/**
 * Hetzner Cloud Load Balancer Types API
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancer-types
 */

import { NamedResource, path } from "../../core/resource";
import type { RequestOptions } from "../../core/types";
import { getLoadBalancerTypeResponseSchema, listLoadBalancerTypesResponseSchema } from "./schemas";
import type {
  GetLoadBalancerTypeResponse,
  ListLoadBalancerTypesParams,
  ListLoadBalancerTypesResponse,
  LoadBalancerType,
} from "./types";

/**
 * Load Balancer Types API client
 *
 * Load Balancer Types define the capacity (connections, services, targets,
 * certificates) and the price of a Load Balancer. They are read-only.
 *
 * In addition to the methods below, the pagination helpers `iterate()`,
 * `iteratePages()`, `listAll()` and `first()` as well as `getByName()` are
 * available.
 *
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancer-types
 */
export class LoadBalancerTypesClient extends NamedResource<
  LoadBalancerType,
  ListLoadBalancerTypesParams,
  "load_balancer_types"
> {
  protected readonly itemsKey = "load_balancer_types";

  /**
   * Returns a page of Load Balancer Types.
   *
   * @param params - Name filter and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancer-types-list-load-balancer-types
   *
   * @example
   * ```typescript
   * const { load_balancer_types } = await client.loadBalancerTypes.list();
   *
   * // A single type by name
   * const lb11 = await client.loadBalancerTypes.getByName("lb11");
   * ```
   */
  list(
    params?: ListLoadBalancerTypesParams,
    options?: RequestOptions,
  ): Promise<ListLoadBalancerTypesResponse> {
    return this._get("/load_balancer_types", listLoadBalancerTypesResponseSchema, params, options);
  }

  /**
   * Returns a specific Load Balancer Type.
   *
   * @param id - ID of the Load Balancer Type
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancer-types-get-a-load-balancer-type
   *
   * @example
   * ```typescript
   * const { load_balancer_type } = await client.loadBalancerTypes.get(1);
   * console.log(load_balancer_type.max_connections);
   * ```
   */
  get(id: number, options?: RequestOptions): Promise<GetLoadBalancerTypeResponse> {
    return this._get(
      path`/load_balancer_types/${id}`,
      getLoadBalancerTypeResponseSchema,
      undefined,
      options,
    );
  }
}
