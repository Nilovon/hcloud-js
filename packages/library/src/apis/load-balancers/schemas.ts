/**
 * Zod schemas for Hetzner Cloud Load Balancers API
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers
 */

import { z } from "zod";
import { actionSchema } from "../actions/schemas";
import { labelsSchema, metaSchema, metricsSchema } from "../common/schemas";
import { loadBalancerTypeSchema } from "../load-balancer-types/schemas";
import { locationSchema } from "../locations/schemas";

const portSchema = z.number().int().min(1).max(65535);

/**
 * Load Balancer algorithm type schema
 */
export const loadBalancerAlgorithmTypeSchema = z.enum(["round_robin", "least_connections"]);

/**
 * Load Balancer algorithm schema
 */
export const loadBalancerAlgorithmSchema = z.object({
  type: loadBalancerAlgorithmTypeSchema,
});

/**
 * Load Balancer service protocol schema
 */
export const loadBalancerServiceProtocolSchema = z.enum(["http", "https", "tcp"]);

/**
 * Load Balancer target type schema
 */
export const loadBalancerTargetTypeSchema = z.enum(["server", "label_selector", "ip"]);

/**
 * Load Balancer service health check protocol schema
 */
export const loadBalancerServiceHealthCheckProtocolSchema = z.enum(["http", "https", "tcp"]);

/**
 * Load Balancer metric type schema
 */
export const loadBalancerMetricTypeSchema = z.enum([
  "open_connections",
  "connections_per_second",
  "requests_per_second",
  "bandwidth",
]);

/**
 * Load Balancer service health check HTTP config schema
 */
export const loadBalancerServiceHealthCheckHttpConfigSchema = z.object({
  domain: z.string().nullable(),
  path: z.string(),
  response: z.string().nullable().optional(),
  status_codes: z.array(z.string()).nullable().optional(),
  tls: z.boolean().optional(),
});

/**
 * Load Balancer service health check schema
 */
export const loadBalancerServiceHealthCheckSchema = z.object({
  protocol: loadBalancerServiceHealthCheckProtocolSchema,
  port: z.number(),
  interval: z.number(),
  timeout: z.number(),
  retries: z.number(),
  http: loadBalancerServiceHealthCheckHttpConfigSchema.nullable().optional(),
});

/**
 * Load Balancer service HTTP config schema. Only present for `http` and `https` services.
 */
export const loadBalancerServiceHttpConfigSchema = z.object({
  cookie_name: z.string().optional(),
  cookie_lifetime: z.number().optional(),
  certificates: z.array(z.number()).optional(),
  redirect_http: z.boolean().optional(),
  sticky_sessions: z.boolean().optional(),
  timeout_idle: z.number().optional(),
});

/**
 * Load Balancer service schema
 */
export const loadBalancerServiceSchema = z.object({
  protocol: loadBalancerServiceProtocolSchema,
  listen_port: z.number(),
  destination_port: z.number(),
  proxyprotocol: z.boolean(),
  http: loadBalancerServiceHttpConfigSchema.nullable().optional(),
  health_check: loadBalancerServiceHealthCheckSchema,
});

/**
 * Load Balancer target IP schema
 */
export const loadBalancerTargetIpSchema = z.object({
  ip: z.string(),
});

/**
 * Load Balancer target label selector schema
 */
export const loadBalancerTargetLabelSelectorSchema = z.object({
  selector: z.string(),
});

/**
 * Load Balancer target server schema
 */
export const loadBalancerTargetServerSchema = z.object({
  id: z.number(),
});

/**
 * Load Balancer target health status schema
 *
 * `detail` and `http_status_code` carry diagnostics of a failed health check:
 * `detail` is only set if `status` is `unhealthy` (one of `unspecified`,
 * `layer4_no_connection`, `layer4_timeout`, `layer7_timeout`,
 * `unexpected_http_status`, `unexpected_http_content`), `http_status_code` only
 * if `detail` is `unexpected_http_status`.
 */
export const loadBalancerTargetHealthStatusSchema = z.object({
  listen_port: z.number(),
  status: z.enum(["healthy", "unhealthy", "unknown"]),
  detail: z.string().nullable().optional(),
  http_status_code: z.number().nullable().optional(),
});

/**
 * Server a label selector target of a Load Balancer resolved to
 */
export const loadBalancerResolvedTargetSchema = z.object({
  type: loadBalancerTargetTypeSchema,
  server: loadBalancerTargetServerSchema.nullable().optional(),
  use_private_ip: z.boolean().optional(),
  health_status: z.array(loadBalancerTargetHealthStatusSchema).optional(),
});

/**
 * Load Balancer target schema
 *
 * `health_status` is only present for the target types `server` and `ip`,
 * `targets` (the resolved servers) only for the target type `label_selector`.
 */
