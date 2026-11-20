import { HCloudClient } from "@nilovonjs/hcloud-js";

/**
 * Shared client for all examples.
 *
 * The token is read from the HCLOUD_TOKEN environment variable (Bun loads
 * `.env` automatically).
 */
export function createExampleClient(): HCloudClient {
  if (!process.env.HCLOUD_TOKEN) {
    console.error("HCLOUD_TOKEN is not set. Copy .env.example to .env and add your API token.");
    process.exit(1);
  }

  return new HCloudClient({
    userAgent: "hcloud-js-example/1.0",
    debug: process.env.HCLOUD_DEBUG === "1",
  });
}

/**
 * Examples that create (billable) resources only run when explicitly enabled.
 */
export function requireWriteAccess(): void {
  if (process.env.HCLOUD_EXAMPLE_WRITE !== "1") {
    console.log("This example creates billable resources and deletes them again.");
    console.log("Run it with HCLOUD_EXAMPLE_WRITE=1 to confirm.");
    process.exit(0);
  }
}
