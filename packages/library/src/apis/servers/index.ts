/**
 * Hetzner Cloud Servers API
 * @see https://docs.hetzner.cloud/reference/cloud#servers
 */

import type { z } from "zod";
import { ErrorCode, HCloudError } from "../../core/errors";
import { sleep } from "../../core/http";
import { NamedResource, path } from "../../core/resource";
import type { RequestOptions } from "../../core/types";
import { ResourceActionsClient } from "../actions/index";
import {
  actionResponseSchema,
  getActionResponseSchema,
  listActionsResponseSchema,
} from "../actions/schemas";
import type { WaitForActionOptions } from "../actions/types";
import type { OneOrMany } from "../common/types";
import {
  addServerToPlacementGroupRequestSchema,
  attachISOToServerRequestSchema,
  attachServerToNetworkRequestSchema,
  changeAliasIPsOfNetworkRequestSchema,
  changeServerProtectionRequestSchema,
  changeServerReverseDNSRequestSchema,
  changeServerTypeRequestSchema,
  createImageFromServerRequestSchema,
  createImageFromServerResponseSchema,
  createServerRequestSchema,
  createServerResponseSchema,
  detachServerFromNetworkRequestSchema,
  enableRescueModeRequestSchema,
  enableRescueModeResponseSchema,
  getServerMetricsResponseSchema,
  getServerResponseSchema,
  listServersResponseSchema,
  rebuildServerFromImageRequestSchema,
  rebuildServerFromImageResponseSchema,
  requestConsoleForServerResponseSchema,
  resetRootPasswordResponseSchema,
  updateServerRequestSchema,
  updateServerResponseSchema,
} from "./schemas";
import type {
  AddServerToPlacementGroupParams,
  AddServerToPlacementGroupResponse,
  AttachISOToServerParams,
  AttachISOToServerResponse,
  AttachServerToNetworkParams,
  AttachServerToNetworkResponse,
  ChangeAliasIPsOfNetworkParams,
  ChangeAliasIPsOfNetworkResponse,
  ChangeServerProtectionParams,
  ChangeServerProtectionResponse,
  ChangeServerReverseDNSParams,
  ChangeServerReverseDNSResponse,
  ChangeServerTypeParams,
  ChangeServerTypeResponse,
  CreateImageFromServerParams,
  CreateImageFromServerResponse,
  CreateServerParams,
  CreateServerResponse,
  DeleteServerResponse,
  DetachISOFromServerResponse,
  DetachServerFromNetworkParams,
  DetachServerFromNetworkResponse,
  DisableBackupsResponse,
  DisableRescueModeResponse,
  EnableBackupsResponse,
  EnableRescueModeParams,
  EnableRescueModeResponse,
  GetServerActionResponse,
  GetServerMetricsParams,
  GetServerMetricsResponse,
  GetServerResponse,
  ListServerActionsParams,
  ListServerActionsResponse,
  ListServersParams,
  ListServersResponse,
  PowerOffServerResponse,
  PowerOnServerResponse,
  RebootServerResponse,
  RebuildServerFromImageParams,
  RebuildServerFromImageResponse,
  RemoveServerFromPlacementGroupResponse,
  RequestConsoleForServerResponse,
  ResetRootPasswordResponse,
  ResetServerResponse,
  Server,
  ServerStatus,
  ShutdownServerResponse,
  UpdateServerParams,
  UpdateServerResponse,
  WaitForServerStatusOptions,
} from "./types";

/**
 * Servers API client
 *
 * Servers are virtual machines that can be provisioned.
 *
 * In addition to the methods below, the pagination helpers `iterate()`,
 * `iteratePages()`, `listAll()` and `first()` as well as `getByName()` are
 * available.
 *
 * @see https://docs.hetzner.cloud/reference/cloud#servers
 */
export class ServersClient extends NamedResource<Server, ListServersParams, "servers"> {
  protected readonly itemsKey = "servers";

  /**
   * Actions of all servers: `list()`, `get()`, `waitFor()` and `waitForAll()`.
   *
   * @example
   * ```typescript
   * const { actions } = await client.servers.actions.list({ status: "running" });
   * ```
   */
  public readonly actions = new ResourceActionsClient(this.client, "/servers");

