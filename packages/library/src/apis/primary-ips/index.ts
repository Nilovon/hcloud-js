/**
 * Hetzner Cloud Primary IPs API
 * @see https://docs.hetzner.cloud/reference/cloud#primary-ips
 */

import type { HCloudClient } from "@/client/index";
import type {
  ListPrimaryIPsParams,
  ListPrimaryIPsResponse,
  CreatePrimaryIPParams,
  CreatePrimaryIPResponse,
  GetPrimaryIPResponse,
  UpdatePrimaryIPParams,
  UpdatePrimaryIPResponse,
  DeletePrimaryIPResponse,
  ListPrimaryIPActionsParams,
  ListPrimaryIPActionsResponse,
  GetPrimaryIPActionResponse,
  AssignPrimaryIPToResourceParams,
  AssignPrimaryIPToResourceResponse,
  ChangePrimaryIPReverseDNSParams,
  ChangePrimaryIPReverseDNSResponse,
  ChangePrimaryIPProtectionParams,
  ChangePrimaryIPProtectionResponse,
  UnassignPrimaryIPResponse,
} from "@/apis/primary-ips/types";
import { validate } from "@/validation/index";
import {
  listPrimaryIPsResponseSchema,
  createPrimaryIPRequestSchema,
  createPrimaryIPResponseSchema,
  getPrimaryIPResponseSchema,
  updatePrimaryIPRequestSchema,
  updatePrimaryIPResponseSchema,
  deletePrimaryIPResponseSchema,
  listPrimaryIPActionsResponseSchema,
  getPrimaryIPActionResponseSchema,
  assignPrimaryIPToResourceRequestSchema,
  assignPrimaryIPToResourceResponseSchema,
  changePrimaryIPReverseDNSRequestSchema,
  changePrimaryIPReverseDNSResponseSchema,
  changePrimaryIPProtectionRequestSchema,
  changePrimaryIPProtectionResponseSchema,
  unassignPrimaryIPRequestSchema,
  unassignPrimaryIPResponseSchema,
} from "@/apis/primary-ips/schemas";

/**
 * Primary IPs API client
 */
export class PrimaryIPsClient {
  constructor(private readonly client: HCloudClient) {}

