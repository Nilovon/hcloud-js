/**
 * Types for Hetzner Cloud Load Balancer Types API
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancer-types
 */

import type { z } from "zod";
import type { PageParams } from "../common/types";
import type {
  getLoadBalancerTypeResponseSchema,
  listLoadBalancerTypesResponseSchema,
  loadBalancerTypePriceSchema,
  loadBalancerTypeSchema,
} from "./schemas";

/**
 * Hetzner Cloud Load Balancer Type
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancer-types
 */
export type LoadBalancerType = z.infer<typeof loadBalancerTypeSchema>;

/**
 * Price of a Load Balancer Type in a location
 */
export type LoadBalancerTypePrice = z.infer<typeof loadBalancerTypePriceSchema>;

/**
 * List Load Balancer Types query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancer-types-list-load-balancer-types
 */
export interface ListLoadBalancerTypesParams extends PageParams {
  /**
   * Only return the Load Balancer Type with this exact name.
   */
  name?: string;
}

/**
 * List Load Balancer Types response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancer-types-list-load-balancer-types
 */
export type ListLoadBalancerTypesResponse = z.infer<typeof listLoadBalancerTypesResponseSchema>;

/**
 * Get Load Balancer Type response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancer-types-get-a-load-balancer-type
 */
export type GetLoadBalancerTypeResponse = z.infer<typeof getLoadBalancerTypeResponseSchema>;
