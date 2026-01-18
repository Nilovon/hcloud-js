/**
 * Types for Hetzner Cloud Pricing API
 * Types are inferred from Zod schemas
 * @see https://docs.hetzner.cloud/reference/cloud#pricing
 */

// biome-ignore assist/source/organizeImports: we need to import the schemas first
import {
  getPricingResponseSchema,
  priceSchema,
  pricingLocationSchema,
  serverTypePricingSchema,
  loadBalancerTypePricingSchema,
  volumePricingSchema,
  floatingIpPricingSchema,
  primaryIpPricingSchema,
  trafficPricingSchema,
  imagePricingSchema,
} from "@/apis/pricing/schemas";
import type { z } from "zod";

/**
 * Price
 */
export type Price = z.infer<typeof priceSchema>;

/**
 * Pricing location
 */
export type PricingLocation = z.infer<typeof pricingLocationSchema>;

/**
 * Server type pricing
 */
export type ServerTypePricing = z.infer<typeof serverTypePricingSchema>;

/**
 * Load Balancer type pricing
 */
export type LoadBalancerTypePricing = z.infer<typeof loadBalancerTypePricingSchema>;

/**
 * Volume pricing
 */
export type VolumePricing = z.infer<typeof volumePricingSchema>;

/**
 * Floating IP pricing
 */
export type FloatingIpPricing = z.infer<typeof floatingIpPricingSchema>;

/**
 * Primary IP pricing
 */
export type PrimaryIpPricing = z.infer<typeof primaryIpPricingSchema>;

/**
 * Traffic pricing
 */
export type TrafficPricing = z.infer<typeof trafficPricingSchema>;

/**
 * Image pricing
 */
export type ImagePricing = z.infer<typeof imagePricingSchema>;

/**
 * Get Pricing response
 * @see https://docs.hetzner.cloud/reference/cloud#pricing-get-all-prices
 */
export type GetPricingResponse = z.infer<typeof getPricingResponseSchema>;
