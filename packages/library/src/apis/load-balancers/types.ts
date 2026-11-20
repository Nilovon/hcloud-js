/**
 * Types for Hetzner Cloud Load Balancers API
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers
 */

import type { z } from "zod";
import type {
  ActionResponse,
  GetActionResponse,
  ListActionsParams,
  ListActionsResponse,
} from "../actions/types";
import type { OneOrMany, PageParams, SortParam } from "../common/types";
import type {
  addLoadBalancerServiceRequestSchema,
  addLoadBalancerTargetRequestSchema,
  attachLoadBalancerToNetworkRequestSchema,
  changeLoadBalancerAlgorithmRequestSchema,
  changeLoadBalancerProtectionRequestSchema,
  changeLoadBalancerReverseDNSRequestSchema,
  changeLoadBalancerTypeRequestSchema,
  createLoadBalancerRequestSchema,
  createLoadBalancerResponseSchema,
  getLoadBalancerMetricsResponseSchema,
  getLoadBalancerResponseSchema,
  listLoadBalancersResponseSchema,
  loadBalancerAlgorithmSchema,
  loadBalancerAlgorithmTypeSchema,
  loadBalancerMetricTypeSchema,
  loadBalancerPrivateNetSchema,
  loadBalancerProtectionSchema,
  loadBalancerPublicNetSchema,
  loadBalancerResolvedTargetSchema,
  loadBalancerSchema,
  loadBalancerServiceHealthCheckProtocolSchema,
  loadBalancerServiceHealthCheckSchema,
  loadBalancerServiceProtocolSchema,
  loadBalancerServiceSchema,
  loadBalancerTargetHealthStatusSchema,
  loadBalancerTargetSchema,
  loadBalancerTargetTypeSchema,
  removeLoadBalancerTargetRequestSchema,
  updateLoadBalancerRequestSchema,
  updateLoadBalancerResponseSchema,
  updateLoadBalancerServiceRequestSchema,
} from "./schemas";

/**
 * Hetzner Cloud Load Balancer
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers
 */
export type LoadBalancer = z.infer<typeof loadBalancerSchema>;

/**
 * Load Balancer algorithm type
 */
export type LoadBalancerAlgorithmType = z.infer<typeof loadBalancerAlgorithmTypeSchema>;

/**
 * Load Balancer algorithm
 */
export type LoadBalancerAlgorithm = z.infer<typeof loadBalancerAlgorithmSchema>;

/**
 * Load Balancer service protocol
 */
export type LoadBalancerServiceProtocol = z.infer<typeof loadBalancerServiceProtocolSchema>;

/**
 * Load Balancer service health check protocol
 */
export type LoadBalancerServiceHealthCheckProtocol = z.infer<
  typeof loadBalancerServiceHealthCheckProtocolSchema
>;

/**
 * Load Balancer service health check
 */
export type LoadBalancerServiceHealthCheck = z.infer<typeof loadBalancerServiceHealthCheckSchema>;

/**
 * Load Balancer service
 */
export type LoadBalancerService = z.infer<typeof loadBalancerServiceSchema>;

/**
 * Load Balancer target type
 */
export type LoadBalancerTargetType = z.infer<typeof loadBalancerTargetTypeSchema>;

/**
 * Health status of a Load Balancer target for one service
 */
export type LoadBalancerTargetHealthStatus = z.infer<typeof loadBalancerTargetHealthStatusSchema>;

/**
 * Load Balancer target
 */
export type LoadBalancerTarget = z.infer<typeof loadBalancerTargetSchema>;

/**
 * Server a label selector target of a Load Balancer resolved to
 */
export type LoadBalancerResolvedTarget = z.infer<typeof loadBalancerResolvedTargetSchema>;

/**
 * Load Balancer protection
 */
export type LoadBalancerProtection = z.infer<typeof loadBalancerProtectionSchema>;

/**
 * Load Balancer public network
 */
export type LoadBalancerPublicNet = z.infer<typeof loadBalancerPublicNetSchema>;

/**
 * Load Balancer private network attachment
 */
export type LoadBalancerPrivateNet = z.infer<typeof loadBalancerPrivateNetSchema>;

/**
 * Load Balancer metric type
 */
export type LoadBalancerMetricType = z.infer<typeof loadBalancerMetricTypeSchema>;

/**
 * Fields Load Balancers can be sorted by
 */
export type LoadBalancerSort = SortParam<"id" | "name" | "created">;

/**
 * List Load Balancers query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-list-load-balancers
 */
