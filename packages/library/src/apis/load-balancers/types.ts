/**
 * Types for Hetzner Cloud Load Balancers API
 * Types are inferred from Zod schemas
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers
 */

// biome-ignore assist/source/organizeImports: we need to import the schemas first
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
  loadBalancerSchema,
  loadBalancerAlgorithmTypeSchema,
  loadBalancerServiceProtocolSchema,
  loadBalancerTargetTypeSchema,
  loadBalancerServiceHealthCheckProtocolSchema,
} from "@/apis/load-balancers/schemas";
import type { z } from "zod";

/**
 * Load Balancer algorithm type
 */
export type LoadBalancerAlgorithmType = z.infer<typeof loadBalancerAlgorithmTypeSchema>;

/**
 * Load Balancer service protocol
 */
export type LoadBalancerServiceProtocol = z.infer<typeof loadBalancerServiceProtocolSchema>;

/**
 * Load Balancer target type
 */
export type LoadBalancerTargetType = z.infer<typeof loadBalancerTargetTypeSchema>;

/**
 * Load Balancer service health check protocol
 */
export type LoadBalancerServiceHealthCheckProtocol = z.infer<
  typeof loadBalancerServiceHealthCheckProtocolSchema
>;

/**
 * Load Balancer
 */
export type LoadBalancer = z.infer<typeof loadBalancerSchema>;

/**
 * List Load Balancers query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-list-load-balancers
 */
export interface ListLoadBalancersParams {
  /**
   * Can be used to filter resources by their name. The response will only contain the resources matching the specified name.
   */
  name?: string;
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, name, name:asc, name:desc, created, created:asc, created:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
  /**
   * Can be used to filter resources by labels. The response will only contain resources matching the label selector.
   */
  label_selector?: string;
  /**
   * Page number to return. For more information, see [Pagination](https://docs.hetzner.cloud/reference/cloud#pagination).
   */
  page?: number;
  /**
   * Maximum number of entries returned per page. For more information, see [Pagination](https://docs.hetzner.cloud/reference/cloud#pagination).
   */
  per_page?: number;
}

/**
 * List Load Balancers response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-list-load-balancers
 */
export type ListLoadBalancersResponse = z.infer<typeof listLoadBalancersResponseSchema>;

/**
 * Create Load Balancer parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-create-a-load-balancer
 */
export type CreateLoadBalancerParams = z.infer<typeof createLoadBalancerRequestSchema>;

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
 * Update Load Balancer parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-update-a-load-balancer
 */
export type UpdateLoadBalancerParams = z.infer<typeof updateLoadBalancerRequestSchema>;

/**
 * Update Load Balancer response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-update-a-load-balancer
 */
export type UpdateLoadBalancerResponse = z.infer<typeof updateLoadBalancerResponseSchema>;

/**
 * Delete Load Balancer response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-delete-a-load-balancer
 */
export type DeleteLoadBalancerResponse = z.infer<typeof deleteLoadBalancerResponseSchema>;

/**
 * List Load Balancer Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-list-actions-for-a-load-balancer
 */
export interface ListLoadBalancerActionsParams {
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, command, command:asc, command:desc, status, status:asc, status:desc, progress, progress:asc, progress:desc, started, started:asc, started:desc, finished, finished:asc, finished:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
  /**
   * Can be used to filter Actions by status. The response will only contain Actions matching the status.
   */
  status?: string | string[];
  /**
   * Page number to return. For more information, see [Pagination](https://docs.hetzner.cloud/reference/cloud#pagination).
   */
  page?: number;
  /**
   * Maximum number of entries returned per page. For more information, see [Pagination](https://docs.hetzner.cloud/reference/cloud#pagination).
   */
  per_page?: number;
}

/**
 * List Load Balancer Actions response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-list-actions-for-a-load-balancer
 */
export type ListLoadBalancerActionsResponse = z.infer<typeof listLoadBalancerActionsResponseSchema>;

/**
 * Get Load Balancer Action response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-get-an-action-for-a-load-balancer
 */
export type GetLoadBalancerActionResponse = z.infer<typeof getLoadBalancerActionResponseSchema>;

/**
 * Add Load Balancer Service parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-add-service
 */
export type AddLoadBalancerServiceParams = z.infer<typeof addLoadBalancerServiceRequestSchema>;

/**
 * Add Load Balancer Service response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-add-service
 */
export type AddLoadBalancerServiceResponse = z.infer<typeof addLoadBalancerServiceResponseSchema>;

/**
 * Update Load Balancer Service parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-update-service
 */
export type UpdateLoadBalancerServiceParams = z.infer<
  typeof updateLoadBalancerServiceRequestSchema
