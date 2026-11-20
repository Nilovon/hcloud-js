/**
 * Base classes for API resource clients.
 */

import type { z } from "zod";
import type { BaseClient } from "./base-client";
import { iteratePages, type PageParams, type PaginatedResponse } from "./pagination";
import type { ApiTarget, HttpMethod, RequestOptions } from "./types";
import { createValidationError } from "./validation";

/**
 * Build a URL path with every interpolated value URI-encoded.
 *
 * @example
 * ```typescript
 * path`/zones/${"example.com"}/rrsets/${"@"}/${"A"}` // "/zones/example.com/rrsets/%40/A"
 * ```
 */
export function path(strings: TemplateStringsArray, ...values: Array<string | number>): string {
  let result = strings[0] ?? "";
  for (let i = 0; i < values.length; i++) {
    result += encodeURIComponent(String(values[i])) + (strings[i + 1] ?? "");
  }
  return result;
}

/**
 * Description of a single API call.
 *
 * @internal
 */
export interface CallSpec<S extends z.ZodType | null> {
  /** Query string parameters. */
  query?: object;
  /** Request body. */
  body?: unknown;
  /** Schema the request body is validated against. */
  bodySchema?: z.ZodType;
  /** Schema of the response body, or `null` if the response is empty. */
  response: S;
}

/**
 * Result type of a call described by a response schema.
 *
 * @internal
 */
export type CallResult<S extends z.ZodType | null> = S extends z.ZodType ? z.output<S> : void;

/**
 * Schema mismatches that were reported already, per client. The same mismatch
 * is only reported once to keep logs readable.
 */
const reportedWarnings = new WeakMap<BaseClient, Set<string>>();

function shouldWarn(client: BaseClient, key: string): boolean {
  let reported = reportedWarnings.get(client);
  if (!reported) {
    reported = new Set();
    reportedWarnings.set(client, reported);
  }
  if (reported.has(key)) return false;
  reported.add(key);
  return true;
}

/**
 * Base class of all resource clients.
 */
export abstract class ApiResource {
  /**
   * API the resource is served by.
   * @internal
   */
  protected readonly api: ApiTarget = "cloud";

  constructor(protected readonly client: BaseClient) {}

  /**
   * Send a request, validating the request body and the response.
   *
   * Successful responses are returned unchanged (schemas only verify them), so
   * fields added to the API after this SDK version was released stay accessible.
   *
   * @internal
   */
  protected async _call<S extends z.ZodType | null>(
    method: HttpMethod,
    url: string,
    spec: CallSpec<S>,
    options?: RequestOptions,
  ): Promise<CallResult<S>> {
    const { requestValidation, responseValidation } = this.client.config;

    let body = spec.body;
    if (spec.bodySchema && body !== undefined && requestValidation) {
      const parsed = spec.bodySchema.safeParse(body);
      if (!parsed.success) {
        throw createValidationError(parsed.error as z.ZodError, {
          context: `${method} ${url} request`,
          target: "request",
        });
      }
      body = parsed.data;
    }

    const data = await this.client.request<unknown>({
      ...options,
      method,
      path: url,
      query: spec.query,
      body,
      api: this.api,
    });

    if (spec.response === null) return undefined as CallResult<S>;

    if (responseValidation !== "off") {
      const parsed = spec.response.safeParse(data);
      if (!parsed.success) {
        const error = createValidationError(parsed.error as z.ZodError, {
          context: `${method} ${url} response`,
          target: "response",
        });
        if (responseValidation === "throw") throw error;
        const signature = error.issues.map((issue) => issue.path.join(".")).join(",");
        if (!shouldWarn(this.client, `${method} ${url.replace(/\d+/g, ":id")} ${signature}`)) {
          return data as CallResult<S>;
        }
        this.client.config.onWarning(
          `${error.message}. The response is returned as-is. ` +
            "This usually means the API changed - please update @nilovonjs/hcloud-js or report an issue.",
          { issues: error.issues },
        );
      }
    }

    return data as CallResult<S>;
  }

  /** @internal */
  protected _get<S extends z.ZodType>(
    url: string,
    response: S,
    query?: object,
    options?: RequestOptions,
  ): Promise<CallResult<S>> {
    return this._call("GET", url, { query, response }, options);
  }

