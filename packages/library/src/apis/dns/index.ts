/**
 * Hetzner Cloud DNS (Zones) API
 * @see https://docs.hetzner.cloud/reference/cloud#zones
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets
 */

import { iteratePages } from "../../core/pagination";
import { ApiResource, path } from "../../core/resource";
import type { RequestOptions } from "../../core/types";
import { ResourceActionsClient } from "../actions/index";
import {
  actionResponseSchema,
  getActionResponseSchema,
  listActionsResponseSchema,
} from "../actions/schemas";
import {
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
  exportZoneResponseSchema,
  getRRSetResponseSchema,
  getZoneResponseSchema,
  importZoneFileRequestSchema,
  listRRSetsResponseSchema,
  listZonesResponseSchema,
  removeRRSetRecordsRequestSchema,
  setRRSetRecordsRequestSchema,
  updateRRSetRecordsRequestSchema,
  updateRRSetRequestSchema,
  updateRRSetResponseSchema,
  updateZoneRequestSchema,
  updateZoneResponseSchema,
} from "./schemas";
import type {
  AddRRSetRecordsParams,
  AddRRSetRecordsResponse,
  ChangeRRSetProtectionParams,
  ChangeRRSetProtectionResponse,
  ChangeRRSetTTLParams,
  ChangeRRSetTTLResponse,
  ChangeZoneDefaultTTLParams,
  ChangeZoneDefaultTTLResponse,
  ChangeZonePrimaryNameserversParams,
  ChangeZonePrimaryNameserversResponse,
  ChangeZoneProtectionParams,
  ChangeZoneProtectionResponse,
  CreateRRSetParams,
  CreateRRSetResponse,
  CreateZoneParams,
  CreateZoneResponse,
  DeleteRRSetResponse,
  DeleteZoneResponse,
  ExportZoneResponse,
  GetRRSetResponse,
  GetZoneActionResponse,
  GetZoneResponse,
  ImportZoneFileParams,
  ImportZoneFileResponse,
  ListRRSetsParams,
  ListRRSetsResponse,
  ListZoneActionsParams,
  ListZoneActionsResponse,
  ListZonesParams,
  ListZonesResponse,
  RemoveRRSetRecordsParams,
  RemoveRRSetRecordsResponse,
  RRSet,
  RRSetType,
  SetRRSetRecordsParams,
  SetRRSetRecordsResponse,
  UpdateRRSetParams,
  UpdateRRSetRecordsParams,
  UpdateRRSetRecordsResponse,
  UpdateRRSetResponse,
  UpdateZoneParams,
  UpdateZoneResponse,
  Zone,
  ZoneIdOrName,
} from "./types";

/**
 * Path of an RRSet. Zone, name and type are URI-encoded, so names such as `@` are safe.
 */
function rrsetPath(zone: ZoneIdOrName, name: string, type: RRSetType): string {
  return path`/zones/${zone}/rrsets/${name}/${type}`;
}

/**
 * DNS API client
 *
 * Manages DNS zones and their resource record sets (RRSets). The Hetzner API
 * calls this the "Zones" API.
 *
 * Zones are addressed by ID or name (`42` or `"example.com"`), RRSets by their
 * name and type (`"www"`, `"A"`). The name of the RRSet at the zone apex is `"@"`.
 *
 * Use `iterateZones()` / `listAllZones()` and `iterateRRSets()` / `listAllRRSets()`
 * to fetch all pages of a list.
 *
 * @see https://docs.hetzner.cloud/reference/cloud#zones
 * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets
 */
export class DNSClient extends ApiResource {
  /**
   * Actions of all zones (`GET /zones/actions`, `GET /zones/actions/{id}`).
   *
   * @example
   * ```typescript
   * const { actions } = await client.dns.actions.list({ status: "running" });
   * ```
   */
  public readonly actions = new ResourceActionsClient(this.client, "/zones");

  // ---------------------------------------------------------------------------
  // Zones
  // ---------------------------------------------------------------------------

