/**
 * Types for Hetzner Cloud DNS (Zones) API
 * @see https://docs.hetzner.cloud/reference/cloud#zones
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets
 */

import type { z } from "zod";
import type {
  ActionResponse,
  GetActionResponse,
  ListActionsParams,
  ListActionsResponse,
} from "../actions/types";
import type { OneOrMany, PageParams, SortParam } from "../common/types";
import type {
  addRRSetRecordsRequestSchema,
  changeRRSetProtectionRequestSchema,
  changeRRSetTTLRequestSchema,
  changeZoneDefaultTTLRequestSchema,
  changeZonePrimaryNameserversRequestSchema,
  changeZoneProtectionRequestSchema,
  createRRSetRequestSchema,
  createRRSetResponseSchema,
  createZoneRequestSchema,
  createZoneResponseSchema,
  createZoneRRSetInputSchema,
  exportZoneResponseSchema,
  getRRSetResponseSchema,
  getZoneResponseSchema,
  importZoneFileRequestSchema,
  listRRSetsResponseSchema,
  listZonesResponseSchema,
  removeRRSetRecordsRequestSchema,
  rrsetProtectionSchema,
  rrsetRecordInputSchema,
  rrsetRecordSchema,
  rrsetSchema,
  rrsetTypeSchema,
  setRRSetRecordsRequestSchema,
  updateRRSetRecordsRequestSchema,
  updateRRSetRequestSchema,
  updateRRSetResponseSchema,
  updateZoneRequestSchema,
  updateZoneResponseSchema,
  zoneAuthoritativeNameserversSchema,
  zoneDelegationStatusSchema,
  zoneModeSchema,
  zonePrimaryNameserverInputSchema,
  zonePrimaryNameserverSchema,
  zoneProtectionSchema,
  zoneRegistrarSchema,
  zoneSchema,
  zoneStatusSchema,
  zoneTSIGAlgorithmSchema,
} from "./schemas";

/**
 * Zone mode: `primary` or `secondary`
 */
export type ZoneMode = z.infer<typeof zoneModeSchema>;

/**
 * Zone status
 */
export type ZoneStatus = z.infer<typeof zoneStatusSchema>;

/**
 * Zone registrar
 */
export type ZoneRegistrar = z.infer<typeof zoneRegistrarSchema>;

/**
 * Zone protection
 */
export type ZoneProtection = z.infer<typeof zoneProtectionSchema>;

/**
 * TSIG algorithm of a primary nameserver
 */
export type ZoneTSIGAlgorithm = z.infer<typeof zoneTSIGAlgorithmSchema>;

/**
 * Primary nameserver of a zone in secondary mode
 */
export type ZonePrimaryNameserver = z.infer<typeof zonePrimaryNameserverSchema>;

/**
 * Primary nameserver as sent in requests
 */
export type ZonePrimaryNameserverInput = z.input<typeof zonePrimaryNameserverInputSchema>;

/**
 * Delegation status of the authoritative nameservers of a zone
 */
export type ZoneDelegationStatus = z.infer<typeof zoneDelegationStatusSchema>;

/**
 * Authoritative nameservers of a zone
 */
export type ZoneAuthoritativeNameservers = z.infer<typeof zoneAuthoritativeNameserversSchema>;

/**
 * Hetzner Cloud DNS Zone
 * @see https://docs.hetzner.cloud/reference/cloud#zones
 */
export type Zone = z.infer<typeof zoneSchema>;

/**
 * ID or name of a zone, e.g. `42` or `"example.com"`
 */
export type ZoneIdOrName = number | string;

/**
 * RRSet type, e.g. `"A"`, `"AAAA"` or `"TXT"`. Other strings are accepted as well.
 */
export type RRSetType = z.infer<typeof rrsetTypeSchema>;

/**
 * RRSet protection
 */
export type RRSetProtection = z.infer<typeof rrsetProtectionSchema>;

/**
 * Record of an RRSet
 */
export type RRSetRecord = z.infer<typeof rrsetRecordSchema>;

