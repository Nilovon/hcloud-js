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
} from "./types.js";
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
} from "./schemas";

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

  /**
   * Returns all Action objects for a Server.
   *
   * @param id - ID of the Server
   * @param params - Optional query parameters for filtering and pagination
   * @returns Promise resolving to list of actions with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#servers-list-actions-for-a-server
   *
   * @example
   * ```typescript
   * const actions = await client.servers.listActions(12345, {
   *   status: ['running'],
   *   sort: ['started:desc']
   * });
   * ```
   */
  async listActions(id: number, params?: ListServerActionsParams): Promise<ListServerActionsResponse> {
    const queryParams: Record<string, string | number | string[] | undefined> = {};

    if (params?.status) {
      queryParams.status = Array.isArray(params.status) ? params.status : [params.status];
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

    const response = await this.client.get<unknown>(`/servers/${id}/actions`, queryParams);

    return validate(listServerActionsResponseSchema, response, {
      context: "List server actions response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Action object for a Server.
   *
   * @param id - ID of the Server
   * @param actionId - ID of the Action
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-get-an-action-for-a-server
   *
   * @example
   * ```typescript
   * const action = await client.servers.getAction(12345, 67890);
   * console.log(action.action.command);
   * ```
   */
  async getAction(id: number, actionId: number): Promise<GetServerActionResponse> {
    const response = await this.client.get<unknown>(`/servers/${id}/actions/${actionId}`);

    return validate(getServerActionResponseSchema, response, {
      context: "Get server action response",
      detailed: true,
    });
  }

  /**
   * Starts a Server by turning its power on.
   *
   * @param id - ID of the Server
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-power-on-a-server
   */
  async powerOn(id: number): Promise<PowerOnServerResponse> {
    const response = await this.client.post<unknown>(`/servers/${id}/actions/poweron`, {});

    return validate(powerOnServerResponseSchema, response, {
      context: "Power on server response",
      detailed: true,
    });
  }

  /**
   * Cuts power to a Server. This forcefully stops it without giving the Server operating system time to gracefully stop.
   *
   * @param id - ID of the Server
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-power-off-a-server
   */
  async powerOff(id: number): Promise<PowerOffServerResponse> {
    const response = await this.client.post<unknown>(`/servers/${id}/actions/poweroff`, {});

    return validate(powerOffServerResponseSchema, response, {
      context: "Power off server response",
      detailed: true,
    });
  }

  /**
   * Reboots a Server gracefully by sending an ACPI request.
   *
   * @param id - ID of the Server
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-soft-reboot-a-server
   */
  async reboot(id: number): Promise<RebootServerResponse> {
    const response = await this.client.post<unknown>(`/servers/${id}/actions/reboot`, {});

    return validate(rebootServerResponseSchema, response, {
      context: "Reboot server response",
      detailed: true,
    });
  }

  /**
   * Cuts power to a Server and starts it again.
   *
   * @param id - ID of the Server
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-reset-a-server
   */
  async reset(id: number): Promise<ResetServerResponse> {
    const response = await this.client.post<unknown>(`/servers/${id}/actions/reset`, {});

    return validate(resetServerResponseSchema, response, {
      context: "Reset server response",
      detailed: true,
    });
  }

  /**
   * Shuts down a Server gracefully by sending an ACPI shutdown request.
   *
   * @param id - ID of the Server
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-shutdown-a-server
   */
  async shutdown(id: number): Promise<ShutdownServerResponse> {
    const response = await this.client.post<unknown>(`/servers/${id}/actions/shutdown`, {});

    return validate(shutdownServerResponseSchema, response, {
      context: "Shutdown server response",
      detailed: true,
    });
  }

  /**
   * Attaches an ISO to a Server.
   *
   * @param id - ID of the Server
   * @param params - Parameters for attaching ISO
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-attach-an-iso-to-a-server
   */
  async attachISO(id: number, params: AttachISOToServerParams): Promise<AttachISOToServerResponse> {
    const validatedParams = validate(attachISOToServerRequestSchema, params, {
      context: "Attach ISO to server request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(`/servers/${id}/actions/attach_iso`, validatedParams);

    return validate(attachISOToServerResponseSchema, response, {
      context: "Attach ISO to server response",
      detailed: true,
    });
  }

  /**
   * Detaches an ISO from a Server.
   *
   * @param id - ID of the Server
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-detach-an-iso-from-a-server
   */
  async detachISO(id: number): Promise<DetachISOFromServerResponse> {
    const response = await this.client.post<unknown>(`/servers/${id}/actions/detach_iso`, {});

    return validate(detachISOFromServerResponseSchema, response, {
      context: "Detach ISO from server response",
      detailed: true,
    });
  }

  /**
   * Enables the Hetzner Rescue System for a Server.
   *
   * @param id - ID of the Server
   * @param params - Parameters for rescue mode
   * @returns Promise resolving to the action with root password
   * @see https://docs.hetzner.cloud/reference/cloud#servers-enable-rescue-mode-for-a-server
   */
  async enableRescueMode(id: number, params: EnableRescueModeParams): Promise<EnableRescueModeResponse> {
    const validatedParams = validate(enableRescueModeRequestSchema, params, {
      context: "Enable rescue mode request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(`/servers/${id}/actions/enable_rescue`, validatedParams);

    return validate(enableRescueModeResponseSchema, response, {
      context: "Enable rescue mode response",
      detailed: true,
    });
  }

  /**
   * Disables the Hetzner Rescue System for a Server.
   *
   * @param id - ID of the Server
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-disable-rescue-mode-for-a-server
   */
  async disableRescueMode(id: number): Promise<DisableRescueModeResponse> {
    const response = await this.client.post<unknown>(`/servers/${id}/actions/disable_rescue`, {});

    return validate(disableRescueModeResponseSchema, response, {
      context: "Disable rescue mode response",
      detailed: true,
    });
  }

  /**
   * Creates an Image (snapshot) from a Server.
   *
   * @param id - ID of the Server
   * @param params - Parameters for creating image
   * @returns Promise resolving to the action and image
   * @see https://docs.hetzner.cloud/reference/cloud#servers-create-image-from-a-server
   */
  async createImage(id: number, params: CreateImageFromServerParams): Promise<CreateImageFromServerResponse> {
    const validatedParams = validate(createImageFromServerRequestSchema, params, {
      context: "Create image from server request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(`/servers/${id}/actions/create_image`, validatedParams);

    return validate(createImageFromServerResponseSchema, response, {
      context: "Create image from server response",
      detailed: true,
    });
  }

  /**
   * Rebuilds a Server overwriting its disk with the content of an Image.
   *
   * @param id - ID of the Server
   * @param params - Parameters for rebuilding
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-rebuild-a-server-from-an-image
   */
  async rebuild(id: number, params: RebuildServerFromImageParams): Promise<RebuildServerFromImageResponse> {
    const validatedParams = validate(rebuildServerFromImageRequestSchema, params, {
      context: "Rebuild server from image request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(`/servers/${id}/actions/rebuild`, validatedParams);

    return validate(rebuildServerFromImageResponseSchema, response, {
      context: "Rebuild server from image response",
      detailed: true,
    });
  }

  /**
   * Changes the Protection configuration of a Server.
   *
   * @param id - ID of the Server
   * @param params - Protection configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-change-server-protection
   */
  async changeProtection(id: number, params: ChangeServerProtectionParams): Promise<ChangeServerProtectionResponse> {
    const validatedParams = validate(changeServerProtectionRequestSchema, params, {
      context: "Change server protection request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(`/servers/${id}/actions/change_protection`, validatedParams);

    return validate(changeServerProtectionResponseSchema, response, {
      context: "Change server protection response",
      detailed: true,
    });
  }

  /**
   * Changes the type (Cores, RAM and Disk) of a Server.
   *
   * @param id - ID of the Server
   * @param params - Parameters for changing type
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-change-the-type-of-a-server
   */
  async changeType(id: number, params: ChangeServerTypeParams): Promise<ChangeServerTypeResponse> {
    const validatedParams = validate(changeServerTypeRequestSchema, params, {
      context: "Change server type request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(`/servers/${id}/actions/change_type`, validatedParams);

    return validate(changeServerTypeResponseSchema, response, {
      context: "Change server type response",
      detailed: true,
    });
  }

  /**
   * Enables and configures automatic Backups for a Server.
   *
   * @param id - ID of the Server
   * @param params - Parameters for enabling backups
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-enable-and-configure-backups-for-a-server
   */
  async enableBackups(id: number, params: EnableBackupsParams): Promise<EnableBackupsResponse> {
    const validatedParams = validate(enableBackupsRequestSchema, params, {
      context: "Enable backups request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(`/servers/${id}/actions/enable_backup`, validatedParams);

    return validate(enableBackupsResponseSchema, response, {
      context: "Enable backups response",
      detailed: true,
    });
  }

  /**
   * Disables automatic Backups for a Server.
   *
   * @param id - ID of the Server
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-disable-backups-for-a-server
   */
  async disableBackups(id: number): Promise<DisableBackupsResponse> {
    const response = await this.client.post<unknown>(`/servers/${id}/actions/disable_backup`, {});

    return validate(disableBackupsResponseSchema, response, {
      context: "Disable backups response",
      detailed: true,
    });
  }

  /**
   * Attaches a Server to a Network.
   *
   * @param id - ID of the Server
   * @param params - Parameters for attaching to network
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-attach-a-server-to-a-network
   */
  async attachToNetwork(id: number, params: AttachServerToNetworkParams): Promise<AttachServerToNetworkResponse> {
    const validatedParams = validate(attachServerToNetworkRequestSchema, params, {
      context: "Attach server to network request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(`/servers/${id}/actions/attach_to_network`, validatedParams);

    return validate(attachServerToNetworkResponseSchema, response, {
      context: "Attach server to network response",
      detailed: true,
    });
  }

  /**
   * Detaches a Server from a Network.
   *
   * @param id - ID of the Server
   * @param params - Parameters for detaching from network
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-detach-a-server-from-a-network
   */
  async detachFromNetwork(id: number, params: DetachServerFromNetworkParams): Promise<DetachServerFromNetworkResponse> {
    const validatedParams = validate(detachServerFromNetworkRequestSchema, params, {
      context: "Detach server from network request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(`/servers/${id}/actions/detach_from_network`, validatedParams);

    return validate(detachServerFromNetworkResponseSchema, response, {
      context: "Detach server from network response",
      detailed: true,
    });
  }

  /**
   * Changes the alias IPs of a Network the Server is attached to.
   *
   * @param id - ID of the Server
   * @param params - Parameters for changing alias IPs
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-change-alias-ips-of-a-network
   */
  async changeAliasIPs(id: number, params: ChangeAliasIPsOfNetworkParams): Promise<ChangeAliasIPsOfNetworkResponse> {
    const validatedParams = validate(changeAliasIPsOfNetworkRequestSchema, params, {
      context: "Change alias IPs of network request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(`/servers/${id}/actions/change_alias_ips`, validatedParams);

    return validate(changeAliasIPsOfNetworkResponseSchema, response, {
      context: "Change alias IPs of network response",
      detailed: true,
    });
  }

  /**
   * Changes the hostname that will appear when getting the hostname belonging to the primary IPs (IPv4 and IPv6) of this Server.
   *
   * @param id - ID of the Server
   * @param params - Parameters for changing reverse DNS
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-change-reverse-dns-entry-for-this-server
   */
  async changeReverseDNS(id: number, params: ChangeServerReverseDNSParams): Promise<ChangeServerReverseDNSResponse> {
    const validatedParams = validate(changeServerReverseDNSRequestSchema, params, {
      context: "Change server reverse DNS request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(`/servers/${id}/actions/change_dns_ptr`, validatedParams);

    return validate(changeServerReverseDNSResponseSchema, response, {
      context: "Change server reverse DNS response",
      detailed: true,
    });
  }

  /**
   * Requests credentials for remote access via VNC over websocket to keyboard, monitor, and mouse for a Server.
   *
   * @param id - ID of the Server
   * @param params - Parameters for requesting console
   * @returns Promise resolving to the action with console credentials
   * @see https://docs.hetzner.cloud/reference/cloud#servers-request-console-for-a-server
   */
  async requestConsole(id: number, params: RequestConsoleForServerParams): Promise<RequestConsoleForServerResponse> {
    const validatedParams = validate(requestConsoleForServerRequestSchema, params, {
      context: "Request console for server request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(`/servers/${id}/actions/request_console`, validatedParams);

    return validate(requestConsoleForServerResponseSchema, response, {
      context: "Request console for server response",
      detailed: true,
    });
  }

  /**
   * Resets the root password. Only works for Linux systems that are running the qemu guest agent. Server must be powered on.
   *
   * @param id - ID of the Server
   * @returns Promise resolving to the action with new root password
   * @see https://docs.hetzner.cloud/reference/cloud#servers-reset-root-password-of-a-server
   */
  async resetRootPassword(id: number): Promise<ResetRootPasswordResponse> {
    const response = await this.client.post<unknown>(`/servers/${id}/actions/reset_password`, {});

    return validate(resetRootPasswordResponseSchema, response, {
      context: "Reset root password response",
      detailed: true,
    });
  }

  /**
   * Adds a Server to a Placement Group.
   *
   * @param id - ID of the Server
   * @param params - Parameters for adding to placement group
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-add-a-server-to-a-placement-group
   */
  async addToPlacementGroup(id: number, params: AddServerToPlacementGroupParams): Promise<AddServerToPlacementGroupResponse> {
    const validatedParams = validate(addServerToPlacementGroupRequestSchema, params, {
      context: "Add server to placement group request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(`/servers/${id}/actions/add_to_placement_group`, validatedParams);

    return validate(addServerToPlacementGroupResponseSchema, response, {
      context: "Add server to placement group response",
      detailed: true,
    });
  }

  /**
   * Removes a Server from a Placement Group.
   *
   * @param id - ID of the Server
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#servers-remove-from-placement-group
   */
  async removeFromPlacementGroup(id: number): Promise<RemoveServerFromPlacementGroupResponse> {
    const response = await this.client.post<unknown>(`/servers/${id}/actions/remove_from_placement_group`, {});

    return validate(removeServerFromPlacementGroupResponseSchema, response, {
      context: "Remove server from placement group response",
      detailed: true,
    });
  }
}
