/**
 * Types for Hetzner Cloud Networks API
 * @see https://docs.hetzner.cloud/reference/cloud#networks
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
  networkMemberSchema,
  networkMemberStatusSchema,
  networkMemberTypeSchema,
  networkProtectionSchema,
  networkRouteSchema,
  networkSchema,
  networkSubnetSchema,
  networkSubnetTypeSchema,
  updateNetworkRequestSchema,
  updateNetworkResponseSchema,
} from "./schemas";

/**
 * Network subnet type. `server` is a deprecated alias of `cloud`.
 */
export type NetworkSubnetType = z.infer<typeof networkSubnetTypeSchema>;

/**
 * Network route
 */
export type NetworkRoute = z.infer<typeof networkRouteSchema>;

/**
 * Network subnet
 */
export type NetworkSubnet = z.infer<typeof networkSubnetSchema>;

/**
 * Network protection
 */
export type NetworkProtection = z.infer<typeof networkProtectionSchema>;

/**
 * Hetzner Cloud Network
 * @see https://docs.hetzner.cloud/reference/cloud#networks
 */
export type Network = z.infer<typeof networkSchema>;

/**
 * List Networks query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-list-networks
 */
export interface ListNetworksParams extends PageParams {
  /**
   * Only return the network with this exact name.
   */
  name?: string;
  /**
   * Only return networks matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
}

/**
 * List Networks response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-list-networks
 */
export type ListNetworksResponse = z.infer<typeof listNetworksResponseSchema>;

/**
 * Create Network request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-create-a-network
 */
export type CreateNetworkParams = z.input<typeof createNetworkRequestSchema>;

/**
 * Create Network response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-create-a-network
 */
export type CreateNetworkResponse = z.infer<typeof createNetworkResponseSchema>;

/**
 * Get Network response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-get-a-network
 */
export type GetNetworkResponse = z.infer<typeof getNetworkResponseSchema>;

/**
 * Update Network request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-update-a-network
 */
export type UpdateNetworkParams = z.input<typeof updateNetworkRequestSchema>;

/**
 * Update Network response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-update-a-network
 */
export type UpdateNetworkResponse = z.infer<typeof updateNetworkResponseSchema>;

/**
 * Type of a resource attached to a network
 */
export type NetworkMemberType = z.infer<typeof networkMemberTypeSchema>;

/**
 * Status of a resource within a network
 */
export type NetworkMemberStatus = z.infer<typeof networkMemberStatusSchema>;

/**
 * Network member: a server or load balancer attached to a network
 */
export type NetworkMember = z.infer<typeof networkMemberSchema>;

/**
 * Fields network members can be sorted by
 */
export type NetworkMemberSort = SortParam<"id" | "type" | "status" | "ip">;

/**
 * List Network Members query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks
 */
export interface ListNetworkMembersParams extends PageParams {
  /**
   * Only return members of the given type.
   */
  type?: OneOrMany<NetworkMemberType>;
  /**
   * Only return members with the given status.
   */
  status?: OneOrMany<NetworkMemberStatus>;
  /**
   * Only return members attached to the given subnet (IP range, e.g. `10.0.1.0/24`).
   */
  subnet?: OneOrMany<string>;
  /**
   * Sort the result.
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: OneOrMany<NetworkMemberSort>;
}

/**
 * List Network Members response
 * @see https://docs.hetzner.cloud/reference/cloud#networks
 */
export type ListNetworkMembersResponse = z.infer<typeof listNetworkMembersResponseSchema>;

/**
 * List Network Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-list-actions-for-a-network
 */
export type ListNetworkActionsParams = ListActionsParams;

/**
 * List Network Actions response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-list-actions-for-a-network
 */
export type ListNetworkActionsResponse = ListActionsResponse;

/**
 * Get Network Action response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-get-an-action-for-a-network
 */
export type GetNetworkActionResponse = GetActionResponse;

/**
 * Add Network route request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-add-a-route-to-a-network
 */
export type AddNetworkRouteParams = z.input<typeof addNetworkRouteRequestSchema>;

/**
 * Add Network route response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-add-a-route-to-a-network
 */
export type AddNetworkRouteResponse = ActionResponse;

/**
 * Delete Network route request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-route-from-a-network
 */
export type DeleteNetworkRouteParams = z.input<typeof deleteNetworkRouteRequestSchema>;

/**
 * Delete Network route response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-route-from-a-network
 */
export type DeleteNetworkRouteResponse = ActionResponse;

/**
 * Add Network subnet request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-add-a-subnet-to-a-network
 */
export type AddNetworkSubnetParams = z.input<typeof addNetworkSubnetRequestSchema>;

/**
 * Add Network subnet response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-add-a-subnet-to-a-network
 */
export type AddNetworkSubnetResponse = ActionResponse;

/**
 * Delete Network subnet request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-subnet-from-a-network
 */
export type DeleteNetworkSubnetParams = z.input<typeof deleteNetworkSubnetRequestSchema>;

/**
 * Delete Network subnet response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-subnet-from-a-network
 */
export type DeleteNetworkSubnetResponse = ActionResponse;

/**
 * Change Network IP range request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-change-ip-range-of-a-network
 */
export type ChangeNetworkIpRangeParams = z.input<typeof changeNetworkIpRangeRequestSchema>;

/**
 * Change Network IP range response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-change-ip-range-of-a-network
 */
export type ChangeNetworkIpRangeResponse = ActionResponse;

/**
 * Change Network Protection request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-change-network-protection
 */
export type ChangeNetworkProtectionParams = z.input<typeof changeNetworkProtectionRequestSchema>;

/**
 * Change Network Protection response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-change-network-protection
 */
export type ChangeNetworkProtectionResponse = ActionResponse;
