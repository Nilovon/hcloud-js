/**
 * Pagination: three ways to walk through large result sets.
 *
 *   bun run pagination
 */
import { labelSelector } from "@nilovonjs/hcloud-js";
import { createExampleClient } from "./client";

const client = createExampleClient();

// 1. One page at a time - you control paging.
const page = await client.images.list({ type: "system", per_page: 5, sort: "name:asc" });
console.log(
  `Page 1 of ${page.meta?.pagination?.last_page}: ${page.images.map((image) => image.name).join(", ")}`,
);

// 2. Everything at once.
const allSystemImages = await client.images.listAll({ type: "system", architecture: "x86" });
console.log(`${allSystemImages.length} x86 system images in total`);

// 3. Lazily, item by item. Pages are fetched on demand, so breaking early saves requests.
for await (const serverType of client.serverTypes.iterate({ per_page: 10 })) {
  if (serverType.cores >= 8) {
    console.log(
      `First server type with 8+ cores: ${serverType.name} (${serverType.memory} GB RAM)`,
    );
    break;
  }
}

// Bonus: build label selectors without string concatenation.
const selector = labelSelector({ env: ["staging", "production"], legacy: false });
const matching = await client.servers.listAll({ label_selector: selector });
console.log(`Servers matching "${selector}": ${matching.length}`);

// Bonus: look things up by name.
const ubuntu = await client.images.getByNameAndArchitecture("ubuntu-24.04", "x86");
console.log(`ubuntu-24.04 has image ID ${ubuntu?.id}`);
