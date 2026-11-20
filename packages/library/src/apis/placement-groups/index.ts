/**
 * Hetzner Cloud Placement Groups API
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups
 */

import { NamedResource, path } from "../../core/resource";
import type { RequestOptions } from "../../core/types";
import {
  createPlacementGroupRequestSchema,
  createPlacementGroupResponseSchema,
  getPlacementGroupResponseSchema,
  listPlacementGroupsResponseSchema,
  updatePlacementGroupRequestSchema,
  updatePlacementGroupResponseSchema,
} from "./schemas";
import type {
  CreatePlacementGroupParams,
  CreatePlacementGroupResponse,
  GetPlacementGroupResponse,
  ListPlacementGroupsParams,
  ListPlacementGroupsResponse,
  PlacementGroup,
  UpdatePlacementGroupParams,
  UpdatePlacementGroupResponse,
} from "./types";

/**
 * Placement Groups API client
 *
 * Placement groups control the distribution of servers. Servers of a `spread`
 * group run on different physical hosts.
 *
 * In addition to the methods below, the pagination helpers `iterate()`,
 * `iteratePages()`, `listAll()` and `first()` as well as `getByName()` are
 * available.
 *
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups
 */
export class PlacementGroupsClient extends NamedResource<
  PlacementGroup,
  ListPlacementGroupsParams,
  "placement_groups"
> {
  protected readonly itemsKey = "placement_groups";

  /**
   * Returns a page of placement groups.
   *
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-list-placement-groups
   *
   * @example
   * ```typescript
   * const { placement_groups } = await client.placementGroups.list({
   *   label_selector: "environment=production",
   *   sort: "name:asc",
   * });
   * ```
   */
  list(
    params?: ListPlacementGroupsParams,
    options?: RequestOptions,
  ): Promise<ListPlacementGroupsResponse> {
    return this._get("/placement_groups", listPlacementGroupsResponseSchema, params, options);
  }

  /**
   * Returns a specific placement group.
   *
   * @param id - ID of the placement group
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-get-a-placement-group
   *
   * @example
   * ```typescript
   * const { placement_group } = await client.placementGroups.get(897);
   * console.log(placement_group.servers);
   * ```
   */
  get(id: number, options?: RequestOptions): Promise<GetPlacementGroupResponse> {
    return this._get(
      path`/placement_groups/${id}`,
      getPlacementGroupResponseSchema,
      undefined,
      options,
    );
  }

  /**
   * Creates a new placement group.
   *
   * @param params - Name, type and optional labels
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-create-a-placement-group
   *
   * @example
   * ```typescript
   * const { placement_group } = await client.placementGroups.create({
   *   name: "my-placement-group",
   *   type: "spread",
   * });
   * ```
   */
  create(
    params: CreatePlacementGroupParams,
    options?: RequestOptions,
  ): Promise<CreatePlacementGroupResponse> {
    return this._post(
      "/placement_groups",
      createPlacementGroupResponseSchema,
      params,
      createPlacementGroupRequestSchema,
      options,
    );
  }

  /**
   * Updates the name and/or labels of a placement group.
   *
   * @param id - ID of the placement group
   * @param params - Fields to update
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-update-a-placement-group
   *
   * @example
   * ```typescript
   * const { placement_group } = await client.placementGroups.update(897, {
   *   name: "new-name",
   *   labels: { environment: "production" },
   * });
   * ```
   */
  update(
    id: number,
    params: UpdatePlacementGroupParams,
    options?: RequestOptions,
  ): Promise<UpdatePlacementGroupResponse> {
    return this._put(
      path`/placement_groups/${id}`,
      updatePlacementGroupResponseSchema,
      params,
      updatePlacementGroupRequestSchema,
      options,
    );
  }

  /**
   * Deletes a placement group.
   *
   * @param id - ID of the placement group
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-delete-a-placement-group
   *
   * @example
   * ```typescript
   * await client.placementGroups.delete(897);
   * ```
   */
  delete(id: number, options?: RequestOptions): Promise<void> {
    return this._delete(path`/placement_groups/${id}`, null, options);
  }
}
