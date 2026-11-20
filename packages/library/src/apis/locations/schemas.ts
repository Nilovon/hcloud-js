/**
 * Zod schemas for Hetzner Cloud Locations API
 * @see https://docs.hetzner.cloud/reference/cloud#locations
 */

import { z } from "zod";
import { metaSchema } from "../common/schemas";

/**
 * Location schema
 */
export const locationSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  country: z.string(),
  city: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  network_zone: z.string(),
});

/**
 * List Locations response schema
 * @see https://docs.hetzner.cloud/reference/cloud#locations-list-locations
 */
export const listLocationsResponseSchema = z.object({
  locations: z.array(locationSchema),
  meta: metaSchema.optional(),
});

/**
 * Get Location response schema
 * @see https://docs.hetzner.cloud/reference/cloud#locations-get-a-location
 */
export const getLocationResponseSchema = z.object({
  location: locationSchema,
});
