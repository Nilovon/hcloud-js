/**
 * Helper functions for common operations
 */

import type { HCloudClient } from "../client/index";
import type { Server } from "../apis/servers/types";
import type { Image } from "../apis/images/types";
import type { FloatingIP } from "../apis/floating-ips/types";
import { pollAction } from "./actions";

/**
 * Create a server and wait for it to be running
 *
 * @param client - HCloudClient instance
 * @param params - Server creation parameters
 * @param options - Options for waiting (poll interval, timeout)
 * @returns Promise resolving to the created and running server
 *
 * @example
 * ```typescript
 * const client = new HCloudClient({ token: 'your-token' });
 *
 * const server = await createAndWaitForServer(client, {
 *   name: 'my-server',
 *   server_type: 'cpx11',
 *   image: 'ubuntu-22.04',
 *   location: 'nbg1'
 * });
 *
 * console.log(`Server ${server.server.name} is now running!`);
 * ```
 */
export async function createAndWaitForServer(
  client: HCloudClient,
  params: Parameters<HCloudClient["servers"]["create"]>[0],
  options?: Parameters<typeof pollAction>[2],
): Promise<Server> {
  const result = await client.servers.create(params);

  if (result.action) {
    await pollAction(client, result.action.id, options);
  }

  // Fetch the server to get its current state
  const server = await client.servers.get(result.server.id);
  return server.server;
}

/**
 * Find a server by name
 *
 * @param client - HCloudClient instance
 * @param name - Server name to search for
 * @returns Promise resolving to the server or undefined if not found
 *
 * @example
 * ```typescript
 * const client = new HCloudClient({ token: 'your-token' });
 *
 * const server = await findServerByName(client, 'my-server');
 * if (server) {
 *   console.log(`Found server: ${server.name}`);
 * }
 * ```
 */
export async function findServerByName(
  client: HCloudClient,
  name: string,
): Promise<Server | undefined> {
  const result = await client.servers.list({ name });
  return result.servers.find((s) => s.name === name);
}

/**
 * Find an image by name
 *
 * @param client - HCloudClient instance
 * @param name - Image name to search for
 * @returns Promise resolving to the image or undefined if not found
 *
 * @example
 * ```typescript
 * const client = new HCloudClient({ token: 'your-token' });
 *
 * const image = await findImageByName(client, 'ubuntu-22.04');
 * if (image) {
 *   console.log(`Found image: ${image.name}`);
 * }
 * ```
 */
export async function findImageByName(
  client: HCloudClient,
  name: string,
): Promise<Image | undefined> {
  const result = await client.images.list({ name });
  return result.images.find((img: Image) => img.name === name);
}

/**
 * Find a floating IP by IP address
 *
 * @param client - HCloudClient instance
 * @param ip - IP address to search for
 * @returns Promise resolving to the floating IP or undefined if not found
 *
 * @example
 * ```typescript
 * const client = new HCloudClient({ token: 'your-token' });
 *
 * const floatingIP = await findFloatingIPByIP(client, '1.2.3.4');
 * if (floatingIP) {
 *   console.log(`Found floating IP: ${floatingIP.ip}`);
 * }
 * ```
 */
export async function findFloatingIPByIP(
  client: HCloudClient,
  ip: string,
): Promise<FloatingIP | undefined> {
  const result = await client.floatingIPs.list();
  return result.floating_ips.find((fip) => fip.ip === ip);
}