/**
 * Zod schemas for Hetzner Cloud DNS (Zones) API
 * @see https://docs.hetzner.cloud/reference/cloud#dns
 */

import { z } from "zod";
import { actionSchema, actionResourceSchema } from "../../apis/actions/schemas";
import { paginationMetaSchema } from "../../apis/common/schemas";

/**
 * Zone status schema
 */
export const zoneStatusSchema = z.enum(["verified", "pending", "unknown"]);

/**
 * Zone protection schema
 */
export const zoneProtectionSchema = z.object({
  delete: z.boolean(),
});

/**
 * Zone schema
 */
export const zoneSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    ttl: z.number(),
    nameservers: z.array(z.string()),
    status: zoneStatusSchema,
    created: z.string(),
    modified: z.string(),
    verified: z.string().nullable(),
    records_count: z.number(),
    is_secondary_dns: z.boolean(),
    txt_verification: z
      .object({
        name: z.string(),
        record: z.string(),
      })
      .nullable(),
    protected: z.boolean().optional(),
    labels: z.record(z.string(), z.string()),
    blocking: z.array(actionResourceSchema).optional(),
  })
  .passthrough();

/**
 * RRSet record schema
 */
export const rrsetRecordSchema = z.object({
  value: z.string(),
  comment: z.string().nullable(),
});

/**
 * RRSet protection schema
 */
export const rrsetProtectionSchema = z.object({
  delete: z.boolean(),
});

/**
 * RRSet schema
 */
export const rrsetSchema = z
  .object({
    type: z.string(),
    id: z.string(),
    name: z.string(),
    zone_id: z.string(),
    created: z.string(),
    modified: z.string(),
    ttl: z.number().nullable(),
    records: z.array(rrsetRecordSchema),
    protected: z.boolean().optional(),
    labels: z.record(z.string(), z.string()),
    blocking: z.array(actionResourceSchema).optional(),
  })
  .passthrough();

/**
 * List Zones response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-list-zones
 */
