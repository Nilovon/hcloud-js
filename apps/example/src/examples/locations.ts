/**
 * Locations API Examples
 * @see https://docs.hetzner.cloud/reference/cloud#locations
 */

import { HCloudClient } from "@nilovonjs/hcloud-js";
import { config } from "../config";

/**
 * Run Locations API examples
 */
export async function runLocationsExamples() {
  const client = new HCloudClient({ token: config.token });
  console.log("\n=== Locations API Examples ===\n");

  try {
    // List all locations
    console.log("1. Listing all locations...");
    const locationsList = await client.locations.list();
    console.log(`Found ${locationsList.locations.length} locations`);
    if (locationsList.locations.length > 0) {
      const firstLocation = locationsList.locations[0];
      console.log(`First location: ${firstLocation.name} (${firstLocation.city}, ${firstLocation.country})`);
      console.log(`Network zone: ${firstLocation.network_zone}`);
    }

    // Get a specific location by name
    console.log("\n2. Getting location 'fsn1'...");
    const fsn1 = await client.locations.get("fsn1");
    if (!fsn1.location) {
      console.log("Location 'fsn1' not found");
      return;
    }
    console.log(`Location: ${fsn1.location.name}`);
    console.log(`City: ${fsn1.location.city}`);
    console.log(`Country: ${fsn1.location.country}`);
    console.log(`Coordinates: ${fsn1.location.latitude}, ${fsn1.location.longitude}`);

    // List all datacenters
    console.log("\n3. Listing all datacenters...");
    const datacentersList = await client.locations.listDataCenters();
    console.log(`Found ${datacentersList.datacenters.length} datacenters`);
    if (datacentersList.datacenters.length > 0) {
      const firstDatacenter = datacentersList.datacenters[0];
      console.log(`First datacenter: ${firstDatacenter.name}`);
      console.log(`Location: ${firstDatacenter.location.name}`);
      console.log(`Supported server types: ${firstDatacenter.server_types.supported.length}`);
      console.log(`Available server types: ${firstDatacenter.server_types.available.length}`);
    }

    // Get a specific datacenter by name
    console.log("\n4. Getting datacenter 'nbg1-dc3'...");
    try {
      const nbg1Datacenter = await client.locations.getDataCenter("nbg1-dc3");
      console.log(`Datacenter: ${nbg1Datacenter.datacenter.name}`);
      console.log(`Description: ${nbg1Datacenter.datacenter.description}`);
      console.log(`Location: ${nbg1Datacenter.datacenter.location.name}`);
      console.log(`Available server types: ${nbg1Datacenter.datacenter.server_types.available.length}`);
    } catch (error) {
      console.log("Datacenter 'nbg1-dc3' not found (this is expected if it doesn't exist)");
    }

    // Filter locations by name
    console.log("\n5. Filtering locations by name 'fsn1'...");
    const fsn1Locations = await client.locations.list({ name: "fsn1" });
    if (fsn1Locations.locations.length > 0) {
      console.log(`Found location: ${fsn1Locations.locations[0].name}`);
    } else {
      console.log("Location 'fsn1' not found");
    }

    console.log("\n✓ Locations API examples completed successfully!");
  } catch (error) {
    console.error("✗ Error running Locations API examples:", error);
    throw error;
  }
}

runLocationsExamples();
