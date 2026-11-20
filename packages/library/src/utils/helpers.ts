/**
 * Legacy helper functions. All of them are available as methods on the
 * resource clients now.
 */

import type { WaitForActionOptions } from "../apis/actions/types";
import type { FloatingIP } from "../apis/floating-ips/types";
import type { Image } from "../apis/images/types";
import type { CreateServerParams, Server } from "../apis/servers/types";
import type { HCloudClient } from "../client";

/**
 * Create a server and wait until all of its actions have finished.
 *
 * @deprecated Use `client.servers.createAndWait(params)` instead.
 */
export async function createAndWaitForServer(
  client: HCloudClient,
  params: CreateServerParams,
  options?: WaitForActionOptions,
): Promise<Server> {
  const { server } = await client.servers.createAndWait(params, options);
  return server;
}

/**
 * Find a server by name.
 *
 * @deprecated Use `client.servers.getByName(name)` instead.
 */
export function findServerByName(client: HCloudClient, name: string): Promise<Server | undefined> {
  return client.servers.getByName(name);
}

/**
 * Find an image by name.
 *
 * @deprecated Use `client.images.getByName(name)` instead.
 */
export function findImageByName(client: HCloudClient, name: string): Promise<Image | undefined> {
  return client.images.getByName(name);
}

/**
 * Find a floating IP by its IP address.
 *
 * @deprecated Use `client.floatingIPs.getByIP(ip)` instead.
 */
export function findFloatingIPByIP(
  client: HCloudClient,
  ip: string,
): Promise<FloatingIP | undefined> {
  return client.floatingIPs.getByIP(ip);
}
