/**
 * Zod schemas for Hetzner Cloud Networks API
 * @see https://docs.hetzner.cloud/reference/cloud#networks
 */

import { z } from "zod";
import { labelsSchema, metaSchema } from "../common/schemas";

/**
 * Network subnet type schema
 *
 * - `cloud`: connects cloud servers and load balancers
 * - `vswitch`: connects cloud resources with dedicated servers through a vSwitch
 * - `server`: deprecated alias of `cloud`
 */
export const networkSubnetTypeSchema = z.enum(["cloud", "server", "vswitch"]);

/**
 * Network subnet schema
 */
export const networkSubnetSchema = z.object({
  type: networkSubnetTypeSchema,
  ip_range: z.string(),
  network_zone: z.string(),
  gateway: z.string(),
  vswitch_id: z.number().nullable().optional(),
});

/**
 * Network route schema
 */
export const networkRouteSchema = z.object({
  destination: z.string(),
  gateway: z.string(),
});

/**
 * Network protection schema
 */
export const networkProtectionSchema = z.object({
  delete: z.boolean(),
});

/**
 * Network schema
 */
export const networkSchema = z.object({
  id: z.number(),
  name: z.string(),
  ip_range: z.string(),
  subnets: z.array(networkSubnetSchema),
  routes: z.array(networkRouteSchema),
  expose_routes_to_vswitch: z.boolean(),
  servers: z.array(z.number()),
  load_balancers: z.array(z.number()).optional(),
  protection: networkProtectionSchema,
  labels: labelsSchema,
  created: z.string(),
});

/**
 * List Networks response schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-list-networks
 */
export const listNetworksResponseSchema = z.object({
  networks: z.array(networkSchema),
  meta: metaSchema.optional(),
});

/**
 * Subnet of a Create Network / Add Subnet request
 */
export const networkSubnetRequestSchema = z.object({
  type: networkSubnetTypeSchema,
  network_zone: z.string().min(1),
  ip_range: z.string().min(1).optional(),
  vswitch_id: z.number().optional(),
});

/**
 * Route of a Create Network / Add Route / Delete Route request
 */
export const networkRouteRequestSchema = z.object({
  destination: z.string().min(1),
  gateway: z.string().min(1),
});

/**
 * Create Network request schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-create-a-network
 */
export const createNetworkRequestSchema = z.object({
  name: z.string().min(1),
  ip_range: z.string().min(1),
  subnets: z.array(networkSubnetRequestSchema).optional(),
  routes: z.array(networkRouteRequestSchema).optional(),
  expose_routes_to_vswitch: z.boolean().optional(),
  labels: labelsSchema.optional(),
});

/**
 * Create Network response schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-create-a-network
 */
export const createNetworkResponseSchema = z.object({
  network: networkSchema,
});

/**
 * Get Network response schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-get-a-network
 */
export const getNetworkResponseSchema = z.object({
  network: networkSchema,
});

/**
 * Update Network request schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-update-a-network
 */
export const updateNetworkRequestSchema = z.object({
  name: z.string().min(1).optional(),
  expose_routes_to_vswitch: z.boolean().optional(),
  labels: labelsSchema.optional(),
});

/**
 * Update Network response schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-update-a-network
 */
export const updateNetworkResponseSchema = z.object({
  network: networkSchema,
});

/**
 * Network member type schema
 */
export const networkMemberTypeSchema = z.enum(["server", "load_balancer"]);

/**
 * Network member status schema
 *
 * - `ok`: attached, the network configuration is up to date
 * - `attaching` / `detaching` / `updating`: an operation is in progress
 * - `error`: the last operation failed, the network configuration might be out of date
 */
export const networkMemberStatusSchema = z.enum([
  "ok",
  "attaching",
  "detaching",
  "updating",
  "error",
]);

/**
 * Network member schema: a resource attached to a network
 */
export const networkMemberSchema = z.object({
  id: z.number(),
  type: networkMemberTypeSchema,
  ip: z.string(),
  alias_ips: z.array(z.string()),
  subnet: z.string(),
  status: networkMemberStatusSchema,
});

/**
 * List Network Members response schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks
 */
export const listNetworkMembersResponseSchema = z.object({
  members: z.array(networkMemberSchema),
  meta: metaSchema.optional(),
});

/**
 * Add Network route request schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-add-a-route-to-a-network
 */
export const addNetworkRouteRequestSchema = networkRouteRequestSchema;

/**
 * Delete Network route request schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-route-from-a-network
 */
export const deleteNetworkRouteRequestSchema = networkRouteRequestSchema;

/**
 * Add Network subnet request schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-add-a-subnet-to-a-network
 */
export const addNetworkSubnetRequestSchema = networkSubnetRequestSchema;

/**
 * Delete Network subnet request schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-subnet-from-a-network
 */
export const deleteNetworkSubnetRequestSchema = z.object({
  ip_range: z.string().min(1),
});

/**
 * Change Network IP range request schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-change-ip-range-of-a-network
 */
export const changeNetworkIpRangeRequestSchema = z.object({
  ip_range: z.string().min(1),
});

/**
 * Change Network Protection request schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-change-network-protection
 */
export const changeNetworkProtectionRequestSchema = z.object({
  delete: z.boolean().optional(),
});
