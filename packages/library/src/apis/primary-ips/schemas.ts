/**
 * Zod schemas for Hetzner Cloud Primary IPs API
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips
 */

import { z } from "zod";
import { actionSchema, actionResourceSchema } from "@hcloud-js/apis/actions/schemas.js";
import { paginationMetaSchema } from "@hcloud-js/apis/common/schemas.js";
import { locationSchema } from "@hcloud-js/apis/servers/schemas.js";

/**
 * Primary IP type schema
 */
export const primaryIpTypeSchema = z.enum(["ipv4", "ipv6"]);

/**
 * Primary IP DNS pointer schema
 */
export const primaryIpDnsPointerSchema = z.object({
  ip: z.string(),
  dns_ptr: z.string(),
});

/**
 * Primary IP protection schema
 */
export const primaryIpProtectionSchema = z.object({
  delete: z.boolean(),
});

/**
 * Primary IP assignee type schema
 */
export const primaryIpAssigneeTypeSchema = z.enum(["server"]);

/**
 * Primary IP schema
 */
export const primaryIpSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    ip: z.string(),
    type: primaryIpTypeSchema,
    assignee_id: z.number().nullable(),
    assignee_type: primaryIpAssigneeTypeSchema.nullable(),
    auto_delete: z.boolean(),
    blocked: z.boolean(),
    created: z.string(),
    datacenter: z
      .object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        location: locationSchema,
        server_types: z.object({
          supported: z.array(z.number()),
          available: z.array(z.number()),
          available_for_migration: z.array(z.number()),
        }),
      })
      .nullable(),
    dns_ptr: z.array(primaryIpDnsPointerSchema),
    labels: z.record(z.string(), z.string()),
    protection: primaryIpProtectionSchema,
  })
  .passthrough();

/**
 * List Primary IPs response schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-list-primary-ips
 */
export const listPrimaryIPsResponseSchema = z.object({
  primary_ips: z.array(primaryIpSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Create Primary IP request schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-create-a-primary-ip
 */
export const createPrimaryIPRequestSchema = z.object({
  name: z.string(),
  type: primaryIpTypeSchema,
  assignee_id: z.number().optional(),
  assignee_type: primaryIpAssigneeTypeSchema.optional(),
  auto_delete: z.boolean().optional(),
  datacenter: z.string().optional(),
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Create Primary IP response schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-create-a-primary-ip
 */
export const createPrimaryIPResponseSchema = z.object({
  primary_ip: primaryIpSchema,
  action: actionSchema,
});

/**
 * Get Primary IP response schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-get-a-primary-ip
 */
export const getPrimaryIPResponseSchema = z.object({
  primary_ip: primaryIpSchema,
});

/**
 * Update Primary IP request schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-update-a-primary-ip
 */
export const updatePrimaryIPRequestSchema = z.object({
  name: z.string().optional(),
  auto_delete: z.boolean().optional(),
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Update Primary IP response schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-update-a-primary-ip
 */
export const updatePrimaryIPResponseSchema = z.object({
  primary_ip: primaryIpSchema,
});

/**
 * Delete Primary IP response schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-delete-a-primary-ip
 */
export const deletePrimaryIPResponseSchema = z.object({
  action: actionSchema.optional(),
});

/**
 * List Primary IP Actions response schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-list-actions-for-a-primary-ip
 */
export const listPrimaryIPActionsResponseSchema = z.object({
  actions: z.array(actionSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Get Primary IP Action response schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-get-an-action-for-a-primary-ip
 */
export const getPrimaryIPActionResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Assign Primary IP to resource request schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-assign-a-primary-ip-to-a-resource
 */
export const assignPrimaryIPToResourceRequestSchema = z.object({
  assignee_id: z.number(),
});

/**
 * Assign Primary IP to resource response schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-assign-a-primary-ip-to-a-resource
 */
export const assignPrimaryIPToResourceResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Change Primary IP reverse DNS request schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-change-reverse-dns-records-for-a-primary-ip
 */
export const changePrimaryIPReverseDNSRequestSchema = z.object({
  ip: z.string(),
  dns_ptr: z.string().nullable(),
});

/**
 * Change Primary IP reverse DNS response schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-change-reverse-dns-records-for-a-primary-ip
 */
export const changePrimaryIPReverseDNSResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Change Primary IP Protection request schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-change-primary-ip-protection
 */
export const changePrimaryIPProtectionRequestSchema = z.object({
  delete: z.boolean(),
});

/**
 * Change Primary IP Protection response schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-change-primary-ip-protection
 */
export const changePrimaryIPProtectionResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Unassign Primary IP request schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-unassign-a-primary-ip-from-a-resource
 */
export const unassignPrimaryIPRequestSchema = z.object({});

/**
 * Unassign Primary IP response schema
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-unassign-a-primary-ip-from-a-resource
 */
export const unassignPrimaryIPResponseSchema = z.object({
  action: actionSchema,
});
