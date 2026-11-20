/**
 * Internal HTTP helpers: URL building, retries, timeouts and error mapping.
 */

import {
  ErrorCode,
  HCloudAbortError,
  HCloudApiError,
  HCloudConnectionError,
  HCloudError,
  HCloudTimeoutError,
  type ApiErrorResponse,
} from "./errors";
import type {
  HttpMethod,
  QueryParams,
  RateLimitInfo,
  RequestOptions,
  RetryDecisionContext,
  RetryOptions,
} from "./types";

/**
 * Retry options with all defaults applied.
 */
export type ResolvedRetryOptions = Required<Omit<RetryOptions, "shouldRetry">> &
  Pick<RetryOptions, "shouldRetry">;

export const DEFAULT_RETRY_OPTIONS: ResolvedRetryOptions = {
  maxRetries: 5,
  baseDelay: 1000,
  maxDelay: 60_000,
  factor: 2,
  jitter: true,
  retryableStatuses: [429, 502, 504],
  retryableCodes: [
    ErrorCode.RateLimitExceeded,
    ErrorCode.Conflict,
    ErrorCode.BadGateway,
    ErrorCode.Timeout,
  ],
};

const IDEMPOTENT_METHODS: ReadonlySet<HttpMethod> = new Set(["GET", "PUT", "DELETE"]);

/**
 * Merge retry settings. Later settings win.
 */
export function resolveRetryOptions(
  ...settings: Array<RequestOptions["retry"] | undefined>
): ResolvedRetryOptions {
  let resolved: ResolvedRetryOptions = { ...DEFAULT_RETRY_OPTIONS };
  for (const setting of settings) {
    if (setting === undefined) continue;
    if (setting === false) {
      resolved = { ...resolved, maxRetries: 0 };
    } else if (typeof setting === "number") {
      resolved = { ...resolved, maxRetries: Math.max(0, Math.floor(setting)) };
    } else {
      resolved = { ...resolved, ...removeUndefined(setting) };
    }
  }
  return resolved;
}

/**
 * Decide whether a failed attempt should be retried.
 */
export function shouldRetry(retry: ResolvedRetryOptions, context: RetryDecisionContext): boolean {
  if (context.attempt >= retry.maxRetries) return false;
  if (context.error instanceof HCloudAbortError) return false;

  const custom = retry.shouldRetry?.(context);
  if (custom !== undefined) return custom;

  const { error, method } = context;
  if (error instanceof HCloudApiError) {
    return (
      retry.retryableStatuses.includes(error.status) ||
      (error.code !== undefined && retry.retryableCodes.includes(error.code))
    );
  }
  if (error instanceof HCloudConnectionError) {
    return IDEMPOTENT_METHODS.has(method);
  }
  return false;
}

/**
 * Compute the delay before the next attempt in milliseconds.
 */
export function retryDelay(
  retry: ResolvedRetryOptions,
  attempt: number,
  retryAfterSeconds?: number,
  random: () => number = Math.random,
): number {
  if (retryAfterSeconds !== undefined && retryAfterSeconds >= 0) {
    return Math.min(retry.maxDelay, retryAfterSeconds * 1000);
  }
  const interval = Math.min(retry.maxDelay, retry.baseDelay * retry.factor ** attempt);
  if (!retry.jitter) return interval;
  const floor = Math.min(retry.baseDelay, interval);
  return Math.round(floor + random() * (interval - floor));
}

/**
 * Build a request URL from base URL, path and query parameters.
 */
export function buildUrl(baseUrl: string, path: string, query?: QueryParams | object): URL {
  const url = new URL(`${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`);
  if (query) {
    for (const [key, value] of Object.entries(query as QueryParams)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item !== undefined && item !== null) url.searchParams.append(key, String(item));
        }
      } else {
        url.searchParams.append(key, String(value));
      }
    }
  }
  return url;
}

/**
 * Recursively remove `undefined` values so they are not serialized.
 */
export function removeUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => removeUndefined(item)) as T;
  }
  if (value !== null && typeof value === "object" && isPlainObject(value)) {
    const cleaned: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      if (entry !== undefined) cleaned[key] = removeUndefined(entry);
    }
    return cleaned as T;
  }
  return value;
}

function isPlainObject(value: object): boolean {
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

/**
 * Parse the rate limit headers of a response.
 * @see https://docs.hetzner.cloud/reference/cloud#rate-limiting
 */
export function parseRateLimit(headers: Headers): RateLimitInfo | undefined {
  const limit = Number(headers.get("ratelimit-limit"));
  const remaining = Number(headers.get("ratelimit-remaining"));
  const reset = Number(headers.get("ratelimit-reset"));
  if (
    headers.get("ratelimit-limit") === null ||
    headers.get("ratelimit-remaining") === null ||
    !Number.isFinite(limit) ||
    !Number.isFinite(remaining)
  ) {
    return undefined;
  }
  return {
    limit,
    remaining,
    reset: new Date((Number.isFinite(reset) ? reset : 0) * 1000),
  };
}

/**
 * Parse a `Retry-After` header (seconds or HTTP date) into seconds.
 */
export function parseRetryAfter(headers: Headers, now: number = Date.now()): number | undefined {
  const value = headers.get("retry-after");
  if (value === null || value.trim() === "") return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds);
  const date = Date.parse(value);
  if (Number.isNaN(date)) return undefined;
  return Math.max(0, (date - now) / 1000);
}

