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
  imageSchema,
  locationSchema,
  datacenterSchema,
  networkSchema,
  publicNetSchema,
  privateNetSchema,
  isoSchema,
  backupWindowSchema,
  serverProtectionSchema,
  paginationMetaSchema,
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
  actionSchema,
} from "./schemas";
import type { z } from "zod";

/**
 * Server status values
 */
export type ServerStatus = z.infer<typeof serverStatusSchema>;

/**
 * Server type information
 */
export type ServerType = z.infer<typeof serverTypeSchema>;

/**
 * Image information
 */
export type Image = z.infer<typeof imageSchema>;

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
export type Action = z.infer<typeof actionSchema>;
