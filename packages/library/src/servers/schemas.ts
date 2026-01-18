/**
 * Zod schemas for Hetzner Cloud Servers API
 * @see https://docs.hetzner.cloud/reference/cloud#servers-list-servers
 */

import { z } from "zod";

/**
 * Server status schema
 */
export const serverStatusSchema = z.enum([
  "running",
  "initializing",
  "starting",
  "stopping",
  "off",
  "deleting",
  "migrating",
  "rebuilding",
  "unknown",
]);

/**
 * Server type price schema
 */
export const serverTypePriceSchema = z.object({
  location: z.string(),
  price_hourly: z.object({
    net: z.string(),
    gross: z.string(),
  }),
  price_monthly: z.object({
    net: z.string(),
    gross: z.string(),
  }),
});

/**
 * Server type deprecation schema
 */
export const serverTypeDeprecationSchema = z.object({
  announced: z.string(),
  unavailable_after: z.string(),
});

/**
 * Server type schema
 */
export const serverTypeSchema = z
  .object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  cores: z.number(),
  memory: z.number(),
  disk: z.number(),
  prices: z.array(serverTypePriceSchema),
  storage_type: z.enum(["local", "network"]),
  cpu_type: z.enum(["shared", "dedicated"]),
  architecture: z.enum(["x86", "arm"]),
  incompatibilities: z.array(z.unknown()).optional(),
  deprecation: serverTypeDeprecationSchema.nullable().optional(),
})
  .passthrough();

/**
 * Image created from schema
 */
export const imageCreatedFromSchema = z.object({
  id: z.number(),
  name: z.string(),
});

/**
 * Image protection schema
 */
export const imageProtectionSchema = z.object({
  delete: z.boolean(),
});

/**
 * Image deprecation schema
 */
export const imageDeprecationSchema = z.object({
  announced: z.string(),
  unavailable_after: z.string(),
});

/**
 * Image schema
 */
export const imageSchema = z
  .object({
  id: z.number(),
  type: z.enum(["system", "app", "snapshot", "backup"]),
  status: z.enum(["available", "creating", "unavailable"]),
  name: z.string(),
  description: z.string(),
  image_size: z.number().nullable(),
  disk_size: z.number(),
  created: z.string(),
  created_from: imageCreatedFromSchema.nullable(),
  bound_to: z.number().nullable(),
  os_flavor: z.string(),
  os_version: z.string().nullable(),
  rapid_deploy: z.boolean(),
  protection: imageProtectionSchema,
  deprecation: imageDeprecationSchema.nullable().optional(),
  labels: z.record(z.string(), z.string()),
  deleted: z.string().nullable(),
})
  .passthrough();

/**
 * Location schema
 */
export const locationSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  country: z.string(),
  city: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  network_zone: z.string(),
});

/**
 * Datacenter server types schema
 */
export const datacenterServerTypesSchema = z.object({
  supported: z.array(z.number()),
  available: z.array(z.number()),
  available_for_migration: z.array(z.number()),
});

/**
 * Datacenter schema
 */
export const datacenterSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  location: locationSchema,
  server_types: datacenterServerTypesSchema,
});

/**
 * Network subnetwork schema
 */
export const networkSubnetworkSchema = z.object({
  type: z.string(),
  ip_range: z.string(),
  network_zone: z.string(),
  gateway: z.string(),
});

/**
 * Network route schema
 */
export const networkRouteSchema = z.object({
  destination: z.string(),
  gateway: z.string(),
});

/**
 * Network protection schema
 */
export const networkProtectionSchema = z.object({
  delete: z.boolean(),
});

/**
 * Network schema
 */
export const networkSchema = z.object({
  id: z.number(),
  name: z.string(),
  ip_range: z.string(),
  subnetworks: z.array(networkSubnetworkSchema),
  routes: z.array(networkRouteSchema),
  servers: z.array(z.number()),
  load_balancers: z.array(z.number()),
  protection: networkProtectionSchema,
  labels: z.record(z.string(), z.string()),
});

/**
 * Public Net IPv4 schema
 */
export const publicNetIPv4Schema = z.object({
  ip: z.string(),
  blocked: z.boolean(),
  dns_ptr: z.string().nullable(),
});

/**
 * Public Net IPv6 DNS PTR schema
 */
export const publicNetIPv6DNSPtrSchema = z.object({
  ip: z.string(),
  dns_ptr: z.string(),
});

/**
 * Public Net IPv6 schema
 */
export const publicNetIPv6Schema = z.object({
  ip: z.string(),
  blocked: z.boolean(),
  dns_ptr: z.array(publicNetIPv6DNSPtrSchema).nullable(),
});

/**
 * Public Net firewall schema
 */
export const publicNetFirewallSchema = z.object({
  id: z.number(),
  status: z.string(),
});

/**
 * Public Net schema
 */
export const publicNetSchema = z.object({
  ipv4: publicNetIPv4Schema.nullable(),
  ipv6: publicNetIPv6Schema.nullable(),
  firewalls: z.array(publicNetFirewallSchema).nullable(),
  floating_ips: z.array(z.number()),
});

