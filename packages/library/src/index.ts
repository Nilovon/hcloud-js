/**
 * @nilovonjs/hcloud-js - TypeScript SDK for the Hetzner Cloud API
 * @see https://docs.hetzner.cloud/reference/cloud
 * @packageDocumentation
 */

// Client
export { HCloudClient, createClient } from "./client";
export {
  BaseClient,
  DEFAULT_ACTION_TIMEOUT_MS,
  defaultPollInterval,
  type LowLevelRequestOptions,
  type ResolvedClientConfig,
} from "./core/base-client";
export { VERSION } from "./version";

// Configuration and request types
export {
  DEFAULT_TIMEOUT_MS,
  HCLOUD_API_BASE_URL,
  HETZNER_API_BASE_URL,
  TOKEN_ENV_VAR,
  type ActionPollingOptions,
  type ApiResponse,
  type ApiTarget,
  type ClientHooks,
  type ClientOptions,
  type ErrorContext,
  type FetchLike,
  type HttpMethod,
  type Logger,
  type QueryParams,
  type QueryPrimitive,
  type QueryValue,
  type RateLimitInfo,
  type RequestConfig,
  type RequestContext,
  type RequestOptions,
  type ResponseContext,
  type ResponseValidationMode,
  type RetryContext,
  type RetryDecisionContext,
  type RetryOptions,
} from "./core/types";

// Errors
export {
  ErrorCode,
  HCloudAbortError,
  HCloudActionError,
  HCloudActionTimeoutError,
  HCloudApiError,
  HCloudConflictError,
  HCloudConnectionError,
  HCloudError,
  HCloudForbiddenError,
  HCloudInvalidInputError,
  HCloudNotFoundError,
  HCloudRateLimitError,
  HCloudServerError,
  HCloudTimeoutError,
  HCloudUnauthorizedError,
  HCloudValidationError,
  isHCloudError,
  type ApiErrorInit,
  type ApiErrorResponse,
  type ErrorDetails,
  type ErrorDetailsField,
  type HCloudErrorCode,
  type KnownErrorCode,
  type ValidationIssue,
} from "./core/errors";

// Resource base classes (for building custom resource clients)
export {
  ApiResource,
  ListableResource,
  NamedResource,
  path,
  type ListResponse,
} from "./core/resource";

// Pagination
export {
  MAX_PER_PAGE,
  getAllPages,
  paginate,
  type ItemOf,
  type ItemsKey,
  type PaginationIteratorOptions,
} from "./core/pagination";

// Validation
export { safeValidate, validate, type ValidateOptions } from "./core/validation";

// Utilities
export { labelSelector, type LabelCondition } from "./utils/label-selector";
export { parseTimeSeries, type MetricPoint, type RawTimeSeries } from "./utils/metrics";
export * from "./utils/type-guards";
export * from "./utils/actions";
export * from "./utils/helpers";

// Shared schemas and types
export * from "./apis/common/schemas";
export * from "./apis/common/types";

// API modules: clients, Zod schemas and types
export * from "./apis/actions/index";
export * from "./apis/actions/schemas";
export * from "./apis/actions/types";
export * from "./apis/certificates/index";
export * from "./apis/certificates/schemas";
export * from "./apis/certificates/types";
export * from "./apis/datacenters/index";
export * from "./apis/datacenters/schemas";
export * from "./apis/datacenters/types";
export * from "./apis/dns/index";
export * from "./apis/dns/schemas";
export * from "./apis/dns/types";
export * from "./apis/firewalls/index";
export * from "./apis/firewalls/schemas";
export * from "./apis/firewalls/types";
export * from "./apis/floating-ips/index";
export * from "./apis/floating-ips/schemas";
export * from "./apis/floating-ips/types";
export * from "./apis/images/index";
export * from "./apis/images/schemas";
export * from "./apis/images/types";
export * from "./apis/isos/index";
export * from "./apis/isos/schemas";
export * from "./apis/isos/types";
export * from "./apis/load-balancer-types/index";
export * from "./apis/load-balancer-types/schemas";
export * from "./apis/load-balancer-types/types";
export * from "./apis/load-balancers/index";
export * from "./apis/load-balancers/schemas";
export * from "./apis/load-balancers/types";
export * from "./apis/locations/index";
export * from "./apis/locations/schemas";
export * from "./apis/locations/types";
export * from "./apis/networks/index";
export * from "./apis/networks/schemas";
export * from "./apis/networks/types";
export * from "./apis/placement-groups/index";
export * from "./apis/placement-groups/schemas";
export * from "./apis/placement-groups/types";
export * from "./apis/pricing/index";
export * from "./apis/pricing/schemas";
export * from "./apis/pricing/types";
export * from "./apis/primary-ips/index";
export * from "./apis/primary-ips/schemas";
export * from "./apis/primary-ips/types";
export * from "./apis/server-types/index";
export * from "./apis/server-types/schemas";
export * from "./apis/server-types/types";
export * from "./apis/servers/index";
export * from "./apis/servers/schemas";
export * from "./apis/servers/types";
export * from "./apis/ssh-keys/index";
export * from "./apis/ssh-keys/schemas";
export * from "./apis/ssh-keys/types";
export * from "./apis/storage-box-types/index";
export * from "./apis/storage-box-types/schemas";
export * from "./apis/storage-box-types/types";
export * from "./apis/storage-boxes/index";
export * from "./apis/storage-boxes/schemas";
export * from "./apis/storage-boxes/types";
export * from "./apis/volumes/index";
export * from "./apis/volumes/schemas";
export * from "./apis/volumes/types";