/**
 * Read the correlation ID of a response.
 */
export function parseRequestId(headers: Headers): string | undefined {
  return headers.get("x-correlation-id") ?? undefined;
}

/**
 * Parse a response body as JSON. Empty bodies resolve to `undefined`.
 */
export async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) return undefined;
  const text = await response.text();
  if (text.trim() === "") return undefined;
  try {
    return JSON.parse(text);
  } catch (cause) {
    throw new HCloudError(
      `Invalid JSON in response (HTTP ${response.status})`,
      ErrorCode.InvalidResponse,
      response.status,
      undefined,
      { cause },
    );
  }
}

/**
 * Turn an error response into a {@link HCloudApiError}.
 */
export async function toApiError(
  response: Response,
  request: { method: string; url: string },
): Promise<HCloudApiError> {
  let message = `HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ""}`;
  let code: string = defaultCodeForStatus(response.status);
  let details: ApiErrorResponse["error"]["details"];

  try {
    const text = await response.text();
    if (text.trim() !== "") {
      const data = JSON.parse(text) as Partial<ApiErrorResponse>;
      if (data.error && typeof data.error === "object") {
        message = data.error.message || message;
        code = data.error.code || code;
        details = data.error.details;
      }
    }
  } catch {
    // Not a JSON error body, keep the generic message.
  }

  return HCloudApiError.from({
    message,
    code,
    status: response.status,
    details,
    method: request.method,
    url: request.url,
    requestId: parseRequestId(response.headers),
    headers: response.headers,
    rateLimit: parseRateLimit(response.headers),
    retryAfter: parseRetryAfter(response.headers),
  });
}

function defaultCodeForStatus(status: number): string {
  switch (status) {
    case 401:
      return ErrorCode.Unauthorized;
    case 403:
      return ErrorCode.Forbidden;
    case 404:
      return ErrorCode.NotFound;
    case 409:
      return ErrorCode.Conflict;
    case 422:
      return ErrorCode.InvalidInput;
    case 423:
      return ErrorCode.Locked;
    case 429:
      return ErrorCode.RateLimitExceeded;
    case 502:
      return ErrorCode.BadGateway;
    case 503:
      return ErrorCode.Unavailable;
    case 504:
      return ErrorCode.Timeout;
    default:
      return status >= 500 ? ErrorCode.ServerError : ErrorCode.Unknown;
  }
}

/**
 * A signal that aborts on timeout or when the caller's signal aborts.
 */
export interface RequestSignal {
  signal: AbortSignal;
  /** Whether the timeout elapsed. */
  timedOut: () => boolean;
  /** Release timers and listeners. Must always be called. */
  cleanup: () => void;
}

/**
 * Combine a timeout with an optional caller-provided signal.
 */
export function createRequestSignal(timeoutMs: number, external?: AbortSignal): RequestSignal {
  const controller = new AbortController();
  let didTimeOut = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const onExternalAbort = () => controller.abort(external?.reason);

  if (external?.aborted) {
    controller.abort(external.reason);
  } else {
    external?.addEventListener("abort", onExternalAbort, { once: true });
    if (timeoutMs > 0 && Number.isFinite(timeoutMs)) {
      timer = setTimeout(() => {
        didTimeOut = true;
        controller.abort(new Error(`Request timeout after ${timeoutMs}ms`));
      }, timeoutMs);
    }
  }

  return {
    signal: controller.signal,
    timedOut: () => didTimeOut,
    cleanup: () => {
      if (timer !== undefined) clearTimeout(timer);
      external?.removeEventListener("abort", onExternalAbort);
    },
  };
}

/**
 * Convert an error thrown by `fetch` into an SDK error.
 */
export function toRequestError(
  error: unknown,
  state: { timedOut: boolean; aborted: boolean; timeoutMs: number },
): HCloudError {
  if (error instanceof HCloudError) return error;
  if (state.timedOut) return new HCloudTimeoutError(state.timeoutMs, { cause: error });
  if (state.aborted) return new HCloudAbortError({ cause: error });
  const message = error instanceof Error ? error.message : String(error);
  return new HCloudConnectionError(`Request failed: ${message}`, { cause: error });
}

/**
 * Sleep for the given time. Rejects with {@link HCloudAbortError} if the signal aborts.
 */
export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new HCloudAbortError({ cause: signal.reason }));
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      reject(new HCloudAbortError({ cause: signal?.reason }));
    };
    const timer = setTimeout(
      () => {
        signal?.removeEventListener("abort", onAbort);
        resolve();
      },
      Math.max(0, ms),
    );
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