  /**
   * Returns a page of zones.
   *
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zones-list-zones
   *
   * @example
   * ```typescript
   * const { zones } = await client.dns.listZones({ mode: "primary", sort: "name:asc" });
   * ```
   */
  listZones(params?: ListZonesParams, options?: RequestOptions): Promise<ListZonesResponse> {
    return this._get("/zones", listZonesResponseSchema, params, options);
  }

  /**
   * Iterates over all zones, transparently fetching page after page.
   *
   * @param params - Same filters as `listZones()`. `page` sets the first page, `per_page` the page size
   * @param options - Request options applied to every page request
   *
   * @example
   * ```typescript
   * for await (const zone of client.dns.iterateZones({ label_selector: "env=prod" })) {
   *   console.log(zone.name);
   * }
   * ```
   */
  async *iterateZones(
    params?: ListZonesParams,
    options?: RequestOptions,
  ): AsyncGenerator<Zone, void, undefined> {
    const pages = iteratePages((page: ListZonesParams) => this.listZones(page, options), params);
    for await (const page of pages) {
      yield* page.zones;
    }
  }

  /**
   * Fetches all zones across all pages.
   *
   * @param params - Same filters as `listZones()`
   * @param options - Request options applied to every page request
   *
   * @example
   * ```typescript
   * const zones = await client.dns.listAllZones();
   * ```
   */
  async listAllZones(params?: ListZonesParams, options?: RequestOptions): Promise<Zone[]> {
    const zones: Zone[] = [];
    for await (const zone of this.iterateZones(params, options)) zones.push(zone);
    return zones;
  }

  /**
   * Creates a zone.
   *
   * A default `SOA` and three `NS` records with the assigned Hetzner nameservers
   * are created automatically.
   *
   * @param params - Name, mode and optional TTL, labels, RRSets or zone file
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zones-create-a-zone
   *
   * @example
   * ```typescript
   * const { zone, action } = await client.dns.createZone({
   *   name: "example.com",
   *   mode: "primary",
   *   rrsets: [{ name: "@", type: "A", records: [{ value: "198.51.100.1" }] }],
   * });
   * await client.actions.waitFor(action);
   * ```
   */
  createZone(params: CreateZoneParams, options?: RequestOptions): Promise<CreateZoneResponse> {
    return this._post("/zones", createZoneResponseSchema, params, createZoneRequestSchema, options);
  }

  /**
   * Returns a specific zone.
   *
   * @param idOrName - ID or name of the zone
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zones-get-a-zone
   *
   * @example
   * ```typescript
   * const { zone } = await client.dns.getZone("example.com");
   * console.log(zone.status, zone.authoritative_nameservers.assigned);
   * ```
   */
  getZone(idOrName: ZoneIdOrName, options?: RequestOptions): Promise<GetZoneResponse> {
    return this._get(path`/zones/${idOrName}`, getZoneResponseSchema, undefined, options);
  }

  /**
   * Updates the labels of a zone.
   *
   * To change the default TTL use `changeZoneDefaultTTL()`.
   *
   * @param idOrName - ID or name of the zone
   * @param params - Fields to update
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zones-update-a-zone
   *
   * @example
   * ```typescript
   * const { zone } = await client.dns.updateZone("example.com", {
   *   labels: { environment: "production" },
   * });
   * ```
   */
  updateZone(
    idOrName: ZoneIdOrName,
    params: UpdateZoneParams,
    options?: RequestOptions,
  ): Promise<UpdateZoneResponse> {
    return this._put(
      path`/zones/${idOrName}`,
      updateZoneResponseSchema,
      params,
      updateZoneRequestSchema,
      options,
    );
  }

  /**
   * Deletes a zone including all of its RRSets.
   *
   * @param idOrName - ID or name of the zone
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zones-delete-a-zone
   *
   * @example
   * ```typescript
   * const { action } = await client.dns.deleteZone("example.com");
   * await client.actions.waitFor(action);
   * ```
   */
  deleteZone(idOrName: ZoneIdOrName, options?: RequestOptions): Promise<DeleteZoneResponse> {
    return this._delete(path`/zones/${idOrName}`, actionResponseSchema, options);
  }

