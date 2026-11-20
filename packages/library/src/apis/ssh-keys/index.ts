/**
 * Hetzner Cloud SSH Keys API
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys
 */

import { NamedResource, path } from "../../core/resource";
import type { RequestOptions } from "../../core/types";
import {
  createSSHKeyRequestSchema,
  createSSHKeyResponseSchema,
  getSSHKeyResponseSchema,
  listSSHKeysResponseSchema,
  updateSSHKeyRequestSchema,
  updateSSHKeyResponseSchema,
} from "./schemas";
import type {
  CreateSSHKeyParams,
  CreateSSHKeyResponse,
  GetSSHKeyResponse,
  ListSSHKeysParams,
  ListSSHKeysResponse,
  SSHKey,
  UpdateSSHKeyParams,
  UpdateSSHKeyResponse,
} from "./types";

/**
 * SSH Keys API client
 *
 * SSH keys are public keys you can inject into servers when creating them.
 *
 * In addition to the methods below, the pagination helpers `iterate()`,
 * `iteratePages()`, `listAll()` and `first()` as well as `getByName()` are
 * available.
 *
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys
 */
export class SSHKeysClient extends NamedResource<SSHKey, ListSSHKeysParams, "ssh_keys"> {
  protected readonly itemsKey = "ssh_keys";

  /**
   * Returns a page of SSH keys.
   *
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-list-ssh-keys
   *
   * @example
   * ```typescript
   * const { ssh_keys } = await client.sshKeys.list({
   *   label_selector: "environment=production",
   *   sort: "name:asc",
   * });
   *
   * // All SSH keys across all pages
   * const all = await client.sshKeys.listAll();
   * ```
   */
  list(params?: ListSSHKeysParams, options?: RequestOptions): Promise<ListSSHKeysResponse> {
    return this._get("/ssh_keys", listSSHKeysResponseSchema, params, options);
  }

  /**
   * Returns a specific SSH key.
   *
   * @param id - ID of the SSH key
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-get-an-ssh-key
   *
   * @example
   * ```typescript
   * const { ssh_key } = await client.sshKeys.get(12345);
   * console.log(ssh_key.fingerprint);
   * ```
   */
  get(id: number, options?: RequestOptions): Promise<GetSSHKeyResponse> {
    return this._get(path`/ssh_keys/${id}`, getSSHKeyResponseSchema, undefined, options);
  }

  /**
   * Finds an SSH key by its fingerprint.
   *
   * @param fingerprint - Fingerprint of the SSH key
   * @param options - Request options
   * @returns The SSH key, or `undefined` if none matches
   *
   * @example
   * ```typescript
   * const key = await client.sshKeys.getByFingerprint("b7:2f:30:a0:2f:6c:58:6c:21:04:58:61:ba:06:3b:2f");
   * ```
   */
  async getByFingerprint(
    fingerprint: string,
    options?: RequestOptions,
  ): Promise<SSHKey | undefined> {
    const { ssh_keys } = await this.list({ fingerprint }, options);
    return ssh_keys.find((key) => key.fingerprint === fingerprint);
  }

  /**
   * Creates a new SSH key.
   *
   * @param params - Name, public key and optional labels
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-create-an-ssh-key
   *
   * @example
   * ```typescript
   * const { ssh_key } = await client.sshKeys.create({
   *   name: "my-ssh-key",
   *   public_key: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA...",
   * });
   * ```
   */
  create(params: CreateSSHKeyParams, options?: RequestOptions): Promise<CreateSSHKeyResponse> {
    return this._post(
      "/ssh_keys",
      createSSHKeyResponseSchema,
      params,
      createSSHKeyRequestSchema,
      options,
    );
  }

  /**
   * Updates the name and/or labels of an SSH key.
   *
   * @param id - ID of the SSH key
   * @param params - Fields to update
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-update-an-ssh-key
   *
   * @example
   * ```typescript
   * const { ssh_key } = await client.sshKeys.update(12345, {
   *   name: "new-name",
   *   labels: { environment: "production" },
   * });
   * ```
   */
  update(
    id: number,
    params: UpdateSSHKeyParams,
    options?: RequestOptions,
  ): Promise<UpdateSSHKeyResponse> {
    return this._put(
      path`/ssh_keys/${id}`,
      updateSSHKeyResponseSchema,
      params,
      updateSSHKeyRequestSchema,
      options,
    );
  }

  /**
   * Deletes an SSH key. It cannot be used anymore.
   *
   * @param id - ID of the SSH key
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-delete-an-ssh-key
   *
   * @example
   * ```typescript
   * await client.sshKeys.delete(12345);
   * ```
   */
  delete(id: number, options?: RequestOptions): Promise<void> {
    return this._delete(path`/ssh_keys/${id}`, null, options);
  }
}
