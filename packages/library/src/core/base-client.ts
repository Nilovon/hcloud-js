/**
 * Base client: authentication, retries, timeouts, rate limits and error handling.
 */

import { ErrorCode, HCloudError } from "./errors";
import {
  buildUrl,
  createRequestSignal,
  parseBody,
  parseRateLimit,
  parseRequestId,
  parseRetryAfter,
  removeUndefined,
  resolveRetryOptions,
  retryDelay,
  shouldRetry,
  sleep,
  toApiError,
  toRequestError,
  type ResolvedRetryOptions,
} from "./http";
import {
  DEFAULT_TIMEOUT_MS,
  HCLOUD_API_BASE_URL,
  HETZNER_API_BASE_URL,
  TOKEN_ENV_VAR,
  type ApiResponse,
  type ApiTarget,
  type ClientHooks,
  type ClientOptions,
  type FetchLike,
  type HttpMethod,
  type Logger,
  type RateLimitInfo,
  type RequestConfig,
  type RequestContext,
  type RequestOptions,
  type ResponseValidationMode,
} from "./types";
import { VERSION } from "../version";

/**
 * Default delay between action polls: exponential backoff from 500ms up to 5s.
 */
export function defaultPollInterval(attempt: number): number {
  return Math.min(5000, Math.round(500 * 1.5 ** attempt));
}

/**
 * Default maximum time to wait for an action in milliseconds.
 */
export const DEFAULT_ACTION_TIMEOUT_MS = 300_000;

/**
 * Client configuration with all defaults applied.
 */
export interface ResolvedClientConfig {
  readonly baseUrl: string;
  readonly hetznerBaseUrl: string;
  readonly timeout: number;
  readonly retry: ResolvedRetryOptions;
  readonly userAgent: string;
  readonly requestValidation: boolean;
  readonly responseValidation: ResponseValidationMode;
  readonly actions: {
    readonly pollInterval: number | ((attempt: number) => number);
    readonly timeout: number;
  };
  readonly onWarning: (message: string, data?: Record<string, unknown>) => void;
}

/**
 * Options accepted by the low-level request helpers ({@link HCloudClient.get} etc.).
 */
export interface LowLevelRequestOptions extends RequestOptions {
  /** Query string parameters. */
  query?: RequestConfig["query"];
  /** API to send the request to. Default: `cloud`. */
  api?: ApiTarget;
}

/**
 * Low-level API client without resource sub-clients.
 *
 * Use {@link HCloudClient} unless bundle size matters: resource clients can be
 * constructed individually on top of a `BaseClient`, so bundlers can drop the
 * resources you do not use.
 *
 * @example
 * ```typescript
 * import { BaseClient, ServersClient } from "@nilovonjs/hcloud-js";
 *
 * const base = new BaseClient({ token: "your-api-token" });
 * const servers = new ServersClient(base);
 * ```
 */
export class BaseClient {
  /**
   * Resolved client configuration.
   */
  public readonly config: ResolvedClientConfig;

  /**
   * Rate limit state reported by the most recent response, if any.
   * @see https://docs.hetzner.cloud/reference/cloud#rate-limiting
   */
  public rateLimit: RateLimitInfo | undefined;

  readonly #token: string | (() => string | Promise<string>);
  readonly #fetch: FetchLike;
  readonly #headers: Record<string, string>;
  readonly #hooks: ClientHooks;
  readonly #log: Logger | undefined;