  /**
   * Returns a page of servers.
   *
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-list-servers
   *
   * @example
   * ```typescript
   * const { servers } = await client.servers.list({
   *   status: ["running", "off"],
   *   label_selector: "environment=production",
   *   sort: "name:asc",
   * });
   *
   * // All servers across all pages
   * const all = await client.servers.listAll();
   * ```
   */
  list(params?: ListServersParams, options?: RequestOptions): Promise<ListServersResponse> {
    return this._get("/servers", listServersResponseSchema, params, options);
  }

  /**
   * Returns a specific server.
   *
   * @param id - ID of the server
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-get-a-server
   *
   * @example
   * ```typescript
   * const { server } = await client.servers.get(12345);
   * console.log(server.status, server.public_net.ipv4?.ip, server.location.name);
   * ```
   */
  get(id: number, options?: RequestOptions): Promise<GetServerResponse> {
    return this._get(path`/servers/${id}`, getServerResponseSchema, undefined, options);
  }

  /**
   * Creates a new server.
   *
   * The server is not ready when this call returns. Wait for `action` and
   * `next_actions` with `client.actions.waitForAll()`, or use
   * {@link ServersClient.createAndWait}.
   *
   * @param params - Name, server type, image and further options
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-create-a-server
   *
   * @example
   * ```typescript
   * const { server, action, next_actions, root_password } = await client.servers.create({
   *   name: "my-server",
   *   server_type: "cx22",
   *   image: "ubuntu-24.04",
   *   location: "nbg1",
   *   ssh_keys: ["my-ssh-key"],
   *   labels: { environment: "production" },
   * });
   * ```
   */
  create(params: CreateServerParams, options?: RequestOptions): Promise<CreateServerResponse> {
    return this._post(
      "/servers",
      createServerResponseSchema,
      params,
      createServerRequestSchema,
      options,
    );
  }

  /**
   * Creates a new server and waits until it is ready.
   *
   * Waits for the create action and all follow-up actions (e.g. starting the
   * server), then fetches the server again.
   *
   * @param params - Name, server type, image and further options
   * @param waitOptions - Polling options for waiting on the actions
   * @param options - Request options for the create and get requests
   * @returns The create response with the up-to-date server and the finished actions
   * @throws {HCloudActionError} If an action failed (unless `throwOnError` is `false`)
   * @throws {HCloudActionTimeoutError} If the actions did not finish in time
   *
   * @example
   * ```typescript
   * const { server, root_password } = await client.servers.createAndWait({
   *   name: "my-server",
   *   server_type: "cx22",
   *   image: "ubuntu-24.04",
   * });
   * console.log(server.status); // "running"
   * ```
   */
  async createAndWait(
    params: CreateServerParams,
    waitOptions?: WaitForActionOptions,
    options?: RequestOptions,
  ): Promise<CreateServerResponse> {
    const requestOptions =
      waitOptions?.signal && !options?.signal
        ? { ...options, signal: waitOptions.signal }
        : options;

    const created = await this.create(params, requestOptions);
    const finished = await this.actions.waitForAll(created, waitOptions);
    const { server } = await this.get(created.server.id, requestOptions);

    const [action = created.action, ...next_actions] = finished;
    return { ...created, server, action, next_actions };
  }

  /**
   * Updates the name and/or labels of a server.
   *
   * @param id - ID of the server
   * @param params - Fields to update
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-update-a-server
   *
   * @example
   * ```typescript
   * const { server } = await client.servers.update(12345, {
   *   name: "new-name",
   *   labels: { environment: "production" },
   * });
   * ```
   */
  update(
    id: number,
    params: UpdateServerParams,
    options?: RequestOptions,
  ): Promise<UpdateServerResponse> {
    return this._put(
      path`/servers/${id}`,
      updateServerResponseSchema,
      params,
      updateServerRequestSchema,
      options,
    );
  }

  /**
   * Deletes a server. This immediately removes the server from your account.
   *
   * @param id - ID of the server
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-delete-a-server
   *
   * @example
   * ```typescript
   * const { action } = await client.servers.delete(12345);
   * await client.actions.waitFor(action);
   * ```
   */
  delete(id: number, options?: RequestOptions): Promise<DeleteServerResponse> {
    return this._delete(path`/servers/${id}`, actionResponseSchema, options);
  }

