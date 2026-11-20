/**
 * Zod schemas for Hetzner Cloud DNS (Zones) API
 * @see https://docs.hetzner.cloud/reference/cloud#zones
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets
 */

import { z } from "zod";
import { actionSchema } from "../actions/schemas";
import { labelsSchema, metaSchema } from "../common/schemas";

/**
 * Zone mode schema
 *
 * - `primary`: RRSets are managed via the API or the Console
 * - `secondary`: Hetzner's nameservers fetch the RRSets from the primary nameservers via AXFR
 */
export const zoneModeSchema = z.enum(["primary", "secondary"]);

/**
 * Zone status schema
 *
 * - `ok`: the zone is published to the authoritative nameservers
 * - `updating`: the zone is currently being published
 * - `error`: the zone could not be published
 */
export const zoneStatusSchema = z.enum(["ok", "updating", "error"]);

/**
 * Zone registrar schema
 */
export const zoneRegistrarSchema = z.enum(["hetzner", "other", "unknown"]);

/**
 * Zone protection schema
 */
export const zoneProtectionSchema = z.object({
  delete: z.boolean(),
});

/**
 * TSIG algorithm of a primary nameserver
 */
export const zoneTSIGAlgorithmSchema = z.enum(["hmac-md5", "hmac-sha1", "hmac-sha256"]);

/**
 * Primary nameserver of a zone in secondary mode
 */
export const zonePrimaryNameserverSchema = z.object({
  address: z.string(),
  port: z.number().optional(),
  tsig_algorithm: zoneTSIGAlgorithmSchema.nullable().optional(),
  tsig_key: z.string().nullable().optional(),
});

/**
 * Delegation status of the authoritative nameservers of a zone
 */
export const zoneDelegationStatusSchema = z.enum([
  "valid",
  "partially-valid",
  "invalid",
  "lame",
  "unregistered",
  "unknown",
]);

/**
 * Authoritative nameservers of a zone
 */
export const zoneAuthoritativeNameserversSchema = z.object({
  assigned: z.array(z.string()),
  delegated: z.array(z.string()),
  delegation_last_check: z.string().nullable(),
  delegation_status: zoneDelegationStatusSchema,
});

/**
 * Zone schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones
 */
export const zoneSchema = z.object({
  id: z.number(),
  name: z.string(),
  created: z.string(),
  mode: zoneModeSchema,
  ttl: z.number(),
  labels: labelsSchema,
  protection: zoneProtectionSchema,
  status: zoneStatusSchema,
  record_count: z.number(),
  registrar: zoneRegistrarSchema,
  primary_nameservers: z.array(zonePrimaryNameserverSchema).nullable().optional(),
  authoritative_nameservers: zoneAuthoritativeNameserversSchema,
});

/**
 * RRSet types known to this SDK version
 */
export const rrsetKnownTypeSchema = z.enum([
  "A",
  "AAAA",
  "CAA",
  "CNAME",
  "DS",
  "HINFO",
  "HTTPS",
  "MX",
  "NS",
  "PTR",
  "RP",
  "SOA",
  "SRV",
  "SVCB",
  "TLSA",
  "TXT",
]);

/**
 * RRSet type schema
 *
 * Accepts the well-known types as well as any other non-empty string, so types
 * added to the API later can be used without an SDK update.
 */
export const rrsetTypeSchema = z.custom<z.infer<typeof rrsetKnownTypeSchema> | (string & {})>(
  (value) => typeof value === "string" && value.length > 0,
  'Invalid input: expected an RRSet type such as "A"',
);

/**
 * RRSet protection schema
 */
export const rrsetProtectionSchema = z.object({
  change: z.boolean(),
});

/**
 * RRSet record schema
 */
export const rrsetRecordSchema = z.object({
  value: z.string(),
  comment: z.string().nullable().optional(),
});

/**
 * RRSet (resource record set) schema
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets
 */
export const rrsetSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: rrsetTypeSchema,
  ttl: z.number().nullable(),
  labels: labelsSchema,
  protection: rrsetProtectionSchema,
  records: z.array(rrsetRecordSchema),
  zone: z.number(),
});

/**
 * Primary nameserver as sent in requests
 */
export const zonePrimaryNameserverInputSchema = z.object({
  address: z.string().min(1),
  port: z.number().int().optional(),
  tsig_algorithm: zoneTSIGAlgorithmSchema.optional(),
  tsig_key: z.string().optional(),
});

/**
 * RRSet record as sent in requests
 */
export const rrsetRecordInputSchema = z.object({
  value: z.string().min(1),
  comment: z.string().optional(),
});

/**
 * RRSet as sent when creating a zone
 */
