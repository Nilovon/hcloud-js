/**
 * Hetzner Cloud Datacenters API
 *
 * The Datacenters API is deprecated by Hetzner and is removed after 2026-10-01.
 * @see https://docs.hetzner.cloud/changelog#2026-06-02-datacenters-deprecated
 */

import { NamedResource, path } from "../../core/resource";
import type { RequestOptions } from "../../core/types";
import { getDataCenterResponseSchema, listDataCentersResponseSchema } from "./schemas";
import type {
  Datacenter,
  GetDataCenterResponse,
  ListDataCentersParams,
  ListDataCentersResponse,
} from "./types";

/**
 * Datacenters API client
 *
 * In addition to the methods below, the pagination helpers `iterate()`,
 * `iteratePages()`, `listAll()` and `first()` as well as `getByName()` are
 * available.
 *
 * @deprecated Hetzner deprecated the Datacenters API and removes it after
 * 2026-10-01. From then on, requests fail with `410 Gone`. Use
 * `client.locations` instead; the availability of server types moved to
 * `locations[]` of the server types.
 * @see https://docs.hetzner.cloud/changelog#2026-06-02-datacenters-deprecated
 */
export class DatacentersClient extends NamedResource<
  Datacenter,
  ListDataCentersParams,
  "datacenters"
> {
  protected readonly itemsKey = "datacenters";

  /**
   * Returns a page of datacenters.
   *
   * @deprecated The Datacenters API is removed after 2026-10-01. Use `client.locations.list()` instead.
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#data-centers-list-data-centers
   *
   * @example
   * ```typescript
   * const { datacenters, recommendation } = await client.datacenters.list({ sort: "name:asc" });
   * ```
   */
  list(params?: ListDataCentersParams, options?: RequestOptions): Promise<ListDataCentersResponse> {
    return this._get("/datacenters", listDataCentersResponseSchema, params, options);
  }

  /**
   * Returns a specific datacenter.
   *
   * @deprecated The Datacenters API is removed after 2026-10-01. Use `client.locations.get()` instead.
   * @param id - ID of the datacenter
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#data-centers-get-a-data-center
   *
   * @example
   * ```typescript
   * const { datacenter } = await client.datacenters.get(4);
   * console.log(datacenter.location.name);
   * ```
   */
  get(id: number, options?: RequestOptions): Promise<GetDataCenterResponse> {
    return this._get(path`/datacenters/${id}`, getDataCenterResponseSchema, undefined, options);
  }
}
