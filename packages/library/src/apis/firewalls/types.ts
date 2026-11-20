/**
 * Types for Hetzner Cloud Firewalls API
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls
 */

import type { z } from "zod";
import type {
  ActionsResponse,
  GetActionResponse,
  ListActionsParams,
  ListActionsResponse,
} from "../actions/types";
import type { OneOrMany, PageParams, SortParam } from "../common/types";
import type {
  applyFirewallToResourcesRequestSchema,
  createFirewallRequestSchema,
  createFirewallResponseSchema,
  firewallAppliedToResourceSchema,
  firewallEffectiveResourceSchema,
  firewallResourceRequestSchema,
  firewallResourceTypeSchema,
  firewallRuleDirectionSchema,
  firewallRuleProtocolSchema,
  firewallRuleRequestSchema,
  firewallRuleSchema,
  firewallSchema,
  getFirewallResponseSchema,
  listFirewallsResponseSchema,
  removeFirewallFromResourcesRequestSchema,
  setFirewallRulesRequestSchema,
  updateFirewallRequestSchema,
  updateFirewallResponseSchema,
} from "./schemas";

/**
 * Firewall rule direction
 */
export type FirewallRuleDirection = z.infer<typeof firewallRuleDirectionSchema>;

/**
 * Firewall rule protocol
 */
export type FirewallRuleProtocol = z.infer<typeof firewallRuleProtocolSchema>;

/**
 * Firewall rule as returned by the API
 */
export type FirewallRule = z.infer<typeof firewallRuleSchema>;

/**
 * Firewall rule of a request. A {@link FirewallRule} returned by the API is accepted as well.
 */
export type FirewallRuleInput = z.input<typeof firewallRuleRequestSchema>;

/**
 * Type of a resource a firewall is applied to
 */
export type FirewallResourceType = z.infer<typeof firewallResourceTypeSchema>;

/**
 * Resource a firewall is effectively applied to through a label selector
 */
export type FirewallEffectiveResource = z.infer<typeof firewallEffectiveResourceSchema>;

/**
 * Resource a firewall is applied to, as returned by the API
 */
export type FirewallAppliedToResource = z.infer<typeof firewallAppliedToResourceSchema>;

/**
 * Resource of a request a firewall is applied to or removed from. A
 * {@link FirewallAppliedToResource} returned by the API is accepted as well.
 */
export type FirewallResourceInput = z.input<typeof firewallResourceRequestSchema>;

/**
 * Hetzner Cloud Firewall
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls
 */
export type Firewall = z.infer<typeof firewallSchema>;

/**
 * Fields firewalls can be sorted by
 */
export type FirewallSort = SortParam<"id" | "name" | "created">;

/**
 * List Firewalls query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-list-firewalls
 */
export interface ListFirewallsParams extends PageParams {
  /**
   * Only return the firewall with this exact name.
   */
  name?: string;
  /**
   * Only return firewalls matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
  /**
   * Sort the result.
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: OneOrMany<FirewallSort>;
}

/**
 * List Firewalls response
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-list-firewalls
 */
export type ListFirewallsResponse = z.infer<typeof listFirewallsResponseSchema>;

/**
 * Create Firewall request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-create-a-firewall
 */
export type CreateFirewallParams = z.input<typeof createFirewallRequestSchema>;

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
 * Update Firewall request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-update-a-firewall
 */
export type UpdateFirewallParams = z.input<typeof updateFirewallRequestSchema>;

/**
 * Update Firewall response
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-update-a-firewall
 */
export type UpdateFirewallResponse = z.infer<typeof updateFirewallResponseSchema>;

/**
 * List Firewall Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-list-actions-for-a-firewall
 */
export type ListFirewallActionsParams = ListActionsParams;

/**
 * List Firewall Actions response
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-list-actions-for-a-firewall
 */
export type ListFirewallActionsResponse = ListActionsResponse;

/**
 * Get Firewall Action response
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-get-an-action-for-a-firewall
 */
export type GetFirewallActionResponse = GetActionResponse;

/**
 * Set Firewall Rules request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-set-rules
 */
export type SetFirewallRulesParams = z.input<typeof setFirewallRulesRequestSchema>;

/**
 * Set Firewall Rules response
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-set-rules
 */
export type SetFirewallRulesResponse = ActionsResponse;

/**
 * Apply Firewall to Resources request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-apply-to-resources
 */
export type ApplyFirewallToResourcesParams = z.input<typeof applyFirewallToResourcesRequestSchema>;

/**
 * Apply Firewall to Resources response
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-apply-to-resources
 */
export type ApplyFirewallToResourcesResponse = ActionsResponse;

/**
 * Remove Firewall from Resources request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-remove-from-resources
 */
export type RemoveFirewallFromResourcesParams = z.input<
  typeof removeFirewallFromResourcesRequestSchema
>;

/**
 * Remove Firewall from Resources response
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-remove-from-resources
 */
export type RemoveFirewallFromResourcesResponse = ActionsResponse;
