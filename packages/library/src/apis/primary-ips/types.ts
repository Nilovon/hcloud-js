/**
 * Types for Hetzner Cloud Primary IPs API
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips
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
  assignPrimaryIPToResourceRequestSchema,
  changePrimaryIPProtectionRequestSchema,
  changePrimaryIPReverseDNSRequestSchema,
  createPrimaryIPRequestSchema,
  createPrimaryIPResponseSchema,
  getPrimaryIPResponseSchema,
  listPrimaryIPsResponseSchema,
  primaryIPAssigneeTypeSchema,
  primaryIPDnsPointerSchema,
  primaryIPProtectionSchema,
  primaryIPSchema,
  primaryIPTypeSchema,
  updatePrimaryIPRequestSchema,
  updatePrimaryIPResponseSchema,
} from "./schemas";

/**
 * Primary IP type
 */
export type PrimaryIPType = z.infer<typeof primaryIPTypeSchema>;

/**
 * Primary IP reverse DNS entry
 */
export type PrimaryIPDnsPointer = z.infer<typeof primaryIPDnsPointerSchema>;

/**
 * Primary IP protection
 */
export type PrimaryIPProtection = z.infer<typeof primaryIPProtectionSchema>;

/**
 * Types of resources a Primary IP can be assigned to
 */
export type PrimaryIPAssigneeType = z.infer<typeof primaryIPAssigneeTypeSchema>;

/**
 * Hetzner Cloud Primary IP
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips
 */
export type PrimaryIP = z.infer<typeof primaryIPSchema>;

/**
 * Fields Primary IPs can be sorted by
 */
export type PrimaryIPSort = SortParam<"id" | "created">;

/**
 * List Primary IPs query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-list-primary-ips
 */
export interface ListPrimaryIPsParams extends PageParams {
  /**
   * Only return the Primary IP with this exact name.
   */
  name?: string;
  /**
   * Only return Primary IPs matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
  /**
   * Only return the Primary IP with this IP address.
   */
  ip?: string;
  /**
   * Sort the result.
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: OneOrMany<PrimaryIPSort>;
}

/**
 * List Primary IPs response
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-list-primary-ips
 */
export type ListPrimaryIPsResponse = z.infer<typeof listPrimaryIPsResponseSchema>;

/**
 * Create Primary IP request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-create-a-primary-ip
 */
export type CreatePrimaryIPParams = z.input<typeof createPrimaryIPRequestSchema>;

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
 * Update Primary IP request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-update-a-primary-ip
 */
export type UpdatePrimaryIPParams = z.input<typeof updatePrimaryIPRequestSchema>;

/**
 * Update Primary IP response
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-update-a-primary-ip
 */
export type UpdatePrimaryIPResponse = z.infer<typeof updatePrimaryIPResponseSchema>;

/**
 * List Primary IP Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-list-actions-for-a-primary-ip
 */
export type ListPrimaryIPActionsParams = ListActionsParams;

/**
 * List Primary IP Actions response
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-list-actions-for-a-primary-ip
 */
export type ListPrimaryIPActionsResponse = ListActionsResponse;

/**
 * Get Primary IP Action response
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-get-an-action-for-a-primary-ip
 */
export type GetPrimaryIPActionResponse = GetActionResponse;

/**
 * Assign Primary IP to resource request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-assign-a-primary-ip-to-a-resource
 */
export type AssignPrimaryIPToResourceParams = z.input<
  typeof assignPrimaryIPToResourceRequestSchema
>;

/**
 * Assign Primary IP to resource response
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-assign-a-primary-ip-to-a-resource
 */
export type AssignPrimaryIPToResourceResponse = ActionResponse;

/**
 * Unassign Primary IP response
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-unassign-a-primary-ip-from-a-resource
 */
export type UnassignPrimaryIPResponse = ActionResponse;

/**
 * Change Primary IP reverse DNS request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-change-reverse-dns-records-for-a-primary-ip
 */
export type ChangePrimaryIPReverseDNSParams = z.input<
  typeof changePrimaryIPReverseDNSRequestSchema
>;

/**
 * Change Primary IP reverse DNS response
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-change-reverse-dns-records-for-a-primary-ip
 */
export type ChangePrimaryIPReverseDNSResponse = ActionResponse;

/**
 * Change Primary IP Protection request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-change-primary-ip-protection
 */
export type ChangePrimaryIPProtectionParams = z.input<
  typeof changePrimaryIPProtectionRequestSchema
>;

/**
 * Change Primary IP Protection response
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-change-primary-ip-protection
 */
export type ChangePrimaryIPProtectionResponse = ActionResponse;
