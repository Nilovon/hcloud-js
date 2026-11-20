/**
 * Shared option and request types of the SDK.
 */

import type { HCloudError } from "./errors";

/**
 * Default base URL of the Hetzner Cloud API.
 * @see https://docs.hetzner.cloud/reference/cloud
 */
export const HCLOUD_API_BASE_URL = "https://api.hetzner.cloud/v1";

/**
 * Default base URL of the Hetzner API (used for Storage Boxes).
 * @see https://docs.hetzner.cloud/reference/hetzner
 */
export const HETZNER_API_BASE_URL = "https://api.hetzner.com/v1";

/**
 * Default request timeout in milliseconds.
 */
export const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * Name of the environment variable the token is read from if none is passed.
 */
export const TOKEN_ENV_VAR = "HCLOUD_TOKEN";

/**
 * HTTP methods used by the API.
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Which API a request is sent to.
 *
 * - `cloud`: Hetzner Cloud API (`api.hetzner.cloud`)
 * - `hetzner`: Hetzner API (`api.hetzner.com`), e.g. Storage Boxes
 */
export type ApiTarget = "cloud" | "hetzner";

/**
 * A single query string value.
 */
export type QueryPrimitive = string | number | boolean;

/**
 * Query string value. Arrays are serialized as repeated keys
 * (`?status=running&status=off`), `undefined` and `null` are skipped.
 */
export type QueryValue = QueryPrimitive | readonly QueryPrimitive[] | null | undefined;

/**
 * Query string parameters.
 */
export type QueryParams = Record<string, QueryValue>;

/**
 * Rate limit state as reported by the API.
 * @see https://docs.hetzner.cloud/reference/cloud#rate-limiting
 */
export interface RateLimitInfo {
  /** Total number of requests allowed per hour. */
  limit: number;
  /** Requests left in the current window. */
  remaining: number;
  /** Point in time at which the limit is fully replenished. */
  reset: Date;
}

/**
 * Context passed to {@link RetryOptions.shouldRetry}.
 */
export interface RetryDecisionContext {
  /** The error of the failed attempt. */
  error: HCloudError;
  /** HTTP method of the request. */
  method: HttpMethod;
  /** Request path, e.g. `/servers/42`. */
  path: string;
  /** Number of the failed attempt, starting at `0`. */
  attempt: number;
}

/**
 * Retry behaviour for failed requests.
 *
 * By default a request is retried up to 5 times with exponential backoff and
 * jitter when
 *
 * - the API answers with HTTP `429`, `502` or `504`,
 * - the API answers with the error code `rate_limit_exceeded`, `conflict`,
 *   `bad_gateway` or `timeout`,
 * - an idempotent request (`GET`, `PUT`, `DELETE`) fails with a network error
 *   or times out.
 */
export interface RetryOptions {
  /** Maximum number of retries. Default: `5`. */
  maxRetries?: number;
  /** Delay before the first retry in milliseconds. Default: `1000`. */
  baseDelay?: number;
  /** Upper bound for the delay between retries in milliseconds. Default: `60000`. */
  maxDelay?: number;
  /** Multiplier applied to the delay after every retry. Default: `2`. */
  factor?: number;
  /** Randomize delays to avoid thundering herds. Default: `true`. */
  jitter?: boolean;
  /** HTTP status codes that are retried. Default: `[429, 502, 504]`. */
  retryableStatuses?: readonly number[];
  /** API error codes that are retried. Default: `["rate_limit_exceeded", "conflict", "bad_gateway", "timeout"]`. */
  retryableCodes?: readonly string[];
  /**
   * Custom retry decision. Return `true`/`false` to force a decision or
   * `undefined` to fall back to the default policy.
   */
  shouldRetry?: (context: RetryDecisionContext) => boolean | undefined;
}

/**
 * Options that can be passed to every API call.
 */
export interface RequestOptions {
  /** Abort the request (and pending retries) with an `AbortSignal`. */
  signal?: AbortSignal;
  /** Request timeout in milliseconds. Overrides the client default. */
  timeout?: number;
  /** Additional headers for this request. */
  headers?: Record<string, string>;
  /**
   * Retry behaviour for this request. Pass `false` (or `0`) to disable retries,
   * a number to change the maximum number of retries, or an options object.
   */
  retry?: RetryOptions | number | false;
}

/**
 * Low-level request description, used by {@link HCloudClient.request}.
 */
export interface RequestConfig extends RequestOptions {
  /** HTTP method. Default: `GET`. */
  method?: HttpMethod;
  /** Path relative to the API base URL, e.g. `/servers`. */
  path: string;
  /** Query string parameters. */
  query?: QueryParams | object;
  /** JSON request body. `undefined` values are stripped. */
  body?: unknown;
  /** API to send the request to. Default: `cloud`. */
  api?: ApiTarget;
}

/**
 * A response including its metadata, returned by {@link HCloudClient.requestWithResponse}.
 */
export interface ApiResponse<T> {
  /** Parsed JSON body (`undefined` for empty responses). */
  data: T;
  /** The raw `Response`. Its body has already been consumed. */
  response: Response;
  /** HTTP status code. */
  status: number;
  /** Response headers. */
  headers: Headers;
  /** Correlation ID of the request (`X-Correlation-Id` header). */
  requestId?: string;
  /** Rate limit state reported with this response. */
  rateLimit?: RateLimitInfo;
}