  /**
   * Returns the zone file of a zone in BIND (RFC 1034/1035) format.
   *
   * @param idOrName - ID or name of the zone
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zones-export-a-zone-file
   *
   * @example
   * ```typescript
   * const { zonefile } = await client.dns.exportZone("example.com");
   * console.log(zonefile);
   * ```
   */
  exportZone(idOrName: ZoneIdOrName, options?: RequestOptions): Promise<ExportZoneResponse> {
    return this._get(path`/zones/${idOrName}/zonefile`, exportZoneResponseSchema, undefined, options);
  }

  // ---------------------------------------------------------------------------
  // Zone actions
  // ---------------------------------------------------------------------------

  /**
   * Returns a page of actions of a zone.
   *
   * @param idOrName - ID or name of the zone
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-list-actions-for-a-zone
   *
   * @example
   * ```typescript
   * const { actions } = await client.dns.listZoneActions("example.com", { status: "running" });
   * ```
   */
  listZoneActions(
    idOrName: ZoneIdOrName,
    params?: ListZoneActionsParams,
    options?: RequestOptions,
  ): Promise<ListZoneActionsResponse> {
    return this._get(path`/zones/${idOrName}/actions`, listActionsResponseSchema, params, options);
  }

  /**
   * Returns a specific action of a zone.
   *
   * @param idOrName - ID or name of the zone
   * @param actionId - ID of the action
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-get-an-action-for-a-zone
   *
   * @example
   * ```typescript
   * const { action } = await client.dns.getZoneAction("example.com", 12345);
   * ```
   */
  getZoneAction(
    idOrName: ZoneIdOrName,
    actionId: number,
    options?: RequestOptions,
  ): Promise<GetZoneActionResponse> {
    return this._get(
      path`/zones/${idOrName}/actions/${actionId}`,
      getActionResponseSchema,
      undefined,
      options,
    );
  }

  /**
   * Changes the primary nameservers of a zone in secondary mode.
   *
   * @param idOrName - ID or name of the zone
   * @param params - The new primary nameservers
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-change-a-zones-primary-nameservers
   *
   * @example
   * ```typescript
   * const { action } = await client.dns.changeZonePrimaryNameservers("example.com", {
   *   primary_nameservers: [{ address: "198.51.100.1", port: 53 }, { address: "203.0.113.1" }],
   * });
   * ```
   */
  changeZonePrimaryNameservers(
    idOrName: ZoneIdOrName,
    params: ChangeZonePrimaryNameserversParams,
    options?: RequestOptions,
  ): Promise<ChangeZonePrimaryNameserversResponse> {
    return this._post(
      path`/zones/${idOrName}/actions/change_primary_nameservers`,
      actionResponseSchema,
      params,
      changeZonePrimaryNameserversRequestSchema,
      options,
    );
  }

  /**
   * Changes the protection of a zone.
   *
   * @param idOrName - ID or name of the zone
   * @param params - `delete: true` prevents the zone from being deleted
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-change-a-zones-protection
   *
   * @example
   * ```typescript
   * const { action } = await client.dns.changeZoneProtection("example.com", { delete: true });
   * ```
   */
  changeZoneProtection(
    idOrName: ZoneIdOrName,
    params: ChangeZoneProtectionParams,
    options?: RequestOptions,
  ): Promise<ChangeZoneProtectionResponse> {
    return this._post(
      path`/zones/${idOrName}/actions/change_protection`,
      actionResponseSchema,
      params,
      changeZoneProtectionRequestSchema,
      options,
    );
  }

  /**
   * Changes the default TTL of a zone. It applies to RRSets without their own TTL.
   *
   * @param idOrName - ID or name of the zone
   * @param params - The new default TTL in seconds
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-change-a-zones-default-ttl
   *
   * @example
   * ```typescript
   * const { action } = await client.dns.changeZoneDefaultTTL("example.com", { ttl: 3600 });
   * ```
   */
  changeZoneDefaultTTL(
    idOrName: ZoneIdOrName,
    params: ChangeZoneDefaultTTLParams,
    options?: RequestOptions,
  ): Promise<ChangeZoneDefaultTTLResponse> {
    return this._post(
      path`/zones/${idOrName}/actions/change_ttl`,
      actionResponseSchema,
      params,
      changeZoneDefaultTTLRequestSchema,
      options,
    );
  }