/**
 * Private Net schema
 */
export const privateNetSchema = z.object({
  network: z.number(),
  ip: z.string(),
  alias_ips: z.array(z.string()),
  mac_address: z.string(),
});

/**
 * ISO schema
 */
export const isoSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  type: z.enum(["public", "private"]),
});

/**
 * Backup window schema
 */
export const backupWindowSchema = z.object({
  start: z.string(),
  end: z.string(),
});

/**
 * Server protection schema
 */
export const serverProtectionSchema = z.object({
  delete: z.boolean(),
  rebuild: z.boolean(),
});

/**
 * Server schema
 * Using passthrough to allow additional fields from API that we don't validate
 */
export const serverSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    status: serverStatusSchema,
    created: z.string(),
    public_net: publicNetSchema,
    private_net: z.array(privateNetSchema),
    server_type: serverTypeSchema,
    datacenter: datacenterSchema,
    image: imageSchema,
    iso: isoSchema.nullable(),
    rescue_enabled: z.boolean(),
    locked: z.boolean(),
    backup_window: backupWindowSchema.nullable(),
    outgoing_traffic: z.number().nullable(),
    ingoing_traffic: z.number().nullable(),
    included_traffic: z.number(),
    primary_disk_size: z.number(),
    protection: serverProtectionSchema,
    labels: z.record(z.string(), z.string()),
  volumes: z.array(z.number()),
  load_balancers: z.array(z.number()),
  enable_backup: z.boolean().optional(),
  enable_ipv4: z.boolean().optional(),
  enable_ipv6: z.boolean().optional(),
  })
  .passthrough();

/**
 * Pagination metadata schema
 */
export const paginationMetaSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  previous_page: z.number().nullable(),
  next_page: z.number().nullable(),
  last_page: z.number(),
  total_entries: z.number(),
});

/**
 * List Servers response schema
 */
export const listServersResponseSchema = z.object({
  servers: z.array(serverSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Public Net configuration schema for creating servers
 */
export const createServerPublicNetSchema = z.object({
  enable_ipv4: z.boolean().optional(),
  enable_ipv6: z.boolean().optional(),
  ipv4: z.number().nullable().optional(),
  ipv6: z.number().nullable().optional(),
});

/**
 * Create Server request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-create-a-server
 */
export const createServerRequestSchema = z.object({
  name: z.string().min(1),
  server_type: z.string().min(1),
  image: z.string().min(1),
  location: z.string().optional(),
  datacenter: z.string().optional(), // deprecated, but still supported
  ssh_keys: z.array(z.union([z.string(), z.number()])).optional(),
  volumes: z.array(z.number()).optional(),
  networks: z.array(z.number()).optional(),
  user_data: z.string().optional(),
  labels: z.record(z.string(), z.string()).optional(),
  start_after_create: z.boolean().optional(),
  automount: z.boolean().optional(),
  public_net: createServerPublicNetSchema.optional(),
});

/**
 * Action resource schema
 */
export const actionResourceSchema = z.object({
  id: z.number(),
  type: z.string(),
});

/**
 * Action schema
 */
export const actionSchema = z
  .object({
    id: z.number(),
    command: z.string(),
    status: z.enum(["running", "success", "error"]),
    progress: z.number(),
    started: z.string(),
    finished: z.string().nullable(),
    resources: z.array(actionResourceSchema),
    error: z
      .object({
        code: z.string(),
        message: z.string(),
      })
      .nullable(),
  })
  .passthrough();

/**
 * Create Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-create-a-server
 */
export const createServerResponseSchema = z.object({
  server: serverSchema,
  action: actionSchema,
  next_actions: z.array(actionSchema),
  root_password: z.string().nullable(),
});

/**
 * Get Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-get-a-server
 */
export const getServerResponseSchema = z.object({
  server: serverSchema,
});

/**
 * Update Server request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-update-a-server
 */
export const updateServerRequestSchema = z.object({
  name: z.string().min(1).optional(),
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Update Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-update-a-server
 */
export const updateServerResponseSchema = z.object({
  server: serverSchema,
});

/**
 * Delete Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-delete-a-server
 */
export const deleteServerResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Server metrics time series value schema
 */
export const serverMetricsTimeSeriesValueSchema = z.tuple([z.number(), z.string()]);

/**
 * Server metrics time series schema
 */
export const serverMetricsTimeSeriesSchema = z.record(
  z.string(),
  z.object({
    values: z.array(serverMetricsTimeSeriesValueSchema),
  }),
);

/**
 * Server metrics schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-get-metrics-for-a-server
 */
export const serverMetricsSchema = z.object({
  start: z.string(),
  end: z.string(),
  step: z.number(),
  time_series: serverMetricsTimeSeriesSchema,
});

/**
 * Get Server Metrics response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-get-metrics-for-a-server
 */
export const getServerMetricsResponseSchema = z.object({
  metrics: serverMetricsSchema,
});
