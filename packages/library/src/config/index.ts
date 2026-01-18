/**
 * Configuration for Hetzner Cloud API Client
 */

/**
 * Default base URL for Hetzner Cloud API
 * @see https://docs.hetzner.cloud/
 */
export const HCLOUD_API_BASE_URL = "https://api.hetzner.cloud/v1";

/**
 * Default request timeout in milliseconds
 */
export const DEFAULT_TIMEOUT_MS = 30000;

/**
 * Client configuration options
 */
export interface ClientOptions {
  /**
   * Hetzner Cloud API token (Bearer token)
   * Get your API token from: https://console.hetzner.cloud/
   * @see https://docs.hetzner.cloud/reference/cloud#authentication
   */
  token: string;
  /**
   * Custom base URL (defaults to official Hetzner Cloud API)
   */
  baseUrl?: string;
  /**
   * Request timeout in milliseconds (defaults to 30000)
   */
  timeout?: number;
}
