/**
 * Configuration for the example application
 * Loads environment variables and provides configuration
 */

/**
 * Application configuration
 */
export const config = {
  /**
   * Hetzner Cloud API token
   * Set via HCLOUD_API_TOKEN environment variable
   */
  token: process.env.HCLOUD_API_TOKEN || "",

  /**
   * Hetzner Cloud API base URL
   * Defaults to the official Hetzner Cloud API URL
   */
  baseUrl: process.env.HCLOUD_API_BASE_URL || "https://api.hetzner.cloud/v1",

  /**
   * Request timeout in milliseconds
   */
  timeout: Number.parseInt(process.env.HCLOUD_API_TIMEOUT || "30000", 10),
};
