/**
 * Authentication for Hetzner Cloud API
 * @see https://docs.hetzner.cloud/reference/cloud#authentication
 */

/**
 * Creates the Authorization header with Bearer token
 * for Hetzner Cloud API requests.
 *
 * The API uses Bearer token authentication. Every request must include
 * the Authorization header with your API token.
 *
 * @param token - Hetzner Cloud API token
 * @returns Authorization header object
 * @throws {Error} If token is not provided
 * @see https://docs.hetzner.cloud/reference/cloud#authentication
 */
export function createAuthHeader(token: string): { Authorization: string } {
  if (!token || token.trim().length === 0) {
    throw new Error("API token is required for Hetzner Cloud API authentication");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}
