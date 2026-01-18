/**
 * Hetzner Cloud SDK Example Application
 * 
 * This is a comprehensive example application demonstrating
 * how to use the Hetzner Cloud TypeScript SDK.
 * 
 * Run individual examples:
 *   bun run servers
 *   bun run images
 *   bun run actions
 * 
 * Or run all examples:
 *   bun run dev
 */

import { config } from "./config.js";
import { runServerExamples } from "./examples/servers.js";
import { runImageExamples } from "./examples/images.js";
import { runActionExamples } from "./examples/actions.js";
import { runCertificateExamples } from "./examples/certificates.js";
import { runSSHKeyExamples } from "./examples/ssh-keys.js";
import { runFirewallExamples } from "./examples/firewalls.js";
import { runFloatingIPExamples } from "./examples/floating-ips.js";

/**
 * Main entry point for the example application
 */
async function main() {
  console.log("🚀 Hetzner Cloud SDK Examples\n");
  console.log(`API Token: ${config.token ? "✓ Set" : "✗ Missing"}\n`);

  if (!config.token) {
    console.error("❌ Error: HCLOUD_API_TOKEN environment variable is not set!");
    console.log("\nPlease create a .env file with:");
    console.log("  HCLOUD_API_TOKEN=your-api-token-here");
    console.log("\nOr set the environment variable directly:");
    console.log("  export HCLOUD_API_TOKEN=your-api-token-here");
    process.exit(1);
  }

  try {
    // Run all examples
    console.log("=" .repeat(60));
    console.log("📦 Servers API Examples");
    console.log("=" .repeat(60));
    await runServerExamples();

    console.log("\n" + "=".repeat(60));
    console.log("🖼️  Images API Examples");
    console.log("=".repeat(60));
    await runImageExamples();

    console.log("\n" + "=".repeat(60));
    console.log("⚡ Actions API Examples");
    console.log("=".repeat(60));
    await runActionExamples();

    console.log("\n" + "=".repeat(60));
    console.log("🔐 Certificates API Examples");
    console.log("=".repeat(60));
    await runCertificateExamples();

    console.log("\n" + "=".repeat(60));
    console.log("🔑 SSH Keys API Examples");
    console.log("=".repeat(60));
    await runSSHKeyExamples();

    console.log("\n" + "=".repeat(60));
    console.log("🔥 Firewalls API Examples");
    console.log("=".repeat(60));
    await runFirewallExamples();

    console.log("\n" + "=".repeat(60));
    console.log("🌐 Floating IPs API Examples");
    console.log("=".repeat(60));
    await runFloatingIPExamples();

    console.log("\n✅ All examples completed successfully!");
  } catch (error) {
    console.error("\n❌ Error running examples:", error);
    if (error instanceof Error) {
      console.error("Message:", error.message);
      if (error.stack) {
        console.error("\nStack trace:");
        console.error(error.stack);
      }
    }
    process.exit(1);
  }
}

// Run main function
main();
