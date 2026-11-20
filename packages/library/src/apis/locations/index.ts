/**
 * Hetzner Cloud Locations API
 * @see https://docs.hetzner.cloud/reference/cloud#locations
 */

import { NamedResource, path } from "../../core/resource";
import type { RequestOptions } from "../../core/types";
import { DatacentersClient } from "../datacenters/index";
import type {
  GetDataCenterResponse,
  ListDataCentersParams,
  ListDataCentersResponse,
} from "../datacenters/types";
import { getLocationResponseSchema, listLocationsResponseSchema } from "./schemas";
import type {
  GetLocationResponse,
  ListLocationsParams,
  ListLocationsResponse,
  Location,
} from "./types";

/**
 * Locations API client
 *
 * Locations are the geographical sites resources are created in, e.g. `fsn1`.
 *
 * In addition to the methods below, the pagination helpers `iterate()`,
 * `iteratePages()`, `listAll()` and `first()` as well as `getByName()` are
 * available.
 *
 * @see https://docs.hetzner.cloud/reference/cloud#locations
 */
export class LocationsClient extends NamedResource<Location, ListLocationsParams, "locations"> {
  protected readonly itemsKey = "locations";

  /**
   * Returns a page of locations.
   *
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#locations-list-locations
   *
   * @example
   * ```typescript
   * const { locations } = await client.locations.list({ sort: "name:asc" });
   *
   * // Find a location by its name
   * const fsn1 = await client.locations.getByName("fsn1");
   * ```
   */
  list(params?: ListLocationsParams, options?: RequestOptions): Promise<ListLocationsResponse> {
    return this._get("/locations", listLocationsResponseSchema, params, options);
  }

  /**
   * Returns a specific location.
   *
   * @param id - ID of the location
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#locations-get-a-location
   *
   * @example
   * ```typescript
   * const { location } = await client.locations.get(1);
   * console.log(location.name, location.network_zone);
   * ```
   */
  get(id: number, options?: RequestOptions): Promise<GetLocationResponse> {
    return this._get(path`/locations/${id}`, getLocationResponseSchema, undefined, options);
  }

  /**
   * Returns a page of datacenters.
   *
   * @deprecated The Datacenters API is removed by Hetzner after 2026-10-01. Use `list()` instead.
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/changelog#2026-06-02-datacenters-deprecated
   */
  listDataCenters(
    params?: ListDataCentersParams,
    options?: RequestOptions,
  ): Promise<ListDataCentersResponse> {
    return new DatacentersClient(this.client).list(params, options);
  }

  /**
   * Returns a specific datacenter.
   *
   * @deprecated The Datacenters API is removed by Hetzner after 2026-10-01. Use `get()` instead.
   * @param id - ID of the datacenter
   * @param options - Request options
   * @see https://docs.hetzner.cloud/changelog#2026-06-02-datacenters-deprecated
   */
  getDataCenter(id: number, options?: RequestOptions): Promise<GetDataCenterResponse> {
    return new DatacentersClient(this.client).get(id, options);
  }
}
