/**
 * Zod schemas for Hetzner Cloud Load Balancers API
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers
 */

import { z } from "zod";
import { actionSchema, actionResourceSchema } from "@hcloud-js/apis/actions/schemas.js";
import { paginationMetaSchema } from "@hcloud-js/apis/common/schemas.js";
import { locationSchema } from "@hcloud-js/apis/servers/schemas.js";

/**
 * Load Balancer algorithm type schema
 */
export const loadBalancerAlgorithmTypeSchema = z.enum(["round_robin", "least_connections"]);

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
 * Load Balancer service health check HTTP config schema
 */
export const loadBalancerServiceHealthCheckHttpConfigSchema = z.object({
  domain: z.string().nullable(),
  path: z.string(),
  response: z.string().nullable(),
  status_codes: z.array(z.string()).nullable(),
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
  http: loadBalancerServiceHealthCheckHttpConfigSchema.optional(),
});

/**
 * Load Balancer service HTTP config schema
 */
export const loadBalancerServiceHttpConfigSchema = z.object({
  sticky_sessions: z.boolean().optional(),
  cookie_name: z.string().optional(),
  cookie_lifetime: z.number().optional(),
  certificates: z.array(z.number()).optional(),
  redirect_http: z.boolean().optional(),
});

/**
 * Load Balancer service schema
 */
export const loadBalancerServiceSchema = z.object({
  protocol: loadBalancerServiceProtocolSchema,
  listen_port: z.number(),
  destination_port: z.number(),
  proxyprotocol: z.boolean(),
  http: loadBalancerServiceHttpConfigSchema.optional(),
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
 */
export const loadBalancerTargetHealthStatusSchema = z.object({
  listen_port: z.number().nullable(),
  status: z.enum(["healthy", "health_check_failed", "unknown"]),
});

/**
 * Load Balancer target schema
 */
export const loadBalancerTargetSchema = z.object({
  type: loadBalancerTargetTypeSchema,
  server: loadBalancerTargetServerSchema.optional(),
  label_selector: loadBalancerTargetLabelSelectorSchema.optional(),
  ip: loadBalancerTargetIpSchema.optional(),
  use_private_ip: z.boolean().optional(),
  health_status: z.array(loadBalancerTargetHealthStatusSchema).optional(),
  targets: z.array(loadBalancerTargetHealthStatusSchema).optional(),
});

/**
 * Load Balancer protection schema
 */
export const loadBalancerProtectionSchema = z.object({
  delete: z.boolean(),
});

/**
 * Load Balancer schema
 */
export const loadBalancerSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    public_net: z.object({
      enabled: z.boolean(),
      ipv4: z
        .object({
          ip: z.string().nullable(),
          dns_ptr: z.string().nullable(),
        })
        .nullable(),
      ipv6: z
        .object({
          ip: z.string().nullable(),
          dns_ptr: z.string().nullable(),
        })
        .nullable(),
    }),
    private_net: z
      .array(
        z.object({
          network: z.number(),
          ip: z.string().nullable(),
        }),
      )
      .optional(),
    location: locationSchema,
    load_balancer_type: z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      max_connections: z.number(),
      max_services: z.number(),
      max_targets: z.number(),
      max_assigned_certificates: z.number(),
      prices: z.array(
        z.object({
          location: z.string(),
          price_hourly: z.object({
            gross: z.string(),
            net: z.string(),
          }),
          price_monthly: z.object({
            gross: z.string(),
            net: z.string(),
          }),
        }),
      ),
    }),
    algorithm: z.object({
      type: loadBalancerAlgorithmTypeSchema,
    }),
    services: z.array(loadBalancerServiceSchema),
    targets: z.array(loadBalancerTargetSchema),
    labels: z.record(z.string(), z.string()),
    created: z.string(),
    included_traffic: z.number(),
    ingoing_traffic: z.number().nullable(),
    outgoing_traffic: z.number().nullable(),
    protection: loadBalancerProtectionSchema,
    blocking: z.array(actionResourceSchema).optional(),
  })
  .passthrough();

