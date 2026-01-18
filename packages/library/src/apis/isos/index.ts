/**
 * Hetzner Cloud ISOs API
 * @see https://docs.hetzner.cloud/reference/cloud#isos
 */

import type { HCloudClient } from "@/client/index";
import type { ListISOsParams, ListISOsResponse, GetISOResponse } from "@/apis/isos/types";
import { validate } from "@/validation/index";
import { listISOsResponseSchema, getISOResponseSchema } from "@/apis/isos/schemas";

/**
 * ISOs API client
 */
export class ISOsClient {
  constructor(private readonly client: HCloudClient) {}

  /**
   * Returns all available ISO objects.
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of ISOs with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#isos-list-isos
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all ISOs
   * const result = await client.isos.list();
   *
   * // List ISOs with filters
   * const isos = await client.isos.list({
   *   name: 'debian',
   *   sort: ['name:asc'],
   *   page: 1,
   *   per_page: 50
   * });
   * ```
   */
  async list(params?: ListISOsParams): Promise<ListISOsResponse> {
    const queryParams: Record<string, string | number | string[] | undefined> = {};

    if (params?.name) {
      queryParams.name = params.name;
    }

    if (params?.sort) {
      queryParams.sort = Array.isArray(params.sort) ? params.sort : [params.sort];
    }

    if (params?.page !== undefined) {
      queryParams.page = params.page;
    }

    if (params?.per_page !== undefined) {
      queryParams.per_page = params.per_page;
    }

    const response = await this.client.get<unknown>("/isos", queryParams);

    return validate(listISOsResponseSchema, response, {
      context: "List ISOs response",
      detailed: true,
    });
  }

  /**
   * Returns a specific ISO object.
   *
   * @param id - ID of the ISO
   * @returns Promise resolving to the ISO
   * @see https://docs.hetzner.cloud/reference/cloud#isos-get-an-iso
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get an ISO by ID
   * const iso = await client.isos.get(12345);
   * console.log(iso.iso.name);
   * ```
   */
  async get(id: number): Promise<GetISOResponse> {
    const response = await this.client.get<unknown>(`/isos/${id}`);

    return validate(getISOResponseSchema, response, {
      context: "Get ISO response",
      detailed: true,
    });
  }
}
