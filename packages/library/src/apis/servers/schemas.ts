/**
 * Zod schemas for Hetzner Cloud Servers API
 * @see https://docs.hetzner.cloud/reference/cloud#servers
 */

import { z } from "zod";
import { actionSchema } from "../actions/schemas";
import { labelsSchema, metaSchema, metricsSchema } from "../common/schemas";
import { datacenterSchema } from "../datacenters/schemas";
import { imageSchema } from "../images/schemas";
import { isoSchema } from "../isos/schemas";
import { locationSchema } from "../locations/schemas";
import { placementGroupSchema } from "../placement-groups/schemas";
import { serverTypeSchema } from "../server-types/schemas";

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
 * Public IPv4 address of a server
 */
export const serverPublicNetIPv4Schema = z.object({
  /** ID of the primary IP. */
  id: z.number().optional(),
  ip: z.string(),
  blocked: z.boolean(),
  dns_ptr: z.string().nullable(),
});

/**
 * Reverse DNS entry of a single IPv6 address of a server
 */
export const serverPublicNetIPv6DnsPtrSchema = z.object({
  ip: z.string(),
  dns_ptr: z.string(),
});

/**
 * Public IPv6 network of a server
 */
export const serverPublicNetIPv6Schema = z.object({
  /** ID of the primary IP. */
  id: z.number().optional(),
  /** The IPv6 network in CIDR notation. */
  ip: z.string(),
  blocked: z.boolean(),
  dns_ptr: z.array(serverPublicNetIPv6DnsPtrSchema).nullable(),
});

/**
 * Status of a firewall applied to the public network interface of a server
 */
export const serverPublicNetFirewallSchema = z.object({
  /** ID of the firewall. */
  id: z.number(),
  status: z.enum(["applied", "pending"]),
});

/**
 * Public network information of a server
 */
export const serverPublicNetSchema = z.object({
  ipv4: serverPublicNetIPv4Schema.nullable(),
  ipv6: serverPublicNetIPv6Schema.nullable(),
  /** IDs of the floating IPs assigned to the server. */
  floating_ips: z.array(z.number()),
  firewalls: z.array(serverPublicNetFirewallSchema).nullable().optional(),
});

/**
 * Attachment of a server to a private network
 */
export const serverPrivateNetSchema = z.object({
  /** ID of the network. */
  network: z.number(),
  ip: z.string(),
  alias_ips: z.array(z.string()),
  mac_address: z.string(),
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
 */
export const serverSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: serverStatusSchema,
  created: z.string(),
  public_net: serverPublicNetSchema,
  private_net: z.array(serverPrivateNetSchema),
  server_type: serverTypeSchema,
  /** Location the server is hosted in. */
  location: locationSchema,
  /**
   * @deprecated The API does not return the datacenter of a server anymore, use `location` instead.
   * @see https://docs.hetzner.cloud/changelog#2026-07-01-removing-datacenters
   */
  datacenter: datacenterSchema.optional(),
  /** Image the server was created from. `null` if the image does not exist anymore. */
  image: imageSchema.nullable(),
  /** ISO attached to the server, if any. */
  iso: isoSchema.nullable(),
  rescue_enabled: z.boolean(),
  locked: z.boolean(),
  /** Time window (UTC) in which backups run, e.g. `22-02`. `null` if backups are disabled. */
  backup_window: z.string().nullable(),
  /** Outbound traffic of the current billing period in bytes. */
  outgoing_traffic: z.number().nullable(),
  /** Inbound traffic of the current billing period in bytes. */
  ingoing_traffic: z.number().nullable(),
  /** Free traffic of the current billing period in bytes. */
  included_traffic: z.number().nullable(),
  /** Size of the primary disk in GB. */
  primary_disk_size: z.number(),
  protection: serverProtectionSchema,
  labels: labelsSchema,
  /** IDs of the volumes attached to the server. */
  volumes: z.array(z.number()),
  /** IDs of the load balancers targeting the server. */
  load_balancers: z.array(z.number()).optional(),
  placement_group: placementGroupSchema.nullable().optional(),
});

