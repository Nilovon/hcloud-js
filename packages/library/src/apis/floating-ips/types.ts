/**
 * Types for Hetzner Cloud Floating IPs API
 * Types are inferred from Zod schemas
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips
 */

// biome-ignore assist/source/organizeImports: we need to import the schemas first
import {
  listFloatingIPsResponseSchema,
  createFloatingIPRequestSchema,
  createFloatingIPResponseSchema,
  getFloatingIPResponseSchema,
  updateFloatingIPRequestSchema,
  updateFloatingIPResponseSchema,
  deleteFloatingIPResponseSchema,
  listFloatingIPActionsResponseSchema,
  getFloatingIPActionResponseSchema,
  assignFloatingIPToServerRequestSchema,
  assignFloatingIPToServerResponseSchema,
  changeFloatingIPReverseDNSRequestSchema,
  changeFloatingIPReverseDNSResponseSchema,
  changeFloatingIPProtectionRequestSchema,
  changeFloatingIPProtectionResponseSchema,
  unassignFloatingIPRequestSchema,
  unassignFloatingIPResponseSchema,
  floatingIpSchema,
  floatingIpTypeSchema,
  floatingIpDnsPointerSchema,
  floatingIpProtectionSchema,
} from "@hcloud-js/apis/floating-ips/schemas.js";
import type { z } from "zod";

/**
 * Floating IP type
 */
export type FloatingIPType = z.infer<typeof floatingIpTypeSchema>;

/**
 * Floating IP DNS pointer
 */
export type FloatingIPDnsPointer = z.infer<typeof floatingIpDnsPointerSchema>;

/**
 * Floating IP protection
 */
export type FloatingIPProtection = z.infer<typeof floatingIpProtectionSchema>;

/**
 * Floating IP
 */
export type FloatingIP = z.infer<typeof floatingIpSchema>;

/**
 * List Floating IPs query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-list-floating-ips
 */
export interface ListFloatingIPsParams {
  /**
   * Can be used to filter Floating IPs by their name. The response will only contain the Floating IP matching the specified name.
   */
  name?: string;
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, name, name:asc, name:desc, created, created:asc, created:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
  /**
   * Can be used to filter Floating IPs by labels. The response will only contain Floating IPs matching the label selector.
   */
  label_selector?: string;
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
 * List Floating IPs response
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-list-floating-ips
 */
export type ListFloatingIPsResponse = z.infer<typeof listFloatingIPsResponseSchema>;

/**
 * Create Floating IP parameters
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-create-a-floating-ip
 */
export type CreateFloatingIPParams = z.infer<typeof createFloatingIPRequestSchema>;

/**
 * Create Floating IP response
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-create-a-floating-ip
 */
export type CreateFloatingIPResponse = z.infer<typeof createFloatingIPResponseSchema>;

/**
 * Get Floating IP response
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-get-a-floating-ip
 */
export type GetFloatingIPResponse = z.infer<typeof getFloatingIPResponseSchema>;

/**
 * Update Floating IP parameters
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-update-a-floating-ip
 */
export type UpdateFloatingIPParams = z.infer<typeof updateFloatingIPRequestSchema>;

/**
 * Update Floating IP response
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-update-a-floating-ip
 */
export type UpdateFloatingIPResponse = z.infer<typeof updateFloatingIPResponseSchema>;

/**
 * Delete Floating IP response
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-delete-a-floating-ip
 */
export type DeleteFloatingIPResponse = z.infer<typeof deleteFloatingIPResponseSchema>;

/**
 * List Floating IP Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-list-actions-for-a-floating-ip
 */
export interface ListFloatingIPActionsParams {
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
 * List Floating IP Actions response
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-list-actions-for-a-floating-ip
 */
export type ListFloatingIPActionsResponse = z.infer<typeof listFloatingIPActionsResponseSchema>;

/**
 * Get Floating IP Action response
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-get-an-action-for-a-floating-ip
 */
export type GetFloatingIPActionResponse = z.infer<typeof getFloatingIPActionResponseSchema>;

/**
 * Assign Floating IP to Server parameters
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-assign-a-floating-ip-to-a-server
 */
export type AssignFloatingIPToServerParams = z.infer<typeof assignFloatingIPToServerRequestSchema>;

/**
 * Assign Floating IP to Server response
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-assign-a-floating-ip-to-a-server
 */
export type AssignFloatingIPToServerResponse = z.infer<typeof assignFloatingIPToServerResponseSchema>;

/**
 * Change Floating IP reverse DNS parameters
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-change-reverse-dns-records-for-a-floating-ip
 */
export type ChangeFloatingIPReverseDNSParams = z.infer<
  typeof changeFloatingIPReverseDNSRequestSchema
>;

/**
 * Change Floating IP reverse DNS response
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-change-reverse-dns-records-for-a-floating-ip
 */
export type ChangeFloatingIPReverseDNSResponse = z.infer<
  typeof changeFloatingIPReverseDNSResponseSchema
>;

/**
 * Change Floating IP Protection parameters
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-change-floating-ip-protection
 */
export type ChangeFloatingIPProtectionParams = z.infer<
  typeof changeFloatingIPProtectionRequestSchema
>;

/**
 * Change Floating IP Protection response
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-change-floating-ip-protection
 */
export type ChangeFloatingIPProtectionResponse = z.infer<
  typeof changeFloatingIPProtectionResponseSchema
>;

/**
 * Unassign Floating IP response
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-unassign-a-floating-ip
 */
export type UnassignFloatingIPResponse = z.infer<typeof unassignFloatingIPResponseSchema>;
