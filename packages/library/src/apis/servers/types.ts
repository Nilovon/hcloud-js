/**
 * Types for Hetzner Cloud Servers API
 * @see https://docs.hetzner.cloud/reference/cloud#servers
 */

import type { z } from "zod";
import type {
  Action,
  ActionResponse,
  GetActionResponse,
  ListActionsParams,
  ListActionsResponse,
} from "../actions/types";
import type { Metrics, OneOrMany, PageParams, SortParam } from "../common/types";
import type {
  addServerToPlacementGroupRequestSchema,
  attachISOToServerRequestSchema,
  attachServerToNetworkRequestSchema,
  changeAliasIPsOfNetworkRequestSchema,
  changeServerProtectionRequestSchema,
  changeServerReverseDNSRequestSchema,
  changeServerTypeRequestSchema,
  createImageFromServerRequestSchema,
  createImageFromServerResponseSchema,
  createServerFirewallSchema,
  createServerPublicNetSchema,
  createServerRequestSchema,
  createServerResponseSchema,
  detachServerFromNetworkRequestSchema,
  enableRescueModeRequestSchema,
  enableRescueModeResponseSchema,
  getServerMetricsResponseSchema,
  getServerResponseSchema,
  listServersResponseSchema,
  rebuildServerFromImageRequestSchema,
  rebuildServerFromImageResponseSchema,
  requestConsoleForServerResponseSchema,
  resetRootPasswordResponseSchema,
  serverPrivateNetSchema,
  serverProtectionSchema,
  serverPublicNetFirewallSchema,
  serverPublicNetIPv4Schema,
  serverPublicNetIPv6Schema,
  serverPublicNetSchema,
  serverSchema,
  serverStatusSchema,
  updateServerRequestSchema,
  updateServerResponseSchema,
} from "./schemas";

/**
 * Server status values
 */
export type ServerStatus = z.infer<typeof serverStatusSchema>;

/**
 * Public IPv4 address of a server
 */
export type ServerPublicNetIPv4 = z.infer<typeof serverPublicNetIPv4Schema>;

/**
 * Public IPv6 network of a server
 */
export type ServerPublicNetIPv6 = z.infer<typeof serverPublicNetIPv6Schema>;

/**
 * Status of a firewall applied to the public network interface of a server
 */
export type ServerPublicNetFirewall = z.infer<typeof serverPublicNetFirewallSchema>;

/**
 * Public network information of a server
 */
export type ServerPublicNet = z.infer<typeof serverPublicNetSchema>;

/**
 * Attachment of a server to a private network
 */
export type ServerPrivateNet = z.infer<typeof serverPrivateNetSchema>;

/**
 * Server protection settings
 */
export type ServerProtection = z.infer<typeof serverProtectionSchema>;

/**
 * Hetzner Cloud Server
 * @see https://docs.hetzner.cloud/reference/cloud#servers
 */
export type Server = z.infer<typeof serverSchema>;

/**
 * Fields servers can be sorted by
 */
export type ServerSort = SortParam<"id" | "name" | "created">;

/**
 * List Servers query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-list-servers
 */