  /**
   * Imports a zone file, replacing all RRSets of the zone.
   *
   * @param idOrName - ID or name of the zone
   * @param params - Zone file in BIND (RFC 1034/1035) format
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zone-actions-import-a-zone-file
   *
   * @example
   * ```typescript
   * const { action } = await client.dns.importZoneFile("example.com", {
   *   zonefile: "$ORIGIN example.com.\n$TTL 3600\n@ IN A 198.51.100.1\n",
   * });
   * await client.actions.waitFor(action);
   * ```
   */
  importZoneFile(
    idOrName: ZoneIdOrName,
    params: ImportZoneFileParams,
    options?: RequestOptions,
  ): Promise<ImportZoneFileResponse> {
    return this._post(
      path`/zones/${idOrName}/actions/import_zonefile`,
      actionResponseSchema,
      params,
      importZoneFileRequestSchema,
      options,
    );
  }

  // ---------------------------------------------------------------------------
  // RRSets
  // ---------------------------------------------------------------------------

  /**
   * Returns a page of RRSets of a zone.
   *
   * @param idOrName - ID or name of the zone
   * @param params - Filters, sorting and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets-list-rrsets
   *
   * @example
   * ```typescript
   * const { rrsets } = await client.dns.listRRSets("example.com", { type: ["A", "AAAA"] });
   * ```
   */
  listRRSets(
    idOrName: ZoneIdOrName,
    params?: ListRRSetsParams,
    options?: RequestOptions,
  ): Promise<ListRRSetsResponse> {
    return this._get(path`/zones/${idOrName}/rrsets`, listRRSetsResponseSchema, params, options);
  }

  /**
   * Iterates over all RRSets of a zone, transparently fetching page after page.
   *
   * @param idOrName - ID or name of the zone
   * @param params - Same filters as `listRRSets()`. `page` sets the first page, `per_page` the page size
   * @param options - Request options applied to every page request
   *
   * @example
   * ```typescript
   * for await (const rrset of client.dns.iterateRRSets("example.com", { type: "TXT" })) {
   *   console.log(rrset.name, rrset.records.map((record) => record.value));
   * }
   * ```
   */
  async *iterateRRSets(
    idOrName: ZoneIdOrName,
    params?: ListRRSetsParams,
    options?: RequestOptions,
  ): AsyncGenerator<RRSet, void, undefined> {
    const pages = iteratePages(
      (page: ListRRSetsParams) => this.listRRSets(idOrName, page, options),
      params,
    );
    for await (const page of pages) {
      yield* page.rrsets;
    }
  }

  /**
   * Fetches all RRSets of a zone across all pages.
   *
   * @param idOrName - ID or name of the zone
   * @param params - Same filters as `listRRSets()`
   * @param options - Request options applied to every page request
   *
   * @example
   * ```typescript
   * const rrsets = await client.dns.listAllRRSets("example.com");
   * ```
   */
  async listAllRRSets(
    idOrName: ZoneIdOrName,
    params?: ListRRSetsParams,
    options?: RequestOptions,
  ): Promise<RRSet[]> {
    const rrsets: RRSet[] = [];
    for await (const rrset of this.iterateRRSets(idOrName, params, options)) rrsets.push(rrset);
    return rrsets;
  }

  /**
   * Returns a specific RRSet of a zone.
   *
   * @param idOrName - ID or name of the zone
   * @param name - Name of the RRSet, e.g. `"www"` or `"@"`
   * @param type - Type of the RRSet, e.g. `"A"`
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets-get-an-rrset
   *
   * @example
   * ```typescript
   * const { rrset } = await client.dns.getRRSet("example.com", "www", "A");
   * console.log(rrset.records);
   * ```
   */
  getRRSet(
    idOrName: ZoneIdOrName,
    name: string,
    type: RRSetType,
    options?: RequestOptions,
  ): Promise<GetRRSetResponse> {
    return this._get(rrsetPath(idOrName, name, type), getRRSetResponseSchema, undefined, options);
  }