/**
 * Record of an RRSet as sent in requests
 */
export type RRSetRecordInput = z.input<typeof rrsetRecordInputSchema>;

/**
 * Hetzner Cloud DNS RRSet (resource record set)
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets
 */
export type RRSet = z.infer<typeof rrsetSchema>;

/**
 * RRSet as sent when creating a zone
 */
export type CreateZoneRRSetInput = z.input<typeof createZoneRRSetInputSchema>;

/**
 * Fields zones can be sorted by
 */
export type ZoneSort = SortParam<"id" | "name" | "created">;

/**
 * List Zones query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zones-list-zones
 */
export interface ListZonesParams extends PageParams {
  /**
   * Only return the zone with this exact name.
   */
  name?: string;
  /**
   * Only return zones in this mode.
   */
  mode?: ZoneMode;
  /**
   * Only return zones matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
  /**
   * Sort the result.
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: OneOrMany<ZoneSort>;
}

/**
 * List Zones response
 * @see https://docs.hetzner.cloud/reference/cloud#zones-list-zones
 */
export type ListZonesResponse = z.infer<typeof listZonesResponseSchema>;

/**
 * Create Zone request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zones-create-a-zone
 */
export type CreateZoneParams = z.input<typeof createZoneRequestSchema>;

/**
 * Create Zone response
 * @see https://docs.hetzner.cloud/reference/cloud#zones-create-a-zone
 */
export type CreateZoneResponse = z.infer<typeof createZoneResponseSchema>;

/**
 * Get Zone response
 * @see https://docs.hetzner.cloud/reference/cloud#zones-get-a-zone
 */
export type GetZoneResponse = z.infer<typeof getZoneResponseSchema>;

/**
 * Update Zone request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zones-update-a-zone
 */
export type UpdateZoneParams = z.input<typeof updateZoneRequestSchema>;

/**
 * Update Zone response
 * @see https://docs.hetzner.cloud/reference/cloud#zones-update-a-zone
 */
export type UpdateZoneResponse = z.infer<typeof updateZoneResponseSchema>;

/**
 * Delete Zone response
 * @see https://docs.hetzner.cloud/reference/cloud#zones-delete-a-zone
 */
export type DeleteZoneResponse = ActionResponse;

/**
 * Export Zone file response
 * @see https://docs.hetzner.cloud/reference/cloud#zones-export-a-zone-file
 */
export type ExportZoneResponse = z.infer<typeof exportZoneResponseSchema>;

/**
 * List Zone Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-list-actions-for-a-zone
 */
export type ListZoneActionsParams = ListActionsParams;

/**
 * List Zone Actions response
 * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-list-actions-for-a-zone
 */
export type ListZoneActionsResponse = ListActionsResponse;

/**
 * Get Zone Action response
 * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-get-an-action-for-a-zone
 */
export type GetZoneActionResponse = GetActionResponse;

/**
 * Change Zone Primary Nameservers request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-change-a-zones-primary-nameservers
 */
export type ChangeZonePrimaryNameserversParams = z.input<
  typeof changeZonePrimaryNameserversRequestSchema
>;

/**
 * Change Zone Primary Nameservers response
 * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-change-a-zones-primary-nameservers
 */
export type ChangeZonePrimaryNameserversResponse = ActionResponse;

/**
 * Change Zone Protection request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-change-a-zones-protection
 */
export type ChangeZoneProtectionParams = z.input<typeof changeZoneProtectionRequestSchema>;

/**
 * Change Zone Protection response
 * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-change-a-zones-protection
 */
export type ChangeZoneProtectionResponse = ActionResponse;

/**
 * Change Zone Default TTL request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-change-a-zones-default-ttl
 */
export type ChangeZoneDefaultTTLParams = z.input<typeof changeZoneDefaultTTLRequestSchema>;

/**
 * Change Zone Default TTL response
 * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-change-a-zones-default-ttl
 */
export type ChangeZoneDefaultTTLResponse = ActionResponse;

/**
 * Import Zone file request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-import-a-zone-file
 */
export type ImportZoneFileParams = z.input<typeof importZoneFileRequestSchema>;

/**
 * Import Zone file response
 * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-import-a-zone-file
 */
export type ImportZoneFileResponse = ActionResponse;

/**
 * Fields RRSets can be sorted by
 */
export type RRSetSort = SortParam<"id" | "name">;

/**
 * List RRSets query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets-list-rrsets
 */
export interface ListRRSetsParams extends PageParams {
  /**
   * Only return RRSets with this exact name, e.g. `"www"` or `"@"`.
   */
  name?: string;
  /**
   * Only return RRSets of the given types.
   */
  type?: OneOrMany<RRSetType>;
  /**
   * Only return RRSets matching the label selector.
   * @see https://docs.hetzner.cloud/reference/cloud#label-selector
   */
  label_selector?: string;
  /**
   * Sort the result.
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: OneOrMany<RRSetSort>;
}

/**
 * List RRSets response
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets-list-rrsets
 */
export type ListRRSetsResponse = z.infer<typeof listRRSetsResponseSchema>;

/**
 * Get RRSet response
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets-get-an-rrset
 */
export type GetRRSetResponse = z.infer<typeof getRRSetResponseSchema>;

/**
 * Create RRSet request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets-create-an-rrset
 */
export type CreateRRSetParams = z.input<typeof createRRSetRequestSchema>;

/**
 * Create RRSet response
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets-create-an-rrset
 */
export type CreateRRSetResponse = z.infer<typeof createRRSetResponseSchema>;

/**
 * Update RRSet request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets-update-an-rrset
 */
export type UpdateRRSetParams = z.input<typeof updateRRSetRequestSchema>;

/**
 * Update RRSet response
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets-update-an-rrset
 */
export type UpdateRRSetResponse = z.infer<typeof updateRRSetResponseSchema>;

/**
 * Delete RRSet response
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets-delete-an-rrset
 */
export type DeleteRRSetResponse = ActionResponse;

/**
 * Change RRSet Protection request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-change-an-rrsets-protection
 */
export type ChangeRRSetProtectionParams = z.input<typeof changeRRSetProtectionRequestSchema>;

/**
 * Change RRSet Protection response
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-change-an-rrsets-protection
 */
export type ChangeRRSetProtectionResponse = ActionResponse;

/**
 * Change RRSet TTL request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-change-an-rrsets-ttl
 */
export type ChangeRRSetTTLParams = z.input<typeof changeRRSetTTLRequestSchema>;

/**
 * Change RRSet TTL response
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-change-an-rrsets-ttl
 */
export type ChangeRRSetTTLResponse = ActionResponse;

/**
 * Set RRSet Records request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-set-records-of-an-rrset
 */
export type SetRRSetRecordsParams = z.input<typeof setRRSetRecordsRequestSchema>;

/**
 * Set RRSet Records response
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-set-records-of-an-rrset
 */
export type SetRRSetRecordsResponse = ActionResponse;

/**
 * Add RRSet Records request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-add-records-to-an-rrset
 */
export type AddRRSetRecordsParams = z.input<typeof addRRSetRecordsRequestSchema>;

/**
 * Add RRSet Records response
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-add-records-to-an-rrset
 */
export type AddRRSetRecordsResponse = ActionResponse;

/**
 * Remove RRSet Records request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-remove-records-from-an-rrset
 */
export type RemoveRRSetRecordsParams = z.input<typeof removeRRSetRecordsRequestSchema>;

/**
 * Remove RRSet Records response
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-remove-records-from-an-rrset
 */
export type RemoveRRSetRecordsResponse = ActionResponse;

/**
 * Update RRSet Records request parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-update-records-of-an-rrset
 */
export type UpdateRRSetRecordsParams = z.input<typeof updateRRSetRecordsRequestSchema>;

/**
 * Update RRSet Records response
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-update-records-of-an-rrset
 */
export type UpdateRRSetRecordsResponse = ActionResponse;
