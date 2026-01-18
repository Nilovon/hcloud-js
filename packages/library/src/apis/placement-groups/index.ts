/**
 * Hetzner Cloud Placement Groups API
 * @see https://docs.hetzner.cloud/reference/cloud#placement-groups
 */

import type { HCloudClient } from "../../client/index";
import type {
  ListPlacementGroupsParams,
  ListPlacementGroupsResponse,
  CreatePlacementGroupParams,
  CreatePlacementGroupResponse,
  GetPlacementGroupResponse,
  UpdatePlacementGroupParams,
  UpdatePlacementGroupResponse,
  DeletePlacementGroupResponse,
} from "../../apis/placement-groups/types";
import { validate } from "../../validation/index";
import {
  listPlacementGroupsResponseSchema,
  createPlacementGroupRequestSchema,
  createPlacementGroupResponseSchema,
  getPlacementGroupResponseSchema,
  updatePlacementGroupRequestSchema,
  updatePlacementGroupResponseSchema,
  deletePlacementGroupResponseSchema,
} from "../../apis/placement-groups/schemas";

/**
 * Placement Groups API client
 */
export class PlacementGroupsClient {
  constructor(private readonly client: HCloudClient) {}

  /**
   * Returns all Placement Group objects.
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of placement groups with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-list-placement-groups
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all placement groups
   * const result = await client.placementGroups.list();
   *
   * // List placement groups with filters
   * const groups = await client.placementGroups.list({
   *   name: 'my-group',
   *   label_selector: 'environment=production',
   *   sort: ['name:asc'],
   *   page: 1,
   *   per_page: 50
   * });
   * ```
   */
  async list(params?: ListPlacementGroupsParams): Promise<ListPlacementGroupsResponse> {
    const queryParams: Record<string, string | number | string[] | undefined> = {};

    if (params?.name) {
      queryParams.name = params.name;
    }

    if (params?.label_selector) {
      queryParams.label_selector = params.label_selector;
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

    const response = await this.client.get<unknown>("/placement_groups", queryParams);

    return validate(listPlacementGroupsResponseSchema, response, {
      context: "List placement groups response",
      detailed: true,
    });
  }

  /**
   * Creates a new Placement Group.
   *
   * @param params - Parameters for creating the placement group
   * @returns Promise resolving to the created placement group
   * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-create-a-placement-group
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Create a placement group
   * const group = await client.placementGroups.create({
   *   name: 'my-placement-group',
   *   type: 'spread',
   *   labels: { environment: 'production' }
   * });
   * ```
   */
  async create(params: CreatePlacementGroupParams): Promise<CreatePlacementGroupResponse> {
    const validatedParams = validate(createPlacementGroupRequestSchema, params, {
      context: "Create placement group request",
      detailed: true,
    });

    const response = await this.client.post<unknown>("/placement_groups", validatedParams);

    return validate(createPlacementGroupResponseSchema, response, {
      context: "Create placement group response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Placement Group object.
   *
   * @param id - ID of the Placement Group
   * @returns Promise resolving to the placement group
   * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-get-a-placement-group
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get a placement group by ID
   * const group = await client.placementGroups.get(12345);
   * console.log(group.placement_group.name);
   * ```
   */
  async get(id: number): Promise<GetPlacementGroupResponse> {
    const response = await this.client.get<unknown>(`/placement_groups/${id}`);

    return validate(getPlacementGroupResponseSchema, response, {
      context: "Get placement group response",
      detailed: true,
    });
  }

  /**
   * Updates the Placement Group.
   *
   * You can update a Placement Group's name and labels.
   *
   * @param id - ID of the Placement Group
   * @param params - Parameters to update (name and/or labels)
   * @returns Promise resolving to the updated placement group
   * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-update-a-placement-group
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Update placement group name
   * const updated = await client.placementGroups.update(12345, {
   *   name: 'new-group-name'
   * });
   *
   * // Update labels
   * const updated = await client.placementGroups.update(12345, {
   *   labels: { environment: 'production', team: 'backend' }
   * });
   * ```
   */
  async update(
    id: number,
    params: UpdatePlacementGroupParams,
  ): Promise<UpdatePlacementGroupResponse> {
    const validatedParams = validate(updatePlacementGroupRequestSchema, params, {
      context: "Update placement group request",
      detailed: true,
    });

    const response = await this.client.put<unknown>(`/placement_groups/${id}`, validatedParams);

    return validate(updatePlacementGroupResponseSchema, response, {
      context: "Update placement group response",
      detailed: true,
    });
  }

  /**
   * Deletes a Placement Group.
   *
   * @param id - ID of the Placement Group
   * @returns Promise resolving to empty object
   * @see https://docs.hetzner.cloud/reference/cloud#placement-groups-delete-a-placement-group
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Delete a placement group
   * await client.placementGroups.delete(12345);
   * ```
   */
  async delete(id: number): Promise<DeletePlacementGroupResponse> {
    const response = await this.client.delete<unknown>(`/placement_groups/${id}`);

    return validate(deletePlacementGroupResponseSchema, response, {
      context: "Delete placement group response",
      detailed: true,
    });
  }
}
