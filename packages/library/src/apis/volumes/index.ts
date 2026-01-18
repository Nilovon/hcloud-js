/**
 * Hetzner Cloud Volumes API
 * @see https://docs.hetzner.cloud/reference/cloud#volumes
 */

import type { HCloudClient } from "../../client/index";
import type {
  ListVolumesParams,
  ListVolumesResponse,
  CreateVolumeParams,
  CreateVolumeResponse,
  GetVolumeResponse,
  UpdateVolumeParams,
  UpdateVolumeResponse,
  DeleteVolumeResponse,
  ListVolumeActionsParams,
  ListVolumeActionsResponse,
  GetVolumeActionResponse,
  AttachVolumeToServerParams,
  AttachVolumeToServerResponse,
  DetachVolumeResponse,
  ResizeVolumeParams,
  ResizeVolumeResponse,
  ChangeVolumeProtectionParams,
  ChangeVolumeProtectionResponse,
  } from "../../apis/volumes/types";
import { validate } from "../../validation/index";
import {
  listVolumesResponseSchema,
  createVolumeRequestSchema,
  createVolumeResponseSchema,
  getVolumeResponseSchema,
  updateVolumeRequestSchema,
  updateVolumeResponseSchema,
  deleteVolumeResponseSchema,
  listVolumeActionsResponseSchema,
  getVolumeActionResponseSchema,
  attachVolumeToServerRequestSchema,
  attachVolumeToServerResponseSchema,
  detachVolumeRequestSchema,
  detachVolumeResponseSchema,
  resizeVolumeRequestSchema,
  resizeVolumeResponseSchema,
  changeVolumeProtectionRequestSchema,
  changeVolumeProtectionResponseSchema,
} from "../../apis/volumes/schemas";

/**
 * Volumes API client
 */
export class VolumesClient {
  constructor(private readonly client: HCloudClient) {}

  /**
   * Returns all Volume objects.
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of volumes with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-list-volumes
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all volumes
   * const result = await client.volumes.list();
   *
   * // List volumes with filters
   * const volumes = await client.volumes.list({
   *   name: 'my-volume',
   *   label_selector: 'environment=production',
   *   sort: ['name:asc'],
   *   page: 1,
   *   per_page: 50
   * });
   * ```
   */
  async list(params?: ListVolumesParams): Promise<ListVolumesResponse> {
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

    const response = await this.client.get<unknown>("/volumes", queryParams);

    return validate(listVolumesResponseSchema, response, {
      context: "List volumes response",
      detailed: true,
    });
  }

