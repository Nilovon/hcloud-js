/**
 * Types for Hetzner Cloud Networks API
 * Types are inferred from Zod schemas
 * @see https://docs.hetzner.cloud/reference/cloud#networks
 */

// biome-ignore assist/source/organizeImports: we need to import the schemas first
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
  networkSchema,
  networkSubnetTypeSchema,
  networkRouteSchema,
  networkSubnetSchema,
  networkProtectionSchema,
} from "./schemas.js";
import type { z } from "zod";

/**
 * Network subnet type
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
 * Network
 */
export type Network = z.infer<typeof networkSchema>;

/**
 * List Networks query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-list-networks
 */
export interface ListNetworksParams {
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
 * List Networks response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-list-networks
 */
export type ListNetworksResponse = z.infer<typeof listNetworksResponseSchema>;

/**
 * Create Network parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-create-a-network
 */
export type CreateNetworkParams = z.infer<typeof createNetworkRequestSchema>;

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
 * Update Network parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-update-a-network
 */
export type UpdateNetworkParams = z.infer<typeof updateNetworkRequestSchema>;

/**
 * Update Network response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-update-a-network
 */
export type UpdateNetworkResponse = z.infer<typeof updateNetworkResponseSchema>;

/**
 * Delete Network response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-network
 */
export type DeleteNetworkResponse = z.infer<typeof deleteNetworkResponseSchema>;

/**
 * List Network Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-list-actions-for-a-network
 */
export interface ListNetworkActionsParams {
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
 * List Network Actions response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-list-actions-for-a-network
 */
export type ListNetworkActionsResponse = z.infer<typeof listNetworkActionsResponseSchema>;

/**
 * Get Network Action response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-get-an-action-for-a-network
 */
export type GetNetworkActionResponse = z.infer<typeof getNetworkActionResponseSchema>;

/**
 * Add Network route parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-add-a-route-to-a-network
 */
export type AddNetworkRouteParams = z.infer<typeof addNetworkRouteRequestSchema>;

/**
 * Add Network route response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-add-a-route-to-a-network
 */
export type AddNetworkRouteResponse = z.infer<typeof addNetworkRouteResponseSchema>;

/**
 * Delete Network route parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-route-from-a-network
 */
export type DeleteNetworkRouteParams = z.infer<typeof deleteNetworkRouteRequestSchema>;

/**
 * Delete Network route response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-route-from-a-network
 */
export type DeleteNetworkRouteResponse = z.infer<typeof deleteNetworkRouteResponseSchema>;

/**
 * Add Network subnet parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-add-a-subnet-to-a-network
 */
export type AddNetworkSubnetParams = z.infer<typeof addNetworkSubnetRequestSchema>;

/**
 * Add Network subnet response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-add-a-subnet-to-a-network
 */
export type AddNetworkSubnetResponse = z.infer<typeof addNetworkSubnetResponseSchema>;

/**
 * Delete Network subnet parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-subnet-from-a-network
 */
export type DeleteNetworkSubnetParams = z.infer<typeof deleteNetworkSubnetRequestSchema>;

/**
 * Delete Network subnet response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-subnet-from-a-network
 */
export type DeleteNetworkSubnetResponse = z.infer<typeof deleteNetworkSubnetResponseSchema>;

/**
 * Change Network IP range parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-change-ip-range-of-a-network
 */
export type ChangeNetworkIpRangeParams = z.infer<typeof changeNetworkIpRangeRequestSchema>;

/**
 * Change Network IP range response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-change-ip-range-of-a-network
 */
export type ChangeNetworkIpRangeResponse = z.infer<typeof changeNetworkIpRangeResponseSchema>;

/**
 * Change Network Protection parameters
 * @see https://docs.hetzner.cloud/reference/cloud#networks-change-network-protection
 */
export type ChangeNetworkProtectionParams = z.infer<
  typeof changeNetworkProtectionRequestSchema
>;

/**
 * Change Network Protection response
 * @see https://docs.hetzner.cloud/reference/cloud#networks-change-network-protection
 */
export type ChangeNetworkProtectionResponse = z.infer<
  typeof changeNetworkProtectionResponseSchema
>;
