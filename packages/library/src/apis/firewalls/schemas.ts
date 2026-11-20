/**
 * Zod schemas for Hetzner Cloud Firewalls API
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls
 */

import { z } from "zod";
import { actionSchema } from "../actions/schemas";
import { labelsSchema, metaSchema } from "../common/schemas";

/**
 * Firewall rule direction schema
 */
export const firewallRuleDirectionSchema = z.enum(["in", "out"]);

/**
 * Firewall rule protocol schema
 */
export const firewallRuleProtocolSchema = z.enum(["tcp", "udp", "icmp", "esp", "gre"]);

/**
 * Firewall rule port schema: a single port (`"80"`) or a port range (`"1024-5000"`)
 */
export const firewallRulePortSchema = z.string().regex(/^\d+(-\d+)?$/);

/**
 * Firewall rule schema
 *
 * `source_ips` applies to rules with direction `in`, `destination_ips` to rules
 * with direction `out`. `port` is only set for the protocols `tcp` and `udp`.
 */
export const firewallRuleSchema = z.object({
  direction: firewallRuleDirectionSchema,
  protocol: firewallRuleProtocolSchema,
  source_ips: z.array(z.string()),
  destination_ips: z.array(z.string()),
  port: z.string().nullable(),
  description: z.string().nullable(),
});

/**
 * Type of a resource a firewall is applied to
 */
export const firewallResourceTypeSchema = z.enum(["server", "label_selector"]);

/**
 * Server reference of a firewall resource
 */
export const firewallResourceServerSchema = z.object({
  id: z.number(),
});

/**
 * Label selector of a firewall resource
 */
export const firewallResourceLabelSelectorSchema = z.object({
  selector: z.string(),
});

/**
 * Resource a firewall is effectively applied to through a label selector
 */
export const firewallEffectiveResourceSchema = z.object({
  type: z.string(),
  server: firewallResourceServerSchema.nullable().optional(),
});

/**
 * Resource a firewall is applied to: a server or a label selector
 */
export const firewallAppliedToResourceSchema = z.object({
  type: firewallResourceTypeSchema,
  server: firewallResourceServerSchema.nullable().optional(),
  label_selector: firewallResourceLabelSelectorSchema.nullable().optional(),
  applied_to_resources: z.array(firewallEffectiveResourceSchema).nullable().optional(),
});

/**
 * Firewall schema
 */
export const firewallSchema = z.object({
  id: z.number(),
  name: z.string(),
  labels: labelsSchema,
  created: z.string(),
  rules: z.array(firewallRuleSchema),
  applied_to: z.array(firewallAppliedToResourceSchema),
});

/**
 * List Firewalls response schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-list-firewalls
 */
export const listFirewallsResponseSchema = z.object({
  firewalls: z.array(firewallSchema),
  meta: metaSchema.optional(),
});

/**
 * Firewall rule of a request.
 *
 * Accepts rules as returned by the API (`firewall.rules`), so existing rules can
 * be passed back unchanged: `null` values and empty IP lists are not sent.
 * `port` is required for the protocols `tcp` and `udp` and not allowed otherwise.
 */
export const firewallRuleRequestSchema = z
  .object({
    direction: firewallRuleDirectionSchema,
    protocol: firewallRuleProtocolSchema,
    source_ips: z.array(z.string()).optional(),
    destination_ips: z.array(z.string()).optional(),
    port: firewallRulePortSchema.nullable().optional(),
    description: z.string().nullable().optional(),
  })
  .superRefine((rule, ctx) => {
    const usesPorts = rule.protocol === "tcp" || rule.protocol === "udp";
    const hasPort = rule.port !== undefined && rule.port !== null;
    if (usesPorts && !hasPort) {
      ctx.addIssue({
        code: "custom",
        path: ["port"],
        message: `port is required for protocol ${rule.protocol}`,
      });
    }
    if (!usesPorts && hasPort) {
      ctx.addIssue({
        code: "custom",
        path: ["port"],
        message: `port is not allowed for protocol ${rule.protocol}`,
      });
    }
  })
  .transform(({ source_ips, destination_ips, port, description, ...rule }) => ({
    ...rule,
    source_ips: source_ips && source_ips.length > 0 ? source_ips : undefined,
    destination_ips: destination_ips && destination_ips.length > 0 ? destination_ips : undefined,
    port: port ?? undefined,
    description: description ?? undefined,
  }));

/**
 * Resource of a request a firewall is applied to or removed from.
 *
 * Accepts resources as returned by the API (`firewall.applied_to`); only the
 * reference matching `type` is sent.
 */
export const firewallResourceRequestSchema = z
  .object({
    type: firewallResourceTypeSchema,
    server: firewallResourceServerSchema.nullable().optional(),
    label_selector: firewallResourceLabelSelectorSchema.nullable().optional(),
  })
  .superRefine((resource, ctx) => {
    if (resource.type === "server" && !resource.server) {
      ctx.addIssue({
        code: "custom",
        path: ["server"],
        message: "server is required for resources of type server",
      });
    }
    if (resource.type === "label_selector" && !resource.label_selector) {
      ctx.addIssue({
        code: "custom",
        path: ["label_selector"],
        message: "label_selector is required for resources of type label_selector",
      });
    }
  })
  .transform((resource) =>
    resource.type === "server"
      ? { type: resource.type, server: resource.server ?? undefined }
      : { type: resource.type, label_selector: resource.label_selector ?? undefined },
  );

/**
 * Create Firewall request schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-create-a-firewall
 */
export const createFirewallRequestSchema = z.object({
  name: z.string().min(1),
  labels: labelsSchema.optional(),
  rules: z.array(firewallRuleRequestSchema).optional(),
  apply_to: z.array(firewallResourceRequestSchema).optional(),
});

/**
 * Create Firewall response schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-create-a-firewall
 */
export const createFirewallResponseSchema = z.object({
  firewall: firewallSchema,
  actions: z.array(actionSchema).optional(),
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
  labels: labelsSchema.optional(),
});

/**
 * Update Firewall response schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-update-a-firewall
 */
export const updateFirewallResponseSchema = z.object({
  firewall: firewallSchema,
});

/**
 * Set Firewall Rules request schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-set-rules
 */
export const setFirewallRulesRequestSchema = z.object({
  rules: z.array(firewallRuleRequestSchema),
});

/**
 * Apply Firewall to Resources request schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-apply-to-resources
 */
export const applyFirewallToResourcesRequestSchema = z.object({
  apply_to: z.array(firewallResourceRequestSchema),
});

/**
 * Remove Firewall from Resources request schema
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls-remove-from-resources
 */
export const removeFirewallFromResourcesRequestSchema = z.object({
  remove_from: z.array(firewallResourceRequestSchema),
});
