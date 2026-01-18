/**
 * Types for Hetzner Cloud Servers API
 * Types are inferred from Zod schemas
 * @see https://docs.hetzner.cloud/reference/cloud#servers-list-servers
 */

// biome-ignore assist/source/organizeImports: we need to import the schemas first
import {
  serverStatusSchema,
  serverSchema,
  serverTypeSchema,
  locationSchema,
  datacenterSchema,
  networkSchema,
  publicNetSchema,
  privateNetSchema,
  isoSchema,
  backupWindowSchema,
  serverProtectionSchema,
  listServersResponseSchema,
  createServerRequestSchema,
  createServerResponseSchema,
  getServerResponseSchema,
  updateServerRequestSchema,
  updateServerResponseSchema,
  deleteServerResponseSchema,
  getServerMetricsResponseSchema,
  serverMetricsSchema,
  serverMetricsTimeSeriesValueSchema,
  serverActionSchema, 
  serverImageSchema,
  listServerActionsResponseSchema,
  getServerActionResponseSchema,
  powerOnServerResponseSchema,
  powerOffServerResponseSchema,
  rebootServerResponseSchema,
  resetServerResponseSchema,
  shutdownServerResponseSchema,
  attachISOToServerRequestSchema,
  attachISOToServerResponseSchema,
  detachISOFromServerResponseSchema,
  enableRescueModeRequestSchema,
  enableRescueModeResponseSchema,
  disableRescueModeResponseSchema,
  createImageFromServerRequestSchema,
  createImageFromServerResponseSchema,
  rebuildServerFromImageRequestSchema,
  rebuildServerFromImageResponseSchema,
  changeServerProtectionRequestSchema,
  changeServerProtectionResponseSchema,
  changeServerTypeRequestSchema,
  changeServerTypeResponseSchema,
  enableBackupsRequestSchema,
  enableBackupsResponseSchema,
  disableBackupsResponseSchema,
  attachServerToNetworkRequestSchema,
  attachServerToNetworkResponseSchema,
  detachServerFromNetworkRequestSchema,
  detachServerFromNetworkResponseSchema,
  changeAliasIPsOfNetworkRequestSchema,
  changeAliasIPsOfNetworkResponseSchema,
  changeServerReverseDNSRequestSchema,
  changeServerReverseDNSResponseSchema,
  requestConsoleForServerRequestSchema,
  requestConsoleForServerResponseSchema,
  resetRootPasswordResponseSchema,
  addServerToPlacementGroupRequestSchema,
  addServerToPlacementGroupResponseSchema,
  removeServerFromPlacementGroupRequestSchema,
  removeServerFromPlacementGroupResponseSchema,
} from "../../apis/servers/schemas";
import type { z } from "zod";
import type { paginationMetaSchema } from "../../apis/common/schemas";

/**
 * Server status values
 */
export type ServerStatus = z.infer<typeof serverStatusSchema>;

/**
 * Server type information
 */
export type ServerType = z.infer<typeof serverTypeSchema>;

/**
 * Server Image information
 */
export type ServerImage = z.infer<typeof serverImageSchema>;

/**
 * Location information
 */
export type Location = z.infer<typeof locationSchema>;

/**
 * Datacenter information
 */
export type Datacenter = z.infer<typeof datacenterSchema>;

/**
 * Network information
 */
export type Network = z.infer<typeof networkSchema>;

/**
 * Public Net information
 */
export type PublicNet = z.infer<typeof publicNetSchema>;

/**
 * Private Net information
 */
export type PrivateNet = z.infer<typeof privateNetSchema>;

/**
 * ISO information
 */
export type ISO = z.infer<typeof isoSchema>;

/**
 * Backup window information
 */
export type BackupWindow = z.infer<typeof backupWindowSchema>;

/**
 * Server protection settings
 */
export type ServerProtection = z.infer<typeof serverProtectionSchema>;

/**
 * Hetzner Cloud Server
 * @see https://docs.hetzner.cloud/reference/cloud#servers-list-servers
 */
export type Server = z.infer<typeof serverSchema>;

/**
 * Pagination metadata
 * @see https://docs.hetzner.cloud/reference/cloud#pagination
 */
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

/**
 * List Servers query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-list-servers
 */
