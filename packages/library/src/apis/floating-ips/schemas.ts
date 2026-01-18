/**
 * Zod schemas for Hetzner Cloud Floating IPs API
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips
 */

import { z } from "zod";
import { actionSchema, actionResourceSchema } from "@hcloud-js/apis/actions/schemas.js";
import { paginationMetaSchema } from "@hcloud-js/apis/common/schemas.js";
import { locationSchema } from "@hcloud-js/apis/servers/schemas.js";

/**
 * Floating IP type schema
 */
export const floatingIpTypeSchema = z.enum(["ipv4", "ipv6"]);

/**
 * Floating IP DNS pointer schema
 */
export const floatingIpDnsPointerSchema = z.object({
  ip: z.string(),
  dns_ptr: z.string(),
});

/**
 * Floating IP protection schema
 */
export const floatingIpProtectionSchema = z.object({
  delete: z.boolean(),
});

/**
 * Floating IP schema
 */
export const floatingIpSchema = z
  .object({
    id: z.number(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    ip: z.string(),
    type: floatingIpTypeSchema,
    server: z.number().nullable(),
    dns_ptr: z.array(floatingIpDnsPointerSchema),
    location: locationSchema,
    labels: z.record(z.string(), z.string()),
    blocking: z.array(actionResourceSchema).optional(),
    created: z.string(),
    protection: floatingIpProtectionSchema,
  })
  .passthrough();

/**
 * List Floating IPs response schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-list-floating-ips
 */
export const listFloatingIPsResponseSchema = z.object({
  floating_ips: z.array(floatingIpSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Create Floating IP request schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-create-a-floating-ip
 */
export const createFloatingIPRequestSchema = z.object({
  type: floatingIpTypeSchema,
  name: z.string().optional(),
  description: z.string().nullable().optional(),
  location: z.string().optional(),
  server: z.number().optional(),
  home_location: z.string().optional(),
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Create Floating IP response schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-create-a-floating-ip
 */
export const createFloatingIPResponseSchema = z.object({
  floating_ip: floatingIpSchema,
  action: actionSchema,
});

/**
 * Get Floating IP response schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-get-a-floating-ip
 */
export const getFloatingIPResponseSchema = z.object({
  floating_ip: floatingIpSchema,
});

/**
 * Update Floating IP request schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-update-a-floating-ip
 */
export const updateFloatingIPRequestSchema = z.object({
  name: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Update Floating IP response schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-update-a-floating-ip
 */
export const updateFloatingIPResponseSchema = z.object({
  floating_ip: floatingIpSchema,
});

/**
 * Delete Floating IP response schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-delete-a-floating-ip
 */
export const deleteFloatingIPResponseSchema = z.object({
  action: actionSchema.optional(),
});

/**
 * List Floating IP Actions response schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-list-actions-for-a-floating-ip
 */
export const listFloatingIPActionsResponseSchema = z.object({
  actions: z.array(actionSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Get Floating IP Action response schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-get-an-action-for-a-floating-ip
 */
export const getFloatingIPActionResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Assign Floating IP to Server request schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-assign-a-floating-ip-to-a-server
 */
export const assignFloatingIPToServerRequestSchema = z.object({
  assignee_id: z.number(),
});

/**
 * Assign Floating IP to Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-assign-a-floating-ip-to-a-server
 */
export const assignFloatingIPToServerResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Change Floating IP reverse DNS request schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-change-reverse-dns-records-for-a-floating-ip
 */
export const changeFloatingIPReverseDNSRequestSchema = z.object({
  ip: z.string(),
  dns_ptr: z.string().nullable(),
});

/**
 * Change Floating IP reverse DNS response schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-change-reverse-dns-records-for-a-floating-ip
 */
export const changeFloatingIPReverseDNSResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Change Floating IP Protection request schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-change-floating-ip-protection
 */
export const changeFloatingIPProtectionRequestSchema = z.object({
  delete: z.boolean(),
});

/**
 * Change Floating IP Protection response schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-change-floating-ip-protection
 */
export const changeFloatingIPProtectionResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Unassign Floating IP request schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-unassign-a-floating-ip
 */
export const unassignFloatingIPRequestSchema = z.object({});

/**
 * Unassign Floating IP response schema
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-unassign-a-floating-ip
 */
export const unassignFloatingIPResponseSchema = z.object({
  action: actionSchema,
});
