/**
 * Types for Hetzner Cloud DNS (Zones) API
 * Types are inferred from Zod schemas
 * @see https://docs.hetzner.cloud/reference/cloud#dns
 */

// biome-ignore assist/source/organizeImports: we need to import the schemas first
import {
  listZonesResponseSchema,
  createZoneRequestSchema,
  createZoneResponseSchema,
  getZoneResponseSchema,
  updateZoneRequestSchema,
  updateZoneResponseSchema,
  deleteZoneResponseSchema,
  exportZoneResponseSchema,
  listZoneActionsResponseSchema,
  getZoneActionResponseSchema,
  changeZonePrimaryNameserversRequestSchema,
  changeZonePrimaryNameserversResponseSchema,
  changeZoneProtectionRequestSchema,
  changeZoneProtectionResponseSchema,
  changeZoneDefaultTTLRequestSchema,
  changeZoneDefaultTTLResponseSchema,
  importZoneFileRequestSchema,
  importZoneFileResponseSchema,
  listRRSetsResponseSchema,
  getRRSetResponseSchema,
  createRRSetRequestSchema,
  createRRSetResponseSchema,
  updateRRSetRequestSchema,
  updateRRSetResponseSchema,
  deleteRRSetResponseSchema,
  changeRRSetProtectionRequestSchema,
  changeRRSetProtectionResponseSchema,
  changeRRSetTTLRequestSchema,
  changeRRSetTTLResponseSchema,
  setRRSetRecordsRequestSchema,
  setRRSetRecordsResponseSchema,
  addRRSetRecordsRequestSchema,
  addRRSetRecordsResponseSchema,
  removeRRSetRecordsRequestSchema,
  removeRRSetRecordsResponseSchema,
  updateRRSetRecordsRequestSchema,
  updateRRSetRecordsResponseSchema,
  zoneSchema,
  zoneStatusSchema,
  zoneProtectionSchema,
  rrsetSchema,
  rrsetRecordSchema,
  rrsetProtectionSchema,
} from "../../apis/dns/schemas";
import type { z } from "zod";

/**
 * Zone status
 */
export type ZoneStatus = z.infer<typeof zoneStatusSchema>;

/**
 * Zone protection
 */
export type ZoneProtection = z.infer<typeof zoneProtectionSchema>;

/**
 * Zone
 */
export type Zone = z.infer<typeof zoneSchema>;

/**
 * RRSet record
 */
export type RRSetRecord = z.infer<typeof rrsetRecordSchema>;

/**
 * RRSet protection
 */
export type RRSetProtection = z.infer<typeof rrsetProtectionSchema>;

/**
 * RRSet
 */
export type RRSet = z.infer<typeof rrsetSchema>;

/**
 * List Zones query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zones-list-zones
 */
