/**
 * Zod schemas for Hetzner Cloud Firewalls API
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls
 */

import { z } from "zod";
import { actionSchema, actionResourceSchema } from "@hcloud-js/apis/actions/schemas.js";
import { paginationMetaSchema } from "@hcloud-js/apis/common/schemas.js";

/**
 * Firewall rule direction schema
 */
export const firewallRuleDirectionSchema = z.enum(["in", "out"]);

/**
 * Firewall rule protocol schema
 */
export const firewallRuleProtocolSchema = z.enum(["tcp", "udp", "icmp", "esp", "gre"]);

/**
 * Firewall rule port schema
 */
export const firewallRulePortSchema = z.string().regex(/^\d+(-\d+)?$/);

/**
 * Firewall rule source IPs schema
 * Accepts IP addresses and CIDR notation
 */
export const firewallRuleSourceIpsSchema = z.array(z.string());

/**
 * Firewall rule destination IPs schema
 * Accepts IP addresses and CIDR notation
 */
export const firewallRuleDestinationIpsSchema = z.array(z.string());

/**
 * Firewall rule schema
 */
export const firewallRuleSchema = z
  .object({
    direction: firewallRuleDirectionSchema,
    source_ips: firewallRuleSourceIpsSchema.optional(),
    destination_ips: firewallRuleDestinationIpsSchema.optional(),
    protocol: firewallRuleProtocolSchema,
    port: firewallRulePortSchema.nullable().optional(),
    description: z.string().nullable().optional(),
  })
  .passthrough();

/**
 * Firewall applied to resource schema
 */
export const firewallAppliedToResourceSchema = z.object({
  type: z.enum(["server", "label_selector"]),
  server: z
    .object({
      id: z.number(),
    })
    .optional(),
  label_selector: z
    .object({
      selector: z.string(),
    })
    .optional(),
});

/**
 * Firewall schema
 */
export const firewallSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    labels: z.record(z.string(), z.string()),
    created: z.string(),
    rules: z
      .object({
        inbound: z.array(firewallRuleSchema).optional(),
        outbound: z.array(firewallRuleSchema).optional(),
      })
      .optional(),
    applied_to: z.array(firewallAppliedToResourceSchema).optional(),
  })
  .passthrough();

/**
 * List Firewalls response schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-list-firewalls
 */
export const listFirewallsResponseSchema = z.object({
  firewalls: z.array(firewallSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Create Firewall request schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-create-a-firewall
 */
export const createFirewallRequestSchema = z.object({
  name: z.string().min(1),
  labels: z.record(z.string(), z.string()).optional(),
  rules: z
    .object({
      inbound: z.array(firewallRuleSchema).optional(),
      outbound: z.array(firewallRuleSchema).optional(),
    })
    .optional(),
  apply_to: z
    .array(
      z.object({
        type: z.enum(["server", "label_selector"]),
        server: z
          .object({
            id: z.number(),
          })
          .optional(),
        label_selector: z
          .object({
            selector: z.string(),
          })
          .optional(),
      }),
    )
    .optional(),
});

/**
 * Create Firewall response schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-create-a-firewall
 */
export const createFirewallResponseSchema = z.object({
  firewall: firewallSchema,
  action: actionSchema.optional(),
});

/**
 * Get Firewall response schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-get-a-firewall
 */
export const getFirewallResponseSchema = z.object({
  firewall: firewallSchema,
});

/**
 * Update Firewall request schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-update-a-firewall
 */
export const updateFirewallRequestSchema = z.object({
  name: z.string().min(1).optional(),
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Update Firewall response schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-update-a-firewall
 */
export const updateFirewallResponseSchema = z.object({
  firewall: firewallSchema,
});

/**
 * Delete Firewall response schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-delete-a-firewall
 */
export const deleteFirewallResponseSchema = z.object({
  action: actionSchema.optional(),
});

/**
 * List Firewall Actions response schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-list-actions-for-a-firewall
 */
export const listFirewallActionsResponseSchema = z.object({
  actions: z.array(actionSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Get Firewall Action response schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-get-an-action-for-a-firewall
 */
export const getFirewallActionResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Apply Firewall to Resources request schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-apply-to-resources
 */
export const applyFirewallToResourcesRequestSchema = z.object({
  apply_to: z.array(
    z.object({
      type: z.enum(["server", "label_selector"]),
      server: z
        .object({
          id: z.number(),
        })
        .optional(),
      label_selector: z
        .object({
          selector: z.string(),
        })
        .optional(),
    }),
  ),
});

/**
 * Apply Firewall to Resources response schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-apply-to-resources
 */
export const applyFirewallToResourcesResponseSchema = z.object({
  actions: z.array(actionSchema),
});

/**
 * Remove Firewall from Resources request schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-remove-from-resources
 */
export const removeFirewallFromResourcesRequestSchema = z.object({
  remove_from: z.array(
    z.object({
      type: z.enum(["server", "label_selector"]),
      server: z
        .object({
          id: z.number(),
        })
        .optional(),
      label_selector: z
        .object({
          selector: z.string(),
        })
        .optional(),
    }),
  ),
});

/**
 * Remove Firewall from Resources response schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-remove-from-resources
 */
export const removeFirewallFromResourcesResponseSchema = z.object({
  actions: z.array(actionSchema),
});

/**
 * Set Firewall Rules request schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-set-rules
 */
export const setFirewallRulesRequestSchema = z.object({
  rules: z
    .object({
      inbound: z.array(firewallRuleSchema).optional(),
      outbound: z.array(firewallRuleSchema).optional(),
    })
    .optional(),
});

/**
 * Set Firewall Rules response schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-set-rules
 */
export const setFirewallRulesResponseSchema = z.object({
  actions: z.array(actionSchema),
});
