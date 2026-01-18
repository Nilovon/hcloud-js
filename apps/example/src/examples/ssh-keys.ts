/**
 * SSH Keys API Examples
 * Demonstrates how to use the SSH Keys API endpoints
 * @see https://docs.hetzner.cloud/reference/cloud#ssh-keys
 */

import { HCloudClient } from "@nilovonjs/hcloud-js";
import { config } from "../config.js";

/**
 * Run all SSH key API examples
 */
export async function runSSHKeyExamples() {
  const client = new HCloudClient({
    token: config.token,
    baseUrl: config.baseUrl,
    timeout: config.timeout,
  });

  try {
    // Example 1: List all SSH keys
    console.log("\n1️⃣  Listing all SSH keys...");
    const sshKeysList = await client.sshKeys.list();
    console.log(`   Found ${sshKeysList.ssh_keys.length} SSH key(s)`);
    
    if (sshKeysList.ssh_keys.length > 0) {
      sshKeysList.ssh_keys.forEach((key) => {
        console.log(`   - SSH Key #${key.id}: ${key.name}`);
        console.log(`     Fingerprint: ${key.fingerprint}`);
      });
    } else {
      console.log("   No SSH keys found");
    }

    // Example 2: List SSH keys with filters
    console.log("\n2️⃣  Listing SSH keys with filters...");
    const filteredKeys = await client.sshKeys.list({
      sort: ["name:asc"],
      per_page: 10,
    });
    console.log(`   Found ${filteredKeys.ssh_keys.length} SSH key(s)`);

    // Example 3: Get a specific SSH key (if any exist)
    if (sshKeysList.ssh_keys.length > 0) {
      const firstKey = sshKeysList.ssh_keys[0];
      if (!firstKey) {
        console.log("   No SSH keys found");
        return;
      }
      console.log(`\n3️⃣  Getting SSH key #${firstKey.id}...`);
      const sshKey = await client.sshKeys.get(firstKey.id);
      
      console.log(`   SSH Key Name: ${sshKey.ssh_key.name}`);
      console.log(`   Fingerprint: ${sshKey.ssh_key.fingerprint}`);
      console.log(`   Public Key: ${sshKey.ssh_key.public_key.substring(0, 50)}...`);
      console.log(`   Created: ${sshKey.ssh_key.created}`);
      
      if (sshKey.ssh_key.labels && Object.keys(sshKey.ssh_key.labels).length > 0) {
        console.log(`   Labels: ${JSON.stringify(sshKey.ssh_key.labels)}`);
      }

      // Example 4: Update SSH key
      if (!firstKey) {
        console.log("   No SSH keys found");
        return;
      }
      console.log(`\n4️⃣  Updating SSH key #${firstKey.id}...`);
      try {
        const updated = await client.sshKeys.update(firstKey.id, {
          labels: { updated_at: new Date().toISOString() },
        });
        console.log(`   ✅ SSH key updated successfully`);
        if (updated.ssh_key.labels) {
          console.log(`   Labels: ${JSON.stringify(updated.ssh_key.labels)}`);
        }
      } catch (error) {
        console.log(`   ⚠️  Could not update SSH key: ${error instanceof Error ? error.message : "Unknown error"}`);
      }

      // Example 5: Get SSH key by fingerprint
      console.log(`\n5️⃣  Getting SSH key by fingerprint...`);
      try {
        const byFingerprint = await client.sshKeys.list({
          fingerprint: firstKey.fingerprint,
        });
        if (byFingerprint.ssh_keys.length > 0) {
          if (!byFingerprint.ssh_keys[0]) {
            console.log("   No SSH keys found");
            return;
          }
          console.log(`   Found SSH key: ${byFingerprint.ssh_keys[0].name}`);
        }
      } catch (error) {
        console.log(`   ⚠️  Could not search by fingerprint: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    } else {
      console.log("\n3️⃣  Skipping SSH key details (no SSH keys available)");
    }

    // Note: We don't create or delete SSH keys in examples to avoid accidental deletion
    console.log("\n💡 Note: Create/Delete operations are not demonstrated to prevent accidental changes");
    console.log("   You can use client.sshKeys.create() and client.sshKeys.delete() if needed");
    console.log("\n   Example create:");
    console.log("   await client.sshKeys.create({");
    console.log("     name: 'my-ssh-key',");
    console.log("     public_key: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAB...'");
    console.log("   });");

    console.log("\n✅ SSH Keys API examples completed");
  } catch (error) {
    console.error("❌ Error in SSH keys examples:", error);
    throw error;
  }
}