  /** @internal */
  protected _post<S extends z.ZodType | null>(
    url: string,
    response: S,
    body?: unknown,
    bodySchema?: z.ZodType,
    options?: RequestOptions,
  ): Promise<CallResult<S>> {
    return this._call("POST", url, { body, bodySchema, response }, options);
  }

  /** @internal */
  protected _put<S extends z.ZodType | null>(
    url: string,
    response: S,
    body?: unknown,
    bodySchema?: z.ZodType,
    options?: RequestOptions,
  ): Promise<CallResult<S>> {
    return this._call("PUT", url, { body, bodySchema, response }, options);
  }

  /** @internal */
  protected _delete<S extends z.ZodType | null>(
    url: string,
    response: S,
    options?: RequestOptions,
  ): Promise<CallResult<S>> {
    return this._call("DELETE", url, { response }, options);
  }
}

/**
 * List response holding its items under the key `K`.
 */
export type ListResponse<K extends string, Item> = { [P in K]: Item[] } & PaginatedResponse;

/**
 * Base class of resources that can be listed. Adds auto-pagination helpers on
 * top of the resource's `list()` method.
 */
export abstract class ListableResource<
  Item,
  Params extends PageParams,
  K extends string,
> extends ApiResource {
  /**
   * Key of the items in the list response.
   * @internal
   */
  protected abstract readonly itemsKey: K;

  /**
   * Fetch a single page.
   */
  abstract list(params?: Params, options?: RequestOptions): Promise<ListResponse<K, Item>>;

  /**
   * Iterate over all items, transparently fetching page after page.
   *
   * @param params - Same filters as `list()`. `page` sets the first page, `per_page` the page size (default 50).
   * @param options - Request options applied to every page request
   *
   * @example
   * ```typescript
   * for await (const item of client.servers.iterate({ label_selector: "env=prod" })) {
   *   console.log(item.name);
   * }
   * ```
   */
  async *iterate(params?: Params, options?: RequestOptions): AsyncGenerator<Item, void, undefined> {
    for await (const page of this.iteratePages(params, options)) {
      yield* page[this.itemsKey];
    }
  }

  /**
   * Iterate page by page. Each yielded value is a full list response.
   *
   * @example
   * ```typescript
   * for await (const page of client.servers.iteratePages({ per_page: 25 })) {
   *   console.log(page.servers.length, page.meta?.pagination?.total_entries);
   * }
   * ```
   */
  iteratePages(
    params?: Params,
    options?: RequestOptions,
  ): AsyncGenerator<ListResponse<K, Item>, void, undefined> {
    return iteratePages((pageParams: Params) => this.list(pageParams, options), params);
  }

  /**
   * Fetch all items across all pages.
   *
   * @example
   * ```typescript
   * const servers = await client.servers.listAll({ status: ["running"] });
   * ```
   */
  async listAll(params?: Params, options?: RequestOptions): Promise<Item[]> {
    const items: Item[] = [];
    for await (const page of this.iteratePages(params, options)) {
      items.push(...page[this.itemsKey]);
    }
    return items;
  }

  /**
   * Return the first item matching the filters, or `undefined`.
   *
   * @example
   * ```typescript
   * const newest = await client.images.first({ type: ["snapshot"], sort: ["created:desc"] });
   * ```
   */
  async first(params?: Params, options?: RequestOptions): Promise<Item | undefined> {
    const page = await this.list({ ...params, per_page: 1 } as Params, options);
    return page[this.itemsKey][0];
  }
}

/**
 * Base class of listable resources that can be filtered by name.
 */
export abstract class NamedResource<
  Item extends { name?: string | null },
  Params extends PageParams & { name?: string },
  K extends string,
> extends ListableResource<Item, Params, K> {
  /**
   * Find a resource by its exact name.
   *
   * @returns The resource, or `undefined` if no resource has this name
   *
   * @example
   * ```typescript
   * const server = await client.servers.getByName("my-server");
   * if (server) console.log(server.id);
   * ```
   */
  async getByName(name: string, options?: RequestOptions): Promise<Item | undefined> {
    const page = await this.list({ name } as Params, options);
    return page[this.itemsKey].find((item) => item.name === name);
  }
}