export interface ListLoadBalancersParams extends PageParams {
  /**
   * Only return the Load Balancer with this exact name.
   */
  name?: string;
  /**
   * Only return Load Balancers matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
  /**
   * Sort the result.
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: OneOrMany<LoadBalancerSort>;
}

/**
 * List Load Balancers response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-list-load-balancers
 */
export type ListLoadBalancersResponse = z.infer<typeof listLoadBalancersResponseSchema>;

/**
 * Create Load Balancer request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-create-a-load-balancer
 */
export type CreateLoadBalancerParams = z.input<typeof createLoadBalancerRequestSchema>;

/**
 * Create Load Balancer response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-create-a-load-balancer
 */
export type CreateLoadBalancerResponse = z.infer<typeof createLoadBalancerResponseSchema>;

/**
 * Get Load Balancer response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-get-a-load-balancer
 */
export type GetLoadBalancerResponse = z.infer<typeof getLoadBalancerResponseSchema>;

/**
 * Update Load Balancer request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-update-a-load-balancer
 */
export type UpdateLoadBalancerParams = z.input<typeof updateLoadBalancerRequestSchema>;

/**
 * Update Load Balancer response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-update-a-load-balancer
 */
export type UpdateLoadBalancerResponse = z.infer<typeof updateLoadBalancerResponseSchema>;

/**
 * Delete Load Balancer response: the action tracking the deletion
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-delete-a-load-balancer
 */
export type DeleteLoadBalancerResponse = ActionResponse;

/**
 * List Load Balancer Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-list-actions-for-a-load-balancer
 */
export type ListLoadBalancerActionsParams = ListActionsParams;

/**
 * List Load Balancer Actions response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-list-actions-for-a-load-balancer
 */
export type ListLoadBalancerActionsResponse = ListActionsResponse;

/**
 * Get Load Balancer Action response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-get-an-action-for-a-load-balancer
 */
export type GetLoadBalancerActionResponse = GetActionResponse;

/**
 * Add Load Balancer Service request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-add-service
 */
export type AddLoadBalancerServiceParams = z.input<typeof addLoadBalancerServiceRequestSchema>;

/**
 * Add Load Balancer Service response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-add-service
 */
export type AddLoadBalancerServiceResponse = ActionResponse;

/**
 * Update Load Balancer Service request parameters. The service is identified
 * by its listen port, which is passed separately.
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-update-service
 */
export type UpdateLoadBalancerServiceParams = Omit<
  z.input<typeof updateLoadBalancerServiceRequestSchema>,
  "listen_port"
>;

/**
 * Update Load Balancer Service response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-update-service
 */
export type UpdateLoadBalancerServiceResponse = ActionResponse;

/**
 * Delete Load Balancer Service response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-delete-service
 */
export type DeleteLoadBalancerServiceResponse = ActionResponse;

/**
 * Add Load Balancer Target request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-add-target
 */
export type AddLoadBalancerTargetParams = z.input<typeof addLoadBalancerTargetRequestSchema>;

/**
 * Add Load Balancer Target response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-add-target
 */
export type AddLoadBalancerTargetResponse = ActionResponse;

/**
 * Remove Load Balancer Target request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-remove-target
 */
export type RemoveLoadBalancerTargetParams = z.input<typeof removeLoadBalancerTargetRequestSchema>;

/**
 * Remove Load Balancer Target response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-remove-target
 */
export type RemoveLoadBalancerTargetResponse = ActionResponse;

/**
 * Change Load Balancer Algorithm request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-algorithm
 */
export type ChangeLoadBalancerAlgorithmParams = z.input<
  typeof changeLoadBalancerAlgorithmRequestSchema
>;

/**
 * Change Load Balancer Algorithm response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-algorithm
 */
export type ChangeLoadBalancerAlgorithmResponse = ActionResponse;

/**
 * Change Load Balancer reverse DNS request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-reverse-dns-entry-for-this-load-balancer
 */
export type ChangeLoadBalancerReverseDNSParams = z.input<
  typeof changeLoadBalancerReverseDNSRequestSchema
>;

/**
 * Change Load Balancer reverse DNS response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-reverse-dns-entry-for-this-load-balancer
 */
export type ChangeLoadBalancerReverseDNSResponse = ActionResponse;

/**
 * Change Load Balancer Protection request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-load-balancer-protection
 */
export type ChangeLoadBalancerProtectionParams = z.input<
  typeof changeLoadBalancerProtectionRequestSchema
>;

/**
 * Change Load Balancer Protection response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-load-balancer-protection
 */
export type ChangeLoadBalancerProtectionResponse = ActionResponse;

/**
 * Change Load Balancer Type request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-the-type-of-a-load-balancer
 */
export type ChangeLoadBalancerTypeParams = z.input<typeof changeLoadBalancerTypeRequestSchema>;

/**
 * Change Load Balancer Type response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-the-type-of-a-load-balancer
 */
export type ChangeLoadBalancerTypeResponse = ActionResponse;

/**
 * Attach Load Balancer to Network request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-attach-a-load-balancer-to-a-network
 */
export type AttachLoadBalancerToNetworkParams = z.input<
  typeof attachLoadBalancerToNetworkRequestSchema
>;

/**
 * Attach Load Balancer to Network response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-attach-a-load-balancer-to-a-network
 */
export type AttachLoadBalancerToNetworkResponse = ActionResponse;

/**
 * Detach Load Balancer from Network response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-detach-a-load-balancer-from-a-network
 */
export type DetachLoadBalancerFromNetworkResponse = ActionResponse;

/**
 * Enable Load Balancer public interface response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-enable-the-public-interface-of-a-load-balancer
 */
export type EnableLoadBalancerPublicInterfaceResponse = ActionResponse;

/**
 * Disable Load Balancer public interface response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-disable-the-public-interface-of-a-load-balancer
 */
export type DisableLoadBalancerPublicInterfaceResponse = ActionResponse;

/**
 * Get Load Balancer Metrics query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-get-metrics-for-a-load-balancer
 */
export interface GetLoadBalancerMetricsParams {
  /**
   * Type(s) of metrics to get.
   */
  type: OneOrMany<LoadBalancerMetricType>;
  /**
   * Start of the period to get metrics for: a `Date` or an ISO-8601 string.
   */
  start: string | Date;
  /**
   * End of the period to get metrics for: a `Date` or an ISO-8601 string.
   */
  end: string | Date;
  /**
   * Resolution of the results in seconds.
   */
  step?: number;
}

/**
 * Get Load Balancer Metrics response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-get-metrics-for-a-load-balancer
 */
export type GetLoadBalancerMetricsResponse = z.infer<typeof getLoadBalancerMetricsResponseSchema>;