  /**
   * Creates an RRSet in a zone.
   *
   * @param idOrName - ID or name of the zone
   * @param params - Name, type, records and optional TTL and labels
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets-create-an-rrset
   *
   * @example
   * ```typescript
   * const { rrset, action } = await client.dns.createRRSet("example.com", {
   *   name: "www",
   *   type: "A",
   *   ttl: 3600,
   *   records: [{ value: "198.51.100.1", comment: "web server" }],
   * });
   * await client.actions.waitFor(action);
   * ```
   */
  createRRSet(
    idOrName: ZoneIdOrName,
    params: CreateRRSetParams,
    options?: RequestOptions,
  ): Promise<CreateRRSetResponse> {
    return this._post(
      path`/zones/${idOrName}/rrsets`,
      createRRSetResponseSchema,
      params,
      createRRSetRequestSchema,
      options,
    );
  }

  /**
   * Updates the labels of an RRSet.
   *
   * To change records or the TTL use `setRRSetRecords()`, `addRRSetRecords()`,
   * `removeRRSetRecords()`, `updateRRSetRecords()` and `changeRRSetTTL()`.
   *
   * @param idOrName - ID or name of the zone
   * @param name - Name of the RRSet
   * @param type - Type of the RRSet
   * @param params - Fields to update
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets-update-an-rrset
   *
   * @example
   * ```typescript
   * const { rrset } = await client.dns.updateRRSet("example.com", "www", "A", {
   *   labels: { environment: "production" },
   * });
   * ```
   */
  updateRRSet(
    idOrName: ZoneIdOrName,
    name: string,
    type: RRSetType,
    params: UpdateRRSetParams,
    options?: RequestOptions,
  ): Promise<UpdateRRSetResponse> {
    return this._put(
      rrsetPath(idOrName, name, type),
      updateRRSetResponseSchema,
      params,
      updateRRSetRequestSchema,
      options,
    );
  }

  /**
   * Deletes an RRSet.
   *
   * @param idOrName - ID or name of the zone
   * @param name - Name of the RRSet
   * @param type - Type of the RRSet
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zone-rrsets-delete-an-rrset
   *
   * @example
   * ```typescript
   * const { action } = await client.dns.deleteRRSet("example.com", "www", "A");
   * await client.actions.waitFor(action);
   * ```
   */
  deleteRRSet(
    idOrName: ZoneIdOrName,
    name: string,
    type: RRSetType,
    options?: RequestOptions,
  ): Promise<DeleteRRSetResponse> {
    return this._delete(rrsetPath(idOrName, name, type), actionResponseSchema, options);
  }

  // ---------------------------------------------------------------------------
  // RRSet actions
  // ---------------------------------------------------------------------------

  /**
   * Changes the protection of an RRSet.
   *
   * @param idOrName - ID or name of the zone
   * @param name - Name of the RRSet
   * @param type - Type of the RRSet
   * @param params - `change: true` prevents the RRSet from being changed or deleted
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-change-an-rrsets-protection
   *
   * @example
   * ```typescript
   * const { action } = await client.dns.changeRRSetProtection("example.com", "www", "A", {
   *   change: true,
   * });
   * ```
   */
  changeRRSetProtection(
    idOrName: ZoneIdOrName,
    name: string,
    type: RRSetType,
    params: ChangeRRSetProtectionParams,
    options?: RequestOptions,
  ): Promise<ChangeRRSetProtectionResponse> {
    return this._post(
      `${rrsetPath(idOrName, name, type)}/actions/change_protection`,
      actionResponseSchema,
      params,
      changeRRSetProtectionRequestSchema,
      options,
    );
  }

  /**
   * Changes the TTL of an RRSet.
   *
   * @param idOrName - ID or name of the zone
   * @param name - Name of the RRSet
   * @param type - Type of the RRSet
   * @param params - The new TTL in seconds, or `null` to use the default TTL of the zone
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-change-an-rrsets-ttl
   *
   * @example
   * ```typescript
   * const { action } = await client.dns.changeRRSetTTL("example.com", "www", "A", { ttl: 300 });
   * ```
   */
  changeRRSetTTL(
    idOrName: ZoneIdOrName,
    name: string,
    type: RRSetType,
    params: ChangeRRSetTTLParams,
    options?: RequestOptions,
  ): Promise<ChangeRRSetTTLResponse> {
    return this._post(
      `${rrsetPath(idOrName, name, type)}/actions/change_ttl`,
      actionResponseSchema,
      params,
      changeRRSetTTLRequestSchema,
      options,
    );
  }

