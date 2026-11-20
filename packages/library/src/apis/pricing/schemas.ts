/**
 * Zod schemas for Hetzner Cloud Pricing API
 * @see https://docs.hetzner.cloud/reference/cloud#pricing
 */

import { z } from "zod";
import { priceSchema } from "../common/schemas";

/**
 * Price of a resource type in a location
 */
export const pricingLocationSchema = z.object({
  location: z.string(),
  price_hourly: priceSchema.optional(),
  price_monthly: priceSchema.optional(),
  /** Free traffic per month in bytes. */
  included_traffic: z.number().optional(),
  /** Price per TB of traffic exceeding the included traffic. */
  price_per_tb_traffic: priceSchema.optional(),
});

/**
 * Server type pricing schema
 */
export const serverTypePricingSchema = z.object({
  id: z.number(),
  name: z.string(),
  prices: z.array(pricingLocationSchema),
});

/**
 * Load Balancer type pricing schema
 */
export const loadBalancerTypePricingSchema = z.object({
  id: z.number(),
  name: z.string(),
  prices: z.array(pricingLocationSchema),
});

/**
 * Volume pricing schema
 */
export const volumePricingSchema = z.object({
  price_per_gb_month: priceSchema,
});

/**
 * Floating IP pricing schema
 */
export const floatingIpPricingSchema = z.object({
  price_monthly: priceSchema,
});

/**
 * Primary IP pricing schema: prices of one Primary IP type per location
 */
export const primaryIpPricingSchema = z.object({
  /** Type of the Primary IP, e.g. `ipv4` or `ipv6`. */
  type: z.string().optional(),
  prices: z.array(pricingLocationSchema).optional(),
  price_monthly: priceSchema.optional(),
});

/**
 * Traffic pricing schema
 */
export const trafficPricingSchema = z.object({
  price_per_tb: priceSchema,
});

/**
 * Image pricing schema
 */
export const imagePricingSchema = z.object({
  price_per_gb_month: priceSchema,
});

/**
 * Pricing schema: prices of all resources
 */
export const pricingSchema = z.object({
  /** Currency the prices are expressed in, e.g. `EUR`. */
  currency: z.string(),
  /** VAT rate used for the gross prices. */
  vat_rate: z.string(),
  image: imagePricingSchema.optional(),
  volume: volumePricingSchema.optional(),
  server_types: z.array(serverTypePricingSchema).optional(),
  load_balancer_types: z.array(loadBalancerTypePricingSchema).optional(),
  primary_ips: z.array(primaryIpPricingSchema).optional(),
  /** Prices of Floating IPs per type and location. */
  floating_ips: z
    .array(
      z.object({
        type: z.string(),
        prices: z.array(pricingLocationSchema),
      }),
    )
    .optional(),
  /** Costs of server backups as a percentage of the server price. */
  server_backup: z.object({ percentage: z.string() }).optional(),
  /** @deprecated Use `floating_ips` instead. */
  floating_ip: floatingIpPricingSchema.nullable().optional(),
  /** @deprecated Use `floating_ips` instead. */
  floating_ip_price_monthly: priceSchema.nullable().optional(),
  /** @deprecated Use `prices[].price_per_tb_traffic` of the server and load balancer types instead. */
  traffic: trafficPricingSchema.nullable().optional(),
});

/**
 * Get Pricing response schema
 * @see https://docs.hetzner.cloud/reference/cloud#pricing-get-all-prices
 */
export const getPricingResponseSchema = z.object({
  pricing: pricingSchema,
});
