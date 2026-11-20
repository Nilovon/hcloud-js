/**
 * Hetzner Cloud Server Types API
 * @see https://docs.hetzner.cloud/reference/cloud#server-types
 */

import { NamedResource, path } from "../../core/resource";
import type { RequestOptions } from "../../core/types";
import { getServerTypeResponseSchema, listServerTypesResponseSchema } from "./schemas";
import type {
  GetServerTypeResponse,
  ListServerTypesParams,
  ListServerTypesResponse,
  ServerType,
} from "./types";

/**
 * Server Types API client
 *
 * Server types define the kinds of servers offered: cores, memory, disk and
 * the locations they are available in.
 *
 * In addition to the methods below, the pagination helpers `iterate()`,
 * `iteratePages()`, `listAll()` and `first()` as well as `getByName()` are
 * available.
 *
 * @see https://docs.hetzner.cloud/reference/cloud#server-types
 */
export class ServerTypesClient extends NamedResource<
  ServerType,
  ListServerTypesParams,
  "server_types"
> {
  protected readonly itemsKey = "server_types";

  /**
   * Returns a page of server types.
   *
   * @param params - Filters and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#server-types-list-server-types
   *
   * @example
   * ```typescript
   * const { server_types } = await client.serverTypes.list();
   *
   * // Find a server type by its name
   * const cpx22 = await client.serverTypes.getByName("cpx22");
   * ```
   */
  list(params?: ListServerTypesParams, options?: RequestOptions): Promise<ListServerTypesResponse> {
    return this._get("/server_types", listServerTypesResponseSchema, params, options);
  }

  /**
   * Returns a specific server type.
   *
   * @param id - ID of the server type
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#server-types-get-a-server-type
   *
   * @example
   * ```typescript
   * const { server_type } = await client.serverTypes.get(22);
   * const available = server_type.locations?.filter((location) => location.available);
   * ```
   */
  get(id: number, options?: RequestOptions): Promise<GetServerTypeResponse> {
    return this._get(path`/server_types/${id}`, getServerTypeResponseSchema, undefined, options);
  }
}
