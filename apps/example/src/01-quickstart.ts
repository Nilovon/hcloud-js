/**
 * Quickstart: read-only tour through an account.
 *
 *   bun run quickstart
 */
import { createExampleClient } from "./client";

const client = createExampleClient();

const [servers, sshKeys, firewalls, volumes] = await Promise.all([
  client.servers.listAll(),
  client.sshKeys.listAll(),
  client.firewalls.listAll(),
  client.volumes.listAll(),
]);

console.log(`Servers (${servers.length})`);
for (const server of servers) {
  const ip = server.public_net.ipv4?.ip ?? "no public IPv4";
  console.log(`  ${server.name.padEnd(24)} ${server.status.padEnd(12)} ${server.server_type.name} ${ip}`);
}

console.log(`SSH keys (${sshKeys.length})`);
for (const key of sshKeys) console.log(`  ${key.name} ${key.fingerprint}`);

console.log(`Firewalls: ${firewalls.length}, volumes: ${volumes.length}`);

const { locations } = await client.locations.list();
console.log(`Locations: ${locations.map((location) => location.name).join(", ")}`);

// The rate limit state of the most recent response is always available.
if (client.rateLimit) {
  console.log(`Rate limit: ${client.rateLimit.remaining}/${client.rateLimit.limit} requests left`);
}
