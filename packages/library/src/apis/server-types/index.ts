/**
 * Hetzner Cloud Server Types API
 * @see https://docs.hetzner.cloud/reference/cloud#server-types
 */

import type { HCloudClient } from "../../client/index";
import type {
  ListServerTypesParams,
  ListServerTypesResponse,
  GetServerTypeResponse,
} from "../../apis/server-types/types";
import { validate } from "../../validation/index";
import {
  listServerTypesResponseSchema,
  getServerTypeResponseSchema,
} from "../../apis/server-types/schemas";

/**
 * Server Types API client
 */
export class ServerTypesClient {
  constructor(private readonly client: HCloudClient) {}

  /**
   * Returns all Server Type objects.
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of server types with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#server-types-list-server-types
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all server types
   * const result = await client.serverTypes.list();
   *
   * // List server types with filters
   * const serverTypes = await client.serverTypes.list({
   *   name: 'cpx11',
   *   page: 1,
   *   per_page: 50
   * });
   * ```
   */
  async list(params?: ListServerTypesParams): Promise<ListServerTypesResponse> {
    const queryParams: Record<string, string | number | string[] | undefined> = {};

    if (params?.name) {
      queryParams.name = params.name;
    }

    if (params?.page !== undefined) {
      queryParams.page = params.page;
    }

    if (params?.per_page !== undefined) {
      queryParams.per_page = params.per_page;
    }

    const response = await this.client.get<unknown>("/server_types", queryParams);

    return validate(listServerTypesResponseSchema, response, {
      context: "List server types response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Server Type object.
   *
   * @param id - ID or name of the Server Type
   * @returns Promise resolving to the server type
   * @see https://docs.hetzner.cloud/reference/cloud#server-types-get-a-server-type
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get a server type by ID or name
   * const serverType = await client.serverTypes.get('cpx11');
   * console.log(serverType.server_type.name);
   * ```
   */
  async get(id: string | number): Promise<GetServerTypeResponse> {
    const response = await this.client.get<unknown>(`/server_types/${id}`);

    return validate(getServerTypeResponseSchema, response, {
      context: "Get server type response",
      detailed: true,
    });
  }
}
