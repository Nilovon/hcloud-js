/**
 * Error handling: typed errors instead of string matching.
 *
 *   bun run errors
 */
import {
  HCloudApiError,
  HCloudNotFoundError,
  HCloudRateLimitError,
  HCloudTimeoutError,
  HCloudValidationError,
  isHCloudError,
} from "@nilovonjs/hcloud-js";
import { createExampleClient } from "./client";

const client = createExampleClient();

// 1. A specific error class per failure reason.
try {
  await client.servers.get(1);
} catch (error) {
  if (error instanceof HCloudNotFoundError) {
    console.log(`Not found: ${error.message} (request ${error.requestId ?? "n/a"})`);
  } else {
    throw error;
  }
}

// 2. Invalid parameters are rejected before a request is sent.
try {
  await client.sshKeys.create({ name: "", public_key: "" });
} catch (error) {
  if (error instanceof HCloudValidationError) {
    for (const issue of error.issues) console.log(`Invalid ${issue.path.join(".")}: ${issue.message}`);
  }
}

// 3. Timeouts and aborts.
try {
  await client.servers.list({}, { timeout: 1 });
} catch (error) {
  if (error instanceof HCloudTimeoutError) console.log(`Timed out after ${error.timeout}ms`);
}

// 4. One handler for everything.
function describe(error: unknown): string {
  if (error instanceof HCloudRateLimitError) return `rate limited, retry in ${error.retryAfter}s`;
  if (error instanceof HCloudApiError) return `API error ${error.status} ${error.code}: ${error.message}`;
  if (isHCloudError(error)) return `SDK error ${error.code}: ${error.message}`;
  return String(error);
}

console.log(await client.volumes.get(1).catch(describe));
