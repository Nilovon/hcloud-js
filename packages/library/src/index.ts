/**
 * Hetzner Cloud TypeScript SDK
 * @see https://docs.hetzner.cloud/reference/cloud
 */

// Main client
export { HCloudClient } from "./client/index.js";

// Error handling
export { HCloudError } from "./errors/index.js";

// Types
export type { RequestOptions, ApiErrorResponse, ErrorDetailsField } from "./types/index.js";

export type { ClientOptions } from "./config/index.js";

// Configuration
export { HCLOUD_API_BASE_URL, DEFAULT_TIMEOUT_MS } from "./config/index.js";

// Auth utilities
export { createAuthHeader } from "./auth/index.js";

// Servers API
export { ServersClient } from "./servers/index.js";
export type {
  Server,
  ServerStatus,
  ListServersParams,
  ListServersResponse,
  CreateServerParams,
  CreateServerResponse,
  GetServerResponse,
  UpdateServerParams,
  UpdateServerResponse,
  DeleteServerResponse,
  GetServerMetricsParams,
  GetServerMetricsResponse,
  ServerMetrics,
  ServerMetricsTimeSeriesValue,
  PaginationMeta,
  ServerType,
  Image,
  Location,
  Datacenter,
  Network,
  PublicNet,
  PrivateNet,
  ISO,
  BackupWindow,
  ServerProtection,
  Action,
} from "./servers/types.js";

// Servers Zod Schemas
export {
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
} from "./servers/schemas.js";

// Servers Validation utilities
export {
  validateServer,
  validateListServersResponse,
  safeValidateServer,
  safeValidateListServersResponse,
} from "./servers/validation.js";