  /**
   * Waits until a server has reached one of the given statuses.
   *
   * Useful after actions that finish before the server changed its status,
   * e.g. `shutdown()`, whose action only covers sending the shutdown request.
   *
   * @param id - ID of the server
   * @param status - Status (or statuses) to wait for
   * @param options - Polling options
   * @returns The server once it has one of the statuses
   * @throws {HCloudError} With code `WAIT_TIMEOUT` if the status was not reached in time
   *
   * @example
   * ```typescript
   * await client.servers.shutdown(12345);
   * const server = await client.servers.waitForStatus(12345, "off", { timeout: 60_000 });
   * ```
   */
  async waitForStatus(
    id: number,
    status: OneOrMany<ServerStatus>,
    options: WaitForServerStatusOptions = {},
  ): Promise<Server> {
    const { pollInterval = 1000, timeout = 300_000, signal } = options;
    const wanted: readonly ServerStatus[] = typeof status === "string" ? [status] : status;
    const startedAt = Date.now();

    while (true) {
      const { server } = await this.get(id, { signal });
      if (wanted.includes(server.status)) return server;

      const remaining = timeout - (Date.now() - startedAt);
      if (remaining <= 0) {
        throw new HCloudError(
          `Server ${id} did not reach status ${wanted.join(" or ")} within ${timeout}ms ` +
            `(last status: ${server.status})`,
          ErrorCode.WaitTimeout,
          0,
        );
      }
      await sleep(Math.min(pollInterval, remaining), signal);
    }
  }

  /**
   * Returns metrics of a server.
   *
   * @param id - ID of the server
   * @param params - Metric types, period and resolution. `start` and `end` accept a `Date` or an ISO 8601 string.
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-get-metrics-for-a-server
   *
   * @example
   * ```typescript
   * const { metrics } = await client.servers.getMetrics(12345, {
   *   type: ["cpu", "network"],
   *   start: new Date(Date.now() - 60 * 60 * 1000),
   *   end: new Date(),
   *   step: 60,
   * });
   * console.log(metrics.time_series.cpu?.values);
   * ```
   */
  getMetrics(
    id: number,
    params: GetServerMetricsParams,
    options?: RequestOptions,
  ): Promise<GetServerMetricsResponse> {
    const query = {
      type: typeof params.type === "string" ? params.type : params.type.join(","),
      start: params.start instanceof Date ? params.start.toISOString() : params.start,
      end: params.end instanceof Date ? params.end.toISOString() : params.end,
      step: params.step,
    };
    return this._get(path`/servers/${id}/metrics`, getServerMetricsResponseSchema, query, options);
  }

  /**
   * Returns a page of actions of a server.
   *
   * @param id - ID of the server
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-list-actions-for-a-server
   *
   * @example
   * ```typescript
   * const { actions } = await client.servers.listActions(12345, {
   *   status: "running",
   *   sort: "started:desc",
   * });
   * ```
   */
  listActions(
    id: number,
    params?: ListServerActionsParams,
    options?: RequestOptions,
  ): Promise<ListServerActionsResponse> {
    return this._get(path`/servers/${id}/actions`, listActionsResponseSchema, params, options);
  }

  /**
   * Returns a specific action of a server.
   *
   * @param id - ID of the server
   * @param actionId - ID of the action
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-get-an-action-for-a-server
   *
   * @example
   * ```typescript
   * const { action } = await client.servers.getAction(12345, 67890);
   * console.log(action.status, action.progress);
   * ```
   */
  getAction(
    id: number,
    actionId: number,
    options?: RequestOptions,
  ): Promise<GetServerActionResponse> {
    return this._get(
      path`/servers/${id}/actions/${actionId}`,
      getActionResponseSchema,
      undefined,
      options,
    );
  }

  /**
   * Starts a server by turning its power on.
   *
   * @param id - ID of the server
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-power-on-a-server
   *
   * @example
   * ```typescript
   * const { action } = await client.servers.powerOn(12345);
   * await client.actions.waitFor(action);
   * ```
   */
  powerOn(id: number, options?: RequestOptions): Promise<PowerOnServerResponse> {
    return this._action(id, "poweron", options);
  }

  /**
   * Cuts power to a server. This forcefully stops it without giving the
   * operating system time to shut down gracefully and may lead to data loss.
   *
   * @param id - ID of the server
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-power-off-a-server
   *
   * @example
   * ```typescript
   * const { action } = await client.servers.powerOff(12345);
   * ```
   */
  powerOff(id: number, options?: RequestOptions): Promise<PowerOffServerResponse> {
    return this._action(id, "poweroff", options);
  }

