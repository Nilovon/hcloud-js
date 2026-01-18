/**
 * Floating IPs API Examples
 * Demonstrates how to use the Floating IPs API endpoints
 * 
 * Note: Creating Floating IPs costs money. The examples below show how to use the API
 * without actually creating any Floating IPs (only listing, getting, and actions).
 * 
 * @see https://docs.hetzner.cloud/reference/cloud#floating-ips
 */

import { HCloudClient } from "@hcloud-js/library";
import { config } from "../config.js";

/**
 * Run all floating IP API examples
 */
export async function runFloatingIPExamples() {
  const client = new HCloudClient({
    token: config.token,
    baseUrl: config.baseUrl,
    timeout: config.timeout,
  });

  try {
    // Example 1: List all floating IPs
    console.log("\n1️⃣  Listing all floating IPs...");
    const floatingIPsList = await client.floatingIPs.list();
    console.log(`   Found ${floatingIPsList.floating_ips.length} floating IP(s)`);

    if (floatingIPsList.floating_ips.length > 0) {
      const firstFloatingIP = floatingIPsList.floating_ips[0];
      console.log(`   First floating IP: ${firstFloatingIP.ip} (ID: ${firstFloatingIP.id})`);
      console.log(`   Type: ${firstFloatingIP.type}`);
      console.log(`   Location: ${firstFloatingIP.location.name}`);
      if (firstFloatingIP.server) {
        console.log(`   Assigned to server: ${firstFloatingIP.server}`);
      } else {
        console.log("   Not assigned to any server");
      }
      if (firstFloatingIP.name) {
        console.log(`   Name: ${firstFloatingIP.name}`);
      }
    } else {
      console.log("   No floating IPs found");
    }

    // Example 2: Get a specific floating IP (if any exist)
    if (floatingIPsList.floating_ips.length > 0) {
      const firstFloatingIP = floatingIPsList.floating_ips[0];
      console.log(`\n2️⃣  Getting floating IP ${firstFloatingIP.id}...`);
      const floatingIP = await client.floatingIPs.get(firstFloatingIP.id);

      console.log(`   IP: ${floatingIP.floating_ip.ip}`);
      console.log(`   Type: ${floatingIP.floating_ip.type}`);
      console.log(`   Location: ${floatingIP.floating_ip.location.name}`);
      console.log(`   Created: ${floatingIP.floating_ip.created}`);
      if (floatingIP.floating_ip.server) {
        console.log(`   Server ID: ${floatingIP.floating_ip.server}`);
      }
      if (floatingIP.floating_ip.dns_ptr && floatingIP.floating_ip.dns_ptr.length > 0) {
        console.log(`   DNS PTR Records:`);
        floatingIP.floating_ip.dns_ptr.forEach((ptr) => {
          console.log(`     ${ptr.ip} -> ${ptr.dns_ptr}`);
        });
      }
      console.log(`   Protection: delete=${floatingIP.floating_ip.protection.delete}`);
    } else {
      console.log("\n2️⃣  Skipping get floating IP (no floating IPs available)");
    }

    // Example 3: List actions for a floating IP (if any exist)
    if (floatingIPsList.floating_ips.length > 0) {
      const firstFloatingIP = floatingIPsList.floating_ips[0];
      console.log(`\n3️⃣  Listing actions for floating IP ${firstFloatingIP.id}...`);
      const actions = await client.floatingIPs.listActions(firstFloatingIP.id);
      console.log(`   Found ${actions.actions.length} action(s)`);
      if (actions.actions.length > 0) {
        actions.actions.slice(0, 3).forEach((action) => {
          console.log(`   - Action #${action.id}: ${action.command} (${action.status})`);
        });
      }
    } else {
      console.log("\n3️⃣  Skipping list actions (no floating IPs available)");
    }

    // Example 4: Example: Create a floating IP (not actually creating)
    console.log("\n4️⃣  Example: How to create a floating IP");
    console.log("   Note: This would cost money, so we're not actually creating one.");
    console.log("   ```typescript");
    console.log("   // Create an IPv4 floating IP in a location");
    console.log("   const floatingIP = await client.floatingIPs.create({");
    console.log("     type: 'ipv4',");
    console.log("     location: 'nbg1',");
    console.log("     name: 'my-floating-ip',");
    console.log("     labels: { environment: 'production' }");
    console.log("   });");
    console.log("   ```");
    console.log("");
    console.log("   ```typescript");
    console.log("   // Create an IPv4 floating IP and assign to a server");
    console.log("   const floatingIP = await client.floatingIPs.create({");
    console.log("     type: 'ipv4',");
    console.log("     server: 12345,");
    console.log("     name: 'my-floating-ip'");
    console.log("   });");
    console.log("   ```");

    // Example 5: Example: Assign floating IP to server
    console.log("\n5️⃣  Example: How to assign a floating IP to a server");
    console.log("   ```typescript");
    console.log("   const result = await client.floatingIPs.assignToServer(12345, {");
    console.log("     assignee_id: 67890");
    console.log("   });");
    console.log("   ```");

    // Example 6: Example: Change reverse DNS
    console.log("\n6️⃣  Example: How to change reverse DNS");
    console.log("   ```typescript");
    console.log("   const result = await client.floatingIPs.changeReverseDNS(12345, {");
    console.log("     ip: '1.2.3.4',");
    console.log("     dns_ptr: 'server.example.com'");
    console.log("   });");
    console.log("   ```");

    // Example 7: Example: Change protection
    console.log("\n7️⃣  Example: How to change protection");
    console.log("   ```typescript");
    console.log("   // Enable delete protection");
    console.log("   const result = await client.floatingIPs.changeProtection(12345, {");
    console.log("     delete: true");
    console.log("   });");
    console.log("   ```");

    // Example 8: Example: Unassign floating IP
    console.log("\n8️⃣  Example: How to unassign a floating IP");
    console.log("   ```typescript");
    console.log("   const result = await client.floatingIPs.unassign(12345);");
    console.log("   ```");

    // Example 9: Example: Update floating IP
    console.log("\n9️⃣  Example: How to update a floating IP");
    console.log("   ```typescript");
    console.log("   const updated = await client.floatingIPs.update(12345, {");
    console.log("     name: 'new-floating-ip-name',");
    console.log("     description: 'Updated description',");
    console.log("     labels: { environment: 'production' }");
    console.log("   });");
    console.log("   ```");

    // Example 10: Example: Delete floating IP
    console.log("\n🔟  Example: How to delete a floating IP");
    console.log("   ```typescript");
    console.log("   const result = await client.floatingIPs.delete(12345);");
    console.log("   ```");

    // Example 11: List floating IPs with filters (if any exist)
    if (floatingIPsList.floating_ips.length > 0) {
      console.log("\n1️⃣1️⃣  Listing floating IPs with filters...");
      const filteredFloatingIPs = await client.floatingIPs.list({
        label_selector: "environment=production",
        sort: ["name:asc"],
      });
      console.log(`   Found ${filteredFloatingIPs.floating_ips.length} floating IP(s) with filters`);
    } else {
      console.log("\n1️⃣1️⃣  Skipping filtered list (no floating IPs available)");
    }

    console.log("\n✅ Floating IPs API examples completed");
    console.log("\n💡 Note: Creating Floating IPs costs money.");
    console.log("   Use the examples above as a reference for when you need to create one.");
  } catch (error) {
    console.error("❌ Error in floating IPs examples:", error);
    throw error;
  }
}
