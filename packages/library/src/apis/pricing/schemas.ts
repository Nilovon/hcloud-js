/**
 * Zod schemas for Hetzner Cloud Pricing API
 * @see https://docs.hetzner.cloud/reference/cloud#pricing
 */

import { z } from "zod";

/**
 * Price schema
 */
export const priceSchema = z.object({
  net: z.string(),
  gross: z.string(),
});

/**
 * Pricing location schema
 */
export const pricingLocationSchema = z.object({
  location: z.string(),
  price_hourly: priceSchema,
  price_monthly: priceSchema,
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
 * Primary IP pricing schema
 */
export const primaryIpPricingSchema = z.object({
  price_monthly: priceSchema,
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
 * Get Pricing response schema
 * @see https://docs.hetzner.cloud/reference/cloud#pricing-get-all-prices
 */
export const getPricingResponseSchema = z.object({
  currency: z.string(),
  vat_rate: z.string(),
  image: imagePricingSchema,
  floating_ip: floatingIpPricingSchema,
  floating_ip_price_monthly: priceSchema,
  primary_ips: z.array(primaryIpPricingSchema).optional(),
  server_types: z.array(serverTypePricingSchema),
  load_balancer_types: z.array(loadBalancerTypePricingSchema).optional(),
  volume: volumePricingSchema,
  traffic: trafficPricingSchema,
});