export interface ListServersParams extends PageParams {
  /**
   * Only return the server with this exact name.
   */
  name?: string;
  /**
   * Only return servers matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
  /**
   * Only return servers with one of the given statuses.
   */
  status?: OneOrMany<ServerStatus>;
  /**
   * Sort the result.
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: OneOrMany<ServerSort>;
}

/**
 * List Servers response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-list-servers
 */
export type ListServersResponse = z.infer<typeof listServersResponseSchema>;

/**
 * Public network configuration for creating servers
 */
export type CreateServerPublicNet = z.input<typeof createServerPublicNetSchema>;

/**
 * Firewall to apply when creating a server
 */
export type CreateServerFirewall = z.input<typeof createServerFirewallSchema>;

/**
 * Create Server request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-create-a-server
 */
export type CreateServerParams = z.input<typeof createServerRequestSchema>;

/**
 * Create Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-create-a-server
 */
export type CreateServerResponse = z.infer<typeof createServerResponseSchema>;

/**
 * Get Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-get-a-server
 */
export type GetServerResponse = z.infer<typeof getServerResponseSchema>;

/**
 * Update Server request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-update-a-server
 */
export type UpdateServerParams = z.input<typeof updateServerRequestSchema>;

/**
 * Update Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-update-a-server
 */
export type UpdateServerResponse = z.infer<typeof updateServerResponseSchema>;

/**
 * Delete Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-delete-a-server
 */
export type DeleteServerResponse = ActionResponse;

/**
 * Options for waiting until a server reaches a status
 */
export interface WaitForServerStatusOptions {
  /**
   * Delay between polls in milliseconds. Default: `1000`.
   */
  pollInterval?: number;
  /**
   * Maximum time to wait in milliseconds. Default: `300000` (5 minutes).
   */
  timeout?: number;
  /**
   * Abort waiting.
   */
  signal?: AbortSignal;
}

/**
 * Type of server metrics
 */
export type ServerMetricsType = "cpu" | "disk" | "network";

/**
 * Server Metrics query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-get-metrics-for-a-server
 */
export interface GetServerMetricsParams {
  /**
   * Type(s) of metrics to get.
   */
  type: OneOrMany<ServerMetricsType>;
  /**
   * Start of the period to get metrics for. A `Date` or an ISO 8601 string.
   */
  start: string | Date;
  /**
   * End of the period to get metrics for. A `Date` or an ISO 8601 string.
   */
  end: string | Date;
  /**
   * Resolution of the results in seconds.
   */
  step?: number;
}

/**
 * Server Metrics
 */
export type ServerMetrics = Metrics;

/**
 * Get Server Metrics response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-get-metrics-for-a-server
 */
export type GetServerMetricsResponse = z.infer<typeof getServerMetricsResponseSchema>;

/**
 * Action of a server
 * @deprecated Use `Action` instead.
 */
export type ServerAction = Action;

/**
 * List Server Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-list-actions-for-a-server
 */
export type ListServerActionsParams = ListActionsParams;

/**
 * List Server Actions response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-list-actions-for-a-server
 */
export type ListServerActionsResponse = ListActionsResponse;

/**
 * Get Server Action response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-get-an-action-for-a-server
 */
export type GetServerActionResponse = GetActionResponse;

/**
 * Power On Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-power-on-a-server
 */
export type PowerOnServerResponse = ActionResponse;

/**
 * Power Off Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-power-off-a-server
 */
export type PowerOffServerResponse = ActionResponse;

/**
 * Reboot Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-soft-reboot-a-server
 */
export type RebootServerResponse = ActionResponse;

/**
 * Reset Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-reset-a-server
 */
export type ResetServerResponse = ActionResponse;

/**
 * Shutdown Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-shutdown-a-server
 */
export type ShutdownServerResponse = ActionResponse;

/**
 * Attach ISO to Server parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-attach-an-iso-to-a-server
 */
export type AttachISOToServerParams = z.input<typeof attachISOToServerRequestSchema>;

/**
 * Attach ISO to Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-attach-an-iso-to-a-server
 */
export type AttachISOToServerResponse = ActionResponse;

/**
 * Detach ISO from Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-detach-an-iso-from-a-server
 */
export type DetachISOFromServerResponse = ActionResponse;

/**
 * Enable Rescue Mode parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-enable-rescue-mode-for-a-server
 */
export type EnableRescueModeParams = z.input<typeof enableRescueModeRequestSchema>;

/**
 * Enable Rescue Mode response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-enable-rescue-mode-for-a-server
 */
export type EnableRescueModeResponse = z.infer<typeof enableRescueModeResponseSchema>;

/**
 * Disable Rescue Mode response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-disable-rescue-mode-for-a-server
 */
export type DisableRescueModeResponse = ActionResponse;

/**
 * Create Image from Server parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-create-image-from-a-server
 */
export type CreateImageFromServerParams = z.input<typeof createImageFromServerRequestSchema>;

/**
 * Create Image from Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-create-image-from-a-server
 */
export type CreateImageFromServerResponse = z.infer<typeof createImageFromServerResponseSchema>;

/**
 * Rebuild Server from Image parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-rebuild-a-server-from-an-image
 */
export type RebuildServerFromImageParams = z.input<typeof rebuildServerFromImageRequestSchema>;

/**
 * Rebuild Server from Image response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-rebuild-a-server-from-an-image
 */
export type RebuildServerFromImageResponse = z.infer<typeof rebuildServerFromImageResponseSchema>;

/**
 * Change Server Protection parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-server-protection
 */
export type ChangeServerProtectionParams = z.input<typeof changeServerProtectionRequestSchema>;

/**
 * Change Server Protection response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-server-protection
 */
export type ChangeServerProtectionResponse = ActionResponse;

/**
 * Change Server Type parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-the-type-of-a-server
 */
export type ChangeServerTypeParams = z.input<typeof changeServerTypeRequestSchema>;

/**
 * Change Server Type response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-the-type-of-a-server
 */
export type ChangeServerTypeResponse = ActionResponse;

/**
 * Enable Backups response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-enable-and-configure-backups-for-a-server
 */
export type EnableBackupsResponse = ActionResponse;

/**
 * Disable Backups response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-disable-backups-for-a-server
 */
export type DisableBackupsResponse = ActionResponse;

/**
 * Attach Server to Network parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-attach-a-server-to-a-network
 */
export type AttachServerToNetworkParams = z.input<typeof attachServerToNetworkRequestSchema>;

/**
 * Attach Server to Network response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-attach-a-server-to-a-network
 */
export type AttachServerToNetworkResponse = ActionResponse;

/**
 * Detach Server from Network parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-detach-a-server-from-a-network
 */
export type DetachServerFromNetworkParams = z.input<typeof detachServerFromNetworkRequestSchema>;

/**
 * Detach Server from Network response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-detach-a-server-from-a-network
 */
export type DetachServerFromNetworkResponse = ActionResponse;

/**
 * Change alias IPs of Network parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-alias-ips-of-a-network
 */
export type ChangeAliasIPsOfNetworkParams = z.input<typeof changeAliasIPsOfNetworkRequestSchema>;

/**
 * Change alias IPs of Network response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-alias-ips-of-a-network
 */
export type ChangeAliasIPsOfNetworkResponse = ActionResponse;

/**
 * Change reverse DNS entry for Server parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-reverse-dns-entry-for-this-server
 */
export type ChangeServerReverseDNSParams = z.input<typeof changeServerReverseDNSRequestSchema>;

/**
 * Change reverse DNS entry for Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-reverse-dns-entry-for-this-server
 */
export type ChangeServerReverseDNSResponse = ActionResponse;

/**
 * Request Console for Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-request-console-for-a-server
 */
export type RequestConsoleForServerResponse = z.infer<typeof requestConsoleForServerResponseSchema>;

/**
 * Reset root Password response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-reset-root-password-of-a-server
 */
export type ResetRootPasswordResponse = z.infer<typeof resetRootPasswordResponseSchema>;

/**
 * Add Server to Placement Group parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-add-a-server-to-a-placement-group
 */
export type AddServerToPlacementGroupParams = z.input<
  typeof addServerToPlacementGroupRequestSchema
>;

/**
 * Add Server to Placement Group response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-add-a-server-to-a-placement-group
 */
export type AddServerToPlacementGroupResponse = ActionResponse;

/**
 * Remove Server from Placement Group response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-remove-from-placement-group
 */
export type RemoveServerFromPlacementGroupResponse = ActionResponse;