  /**
   * @param options - Client options, or just the API token
   * @throws {HCloudError} If no token is provided and `HCLOUD_TOKEN` is not set
   */
  constructor(options: ClientOptions | string = {}) {
    const opts: ClientOptions = typeof options === "string" ? { token: options } : options;

    const token = opts.token ?? readEnv(TOKEN_ENV_VAR);
    if (token === undefined || (typeof token === "string" && token.trim().length === 0)) {
      throw new HCloudError(
        `API token is required. Pass the \`token\` option or set the ${TOKEN_ENV_VAR} environment variable.`,
        ErrorCode.InvalidToken,
      );
    }
    this.#token = token;

    if (typeof (opts.fetch ?? globalThis.fetch) !== "function") {
      throw new HCloudError(
        "No fetch implementation available. Pass one with the `fetch` option.",
        ErrorCode.Unknown,
      );
    }
    this.#fetch = opts.fetch ?? ((input, init) => globalThis.fetch(input, init));
    this.#headers = { ...opts.headers };
    this.#hooks = opts.hooks ?? {};
    this.#log =
      opts.debug === true
        ? (message, data) =>
            data ? console.debug(`[hcloud] ${message}`, data) : console.debug(`[hcloud] ${message}`)
        : opts.debug || undefined;

    this.config = Object.freeze({
      baseUrl: opts.baseUrl ?? HCLOUD_API_BASE_URL,
      hetznerBaseUrl: opts.hetznerBaseUrl ?? HETZNER_API_BASE_URL,
      timeout: opts.timeout ?? DEFAULT_TIMEOUT_MS,
      retry: resolveRetryOptions(opts.retry),
      userAgent: [opts.userAgent, `hcloud-js/${VERSION}`].filter(Boolean).join(" "),
      requestValidation: opts.requestValidation ?? true,
      responseValidation: opts.responseValidation ?? "warn",
      actions: Object.freeze({
        pollInterval: opts.actions?.pollInterval ?? defaultPollInterval,
        timeout: opts.actions?.timeout ?? DEFAULT_ACTION_TIMEOUT_MS,
      }),
      onWarning:
        opts.onWarning ??
        ((message: string) => {
          console.warn(`[hcloud] ${message}`);
        }),
    });
  }

  /**
   * Send a request and return the parsed response body.
   *
   * This is the escape hatch for endpoints that are not (yet) covered by the
   * SDK. Authentication, retries, timeouts and error handling are applied as
   * for every other call.
   *
   * @throws {HCloudApiError} If the API answers with an error
   * @throws {HCloudTimeoutError} If the request timed out
   * @throws {HCloudConnectionError} If the request could not be sent
   *
   * @example
   * ```typescript
   * const data = await client.request<{ servers: unknown[] }>({
   *   method: "GET",
   *   path: "/servers",
   *   query: { per_page: 10 },
   * });
   * ```
   */
  async request<T = unknown>(config: RequestConfig): Promise<T> {
    const { data } = await this.requestWithResponse<T>(config);
    return data;
  }

  /**
   * Send a request and return the parsed body together with response metadata
   * (status, headers, correlation ID and rate limit state).
   */
  async requestWithResponse<T = unknown>(config: RequestConfig): Promise<ApiResponse<T>> {
    const method: HttpMethod = config.method ?? "GET";
    const api: ApiTarget = config.api ?? "cloud";
    const baseUrl = api === "hetzner" ? this.config.hetznerBaseUrl : this.config.baseUrl;
    const url = buildUrl(baseUrl, config.path, config.query);
    const timeout = config.timeout ?? this.config.timeout;
    const retry =
      config.retry === undefined
        ? this.config.retry
        : resolveRetryOptions(this.config.retry, config.retry);

    const hasBody = config.body !== undefined && method !== "GET";
    const body = hasBody ? removeUndefined(config.body) : undefined;
    const serializedBody = hasBody ? JSON.stringify(body) : undefined;

    for (let attempt = 0; ; attempt++) {
      const headers = new Headers({
        Accept: "application/json",
        "User-Agent": this.config.userAgent,
        ...this.#headers,
        ...config.headers,
      });
      if (hasBody) headers.set("Content-Type", "application/json");
      headers.set("Authorization", `Bearer ${await this.#resolveToken()}`);

      const request: RequestContext = { method, url, path: config.path, headers, body, attempt, api };
      await this.#hooks.onRequest?.(request);
      this.#log?.(`→ ${method} ${url.pathname}${url.search}`, attempt > 0 ? { attempt } : undefined);

      const startedAt = Date.now();
      const requestSignal = createRequestSignal(timeout, config.signal);
      let result: ApiResponse<T> | undefined;
      let error: HCloudError | undefined;
      let retryAfter: number | undefined;

      try {
        const response = await this.#fetch(url.toString(), {
          method,
          headers,
          body: serializedBody,
          signal: requestSignal.signal,
        });

        const rateLimit = parseRateLimit(response.headers);
        if (rateLimit) this.rateLimit = rateLimit;

        if (response.ok) {
          result = {
            data: (await parseBody(response)) as T,
            response,
            status: response.status,
            headers: response.headers,
            requestId: parseRequestId(response.headers),
            rateLimit,
          };
        } else {
          error = await toApiError(response, { method, url: url.toString() });
          retryAfter = parseRetryAfter(response.headers);
        }
      } catch (cause) {
        error = toRequestError(cause, {
          timedOut: requestSignal.timedOut(),
          aborted: config.signal?.aborted ?? false,
          timeoutMs: timeout,
        });
      } finally {
        requestSignal.cleanup();
      }

