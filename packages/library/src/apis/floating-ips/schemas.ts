/**
 * Zod schemas for Hetzner Cloud Floating IPs API
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips
 */

import { z } from "zod";
import { actionSchema } from "../actions/schemas";
import { labelsSchema, metaSchema } from "../common/schemas";
import { locationSchema } from "../locations/schemas";

/**
 * Floating IP type schema
 */
export const floatingIPTypeSchema = z.enum(["ipv4", "ipv6"]);

/**
 * Floating IP reverse DNS entry schema
 */
export const floatingIPDnsPointerSchema = z.object({
  ip: z.string(),
  dns_ptr: z.string(),
});

/**
 * Floating IP protection schema
 */
export const floatingIPProtectionSchema = z.object({
  delete: z.boolean(),
});

/**
 * Floating IP schema
 */
export const floatingIPSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  ip: z.string(),
  type: floatingIPTypeSchema,
  /** ID of the server the Floating IP is assigned to, `null` if it is not assigned. */
  server: z.number().nullable(),
  dns_ptr: z.array(floatingIPDnsPointerSchema),
  /** Location the Floating IP was created in. Routing is optimized for this location. */
  home_location: locationSchema,
  blocked: z.boolean(),
  protection: floatingIPProtectionSchema,
  labels: labelsSchema,
  created: z.string(),
});

/**
 * List Floating IPs response schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-list-floating-ips
 */
export const listFloatingIPsResponseSchema = z.object({
  floating_ips: z.array(floatingIPSchema),
  meta: metaSchema.optional(),
});

/**
 * Create Floating IP request schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-create-a-floating-ip
 */
export const createFloatingIPRequestSchema = z.object({
  type: floatingIPTypeSchema,
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  /** ID or name of the home location. Only optional if `server` is passed. */
  home_location: z.string().min(1).optional(),
  /** ID of the server to assign the Floating IP to. */
  server: z.number().int().optional(),
  labels: labelsSchema.optional(),
});

/**
 * Create Floating IP response schema
 *
 * The `action` is only present if the Floating IP is assigned to a server on creation.
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-create-a-floating-ip
 */
export const createFloatingIPResponseSchema = z.object({
  floating_ip: floatingIPSchema,
  action: actionSchema.nullable().optional(),
});

/**
 * Get Floating IP response schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-get-a-floating-ip
 */
export const getFloatingIPResponseSchema = z.object({
  floating_ip: floatingIPSchema,
});

/**
 * Update Floating IP request schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-update-a-floating-ip
 */
export const updateFloatingIPRequestSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  labels: labelsSchema.optional(),
});

/**
 * Update Floating IP response schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-update-a-floating-ip
 */
export const updateFloatingIPResponseSchema = z.object({
  floating_ip: floatingIPSchema,
});

/**
 * Assign Floating IP to Server request schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-assign-a-floating-ip-to-a-server
 */
export const assignFloatingIPToServerRequestSchema = z.object({
  /** ID of the server the Floating IP is assigned to. */
  server: z.number().int(),
});

/**
 * Change Floating IP reverse DNS request schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-change-reverse-dns-records-for-a-floating-ip
 */
export const changeFloatingIPReverseDNSRequestSchema = z.object({
  /** IP address for which to set the reverse DNS entry. */
  ip: z.string().min(1),
  /** Hostname to set as reverse DNS PTR entry. `null` resets it to the default value. */
  dns_ptr: z.string().nullable(),
});

/**
 * Change Floating IP Protection request schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-change-floating-ip-protection
 */
export const changeFloatingIPProtectionRequestSchema = z.object({
  /** If `true`, prevents the Floating IP from being deleted. */
  delete: z.boolean().optional(),
});
