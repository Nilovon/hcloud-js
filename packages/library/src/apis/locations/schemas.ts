/**
 * Zod schemas for Hetzner Cloud Locations API
 * @see https://docs.hetzner.cloud/reference/cloud#locations
 */

import { z } from "zod";
import { paginationMetaSchema } from "@hcloud-js/apis/common/schemas.js";

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
 * Datacenter server types schema
 */
export const datacenterServerTypesSchema = z.object({
  supported: z.array(z.number()),
  available: z.array(z.number()),
  available_for_migration: z.array(z.number()),
});

/**
 * Datacenter schema
 */
export const datacenterSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  location: locationSchema,
  server_types: datacenterServerTypesSchema,
});

/**
 * List Locations response schema
 * @see https://docs.hetzner.cloud/reference/cloud#locations-list-locations
 */
export const listLocationsResponseSchema = z.object({
  locations: z.array(locationSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Get Location response schema
 * @see https://docs.hetzner.cloud/reference/cloud#locations-get-a-location
 */
export const getLocationResponseSchema = z.object({
  location: locationSchema,
});

/**
 * List Data Centers response schema
 * @see https://docs.hetzner.cloud/reference/cloud#data-centers-list-data-centers
 */
export const listDataCentersResponseSchema = z.object({
  datacenters: z.array(datacenterSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Get Data Center response schema
 * @see https://docs.hetzner.cloud/reference/cloud#data-centers-get-a-data-center
 */
export const getDataCenterResponseSchema = z.object({
  datacenter: datacenterSchema,
});
