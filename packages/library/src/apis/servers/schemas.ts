/**
 * Zod schemas for Hetzner Cloud Servers API
 * @see https://docs.hetzner.cloud/reference/cloud#servers-list-servers
 */

import { z } from "zod";
import { actionSchema } from "@hcloud-js/apis/actions/schemas.js";
import { paginationMetaSchema } from "@hcloud-js/apis/common/schemas.js";

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
 * Server Image created from schema
 */
export const serverImageCreatedFromSchema = z.object({
  id: z.number(),
  name: z.string(),
});

/**
 * Server Image protection schema
 */
export const serverImageProtectionSchema = z.object({
  delete: z.boolean(),
});

/**
 * Server Image deprecation schema
 */
export const serverImageDeprecationSchema = z.object({
  announced: z.string(),
  unavailable_after: z.string(),
});

/**
 * Server Image schema
 */
export const serverImageSchema = z
  .object({
  id: z.number(),
  type: z.enum(["system", "app", "snapshot", "backup"]),
  status: z.enum(["available", "creating", "unavailable"]),
  name: z.string(),
  description: z.string(),
  image_size: z.number().nullable(),
  disk_size: z.number(),
  created: z.string(),
  created_from: serverImageCreatedFromSchema.nullable(),
  bound_to: z.number().nullable(),
  os_flavor: z.string(),
  os_version: z.string().nullable(),
  rapid_deploy: z.boolean(),
  protection: serverImageProtectionSchema,
  deprecation: serverImageDeprecationSchema.nullable().optional(),
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
    image: serverImageSchema,
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
 * Re-exported from actions module for consistency
 * @deprecated Use actionResourceSchema from '../actions/schemas' instead
 */
export { actionResourceSchema } from "@hcloud-js/apis/actions/schemas.js";

/**
 * Action schema (common)
 * Re-exported from actions module for consistency
 */
export { actionSchema } from "@hcloud-js/apis/actions/schemas.js";

/**
 * Server Action schema (alias for actionSchema)
 * Re-exported from actions module for consistency
 * @deprecated Use actionSchema from '../actions/schemas' instead
 */
export { actionSchema as serverActionSchema } from "@hcloud-js/apis/actions/schemas.js";

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


/**
 * List Server Actions response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-list-actions-for-a-server
 */
export const listServerActionsResponseSchema = z.object({
  actions: z.array(actionSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Get Server Action response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-get-an-action-for-a-server
 */
export const getServerActionResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Power On Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-power-on-a-server
 */
export const powerOnServerResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Power Off Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-power-off-a-server
 */
export const powerOffServerResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Reboot Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-soft-reboot-a-server
 */
export const rebootServerResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Reset Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-reset-a-server
 */
export const resetServerResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Shutdown Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-shutdown-a-server
 */
export const shutdownServerResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Attach ISO to Server request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-attach-an-iso-to-a-server
 */
export const attachISOToServerRequestSchema = z.object({
  iso: z.union([z.string(), z.number()]),
});

/**
 * Attach ISO to Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-attach-an-iso-to-a-server
 */
export const attachISOToServerResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Detach ISO from Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-detach-an-iso-from-a-server
 */
export const detachISOFromServerResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Enable Rescue Mode request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-enable-rescue-mode-for-a-server
 */
export const enableRescueModeRequestSchema = z.object({
  type: z.string().optional(),
  ssh_keys: z.array(z.union([z.string(), z.number()])).optional(),
});

/**
 * Enable Rescue Mode response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-enable-rescue-mode-for-a-server
 */
export const enableRescueModeResponseSchema = z.object({
  action: actionSchema,
  root_password: z.string().nullable().optional(),
});

/**
 * Disable Rescue Mode response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-disable-rescue-mode-for-a-server
 */
export const disableRescueModeResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Create Image from Server request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-create-image-from-a-server
 */
export const createImageFromServerRequestSchema = z.object({
  type: z.enum(["snapshot", "backup"]).optional(),
  description: z.string().optional(),
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Create Image from Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-create-image-from-a-server
 */
export const createImageFromServerResponseSchema = z.object({
  action: actionSchema,
  image: serverImageSchema,
});

/**
 * Rebuild Server from Image request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-rebuild-a-server-from-an-image
 */
export const rebuildServerFromImageRequestSchema = z.object({
  image: z.union([z.string(), z.number()]),
});

/**
 * Rebuild Server from Image response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-rebuild-a-server-from-an-image
 */
export const rebuildServerFromImageResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Change Server Protection request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-server-protection
 */
export const changeServerProtectionRequestSchema = z.object({
  delete: z.boolean().optional(),
  rebuild: z.boolean().optional(),
});

/**
 * Change Server Protection response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-server-protection
 */
export const changeServerProtectionResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Change Server Type request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-the-type-of-a-server
 */
export const changeServerTypeRequestSchema = z.object({
  server_type: z.union([z.string(), z.number()]),
  upgrade_disk: z.boolean().optional(),
});

/**
 * Change Server Type response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-the-type-of-a-server
 */
export const changeServerTypeResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Enable Backups request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-enable-and-configure-backups-for-a-server
 */
export const enableBackupsRequestSchema = z.object({
  backup_window: z.string().optional(),
});

/**
 * Enable Backups response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-enable-and-configure-backups-for-a-server
 */
export const enableBackupsResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Disable Backups response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-disable-backups-for-a-server
 */
export const disableBackupsResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Attach Server to Network request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-attach-a-server-to-a-network
 */
export const attachServerToNetworkRequestSchema = z.object({
  network: z.number(),
  ip: z.string().optional(),
  alias_ips: z.array(z.string()).optional(),
});

/**
 * Attach Server to Network response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-attach-a-server-to-a-network
 */
export const attachServerToNetworkResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Detach Server from Network request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-detach-a-server-from-a-network
 */
export const detachServerFromNetworkRequestSchema = z.object({
  network: z.number(),
});

/**
 * Detach Server from Network response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-detach-a-server-from-a-network
 */
export const detachServerFromNetworkResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Change alias IPs of Network request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-alias-ips-of-a-network
 */
export const changeAliasIPsOfNetworkRequestSchema = z.object({
  network: z.number(),
  alias_ips: z.array(z.string()),
});

/**
 * Change alias IPs of Network response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-alias-ips-of-a-network
 */
export const changeAliasIPsOfNetworkResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Change reverse DNS entry for Server request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-reverse-dns-entry-for-this-server
 */
export const changeServerReverseDNSRequestSchema = z.object({
  ip: z.string(),
  dns_ptr: z.string().nullable(),
});

/**
 * Change reverse DNS entry for Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-reverse-dns-entry-for-this-server
 */
export const changeServerReverseDNSResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Request Console for Server request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-request-console-for-a-server
 */
export const requestConsoleForServerRequestSchema = z.object({
  type: z.enum(["vnc", "spice"]).optional(),
});

/**
 * Request Console for Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-request-console-for-a-server
 */
export const requestConsoleForServerResponseSchema = z.object({
  action: actionSchema,
  password: z.string(),
  wss_url: z.string(),
});

/**
 * Reset root Password response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-reset-root-password-of-a-server
 */
export const resetRootPasswordResponseSchema = z.object({
  action: actionSchema,
  root_password: z.string().nullable().optional(),
});

/**
 * Add Server to Placement Group request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-add-a-server-to-a-placement-group
 */
export const addServerToPlacementGroupRequestSchema = z.object({
  placement_group: z.number(),
});

/**
 * Add Server to Placement Group response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-add-a-server-to-a-placement-group
 */
export const addServerToPlacementGroupResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Remove Server from Placement Group request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-remove-from-placement-group
 */
export const removeServerFromPlacementGroupRequestSchema = z.object({});

/**
 * Remove Server from Placement Group response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-remove-from-placement-group
 */
export const removeServerFromPlacementGroupResponseSchema = z.object({
  action: actionSchema,
});