/**
 * List Load Balancers response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-list-load-balancers
 */
export const listLoadBalancersResponseSchema = z.object({
  load_balancers: z.array(loadBalancerSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Create Load Balancer request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-create-a-load-balancer
 */
export const createLoadBalancerRequestSchema = z.object({
  name: z.string(),
  load_balancer_type: z.union([z.string(), z.number()]),
  algorithm: z
    .object({
      type: loadBalancerAlgorithmTypeSchema,
    })
    .optional(),
  location: z.string().optional(),
  network_zone: z.string().optional(),
  public_interface: z.boolean().optional(),
  services: z.array(loadBalancerServiceSchema).optional(),
  targets: z.array(loadBalancerTargetSchema).optional(),
  labels: z.record(z.string(), z.string()).optional(),
  network: z.number().optional(),
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
  name: z.string().optional(),
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Update Load Balancer response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-update-a-load-balancer
 */
export const updateLoadBalancerResponseSchema = z.object({
  load_balancer: loadBalancerSchema,
});

/**
 * Delete Load Balancer response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-delete-a-load-balancer
 */
export const deleteLoadBalancerResponseSchema = z.object({
  action: actionSchema.optional(),
});

/**
 * List Load Balancer Actions response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-list-actions-for-a-load-balancer
 */
export const listLoadBalancerActionsResponseSchema = z.object({
  actions: z.array(actionSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Get Load Balancer Action response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-get-an-action-for-a-load-balancer
 */
export const getLoadBalancerActionResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Add Load Balancer Service request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-add-service
 */
export const addLoadBalancerServiceRequestSchema = z.object({
  protocol: loadBalancerServiceProtocolSchema,
  listen_port: z.number(),
  destination_port: z.number(),
  proxyprotocol: z.boolean().optional(),
  http: loadBalancerServiceHttpConfigSchema.optional(),
  health_check: loadBalancerServiceHealthCheckSchema,
});

/**
 * Add Load Balancer Service response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-add-service
 */
export const addLoadBalancerServiceResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Update Load Balancer Service request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-update-service
 */
export const updateLoadBalancerServiceRequestSchema = z.object({
  destination_port: z.number().optional(),
  proxyprotocol: z.boolean().optional(),
  http: loadBalancerServiceHttpConfigSchema.optional(),
  health_check: loadBalancerServiceHealthCheckSchema.optional(),
});

/**
 * Update Load Balancer Service response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-update-service
 */
export const updateLoadBalancerServiceResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Delete Load Balancer Service request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-delete-service
 */
export const deleteLoadBalancerServiceRequestSchema = z.object({});

/**
 * Delete Load Balancer Service response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-delete-service
 */
export const deleteLoadBalancerServiceResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Add Load Balancer Target request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-add-target
 */
export const addLoadBalancerTargetRequestSchema = z.object({
  type: loadBalancerTargetTypeSchema,
  server: loadBalancerTargetServerSchema.optional(),
  label_selector: loadBalancerTargetLabelSelectorSchema.optional(),
  ip: loadBalancerTargetIpSchema.optional(),
  use_private_ip: z.boolean().optional(),
  targets: z
    .array(
      z.object({
        type: loadBalancerTargetTypeSchema,
        server: loadBalancerTargetServerSchema.optional(),
        label_selector: loadBalancerTargetLabelSelectorSchema.optional(),
        ip: loadBalancerTargetIpSchema.optional(),
        use_private_ip: z.boolean().optional(),
      }),
    )
    .optional(),
});

/**
 * Add Load Balancer Target response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-add-target
 */
export const addLoadBalancerTargetResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Remove Load Balancer Target request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-remove-target
 */
export const removeLoadBalancerTargetRequestSchema = z.object({
  type: loadBalancerTargetTypeSchema,
  server: loadBalancerTargetServerSchema.optional(),
  label_selector: loadBalancerTargetLabelSelectorSchema.optional(),
  ip: loadBalancerTargetIpSchema.optional(),
});

/**
 * Remove Load Balancer Target response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-remove-target
 */
export const removeLoadBalancerTargetResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Change Load Balancer Algorithm request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-algorithm
 */
export const changeLoadBalancerAlgorithmRequestSchema = z.object({
  type: loadBalancerAlgorithmTypeSchema,
});

/**
 * Change Load Balancer Algorithm response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-algorithm
 */
export const changeLoadBalancerAlgorithmResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Change Load Balancer reverse DNS request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-reverse-dns-entry-for-this-load-balancer
 */
export const changeLoadBalancerReverseDNSRequestSchema = z.object({
  ip: z.string(),
  dns_ptr: z.string().nullable(),
});

/**
 * Change Load Balancer reverse DNS response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-reverse-dns-entry-for-this-load-balancer
 */
export const changeLoadBalancerReverseDNSResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Change Load Balancer Protection request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-load-balancer-protection
 */
export const changeLoadBalancerProtectionRequestSchema = z.object({
  delete: z.boolean(),
});

/**
 * Change Load Balancer Protection response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-load-balancer-protection
 */
export const changeLoadBalancerProtectionResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Change Load Balancer Type request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-the-type-of-a-load-balancer
 */
export const changeLoadBalancerTypeRequestSchema = z.object({
  load_balancer_type: z.union([z.string(), z.number()]),
});

/**
 * Change Load Balancer Type response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-change-the-type-of-a-load-balancer
 */
export const changeLoadBalancerTypeResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Attach Load Balancer to Network request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-attach-a-load-balancer-to-a-network
 */
export const attachLoadBalancerToNetworkRequestSchema = z.object({
  network: z.number(),
  ip: z.string().optional(),
});

/**
 * Attach Load Balancer to Network response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-attach-a-load-balancer-to-a-network
 */
export const attachLoadBalancerToNetworkResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Detach Load Balancer from Network request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-detach-a-load-balancer-from-a-network
 */
export const detachLoadBalancerFromNetworkRequestSchema = z.object({});

/**
 * Detach Load Balancer from Network response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-detach-a-load-balancer-from-a-network
 */
export const detachLoadBalancerFromNetworkResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Enable Load Balancer public interface request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-enable-the-public-interface-of-a-load-balancer
 */
export const enableLoadBalancerPublicInterfaceRequestSchema = z.object({});

/**
 * Enable Load Balancer public interface response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-enable-the-public-interface-of-a-load-balancer
 */
export const enableLoadBalancerPublicInterfaceResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Disable Load Balancer public interface request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-disable-the-public-interface-of-a-load-balancer
 */
export const disableLoadBalancerPublicInterfaceRequestSchema = z.object({});

/**
 * Disable Load Balancer public interface response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-disable-the-public-interface-of-a-load-balancer
 */
export const disableLoadBalancerPublicInterfaceResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Get Load Balancer Metrics request schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-get-metrics-for-a-load-balancer
 */
export const getLoadBalancerMetricsRequestSchema = z.object({
  type: z.union([z.string(), z.array(z.string())]),
  start: z.string(),
  end: z.string(),
  step: z.number().optional(),
});

/**
 * Load Balancer metrics time series value schema
 */
export const loadBalancerMetricsTimeSeriesValueSchema = z.tuple([z.number(), z.string()]);

/**
 * Load Balancer metrics time series schema
 */
export const loadBalancerMetricsTimeSeriesSchema = z.record(
  z.string(),
  z.object({
    values: z.array(loadBalancerMetricsTimeSeriesValueSchema),
  }),
);

/**
 * Load Balancer metrics schema
 */
export const loadBalancerMetricsSchema = z.object({
  start: z.string(),
  end: z.string(),
  step: z.number(),
  time_series: loadBalancerMetricsTimeSeriesSchema,
});

/**
 * Get Load Balancer Metrics response schema
 * @see https://docs.hetzner.cloud/reference/cloud#load-balancers-get-metrics-for-a-load-balancer
 */
export const getLoadBalancerMetricsResponseSchema = z.object({
  metrics: loadBalancerMetricsSchema,
});
