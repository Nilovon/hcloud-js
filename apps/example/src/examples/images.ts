/**
 * Images API Examples
 * Demonstrates how to use the Images API endpoints
 * @see https://docs.hetzner.cloud/reference/cloud#images
 */

import { HCloudClient } from "@nilovonjs/hcloud-js";
import type { Image } from "@nilovonjs/hcloud-js";
import { config } from "../config";

/**
 * Run all image API examples
 */
export async function runImageExamples() {
  const client = new HCloudClient({
    token: config.token,
    baseUrl: config.baseUrl,
    timeout: config.timeout,
  });

  try {
    // Example 1: List all images
    console.log("\n1️⃣  Listing all images...");
    const imagesList = await client.images.list()
    console.log(`   Found ${imagesList.images.length} image(s)`);
    
    if (imagesList.images.length > 0) {
      imagesList.images.slice(0, 5).forEach((image: Image) => {
        console.log(`   - Image #${image.id}: ${image.name} (${image.type}, ${image.status})`);
      });
      if (imagesList.images.length > 5) {
        console.log(`   ... and ${imagesList.images.length - 5} more`);
      }
    } else {
      console.log("   No images found");
    }

    // Example 2: List images with filters
    console.log("\n2️⃣  Listing system images...");
    const systemImages = await client.images.list({
      type: ["system"],
      status: ["available"],
      sort: ["name:asc"],
      per_page: 10,
    });
    console.log(`   Found ${systemImages.images.length} system image(s)`);

    // Example 3: List snapshots
    console.log("\n3️⃣  Listing snapshots...");
    const snapshots = await client.images.list({
      type: ["snapshot"],
      status: ["available"],
    });
    console.log(`   Found ${snapshots.images.length} snapshot(s)`);

    // Example 4: Get a specific image (if any exist)
    if (imagesList.images.length > 0) {
      const firstImage = imagesList.images[0];
      if (!firstImage) {
        console.log("   No images found");
        return;
      }
      console.log(`\n4️⃣  Getting image #${firstImage.id}...`);
      const image = await client.images.get(firstImage.id);
      console.log(`   Image Name: ${image.image.name}`);
      console.log(`   Type: ${image.image.type}`);
      console.log(`   Status: ${image.image.status}`);
      console.log(`   Description: ${image.image.description}`);
      console.log(`   Disk Size: ${image.image.disk_size} GB`);
      console.log(`   OS Flavor: ${image.image.os_flavor}`);
      console.log(`   OS Version: ${image.image.os_version || "N/A"}`);
      console.log(`   Rapid Deploy: ${image.image.rapid_deploy ? "Yes" : "No"}`);
      console.log(`   Created: ${image.image.created}`);
      
      if (image.image.labels && Object.keys(image.image.labels).length > 0) {
        console.log(`   Labels: ${JSON.stringify(image.image.labels)}`);
      }

      // Example 5: Update image (only for snapshots/backups)
      if (image.image.type === "snapshot" || image.image.type === "backup") {
        if (!firstImage) {
          console.log("   No images found");
          return;
        }
        console.log(`\n5️⃣  Updating image #${firstImage.id}...`);
        try {
          const updated = await client.images.update(firstImage.id, {
            description: `Updated description at ${new Date().toISOString()}`,
          });
          console.log(`   ✅ Image updated successfully`);
          console.log(`   New description: ${updated.image.description}`);
        } catch (error) {
          console.log(`   ⚠️  Could not update image: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      } else {
        console.log(`\n5️⃣  Skipping image update (only available for snapshots/backups)`);
      }
    } else {
      console.log("\n4️⃣  Skipping image details (no images available)");
    }

    // Example 6: List images by architecture
    console.log("\n6️⃣  Listing x86 images...");
    const x86Images = await client.images.list({
      architecture: ["x86"],
      per_page: 5,
    });
    console.log(`   Found ${x86Images.images.length} x86 image(s)`);

    console.log("\n✅ Images API examples completed");
  } catch (error) {
    console.error("❌ Error in images examples:", error);
    throw error;
  }
}
