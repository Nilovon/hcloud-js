/**
 * Server lifecycle: create a server, wait for it, power-cycle it, delete it.
 *
 *   HCLOUD_EXAMPLE_WRITE=1 bun run server
 */
import { createExampleClient, requireWriteAccess } from "./client";

requireWriteAccess();
const client = createExampleClient();
const name = `hcloud-js-example-${Date.now()}`;

console.log(`Creating server ${name}...`);
const { server, root_password } = await client.servers.createAndWait(
  {
    name,
    server_type: "cx22",
    image: "ubuntu-24.04",
    location: "nbg1",
    labels: { "managed-by": "hcloud-js-example" },
  },
  { onProgress: (action) => console.log(`  ${action.command}: ${action.progress}%`) },
);
console.log(`Server ${server.id} is ${server.status} at ${server.public_net.ipv4?.ip}`);
console.log(`Root password: ${root_password ? "(received)" : "(none, SSH keys used)"}`);

try {
  // Every mutating call returns an action. Pass the response to waitFor().
  console.log("Shutting down gracefully...");
  await client.actions.waitFor(await client.servers.shutdown(server.id));
  await client.servers.waitForStatus(server.id, "off");

  console.log("Powering on...");
  await client.actions.waitFor(await client.servers.powerOn(server.id));

  console.log("Updating labels...");
  await client.servers.update(server.id, {
    labels: { "managed-by": "hcloud-js-example", step: "done" },
  });
} finally {
  console.log("Deleting server...");
  await client.actions.waitFor(await client.servers.delete(server.id));
  console.log("Done.");
}
