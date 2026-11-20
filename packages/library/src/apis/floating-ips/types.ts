/**
 * Types for Hetzner Cloud Floating IPs API
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips
 */

import type { z } from "zod";
import type {
  ActionResponse,
  GetActionResponse,
  ListActionsParams,
  ListActionsResponse,
} from "../actions/types";
import type { OneOrMany, PageParams, SortParam } from "../common/types";
import type {
  assignFloatingIPToServerRequestSchema,
  changeFloatingIPProtectionRequestSchema,
  changeFloatingIPReverseDNSRequestSchema,
  createFloatingIPRequestSchema,
  createFloatingIPResponseSchema,
  floatingIPDnsPointerSchema,
  floatingIPProtectionSchema,
  floatingIPSchema,
  floatingIPTypeSchema,
  getFloatingIPResponseSchema,
  listFloatingIPsResponseSchema,
  updateFloatingIPRequestSchema,
  updateFloatingIPResponseSchema,
} from "./schemas";

/**
 * Floating IP type
 */
export type FloatingIPType = z.infer<typeof floatingIPTypeSchema>;

/**
 * Floating IP reverse DNS entry
 */
export type FloatingIPDnsPointer = z.infer<typeof floatingIPDnsPointerSchema>;

/**
 * Floating IP protection
 */
export type FloatingIPProtection = z.infer<typeof floatingIPProtectionSchema>;

/**
 * Hetzner Cloud Floating IP
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips
 */
export type FloatingIP = z.infer<typeof floatingIPSchema>;

/**
 * Fields Floating IPs can be sorted by
 */
export type FloatingIPSort = SortParam<"id" | "created">;

/**
 * List Floating IPs query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-list-floating-ips
 */
export interface ListFloatingIPsParams extends PageParams {
  /**
   * Only return the Floating IP with this exact name.
   */
  name?: string;
  /**
   * Only return Floating IPs matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
  /**
   * Sort the result.
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: OneOrMany<FloatingIPSort>;
}

/**
 * List Floating IPs response
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-list-floating-ips
 */
export type ListFloatingIPsResponse = z.infer<typeof listFloatingIPsResponseSchema>;

/**
 * Create Floating IP request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-create-a-floating-ip
 */
export type CreateFloatingIPParams = z.input<typeof createFloatingIPRequestSchema>;

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
 * Update Floating IP request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-update-a-floating-ip
 */
export type UpdateFloatingIPParams = z.input<typeof updateFloatingIPRequestSchema>;

/**
 * Update Floating IP response
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-update-a-floating-ip
 */
export type UpdateFloatingIPResponse = z.infer<typeof updateFloatingIPResponseSchema>;

/**
 * List Floating IP Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-list-actions-for-a-floating-ip
 */
export type ListFloatingIPActionsParams = ListActionsParams;

/**
 * List Floating IP Actions response
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-list-actions-for-a-floating-ip
 */
export type ListFloatingIPActionsResponse = ListActionsResponse;

/**
 * Get Floating IP Action response
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-get-an-action-for-a-floating-ip
 */
export type GetFloatingIPActionResponse = GetActionResponse;

/**
 * Assign Floating IP to Server request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-assign-a-floating-ip-to-a-server
 */
export type AssignFloatingIPToServerParams = z.input<typeof assignFloatingIPToServerRequestSchema>;

/**
 * Assign Floating IP to Server response
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-assign-a-floating-ip-to-a-server
 */
export type AssignFloatingIPToServerResponse = ActionResponse;

/**
 * Unassign Floating IP response
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-unassign-a-floating-ip
 */
export type UnassignFloatingIPResponse = ActionResponse;

/**
 * Change Floating IP reverse DNS request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-change-reverse-dns-records-for-a-floating-ip
 */
export type ChangeFloatingIPReverseDNSParams = z.input<
  typeof changeFloatingIPReverseDNSRequestSchema
>;

/**
 * Change Floating IP reverse DNS response
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-change-reverse-dns-records-for-a-floating-ip
 */
export type ChangeFloatingIPReverseDNSResponse = ActionResponse;

/**
 * Change Floating IP Protection request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-change-floating-ip-protection
 */
export type ChangeFloatingIPProtectionParams = z.input<
  typeof changeFloatingIPProtectionRequestSchema
>;

/**
 * Change Floating IP Protection response
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-change-floating-ip-protection
 */
export type ChangeFloatingIPProtectionResponse = ActionResponse;