  /**
   * Reboots a server gracefully by sending an ACPI request.
   *
   * @param id - ID of the server
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-soft-reboot-a-server
   *
   * @example
   * ```typescript
   * const { action } = await client.servers.reboot(12345);
   * ```
   */
  reboot(id: number, options?: RequestOptions): Promise<RebootServerResponse> {
    return this._action(id, "reboot", options);
  }

  /**
   * Cuts power to a server and starts it again (hard reset).
   *
   * @param id - ID of the server
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-reset-a-server
   *
   * @example
   * ```typescript
   * const { action } = await client.servers.reset(12345);
   * ```
   */
  reset(id: number, options?: RequestOptions): Promise<ResetServerResponse> {
    return this._action(id, "reset", options);
  }

  /**
   * Shuts down a server gracefully by sending an ACPI shutdown request.
   *
   * The action finishes once the request was sent, not once the server is off.
   * Use {@link ServersClient.waitForStatus} to wait for the server to stop.
   *
   * @param id - ID of the server
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-shutdown-a-server
   *
   * @example
   * ```typescript
   * await client.servers.shutdown(12345);
   * await client.servers.waitForStatus(12345, "off");
   * ```
   */
  shutdown(id: number, options?: RequestOptions): Promise<ShutdownServerResponse> {
    return this._action(id, "shutdown", options);
  }

  /**
   * Resets the root password. Only works for Linux systems running the qemu
   * guest agent. The server must be powered on.
   *
   * @param id - ID of the server
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-reset-root-password-of-a-server
   *
   * @example
   * ```typescript
   * const { action, root_password } = await client.servers.resetRootPassword(12345);
   * ```
   */
  resetRootPassword(id: number, options?: RequestOptions): Promise<ResetRootPasswordResponse> {
    return this._post(
      path`/servers/${id}/actions/reset_password`,
      resetRootPasswordResponseSchema,
      undefined,
      undefined,
      options,
    );
  }

  /**
   * Attaches an ISO to a server. The server boots from it on the next reboot.
   *
   * @param id - ID of the server
   * @param params - ID or name of the ISO
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-attach-an-iso-to-a-server
   *
   * @example
   * ```typescript
   * const { action } = await client.servers.attachISO(12345, {
   *   iso: "FreeBSD-11.0-RELEASE-amd64-dvd1",
   * });
   * ```
   */
  attachISO(
    id: number,
    params: AttachISOToServerParams,
    options?: RequestOptions,
  ): Promise<AttachISOToServerResponse> {
    return this._action(id, "attach_iso", options, params, attachISOToServerRequestSchema);
  }

  /**
   * Detaches the ISO from a server.
   *
   * @param id - ID of the server
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-detach-an-iso-from-a-server
   *
   * @example
   * ```typescript
   * const { action } = await client.servers.detachISO(12345);
   * ```
   */
  detachISO(id: number, options?: RequestOptions): Promise<DetachISOFromServerResponse> {
    return this._action(id, "detach_iso", options);
  }

  /**
   * Enables the Hetzner Rescue System for a server. The server boots into the
   * rescue system on the next reboot.
   *
   * @param id - ID of the server
   * @param params - Rescue system type and SSH keys to inject
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-enable-rescue-mode-for-a-server
   *
   * @example
   * ```typescript
   * const { action, root_password } = await client.servers.enableRescueMode(12345, {
   *   type: "linux64",
   *   ssh_keys: [2323],
   * });
   * ```
   */
  enableRescueMode(
    id: number,
    params: EnableRescueModeParams = {},
    options?: RequestOptions,
  ): Promise<EnableRescueModeResponse> {
    return this._post(
      path`/servers/${id}/actions/enable_rescue`,
      enableRescueModeResponseSchema,
      params,
      enableRescueModeRequestSchema,
      options,
    );
  }

  /**
   * Disables the Hetzner Rescue System for a server.
   *
   * @param id - ID of the server
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-disable-rescue-mode-for-a-server
   *
   * @example
   * ```typescript
   * const { action } = await client.servers.disableRescueMode(12345);
   * ```
   */
  disableRescueMode(id: number, options?: RequestOptions): Promise<DisableRescueModeResponse> {
    return this._action(id, "disable_rescue", options);
  }