/**
 * List Servers response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-list-servers
 */
export const listServersResponseSchema = z.object({
  servers: z.array(serverSchema),
  meta: metaSchema.optional(),
});

/**
 * Public network configuration for creating servers
 */
export const createServerPublicNetSchema = z.object({
  /** Attach an IPv4 to the server. Default: `true`. */
  enable_ipv4: z.boolean().optional(),
  /** Attach an IPv6 to the server. Default: `true`. */
  enable_ipv6: z.boolean().optional(),
  /** ID of an existing primary IPv4 to assign. A new one is created if omitted. */
  ipv4: z.number().nullable().optional(),
  /** ID of an existing primary IPv6 to assign. A new one is created if omitted. */
  ipv6: z.number().nullable().optional(),
});

/**
 * Firewall to apply when creating a server
 */
export const createServerFirewallSchema = z.object({
  /** ID of the firewall. */
  firewall: z.number(),
});

/**
 * Create Server request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-create-a-server
 */
export const createServerRequestSchema = z.object({
  /** Name of the server. Must be unique per project and a valid hostname (RFC 1123). */
  name: z.string().min(1),
  /** ID or name of the server type. */
  server_type: z.union([z.string().min(1), z.number()]),
  /** ID or name of the image. */
  image: z.union([z.string().min(1), z.number()]),
  /** ID or name of the location. */
  location: z.union([z.string().min(1), z.number()]).optional(),
  /** IDs or names of the SSH keys to inject. */
  ssh_keys: z.array(z.union([z.string(), z.number()])).optional(),
  /** IDs of the volumes to attach. */
  volumes: z.array(z.number()).optional(),
  /** IDs of the networks to attach the server to. */
  networks: z.array(z.number()).optional(),
  /** Firewalls to apply to the public network interface. */
  firewalls: z.array(createServerFirewallSchema).optional(),
  /** Cloud-Init user data. */
  user_data: z.string().optional(),
  labels: labelsSchema.optional(),
  /** Start the server after creation. Default: `true`. */
  start_after_create: z.boolean().optional(),
  /** Auto-mount the volumes after attaching them. */
  automount: z.boolean().optional(),
  /** ID of the placement group the server is added to. */
  placement_group: z.number().optional(),
  public_net: createServerPublicNetSchema.optional(),
});

/**
 * Create Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-create-a-server
 */
export const createServerResponseSchema = z.object({
  server: serverSchema,
  action: actionSchema,
  next_actions: z.array(actionSchema),
  /** Root password. `null` if SSH keys were passed. */
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
  labels: labelsSchema.optional(),
});

/**
 * Update Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-update-a-server
 */
export const updateServerResponseSchema = z.object({
  server: serverSchema,
});

/**
 * Get Server Metrics response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-get-metrics-for-a-server
 */
export const getServerMetricsResponseSchema = z.object({
  metrics: metricsSchema,
});

/**
 * Attach ISO to Server request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-attach-an-iso-to-a-server
 */
export const attachISOToServerRequestSchema = z.object({
  /** ID or name of the ISO. */
  iso: z.union([z.string().min(1), z.number()]),
});

/**
 * Enable Rescue Mode request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-enable-rescue-mode-for-a-server
 */
export const enableRescueModeRequestSchema = z.object({
  /** Type of rescue system to boot. Default: `linux64`. */
  type: z.enum(["linux64"]).optional(),
  /** IDs of the SSH keys to inject into the rescue system. */
  ssh_keys: z.array(z.number()).optional(),
});

/**
 * Enable Rescue Mode response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-enable-rescue-mode-for-a-server
 */
export const enableRescueModeResponseSchema = z.object({
  action: actionSchema,
  /** Root password of the rescue system. */
  root_password: z.string(),
});

/**
 * Create Image from Server request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-create-image-from-a-server
 */