  /**
   * Returns all Primary IP objects.
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of primary IPs with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-list-primary-ips
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all primary IPs
   * const result = await client.primaryIPs.list();
   *
   * // List primary IPs with filters
   * const primaryIPs = await client.primaryIPs.list({
   *   name: 'my-primary-ip',
   *   label_selector: 'environment=production',
   *   ip: '1.2.3.4',
   *   sort: ['name:asc'],
   *   page: 1,
   *   per_page: 50
   * });
   * ```
   */
  async list(params?: ListPrimaryIPsParams): Promise<ListPrimaryIPsResponse> {
    const queryParams: Record<string, string | number | string[] | undefined> = {};

    if (params?.name) {
      queryParams.name = params.name;
    }

    if (params?.label_selector) {
      queryParams.label_selector = params.label_selector;
    }

    if (params?.ip) {
      queryParams.ip = params.ip;
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

    const response = await this.client.get<unknown>("/primary_ips", queryParams);

    return validate(listPrimaryIPsResponseSchema, response, {
      context: "List primary IPs response",
      detailed: true,
    });
  }

  /**
   * Creates a new Primary IP.
   *
   * @param params - Parameters for creating the primary IP
   * @returns Promise resolving to the created primary IP and action
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-create-a-primary-ip
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Create an IPv4 primary IP
   * const primaryIP = await client.primaryIPs.create({
   *   name: 'my-primary-ip',
   *   type: 'ipv4',
   *   datacenter: 'nbg1-dc3',
   *   assignee_type: 'server',
   *   auto_delete: true,
   *   labels: { environment: 'production' }
   * });
   * ```
   */
  async create(params: CreatePrimaryIPParams): Promise<CreatePrimaryIPResponse> {
    const validatedParams = validate(createPrimaryIPRequestSchema, params, {
      context: "Create primary IP request",
      detailed: true,
    });

    const response = await this.client.post<unknown>("/primary_ips", validatedParams);

    return validate(createPrimaryIPResponseSchema, response, {
      context: "Create primary IP response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Primary IP object.
   *
   * @param id - ID of the Primary IP
   * @returns Promise resolving to the primary IP
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-get-a-primary-ip
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get a primary IP by ID
   * const primaryIP = await client.primaryIPs.get(12345);
   * console.log(primaryIP.primary_ip.ip);
   * ```
   */
  async get(id: number): Promise<GetPrimaryIPResponse> {
    const response = await this.client.get<unknown>(`/primary_ips/${id}`);

    return validate(getPrimaryIPResponseSchema, response, {
      context: "Get primary IP response",
      detailed: true,
    });
  }

  /**
   * Updates the Primary IP.
   *
   * You can update a Primary IP's name, auto_delete and labels.
   *
   * @param id - ID of the Primary IP
   * @param params - Parameters to update (name, auto_delete, and/or labels)
   * @returns Promise resolving to the updated primary IP
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-update-a-primary-ip
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Update primary IP name
   * const updated = await client.primaryIPs.update(12345, {
   *   name: 'new-primary-ip-name'
   * });
   *
   * // Update labels
   * const updated = await client.primaryIPs.update(12345, {
   *   labels: { environment: 'production', team: 'backend' }
   * });
   * ```
   */
  async update(
    id: number,
    params: UpdatePrimaryIPParams,
  ): Promise<UpdatePrimaryIPResponse> {
    const validatedParams = validate(updatePrimaryIPRequestSchema, params, {
      context: "Update primary IP request",
      detailed: true,
    });

    const response = await this.client.put<unknown>(`/primary_ips/${id}`, validatedParams);

    return validate(updatePrimaryIPResponseSchema, response, {
      context: "Update primary IP response",
      detailed: true,
    });
  }

  /**
   * Deletes a Primary IP.
   *
   * @param id - ID of the Primary IP
   * @returns Promise resolving to the delete action
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-delete-a-primary-ip
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Delete a primary IP
   * const result = await client.primaryIPs.delete(12345);
   * if (result.action) {
   *   console.log(`Delete action ID: ${result.action.id}`);
   * }
   * ```
   */
  async delete(id: number): Promise<DeletePrimaryIPResponse> {
    const response = await this.client.delete<unknown>(`/primary_ips/${id}`);

    return validate(deletePrimaryIPResponseSchema, response, {
      context: "Delete primary IP response",
      detailed: true,
    });
  }

  /**
   * Returns all Action objects for a Primary IP.
   *
   * @param id - ID of the Primary IP
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of actions with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-list-actions-for-a-primary-ip
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all actions for a primary IP
   * const actions = await client.primaryIPs.listActions(12345);
   *
   * // List actions with filters
   * const runningActions = await client.primaryIPs.listActions(12345, {
   *   status: ['running'],
   *   sort: ['started:desc']
   * });
   * ```
   */
  async listActions(
    id: number,
    params?: ListPrimaryIPActionsParams,
  ): Promise<ListPrimaryIPActionsResponse> {
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

    const response = await this.client.get<unknown>(`/primary_ips/${id}/actions`, queryParams);

    return validate(listPrimaryIPActionsResponseSchema, response, {
      context: "List primary IP actions response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Action object for a Primary IP.
   *
   * @param id - ID of the Primary IP
   * @param actionId - ID of the Action
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-get-an-action-for-a-primary-ip
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get an action by ID
   * const action = await client.primaryIPs.getAction(12345, 67890);
   * console.log(action.action.command);
   * ```
   */
  async getAction(id: number, actionId: number): Promise<GetPrimaryIPActionResponse> {
    const response = await this.client.get<unknown>(`/primary_ips/${id}/actions/${actionId}`);

    return validate(getPrimaryIPActionResponseSchema, response, {
      context: "Get primary IP action response",
      detailed: true,
    });
  }

  /**
   * Assigns a Primary IP to a resource.
   *
   * @param id - ID of the Primary IP
   * @param params - Resource ID to assign the primary IP to
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-assign-a-primary-ip-to-a-resource
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Assign primary IP to a server
   * const result = await client.primaryIPs.assignToResource(12345, {
   *   assignee_id: 67890
   * });
   * console.log(`Action ID: ${result.action.id}`);
   * ```
   */
  async assignToResource(
    id: number,
    params: AssignPrimaryIPToResourceParams,
  ): Promise<AssignPrimaryIPToResourceResponse> {
    const validatedParams = validate(assignPrimaryIPToResourceRequestSchema, params, {
      context: "Assign primary IP to resource request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/primary_ips/${id}/actions/assign`,
      validatedParams,
    );

    return validate(assignPrimaryIPToResourceResponseSchema, response, {
      context: "Assign primary IP to resource response",
      detailed: true,
    });
  }

  /**
   * Changes the hostname that will appear when getting the hostname belonging to this Primary IP.
   *
   * @param id - ID of the Primary IP
   * @param params - Reverse DNS configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-change-reverse-dns-records-for-a-primary-ip
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Change reverse DNS
   * const result = await client.primaryIPs.changeReverseDNS(12345, {
   *   ip: '1.2.3.4',
   *   dns_ptr: 'server.example.com'
   * });
   * console.log(`Action ID: ${result.action.id}`);
   * ```
   */
  async changeReverseDNS(
    id: number,
    params: ChangePrimaryIPReverseDNSParams,
  ): Promise<ChangePrimaryIPReverseDNSResponse> {
    const validatedParams = validate(changePrimaryIPReverseDNSRequestSchema, params, {
      context: "Change primary IP reverse DNS request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/primary_ips/${id}/actions/change_dns_ptr`,
      validatedParams,
    );

    return validate(changePrimaryIPReverseDNSResponseSchema, response, {
      context: "Change primary IP reverse DNS response",
      detailed: true,
    });
  }

  /**
   * Changes the Protection configuration of a Primary IP.
   *
   * @param id - ID of the Primary IP
   * @param params - Protection configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-change-primary-ip-protection
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Enable delete protection
   * const result = await client.primaryIPs.changeProtection(12345, {
   *   delete: true
   * });
   * console.log(`Action ID: ${result.action.id}`);
   * ```
   */
  async changeProtection(
    id: number,
    params: ChangePrimaryIPProtectionParams,
  ): Promise<ChangePrimaryIPProtectionResponse> {
    const validatedParams = validate(changePrimaryIPProtectionRequestSchema, params, {
      context: "Change primary IP protection request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/primary_ips/${id}/actions/change_protection`,
      validatedParams,
    );

    return validate(changePrimaryIPProtectionResponseSchema, response, {
      context: "Change primary IP protection response",
      detailed: true,
    });
  }

  /**
   * Unassigns a Primary IP from a resource.
   *
   * @param id - ID of the Primary IP
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips-unassign-a-primary-ip-from-a-resource
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Unassign primary IP
   * const result = await client.primaryIPs.unassign(12345);
   * console.log(`Action ID: ${result.action.id}`);
   * ```
   */
  async unassign(id: number): Promise<UnassignPrimaryIPResponse> {
    const response = await this.client.post<unknown>(
      `/primary_ips/${id}/actions/unassign`,
      {},
    );

    return validate(unassignPrimaryIPResponseSchema, response, {
      context: "Unassign primary IP response",
      detailed: true,
    });
  }
}
