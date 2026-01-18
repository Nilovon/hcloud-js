/**
 * Hetzner Cloud DNS (Zones) API
 * @see https://docs.hetzner.cloud/reference/cloud#dns
 */

import type { HCloudClient } from "@hcloud-js/client/index.js";
import type {
  ListZonesParams,
  ListZonesResponse,
  CreateZoneParams,
  CreateZoneResponse,
  GetZoneResponse,
  UpdateZoneParams,
  UpdateZoneResponse,
  DeleteZoneResponse,
  ExportZoneResponse,
  ListZoneActionsParams,
  ListZoneActionsResponse,
  GetZoneActionResponse,
  ChangeZonePrimaryNameserversParams,
  ChangeZonePrimaryNameserversResponse,
  ChangeZoneProtectionParams,
  ChangeZoneProtectionResponse,
  ChangeZoneDefaultTTLParams,
  ChangeZoneDefaultTTLResponse,
  ImportZoneFileParams,
  ImportZoneFileResponse,
  ListRRSetsParams,
  ListRRSetsResponse,
  GetRRSetResponse,
  CreateRRSetParams,
  CreateRRSetResponse,
  UpdateRRSetParams,
  UpdateRRSetResponse,
  DeleteRRSetResponse,
  ChangeRRSetProtectionParams,
  ChangeRRSetProtectionResponse,
  ChangeRRSetTTLParams,
  ChangeRRSetTTLResponse,
  SetRRSetRecordsParams,
  SetRRSetRecordsResponse,
  AddRRSetRecordsParams,
  AddRRSetRecordsResponse,
  RemoveRRSetRecordsParams,
  RemoveRRSetRecordsResponse,
  UpdateRRSetRecordsParams,
  UpdateRRSetRecordsResponse,
} from "@hcloud-js/apis/dns/types.js";
import { validate } from "@hcloud-js/validation/index.js";
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
} from "@hcloud-js/apis/dns/schemas.js";

/**
 * DNS (Zones) API client
 */
export class DNSClient {
  constructor(private readonly client: HCloudClient) {}

  /**
   * Returns all Zone objects.
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of zones with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#zones-list-zones
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all zones
   * const result = await client.dns.listZones();
   *
   * // List zones with filters
   * const zones = await client.dns.listZones({
   *   name: 'example.com',
   *   label_selector: 'environment=production',
   *   sort: ['name:asc'],
   *   page: 1,
   *   per_page: 50
   * });
   * ```
   */
  async listZones(params?: ListZonesParams): Promise<ListZonesResponse> {
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

    if (params?.page !== undefined) {
      queryParams.page = params.page;
    }

    if (params?.per_page !== undefined) {
      queryParams.per_page = params.per_page;
    }

    const response = await this.client.get<unknown>("/zones", queryParams);

    return validate(listZonesResponseSchema, response, {
      context: "List zones response",
      detailed: true,
    });
  }