export const createImageFromServerRequestSchema = z.object({
  /** Type of the image. Default: `snapshot`. */
  type: z.enum(["snapshot", "backup"]).optional(),
  description: z.string().optional(),
  labels: labelsSchema.optional(),
});

/**
 * Create Image from Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-create-image-from-a-server
 */
export const createImageFromServerResponseSchema = z.object({
  action: actionSchema,
  image: imageSchema,
});

/**
 * Rebuild Server from Image request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-rebuild-a-server-from-an-image
 */
export const rebuildServerFromImageRequestSchema = z.object({
  /** ID or name of the image to rebuild from. */
  image: z.union([z.string().min(1), z.number()]),
  /** Cloud-Init user data. Replaces the user data the server was created with. */
  user_data: z.string().optional(),
});

/**
 * Rebuild Server from Image response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-rebuild-a-server-from-an-image
 */
export const rebuildServerFromImageResponseSchema = z.object({
  action: actionSchema,
  /** New root password. `null` if the server has SSH keys. */
  root_password: z.string().nullable().optional(),
});

/**
 * Change Server Protection request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-server-protection
 */
export const changeServerProtectionRequestSchema = z.object({
  /** Prevent the server from being deleted. */
  delete: z.boolean().optional(),
  /** Prevent the server from being rebuilt. */
  rebuild: z.boolean().optional(),
});

/**
 * Change Server Type request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-the-type-of-a-server
 */
export const changeServerTypeRequestSchema = z.object({
  /** ID or name of the server type to migrate to. */
  server_type: z.union([z.string().min(1), z.number()]),
  /** If `false`, the disk is not upgraded, which allows downgrading the server type later. */
  upgrade_disk: z.boolean(),
});

/**
 * Attach Server to Network request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-attach-a-server-to-a-network
 */
export const attachServerToNetworkRequestSchema = z.object({
  /** ID of the network. */
  network: z.number(),
  /** IP to assign to the server. Chosen automatically if omitted. */
  ip: z.string().optional(),
  /** Additional IPs to assign to the server. */
  alias_ips: z.array(z.string()).optional(),
  /** IP range (CIDR) of the subnet to attach to. */
  ip_range: z.string().optional(),
});

/**
 * Detach Server from Network request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-detach-a-server-from-a-network
 */
export const detachServerFromNetworkRequestSchema = z.object({
  /** ID of the network. */
  network: z.number(),
});

/**
 * Change alias IPs of Network request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-alias-ips-of-a-network
 */
export const changeAliasIPsOfNetworkRequestSchema = z.object({
  /** ID of the network. */
  network: z.number(),
  /** New alias IPs of the server in the network. Replaces the existing ones. */
  alias_ips: z.array(z.string()),
});

/**
 * Change reverse DNS entry for Server request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-reverse-dns-entry-for-this-server
 */
export const changeServerReverseDNSRequestSchema = z.object({
  /** Primary IP address of the server the entry is set for. */
  ip: z.string(),
  /** Hostname to set as reverse DNS entry. `null` resets it to the default. */
  dns_ptr: z.string().nullable(),
});

/**
 * Request Console for Server response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-request-console-for-a-server
 */
export const requestConsoleForServerResponseSchema = z.object({
  action: actionSchema,
  /** URL of the websocket proxy. Includes a token which is valid for a limited time only. */
  wss_url: z.string(),
  /** VNC password. Only works in combination with `wss_url`. */
  password: z.string(),
});

/**
 * Reset root Password response schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-reset-root-password-of-a-server
 */
export const resetRootPasswordResponseSchema = z.object({
  action: actionSchema,
  /** The new root password. */
  root_password: z.string(),
});

/**
 * Add Server to Placement Group request schema
 * @see https://docs.hetzner.cloud/reference/cloud#servers-add-a-server-to-a-placement-group
 */
export const addServerToPlacementGroupRequestSchema = z.object({
  /** ID of the placement group. */
  placement_group: z.number(),
});