export const loadBalancerTargetSchema = z.object({
  type: loadBalancerTargetTypeSchema,
  server: loadBalancerTargetServerSchema.nullable().optional(),
  label_selector: loadBalancerTargetLabelSelectorSchema.nullable().optional(),
  ip: loadBalancerTargetIpSchema.nullable().optional(),
  use_private_ip: z.boolean().optional(),
  health_status: z.array(loadBalancerTargetHealthStatusSchema).optional(),
  targets: z.array(loadBalancerResolvedTargetSchema).optional(),
});

/**
 * Load Balancer protection schema
 */
export const loadBalancerProtectionSchema = z.object({
  delete: z.boolean(),
});

/**
 * Public IP of a Load Balancer. `id` is the ID of the Primary IP.
 */
export const loadBalancerPublicNetIPSchema = z.object({
  id: z.number().nullable().optional(),
  ip: z.string().nullable(),
  blocked: z.boolean().optional(),
  dns_ptr: z.string().nullable(),
});

/**
 * Load Balancer public network schema
 */
export const loadBalancerPublicNetSchema = z.object({
  enabled: z.boolean(),
  ipv4: loadBalancerPublicNetIPSchema,
  ipv6: loadBalancerPublicNetIPSchema,
});

/**
 * Load Balancer private network attachment schema
 */
export const loadBalancerPrivateNetSchema = z.object({
  network: z.number(),
  ip: z.string().nullable(),
});

/**
 * Load Balancer schema
 */
export const loadBalancerSchema = z.object({
  id: z.number(),
  name: z.string(),
  public_net: loadBalancerPublicNetSchema,
  private_net: z.array(loadBalancerPrivateNetSchema),
  location: locationSchema,
  load_balancer_type: loadBalancerTypeSchema,
  protection: loadBalancerProtectionSchema,
  labels: labelsSchema,
  created: z.string(),
  services: z.array(loadBalancerServiceSchema),
  targets: z.array(loadBalancerTargetSchema),
  algorithm: loadBalancerAlgorithmSchema,
  outgoing_traffic: z.number().nullable(),
  ingoing_traffic: z.number().nullable(),
  included_traffic: z.number(),
});

/**
 * List Load Balancers response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-list-load-balancers
 */
export const listLoadBalancersResponseSchema = z.object({
  load_balancers: z.array(loadBalancerSchema),
  meta: metaSchema.optional(),
});

/**
 * Health check HTTP config of a service in requests. Only defined fields are sent.
 */
export const loadBalancerServiceHealthCheckHttpRequestSchema = z.object({
  domain: z.string().nullable().optional(),
  path: z.string().optional(),
  response: z.string().optional(),
  status_codes: z.array(z.string()).optional(),
  tls: z.boolean().optional(),
});

/**
 * Health check of a service in requests. Only defined fields are sent.
 */
export const loadBalancerServiceHealthCheckRequestSchema = z.object({
  protocol: loadBalancerServiceHealthCheckProtocolSchema.optional(),
  port: portSchema.optional(),
  interval: z.number().int().positive().optional(),
  timeout: z.number().int().positive().optional(),
  retries: z.number().int().min(0).optional(),
  http: loadBalancerServiceHealthCheckHttpRequestSchema.optional(),
});

/**
 * HTTP config of a service in requests. Only defined fields are sent.
 */
export const loadBalancerServiceHttpRequestSchema = z.object({
  cookie_name: z.string().optional(),
  cookie_lifetime: z.number().int().optional(),
  certificates: z.array(z.number().int()).optional(),
  redirect_http: z.boolean().optional(),
  sticky_sessions: z.boolean().optional(),
  timeout_idle: z.number().int().optional(),
});

/**
 * Service in requests (create Load Balancer, add service)
 *
 * `listen_port` and `destination_port` are required for `tcp` services.
 */
export const loadBalancerServiceRequestSchema = z.object({
  protocol: loadBalancerServiceProtocolSchema,
  listen_port: portSchema.optional(),
  destination_port: portSchema.optional(),
  proxyprotocol: z.boolean().optional(),
  http: loadBalancerServiceHttpRequestSchema.optional(),
  health_check: loadBalancerServiceHealthCheckRequestSchema.optional(),
});

/**
 * Target in requests (create Load Balancer, add target)
 */
export const loadBalancerTargetRequestSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("server"),
    server: z.object({ id: z.number().int() }),
    use_private_ip: z.boolean().optional(),
  }),
  z.object({
    type: z.literal("label_selector"),
    label_selector: z.object({ selector: z.string().min(1) }),
    use_private_ip: z.boolean().optional(),
  }),
  z.object({
    type: z.literal("ip"),
    ip: z.object({ ip: z.string().min(1) }),
  }),
]);

/**
 * Existing Primary IPs to assign to a new Load Balancer. For an omitted IP
 * version a new Primary IP is allocated.
 */
