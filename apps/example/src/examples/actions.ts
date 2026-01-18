/**
 * Actions API Examples
 * Demonstrates how to use the Actions API endpoints
 * 
 * Note: As of 2025-01-30, the Hetzner Cloud API removed the ability to list arbitrary actions.
 * Actions can only be retrieved individually by ID, typically obtained from resource operations
 * (e.g., server creation, image deletion, etc.).
 * 
 * @see https://docs.hetzner.cloud/reference/cloud#actions
 * @see https://docs.hetzner.cloud/changelog#2025-01-30-listing-arbitrary-actions-in-the-actions-list-endpoint-is-removed
 */

import { HCloudClient, HCloudError } from "@nilovonjs/hcloud-js";
import { config } from "../config.js";

/**
 * Run all action API examples
 */
export async function runActionExamples() {
  const client = new HCloudClient({
    token: config.token,
    baseUrl: config.baseUrl,
    timeout: config.timeout,
  });

  try {
    console.log("\nℹ️  Note: Listing arbitrary actions was removed in the Hetzner Cloud API.");
    console.log("   Actions can only be retrieved individually by ID.");
    console.log("   Action IDs are typically returned from resource operations.");
    console.log("   See: https://docs.hetzner.cloud/changelog#2025-01-30-listing-arbitrary-actions-in-the-actions-list-endpoint-is-removed\n");

    // Example 1: Try to get a specific action by ID
    // Note: In a real scenario, you would get this ID from a resource operation
    // For demonstration, we'll use a placeholder ID and catch the error if it doesn't exist
    console.log("1️⃣  Getting action by ID (example)...");
    console.log("   In a real scenario, you would get the action ID from a resource operation");
    console.log("   (e.g., server creation returns an action object with an ID)");
    
    try {
      // Using a very high ID that likely doesn't exist - this is just for demonstration
      // In practice, you would use an ID from a previous operation
      const actionId = 999999999;
      const action = await client.actions.get(actionId);
      
      console.log(`   ✓ Found action #${action.action.id}`);
      console.log(`   Command: ${action.action.command}`);
      console.log(`   Status: ${action.action.status}`);
      console.log(`   Progress: ${action.action.progress}%`);
      console.log(`   Started: ${action.action.started}`);
      console.log(`   Finished: ${action.action.finished || "N/A"}`);
      
      if (action.action.resources && action.action.resources.length > 0) {
        console.log(`   Resources:`);
        action.action.resources.forEach((resource: { type: string; id: number }) => {
          console.log(`     - ${resource.type} #${resource.id}`);
        });
      }

      if (action.action.error) {
        console.log(`   Error:`);
        console.log(`     Code: ${action.action.error.code}`);
        console.log(`     Message: ${action.action.error.message}`);
      }
    } catch (error) {
      if (error instanceof HCloudError && error.statusCode === 404) {
        console.log("   ℹ️  Action not found (this is expected with a placeholder ID)");
        console.log("   In practice, use an action ID from a resource operation");
      } else {
        throw error;
      }
    }

    // Example 2: Explain how to get action IDs from resource operations
    console.log("\n2️⃣  How to get action IDs:");
    console.log("   Actions are typically returned from resource operations:");
    console.log("   - Server creation/deletion: server.action.id");
    console.log("   - Image deletion: image.action.id");
    console.log("   - Certificate operations: certificate.action.id");
    console.log("   - etc.");
    console.log("\n   Example:");
    console.log("   ```typescript");
    console.log("   const server = await client.servers.create({ ... });");
    console.log("   const actionId = server.action.id;");
    console.log("   const action = await client.actions.get(actionId);");
    console.log("   ```");

    // Example 3: Demonstrate using an action ID from a real operation
    // Try to get an action from a server operation if servers exist
    console.log("\n3️⃣  Getting action from a server operation (if servers exist)...");
    try {
      const serversList = await client.servers.list({ per_page: 1 });
      if (serversList.servers.length > 0) {
        const server = serversList.servers[0];
        console.log(`   Found server: ${server.name} (ID: ${server.id})`);
        console.log("   Note: To get an action, you would need to perform an operation");
        console.log("   (e.g., delete the server) which returns an action ID.");
      } else {
        console.log("   No servers found. Create a server to get action examples.");
      }
    } catch (error) {
      console.log("   Could not fetch servers:", error instanceof Error ? error.message : error);
    }

    console.log("\n✅ Actions API examples completed");
    console.log("\n💡 Tip: Action IDs are returned from resource operations.");
    console.log("   Use those IDs to track the status of operations with client.actions.get(id)");
  } catch (error) {
    console.error("❌ Error in actions examples:", error);
    throw error;
  }
}
