/**
 * Types for Hetzner Cloud Pricing API
 * @see https://docs.hetzner.cloud/reference/cloud#pricing
 */

import type { z } from "zod";
import type {
  floatingIpPricingSchema,
  getPricingResponseSchema,
  imagePricingSchema,
  loadBalancerTypePricingSchema,
  pricingLocationSchema,
  pricingSchema,
  primaryIpPricingSchema,
  serverTypePricingSchema,
  trafficPricingSchema,
  volumePricingSchema,
} from "./schemas";

/**
 * Price of a resource type in a location
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
 * Prices of all resources
 * @see https://docs.hetzner.cloud/reference/cloud#pricing
 */
export type Pricing = z.infer<typeof pricingSchema>;

/**
 * Get Pricing response
 * @see https://docs.hetzner.cloud/reference/cloud#pricing-get-all-prices
 */
export type GetPricingResponse = z.infer<typeof getPricingResponseSchema>;