  /**
   * Creates an image (snapshot or backup) from a server.
   *
   * @param id - ID of the server
   * @param params - Image type, description and labels
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-create-image-from-a-server
   *
   * @example
   * ```typescript
   * const { action, image } = await client.servers.createImage(12345, {
   *   type: "snapshot",
   *   description: "before-upgrade",
   * });
   * await client.actions.waitFor(action);
   * ```
   */
  createImage(
    id: number,
    params: CreateImageFromServerParams = {},
    options?: RequestOptions,
  ): Promise<CreateImageFromServerResponse> {
    return this._post(
      path`/servers/${id}/actions/create_image`,
      createImageFromServerResponseSchema,
      params,
      createImageFromServerRequestSchema,
      options,
    );
  }

  /**
   * Rebuilds a server, overwriting its disk with the content of an image.
   * All data on the disk is lost.
   *
   * @param id - ID of the server
   * @param params - Image to rebuild from and optional user data
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-rebuild-a-server-from-an-image
   *
   * @example
   * ```typescript
   * const { action, root_password } = await client.servers.rebuild(12345, {
   *   image: "ubuntu-24.04",
   * });
   * ```
   */
  rebuild(
    id: number,
    params: RebuildServerFromImageParams,
    options?: RequestOptions,
  ): Promise<RebuildServerFromImageResponse> {
    return this._post(
      path`/servers/${id}/actions/rebuild`,
      rebuildServerFromImageResponseSchema,
      params,
      rebuildServerFromImageRequestSchema,
      options,
    );
  }

  /**
   * Changes the protection configuration of a server.
   *
   * @param id - ID of the server
   * @param params - Protection settings
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-change-server-protection
   *
   * @example
   * ```typescript
   * const { action } = await client.servers.changeProtection(12345, {
   *   delete: true,
   *   rebuild: true,
   * });
   * ```
   */
  changeProtection(
    id: number,
    params: ChangeServerProtectionParams,
    options?: RequestOptions,
  ): Promise<ChangeServerProtectionResponse> {
    return this._action(
      id,
      "change_protection",
      options,
      params,
      changeServerProtectionRequestSchema,
    );
  }

  /**
   * Changes the type (cores, RAM and disk size) of a server. The server must
   * be powered off.
   *
   * @param id - ID of the server
   * @param params - New server type and whether to upgrade the disk
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-change-the-type-of-a-server
   *
   * @example
   * ```typescript
   * const { action } = await client.servers.changeType(12345, {
   *   server_type: "cx32",
   *   upgrade_disk: false,
   * });
   * ```
   */
  changeType(
    id: number,
    params: ChangeServerTypeParams,
    options?: RequestOptions,
  ): Promise<ChangeServerTypeResponse> {
    return this._action(id, "change_type", options, params, changeServerTypeRequestSchema);
  }

  /**
   * Enables automatic backups for a server. The backup window is chosen by
   * Hetzner and reported in the `backup_window` field of the server.
   *
   * @param id - ID of the server
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-enable-and-configure-backups-for-a-server
   *
   * @example
   * ```typescript
   * const { action } = await client.servers.enableBackups(12345);
   * ```
   */
  enableBackups(id: number, options?: RequestOptions): Promise<EnableBackupsResponse> {
    return this._action(id, "enable_backup", options);
  }

  /**
   * Disables automatic backups for a server. All existing backups of the
   * server are deleted.
   *
   * @param id - ID of the server
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-disable-backups-for-a-server
   *
   * @example
   * ```typescript
   * const { action } = await client.servers.disableBackups(12345);
   * ```
   */
  disableBackups(id: number, options?: RequestOptions): Promise<DisableBackupsResponse> {
    return this._action(id, "disable_backup", options);
  }

  /**
   * Attaches a server to a network.
   *
   * @param id - ID of the server
   * @param params - Network and optional IP configuration
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-attach-a-server-to-a-network
   *
   * @example
   * ```typescript
   * const { action } = await client.servers.attachToNetwork(12345, {
   *   network: 4711,
   *   ip: "10.0.1.1",
   * });
   * ```
   */
  attachToNetwork(
    id: number,
    params: AttachServerToNetworkParams,
    options?: RequestOptions,
  ): Promise<AttachServerToNetworkResponse> {
    return this._action(
      id,
      "attach_to_network",
      options,
      params,
      attachServerToNetworkRequestSchema,
    );
  }