export const createZoneRRSetInputSchema = z.object({
  name: z.string().min(1),
  type: rrsetTypeSchema,
  ttl: z.number().int().nullable().optional(),
  labels: labelsSchema.optional(),
  records: z.array(rrsetRecordInputSchema).optional(),
});

/**
 * List Zones response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-list-zones
 */
export const listZonesResponseSchema = z.object({
  zones: z.array(zoneSchema),
  meta: metaSchema.optional(),
});

/**
 * Create Zone request schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-create-a-zone
 */
export const createZoneRequestSchema = z.object({
  name: z.string().min(1),
  mode: zoneModeSchema,
  ttl: z.number().int().optional(),
  labels: labelsSchema.optional(),
  primary_nameservers: z.array(zonePrimaryNameserverInputSchema).optional(),
  rrsets: z.array(createZoneRRSetInputSchema).optional(),
  zonefile: z.string().optional(),
});

/**
 * Create Zone response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-create-a-zone
 */
export const createZoneResponseSchema = z.object({
  zone: zoneSchema,
  action: actionSchema,
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
  labels: labelsSchema.optional(),
});

/**
 * Update Zone response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-update-a-zone
 */
export const updateZoneResponseSchema = z.object({
  zone: zoneSchema,
});

/**
 * Export Zone file response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zones-export-a-zone-file
 */
export const exportZoneResponseSchema = z.object({
  zonefile: z.string(),
});

/**
 * Import Zone file request schema
 * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-import-a-zone-file
 */
export const importZoneFileRequestSchema = z.object({
  zonefile: z.string().min(1),
});

/**
 * Change Zone Protection request schema
 * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-change-a-zones-protection
 */
export const changeZoneProtectionRequestSchema = z.object({
  delete: z.boolean().optional(),
});

/**
 * Change Zone Default TTL request schema
 * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-change-a-zones-default-ttl
 */
export const changeZoneDefaultTTLRequestSchema = z.object({
  ttl: z.number().int(),
});

/**
 * Change Zone Primary Nameservers request schema
 * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-change-a-zones-primary-nameservers
 */
export const changeZonePrimaryNameserversRequestSchema = z.object({
  primary_nameservers: z.array(zonePrimaryNameserverInputSchema),
});

/**
 * List RRSets response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets-list-rrsets
 */
export const listRRSetsResponseSchema = z.object({
  rrsets: z.array(rrsetSchema),
  meta: metaSchema.optional(),
});

/**
 * Get RRSet response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets-get-an-rrset
 */
export const getRRSetResponseSchema = z.object({
  rrset: rrsetSchema,
});

/**
 * Create RRSet request schema
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets-create-an-rrset
 */
export const createRRSetRequestSchema = z.object({
  name: z.string().min(1),
  type: rrsetTypeSchema,
  ttl: z.number().int().nullable().optional(),
  labels: labelsSchema.optional(),
  records: z.array(rrsetRecordInputSchema).optional(),
});

/**
 * Create RRSet response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets-create-an-rrset
 */
export const createRRSetResponseSchema = z.object({
  rrset: rrsetSchema,
  action: actionSchema,
});

/**
 * Update RRSet request schema
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets-update-an-rrset
 */
export const updateRRSetRequestSchema = z.object({
  labels: labelsSchema.optional(),
});

/**
 * Update RRSet response schema
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets-update-an-rrset
 */
export const updateRRSetResponseSchema = z.object({
  rrset: rrsetSchema,
});

/**
 * Change RRSet Protection request schema
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-change-an-rrsets-protection
 */
export const changeRRSetProtectionRequestSchema = z.object({
  change: z.boolean().optional(),
});

/**
 * Change RRSet TTL request schema. `null` resets the TTL to the default TTL of the zone.
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-change-an-rrsets-ttl
 */
export const changeRRSetTTLRequestSchema = z.object({
  ttl: z.number().int().nullable(),
});

/**
 * Set RRSet Records request schema
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-set-records-of-an-rrset
 */
export const setRRSetRecordsRequestSchema = z.object({
  records: z.array(rrsetRecordInputSchema),
});

/**
 * Add RRSet Records request schema
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-add-records-to-an-rrset
 */
export const addRRSetRecordsRequestSchema = z.object({
  records: z.array(rrsetRecordInputSchema),
  ttl: z.number().int().optional(),
});

/**
 * Remove RRSet Records request schema
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-remove-records-from-an-rrset
 */
export const removeRRSetRecordsRequestSchema = z.object({
  records: z.array(rrsetRecordInputSchema),
});

/**
 * Update RRSet Records request schema
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-update-records-of-an-rrset
 */
export const updateRRSetRecordsRequestSchema = z.object({
  records: z.array(rrsetRecordInputSchema),
});