export const createLoadBalancerPublicNetSchema = z.object({
  ipv4: z.number().int().optional(),
  ipv6: z.number().int().optional(),
});

/**
 * Create Load Balancer request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-create-a-load-balancer
 */
export const createLoadBalancerRequestSchema = z.object({
  name: z.string().min(1),
  load_balancer_type: z.union([z.string().min(1), z.number().int()]),
  algorithm: loadBalancerAlgorithmSchema.optional(),
  location: z.union([z.string().min(1), z.number().int()]).optional(),
  network_zone: z.string().min(1).optional(),
  network: z.number().int().optional(),
  public_interface: z.boolean().optional(),
  public_net: createLoadBalancerPublicNetSchema.optional(),
  services: z.array(loadBalancerServiceRequestSchema).optional(),
  targets: z.array(loadBalancerTargetRequestSchema).optional(),
  labels: labelsSchema.optional(),
});

/**
 * Create Load Balancer response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-create-a-load-balancer
 */
export const createLoadBalancerResponseSchema = z.object({
  load_balancer: loadBalancerSchema,
  action: actionSchema,
});

/**
 * Get Load Balancer response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-get-a-load-balancer
 */
export const getLoadBalancerResponseSchema = z.object({
  load_balancer: loadBalancerSchema,
});

/**
 * Update Load Balancer request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-update-a-load-balancer
 */
export const updateLoadBalancerRequestSchema = z.object({
  name: z.string().min(1).optional(),
  labels: labelsSchema.optional(),
});

/**
 * Update Load Balancer response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-update-a-load-balancer
 */
export const updateLoadBalancerResponseSchema = z.object({
  load_balancer: loadBalancerSchema,
});

/**
 * Add Load Balancer Service request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-add-service
 */
export const addLoadBalancerServiceRequestSchema = loadBalancerServiceRequestSchema;

/**
 * Update Load Balancer Service request schema. The service is identified by `listen_port`.
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-update-service
 */
export const updateLoadBalancerServiceRequestSchema = z.object({
  listen_port: portSchema,
  protocol: loadBalancerServiceProtocolSchema.optional(),
  destination_port: portSchema.optional(),
  proxyprotocol: z.boolean().optional(),
  http: loadBalancerServiceHttpRequestSchema.optional(),
  health_check: loadBalancerServiceHealthCheckRequestSchema.optional(),
});

/**
 * Delete Load Balancer Service request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-delete-service
 */
export const deleteLoadBalancerServiceRequestSchema = z.object({
  listen_port: portSchema,
});

/**
 * Add Load Balancer Target request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-add-target
 */
export const addLoadBalancerTargetRequestSchema = loadBalancerTargetRequestSchema;

/**
 * Remove Load Balancer Target request schema. `use_private_ip` is not part of the request.
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-remove-target
 */
export const removeLoadBalancerTargetRequestSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("server"),
    server: z.object({ id: z.number().int() }),
  }),
  z.object({
    type: z.literal("label_selector"),
    label_selector: z.object({ selector: z.string().min(1) }),
  }),
  z.object({
    type: z.literal("ip"),
    ip: z.object({ ip: z.string().min(1) }),
  }),
]);

/**
 * Change Load Balancer Algorithm request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-algorithm
 */
export const changeLoadBalancerAlgorithmRequestSchema = loadBalancerAlgorithmSchema;

/**
 * Change Load Balancer reverse DNS request schema. `dns_ptr: null` resets the entry to its default.
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-reverse-dns-entry-for-this-load-balancer
 */
export const changeLoadBalancerReverseDNSRequestSchema = z.object({
  ip: z.string().min(1),
  dns_ptr: z.string().nullable(),
});

/**
 * Change Load Balancer Protection request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-load-balancer-protection
 */
export const changeLoadBalancerProtectionRequestSchema = z.object({
  delete: z.boolean().optional(),
});

/**
 * Change Load Balancer Type request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-the-type-of-a-load-balancer
 */
export const changeLoadBalancerTypeRequestSchema = z.object({
  load_balancer_type: z.union([z.string().min(1), z.number().int()]),
});

/**
 * Attach Load Balancer to Network request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-attach-a-load-balancer-to-a-network
 */
export const attachLoadBalancerToNetworkRequestSchema = z.object({
  network: z.number().int(),
  ip: z.string().min(1).optional(),
  ip_range: z.string().min(1).optional(),
});

/**
 * Detach Load Balancer from Network request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-detach-a-load-balancer-from-a-network
 */
export const detachLoadBalancerFromNetworkRequestSchema = z.object({
  network: z.number().int(),
});

/**
 * Get Load Balancer Metrics response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-get-metrics-for-a-load-balancer
 */
export const getLoadBalancerMetricsResponseSchema = z.object({
  metrics: metricsSchema,
});
