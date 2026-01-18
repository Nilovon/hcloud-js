/**
 * Types for Hetzner Cloud Firewalls API
 * Types are inferred from Zod schemas
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls
 */

// biome-ignore assist/source/organizeImports: we need to import the schemas first
import {
  listFirewallsResponseSchema,
  createFirewallRequestSchema,
  createFirewallResponseSchema,
  getFirewallResponseSchema,
  updateFirewallRequestSchema,
  updateFirewallResponseSchema,
  deleteFirewallResponseSchema,
  listFirewallActionsResponseSchema,
  getFirewallActionResponseSchema,
  applyFirewallToResourcesRequestSchema,
  applyFirewallToResourcesResponseSchema,
  removeFirewallFromResourcesRequestSchema,
  removeFirewallFromResourcesResponseSchema,
  setFirewallRulesRequestSchema,
  setFirewallRulesResponseSchema,
  firewallSchema,
  firewallRuleSchema,
  firewallRuleDirectionSchema,
  firewallRuleProtocolSchema,
  firewallAppliedToResourceSchema,
} from "../../apis/firewalls/schemas";
import type { z } from "zod";

/**
 * Firewall rule direction
 */
export type FirewallRuleDirection = z.infer<typeof firewallRuleDirectionSchema>;

/**
 * Firewall rule protocol
 */
export type FirewallRuleProtocol = z.infer<typeof firewallRuleProtocolSchema>;

/**
 * Firewall rule
 */
export type FirewallRule = z.infer<typeof firewallRuleSchema>;

/**
 * Firewall applied to resource
 */
export type FirewallAppliedToResource = z.infer<typeof firewallAppliedToResourceSchema>;

/**
 * Firewall
 */
export type Firewall = z.infer<typeof firewallSchema>;

/**
 * List Firewalls query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-list-firewalls
 */
export interface ListFirewallsParams {
  /**
   * Can be used to filter Firewalls by their name. The response will only contain the Firewall matching the specified name.
   */
  name?: string;
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, name, name:asc, name:desc, created, created:asc, created:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
  /**
   * Can be used to filter Firewalls by labels. The response will only contain Firewalls matching the label selector.
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
 * List Firewalls response
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-list-firewalls
 */
export type ListFirewallsResponse = z.infer<typeof listFirewallsResponseSchema>;

/**
 * Create Firewall parameters
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-create-a-firewall
 */
export type CreateFirewallParams = z.infer<typeof createFirewallRequestSchema>;

/**
 * Create Firewall response
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-create-a-firewall
 */
export type CreateFirewallResponse = z.infer<typeof createFirewallResponseSchema>;

/**
 * Get Firewall response
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-get-a-firewall
 */
export type GetFirewallResponse = z.infer<typeof getFirewallResponseSchema>;

/**
 * Update Firewall parameters
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-update-a-firewall
 */
export type UpdateFirewallParams = z.infer<typeof updateFirewallRequestSchema>;

/**
 * Update Firewall response
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-update-a-firewall
 */
export type UpdateFirewallResponse = z.infer<typeof updateFirewallResponseSchema>;

/**
 * Delete Firewall response
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-delete-a-firewall
 */
export type DeleteFirewallResponse = z.infer<typeof deleteFirewallResponseSchema>;

/**
 * List Firewall Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-list-actions-for-a-firewall
 */
export interface ListFirewallActionsParams {
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
 * List Firewall Actions response
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-list-actions-for-a-firewall
 */
export type ListFirewallActionsResponse = z.infer<typeof listFirewallActionsResponseSchema>;

/**
 * Get Firewall Action response
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-get-an-action-for-a-firewall
 */
export type GetFirewallActionResponse = z.infer<typeof getFirewallActionResponseSchema>;

/**
 * Apply Firewall to Resources parameters
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-apply-to-resources
 */
export type ApplyFirewallToResourcesParams = z.infer<
  typeof applyFirewallToResourcesRequestSchema
>;

/**
 * Apply Firewall to Resources response
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-apply-to-resources
 */
export type ApplyFirewallToResourcesResponse = z.infer<
  typeof applyFirewallToResourcesResponseSchema
>;

/**
 * Remove Firewall from Resources parameters
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-remove-from-resources
 */
export type RemoveFirewallFromResourcesParams = z.infer<
  typeof removeFirewallFromResourcesRequestSchema
>;

/**
 * Remove Firewall from Resources response
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-remove-from-resources
 */
export type RemoveFirewallFromResourcesResponse = z.infer<
  typeof removeFirewallFromResourcesResponseSchema
>;

/**
 * Set Firewall Rules parameters
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-set-rules
 */
export type SetFirewallRulesParams = z.infer<typeof setFirewallRulesRequestSchema>;

/**
 * Set Firewall Rules response
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-set-rules
 */
export type SetFirewallRulesResponse = z.infer<typeof setFirewallRulesResponseSchema>;
