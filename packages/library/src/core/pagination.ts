/**
 * Pagination helpers.
 * @see https://docs.hetzner.cloud/reference/cloud#pagination
 */

import { sleep } from "./http";

/**
 * Maximum page size accepted by the API.
 */
export const MAX_PER_PAGE = 50;

/**
 * Pagination metadata returned with list responses.
 * @see https://docs.hetzner.cloud/reference/cloud#pagination
 */
export interface PaginationMeta {
  page: number;
  per_page: number;
  previous_page: number | null;
  next_page: number | null;
  last_page: number | null;
  total_entries: number | null;
}

/**
 * Pagination query parameters.
 */
export interface PageParams {
  /** Page number to return, starting at `1`. */
  page?: number;
  /** Entries per page (max 50). */
  per_page?: number;
}

/**
 * Shape shared by all paginated list responses.
 */
export interface PaginatedResponse {
  meta?: { pagination?: PaginationMeta } | null;
}

/**
 * Paginated list response holding its items under the key `K`.
 */
export type PaginatedList<K extends string, Item> = PaginatedResponse & { [P in K]: Item[] };

/**
 * Iterate over all pages of a list endpoint, starting at `params.page` (default `1`).
 *
 * @internal
 */
export async function* iteratePages<R extends PaginatedResponse, P extends PageParams>(
  fetchPage: (params: P) => Promise<R>,
  params?: P,
): AsyncGenerator<R, void, undefined> {
  let page: number = params?.page ?? 1;
  const perPage = params?.per_page ?? MAX_PER_PAGE;

  while (true) {
    const response = await fetchPage({ ...params, page, per_page: perPage } as P);
    yield response;

    const next = response.meta?.pagination?.next_page;
    if (next === null || next === undefined || next <= page) return;
    page = next;
  }
}

/**
 * Options for {@link paginate} and {@link getAllPages}.
 */
export interface PaginationIteratorOptions {
  /** Maximum number of pages to fetch. Default: unlimited. */
  maxPages?: number;
  /** Delay between page requests in milliseconds. Default: `0`. */
  delay?: number;
  /** Items per page. Default: `50`. */
  perPage?: number;
}

/**
 * Iterate page by page through any list function.
 *
 * Prefer the built-in `client.<resource>.iterate()` and
 * `client.<resource>.listAll()` helpers. This function is useful for list
 * functions that are not covered by them.
 *
 * @example
 * ```typescript
 * for await (const servers of paginate((params) => client.servers.list(params), "servers")) {
 *   for (const server of servers) console.log(server.name);
 * }
 * ```
 */
export function paginate<K extends string, Item>(
  listFn: (params: PageParams) => Promise<PaginatedList<K, Item>>,
  itemsKey: K,
  options?: PaginationIteratorOptions,
): AsyncGenerator<Item[], void, undefined>;
export function paginate<T>(
  listFn: (params: PageParams) => Promise<PaginatedResponse & Record<string, unknown>>,
  itemsKey: string,
  options?: PaginationIteratorOptions,
): AsyncGenerator<T[], void, undefined>;
export async function* paginate(
  listFn: (params: PageParams) => Promise<PaginatedResponse>,
  itemsKey: string,
  options: PaginationIteratorOptions = {},
): AsyncGenerator<unknown[], void, undefined> {
  const { maxPages = Number.POSITIVE_INFINITY, delay = 0, perPage = MAX_PER_PAGE } = options;
  let fetched = 0;

  for await (const response of iteratePages(listFn, { per_page: perPage })) {
    const items = (response as Record<string, unknown>)[itemsKey];
    if (Array.isArray(items) && items.length > 0) yield items;

    fetched += 1;
    if (fetched >= maxPages) return;
    if (delay > 0 && response.meta?.pagination?.next_page) await sleep(delay);
  }
}

/**
 * Fetch all items of a list function.
 *
 * @example
 * ```typescript
 * const servers = await getAllPages((params) => client.servers.list(params), "servers");
 * ```
 */
export function getAllPages<K extends string, Item>(
  listFn: (params: PageParams) => Promise<PaginatedList<K, Item>>,
  itemsKey: K,
  options?: PaginationIteratorOptions,
): Promise<Item[]>;
export function getAllPages<T>(
  listFn: (params: PageParams) => Promise<PaginatedResponse & Record<string, unknown>>,
  itemsKey: string,
  options?: PaginationIteratorOptions,
): Promise<T[]>;
export async function getAllPages(
  listFn: (params: PageParams) => Promise<PaginatedResponse>,
  itemsKey: string,
  options: PaginationIteratorOptions = {},
): Promise<unknown[]> {
  const all: unknown[] = [];
  for await (const items of paginate<unknown>(
    listFn as (params: PageParams) => Promise<PaginatedResponse & Record<string, unknown>>,
    itemsKey,
    options,
  )) {
    all.push(...items);
  }
  return all;
}
