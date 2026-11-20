/**
 * Hetzner Cloud API Client
 * @see https://docs.hetzner.cloud/reference/cloud
 */

import { ActionsClient } from "./apis/actions/index";
import { CertificatesClient } from "./apis/certificates/index";
import { DatacentersClient } from "./apis/datacenters/index";
import { DNSClient } from "./apis/dns/index";
import { FirewallsClient } from "./apis/firewalls/index";
import { FloatingIPsClient } from "./apis/floating-ips/index";
import { ImagesClient } from "./apis/images/index";
import { ISOsClient } from "./apis/isos/index";
import { LoadBalancerTypesClient } from "./apis/load-balancer-types/index";
import { LoadBalancersClient } from "./apis/load-balancers/index";
import { LocationsClient } from "./apis/locations/index";
import { NetworksClient } from "./apis/networks/index";
import { PlacementGroupsClient } from "./apis/placement-groups/index";
import { PricingClient } from "./apis/pricing/index";
import { PrimaryIPsClient } from "./apis/primary-ips/index";
import { ServerTypesClient } from "./apis/server-types/index";
import { ServersClient } from "./apis/servers/index";
import { SSHKeysClient } from "./apis/ssh-keys/index";
import { StorageBoxTypesClient } from "./apis/storage-box-types/index";
import { StorageBoxesClient } from "./apis/storage-boxes/index";
import { VolumesClient } from "./apis/volumes/index";
import { BaseClient } from "./core/base-client";
import type { ClientOptions } from "./core/types";

/**
 * Hetzner Cloud API client.
 *
 * Handles authentication, retries, rate limits, timeouts and error handling and
 * exposes one sub-client per API resource.
 *
 * @example
 * ```typescript
 * import { HCloudClient } from "@nilovonjs/hcloud-js";
 *
 * // Reads the token from the HCLOUD_TOKEN environment variable
 * const client = new HCloudClient();
 *
 * // ...or pass it explicitly
 * const client = new HCloudClient({ token: "your-api-token" });
 *
 * const { servers } = await client.servers.list();
 * ```
 */
export class HCloudClient extends BaseClient {
  /**
   * Actions API - track asynchronous operations and wait for them to finish
   * @see https://docs.hetzner.cloud/reference/cloud#actions
   */
  public readonly actions: ActionsClient;

  /**
   * Certificates API
   * @see https://docs.hetzner.cloud/reference/cloud#certificates
   */
  public readonly certificates: CertificatesClient;

  /**
   * Datacenters API
   * @deprecated Datacenters are deprecated by Hetzner. Use {@link HCloudClient.locations} instead.
   * @see https://docs.hetzner.cloud/changelog#2026-06-02-datacenters-deprecated
   */
  public readonly datacenters: DatacentersClient;

  /**
   * DNS API - zones and resource record sets (RRSets)
   * @see https://docs.hetzner.cloud/reference/cloud#zones
   */
  public readonly dns: DNSClient;

  /**
   * Firewalls API
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls
   */
  public readonly firewalls: FirewallsClient;

  /**
   * Floating IPs API
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips
   */
  public readonly floatingIPs: FloatingIPsClient;

  /**
   * Images API
   * @see https://docs.hetzner.cloud/reference/cloud#images
   */
  public readonly images: ImagesClient;

  /**
   * ISOs API
   * @see https://docs.hetzner.cloud/reference/cloud#isos
   */
  public readonly isos: ISOsClient;

  /**
   * Load Balancer Types API
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancer-types
   */
  public readonly loadBalancerTypes: LoadBalancerTypesClient;

  /**
   * Load Balancers API
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers
   */
  public readonly loadBalancers: LoadBalancersClient;

  /**
   * Locations API
   * @see https://docs.hetzner.cloud/reference/cloud#locations
   */
  public readonly locations: LocationsClient;

  /**
   * Networks API
   * @see https://docs.hetzner.cloud/reference/cloud#networks
   */
  public readonly networks: NetworksClient;

  /**
   * Placement Groups API
   * @see https://docs.hetzner.cloud/reference/cloud#placement-groups
   */
  public readonly placementGroups: PlacementGroupsClient;

  /**
   * Pricing API
   * @see https://docs.hetzner.cloud/reference/cloud#pricing
   */
  public readonly pricing: PricingClient;

  /**
   * Primary IPs API
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips
   */
  public readonly primaryIPs: PrimaryIPsClient;

  /**
   * Server Types API
   * @see https://docs.hetzner.cloud/reference/cloud#server-types
   */
  public readonly serverTypes: ServerTypesClient;

  /**
   * Servers API
   * @see https://docs.hetzner.cloud/reference/cloud#servers
   */
  public readonly servers: ServersClient;

  /**
   * SSH Keys API
   * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys
   */
  public readonly sshKeys: SSHKeysClient;

  /**
   * Storage Box Types API (Hetzner API)
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-types
   */
  public readonly storageBoxTypes: StorageBoxTypesClient;

  /**
   * Storage Boxes API (Hetzner API)
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-boxes
   */
  public readonly storageBoxes: StorageBoxesClient;

  /**
   * Volumes API
   * @see https://docs.hetzner.cloud/reference/cloud#volumes
   */
  public readonly volumes: VolumesClient;

  /**
   * Creates a new Hetzner Cloud API client.
   *
   * @param options - Client options, or just the API token
   * @throws {HCloudError} If no token is provided and `HCLOUD_TOKEN` is not set
   */
  constructor(options: ClientOptions | string = {}) {
    super(options);

    this.actions = new ActionsClient(this);
    this.certificates = new CertificatesClient(this);
    this.datacenters = new DatacentersClient(this);
    this.dns = new DNSClient(this);
    this.firewalls = new FirewallsClient(this);
    this.floatingIPs = new FloatingIPsClient(this);
    this.images = new ImagesClient(this);
    this.isos = new ISOsClient(this);
    this.loadBalancerTypes = new LoadBalancerTypesClient(this);
    this.loadBalancers = new LoadBalancersClient(this);
    this.locations = new LocationsClient(this);
    this.networks = new NetworksClient(this);
    this.placementGroups = new PlacementGroupsClient(this);
    this.pricing = new PricingClient(this);
    this.primaryIPs = new PrimaryIPsClient(this);
    this.serverTypes = new ServerTypesClient(this);
    this.servers = new ServersClient(this);
    this.sshKeys = new SSHKeysClient(this);
    this.storageBoxTypes = new StorageBoxTypesClient(this);
    this.storageBoxes = new StorageBoxesClient(this);
    this.volumes = new VolumesClient(this);
  }
}

/**
 * Create a new client. Equivalent to `new HCloudClient(options)`.
 *
 * @example
 * ```typescript
 * import { createClient } from "@nilovonjs/hcloud-js";
 *
 * const hcloud = createClient({ token: process.env.HCLOUD_TOKEN });
 * ```
 */
export function createClient(options?: ClientOptions | string): HCloudClient {
  return new HCloudClient(options);
}