>;

/**
 * Update Load Balancer Service response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-update-service
 */
export type UpdateLoadBalancerServiceResponse = z.infer<
  typeof updateLoadBalancerServiceResponseSchema
>;

/**
 * Delete Load Balancer Service response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-delete-service
 */
export type DeleteLoadBalancerServiceResponse = z.infer<
  typeof deleteLoadBalancerServiceResponseSchema
>;

/**
 * Add Load Balancer Target parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-add-target
 */
export type AddLoadBalancerTargetParams = z.infer<typeof addLoadBalancerTargetRequestSchema>;

/**
 * Add Load Balancer Target response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-add-target
 */
export type AddLoadBalancerTargetResponse = z.infer<typeof addLoadBalancerTargetResponseSchema>;

/**
 * Remove Load Balancer Target parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-remove-target
 */
export type RemoveLoadBalancerTargetParams = z.infer<
  typeof removeLoadBalancerTargetRequestSchema
>;

/**
 * Remove Load Balancer Target response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-remove-target
 */
export type RemoveLoadBalancerTargetResponse = z.infer<
  typeof removeLoadBalancerTargetResponseSchema
>;

/**
 * Change Load Balancer Algorithm parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-algorithm
 */
export type ChangeLoadBalancerAlgorithmParams = z.infer<
  typeof changeLoadBalancerAlgorithmRequestSchema
>;

/**
 * Change Load Balancer Algorithm response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-algorithm
 */
export type ChangeLoadBalancerAlgorithmResponse = z.infer<
  typeof changeLoadBalancerAlgorithmResponseSchema
>;

/**
 * Change Load Balancer reverse DNS parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-reverse-dns-entry-for-this-load-balancer
 */
export type ChangeLoadBalancerReverseDNSParams = z.infer<
  typeof changeLoadBalancerReverseDNSRequestSchema
>;

/**
 * Change Load Balancer reverse DNS response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-reverse-dns-entry-for-this-load-balancer
 */
export type ChangeLoadBalancerReverseDNSResponse = z.infer<
  typeof changeLoadBalancerReverseDNSResponseSchema
>;

/**
 * Change Load Balancer Protection parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-load-balancer-protection
 */
export type ChangeLoadBalancerProtectionParams = z.infer<
  typeof changeLoadBalancerProtectionRequestSchema
>;

/**
 * Change Load Balancer Protection response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-load-balancer-protection
 */
export type ChangeLoadBalancerProtectionResponse = z.infer<
  typeof changeLoadBalancerProtectionResponseSchema
>;

/**
 * Change Load Balancer Type parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-the-type-of-a-load-balancer
 */
export type ChangeLoadBalancerTypeParams = z.infer<typeof changeLoadBalancerTypeRequestSchema>;

/**
 * Change Load Balancer Type response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-the-type-of-a-load-balancer
 */
export type ChangeLoadBalancerTypeResponse = z.infer<typeof changeLoadBalancerTypeResponseSchema>;

/**
 * Attach Load Balancer to Network parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-attach-a-load-balancer-to-a-network
 */
export type AttachLoadBalancerToNetworkParams = z.infer<
  typeof attachLoadBalancerToNetworkRequestSchema
>;

/**
 * Attach Load Balancer to Network response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-attach-a-load-balancer-to-a-network
 */
export type AttachLoadBalancerToNetworkResponse = z.infer<
  typeof attachLoadBalancerToNetworkResponseSchema
>;

/**
 * Detach Load Balancer from Network response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-detach-a-load-balancer-from-a-network
 */
export type DetachLoadBalancerFromNetworkResponse = z.infer<
  typeof detachLoadBalancerFromNetworkResponseSchema
>;

/**
 * Enable Load Balancer public interface response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-enable-the-public-interface-of-a-load-balancer
 */
export type EnableLoadBalancerPublicInterfaceResponse = z.infer<
  typeof enableLoadBalancerPublicInterfaceResponseSchema
>;

/**
 * Disable Load Balancer public interface response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-disable-the-public-interface-of-a-load-balancer
 */
export type DisableLoadBalancerPublicInterfaceResponse = z.infer<
  typeof disableLoadBalancerPublicInterfaceResponseSchema
>;

/**
 * Get Load Balancer Metrics parameters
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-get-metrics-for-a-load-balancer
 */
export type GetLoadBalancerMetricsParams = z.infer<typeof getLoadBalancerMetricsRequestSchema>;

/**
 * Get Load Balancer Metrics response
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-get-metrics-for-a-load-balancer
 */
export type GetLoadBalancerMetricsResponse = z.infer<typeof getLoadBalancerMetricsResponseSchema>;