  /**
   * Replaces all records of an RRSet.
   *
   * @param idOrName - ID or name of the zone
   * @param name - Name of the RRSet
   * @param type - Type of the RRSet
   * @param params - The new records
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-set-records-of-an-rrset
   *
   * @example
   * ```typescript
   * const { action } = await client.dns.setRRSetRecords("example.com", "www", "A", {
   *   records: [{ value: "198.51.100.1" }, { value: "198.51.100.2" }],
   * });
   * ```
   */
  setRRSetRecords(
    idOrName: ZoneIdOrName,
    name: string,
    type: RRSetType,
    params: SetRRSetRecordsParams,
    options?: RequestOptions,
  ): Promise<SetRRSetRecordsResponse> {
    return this._post(
      `${rrsetPath(idOrName, name, type)}/actions/set_records`,
      actionResponseSchema,
      params,
      setRRSetRecordsRequestSchema,
      options,
    );
  }

  /**
   * Adds records to an RRSet. The RRSet is created if it does not exist yet.
   *
   * @param idOrName - ID or name of the zone
   * @param name - Name of the RRSet
   * @param type - Type of the RRSet
   * @param params - Records to add and an optional TTL for the RRSet
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-add-records-to-an-rrset
   *
   * @example
   * ```typescript
   * const { action } = await client.dns.addRRSetRecords("example.com", "www", "A", {
   *   records: [{ value: "198.51.100.3", comment: "web server 3" }],
   * });
   * ```
   */
  addRRSetRecords(
    idOrName: ZoneIdOrName,
    name: string,
    type: RRSetType,
    params: AddRRSetRecordsParams,
    options?: RequestOptions,
  ): Promise<AddRRSetRecordsResponse> {
    return this._post(
      `${rrsetPath(idOrName, name, type)}/actions/add_records`,
      actionResponseSchema,
      params,
      addRRSetRecordsRequestSchema,
      options,
    );
  }

  /**
   * Removes records from an RRSet. The RRSet is deleted once it has no records left.
   *
   * @param idOrName - ID or name of the zone
   * @param name - Name of the RRSet
   * @param type - Type of the RRSet
   * @param params - Records to remove
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-remove-records-from-an-rrset
   *
   * @example
   * ```typescript
   * const { action } = await client.dns.removeRRSetRecords("example.com", "www", "A", {
   *   records: [{ value: "198.51.100.3" }],
   * });
   * ```
   */
  removeRRSetRecords(
    idOrName: ZoneIdOrName,
    name: string,
    type: RRSetType,
    params: RemoveRRSetRecordsParams,
    options?: RequestOptions,
  ): Promise<RemoveRRSetRecordsResponse> {
    return this._post(
      `${rrsetPath(idOrName, name, type)}/actions/remove_records`,
      actionResponseSchema,
      params,
      removeRRSetRecordsRequestSchema,
      options,
    );
  }

  /**
   * Updates the comments of existing records of an RRSet. Records are matched by their value.
   *
   * @param idOrName - ID or name of the zone
   * @param name - Name of the RRSet
   * @param type - Type of the RRSet
   * @param params - Records to update
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#zone-rrset-actions-update-records-of-an-rrset
   *
   * @example
   * ```typescript
   * const { action } = await client.dns.updateRRSetRecords("example.com", "www", "A", {
   *   records: [{ value: "198.51.100.1", comment: "primary web server" }],
   * });
   * ```
   */
  updateRRSetRecords(
    idOrName: ZoneIdOrName,
    name: string,
    type: RRSetType,
    params: UpdateRRSetRecordsParams,
    options?: RequestOptions,
  ): Promise<UpdateRRSetRecordsResponse> {
    return this._post(
      `${rrsetPath(idOrName, name, type)}/actions/update_records`,
      actionResponseSchema,
      params,
      updateRRSetRecordsRequestSchema,
      options,
    );
  }
}
