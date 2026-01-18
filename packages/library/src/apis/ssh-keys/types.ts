/**
 * Types for Hetzner Cloud SSH Keys API
 * Types are inferred from Zod schemas
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys
 */

// biome-ignore assist/source/organizeImports: we need to import the schemas first
import {
  listSSHKeysResponseSchema,
  createSSHKeyRequestSchema,
  createSSHKeyResponseSchema,
  getSSHKeyResponseSchema,
  updateSSHKeyRequestSchema,
  updateSSHKeyResponseSchema,
  deleteSSHKeyResponseSchema,
  sshKeySchema,
} from "@hcloud-js/apis/ssh-keys/schemas.js";
import type { z } from "zod";

/**
 * Hetzner Cloud SSH Key
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-list-ssh-keys
 */
export type SSHKey = z.infer<typeof sshKeySchema>;

/**
 * Pagination metadata
 * @see https://docs.hetzner.cloud/reference/cloud#pagination
 * Re-exported from servers module for consistency
 */
export type { PaginationMeta } from "@hcloud-js/apis/servers/types.js";

/**
 * List SSH Keys query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-list-ssh-keys
 */
export interface ListSSHKeysParams {
  /**
   * Can be used to filter SSH Keys by their name. The response will only contain the SSH Key matching the specified name.
   */
  name?: string;
  /**
   * Can be used to filter SSH Keys by labels. The response will only contain SSH Keys matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, name, name:asc, name:desc, created, created:asc, created:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
  /**
   * Can be used to filter SSH Keys by their fingerprint. The response will only contain the SSH Key matching the specified fingerprint.
   */
  fingerprint?: string;
  /**
   * Page number to return. For more information, see [Pagination](https://docs.hetzner.cloud/reference/cloud#pagination).
   */
  page?: number;
  /**
   * Maximum number of entries returned per page. For more information, see [Pagination](https://docs.hetzner.cloud/reference/cloud#pagination).
   */
  per_page?: number;
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
export type CreateSSHKeyParams = z.infer<typeof createSSHKeyRequestSchema>;

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
export type UpdateSSHKeyParams = z.infer<typeof updateSSHKeyRequestSchema>;

/**
 * Update SSH Key response
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-update-an-ssh-key
 */
export type UpdateSSHKeyResponse = z.infer<typeof updateSSHKeyResponseSchema>;

/**
 * Delete SSH Key response
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-delete-an-ssh-key
 */
export type DeleteSSHKeyResponse = z.infer<typeof deleteSSHKeyResponseSchema>;