/**
 * Describes an outgoing request. Passed to hooks.
 */
export interface RequestContext {
  method: HttpMethod;
  /** Full request URL including query string. */
  url: URL;
  /** Path relative to the API base URL. */
  path: string;
  /** Request headers. Hooks may add or change headers. */
  headers: Headers;
  /** Request body before JSON serialization. */
  body: unknown;
  /** Attempt number, starting at `0`. Greater than `0` for retries. */
  attempt: number;
  /** API the request is sent to. */
  api: ApiTarget;
}

/**
 * Passed to {@link ClientHooks.onResponse}.
 */
export interface ResponseContext {
  request: RequestContext;
  response: Response;
  /** Parsed response body. */
  data: unknown;
  /** Duration of the attempt in milliseconds. */
  durationMs: number;
}

/**
 * Passed to {@link ClientHooks.onRetry}.
 */
export interface RetryContext {
  request: RequestContext;
  error: HCloudError;
  /** Milliseconds until the next attempt is started. */
  delayMs: number;
  /** Number of the upcoming attempt, starting at `1`. */
  nextAttempt: number;
}

/**
 * Passed to {@link ClientHooks.onError}.
 */
export interface ErrorContext {
  request: RequestContext;
  error: HCloudError;
}

/**
 * Lifecycle hooks, useful for logging, metrics and tracing.
 */
export interface ClientHooks {
  /** Called before every attempt. May mutate `context.headers`. */
  onRequest?: (context: RequestContext) => void | Promise<void>;
  /** Called after every successful response. */
  onResponse?: (context: ResponseContext) => void | Promise<void>;
  /** Called before a failed request is retried. */
  onRetry?: (context: RetryContext) => void | Promise<void>;
  /** Called when a request finally failed. */
  onError?: (context: ErrorContext) => void | Promise<void>;
}

/**
 * Minimal `fetch` signature used by the SDK. The global `fetch` of Node.js,
 * Bun, Deno, browsers and edge runtimes satisfies it.
 */
export type FetchLike = (
  input: string,
  init: {
    method: string;
    headers: Headers;
    body: string | undefined;
    signal: AbortSignal;
  },
) => Promise<Response>;

/**
 * Debug logger.
 */
export type Logger = (message: string, data?: Record<string, unknown>) => void;

/**
 * How responses that do not match the SDK schemas are handled.
 *
 * - `warn`: log a warning and return the response unchanged (default)
 * - `throw`: throw a `HCloudValidationError`
 * - `off`: skip response validation entirely
 */
export type ResponseValidationMode = "warn" | "throw" | "off";

/**
 * Defaults for waiting on actions.
 */
export interface ActionPollingOptions {
  /**
   * Delay between polls in milliseconds, or a function computing the delay for
   * the n-th poll. Default: exponential backoff from 500ms up to 5s.
   */
  pollInterval?: number | ((attempt: number) => number);
  /** Maximum time to wait in milliseconds. Default: `300000` (5 minutes). */
  timeout?: number;
}

/**
 * Client configuration options.
 */
export interface ClientOptions {
  /**
   * Hetzner Cloud API token, or a function returning one (useful for rotating
   * tokens). Falls back to the `HCLOUD_TOKEN` environment variable.
   *
   * Create a token in the Hetzner Console: https://console.hetzner.cloud/
   * @see https://docs.hetzner.cloud/reference/cloud#authentication
   */
  token?: string | (() => string | Promise<string>);
  /** Base URL of the Hetzner Cloud API. Default: `https://api.hetzner.cloud/v1`. */
  baseUrl?: string;
  /** Base URL of the Hetzner API (Storage Boxes). Default: `https://api.hetzner.com/v1`. */
  hetznerBaseUrl?: string;
  /** Request timeout in milliseconds. Default: `30000`. */
  timeout?: number;
  /**
   * Retry behaviour. Pass `false` (or `0`) to disable retries, a number to
   * change the maximum number of retries, or an options object.
   */
  retry?: RetryOptions | number | false;
  /** Custom `fetch` implementation, e.g. for proxies, testing or instrumentation. */
  fetch?: FetchLike;
  /** Headers sent with every request. */
  headers?: Record<string, string>;
  /**
   * Name (and version) of your application, prepended to the `User-Agent`
   * header, e.g. `my-app/1.2.3`.
   */
  userAgent?: string;
  /** Validate request parameters before sending them. Default: `true`. */
  requestValidation?: boolean;
  /** How to handle responses that do not match the SDK schemas. Default: `warn`. */
  responseValidation?: ResponseValidationMode;
  /** Defaults for waiting on actions. */
  actions?: ActionPollingOptions;
  /** Lifecycle hooks. */
  hooks?: ClientHooks;
  /**
   * Log requests, responses and retries. Pass `true` to log with
   * `console.debug` or provide your own logger. The token is never logged.
   */
  debug?: boolean | Logger;
  /** Receives SDK warnings (e.g. schema mismatches). Default: `console.warn`. */
  onWarning?: (message: string, data?: Record<string, unknown>) => void;
}