export interface ListZonesParams {
  /**
   * Can be used to filter resources by their name. The response will only contain the resources matching the specified name.
   */
  name?: string;
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, name, name:asc, name:desc, created, created:asc, created:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
  /**
   * Can be used to filter resources by labels. The response will only contain resources matching the label selector.
   */
  label_selector?: string;
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
 * List Zones response
 * @see https://docs.hetzner.cloud/reference/cloud#zones-list-zones
 */
export type ListZonesResponse = z.infer<typeof listZonesResponseSchema>;

/**
 * Create Zone parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zones-create-a-zone
 */
export type CreateZoneParams = z.infer<typeof createZoneRequestSchema>;

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
 * Update Zone parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zones-update-a-zone
 */
export type UpdateZoneParams = z.infer<typeof updateZoneRequestSchema>;

/**
 * Update Zone response
 * @see https://docs.hetzner.cloud/reference/cloud#zones-update-a-zone
 */
export type UpdateZoneResponse = z.infer<typeof updateZoneResponseSchema>;

/**
 * Delete Zone response
 * @see https://docs.hetzner.cloud/reference/cloud#zones-delete-a-zone
 */
export type DeleteZoneResponse = z.infer<typeof deleteZoneResponseSchema>;

/**
 * Export Zone response
 * @see https://docs.hetzner.cloud/reference/cloud#zones-export-a-zone-file
 */
export type ExportZoneResponse = z.infer<typeof exportZoneResponseSchema>;

/**
 * List Zone Actions query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zones-list-actions-for-a-zone
 */
export interface ListZoneActionsParams {
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, command, command:asc, command:desc, status, status:asc, status:desc, progress, progress:asc, progress:desc, started, started:asc, started:desc, finished, finished:asc, finished:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
  /**
   * Can be used to filter Actions by status. The response will only contain Actions matching the status.
   */
  status?: string | string[];
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
 * List Zone Actions response
 * @see https://docs.hetzner.cloud/reference/cloud#zones-list-actions-for-a-zone
 */
export type ListZoneActionsResponse = z.infer<typeof listZoneActionsResponseSchema>;

/**
 * Get Zone Action response
 * @see https://docs.hetzner.cloud/reference/cloud#zones-get-an-action-for-a-zone
 */
export type GetZoneActionResponse = z.infer<typeof getZoneActionResponseSchema>;

/**
 * Change Zone Primary Nameservers parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zones-change-a-zones-primary-nameservers
 */
export type ChangeZonePrimaryNameserversParams = z.infer<
  typeof changeZonePrimaryNameserversRequestSchema
>;

/**
 * Change Zone Primary Nameservers response
 * @see https://docs.hetzner.cloud/reference/cloud#zones-change-a-zones-primary-nameservers
 */
export type ChangeZonePrimaryNameserversResponse = z.infer<
  typeof changeZonePrimaryNameserversResponseSchema
>;

/**
 * Change Zone Protection parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zones-change-a-zones-protection
 */
export type ChangeZoneProtectionParams = z.infer<typeof changeZoneProtectionRequestSchema>;

/**
 * Change Zone Protection response
 * @see https://docs.hetzner.cloud/reference/cloud#zones-change-a-zones-protection
 */
export type ChangeZoneProtectionResponse = z.infer<typeof changeZoneProtectionResponseSchema>;

/**
 * Change Zone Default TTL parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zones-change-a-zones-default-ttl
 */
export type ChangeZoneDefaultTTLParams = z.infer<typeof changeZoneDefaultTTLRequestSchema>;

/**
 * Change Zone Default TTL response
 * @see https://docs.hetzner.cloud/reference/cloud#zones-change-a-zones-default-ttl
 */
export type ChangeZoneDefaultTTLResponse = z.infer<typeof changeZoneDefaultTTLResponseSchema>;

/**
 * Import Zone file parameters
 * @see https://docs.hetzner.cloud/reference/cloud#zones-import-a-zone-file
 */
export type ImportZoneFileParams = z.infer<typeof importZoneFileRequestSchema>;

/**
 * Import Zone file response
 * @see https://docs.hetzner.cloud/reference/cloud#zones-import-a-zone-file
 */
export type ImportZoneFileResponse = z.infer<typeof importZoneFileResponseSchema>;

/**
 * List RRSets query parameters
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-list-rrsets
 */
export interface ListRRSetsParams {
  /**
   * Can be used to filter resources by their name. The response will only contain the resources matching the specified name.
   */
  name?: string;
  /**
   * Can be used to filter resources by their type. The response will only contain the resources matching the specified type.
   */
  type?: string;
  /**
   * Can be used multiple times. Choices: id, id:asc, id:desc, name, name:asc, name:desc, type, type:asc, type:desc, created, created:asc, created:desc
   * @see https://docs.hetzner.cloud/reference/cloud#sorting
   */
  sort?: string | string[];
  /**
   * Can be used to filter resources by labels. The response will only contain resources matching the label selector.
   */
  label_selector?: string;
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
 * List RRSets response
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-list-rrsets
 */
export type ListRRSetsResponse = z.infer<typeof listRRSetsResponseSchema>;

/**
 * Get RRSet response
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-get-an-rrset
 */
export type GetRRSetResponse = z.infer<typeof getRRSetResponseSchema>;

/**
 * Create RRSet parameters
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-create-an-rrset
 */
export type CreateRRSetParams = z.infer<typeof createRRSetRequestSchema>;

/**
 * Create RRSet response
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-create-an-rrset
 */
export type CreateRRSetResponse = z.infer<typeof createRRSetResponseSchema>;

/**
 * Update RRSet parameters
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-update-an-rrset
 */
export type UpdateRRSetParams = z.infer<typeof updateRRSetRequestSchema>;

/**
 * Update RRSet response
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-update-an-rrset
 */
export type UpdateRRSetResponse = z.infer<typeof updateRRSetResponseSchema>;

/**
 * Delete RRSet response
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-delete-an-rrset
 */
export type DeleteRRSetResponse = z.infer<typeof deleteRRSetResponseSchema>;

/**
 * Change RRSet Protection parameters
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-change-an-rrsets-protection
 */
export type ChangeRRSetProtectionParams = z.infer<
  typeof changeRRSetProtectionRequestSchema
>;

/**
 * Change RRSet Protection response
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-change-an-rrsets-protection
 */
export type ChangeRRSetProtectionResponse = z.infer<
  typeof changeRRSetProtectionResponseSchema
>;

/**
 * Change RRSet TTL parameters
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-change-an-rrsets-ttl
 */
export type ChangeRRSetTTLParams = z.infer<typeof changeRRSetTTLRequestSchema>;

/**
 * Change RRSet TTL response
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-change-an-rrsets-ttl
 */
export type ChangeRRSetTTLResponse = z.infer<typeof changeRRSetTTLResponseSchema>;

/**
 * Set RRSet Records parameters
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-set-records-of-an-rrset
 */
export type SetRRSetRecordsParams = z.infer<typeof setRRSetRecordsRequestSchema>;

/**
 * Set RRSet Records response
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-set-records-of-an-rrset
 */
export type SetRRSetRecordsResponse = z.infer<typeof setRRSetRecordsResponseSchema>;

/**
 * Add RRSet Records parameters
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-add-records-to-an-rrset
 */
export type AddRRSetRecordsParams = z.infer<typeof addRRSetRecordsRequestSchema>;

/**
 * Add RRSet Records response
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-add-records-to-an-rrset
 */
export type AddRRSetRecordsResponse = z.infer<typeof addRRSetRecordsResponseSchema>;

/**
 * Remove RRSet Records parameters
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-remove-records-from-an-rrset
 */
export type RemoveRRSetRecordsParams = z.infer<typeof removeRRSetRecordsRequestSchema>;

/**
 * Remove RRSet Records response
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-remove-records-from-an-rrset
 */
export type RemoveRRSetRecordsResponse = z.infer<typeof removeRRSetRecordsResponseSchema>;

/**
 * Update RRSet Records parameters
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-update-records-of-an-rrset
 */
export type UpdateRRSetRecordsParams = z.infer<typeof updateRRSetRecordsRequestSchema>;

/**
 * Update RRSet Records response
 * @see https://docs.hetzner.cloud/reference/cloud#rrsets-update-records-of-an-rrset
 */
export type UpdateRRSetRecordsResponse = z.infer<typeof updateRRSetRecordsResponseSchema>;
