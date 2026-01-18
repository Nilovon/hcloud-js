/**
 * Hetzner Cloud Servers API
 * @see https://docs.hetzner.cloud/reference/cloud#servers
 */

import type { HCloudClient } from "../../client/index";
import type {
  ListServersParams,
  ListServersResponse,
  CreateServerParams,
  CreateServerResponse,
  GetServerResponse,
  UpdateServerParams,
  UpdateServerResponse,
  DeleteServerResponse,
  GetServerMetricsParams,
  GetServerMetricsResponse,
  ListServerActionsParams,
  ListServerActionsResponse,
  GetServerActionResponse,
  PowerOnServerResponse,
  PowerOffServerResponse,
  RebootServerResponse,
  ResetServerResponse,
  ShutdownServerResponse,
  AttachISOToServerParams,
  AttachISOToServerResponse,
  DetachISOFromServerResponse,
  EnableRescueModeParams,
  EnableRescueModeResponse,
  DisableRescueModeResponse,
  CreateImageFromServerParams,
  CreateImageFromServerResponse,
  RebuildServerFromImageParams,
  RebuildServerFromImageResponse,
  ChangeServerProtectionParams,
  ChangeServerProtectionResponse,
  ChangeServerTypeParams,
  ChangeServerTypeResponse,
  EnableBackupsParams,
  EnableBackupsResponse,
  DisableBackupsResponse,
  AttachServerToNetworkParams,
  AttachServerToNetworkResponse,
  DetachServerFromNetworkParams,
  DetachServerFromNetworkResponse,
  ChangeAliasIPsOfNetworkParams,
  ChangeAliasIPsOfNetworkResponse,
  ChangeServerReverseDNSParams,
  ChangeServerReverseDNSResponse,
  RequestConsoleForServerParams,
  RequestConsoleForServerResponse,
  ResetRootPasswordResponse,
  AddServerToPlacementGroupParams,
  AddServerToPlacementGroupResponse,
  RemoveServerFromPlacementGroupResponse,
} from "../../apis/servers/types";
import { validate } from "../../validation/index";
import {
  listServersResponseSchema,
  createServerRequestSchema,
  createServerResponseSchema,
  getServerResponseSchema,
  updateServerRequestSchema,
  updateServerResponseSchema,
  deleteServerResponseSchema,
  getServerMetricsResponseSchema,
  listServerActionsResponseSchema,
  getServerActionResponseSchema,
  powerOnServerResponseSchema,
  powerOffServerResponseSchema,
  rebootServerResponseSchema,
  resetServerResponseSchema,
  shutdownServerResponseSchema,
  attachISOToServerRequestSchema,
  attachISOToServerResponseSchema,
  detachISOFromServerResponseSchema,
  enableRescueModeRequestSchema,
  enableRescueModeResponseSchema,
  disableRescueModeResponseSchema,
  createImageFromServerRequestSchema,
  createImageFromServerResponseSchema,
  rebuildServerFromImageRequestSchema,
  rebuildServerFromImageResponseSchema,
  changeServerProtectionRequestSchema,
  changeServerProtectionResponseSchema,
  changeServerTypeRequestSchema,
  changeServerTypeResponseSchema,
  enableBackupsRequestSchema,
  enableBackupsResponseSchema,
  disableBackupsResponseSchema,
  attachServerToNetworkRequestSchema,
  attachServerToNetworkResponseSchema,
  detachServerFromNetworkRequestSchema,
  detachServerFromNetworkResponseSchema,
  changeAliasIPsOfNetworkRequestSchema,
  changeAliasIPsOfNetworkResponseSchema,
  changeServerReverseDNSRequestSchema,
  changeServerReverseDNSResponseSchema,
  requestConsoleForServerRequestSchema,
  requestConsoleForServerResponseSchema,
  resetRootPasswordResponseSchema,
  addServerToPlacementGroupRequestSchema,
  addServerToPlacementGroupResponseSchema,
  removeServerFromPlacementGroupRequestSchema,
  removeServerFromPlacementGroupResponseSchema,
} from "../../apis/servers/schemas";

/**
 * Servers API client
 */
export class ServersClient {
  constructor(private readonly client: HCloudClient) {}

  /**
   * Returns all Server objects.
   *
   * You can select specific Server types only and sort the results by using URI parameters.
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of servers with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#servers-list-servers
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all servers
   * const result = await client.servers.list();
   *
   * // List servers with filters
   * const runningServers = await client.servers.list({
   *   status: ['running'],
   *   label_selector: 'environment=production',
   *   sort: ['name:asc'],
   *   page: 1,
   *   per_page: 50
   * });
   * ```
   */
  async list(params?: ListServersParams): Promise<ListServersResponse> {
    // Build query parameters
    // Note: For array parameters (sort, status), we need to pass them as arrays
    // to the client, which will handle them correctly using URLSearchParams.append()
    const queryParams: Record<string, string | number | boolean | string[] | undefined> = {};

    if (params?.name) {
      queryParams.name = params.name;
    }

    if (params?.label_selector) {
      queryParams.label_selector = params.label_selector;
    }

    if (params?.sort) {
      // Convert single string to array for consistent handling
      queryParams.sort = Array.isArray(params.sort) ? params.sort : [params.sort];
    }

    if (params?.status) {
      // Convert single status to array for consistent handling
      queryParams.status = Array.isArray(params.status) ? params.status : [params.status];
    }

    if (params?.page !== undefined) {
      queryParams.page = params.page;
    }

    if (params?.per_page !== undefined) {
      queryParams.per_page = params.per_page;
    }

    const response = await this.client.get<unknown>("/servers", queryParams);

    // Validate response with Zod
    return validate(listServersResponseSchema, response, {
      context: "List servers response",
      detailed: true,
    });
  }

