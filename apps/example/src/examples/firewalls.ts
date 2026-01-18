/**
 * Firewalls API Examples
 * Demonstrates how to use the Firewalls API endpoints
 * @see https://docs.hetzner.cloud/reference/cloud#firewalls
 */

import { HCloudClient } from "@hcloud-js/library";
import { config } from "../config.js";

/**
 * Run all firewall API examples
 */
export async function runFirewallExamples() {
  const client = new HCloudClient({
    token: config.token,
    baseUrl: config.baseUrl,
    timeout: config.timeout,
  });

  try {
    // Example 1: List all firewalls
    console.log("\n1️⃣  Listing all firewalls...");
    const firewallsList = await client.firewalls.list();
    console.log(`   Found ${firewallsList.firewalls.length} firewall(s)`);

    if (firewallsList.firewalls.length > 0) {
      const firstFirewall = firewallsList.firewalls[0];
      console.log(`   First firewall: ${firstFirewall.name} (ID: ${firstFirewall.id})`);
      console.log(`   Created: ${firstFirewall.created}`);
      if (firstFirewall.rules) {
        console.log(
          `   Rules: ${firstFirewall.rules.inbound?.length || 0} inbound, ${firstFirewall.rules.outbound?.length || 0} outbound`,
        );
      }
      if (firstFirewall.applied_to) {
        console.log(`   Applied to: ${firstFirewall.applied_to.length} resource(s)`);
      }
    } else {
      console.log("   No firewalls found");
    }

    // Example 2: Create a firewall (if we have servers)
    console.log("\n2️⃣  Creating a firewall...");
    try {
      const serversList = await client.servers.list({ per_page: 1 });
      if (serversList.servers.length > 0) {
        const server = serversList.servers[0];
        console.log(`   Using server: ${server.name} (ID: ${server.id})`);

        const newFirewall = await client.firewalls.create({
          name: `example-firewall-${Date.now()}`,
          labels: {
            environment: "example",
            created_by: "sdk-example",
          },
          rules: {
            inbound: [
              {
                direction: "in",
                protocol: "tcp",
                port: "80",
                source_ips: ["0.0.0.0/0", "::/0"],
                description: "Allow HTTP traffic",
              },
              {
                direction: "in",
                protocol: "tcp",
                port: "443",
                source_ips: ["0.0.0.0/0", "::/0"],
                description: "Allow HTTPS traffic",
              },
              {
                direction: "in",
                protocol: "tcp",
                port: "22",
                source_ips: ["0.0.0.0/0", "::/0"],
                description: "Allow SSH traffic",
              },
            ],
            outbound: [
              {
                direction: "out",
                protocol: "tcp",
                source_ips: ["0.0.0.0/0", "::/0"],
                description: "Allow all outbound traffic",
              },
            ],
          },
          apply_to: [
            {
              type: "server",
              server: { id: server.id },
            },
          ],
        });

        console.log(`   ✓ Created firewall: ${newFirewall.firewall.name} (ID: ${newFirewall.firewall.id})`);
        if (newFirewall.action) {
          console.log(`   Action ID: ${newFirewall.action.id}`);
        }

        // Example 3: Get the created firewall
        console.log("\n3️⃣  Getting the created firewall...");
        const firewall = await client.firewalls.get(newFirewall.firewall.id);
        console.log(`   Name: ${firewall.firewall.name}`);
        console.log(`   ID: ${firewall.firewall.id}`);
        console.log(`   Created: ${firewall.firewall.created}`);
        if (firewall.firewall.rules?.inbound) {
          console.log(`   Inbound rules: ${firewall.firewall.rules.inbound.length}`);
          firewall.firewall.rules.inbound.forEach((rule, index) => {
            console.log(`     ${index + 1}. ${rule.protocol} port ${rule.port || "all"} from ${rule.source_ips?.join(", ") || "any"}`);
          });
        }
        if (firewall.firewall.rules?.outbound) {
          console.log(`   Outbound rules: ${firewall.firewall.rules.outbound.length}`);
        }

        // Example 4: Update firewall
        console.log("\n4️⃣  Updating firewall...");
        const updatedFirewall = await client.firewalls.update(newFirewall.firewall.id, {
          name: `${firewall.firewall.name}-updated`,
          labels: {
            ...firewall.firewall.labels,
            updated_at: new Date().toISOString(),
          },
        });
        console.log(`   ✓ Updated firewall name to: ${updatedFirewall.firewall.name}`);

        // Example 5: List actions for the firewall
        console.log("\n5️⃣  Listing actions for the firewall...");
        const actions = await client.firewalls.listActions(newFirewall.firewall.id);
        console.log(`   Found ${actions.actions.length} action(s)`);
        if (actions.actions.length > 0) {
          const firstAction = actions.actions[0];
          console.log(`   First action: ${firstAction.command} (${firstAction.status})`);
        }

        // Example 6: Set firewall rules
        console.log("\n6️⃣  Setting firewall rules...");
        const setRulesResult = await client.firewalls.setRules(newFirewall.firewall.id, {
          rules: {
            inbound: [
              {
                direction: "in",
                protocol: "tcp",
                port: "443",
                source_ips: ["0.0.0.0/0", "::/0"],
                description: "Allow HTTPS only",
              },
            ],
            outbound: [
              {
                direction: "out",
                protocol: "tcp",
                destination_ips: ["0.0.0.0/0", "::/0"],
                description: "Allow all outbound TCP",
              },
            ],
          },
        });
        console.log(`   ✓ Rules updated. Actions: ${setRulesResult.actions.length}`);

        // Example 7: Get a specific action
        if (setRulesResult.actions.length > 0) {
          const actionId = setRulesResult.actions[0].id;
          console.log(`\n7️⃣  Getting action ${actionId}...`);
          const action = await client.firewalls.getAction(newFirewall.firewall.id, actionId);
          console.log(`   Command: ${action.action.command}`);
          console.log(`   Status: ${action.action.status}`);
          console.log(`   Progress: ${action.action.progress}%`);
        }

        // Example 8: Remove firewall from resources
        console.log("\n8️⃣  Removing firewall from resources...");
        const removeResult = await client.firewalls.removeFromResources(newFirewall.firewall.id, {
          remove_from: [
            {
              type: "server",
              server: { id: server.id },
            },
          ],
        });
        console.log(`   ✓ Removed from resources. Actions: ${removeResult.actions.length}`);

        // Example 9: Delete the firewall
        console.log("\n9️⃣  Deleting the firewall...");
        await client.firewalls.delete(newFirewall.firewall.id);
        console.log("   ✓ Firewall deleted");
      } else {
        console.log("   Skipping firewall creation (no servers available)");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(`   Error: ${error.message}`);
      } else {
        console.log(`   Error: ${String(error)}`);
      }
    }

    // Example 10: List firewalls with filters
    console.log("\n🔟  Listing firewalls with filters...");
    const filteredFirewalls = await client.firewalls.list({
      label_selector: "environment=example",
      sort: ["name:asc"],
    });
    console.log(`   Found ${filteredFirewalls.firewalls.length} firewall(s) with filters`);

    console.log("\n✅ Firewalls API examples completed");
  } catch (error) {
    console.error("❌ Error in firewalls examples:", error);
    throw error;
  }
}
