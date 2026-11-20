/**
 * Zod schemas for Hetzner Cloud Server Types API
 * @see https://docs.hetzner.cloud/reference/cloud#server-types
 */

import { z } from "zod";
import { deprecationInfoSchema, metaSchema, priceSchema } from "../common/schemas";

/**
 * CPU architecture schema. Shared by server types, images and ISOs.
 */
export const cpuArchitectureSchema = z.enum(["x86", "arm"]);

/**
 * Server type boot drive storage type schema
 */
export const serverTypeStorageTypeSchema = z.enum(["local", "network"]);

/**
 * Server type CPU type schema
 */
export const serverTypeCpuTypeSchema = z.enum(["shared", "dedicated"]);

/**
 * Price of a server type in a location
 */
export const serverTypePriceSchema = z.object({
  location: z.string(),
  price_hourly: priceSchema,
  price_monthly: priceSchema,
  /** Free traffic per month in bytes. */
  included_traffic: z.number().optional(),
  /** Price per TB of traffic exceeding the included traffic. */
  price_per_tb_traffic: priceSchema.optional(),
});

/**
 * A location a server type is supported in, with per-location details
 * @see https://docs.hetzner.cloud/changelog#2025-09-24-per-location-server-types
 */
export const serverTypeLocationSchema = z.object({
  /** ID of the location. */
  id: z.number(),
  /** Name of the location. */
  name: z.string(),
  /** Deprecation of the server type in this location, `null` if it is not deprecated. */
  deprecation: deprecationInfoSchema.nullable(),
  /** Whether the server type is currently available in this location. */
  available: z.boolean().optional(),
  /** Whether the server type is currently recommended in this location. */
  recommended: z.boolean().optional(),
});

/**
 * Server type schema
 */
export const serverTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  /** Category of the server type, e.g. `Shared vCPU`. */
  category: z.string().optional(),
  cores: z.number(),
  /** Memory in GB. */
  memory: z.number(),
  /** Disk size in GB. */
  disk: z.number(),
  prices: z.array(serverTypePriceSchema),
  storage_type: serverTypeStorageTypeSchema,
  cpu_type: serverTypeCpuTypeSchema,
  architecture: cpuArchitectureSchema,
  /** Locations the server type is supported in, with per-location details. */
  locations: z.array(serverTypeLocationSchema).optional(),
  /**
   * @deprecated Phased out by Hetzner since 2025-09-24. Use `locations[].deprecation` instead.
   * @see https://docs.hetzner.cloud/changelog#2025-09-24-per-location-server-types
   */
  deprecated: z.boolean().nullable().optional(),
  /**
   * @deprecated Phased out by Hetzner since 2025-09-24. Use `locations[].deprecation` instead.
   * @see https://docs.hetzner.cloud/changelog#2025-09-24-per-location-server-types
   */
  deprecation: deprecationInfoSchema.nullable().optional(),
  /**
   * @deprecated Always `null` since 2024-08-05. Use `prices[].included_traffic` instead.
   * @see https://docs.hetzner.cloud/changelog#2024-07-25-cloud-api-returns-traffic-information-in-different-format
   */
  included_traffic: z.number().nullable().optional(),
});

/**
 * List Server Types response schema
 * @see https://docs.hetzner.cloud/reference/cloud#server-types-list-server-types
 */
export const listServerTypesResponseSchema = z.object({
  server_types: z.array(serverTypeSchema),
  meta: metaSchema.optional(),
});

/**
 * Get Server Type response schema
 * @see https://docs.hetzner.cloud/reference/cloud#server-types-get-a-server-type
 */
export const getServerTypeResponseSchema = z.object({
  server_type: serverTypeSchema,
});