  /**
   * Creates a new Server.
   *
   * Returns the initial Action object for the server creation progress.
   *
   * @param params - Parameters for creating the server
   * @returns Promise resolving to the created server with action and root password
   * @see https://docs.hetzner.cloud/reference/cloud#servers-create-a-server
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Create a server with required fields
   * const result = await client.servers.create({
   *   name: 'my-server',
   *   server_type: 'cpx11',
   *   image: 'ubuntu-22.04'
   * });
   *
   * // Create a server with optional fields
   * const result = await client.servers.create({
   *   name: 'my-server',
   *   server_type: 'cpx11',
   *   image: 'ubuntu-22.04',
   *   location: 'nbg1',
   *   ssh_keys: ['my-ssh-key-id'],
   *   user_data: '#cloud-config\n...',
   *   labels: { project: 'production' }
   * });
   * ```
   */
  async create(params: CreateServerParams): Promise<CreateServerResponse> {
    // Validate request parameters
    const validatedParams = validate(createServerRequestSchema, params, {
      context: "Create server request",
      detailed: true,
    });

    // Make API request
    const response = await this.client.post<unknown>("/servers", validatedParams);

    // Validate response with Zod
    return validate(createServerResponseSchema, response, {
      context: "Create server response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Server object.
   *
   * @param id - ID of the Server
   * @returns Promise resolving to the server
   * @see https://docs.hetzner.cloud/reference/cloud#servers-get-a-server
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get a server by ID
   * const server = await client.servers.get(12345);
   * console.log(server.server.name);
   * ```
   */
  async get(id: number): Promise<GetServerResponse> {
    const response = await this.client.get<unknown>(`/servers/${id}`);

    // Validate response with Zod
    return validate(getServerResponseSchema, response, {
      context: "Get server response",
      detailed: true,
    });
  }

  /**
   * Updates a Server.
   *
   * You can update a Server's name and a Server's labels.
   *
   * @param id - ID of the Server
   * @param params - Parameters to update (name and/or labels)
   * @returns Promise resolving to the updated server
   * @see https://docs.hetzner.cloud/reference/cloud#servers-update-a-server
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Update server name
   * const updated = await client.servers.update(12345, {
   *   name: 'new-server-name'
   * });
   *
   * // Update labels
   * const updated = await client.servers.update(12345, {
   *   labels: { environment: 'production', team: 'backend' }
   * });
   * ```
   */
  async update(id: number, params: UpdateServerParams): Promise<UpdateServerResponse> {
    // Validate request parameters
    const validatedParams = validate(updateServerRequestSchema, params, {
      context: "Update server request",
      detailed: true,
    });

    // Make API request
    const response = await this.client.put<unknown>(`/servers/${id}`, validatedParams);

    // Validate response with Zod
    return validate(updateServerResponseSchema, response, {
      context: "Update server response",
      detailed: true,
    });
  }

  /**
   * Deletes a Server.
   *
   * This immediately removes the Server from your account, and it is no longer accessible.
   *
   * @param id - ID of the Server
   * @returns Promise resolving to the delete action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-delete-a-server
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Delete a server
   * const result = await client.servers.delete(12345);
   * console.log(`Delete action ID: ${result.action.id}`);
   * ```
   */
  async delete(id: number): Promise<DeleteServerResponse> {
    const response = await this.client.delete<unknown>(`/servers/${id}`);

    // Validate response with Zod
    return validate(deleteServerResponseSchema, response, {
      context: "Delete server response",
      detailed: true,
    });
  }

  /**
   * Get Metrics for a Server.
   *
   * Returns Metrics for a Server. The Server must have a public network interface attached.
   *
   * @param id - ID of the Server
   * @param params - Query parameters for metrics (type, start, end, step)
   * @returns Promise resolving to server metrics
   * @see https://docs.hetzner.cloud/reference/cloud#servers-get-metrics-for-a-server
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const now = new Date();
   * const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
   *
   * // Get CPU and network metrics
   * const metrics = await client.servers.getMetrics(12345, {
   *   type: ['cpu', 'network'],
   *   start: oneHourAgo.toISOString(),
   *   end: now.toISOString(),
   *   step: 60 // optional, resolution in seconds
   * });
   *
   * console.log(metrics.metrics.time_series);
   * ```
   */
  async getMetrics(id: number, params: GetServerMetricsParams): Promise<GetServerMetricsResponse> {
    // Build query parameters
    const queryParams: Record<string, string | number | undefined> = {};

    // Handle type parameter - can be single string or array
    const types = Array.isArray(params.type) ? params.type : [params.type];
    queryParams.type = types.join(",");

    queryParams.start = params.start;
    queryParams.end = params.end;

    if (params.step !== undefined) {
      queryParams.step = params.step;
    }

    const response = await this.client.get<unknown>(`/servers/${id}/metrics`, queryParams);

    // Validate response with Zod
    return validate(getServerMetricsResponseSchema, response, {
      context: "Get server metrics response",
      detailed: true,
    });
  }
}
