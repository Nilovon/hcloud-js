/**
 * Types for Hetzner Cloud SSH Keys API
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys
 */

import type { z } from "zod";
import type { OneOrMany, PageParams, SortParam } from "../common/types";
import type {
  createSSHKeyRequestSchema,
  createSSHKeyResponseSchema,
  getSSHKeyResponseSchema,
  listSSHKeysResponseSchema,
  sshKeySchema,
  updateSSHKeyRequestSchema,
  updateSSHKeyResponseSchema,
} from "./schemas";

/**
 * Hetzner Cloud SSH Key
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys
 */
export type SSHKey = z.infer<typeof sshKeySchema>;

/**
 * Fields SSH keys can be sorted by
 */
export type SSHKeySort = SortParam<"id" | "name">;

/**
 * List SSH Keys query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-list-ssh-keys
 */
export interface ListSSHKeysParams extends PageParams {
  /**
   * Only return the SSH key with this exact name.
   */
  name?: string;
  /**
   * Only return SSH keys matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
  /**
   * Only return the SSH key with this fingerprint.
   */
  fingerprint?: string;
  /**
   * Sort the result.
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: OneOrMany<SSHKeySort>;
}

/**
 * List SSH Keys response
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-list-ssh-keys
 */
export type ListSSHKeysResponse = z.infer<typeof listSSHKeysResponseSchema>;

/**
 * Create SSH Key request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-create-an-ssh-key
 */
export type CreateSSHKeyParams = z.input<typeof createSSHKeyRequestSchema>;

/**
 * Create SSH Key response
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-create-an-ssh-key
 */
export type CreateSSHKeyResponse = z.infer<typeof createSSHKeyResponseSchema>;

/**
 * Get SSH Key response
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-get-an-ssh-key
 */
export type GetSSHKeyResponse = z.infer<typeof getSSHKeyResponseSchema>;

/**
 * Update SSH Key request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-update-an-ssh-key
 */
export type UpdateSSHKeyParams = z.input<typeof updateSSHKeyRequestSchema>;

/**
 * Update SSH Key response
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-update-an-ssh-key
 */
export type UpdateSSHKeyResponse = z.infer<typeof updateSSHKeyResponseSchema>;