  /**
   * Detaches a server from a network.
   *
   * @param id - ID of the server
   * @param params - Network to detach from
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-detach-a-server-from-a-network
   *
   * @example
   * ```typescript
   * const { action } = await client.servers.detachFromNetwork(12345, { network: 4711 });
   * ```
   */
  detachFromNetwork(
    id: number,
    params: DetachServerFromNetworkParams,
    options?: RequestOptions,
  ): Promise<DetachServerFromNetworkResponse> {
    return this._action(
      id,
      "detach_from_network",
      options,
      params,
      detachServerFromNetworkRequestSchema,
    );
  }

  /**
   * Changes the alias IPs of a server in a network it is attached to.
   *
   * @param id - ID of the server
   * @param params - Network and the new alias IPs
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-change-alias-ips-of-a-network
   *
   * @example
   * ```typescript
   * const { action } = await client.servers.changeAliasIPs(12345, {
   *   network: 4711,
   *   alias_ips: ["10.0.1.2", "10.0.1.3"],
   * });
   * ```
   */
  changeAliasIPs(
    id: number,
    params: ChangeAliasIPsOfNetworkParams,
    options?: RequestOptions,
  ): Promise<ChangeAliasIPsOfNetworkResponse> {
    return this._action(
      id,
      "change_alias_ips",
      options,
      params,
      changeAliasIPsOfNetworkRequestSchema,
    );
  }

  /**
   * Changes the reverse DNS entry of a primary IP of a server.
   *
   * @param id - ID of the server
   * @param params - IP address and hostname. A `dns_ptr` of `null` resets the entry.
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-change-reverse-dns-entry-for-this-server
   *
   * @example
   * ```typescript
   * const { action } = await client.servers.changeReverseDNS(12345, {
   *   ip: "1.2.3.4",
   *   dns_ptr: "server01.example.com",
   * });
   * ```
   */
  changeReverseDNS(
    id: number,
    params: ChangeServerReverseDNSParams,
    options?: RequestOptions,
  ): Promise<ChangeServerReverseDNSResponse> {
    return this._action(id, "change_dns_ptr", options, params, changeServerReverseDNSRequestSchema);
  }

  /**
   * Requests credentials for remote access to a server via VNC over websocket.
   *
   * @param id - ID of the server
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-request-console-for-a-server
   *
   * @example
   * ```typescript
   * const { wss_url, password } = await client.servers.requestConsole(12345);
   * ```
   */
  requestConsole(id: number, options?: RequestOptions): Promise<RequestConsoleForServerResponse> {
    return this._post(
      path`/servers/${id}/actions/request_console`,
      requestConsoleForServerResponseSchema,
      undefined,
      undefined,
      options,
    );
  }

  /**
   * Adds a server to a placement group. The server must be powered off.
   *
   * @param id - ID of the server
   * @param params - Placement group to add the server to
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-add-a-server-to-a-placement-group
   *
   * @example
   * ```typescript
   * const { action } = await client.servers.addToPlacementGroup(12345, { placement_group: 897 });
   * ```
   */
  addToPlacementGroup(
    id: number,
    params: AddServerToPlacementGroupParams,
    options?: RequestOptions,
  ): Promise<AddServerToPlacementGroupResponse> {
    return this._action(
      id,
      "add_to_placement_group",
      options,
      params,
      addServerToPlacementGroupRequestSchema,
    );
  }

  /**
   * Removes a server from its placement group.
   *
   * @param id - ID of the server
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#servers-remove-from-placement-group
   *
   * @example
   * ```typescript
   * const { action } = await client.servers.removeFromPlacementGroup(12345);
   * ```
   */
  removeFromPlacementGroup(
    id: number,
    options?: RequestOptions,
  ): Promise<RemoveServerFromPlacementGroupResponse> {
    return this._action(id, "remove_from_placement_group", options);
  }

  /**
   * Trigger a server action answering with `{ action }`.
   */
  private _action(
    id: number,
    command: string,
    options?: RequestOptions,
    body?: unknown,
    bodySchema?: z.ZodType,
  ) {
    return this._post(
      path`/servers/${id}/actions/${command}`,
      actionResponseSchema,
      body,
      bodySchema,
      options,
    );
  }
}
