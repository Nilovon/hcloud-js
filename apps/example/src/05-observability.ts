/**
 * Observability: hooks, retries and low-level requests.
 *
 *   bun run observability
 */
import { HCloudClient } from "@nilovonjs/hcloud-js";

const client = new HCloudClient({
  // Retries use exponential backoff with jitter and honor Retry-After.
  retry: { maxRetries: 3, baseDelay: 500 },
  timeout: 15_000,
  hooks: {
    onRequest: ({ method, path, attempt }) => {
      console.log(`→ ${method} ${path}${attempt > 0 ? ` (retry ${attempt})` : ""}`);
    },
    onResponse: ({ request, response, durationMs }) => {
      console.log(`← ${response.status} ${request.method} ${request.path} in ${durationMs}ms`);
    },
    onRetry: ({ error, delayMs }) => {
      console.log(`↻ ${error.code}, retrying in ${delayMs}ms`);
    },
  },
});

await client.serverTypes.list({ per_page: 1 });

// Response metadata for any endpoint, including ones the SDK does not cover yet.
const { data, requestId, rateLimit } = await client.requestWithResponse<{ locations: unknown[] }>({
  path: "/locations",
});
console.log(`${data.locations.length} locations, correlation ID ${requestId}`);
console.log(`Rate limit resets at ${rateLimit?.reset.toISOString()}`);
