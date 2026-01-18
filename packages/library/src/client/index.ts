/**
 * Hetzner Cloud API Client
 * @see https://docs.hetzner.cloud/reference/cloud
 */

import type { RequestOptions } from "../types/index";  
import type { ClientOptions } from "../config/index";
import { HCLOUD_API_BASE_URL, DEFAULT_TIMEOUT_MS } from "../config/index";
import { createAuthHeader } from "../auth/index";
import { HCloudError } from "../errors/index";
import type { ApiErrorResponse } from "../types/index";
import { ServersClient } from "../apis/servers/index";
import { ImagesClient } from "../apis/images/index";
import { ActionsClient } from "../apis/actions/index";
import { CertificatesClient } from "../apis/certificates/index";
  import { SSHKeysClient } from "../apis/ssh-keys/index";
import { LocationsClient } from "../apis/locations/index";
import { FirewallsClient } from "../apis/firewalls/index";
import { FloatingIPsClient } from "../apis/floating-ips/index";
import { ISOsClient } from "../apis/isos/index";
import { PlacementGroupsClient } from "../apis/placement-groups/index";
import { PrimaryIPsClient } from "../apis/primary-ips/index";
import { ServerTypesClient } from "../apis/server-types/index";
import { LoadBalancersClient } from "../apis/load-balancers/index";
import { NetworksClient } from "../apis/networks/index";
import { PricingClient } from "../apis/pricing/index";
import { VolumesClient } from "../apis/volumes/index";
import { DNSClient } from "../apis/dns/index";
import type { HeadersInit } from "bun";

/**
 * Hetzner Cloud API Client
 *
 * This is the main client class for interacting with the Hetzner Cloud API.
 * It handles authentication, request/response processing, and error handling.
 *
 * @example
 * ```typescript
 * import { HCloudClient } from '@hcloud-js/library';
 *
 * const client = new HCloudClient({
 *   token: 'your-api-token'
 * });
 *
 * const servers = await client.get('/servers');
 * ```
 */
export class HCloudClient {
  private readonly token: string;
  private readonly baseUrl: string;
  private readonly timeout: number;

  /**
   * Servers API client
   * @see https://docs.hetzner.cloud/reference/cloud#servers
   */
  public readonly servers: ServersClient;

  /**
   * Images API client
   * @see https://docs.hetzner.cloud/reference/cloud#images
   */
  public readonly images: ImagesClient;

  /**
   * Actions API client
   * @see https://docs.hetzner.cloud/reference/cloud#actions
   */
  public readonly actions: ActionsClient;

  /**
   * Certificates API client
   * @see https://docs.hetzner.cloud/reference/cloud#certificates
   */
  public readonly certificates: CertificatesClient;

  /**
   * SSH Keys API client
   * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys
   */
  public readonly sshKeys: SSHKeysClient;

  /**
   * Locations API client
   * @see https://docs.hetzner.cloud/reference/cloud#locations
   */
  public readonly locations: LocationsClient;

  /**
   * Firewalls API client
   * @see https://docs.hetzner.cloud/reference/cloud#firewalls
   */
  public readonly firewalls: FirewallsClient;

  /**
   * Floating IPs API client
   * @see https://docs.hetzner.cloud/reference/cloud#floating-ips
   */
  public readonly floatingIPs: FloatingIPsClient;

  /**
   * ISOs API client
   * @see https://docs.hetzner.cloud/reference/cloud#isos
   */
  public readonly isos: ISOsClient;

  /**
   * Placement Groups API client
   * @see https://docs.hetzner.cloud/reference/cloud#placement-groups
   */
  public readonly placementGroups: PlacementGroupsClient;

  /**
   * Primary IPs API client
   * @see https://docs.hetzner.cloud/reference/cloud#primary-ips
   */
  public readonly primaryIPs: PrimaryIPsClient;

  /**
   * Server Types API client
   * @see https://docs.hetzner.cloud/reference/cloud#server-types
   */
  public readonly serverTypes: ServerTypesClient;

  /**
   * Load Balancers API client
   * @see https://docs.hetzner.cloud/reference/cloud#load-balancers
   */
  public readonly loadBalancers: LoadBalancersClient;

  /**
   * Networks API client
   * @see https://docs.hetzner.cloud/reference/cloud#networks
   */
  public readonly networks: NetworksClient;

  /**
   * Pricing API client
   * @see https://docs.hetzner.cloud/reference/cloud#pricing
   */
  public readonly pricing: PricingClient;

  /**
   * Volumes API client
   * @see https://docs.hetzner.cloud/reference/cloud#volumes
   */
  public readonly volumes: VolumesClient;

  /**
   * DNS (Zones) API client
   * @see https://docs.hetzner.cloud/reference/cloud#dns
   */
  public readonly dns: DNSClient;

  /**
   * Creates a new Hetzner Cloud API client
   *
   * @param options - Client configuration options
   * @throws {HCloudError} If token is not provided
   */
  constructor(options: ClientOptions) {
    if (!options.token || options.token.trim().length === 0) {
      throw new HCloudError("API token is required", "INVALID_TOKEN");
    }

    this.token = options.token;
    this.baseUrl = options.baseUrl ?? HCLOUD_API_BASE_URL;
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT_MS;

    // Initialize API clients
    this.servers = new ServersClient(this);
    this.images = new ImagesClient(this);
    this.actions = new ActionsClient(this);
    this.certificates = new CertificatesClient(this);
    this.sshKeys = new SSHKeysClient(this);
    this.locations = new LocationsClient(this);
    this.firewalls = new FirewallsClient(this);
    this.floatingIPs = new FloatingIPsClient(this);
    this.isos = new ISOsClient(this);
    this.placementGroups = new PlacementGroupsClient(this);
    this.primaryIPs = new PrimaryIPsClient(this);
    this.serverTypes = new ServerTypesClient(this);
    this.loadBalancers = new LoadBalancersClient(this);
    this.networks = new NetworksClient(this);
    this.pricing = new PricingClient(this);
    this.volumes = new VolumesClient(this);
    this.dns = new DNSClient(this);
  }