      if (result) {
        const durationMs = Date.now() - startedAt;
        this.#log?.(`← ${result.status} ${method} ${url.pathname} (${durationMs}ms)`);
        await this.#hooks.onResponse?.({
          request,
          response: result.response,
          data: result.data,
          durationMs,
        });
        return result;
      }

      error ??= new HCloudError("Unknown error occurred", ErrorCode.Unknown, 0);

      this.#log?.(`✗ ${method} ${url.pathname}: ${error.message}`, {
        code: error.code,
        status: error.statusCode,
      });

      if (shouldRetry(retry, { error, method, path: config.path, attempt })) {
        const delayMs = retryDelay(retry, attempt, retryAfter);
        this.#log?.(`↻ retrying ${method} ${url.pathname} in ${delayMs}ms`, {
          attempt: attempt + 1,
          maxRetries: retry.maxRetries,
        });
        await this.#hooks.onRetry?.({ request, error, delayMs, nextAttempt: attempt + 1 });
        await sleep(delayMs, config.signal);
        continue;
      }

      await this.#hooks.onError?.({ request, error });
      throw error;
    }
  }

  /**
   * Send a `GET` request.
   *
   * @example
   * ```typescript
   * const data = await client.get<{ servers: unknown[] }>("/servers", { query: { name: "web" } });
   * ```
   */
  get<T = unknown>(path: string, options?: LowLevelRequestOptions): Promise<T> {
    return this.request<T>({ ...options, method: "GET", path });
  }

  /**
   * Send a `POST` request with an optional JSON body.
   */
  post<T = unknown>(path: string, body?: unknown, options?: LowLevelRequestOptions): Promise<T> {
    return this.request<T>({ ...options, method: "POST", path, body });
  }

  /**
   * Send a `PUT` request with an optional JSON body.
   */
  put<T = unknown>(path: string, body?: unknown, options?: LowLevelRequestOptions): Promise<T> {
    return this.request<T>({ ...options, method: "PUT", path, body });
  }

  /**
   * Send a `PATCH` request with an optional JSON body.
   */
  patch<T = unknown>(path: string, body?: unknown, options?: LowLevelRequestOptions): Promise<T> {
    return this.request<T>({ ...options, method: "PATCH", path, body });
  }

  /**
   * Send a `DELETE` request.
   */
  delete<T = unknown>(path: string, options?: LowLevelRequestOptions): Promise<T> {
    return this.request<T>({ ...options, method: "DELETE", path });
  }

  async #resolveToken(): Promise<string> {
    const token = typeof this.#token === "function" ? await this.#token() : this.#token;
    if (typeof token !== "string" || token.trim().length === 0) {
      throw new HCloudError("The token provider returned an empty token", ErrorCode.InvalidToken);
    }
    return token;
  }
}

function readEnv(name: string): string | undefined {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  return env?.[name];
}
