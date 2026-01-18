/**
 * Hetzner Cloud Floating IPs API
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips
 */

import type { HCloudClient } from "../../client/index";
import type {
  ListFloatingIPsParams,
  ListFloatingIPsResponse,
  CreateFloatingIPParams,
  CreateFloatingIPResponse,
  GetFloatingIPResponse,
  UpdateFloatingIPParams,
  UpdateFloatingIPResponse,
  DeleteFloatingIPResponse,
  ListFloatingIPActionsParams,
  ListFloatingIPActionsResponse,
  GetFloatingIPActionResponse,
  AssignFloatingIPToServerParams,
  AssignFloatingIPToServerResponse,
  ChangeFloatingIPReverseDNSParams,
  ChangeFloatingIPReverseDNSResponse,
  ChangeFloatingIPProtectionParams,
  ChangeFloatingIPProtectionResponse,
  UnassignFloatingIPResponse,
} from "../../apis/floating-ips/types";
import { validate } from "../../validation/index";
import {
  listFloatingIPsResponseSchema,
  createFloatingIPRequestSchema,
  createFloatingIPResponseSchema,
  getFloatingIPResponseSchema,
  updateFloatingIPRequestSchema,
  updateFloatingIPResponseSchema,
  deleteFloatingIPResponseSchema,
  listFloatingIPActionsResponseSchema,
  getFloatingIPActionResponseSchema,
  assignFloatingIPToServerRequestSchema,
  assignFloatingIPToServerResponseSchema,
  changeFloatingIPReverseDNSRequestSchema,
  changeFloatingIPReverseDNSResponseSchema,
  changeFloatingIPProtectionRequestSchema,
  changeFloatingIPProtectionResponseSchema,
  unassignFloatingIPRequestSchema,
  unassignFloatingIPResponseSchema,
} from "../../apis/floating-ips/schemas";

/**
 * Floating IPs API client
 */
export class FloatingIPsClient {
  constructor(private readonly client: HCloudClient) {}

  /**
   * Returns all Floating IP objects.
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of floating IPs with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-list-floating-ips
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all floating IPs
   * const result = await client.floatingIPs.list();
   *
   * // List floating IPs with filters
   * const floatingIPs = await client.floatingIPs.list({
   *   name: 'my-floating-ip',
   *   label_selector: 'environment=production',
   *   sort: ['name:asc'],
   *   page: 1,
   *   per_page: 50
   * });
   * ```
   */
  async list(params?: ListFloatingIPsParams): Promise<ListFloatingIPsResponse> {
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

    const response = await this.client.get<unknown>("/floating_ips", queryParams);

    return validate(listFloatingIPsResponseSchema, response, {
      context: "List floating IPs response",
      detailed: true,
    });
  }