export const listZonesResponseSchema = z.object({
  zones: z.array(zoneSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Create Zone request schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-create-a-zone
 */
export const createZoneRequestSchema = z.object({
  name: z.string(),
  ttl: z.number().optional(),
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Create Zone response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-create-a-zone
 */
export const createZoneResponseSchema = z.object({
  zone: zoneSchema,
  action: actionSchema.optional(),
});

/**
 * Get Zone response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-get-a-zone
 */
export const getZoneResponseSchema = z.object({
  zone: zoneSchema,
});

/**
 * Update Zone request schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-update-a-zone
 */
export const updateZoneRequestSchema = z.object({
  ttl: z.number().optional(),
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Update Zone response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-update-a-zone
 */
export const updateZoneResponseSchema = z.object({
  zone: zoneSchema,
});

/**
 * Delete Zone response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-delete-a-zone
 */
export const deleteZoneResponseSchema = z.object({});

/**
 * Export Zone response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-export-a-zone-file
 */
export const exportZoneResponseSchema = z.object({
  zone_file: z.string(),
});

/**
 * List Zone Actions response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-list-actions-for-a-zone
 */
export const listZoneActionsResponseSchema = z.object({
  actions: z.array(actionSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Get Zone Action response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-get-an-action-for-a-zone
 */
export const getZoneActionResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Change Zone Primary Nameservers request schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-change-a-zones-primary-nameservers
 */
export const changeZonePrimaryNameserversRequestSchema = z.object({
  nameservers: z.array(z.string()),
});

/**
 * Change Zone Primary Nameservers response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-change-a-zones-primary-nameservers
 */
export const changeZonePrimaryNameserversResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Change Zone Protection request schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-change-a-zones-protection
 */
export const changeZoneProtectionRequestSchema = z.object({
  delete: z.boolean(),
});

/**
 * Change Zone Protection response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-change-a-zones-protection
 */
export const changeZoneProtectionResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Change Zone Default TTL request schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-change-a-zones-default-ttl
 */
export const changeZoneDefaultTTLRequestSchema = z.object({
  ttl: z.number(),
});

/**
 * Change Zone Default TTL response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-change-a-zones-default-ttl
 */
export const changeZoneDefaultTTLResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Import Zone file request schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-import-a-zone-file
 */
export const importZoneFileRequestSchema = z.object({
  zone_file: z.string(),
});

/**
 * Import Zone file response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-import-a-zone-file
 */
export const importZoneFileResponseSchema = z.object({
  zone: zoneSchema,
  action: actionSchema,
});

/**
 * List RRSets response schema
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-list-rrsets
 */
export const listRRSetsResponseSchema = z.object({
  rrsets: z.array(rrsetSchema),
  meta: z
    .object({
      pagination: paginationMetaSchema,
    })
    .optional(),
});

/**
 * Get RRSet response schema
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-get-an-rrset
 */
export const getRRSetResponseSchema = z.object({
  rrset: rrsetSchema,
});

/**
 * Create RRSet request schema
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-create-an-rrset
 */
export const createRRSetRequestSchema = z.object({
  name: z.string(),
  type: z.string(),
  ttl: z.number().optional(),
  records: z.array(
    z.object({
      value: z.string(),
      comment: z.string().nullable().optional(),
    }),
  ),
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Create RRSet response schema
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-create-an-rrset
 */
export const createRRSetResponseSchema = z.object({
  rrset: rrsetSchema,
  action: actionSchema.optional(),
});

/**
 * Update RRSet request schema
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-update-an-rrset
 */
export const updateRRSetRequestSchema = z.object({
  ttl: z.number().nullable().optional(),
  records: z
    .array(
      z.object({
        value: z.string(),
        comment: z.string().nullable().optional(),
      }),
    )
    .optional(),
  labels: z.record(z.string(), z.string()).optional(),
});

/**
 * Update RRSet response schema
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-update-an-rrset
 */
export const updateRRSetResponseSchema = z.object({
  rrset: rrsetSchema,
  action: actionSchema.optional(),
});

/**
 * Delete RRSet response schema
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-delete-an-rrset
 */
export const deleteRRSetResponseSchema = z.object({
  action: actionSchema.optional(),
});

/**
 * Change RRSet Protection request schema
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-change-an-rrsets-protection
 */
export const changeRRSetProtectionRequestSchema = z.object({
  delete: z.boolean(),
});

/**
 * Change RRSet Protection response schema
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-change-an-rrsets-protection
 */
export const changeRRSetProtectionResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Change RRSet TTL request schema
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-change-an-rrsets-ttl
 */
export const changeRRSetTTLRequestSchema = z.object({
  ttl: z.number().nullable(),
});

/**
 * Change RRSet TTL response schema
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-change-an-rrsets-ttl
 */
export const changeRRSetTTLResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Set RRSet Records request schema
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-set-records-of-an-rrset
 */
export const setRRSetRecordsRequestSchema = z.object({
  records: z.array(
    z.object({
      value: z.string(),
      comment: z.string().nullable().optional(),
    }),
  ),
  ttl: z.number().nullable().optional(),
});

/**
 * Set RRSet Records response schema
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-set-records-of-an-rrset
 */
export const setRRSetRecordsResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Add RRSet Records request schema
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-add-records-to-an-rrset
 */
export const addRRSetRecordsRequestSchema = z.object({
  records: z.array(
    z.object({
      value: z.string(),
      comment: z.string().nullable().optional(),
    }),
  ),
  ttl: z.number().nullable().optional(),
});

/**
 * Add RRSet Records response schema
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-add-records-to-an-rrset
 */
export const addRRSetRecordsResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Remove RRSet Records request schema
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-remove-records-from-an-rrset
 */
export const removeRRSetRecordsRequestSchema = z.object({
  records: z.array(
    z.object({
      value: z.string(),
      comment: z.string().nullable().optional(),
    }),
  ),
});

/**
 * Remove RRSet Records response schema
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-remove-records-from-an-rrset
 */
export const removeRRSetRecordsResponseSchema = z.object({
  action: actionSchema,
});

/**
 * Update RRSet Records request schema
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-update-records-of-an-rrset
 */
export const updateRRSetRecordsRequestSchema = z.object({
  records: z.array(
    z.object({
      value: z.string(),
      comment: z.string().nullable().optional(),
    }),
  ),
});

/**
 * Update RRSet Records response schema
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-update-records-of-an-rrset
 */
export const updateRRSetRecordsResponseSchema = z.object({
  action: actionSchema,
});