  /**
   * Make an HTTP request to the Hetzner Cloud API
   *
   * @param options - Request options
   * @returns Promise resolving to the response data
   * @throws {HCloudError} If the request fails
   */
  async request<T>(options: RequestOptions): Promise<T> {
    const { method = "GET", path, body, params, headers = {} } = options;

    // Build URL with query parameters
    const baseUrlWithoutTrailingSlash = this.baseUrl.replace(/\/$/, "");
    const pathWithoutLeadingSlash = path.replace(/^\//, "");
    const url = new URL(`${baseUrlWithoutTrailingSlash}/${pathWithoutLeadingSlash}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Handle array values (e.g., sort, status) - append each value separately
          if (Array.isArray(value)) {
            value.forEach((item) => {
              url.searchParams.append(key, String(item));
            });
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    // Prepare request headers with authentication
    const authHeader = createAuthHeader(this.token);
    const requestHeaders: HeadersInit = {
      ...authHeader,
      "Content-Type": "application/json",
      "User-Agent": "hcloud-ts",
      ...headers,
    };

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(this.timeout),
    };

    // Add body for non-GET requests
    if (body !== undefined && method !== "GET") {
      fetchOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url.toString(), fetchOptions);

      // Handle error responses
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Handle empty responses (e.g., 204 No Content)
      if (response.status === 204 || response.headers.get("content-length") === "0") {
        return undefined as T;
      }

      // Parse JSON response
      return (await response.json()) as T;
    } catch (error: unknown) {
      // Re-throw HCloudError as-is
      if (error instanceof HCloudError) {
        throw error;
      }

      // Handle fetch errors (network, timeout, etc.)
      this.handleFetchError(error);
    }
  }

  /**
   * Handle error responses from the API
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `HTTP ${response.status} ${response.statusText}`;
    let errorCode: string | undefined;
    let errorDetails: ApiErrorResponse["error"]["details"];

    try {
      const errorData = (await response.json()) as ApiErrorResponse;
      if (errorData.error) {
        errorMessage = errorData.error.message || errorMessage;
        errorCode = errorData.error.code;
        errorDetails = errorData.error.details;
      }
    } catch {
      // If error response is not JSON, use default message
    }

    throw new HCloudError(errorMessage, errorCode, response.status, errorDetails);
  }

  /**
   * Handle fetch errors (network, timeout, etc.)
   */
  private handleFetchError(error: unknown): never {
    if (error instanceof Error) {
      if (error.name === "AbortError" || error.message.includes("timeout")) {
        throw new HCloudError(`Request timeout after ${this.timeout}ms`, "TIMEOUT", 0);
      }
      throw new HCloudError(`Request failed: ${error.message}`, "NETWORK_ERROR", 0);
    }

    throw new HCloudError("Unknown error occurred", "UNKNOWN_ERROR", 0);
  }

  /**
   * GET request
   *
   * @param path - API endpoint path
   * @param params - Query parameters
   * @param headers - Additional headers
   * @returns Promise resolving to the response data
   */
  async get<T>(
    path: string,
    params?: RequestOptions["params"],
    headers?: RequestOptions["headers"],
  ): Promise<T> {
    return this.request<T>({ method: "GET", path, params, headers });
  }

  /**
   * POST request
   *
   * @param path - API endpoint path
   * @param body - Request body
   * @param params - Query parameters
   * @param headers - Additional headers
   * @returns Promise resolving to the response data
   */
  async post<T>(
    path: string,
    body?: unknown,
    params?: RequestOptions["params"],
    headers?: RequestOptions["headers"],
  ): Promise<T> {
    return this.request<T>({ method: "POST", path, body, params, headers });
  }

  /**
   * PUT request
   *
   * @param path - API endpoint path
   * @param body - Request body
   * @param params - Query parameters
   * @param headers - Additional headers
   * @returns Promise resolving to the response data
   */
  async put<T>(
    path: string,
    body?: unknown,
    params?: RequestOptions["params"],
    headers?: RequestOptions["headers"],
  ): Promise<T> {
    return this.request<T>({ method: "PUT", path, body, params, headers });
  }

  /**
   * PATCH request
   *
   * @param path - API endpoint path
   * @param body - Request body
   * @param params - Query parameters
   * @param headers - Additional headers
   * @returns Promise resolving to the response data
   */
  async patch<T>(
    path: string,
    body?: unknown,
    params?: RequestOptions["params"],
    headers?: RequestOptions["headers"],
  ): Promise<T> {
    return this.request<T>({ method: "PATCH", path, body, params, headers });
  }

  /**
   * DELETE request
   *
   * @param path - API endpoint path
   * @param params - Query parameters
   * @param headers - Additional headers
   * @returns Promise resolving to the response data
   */
  async delete<T>(
    path: string,
    params?: RequestOptions["params"],
    headers?: RequestOptions["headers"],
  ): Promise<T> {
    return this.request<T>({ method: "DELETE", path, params, headers });
  }
}