  /**
   * Creates a new Volume.
   *
   * @param params - Parameters for creating the volume
   * @returns Promise resolving to the created volume and action
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-create-a-volume
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Create a volume
   * const volume = await client.volumes.create({
   *   name: 'my-volume',
   *   size: 100,
   *   location: 'nbg1',
   *   labels: { environment: 'production' }
   * });
   *
   * // Create and attach to a server
   * const volume = await client.volumes.create({
   *   name: 'my-volume',
   *   size: 100,
   *   server: 12345,
   *   automount: true
   * });
   * ```
   */
  async create(params: CreateVolumeParams): Promise<CreateVolumeResponse> {
    const validatedParams = validate(createVolumeRequestSchema, params, {
      context: "Create volume request",
      detailed: true,
    });

    const response = await this.client.post<unknown>("/volumes", validatedParams);

    return validate(createVolumeResponseSchema, response, {
      context: "Create volume response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Volume object.
   *
   * @param id - ID of the Volume
   * @returns Promise resolving to the volume
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-get-a-volume
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get a volume by ID
   * const volume = await client.volumes.get(12345);
   * console.log(volume.volume.name);
   * ```
   */
  async get(id: number): Promise<GetVolumeResponse> {
    const response = await this.client.get<unknown>(`/volumes/${id}`);

    return validate(getVolumeResponseSchema, response, {
      context: "Get volume response",
      detailed: true,
    });
  }

  /**
   * Updates the Volume.
   *
   * You can update a Volume's name and labels.
   *
   * @param id - ID of the Volume
   * @param params - Parameters to update (name and/or labels)
   * @returns Promise resolving to the updated volume
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-update-a-volume
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Update volume name
   * const updated = await client.volumes.update(12345, {
   *   name: 'new-volume-name'
   * });
   *
   * // Update labels
   * const updated = await client.volumes.update(12345, {
   *   labels: { environment: 'production', team: 'backend' }
   * });
   * ```
   */
  async update(id: number, params: UpdateVolumeParams): Promise<UpdateVolumeResponse> {
    const validatedParams = validate(updateVolumeRequestSchema, params, {
      context: "Update volume request",
      detailed: true,
    });

    const response = await this.client.put<unknown>(`/volumes/${id}`, validatedParams);

    return validate(updateVolumeResponseSchema, response, {
      context: "Update volume response",
      detailed: true,
    });
  }

  /**
   * Deletes a Volume.
   *
   * @param id - ID of the Volume
   * @returns Promise resolving to the delete action
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-delete-a-volume
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Delete a volume
   * const result = await client.volumes.delete(12345);
   * if (result.action) {
   *   console.log(`Delete action ID: ${result.action.id}`);
   * }
   * ```
   */
  async delete(id: number): Promise<DeleteVolumeResponse> {
    const response = await this.client.delete<unknown>(`/volumes/${id}`);

    return validate(deleteVolumeResponseSchema, response, {
      context: "Delete volume response",
      detailed: true,
    });
  }

  /**
   * Returns all Action objects for a Volume.
   *
   * @param id - ID of the Volume
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of actions with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-list-actions-for-a-volume
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all actions for a volume
   * const actions = await client.volumes.listActions(12345);
   *
   * // List actions with filters
   * const runningActions = await client.volumes.listActions(12345, {
   *   status: ['running'],
   *   sort: ['started:desc']
   * });
   * ```
   */
  async listActions(
    id: number,
    params?: ListVolumeActionsParams,
  ): Promise<ListVolumeActionsResponse> {
    const queryParams: Record<string, string | number | string[] | undefined> = {};

    if (params?.sort) {
      queryParams.sort = Array.isArray(params.sort) ? params.sort : [params.sort];
    }

    if (params?.status) {
      queryParams.status = Array.isArray(params.status) ? params.status : [params.status];
    }

    if (params?.page !== undefined) {
      queryParams.page = params.page;
    }

    if (params?.per_page !== undefined) {
      queryParams.per_page = params.per_page;
    }

    const response = await this.client.get<unknown>(`/volumes/${id}/actions`, queryParams);

    return validate(listVolumeActionsResponseSchema, response, {
      context: "List volume actions response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Action object for a Volume.
   *
   * @param id - ID of the Volume
   * @param actionId - ID of the Action
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-get-an-action-for-a-volume
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get an action by ID
   * const action = await client.volumes.getAction(12345, 67890);
   * console.log(action.action.command);
   * ```
   */
  async getAction(id: number, actionId: number): Promise<GetVolumeActionResponse> {
    const response = await this.client.get<unknown>(`/volumes/${id}/actions/${actionId}`);

    return validate(getVolumeActionResponseSchema, response, {
      context: "Get volume action response",
      detailed: true,
    });
  }

  /**
   * Attaches a Volume to a Server.
   *
   * @param id - ID of the Volume
   * @param params - Server to attach to
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-attach-volume-to-a-server
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.volumes.attachToServer(12345, {
   *   server: 67890,
   *   automount: true
   * });
   * ```
   */
  async attachToServer(
    id: number,
    params: AttachVolumeToServerParams,
  ): Promise<AttachVolumeToServerResponse> {
    const validatedParams = validate(attachVolumeToServerRequestSchema, params, {
      context: "Attach volume to server request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/volumes/${id}/actions/attach`,
      validatedParams,
    );

    return validate(attachVolumeToServerResponseSchema, response, {
      context: "Attach volume to server response",
      detailed: true,
    });
  }

  /**
   * Detaches a Volume from a Server.
   *
   * @param id - ID of the Volume
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-detach-volume
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.volumes.detach(12345);
   * ```
   */
  async detach(id: number): Promise<DetachVolumeResponse> {
    const response = await this.client.post<unknown>(`/volumes/${id}/actions/detach`, {});

    return validate(detachVolumeResponseSchema, response, {
      context: "Detach volume response",
      detailed: true,
    });
  }

  /**
   * Resizes a Volume.
   *
   * @param id - ID of the Volume
   * @param params - New size (in GB)
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-resize-volume
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.volumes.resize(12345, {
   *   size: 200
   * });
   * ```
   */
  async resize(id: number, params: ResizeVolumeParams): Promise<ResizeVolumeResponse> {
    const validatedParams = validate(resizeVolumeRequestSchema, params, {
      context: "Resize volume request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/volumes/${id}/actions/resize`,
      validatedParams,
    );

    return validate(resizeVolumeResponseSchema, response, {
      context: "Resize volume response",
      detailed: true,
    });
  }

  /**
   * Changes the Protection configuration of a Volume.
   *
   * @param id - ID of the Volume
   * @param params - Protection configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#volumes-change-volume-protection
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Enable delete protection
   * const result = await client.volumes.changeProtection(12345, {
   *   delete: true
   * });
   * ```
   */
  async changeProtection(
    id: number,
    params: ChangeVolumeProtectionParams,
  ): Promise<ChangeVolumeProtectionResponse> {
    const validatedParams = validate(changeVolumeProtectionRequestSchema, params, {
      context: "Change volume protection request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/volumes/${id}/actions/change_protection`,
      validatedParams,
    );

    return validate(changeVolumeProtectionResponseSchema, response, {
      context: "Change volume protection response",
      detailed: true,
    });
  }
}
