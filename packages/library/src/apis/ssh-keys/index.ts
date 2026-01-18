/**
 * Hetzner Cloud SSH Keys API
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys
 */

import type { HCloudClient } from "../../client/index";
import type {
  ListSSHKeysParams,
  ListSSHKeysResponse,
  CreateSSHKeyParams,
  CreateSSHKeyResponse,
  GetSSHKeyResponse,
  UpdateSSHKeyParams,
  UpdateSSHKeyResponse,
  DeleteSSHKeyResponse,
} from "../../apis/ssh-keys/types";
import { validate } from "../../validation/index";
import {
  listSSHKeysResponseSchema,
  createSSHKeyRequestSchema,
  createSSHKeyResponseSchema,
  getSSHKeyResponseSchema,
  updateSSHKeyRequestSchema,
  updateSSHKeyResponseSchema,
  deleteSSHKeyResponseSchema,
} from "../../apis/ssh-keys/schemas";

/**
 * SSH Keys API client
 */
export class SSHKeysClient {
  constructor(private readonly client: HCloudClient) {}

  /**
   * Returns all SSH key objects.
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of SSH keys with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-list-ssh-keys
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all SSH keys
   * const result = await client.sshKeys.list();
   *
   * // List SSH keys with filters
   * const filtered = await client.sshKeys.list({
   *   label_selector: 'environment=production',
   *   sort: ['name:asc'],
   *   page: 1,
   *   per_page: 50
   * });
   * ```
   */
  async list(params?: ListSSHKeysParams): Promise<ListSSHKeysResponse> {
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

    if (params?.fingerprint) {
      queryParams.fingerprint = params.fingerprint;
    }

    if (params?.page !== undefined) {
      queryParams.page = params.page;
    }

    if (params?.per_page !== undefined) {
      queryParams.per_page = params.per_page;
    }

    const response = await this.client.get<unknown>("/ssh_keys", queryParams);

    return validate(listSSHKeysResponseSchema, response, {
      context: "List SSH keys response",
      detailed: true,
    });
  }

  /**
   * Creates a new SSH key.
   *
   * @param params - Parameters for creating the SSH key
   * @returns Promise resolving to the created SSH key
   * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-create-an-ssh-key
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.sshKeys.create({
   *   name: 'my-ssh-key',
   *   public_key: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAB...'
   * });
   * ```
   */
  async create(params: CreateSSHKeyParams): Promise<CreateSSHKeyResponse> {
    const validatedParams = validate(createSSHKeyRequestSchema, params, {
      context: "Create SSH key request",
      detailed: true,
    });

    const response = await this.client.post<unknown>("/ssh_keys", validatedParams);

    return validate(createSSHKeyResponseSchema, response, {
      context: "Create SSH key response",
      detailed: true,
    });
  }

  /**
   * Returns a specific SSH key object.
   *
   * @param id - ID of the SSH key
   * @returns Promise resolving to the SSH key
   * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-get-an-ssh-key
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const sshKey = await client.sshKeys.get(12345);
   * console.log(sshKey.ssh_key.name);
   * ```
   */
  async get(id: number): Promise<GetSSHKeyResponse> {
    const response = await this.client.get<unknown>(`/ssh_keys/${id}`);

    return validate(getSSHKeyResponseSchema, response, {
      context: "Get SSH key response",
      detailed: true,
    });
  }

  /**
   * Updates an SSH key.
   *
   * You can update an SSH key's name and labels.
   *
   * @param id - ID of the SSH key
   * @param params - Parameters to update (name and/or labels)
   * @returns Promise resolving to the updated SSH key
   * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-update-an-ssh-key
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const updated = await client.sshKeys.update(12345, {
   *   name: 'new-ssh-key-name',
   *   labels: { environment: 'production' }
   * });
   * ```
   */
  async update(id: number, params: UpdateSSHKeyParams): Promise<UpdateSSHKeyResponse> {
    const validatedParams = validate(updateSSHKeyRequestSchema, params, {
      context: "Update SSH key request",
      detailed: true,
    });

    const response = await this.client.put<unknown>(`/ssh_keys/${id}`, validatedParams);

    return validate(updateSSHKeyResponseSchema, response, {
      context: "Update SSH key response",
      detailed: true,
    });
  }

  /**
   * Deletes an SSH key.
   *
   * @param id - ID of the SSH key
   * @returns Promise resolving to the delete action
   * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-delete-an-ssh-key
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.sshKeys.delete(12345);
   * console.log(`Delete action ID: ${result.action.id}`);
   * ```
   */
  async delete(id: number): Promise<DeleteSSHKeyResponse> {
    const response = await this.client.delete<unknown>(`/ssh_keys/${id}`);

    return validate(deleteSSHKeyResponseSchema, response, {
      context: "Delete SSH key response",
      detailed: true,
    });
  }
}
