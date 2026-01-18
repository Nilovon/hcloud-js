/**
 * Zod schemas for Hetzner Cloud SSH Keys API
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys
 */

import { z } from "zod";
import { actionSchema } from "../../apis/actions/schemas";
import { paginationMetaSchema } from "../../apis/common/schemas";

/**
 * SSH Key schema
 */
export const sshKeySchema = z
  .object({
    id: z.number(),
    name: z.string(),
    fingerprint: z.string(),
    public_key: z.string(),
    labels: z.record(z.string(), z.string()),
    created: z.string(),
  })
  .passthrough();

/**
 * List SSH Keys response schema
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-list-ssh-keys
 */
export const listSSHKeysResponseSchema = z.object({
  ssh_keys: z.array(sshKeySchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Create SSH Key request schema
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-create-an-ssh-key
 */
export const createSSHKeyRequestSchema = z.object({
  name: z.string().min(1),
  public_key: z.string().min(1),
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Create SSH Key response schema
 */
export const createSSHKeyResponseSchema = z.object({
  ssh_key: sshKeySchema,
});

/**
 * Get SSH Key response schema
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-get-an-ssh-key
 */
export const getSSHKeyResponseSchema = z.object({
  ssh_key: sshKeySchema,
});

/**
 * Update SSH Key request schema
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-update-an-ssh-key
 */
export const updateSSHKeyRequestSchema = z.object({
  name: z.string().min(1).optional(),
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Update SSH Key response schema
 */
export const updateSSHKeyResponseSchema = z.object({
  ssh_key: sshKeySchema,
});

/**
 * Delete SSH Key response schema
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys-delete-an-ssh-key
 */
export const deleteSSHKeyResponseSchema = z.object({
  action: actionSchema,
});
