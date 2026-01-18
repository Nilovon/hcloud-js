/**
 * Types for Hetzner Cloud Primary IPs API
 * Types are inferred from Zod schemas
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips
 */

// biome-ignore assist/source/organizeImports: we need to import the schemas first
import {
  listPrimaryIPsResponseSchema,
  createPrimaryIPRequestSchema,
  createPrimaryIPResponseSchema,
  getPrimaryIPResponseSchema,
  updatePrimaryIPRequestSchema,
  updatePrimaryIPResponseSchema,
  deletePrimaryIPResponseSchema,
  listPrimaryIPActionsResponseSchema,
  getPrimaryIPActionResponseSchema,
  assignPrimaryIPToResourceRequestSchema,
  assignPrimaryIPToResourceResponseSchema,
  changePrimaryIPReverseDNSRequestSchema,
  changePrimaryIPReverseDNSResponseSchema,
  changePrimaryIPProtectionRequestSchema,
  changePrimaryIPProtectionResponseSchema,
  unassignPrimaryIPRequestSchema,
  unassignPrimaryIPResponseSchema,
  primaryIpSchema,
  primaryIpTypeSchema,
  primaryIpDnsPointerSchema,
  primaryIpProtectionSchema,
  primaryIpAssigneeTypeSchema,
} from "@hcloud-js/apis/primary-ips/schemas.js";
import type { z } from "zod";

/**
 * Primary IP type
 */
export type PrimaryIPType = z.infer<typeof primaryIpTypeSchema>;

/**
 * Primary IP DNS pointer
 */
export type PrimaryIPDnsPointer = z.infer<typeof primaryIpDnsPointerSchema>;

/**
 * Primary IP protection
 */
export type PrimaryIPProtection = z.infer<typeof primaryIpProtectionSchema>;

/**
 * Primary IP assignee type
 */
export type PrimaryIPAssigneeType = z.infer<typeof primaryIpAssigneeTypeSchema>;

/**
 * Primary IP
 */
export type PrimaryIP = z.infer<typeof primaryIpSchema>;

/**
 * List Primary IPs query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-list-primary-ips
 */
export interface ListPrimaryIPsParams {
  /**
   * Can be used to filter Primary IPs by their name. The response will only contain the Primary IP matching the specified name.
   */
  name?: string;
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, name, name:asc, name:desc, created, created:asc, created:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
  /**
   * Can be used to filter Primary IPs by labels. The response will only contain Primary IPs matching the label selector.
   */
  label_selector?: string;
  /**
   * Can be used to filter Primary IPs by their IP. The response will only contain the Primary IP matching the specified IP.
   */
  ip?: string;
  /**
   * Page number to return. For more information, see [Pagination](https://docs.hetzner.cloud/reference/cloud#pagination).
   */
  page?: number;
  /**
   * Maximum number of entries returned per page. For more information, see [Pagination](https://docs.hetzner.cloud/reference/cloud#pagination).
   */
  per_page?: number;
}

/**
 * List Primary IPs response
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-list-primary-ips
 */
export type ListPrimaryIPsResponse = z.infer<typeof listPrimaryIPsResponseSchema>;

/**
 * Create Primary IP parameters
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-create-a-primary-ip
 */
export type CreatePrimaryIPParams = z.infer<typeof createPrimaryIPRequestSchema>;

/**
 * Create Primary IP response
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-create-a-primary-ip
 */
export type CreatePrimaryIPResponse = z.infer<typeof createPrimaryIPResponseSchema>;

/**
 * Get Primary IP response
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-get-a-primary-ip
 */
export type GetPrimaryIPResponse = z.infer<typeof getPrimaryIPResponseSchema>;

/**
 * Update Primary IP parameters
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-update-a-primary-ip
 */
export type UpdatePrimaryIPParams = z.infer<typeof updatePrimaryIPRequestSchema>;

/**
 * Update Primary IP response
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-update-a-primary-ip
 */
export type UpdatePrimaryIPResponse = z.infer<typeof updatePrimaryIPResponseSchema>;

/**
 * Delete Primary IP response
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-delete-a-primary-ip
 */
export type DeletePrimaryIPResponse = z.infer<typeof deletePrimaryIPResponseSchema>;

/**
 * List Primary IP Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-list-actions-for-a-primary-ip
 */
export interface ListPrimaryIPActionsParams {
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, command, command:asc, command:desc, status, status:asc, status:desc, progress, progress:asc, progress:desc, started, started:asc, started:desc, finished, finished:asc, finished:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
  /**
   * Can be used to filter Actions by status. The response will only contain Actions matching the status.
   */
  status?: string | string[];
  /**
   * Page number to return. For more information, see [Pagination](https://docs.hetzner.cloud/reference/cloud#pagination).
   */
  page?: number;
  /**
   * Maximum number of entries returned per page. For more information, see [Pagination](https://docs.hetzner.cloud/reference/cloud#pagination).
   */
  per_page?: number;
}

/**
 * List Primary IP Actions response
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-list-actions-for-a-primary-ip
 */
export type ListPrimaryIPActionsResponse = z.infer<typeof listPrimaryIPActionsResponseSchema>;

/**
 * Get Primary IP Action response
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-get-an-action-for-a-primary-ip
 */
export type GetPrimaryIPActionResponse = z.infer<typeof getPrimaryIPActionResponseSchema>;

/**
 * Assign Primary IP to resource parameters
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-assign-a-primary-ip-to-a-resource
 */
export type AssignPrimaryIPToResourceParams = z.infer<
  typeof assignPrimaryIPToResourceRequestSchema
>;

/**
 * Assign Primary IP to resource response
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-assign-a-primary-ip-to-a-resource
 */
export type AssignPrimaryIPToResourceResponse = z.infer<
  typeof assignPrimaryIPToResourceResponseSchema
>;

/**
 * Change Primary IP reverse DNS parameters
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-change-reverse-dns-records-for-a-primary-ip
 */
export type ChangePrimaryIPReverseDNSParams = z.infer<
  typeof changePrimaryIPReverseDNSRequestSchema
>;

/**
 * Change Primary IP reverse DNS response
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-change-reverse-dns-records-for-a-primary-ip
 */
export type ChangePrimaryIPReverseDNSResponse = z.infer<
  typeof changePrimaryIPReverseDNSResponseSchema
>;

/**
 * Change Primary IP Protection parameters
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-change-primary-ip-protection
 */
export type ChangePrimaryIPProtectionParams = z.infer<
  typeof changePrimaryIPProtectionRequestSchema
>;

/**
 * Change Primary IP Protection response
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-change-primary-ip-protection
 */
export type ChangePrimaryIPProtectionResponse = z.infer<
  typeof changePrimaryIPProtectionResponseSchema
>;

/**
 * Unassign Primary IP response
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-unassign-a-primary-ip-from-a-resource
 */
export type UnassignPrimaryIPResponse = z.infer<typeof unassignPrimaryIPResponseSchema>;