  /**
   * Creates a new Floating IP.
   *
   * @param params - Parameters for creating the floating IP
   * @returns Promise resolving to the created floating IP and action
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-create-a-floating-ip
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Create an IPv4 floating IP in a location
   * const floatingIP = await client.floatingIPs.create({
   *   type: 'ipv4',
   *   location: 'nbg1',
   *   name: 'my-floating-ip'
   * });
   *
   * // Create an IPv4 floating IP and assign to a server
   * const floatingIP = await client.floatingIPs.create({
   *   type: 'ipv4',
   *   server: 12345,
   *   name: 'my-floating-ip'
   * });
   * ```
   */
  async create(params: CreateFloatingIPParams): Promise<CreateFloatingIPResponse> {
    const validatedParams = validate(createFloatingIPRequestSchema, params, {
      context: "Create floating IP request",
      detailed: true,
    });

    const response = await this.client.post<unknown>("/floating_ips", validatedParams);

    return validate(createFloatingIPResponseSchema, response, {
      context: "Create floating IP response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Floating IP object.
   *
   * @param id - ID of the Floating IP
   * @returns Promise resolving to the floating IP
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-get-a-floating-ip
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get a floating IP by ID
   * const floatingIP = await client.floatingIPs.get(12345);
   * console.log(floatingIP.floating_ip.ip);
   * ```
   */
  async get(id: number): Promise<GetFloatingIPResponse> {
    const response = await this.client.get<unknown>(`/floating_ips/${id}`);

    return validate(getFloatingIPResponseSchema, response, {
      context: "Get floating IP response",
      detailed: true,
    });
  }

  /**
   * Updates the Floating IP.
   *
   * You can update a Floating IP's name and labels.
   *
   * @param id - ID of the Floating IP
   * @param params - Parameters to update (name, description, and/or labels)
   * @returns Promise resolving to the updated floating IP
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-update-a-floating-ip
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Update floating IP name
   * const updated = await client.floatingIPs.update(12345, {
   *   name: 'new-floating-ip-name'
   * });
   *
   * // Update labels
   * const updated = await client.floatingIPs.update(12345, {
   *   labels: { environment: 'production', team: 'backend' }
   * });
   * ```
   */
  async update(
    id: number,
    params: UpdateFloatingIPParams,
  ): Promise<UpdateFloatingIPResponse> {
    const validatedParams = validate(updateFloatingIPRequestSchema, params, {
      context: "Update floating IP request",
      detailed: true,
    });

    const response = await this.client.put<unknown>(`/floating_ips/${id}`, validatedParams);

    return validate(updateFloatingIPResponseSchema, response, {
      context: "Update floating IP response",
      detailed: true,
    });
  }

  /**
   * Deletes a Floating IP.
   *
   * @param id - ID of the Floating IP
   * @returns Promise resolving to the delete action
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-delete-a-floating-ip
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Delete a floating IP
   * const result = await client.floatingIPs.delete(12345);
   * if (result.action) {
   *   console.log(`Delete action ID: ${result.action.id}`);
   * }
   * ```
   */
  async delete(id: number): Promise<DeleteFloatingIPResponse> {
    const response = await this.client.delete<unknown>(`/floating_ips/${id}`);

    return validate(deleteFloatingIPResponseSchema, response, {
      context: "Delete floating IP response",
      detailed: true,
    });
  }

  /**
   * Returns all Action objects for a Floating IP.
   *
   * @param id - ID of the Floating IP
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of actions with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-list-actions-for-a-floating-ip
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all actions for a floating IP
   * const actions = await client.floatingIPs.listActions(12345);
   *
   * // List actions with filters
   * const runningActions = await client.floatingIPs.listActions(12345, {
   *   status: ['running'],
   *   sort: ['started:desc']
   * });
   * ```
   */
  async listActions(
    id: number,
    params?: ListFloatingIPActionsParams,
  ): Promise<ListFloatingIPActionsResponse> {
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

    const response = await this.client.get<unknown>(`/floating_ips/${id}/actions`, queryParams);

    return validate(listFloatingIPActionsResponseSchema, response, {
      context: "List floating IP actions response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Action object for a Floating IP.
   *
   * @param id - ID of the Floating IP
   * @param actionId - ID of the Action
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-get-an-action-for-a-floating-ip
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get an action by ID
   * const action = await client.floatingIPs.getAction(12345, 67890);
   * console.log(action.action.command);
   * ```
   */
  async getAction(id: number, actionId: number): Promise<GetFloatingIPActionResponse> {
    const response = await this.client.get<unknown>(`/floating_ips/${id}/actions/${actionId}`);

    return validate(getFloatingIPActionResponseSchema, response, {
      context: "Get floating IP action response",
      detailed: true,
    });
  }

  /**
   * Assigns a Floating IP to a Server.
   *
   * @param id - ID of the Floating IP
   * @param params - Server ID to assign the floating IP to
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-assign-a-floating-ip-to-a-server
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Assign floating IP to a server
   * const result = await client.floatingIPs.assignToServer(12345, {
   *   assignee_id: 67890
   * });
   * console.log(`Action ID: ${result.action.id}`);
   * ```
   */
  async assignToServer(
    id: number,
    params: AssignFloatingIPToServerParams,
  ): Promise<AssignFloatingIPToServerResponse> {
    const validatedParams = validate(assignFloatingIPToServerRequestSchema, params, {
      context: "Assign floating IP to server request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/floating_ips/${id}/actions/assign`,
      validatedParams,
    );

    return validate(assignFloatingIPToServerResponseSchema, response, {
      context: "Assign floating IP to server response",
      detailed: true,
    });
  }

  /**
   * Changes the hostname that will appear when getting the hostname belonging to this Floating IP.
   *
   * @param id - ID of the Floating IP
   * @param params - Reverse DNS configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-change-reverse-dns-records-for-a-floating-ip
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Change reverse DNS
   * const result = await client.floatingIPs.changeReverseDNS(12345, {
   *   ip: '1.2.3.4',
   *   dns_ptr: 'server.example.com'
   * });
   * console.log(`Action ID: ${result.action.id}`);
   * ```
   */
  async changeReverseDNS(
    id: number,
    params: ChangeFloatingIPReverseDNSParams,
  ): Promise<ChangeFloatingIPReverseDNSResponse> {
    const validatedParams = validate(changeFloatingIPReverseDNSRequestSchema, params, {
      context: "Change floating IP reverse DNS request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/floating_ips/${id}/actions/change_dns_ptr`,
      validatedParams,
    );

    return validate(changeFloatingIPReverseDNSResponseSchema, response, {
      context: "Change floating IP reverse DNS response",
      detailed: true,
    });
  }

  /**
   * Changes the Protection configuration of a Floating IP.
   *
   * @param id - ID of the Floating IP
   * @param params - Protection configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-change-floating-ip-protection
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Enable delete protection
   * const result = await client.floatingIPs.changeProtection(12345, {
   *   delete: true
   * });
   * console.log(`Action ID: ${result.action.id}`);
   * ```
   */
  async changeProtection(
    id: number,
    params: ChangeFloatingIPProtectionParams,
  ): Promise<ChangeFloatingIPProtectionResponse> {
    const validatedParams = validate(changeFloatingIPProtectionRequestSchema, params, {
      context: "Change floating IP protection request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/floating_ips/${id}/actions/change_protection`,
      validatedParams,
    );

    return validate(changeFloatingIPProtectionResponseSchema, response, {
      context: "Change floating IP protection response",
      detailed: true,
    });
  }

  /**
   * Unassigns a Floating IP, resulting in it being unreachable.
   *
   * @param id - ID of the Floating IP
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips-unassign-a-floating-ip
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Unassign floating IP
   * const result = await client.floatingIPs.unassign(12345);
   * console.log(`Action ID: ${result.action.id}`);
   * ```
   */
  async unassign(id: number): Promise<UnassignFloatingIPResponse> {
    const response = await this.client.post<unknown>(
      `/floating_ips/${id}/actions/unassign`,
      {},
    );

    return validate(unassignFloatingIPResponseSchema, response, {
      context: "Unassign floating IP response",
      detailed: true,
    });
  }
}
