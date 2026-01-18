/**
 * Servers API Examples
 * Demonstrates how to use the Servers API endpoints
 * @see https://docs.hetzner.cloud/reference/cloud#servers
 */

import { HCloudClient } from "@nilovonjs/hcloud-js";
import { config } from "../config";

/**
 * Run all server API examples
 */
export async function runServerExamples() {
  const client = new HCloudClient({
    token: config.token,
    baseUrl: config.baseUrl,
    timeout: config.timeout,
  });

  try {
    // Example 1: List all servers
    console.log("\n1️⃣  Listing all servers...");
    const serversList = await client.servers.list();
    console.log(`   Found ${serversList.servers.length} server(s)`);
    
    if (serversList.servers.length > 0) {
      serversList.servers.forEach((server) => {
        console.log(`   - Server #${server.id}: ${server.name} (${server.status})`);
      });
    } else {
      console.log("   No servers found");
    }

    // Example 2: List servers with filters
    console.log("\n2️⃣  Listing servers with filters...");
    const filteredServers = await client.servers.list({
      status: ["running"],
      sort: ["name:asc"],
      per_page: 10,
    });
    console.log(`   Found ${filteredServers.servers.length} running server(s)`);

    // Example 3: Get a specific server (if any exist)
    if (serversList.servers.length > 0 && serversList.servers[0]) {
      const firstServer = serversList.servers[0];
      console.log(`\n3️⃣  Getting server #${firstServer.id}...`);
      const server = await client.servers.get(firstServer.id);
      console.log(`   Server Name: ${server.server.name}`);
      console.log(`   Status: ${server.server.status}`);
      console.log(`   Type: ${server.server.server_type.name}`);
      console.log(`   Image: ${server.server.image.name}`);
      console.log(`   Location: ${server.server.datacenter.location.name}`);
      console.log(`   Created: ${server.server.created}`);

      // Example 4: Get server metrics (if server has public network)
      console.log(`\n4️⃣  Getting server metrics...`);
      try {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const serverId = server.server.id;

        const metrics = await client.servers.getMetrics(serverId, {
          type: ["cpu", "network"],
          start: oneHourAgo.toISOString(),
          end: now.toISOString(),
        });
        console.log(`   Metrics retrieved successfully`);
        console.log(`   Time series: ${Object.keys(metrics.metrics.time_series).length} metric(s)`);
      } catch (error) {
        console.log(`   ⚠️  Could not retrieve metrics: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    } else {
      console.log("\n3️⃣  Skipping server details (no servers available)");
    }

    console.log("\n✅ Servers API examples completed");
  } catch (error) {
    console.error("❌ Error in servers examples:", error);
    throw error;
  }
}
