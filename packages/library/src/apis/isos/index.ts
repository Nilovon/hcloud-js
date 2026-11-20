/**
 * Hetzner Cloud ISOs API
 * @see https://docs.hetzner.cloud/reference/cloud#isos
 */

import { NamedResource, path } from "../../core/resource";
import type { RequestOptions } from "../../core/types";
import { getISOResponseSchema, listISOsResponseSchema } from "./schemas";
import type { GetISOResponse, ISO, ListISOsParams, ListISOsResponse } from "./types";

/**
 * ISOs API client
 *
 * ISOs are read-only images of DVDs that can be attached to servers. Besides
 * the public ISOs, custom (private) ISOs can be requested from Hetzner support.
 *
 * In addition to the methods below, the pagination helpers `iterate()`,
 * `iteratePages()`, `listAll()` and `first()` as well as `getByName()` are
 * available.
 *
 * @see https://docs.hetzner.cloud/reference/cloud#isos
 */
export class ISOsClient extends NamedResource<ISO, ListISOsParams, "isos"> {
  protected readonly itemsKey = "isos";

  /**
   * Returns a page of ISOs.
   *
   * @param params - Filters and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#isos-list-isos
   *
   * @example
   * ```typescript
   * const { isos } = await client.isos.list({
   *   architecture: "arm",
   *   include_architecture_wildcard: true,
   * });
   * ```
   */
  list(params?: ListISOsParams, options?: RequestOptions): Promise<ListISOsResponse> {
    return this._get("/isos", listISOsResponseSchema, params, options);
  }

  /**
   * Returns a specific ISO.
   *
   * @param id - ID of the ISO
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#isos-get-an-iso
   *
   * @example
   * ```typescript
   * const { iso } = await client.isos.get(4711);
   * console.log(iso.name, iso.architecture);
   * ```
   */
  get(id: number, options?: RequestOptions): Promise<GetISOResponse> {
    return this._get(path`/isos/${id}`, getISOResponseSchema, undefined, options);
  }
}
