/**
 * Pagination utilities for working with paginated API responses
 * @see https://docs.hetzner.cloud/reference/cloud#pagination
 */

import type { z } from "zod";
import { paginationMetaSchema } from "../apis/common/schemas";

type PaginationMeta = z.infer<typeof paginationMetaSchema>;

/**
 * Options for iterating through paginated results
 */
export interface PaginationIteratorOptions {
  /**
   * Maximum number of pages to fetch (default: Infinity)
   */
  maxPages?: number;
  /**
   * Delay between page requests in milliseconds (default: 0)
   */
  delay?: number;
  /**
   * Items per page (default: 50)
   */
  perPage?: number;
}

/**
 * Async generator for iterating through paginated results
 *
 * This utility works with any Hetzner Cloud API list response that follows the pattern:
 * { [itemsKey]: T[], meta?: { pagination?: PaginationMeta } }
 *
 * @example
 * ```typescript
 * const client = new HCloudClient({ token: 'your-token' });
 *
 * // Iterate through all servers
 * for await (const servers of paginate(
 *   (params) => client.servers.list(params),
 *   { itemsKey: 'servers' }
 * )) {
 *   for (const server of servers) {
 *     console.log(server.name);
 *   }
 * }
 * ```
 */
export async function* paginate<T>(
  listFn: (params?: { page?: number; per_page?: number }) => Promise<{
    [key: string]: unknown;
    meta?: { pagination?: PaginationMeta };
  }>,
  itemsKey: string,
  options: PaginationIteratorOptions = {},
): AsyncGenerator<T[], void, unknown> {
  const { maxPages = Infinity, delay = 0, perPage = 50 } = options;
  let currentPage = 1;
  let hasMore = true;

  while (hasMore && currentPage <= maxPages) {
    const result = await listFn({
      page: currentPage,
      per_page: perPage,
    });

    const items = (result[itemsKey] as T[] | undefined) ?? [];

    if (items.length > 0) {
      yield items as T[];
    }

    const pagination = result.meta?.pagination;
    if (pagination) {
      hasMore = pagination.next_page !== null;
      currentPage = pagination.next_page ?? currentPage + 1;
    } else {
      hasMore = false;
    }

    if (hasMore && delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

/**
 * Fetch all items from a paginated endpoint
 *
 * @example
 * ```typescript
 * const client = new HCloudClient({ token: 'your-token' });
 *
 * // Get all servers
 * const allServers = await getAllPages(
 *   (params) => client.servers.list(params),
 *   'servers'
 * );
 * console.log(`Total: ${allServers.length} servers`);
 * ```
 */
export async function getAllPages<T>(
  listFn: (params?: { page?: number; per_page?: number }) => Promise<{
    [key: string]: unknown;
    meta?: { pagination?: PaginationMeta };
  }>,
  itemsKey: string,
  options: PaginationIteratorOptions = {},
): Promise<T[]> {
  const allItems: T[] = [];

  for await (const items of paginate<T>(listFn, itemsKey, options)) {
    allItems.push(...items);
  }

  return allItems;
}

// Re-export PaginationMeta type
export type { PaginationMeta };