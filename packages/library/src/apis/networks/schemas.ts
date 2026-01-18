/**
 * Zod schemas for Hetzner Cloud Networks API
 * @see https://docs.hetzner.cloud/reference/cloud#networks
 */

import { z } from "zod";
import { actionSchema, actionResourceSchema } from "@/apis/actions/schemas";
import { paginationMetaSchema } from "@/apis/common/schemas";
import { locationSchema } from "@/apis/servers/schemas";

/**
 * Network route destination schema
 */
export const networkRouteDestinationSchema = z.object({
  ip: z.string(),
});

/**
 * Network route gateway schema
 */
export const networkRouteGatewaySchema = z.object({
  ip: z.string(),
});

/**
 * Network route schema
 */
export const networkRouteSchema = z.object({
  destination: networkRouteDestinationSchema,
  gateway: networkRouteGatewaySchema,
});

/**
 * Network subnet type schema
 */
export const networkSubnetTypeSchema = z.enum(["cloud", "server", "vswitch"]);

/**
 * Network subnet schema
 */
export const networkSubnetSchema = z.object({
  type: networkSubnetTypeSchema,
  ip_range: z.string().nullable(),
  network_zone: z.string(),
  gateway: z.string().nullable(),
  vswitch_id: z.number().nullable(),
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
export const networkSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    ip_range: z.string(),
    subnets: z.array(networkSubnetSchema),
    routes: z.array(networkRouteSchema),
    servers: z.array(z.number()),
    load_balancers: z.array(z.number()).optional(),
    protection: networkProtectionSchema,
    labels: z.record(z.string(), z.string()),
    created: z.string(),
    expose_routes_to_vswitch: z.boolean().optional(),
    blocking: z.array(actionResourceSchema).optional(),
  })
  .passthrough();

/**
 * List Networks response schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-list-networks
 */
export const listNetworksResponseSchema = z.object({
  networks: z.array(networkSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Create Network request schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-create-a-network
 */
export const createNetworkRequestSchema = z.object({
  name: z.string(),
  ip_range: z.string(),
  subnets: z
    .array(
      z.object({
        type: networkSubnetTypeSchema,
        network_zone: z.string(),
        ip_range: z.string().optional(),
        vswitch_id: z.number().optional(),
      }),
    )
    .optional(),
  routes: z
    .array(
      z.object({
        destination: z.string(),
        gateway: z.string(),
      }),
    )
    .optional(),
  labels: z.record(z.string(), z.string()).optional(),
  expose_routes_to_vswitch: z.boolean().optional(),
});

/**
 * Create Network response schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-create-a-network
 */
export const createNetworkResponseSchema = z.object({
  network: networkSchema,
  action: actionSchema.optional(),
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
  name: z.string().optional(),
  labels: z.record(z.string(), z.string()).optional(),
  expose_routes_to_vswitch: z.boolean().optional(),
});

/**
 * Update Network response schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-update-a-network
 */
export const updateNetworkResponseSchema = z.object({
  network: networkSchema,
});

/**
 * Delete Network response schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-network
 */
export const deleteNetworkResponseSchema = z.object({});

/**
 * List Network Actions response schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-list-actions-for-a-network
 */
export const listNetworkActionsResponseSchema = z.object({
  actions: z.array(actionSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Get Network Action response schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-get-an-action-for-a-network
 */
export const getNetworkActionResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Add Network route request schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-add-a-route-to-a-network
 */
export const addNetworkRouteRequestSchema = z.object({
  destination: z.string(),
  gateway: z.string(),
});

/**
 * Add Network route response schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-add-a-route-to-a-network
 */
export const addNetworkRouteResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Delete Network route request schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-route-from-a-network
 */
export const deleteNetworkRouteRequestSchema = z.object({
  destination: z.string(),
  gateway: z.string(),
});

/**
 * Delete Network route response schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-route-from-a-network
 */
export const deleteNetworkRouteResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Add Network subnet request schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-add-a-subnet-to-a-network
 */
export const addNetworkSubnetRequestSchema = z.object({
  type: networkSubnetTypeSchema,
  network_zone: z.string(),
  ip_range: z.string().optional(),
  vswitch_id: z.number().optional(),
});

/**
 * Add Network subnet response schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-add-a-subnet-to-a-network
 */
export const addNetworkSubnetResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Delete Network subnet request schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-subnet-from-a-network
 */
export const deleteNetworkSubnetRequestSchema = z.object({
  ip_range: z.string(),
});

/**
 * Delete Network subnet response schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-delete-a-subnet-from-a-network
 */
export const deleteNetworkSubnetResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Change Network IP range request schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-change-ip-range-of-a-network
 */
export const changeNetworkIpRangeRequestSchema = z.object({
  ip_range: z.string(),
});

/**
 * Change Network IP range response schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-change-ip-range-of-a-network
 */
export const changeNetworkIpRangeResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Change Network Protection request schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-change-network-protection
 */
export const changeNetworkProtectionRequestSchema = z.object({
  delete: z.boolean(),
});

/**
 * Change Network Protection response schema
 * @see https://docs.hetzner.cloud/reference/cloud#networks-change-network-protection
 */
export const changeNetworkProtectionResponseSchema = z.object({
  action: actionSchema,
});
