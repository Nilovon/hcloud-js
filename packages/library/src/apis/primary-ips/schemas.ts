/**
 * Zod schemas for Hetzner Cloud Primary IPs API
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips
 */

import { z } from "zod";
import { actionSchema } from "../actions/schemas";
import { labelsSchema, metaSchema } from "../common/schemas";
import { datacenterSchema } from "../datacenters/schemas";
import { locationSchema } from "../locations/schemas";

/**
 * Primary IP type schema
 */
export const primaryIPTypeSchema = z.enum(["ipv4", "ipv6"]);

/**
 * Primary IP reverse DNS entry schema
 */
export const primaryIPDnsPointerSchema = z.object({
  ip: z.string(),
  dns_ptr: z.string(),
});

/**
 * Primary IP protection schema
 */
export const primaryIPProtectionSchema = z.object({
  delete: z.boolean(),
});

/**
 * Types of resources a Primary IP can be assigned to
 */
export const primaryIPAssigneeTypeSchema = z.enum(["server", "load_balancer"]);

/**
 * Primary IP schema
 */
export const primaryIPSchema = z.object({
  id: z.number(),
  name: z.string(),
  ip: z.string(),
  type: primaryIPTypeSchema,
  /** ID of the resource the Primary IP is assigned to, `null` if it is not assigned. */
  assignee_id: z.number().nullable(),
  /**
   * Type of the resource the Primary IP is assigned to: `server`, `load_balancer`
   * or `unassigned`. More types may be added by Hetzner.
   */
  assignee_type: z.string(),
  auto_delete: z.boolean(),
  blocked: z.boolean(),
  /** Location the Primary IP was created in. */
  location: locationSchema,
  /**
   * @deprecated Removed from the API in favour of `location`.
   */
  datacenter: datacenterSchema.nullable().optional(),
  dns_ptr: z.array(primaryIPDnsPointerSchema),
  labels: labelsSchema,
  protection: primaryIPProtectionSchema,
  created: z.string(),
});

/**
 * List Primary IPs response schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-list-primary-ips
 */
export const listPrimaryIPsResponseSchema = z.object({
  primary_ips: z.array(primaryIPSchema),
  meta: metaSchema.optional(),
});

/**
 * Create Primary IP request schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-create-a-primary-ip
 */
export const createPrimaryIPRequestSchema = z.object({
  name: z.string().min(1),
  type: primaryIPTypeSchema,
  /** ID or name of the location. Can be omitted if `assignee_id` is passed. */
  location: z.string().min(1).optional(),
  /** ID of the resource the Primary IP is assigned to. */
  assignee_id: z.number().int().optional(),
  /** Type of the resource the Primary IP is assigned to. Pass it together with `assignee_id`. */
  assignee_type: primaryIPAssigneeTypeSchema.optional(),
  /** Delete the Primary IP when the resource it is assigned to is deleted. */
  auto_delete: z.boolean().optional(),
  labels: labelsSchema.optional(),
});

/**
 * Create Primary IP response schema
 *
 * The `action` is only present if the Primary IP is assigned to a resource on creation.
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-create-a-primary-ip
 */
export const createPrimaryIPResponseSchema = z.object({
  primary_ip: primaryIPSchema,
  action: actionSchema.nullable().optional(),
});

/**
 * Get Primary IP response schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-get-a-primary-ip
 */
export const getPrimaryIPResponseSchema = z.object({
  primary_ip: primaryIPSchema,
});

/**
 * Update Primary IP request schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-update-a-primary-ip
 */
export const updatePrimaryIPRequestSchema = z.object({
  name: z.string().min(1).optional(),
  /** Delete the Primary IP when the resource it is assigned to is deleted. */
  auto_delete: z.boolean().optional(),
  labels: labelsSchema.optional(),
});

/**
 * Update Primary IP response schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-update-a-primary-ip
 */
export const updatePrimaryIPResponseSchema = z.object({
  primary_ip: primaryIPSchema,
});

/**
 * Assign Primary IP to resource request schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-assign-a-primary-ip-to-a-resource
 */
export const assignPrimaryIPToResourceRequestSchema = z.object({
  /** ID of the resource the Primary IP is assigned to. */
  assignee_id: z.number().int(),
  /** Type of the resource the Primary IP is assigned to. */
  assignee_type: primaryIPAssigneeTypeSchema,
});

/**
 * Change Primary IP reverse DNS request schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-change-reverse-dns-records-for-a-primary-ip
 */
export const changePrimaryIPReverseDNSRequestSchema = z.object({
  /** IP address for which to set the reverse DNS entry. */
  ip: z.string().min(1),
  /** Hostname to set as reverse DNS PTR entry. `null` resets it to the default value. */
  dns_ptr: z.string().nullable(),
});

/**
 * Change Primary IP Protection request schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-change-primary-ip-protection
 */
export const changePrimaryIPProtectionRequestSchema = z.object({
  /** If `true`, prevents the Primary IP from being deleted. */
  delete: z.boolean().optional(),
});
