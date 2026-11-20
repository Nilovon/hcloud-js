/**
 * Error classes for the Hetzner Cloud SDK.
 *
 * Every error thrown by the SDK extends {@link HCloudError}, so a single
 * `instanceof HCloudError` check (or {@link isHCloudError}) is enough to catch
 * everything. More specific subclasses let you branch on the failure reason
 * without comparing strings.
 *
 * @see https://docs.hetzner.cloud/reference/cloud#errors
 */

import type { Action } from "../apis/actions/types";
import type { RateLimitInfo } from "./types";

/**
 * Error codes used by the SDK.
 *
 * Lowercase codes are returned by the Hetzner API, uppercase codes are raised
 * client-side by the SDK itself.
 */
export const ErrorCode = {
  // --- Returned by the API -------------------------------------------------
  Forbidden: "forbidden",
  Unauthorized: "unauthorized",
  InvalidInput: "invalid_input",
  JsonError: "json_error",
  Locked: "locked",
  NotFound: "not_found",
  RateLimitExceeded: "rate_limit_exceeded",
  ResourceLimitExceeded: "resource_limit_exceeded",
  ResourceUnavailable: "resource_unavailable",
  ServerError: "server_error",
  ServiceError: "service_error",
  UniquenessError: "uniqueness_error",
  Protected: "protected",
  Maintenance: "maintenance",
  Conflict: "conflict",
  UnsupportedError: "unsupported_error",
  TokenReadonly: "token_readonly",
  Unavailable: "unavailable",
  DeprecatedApiEndpoint: "deprecated_api_endpoint",
  Timeout: "timeout",
  BadGateway: "bad_gateway",
  ActionFailed: "action_failed",
  PlacementError: "placement_error",
  PrimaryIPCreationError: "primary_ip_creation_error",
  ServerNotStopped: "server_not_stopped",
  ServerAlreadyAttached: "server_already_attached",
  NetworksOverlap: "networks_overlap",
  IPNotAvailable: "ip_not_available",
  NoSubnetAvailable: "no_subnet_available",
  ResourceInUse: "resource_in_use",
  FirewallAlreadyApplied: "firewall_already_applied",
  FirewallAlreadyRemoved: "firewall_already_removed",
  FirewallResourceNotFound: "firewall_resource_not_found",
  IncompatibleNetworkType: "incompatible_network_type",
  NoSpaceLeftInLocation: "no_space_left_in_location",
  InvalidServerType: "invalid_server_type",

  // --- Raised by the SDK ---------------------------------------------------
  /** No API token was provided. */
  InvalidToken: "INVALID_TOKEN",
  /** The request did not complete within the configured timeout. */
  RequestTimeout: "TIMEOUT",
  /** The request could not be sent or the connection was interrupted. */
  NetworkError: "NETWORK_ERROR",
  /** The request was aborted through an `AbortSignal`. */
  Aborted: "ABORTED",
  /** Request or response data did not match the expected schema. */
  ValidationError: "VALIDATION_ERROR",
  /** The API answered with a body that is not valid JSON. */
  InvalidResponse: "INVALID_RESPONSE",
  /** An action did not finish within the configured timeout. */
  ActionTimeout: "ACTION_TIMEOUT",
  /** A resource did not reach the expected state in time. */
  WaitTimeout: "WAIT_TIMEOUT",
  /** Anything else. */
  Unknown: "UNKNOWN_ERROR",
} as const;

/**
 * A known error code.
 */
export type KnownErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Any error code. Known codes are offered by autocomplete, but the API may
 * introduce new codes at any time, so arbitrary strings are accepted as well.
 */
export type HCloudErrorCode = KnownErrorCode | (string & {});

/**
 * A single invalid field as reported by the API for `invalid_input` errors.
 */
export interface ErrorDetailsField {
  name: string;
  messages: string[];
}

/**
 * Additional error details.
 */
export interface ErrorDetails {
  fields?: ErrorDetailsField[];
  [key: string]: unknown;
}

/**
 * Error response structure of the Hetzner Cloud API.
 * @see https://docs.hetzner.cloud/reference/cloud#errors
 */
