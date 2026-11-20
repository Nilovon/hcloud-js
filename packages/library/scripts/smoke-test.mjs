/**
 * Smoke test for the built package: loads the ESM and CommonJS bundles with
 * plain Node.js and sends a request through a fake fetch.
 *
 *   bun run build && node scripts/smoke-test.mjs
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const esm = await import("../dist/index.js");
const cjs = require("../dist/index.cjs");

for (const [format, sdk] of [
  ["esm", esm],
  ["cjs", cjs],
]) {
  assert.equal(typeof sdk.HCloudClient, "function", `${format}: HCloudClient export`);
  assert.equal(typeof sdk.serverSchema?.parse, "function", `${format}: schema export`);

  const requests = [];
  const client = new sdk.HCloudClient({
    token: "smoke-test",
    fetch: async (url, init) => {
      requests.push({ url, method: init.method });
      return new Response(JSON.stringify({ ssh_keys: [] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    },
  });

  const keys = await client.sshKeys.listAll();
  assert.deepEqual(keys, [], `${format}: listAll result`);
  assert.equal(requests[0].method, "GET");
  assert.equal(requests[0].url, "https://api.hetzner.cloud/v1/ssh_keys?page=1&per_page=50");

  await assert.rejects(
    () =>
      new sdk.HCloudClient({
        token: "x",
        fetch: async () => new Response("{}", { status: 404 }),
      }).servers.get(1),
    (error) => error instanceof sdk.HCloudNotFoundError && error instanceof sdk.HCloudError,
    `${format}: typed errors`,
  );

  console.log(`✓ ${format} (v${sdk.VERSION})`);
}