export interface ListServersParams {
  /**
   * Can be used to filter Servers by their name. The response will only contain the Server matching the specified name.
   */
  name?: string;
  /**
   * Can be used to filter Servers by labels. The response will only contain Servers matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, name, name:asc, name:desc, created, created:asc, created:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
  /**
   * Can be used multiple times. The response will only contain Servers matching the status.
   * Choices: running, initializing, starting, stopping, off, deleting, migrating, rebuilding, unknown
   */
  status?: ServerStatus | ServerStatus[];
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
 * List Servers response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-list-servers
 */
export type ListServersResponse = z.infer<typeof listServersResponseSchema>;

/**
 * Create Server request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-create-a-server
 */
export type CreateServerParams = z.infer<typeof createServerRequestSchema>;

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
export type UpdateServerParams = z.infer<typeof updateServerRequestSchema>;

/**
 * Update Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-update-a-server
 */
export type UpdateServerResponse = z.infer<typeof updateServerResponseSchema>;

/**
 * Delete Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-delete-a-server
 */
export type DeleteServerResponse = z.infer<typeof deleteServerResponseSchema>;

/**
 * Server Metrics query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-get-metrics-for-a-server
 */
export interface GetServerMetricsParams {
  /**
   * Type of metrics to get. Can be one or multiple of: cpu, disk, network
   */
  type: Array<"cpu" | "disk" | "network"> | "cpu" | "disk" | "network";
  /**
   * Start of period to get Metrics for (ISO 8601 format)
   */
  start: string;
  /**
   * End of period to get Metrics for (ISO 8601 format)
   */
  end: string;
  /**
   * Resolution of results in seconds
   */
  step?: number;
}

/**
 * Server Metrics time series value
 */
export type ServerMetricsTimeSeriesValue = z.infer<typeof serverMetricsTimeSeriesValueSchema>;

/**
 * Server Metrics
 */
export type ServerMetrics = z.infer<typeof serverMetricsSchema>;

/**
 * Get Server Metrics response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-get-metrics-for-a-server
 */
export type GetServerMetricsResponse = z.infer<typeof getServerMetricsResponseSchema>;

/**
 * Action information
 */
export type ServerAction = z.infer<typeof serverActionSchema>;

/**
 * List Server Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-list-actions-for-a-server
 */
export interface ListServerActionsParams {
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
 * List Server Actions response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-list-actions-for-a-server
 */
export type ListServerActionsResponse = z.infer<typeof listServerActionsResponseSchema>;

/**
 * Get Server Action response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-get-an-action-for-a-server
 */
export type GetServerActionResponse = z.infer<typeof getServerActionResponseSchema>;

/**
 * Power On Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-power-on-a-server
 */
export type PowerOnServerResponse = z.infer<typeof powerOnServerResponseSchema>;

/**
 * Power Off Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-power-off-a-server
 */
export type PowerOffServerResponse = z.infer<typeof powerOffServerResponseSchema>;

/**
 * Reboot Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-soft-reboot-a-server
 */
export type RebootServerResponse = z.infer<typeof rebootServerResponseSchema>;

/**
 * Reset Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-reset-a-server
 */
export type ResetServerResponse = z.infer<typeof resetServerResponseSchema>;

/**
 * Shutdown Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-shutdown-a-server
 */
export type ShutdownServerResponse = z.infer<typeof shutdownServerResponseSchema>;

/**
 * Attach ISO to Server parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-attach-an-iso-to-a-server
 */
export type AttachISOToServerParams = z.infer<typeof attachISOToServerRequestSchema>;

/**
 * Attach ISO to Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-attach-an-iso-to-a-server
 */
export type AttachISOToServerResponse = z.infer<typeof attachISOToServerResponseSchema>;

/**
 * Detach ISO from Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-detach-an-iso-from-a-server
 */
export type DetachISOFromServerResponse = z.infer<typeof detachISOFromServerResponseSchema>;

/**
 * Enable Rescue Mode parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-enable-rescue-mode-for-a-server
 */
export type EnableRescueModeParams = z.infer<typeof enableRescueModeRequestSchema>;

/**
 * Enable Rescue Mode response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-enable-rescue-mode-for-a-server
 */
export type EnableRescueModeResponse = z.infer<typeof enableRescueModeResponseSchema>;

/**
 * Disable Rescue Mode response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-disable-rescue-mode-for-a-server
 */
export type DisableRescueModeResponse = z.infer<typeof disableRescueModeResponseSchema>;

/**
 * Create Image from Server parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-create-image-from-a-server
 */
export type CreateImageFromServerParams = z.infer<typeof createImageFromServerRequestSchema>;

/**
 * Create Image from Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-create-image-from-a-server
 */
export type CreateImageFromServerResponse = z.infer<typeof createImageFromServerResponseSchema>;

/**
 * Rebuild Server from Image parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-rebuild-a-server-from-an-image
 */
export type RebuildServerFromImageParams = z.infer<typeof rebuildServerFromImageRequestSchema>;

/**
 * Rebuild Server from Image response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-rebuild-a-server-from-an-image
 */
export type RebuildServerFromImageResponse = z.infer<
  typeof rebuildServerFromImageResponseSchema
>;

/**
 * Change Server Protection parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-server-protection
 */
export type ChangeServerProtectionParams = z.infer<
  typeof changeServerProtectionRequestSchema
>;

/**
 * Change Server Protection response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-server-protection
 */
export type ChangeServerProtectionResponse = z.infer<
  typeof changeServerProtectionResponseSchema
>;

/**
 * Change Server Type parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-the-type-of-a-server
 */
export type ChangeServerTypeParams = z.infer<typeof changeServerTypeRequestSchema>;

/**
 * Change Server Type response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-the-type-of-a-server
 */
export type ChangeServerTypeResponse = z.infer<typeof changeServerTypeResponseSchema>;

/**
 * Enable Backups parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-enable-and-configure-backups-for-a-server
 */
export type EnableBackupsParams = z.infer<typeof enableBackupsRequestSchema>;

/**
 * Enable Backups response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-enable-and-configure-backups-for-a-server
 */
export type EnableBackupsResponse = z.infer<typeof enableBackupsResponseSchema>;

/**
 * Disable Backups response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-disable-backups-for-a-server
 */
export type DisableBackupsResponse = z.infer<typeof disableBackupsResponseSchema>;

/**
 * Attach Server to Network parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-attach-a-server-to-a-network
 */
export type AttachServerToNetworkParams = z.infer<typeof attachServerToNetworkRequestSchema>;

/**
 * Attach Server to Network response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-attach-a-server-to-a-network
 */
export type AttachServerToNetworkResponse = z.infer<typeof attachServerToNetworkResponseSchema>;

/**
 * Detach Server from Network parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-detach-a-server-from-a-network
 */
export type DetachServerFromNetworkParams = z.infer<
  typeof detachServerFromNetworkRequestSchema
>;

/**
 * Detach Server from Network response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-detach-a-server-from-a-network
 */
export type DetachServerFromNetworkResponse = z.infer<
  typeof detachServerFromNetworkResponseSchema
>;

/**
 * Change alias IPs of Network parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-alias-ips-of-a-network
 */
export type ChangeAliasIPsOfNetworkParams = z.infer<
  typeof changeAliasIPsOfNetworkRequestSchema
>;

/**
 * Change alias IPs of Network response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-alias-ips-of-a-network
 */
export type ChangeAliasIPsOfNetworkResponse = z.infer<
  typeof changeAliasIPsOfNetworkResponseSchema
>;

/**
 * Change reverse DNS entry for Server parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-reverse-dns-entry-for-this-server
 */
export type ChangeServerReverseDNSParams = z.infer<typeof changeServerReverseDNSRequestSchema>;

/**
 * Change reverse DNS entry for Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-change-reverse-dns-entry-for-this-server
 */
export type ChangeServerReverseDNSResponse = z.infer<
  typeof changeServerReverseDNSResponseSchema
>;

/**
 * Request Console for Server parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-request-console-for-a-server
 */
export type RequestConsoleForServerParams = z.infer<
  typeof requestConsoleForServerRequestSchema
>;

/**
 * Request Console for Server response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-request-console-for-a-server
 */
export type RequestConsoleForServerResponse = z.infer<
  typeof requestConsoleForServerResponseSchema
>;

/**
 * Reset root Password response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-reset-root-password-of-a-server
 */
export type ResetRootPasswordResponse = z.infer<typeof resetRootPasswordResponseSchema>;

/**
 * Add Server to Placement Group parameters
 * @see https://docs.hetzner.cloud/reference/cloud#servers-add-a-server-to-a-placement-group
 */
export type AddServerToPlacementGroupParams = z.infer<
  typeof addServerToPlacementGroupRequestSchema
>;

/**
 * Add Server to Placement Group response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-add-a-server-to-a-placement-group
 */
export type AddServerToPlacementGroupResponse = z.infer<
  typeof addServerToPlacementGroupResponseSchema
>;

/**
 * Remove Server from Placement Group response
 * @see https://docs.hetzner.cloud/reference/cloud#servers-remove-from-placement-group
 */
export type RemoveServerFromPlacementGroupResponse = z.infer<
  typeof removeServerFromPlacementGroupResponseSchema
>;