export interface ApiErrorResponse {
  error: {
    message: string;
    code: string;
    details?: ErrorDetails | null;
  };
}

/**
 * Base class of every error thrown by the SDK.
 */
export class HCloudError extends Error {
  /** Machine readable error code. */
  public readonly code?: HCloudErrorCode;
  /** HTTP status code, `0` if the error did not originate from an HTTP response. */
  public readonly statusCode?: number;
  /** Additional details, e.g. invalid fields. */
  public readonly details?: ErrorDetails;

  constructor(
    message: string,
    code?: HCloudErrorCode,
    statusCode?: number,
    details?: ErrorDetails | null,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = new.target.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details ?? undefined;
  }

  /**
   * Check if the error carries field validation errors.
   */
  hasFieldErrors(): boolean {
    return Boolean(this.details?.fields && this.details.fields.length > 0);
  }

  /**
   * Get field validation errors, if any.
   */
  getFieldErrors(): ErrorDetailsField[] {
    return this.details?.fields ?? [];
  }

  /**
   * Check the error code in a type-safe way.
   *
   * @example
   * ```typescript
   * if (error.is("not_found")) { ... }
   * ```
   */
  is(code: HCloudErrorCode): boolean {
    return this.code === code;
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

/**
 * Details used to construct a {@link HCloudApiError}.
 */
export interface ApiErrorInit {
  message: string;
  code: HCloudErrorCode;
  status: number;
  details?: ErrorDetails | null;
  method: string;
  url: string;
  requestId?: string;
  headers?: Headers;
  rateLimit?: RateLimitInfo;
  retryAfter?: number;
}

/**
 * The API answered with an error (HTTP status >= 400).
 */
export class HCloudApiError extends HCloudError {
  /** HTTP status code of the response. */
  public readonly status: number;
  /** HTTP method of the failed request. */
  public readonly method: string;
  /** URL of the failed request. */
  public readonly url: string;
  /**
   * Correlation ID of the request (`X-Correlation-Id` header). Include it when
   * contacting the Hetzner support.
   */
  public readonly requestId?: string;
  /** Response headers. */
  public readonly headers?: Headers;

  constructor(init: ApiErrorInit) {
    super(init.message, init.code, init.status, init.details);
    this.status = init.status;
    this.method = init.method;
    this.url = init.url;
    this.requestId = init.requestId;
    this.headers = init.headers;
  }

  /**
   * Create the most specific error class for a response.
   */
  static from(init: ApiErrorInit): HCloudApiError {
    if (init.status === 429 || init.code === ErrorCode.RateLimitExceeded) {
      return new HCloudRateLimitError(init);
    }
    if (init.status === 404 || init.code === ErrorCode.NotFound) {
      return new HCloudNotFoundError(init);
    }
    if (init.status === 401 || init.code === ErrorCode.Unauthorized) {
      return new HCloudUnauthorizedError(init);
    }
    if (init.status === 403) {
      return new HCloudForbiddenError(init);
    }
    if (init.status === 409 || init.code === ErrorCode.Conflict) {
      return new HCloudConflictError(init);
    }
    if (init.code === ErrorCode.InvalidInput || init.status === 422) {
      return new HCloudInvalidInputError(init);
    }
    if (init.status >= 500) {
      return new HCloudServerError(init);
    }
    return new HCloudApiError(init);
  }

  override toJSON(): Record<string, unknown> {
    return { ...super.toJSON(), method: this.method, url: this.url, requestId: this.requestId };
  }
}

/**
 * The rate limit was exceeded (HTTP 429).
 * @see https://docs.hetzner.cloud/reference/cloud#rate-limiting
 */
export class HCloudRateLimitError extends HCloudApiError {
  /** Seconds to wait before retrying, if the API sent a `Retry-After` header. */
  public readonly retryAfter?: number;
  /** Rate limit state reported with the response. */
  public readonly rateLimit?: RateLimitInfo;

  constructor(init: ApiErrorInit) {
    super(init);
    this.retryAfter = init.retryAfter;
    this.rateLimit = init.rateLimit;
  }
}

/** The requested resource does not exist (HTTP 404). */
export class HCloudNotFoundError extends HCloudApiError {}

/** The API token is missing or invalid (HTTP 401). */
export class HCloudUnauthorizedError extends HCloudApiError {}

/** The API token lacks permissions for the request (HTTP 403). */
export class HCloudForbiddenError extends HCloudApiError {}

/** The resource changed during the request (HTTP 409). */
export class HCloudConflictError extends HCloudApiError {}

/** The API rejected the request parameters (HTTP 422, `invalid_input`). */
export class HCloudInvalidInputError extends HCloudApiError {}

/** The API failed to process the request (HTTP 5xx). */
export class HCloudServerError extends HCloudApiError {}

/**
 * The request could not be sent or the connection was interrupted.
 */
export class HCloudConnectionError extends HCloudError {
  constructor(message: string, options?: { cause?: unknown; code?: HCloudErrorCode }) {
    super(message, options?.code ?? ErrorCode.NetworkError, 0, undefined, {
      cause: options?.cause,
    });
  }
}

/**
 * The request did not complete within the configured timeout.
 */
export class HCloudTimeoutError extends HCloudConnectionError {
  /** The timeout in milliseconds that was exceeded. */
  public readonly timeout: number;

  constructor(timeout: number, options?: { cause?: unknown }) {
    super(`Request timeout after ${timeout}ms`, {
      cause: options?.cause,
      code: ErrorCode.RequestTimeout,
    });
    this.timeout = timeout;
  }
}

/**
 * The request was aborted through the `AbortSignal` passed by the caller.
 */
export class HCloudAbortError extends HCloudError {
  constructor(options?: { cause?: unknown }) {
    super("Request was aborted", ErrorCode.Aborted, 0, undefined, options);
  }
}

/**
 * A single schema violation.
 */
export interface ValidationIssue {
  /** Path to the invalid value, e.g. `["server", "name"]`. */
  path: PropertyKey[];
  /** Human readable message. */
  message: string;
  /** Zod issue code. */
  code?: string;
}

/**
 * Request parameters or a response did not match the expected schema.
 */
export class HCloudValidationError extends HCloudError {
  /** Whether the request parameters or the API response were invalid. */
  public readonly target: "request" | "response";
  /** All schema violations. */
  public readonly issues: ValidationIssue[];

  constructor(
    message: string,
    init: { target: "request" | "response"; issues: ValidationIssue[]; cause?: unknown },
  ) {
    super(message, ErrorCode.ValidationError, 0, { errors: init.issues }, { cause: init.cause });
    this.target = init.target;
    this.issues = init.issues;
  }
}

/**
 * An action finished with status `error`.
 */
export class HCloudActionError extends HCloudError {
  /** The failed action. */
  public readonly action: Action;

  constructor(action: Action) {
    super(
      action.error?.message || `Action ${action.id} (${action.command}) failed`,
      action.error?.code || ErrorCode.ActionFailed,
      0,
    );
    this.action = action;
  }
}

/**
 * An action did not finish within the configured timeout.
 */
export class HCloudActionTimeoutError extends HCloudError {
  /** IDs of the actions that were still running. */
  public readonly actionIds: number[];
  /** The timeout in milliseconds that was exceeded. */
  public readonly timeout: number;

  constructor(actionIds: number[], timeout: number) {
    super(
      actionIds.length === 1
        ? `Action ${actionIds[0]} did not complete within ${timeout}ms`
        : `Actions ${actionIds.join(", ")} did not complete within ${timeout}ms`,
      ErrorCode.ActionTimeout,
      0,
    );
    this.actionIds = actionIds;
    this.timeout = timeout;
  }
}

/**
 * Type guard for errors thrown by the SDK.
 *
 * @example
 * ```typescript
 * try {
 *   await client.servers.get(1);
 * } catch (error) {
 *   if (isHCloudError(error, "not_found")) {
 *     // ...
 *   }
 * }
 * ```
 */
export function isHCloudError(error: unknown, code?: HCloudErrorCode): error is HCloudError {
  return error instanceof HCloudError && (code === undefined || error.code === code);
}
