/**
 * Zod schemas for Hetzner Cloud Load Balancer Types API
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancer-types
 */

import { z } from "zod";
import { deprecationInfoSchema, metaSchema, priceSchema } from "../common/schemas";

/**
 * Price of a Load Balancer Type in a location
 */
export const loadBalancerTypePriceSchema = z.object({
  location: z.string(),
  price_hourly: priceSchema,
  price_monthly: priceSchema,
  included_traffic: z.number().optional(),
  price_per_tb_traffic: priceSchema.optional(),
});

/**
 * Load Balancer Type schema
 */
export const loadBalancerTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  max_connections: z.number(),
  max_services: z.number(),
  max_targets: z.number(),
  max_assigned_certificates: z.number(),
  /**
   * Point in time the type was deprecated. Use `deprecation` instead.
   */
  deprecated: z.string().nullable().optional(),
  deprecation: deprecationInfoSchema.nullable().optional(),
  prices: z.array(loadBalancerTypePriceSchema),
});

/**
 * List Load Balancer Types response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancer-types-list-load-balancer-types
 */
export const listLoadBalancerTypesResponseSchema = z.object({
  load_balancer_types: z.array(loadBalancerTypeSchema),
  meta: metaSchema.optional(),
});

/**
 * Get Load Balancer Type response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancer-types-get-a-load-balancer-type
 */
export const getLoadBalancerTypeResponseSchema = z.object({
  load_balancer_type: loadBalancerTypeSchema,
});