  /**
   * Creates a new Zone.
   *
   * @param params - Parameters for creating the zone
   * @returns Promise resolving to the created zone and action
   * @see https://docs.hetzner.cloud/reference/cloud#zones-create-a-zone
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const zone = await client.dns.createZone({
   *   name: 'example.com',
   *   ttl: 3600,
   *   labels: { environment: 'production' }
   * });
   * ```
   */
  async createZone(params: CreateZoneParams): Promise<CreateZoneResponse> {
    const validatedParams = validate(createZoneRequestSchema, params, {
      context: "Create zone request",
      detailed: true,
    });

    const response = await this.client.post<unknown>("/zones", validatedParams);

    return validate(createZoneResponseSchema, response, {
      context: "Create zone response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Zone object.
   *
   * @param idOrName - ID or name of the Zone
   * @returns Promise resolving to the zone
   * @see https://docs.hetzner.cloud/reference/cloud#zones-get-a-zone
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get a zone by ID or name
   * const zone = await client.dns.getZone('example.com');
   * console.log(zone.zone.name);
   * ```
   */
  async getZone(idOrName: string): Promise<GetZoneResponse> {
    const response = await this.client.get<unknown>(`/zones/${idOrName}`);

    return validate(getZoneResponseSchema, response, {
      context: "Get zone response",
      detailed: true,
    });
  }

  /**
   * Updates the Zone.
   *
   * You can update a Zone's TTL and labels.
   *
   * @param idOrName - ID or name of the Zone
   * @param params - Parameters to update (ttl and/or labels)
   * @returns Promise resolving to the updated zone
   * @see https://docs.hetzner.cloud/reference/cloud#zones-update-a-zone
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const updated = await client.dns.updateZone('example.com', {
   *   ttl: 7200,
   *   labels: { environment: 'production' }
   * });
   * ```
   */
  async updateZone(idOrName: string, params: UpdateZoneParams): Promise<UpdateZoneResponse> {
    const validatedParams = validate(updateZoneRequestSchema, params, {
      context: "Update zone request",
      detailed: true,
    });

    const response = await this.client.put<unknown>(`/zones/${idOrName}`, validatedParams);

    return validate(updateZoneResponseSchema, response, {
      context: "Update zone response",
      detailed: true,
    });
  }

  /**
   * Deletes a Zone.
   *
   * @param idOrName - ID or name of the Zone
   * @returns Promise resolving to empty object
   * @see https://docs.hetzner.cloud/reference/cloud#zones-delete-a-zone
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * await client.dns.deleteZone('example.com');
   * ```
   */
  async deleteZone(idOrName: string): Promise<DeleteZoneResponse> {
    const response = await this.client.delete<unknown>(`/zones/${idOrName}`);

    return validate(deleteZoneResponseSchema, response, {
      context: "Delete zone response",
      detailed: true,
    });
  }

  /**
   * Exports a Zone file.
   *
   * @param idOrName - ID or name of the Zone
   * @returns Promise resolving to the zone file content
   * @see https://docs.hetzner.cloud/reference/cloud#zones-export-a-zone-file
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const exported = await client.dns.exportZone('example.com');
   * console.log(exported.zone_file);
   * ```
   */
  async exportZone(idOrName: string): Promise<ExportZoneResponse> {
    const response = await this.client.get<unknown>(`/zones/${idOrName}/export`);

    return validate(exportZoneResponseSchema, response, {
      context: "Export zone response",
      detailed: true,
    });
  }

  /**
   * Returns all Action objects for a Zone.
   *
   * @param idOrName - ID or name of the Zone
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of actions with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#zones-list-actions-for-a-zone
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const actions = await client.dns.listZoneActions('example.com', {
   *   status: ['running'],
   *   sort: ['started:desc']
   * });
   * ```
   */
  async listZoneActions(
    idOrName: string,
    params?: ListZoneActionsParams,
  ): Promise<ListZoneActionsResponse> {
    const queryParams: Record<string, string | number | string[] | undefined> = {};

    if (params?.sort) {
      queryParams.sort = Array.isArray(params.sort) ? params.sort : [params.sort];
    }

    if (params?.status) {
      queryParams.status = Array.isArray(params.status) ? params.status : [params.status];
    }

    if (params?.page !== undefined) {
      queryParams.page = params.page;
    }

    if (params?.per_page !== undefined) {
      queryParams.per_page = params.per_page;
    }

    const response = await this.client.get<unknown>(`/zones/${idOrName}/actions`, queryParams);

    return validate(listZoneActionsResponseSchema, response, {
      context: "List zone actions response",
      detailed: true,
    });
  }

  /**
   * Returns a specific Action object for a Zone.
   *
   * @param idOrName - ID or name of the Zone
   * @param actionId - ID of the Action
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#zones-get-an-action-for-a-zone
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const action = await client.dns.getZoneAction('example.com', 12345);
   * console.log(action.action.command);
   * ```
   */
  async getZoneAction(idOrName: string, actionId: number): Promise<GetZoneActionResponse> {
    const response = await this.client.get<unknown>(`/zones/${idOrName}/actions/${actionId}`);

    return validate(getZoneActionResponseSchema, response, {
      context: "Get zone action response",
      detailed: true,
    });
  }

  /**
   * Changes the primary nameservers of a Zone.
   *
   * @param idOrName - ID or name of the Zone
   * @param params - Nameservers configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#zones-change-a-zones-primary-nameservers
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.dns.changeZonePrimaryNameservers('example.com', {
   *   nameservers: ['ns1.example.com', 'ns2.example.com']
   * });
   * ```
   */
  async changeZonePrimaryNameservers(
    idOrName: string,
    params: ChangeZonePrimaryNameserversParams,
  ): Promise<ChangeZonePrimaryNameserversResponse> {
    const validatedParams = validate(changeZonePrimaryNameserversRequestSchema, params, {
      context: "Change zone primary nameservers request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/zones/${idOrName}/actions/change_nameservers`,
      validatedParams,
    );

    return validate(changeZonePrimaryNameserversResponseSchema, response, {
      context: "Change zone primary nameservers response",
      detailed: true,
    });
  }

  /**
   * Changes the Protection configuration of a Zone.
   *
   * @param idOrName - ID or name of the Zone
   * @param params - Protection configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#zones-change-a-zones-protection
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.dns.changeZoneProtection('example.com', {
   *   delete: true
   * });
   * ```
   */
  async changeZoneProtection(
    idOrName: string,
    params: ChangeZoneProtectionParams,
  ): Promise<ChangeZoneProtectionResponse> {
    const validatedParams = validate(changeZoneProtectionRequestSchema, params, {
      context: "Change zone protection request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/zones/${idOrName}/actions/change_protection`,
      validatedParams,
    );

    return validate(changeZoneProtectionResponseSchema, response, {
      context: "Change zone protection response",
      detailed: true,
    });
  }

  /**
   * Changes the default TTL of a Zone.
   *
   * @param idOrName - ID or name of the Zone
   * @param params - TTL configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#zones-change-a-zones-default-ttl
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.dns.changeZoneDefaultTTL('example.com', {
   *   ttl: 7200
   * });
   * ```
   */
  async changeZoneDefaultTTL(
    idOrName: string,
    params: ChangeZoneDefaultTTLParams,
  ): Promise<ChangeZoneDefaultTTLResponse> {
    const validatedParams = validate(changeZoneDefaultTTLRequestSchema, params, {
      context: "Change zone default TTL request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/zones/${idOrName}/actions/change_ttl`,
      validatedParams,
    );

    return validate(changeZoneDefaultTTLResponseSchema, response, {
      context: "Change zone default TTL response",
      detailed: true,
    });
  }

  /**
   * Imports a Zone file.
   *
   * @param idOrName - ID or name of the Zone
   * @param params - Zone file content
   * @returns Promise resolving to the zone and action
   * @see https://docs.hetzner.cloud/reference/cloud#zones-import-a-zone-file
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.dns.importZoneFile('example.com', {
   *   zone_file: '$ORIGIN example.com.\n$TTL 3600\n...'
   * });
   * ```
   */
  async importZoneFile(
    idOrName: string,
    params: ImportZoneFileParams,
  ): Promise<ImportZoneFileResponse> {
    const validatedParams = validate(importZoneFileRequestSchema, params, {
      context: "Import zone file request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/zones/${idOrName}/actions/import`,
      validatedParams,
    );

    return validate(importZoneFileResponseSchema, response, {
      context: "Import zone file response",
      detailed: true,
    });
  }

  /**
   * Returns all RRSet objects for a Zone.
   *
   * @param idOrName - ID or name of the Zone
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to list of RRSets with pagination metadata
   * @see https://docs.hetzner.cloud/reference/cloud#rrsets-list-rrsets
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // List all RRSets for a zone
   * const rrsets = await client.dns.listRRSets('example.com');
   *
   * // List RRSets with filters
   * const aRecords = await client.dns.listRRSets('example.com', {
   *   type: 'A',
   *   name: 'www',
   *   sort: ['name:asc']
   * });
   * ```
   */
  async listRRSets(idOrName: string, params?: ListRRSetsParams): Promise<ListRRSetsResponse> {
    const queryParams: Record<string, string | number | string[] | undefined> = {};

    if (params?.name) {
      queryParams.name = params.name;
    }

    if (params?.type) {
      queryParams.type = params.type;
    }

    if (params?.label_selector) {
      queryParams.label_selector = params.label_selector;
    }

    if (params?.sort) {
      queryParams.sort = Array.isArray(params.sort) ? params.sort : [params.sort];
    }

    if (params?.page !== undefined) {
      queryParams.page = params.page;
    }

    if (params?.per_page !== undefined) {
      queryParams.per_page = params.per_page;
    }

    const response = await this.client.get<unknown>(`/zones/${idOrName}/rrsets`, queryParams);

    return validate(listRRSetsResponseSchema, response, {
      context: "List RRSets response",
      detailed: true,
    });
  }

  /**
   * Returns a specific RRSet object.
   *
   * @param idOrName - ID or name of the Zone
   * @param rrName - Name of the RRSet
   * @param rrType - Type of the RRSet
   * @returns Promise resolving to the RRSet
   * @see https://docs.hetzner.cloud/reference/cloud#rrsets-get-an-rrset
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const rrset = await client.dns.getRRSet('example.com', 'www', 'A');
   * console.log(rrset.rrset.name);
   * ```
   */
  async getRRSet(idOrName: string, rrName: string, rrType: string): Promise<GetRRSetResponse> {
    const response = await this.client.get<unknown>(
      `/zones/${idOrName}/rrsets/${rrName}/${rrType}`,
    );

    return validate(getRRSetResponseSchema, response, {
      context: "Get RRSet response",
      detailed: true,
    });
  }

  /**
   * Creates a new RRSet.
   *
   * @param idOrName - ID or name of the Zone
   * @param params - Parameters for creating the RRSet
   * @returns Promise resolving to the created RRSet and action
   * @see https://docs.hetzner.cloud/reference/cloud#rrsets-create-an-rrset
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const rrset = await client.dns.createRRSet('example.com', {
   *   name: 'www',
   *   type: 'A',
   *   ttl: 3600,
   *   records: [
   *     { value: '1.2.3.4', comment: 'Web server' }
   *   ]
   * });
   * ```
   */
  async createRRSet(idOrName: string, params: CreateRRSetParams): Promise<CreateRRSetResponse> {
    const validatedParams = validate(createRRSetRequestSchema, params, {
      context: "Create RRSet request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/zones/${idOrName}/rrsets`,
      validatedParams,
    );

    return validate(createRRSetResponseSchema, response, {
      context: "Create RRSet response",
      detailed: true,
    });
  }

  /**
   * Updates an RRSet.
   *
   * @param idOrName - ID or name of the Zone
   * @param rrName - Name of the RRSet
   * @param rrType - Type of the RRSet
   * @param params - Parameters to update
   * @returns Promise resolving to the updated RRSet and action
   * @see https://docs.hetzner.cloud/reference/cloud#rrsets-update-an-rrset
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const updated = await client.dns.updateRRSet('example.com', 'www', 'A', {
   *   ttl: 7200,
   *   records: [
   *     { value: '5.6.7.8', comment: 'Updated web server' }
   *   ]
   * });
   * ```
   */
  async updateRRSet(
    idOrName: string,
    rrName: string,
    rrType: string,
    params: UpdateRRSetParams,
  ): Promise<UpdateRRSetResponse> {
    const validatedParams = validate(updateRRSetRequestSchema, params, {
      context: "Update RRSet request",
      detailed: true,
    });

    const response = await this.client.put<unknown>(
      `/zones/${idOrName}/rrsets/${rrName}/${rrType}`,
      validatedParams,
    );

    return validate(updateRRSetResponseSchema, response, {
      context: "Update RRSet response",
      detailed: true,
    });
  }

  /**
   * Deletes an RRSet.
   *
   * @param idOrName - ID or name of the Zone
   * @param rrName - Name of the RRSet
   * @param rrType - Type of the RRSet
   * @returns Promise resolving to the delete action
   * @see https://docs.hetzner.cloud/reference/cloud#rrsets-delete-an-rrset
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.dns.deleteRRSet('example.com', 'www', 'A');
   * ```
   */
  async deleteRRSet(idOrName: string, rrName: string, rrType: string): Promise<DeleteRRSetResponse> {
    const response = await this.client.delete<unknown>(
      `/zones/${idOrName}/rrsets/${rrName}/${rrType}`,
    );

    return validate(deleteRRSetResponseSchema, response, {
      context: "Delete RRSet response",
      detailed: true,
    });
  }

  /**
   * Changes the Protection configuration of an RRSet.
   *
   * @param idOrName - ID or name of the Zone
   * @param rrName - Name of the RRSet
   * @param rrType - Type of the RRSet
   * @param params - Protection configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#rrsets-change-an-rrsets-protection
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.dns.changeRRSetProtection('example.com', 'www', 'A', {
   *   delete: true
   * });
   * ```
   */
  async changeRRSetProtection(
    idOrName: string,
    rrName: string,
    rrType: string,
    params: ChangeRRSetProtectionParams,
  ): Promise<ChangeRRSetProtectionResponse> {
    const validatedParams = validate(changeRRSetProtectionRequestSchema, params, {
      context: "Change RRSet protection request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/zones/${idOrName}/rrsets/${rrName}/${rrType}/actions/change_protection`,
      validatedParams,
    );

    return validate(changeRRSetProtectionResponseSchema, response, {
      context: "Change RRSet protection response",
      detailed: true,
    });
  }

  /**
   * Changes the TTL of an RRSet.
   *
   * @param idOrName - ID or name of the Zone
   * @param rrName - Name of the RRSet
   * @param rrType - Type of the RRSet
   * @param params - TTL configuration
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#rrsets-change-an-rrsets-ttl
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.dns.changeRRSetTTL('example.com', 'www', 'A', {
   *   ttl: 7200
   * });
   * ```
   */
  async changeRRSetTTL(
    idOrName: string,
    rrName: string,
    rrType: string,
    params: ChangeRRSetTTLParams,
  ): Promise<ChangeRRSetTTLResponse> {
    const validatedParams = validate(changeRRSetTTLRequestSchema, params, {
      context: "Change RRSet TTL request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/zones/${idOrName}/rrsets/${rrName}/${rrType}/actions/change_ttl`,
      validatedParams,
    );

    return validate(changeRRSetTTLResponseSchema, response, {
      context: "Change RRSet TTL response",
      detailed: true,
    });
  }

  /**
   * Sets all records of an RRSet.
   *
   * @param idOrName - ID or name of the Zone
   * @param rrName - Name of the RRSet
   * @param rrType - Type of the RRSet
   * @param params - Records to set
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#rrsets-set-records-of-an-rrset
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.dns.setRRSetRecords('example.com', 'www', 'A', {
   *   records: [
   *     { value: '1.2.3.4', comment: 'Web server' }
   *   ],
   *   ttl: 3600
   * });
   * ```
   */
  async setRRSetRecords(
    idOrName: string,
    rrName: string,
    rrType: string,
    params: SetRRSetRecordsParams,
  ): Promise<SetRRSetRecordsResponse> {
    const validatedParams = validate(setRRSetRecordsRequestSchema, params, {
      context: "Set RRSet records request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/zones/${idOrName}/rrsets/${rrName}/${rrType}/actions/set_records`,
      validatedParams,
    );

    return validate(setRRSetRecordsResponseSchema, response, {
      context: "Set RRSet records response",
      detailed: true,
    });
  }

  /**
   * Adds records to an RRSet.
   *
   * @param idOrName - ID or name of the Zone
   * @param rrName - Name of the RRSet
   * @param rrType - Type of the RRSet
   * @param params - Records to add
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#rrsets-add-records-to-an-rrset
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.dns.addRRSetRecords('example.com', 'www', 'A', {
   *   records: [
   *     { value: '5.6.7.8', comment: 'Additional server' }
   *   ],
   *   ttl: 3600
   * });
   * ```
   */
  async addRRSetRecords(
    idOrName: string,
    rrName: string,
    rrType: string,
    params: AddRRSetRecordsParams,
  ): Promise<AddRRSetRecordsResponse> {
    const validatedParams = validate(addRRSetRecordsRequestSchema, params, {
      context: "Add RRSet records request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/zones/${idOrName}/rrsets/${rrName}/${rrType}/actions/add_records`,
      validatedParams,
    );

    return validate(addRRSetRecordsResponseSchema, response, {
      context: "Add RRSet records response",
      detailed: true,
    });
  }

  /**
   * Removes records from an RRSet.
   *
   * @param idOrName - ID or name of the Zone
   * @param rrName - Name of the RRSet
   * @param rrType - Type of the RRSet
   * @param params - Records to remove
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#rrsets-remove-records-from-an-rrset
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.dns.removeRRSetRecords('example.com', 'www', 'A', {
   *   records: [
   *     { value: '1.2.3.4', comment: null }
   *   ]
   * });
   * ```
   */
  async removeRRSetRecords(
    idOrName: string,
    rrName: string,
    rrType: string,
    params: RemoveRRSetRecordsParams,
  ): Promise<RemoveRRSetRecordsResponse> {
    const validatedParams = validate(removeRRSetRecordsRequestSchema, params, {
      context: "Remove RRSet records request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/zones/${idOrName}/rrsets/${rrName}/${rrType}/actions/remove_records`,
      validatedParams,
    );

    return validate(removeRRSetRecordsResponseSchema, response, {
      context: "Remove RRSet records response",
      detailed: true,
    });
  }

  /**
   * Updates records of an RRSet.
   *
   * @param idOrName - ID or name of the Zone
   * @param rrName - Name of the RRSet
   * @param rrType - Type of the RRSet
   * @param params - Records to update
   * @returns Promise resolving to the action
   * @see https://docs.hetzner.cloud/reference/cloud#rrsets-update-records-of-an-rrset
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * const result = await client.dns.updateRRSetRecords('example.com', 'www', 'A', {
   *   records: [
   *     { value: '1.2.3.4', comment: 'Updated comment' }
   *   ]
   * });
   * ```
   */
  async updateRRSetRecords(
    idOrName: string,
    rrName: string,
    rrType: string,
    params: UpdateRRSetRecordsParams,
  ): Promise<UpdateRRSetRecordsResponse> {
    const validatedParams = validate(updateRRSetRecordsRequestSchema, params, {
      context: "Update RRSet records request",
      detailed: true,
    });

    const response = await this.client.post<unknown>(
      `/zones/${idOrName}/rrsets/${rrName}/${rrType}/actions/update_records`,
      validatedParams,
    );

    return validate(updateRRSetRecordsResponseSchema, response, {
      context: "Update RRSet records response",
      detailed: true,
    });
  }
}
