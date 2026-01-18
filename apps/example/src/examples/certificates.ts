/**
 * Certificates API Examples
 * Demonstrates how to use the Certificates API endpoints
 * @see https://docs.hetzner.cloud/reference/cloud#certificates
 */

import { HCloudClient } from "@hcloud-js/library";
import { config } from "../config.js";

/**
 * Run all certificate API examples
 */
export async function runCertificateExamples() {
  const client = new HCloudClient({
    token: config.token,
    baseUrl: config.baseUrl,
    timeout: config.timeout,
  });

  try {
    // Example 1: List all certificates
    console.log("\n1️⃣  Listing all certificates...");
    const certificatesList = await client.certificates.list();
    console.log(`   Found ${certificatesList.certificates.length} certificate(s)`);
    
    if (certificatesList.certificates.length > 0) {
      certificatesList.certificates.forEach((cert) => {
        console.log(`   - Certificate #${cert.id}: ${cert.name} (${cert.type})`);
      });
    } else {
      console.log("   No certificates found");
    }

    // Example 2: List certificates with filters
    console.log("\n2️⃣  Listing managed certificates...");
    const managedCerts = await client.certificates.list({
      type: ["managed"],
      sort: ["name:asc"],
    });
    console.log(`   Found ${managedCerts.certificates.length} managed certificate(s)`);

    // Example 3: List uploaded certificates
    console.log("\n3️⃣  Listing uploaded certificates...");
    const uploadedCerts = await client.certificates.list({
      type: ["uploaded"],
    });
    console.log(`   Found ${uploadedCerts.certificates.length} uploaded certificate(s)`);

    // Example 4: Get a specific certificate (if any exist)
    if (certificatesList.certificates.length > 0) {
      const firstCert = certificatesList.certificates[0];
      if (!firstCert) {
        console.log("   No certificates found");
        return;
      }
      console.log(`\n4️⃣  Getting certificate #${firstCert.id}...`);
      const certificate = await client.certificates.get(firstCert.id);
      
      console.log(`   Certificate Name: ${certificate.certificate.name}`);
      console.log(`   Type: ${certificate.certificate.type}`);
      console.log(`   Domain Names: ${certificate.certificate.domain_names.join(", ")}`);
      console.log(`   Created: ${certificate.certificate.created}`);
      console.log(`   Valid From: ${certificate.certificate.not_valid_before}`);
      console.log(`   Valid Until: ${certificate.certificate.not_valid_after}`);
      
      if (certificate.certificate.status) {
        console.log(`   Status: ${certificate.certificate.status}`);
      }

      if (certificate.certificate.labels && Object.keys(certificate.certificate.labels).length > 0) {
        console.log(`   Labels: ${JSON.stringify(certificate.certificate.labels)}`);
      }

      // Example 5: Update certificate
      console.log(`\n5️⃣  Updating certificate #${firstCert.id}...`);
      try {
        const updated = await client.certificates.update(firstCert.id, {
          labels: { updated_at: new Date().toISOString() },
        });
        console.log(`   ✅ Certificate updated successfully`);
        if (updated.certificate.labels) {
          console.log(`   Labels: ${JSON.stringify(updated.certificate.labels)}`);
        }
      } catch (error) {
        console.log(`   ⚠️  Could not update certificate: ${error instanceof Error ? error.message : "Unknown error"}`);
      }

      // Example 6: List certificate actions
      console.log(`\n6️⃣  Listing actions for certificate #${firstCert.id}...`);
      try {
        const actions = await client.certificates.listActions(firstCert.id);
        console.log(`   Found ${actions.actions.length} action(s)`);
        
        if (actions.actions.length > 0) {
          actions.actions.slice(0, 3).forEach((action) => {
            console.log(`   - Action #${action.id}: ${action.command} (${action.status})`);
          });
        }

        // Example 7: Get specific action (if any exist)
        if (actions.actions.length > 0) {
          const firstAction = actions.actions[0];
          if (!firstAction) {
            console.log("   No actions found");
            return;
          }
          console.log(`\n7️⃣  Getting action #${firstAction.id}...`);
          if (!firstAction) {
            console.log("   No actions found");
            return;
          }
          const action = await client.certificates.getAction(firstCert.id, firstAction.id);
          if (!action.action) {
            console.log("   No action found");
            return;
          }
          console.log(`   Action Command: ${action.action.command}`);
          console.log(`   Status: ${action.action.status}`);
          console.log(`   Progress: ${action.action.progress}%`);
        }
      } catch (error) {
        console.log(`   ⚠️  Could not list actions: ${error instanceof Error ? error.message : "Unknown error"}`);
      }

      // Example 8: Retry issuance (only for managed certificates in verification_process)
      if (certificate.certificate.type === "managed" && certificate.certificate.status === "verification_process") {
        console.log(`\n8️⃣  Retrying certificate issuance...`);
        try {
          const retryResult = await client.certificates.retryIssuance(firstCert.id);
          if (!retryResult.action) {
            console.log("   No action found");
            return;
          }
          console.log(`   ✅ Retry action started`);
          console.log(`   Action ID: ${retryResult.action.id}`);
        } catch (error) {
          console.log(`   ⚠️  Could not retry issuance: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      } else {
        console.log(`\n8️⃣  Skipping retry issuance (only for managed certificates in verification_process)`);
      }
    } else {
      console.log("\n4️⃣  Skipping certificate details (no certificates available)");
    }

    // Note: We don't create or delete certificates in examples to avoid accidental deletion
    console.log("\n💡 Note: Create/Delete operations are not demonstrated to prevent accidental changes");
    console.log("   You can use client.certificates.create() and client.certificates.delete() if needed");

    console.log("\n✅ Certificates API examples completed");
  } catch (error) {
    console.error("❌ Error in certificates examples:", error);
    throw error;
  }
}
