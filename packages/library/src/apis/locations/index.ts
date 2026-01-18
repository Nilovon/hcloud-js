/**
 * Hetzner Cloud Locations API
 * @see https://docs.hetzner.cloud/reference/cloud#locations
 */

import type { HCloudClient } from "@hcloud-js/client/index.js";
import type {
  ListLocationsParams,
  ListLocationsResponse,
  GetLocationResponse,
  ListDataCentersParams,
  ListDataCentersResponse,
  GetDataCenterResponse,
} from "@hcloud-js/apis/locations/types.js";
import { validate } from "@hcloud-js/validation/index.js";
import {
  listLocationsResponseSchema,
  getLocationResponseSchema,
  listDataCentersResponseSchema,
  getDataCenterResponseSchema,
} from "@hcloud-js/apis/locations/schemas.js";

/**
 * Locations API client
 */
export class LocationsClient {
  constructor(private readonly client: HCloudClient) {}

  /**
   * Returns all Location objects.
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of locations with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#locations-list-locations
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all locations
   * const result = await client.locations.list();
   *
   * // List locations with filters
   * const locations = await client.locations.list({
   *   name: 'nbg1',
   *   sort: ['name:asc'],
   *   page: 1,
   *   per_page: 50
   * });
   * ```
   */
  async list(params?: ListLocationsParams): Promise<ListLocationsResponse> {
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

    const response = await this.client.get<unknown>("/locations", queryParams);

    return validate(listLocationsResponseSchema, response, {
      context: "List locations response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Location object.
   *
   * @param id - ID or name of the Location
   * @returns Promise resolving to the location
   * @see https://docs.hetzner.cloud/reference/cloud#locations-get-a-location
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get a location by ID or name
   * const location = await client.locations.get('nbg1');
   * console.log(location.location.name);
   * ```
   */
  async get(id: number | string): Promise<GetLocationResponse> {
    const response = await this.client.get<unknown>(`/locations/${id}`);

    return validate(getLocationResponseSchema, response, {
      context: "Get location response",
      detailed: true,
    });
  }

  /**
   * Returns all Datacenter objects.
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of datacenters with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#data-centers-list-data-centers
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all datacenters
   * const result = await client.locations.listDataCenters();
   *
   * // List datacenters with filters
   * const datacenters = await client.locations.listDataCenters({
   *   name: 'nbg1-dc3',
   *   sort: ['name:asc']
   * });
   * ```
   */
  async listDataCenters(params?: ListDataCentersParams): Promise<ListDataCentersResponse> {
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

    const response = await this.client.get<unknown>("/datacenters", queryParams);

    return validate(listDataCentersResponseSchema, response, {
      context: "List datacenters response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Datacenter object.
   *
   * @param id - ID or name of the Datacenter
   * @returns Promise resolving to the datacenter
   * @see https://docs.hetzner.cloud/reference/cloud#data-centers-get-a-data-center
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get a datacenter by ID or name
   * const datacenter = await client.locations.getDataCenter('nbg1-dc3');
   * console.log(datacenter.datacenter.name);
   * ```
   */
  async getDataCenter(id: number | string): Promise<GetDataCenterResponse> {
    const response = await this.client.get<unknown>(`/datacenters/${id}`);

    return validate(getDataCenterResponseSchema, response, {
      context: "Get datacenter response",
      detailed: true,
    });
  }
}
