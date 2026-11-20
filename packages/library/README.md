# @nilovonjs/hcloud-js

[![npm](https://img.shields.io/npm/v/@nilovonjs/hcloud-js)](https://www.npmjs.com/package/@nilovonjs/hcloud-js)
[![CI](https://github.com/Nilovon/hcloud-js/actions/workflows/ci.yml/badge.svg)](https://github.com/Nilovon/hcloud-js/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@nilovonjs/hcloud-js)](./LICENSE)

Modern TypeScript SDK for the [Hetzner Cloud API](https://docs.hetzner.cloud/reference/cloud).
Fully typed, validated, and built to take the tedious parts off your hands:
pagination, waiting for actions, retries, rate limits and error handling.

**[Documentation](https://hcloud-js.nilovon.com)** · [Changelog](https://github.com/Nilovon/hcloud-js/blob/main/CHANGELOG.md) · [Migrating from v1](https://hcloud-js.nilovon.com/docs/migration)

```bash
npm install @nilovonjs/hcloud-js
```

```typescript
import { HCloudClient } from "@nilovonjs/hcloud-js";

const client = new HCloudClient(); // reads HCLOUD_TOKEN

// Create a server and wait until it is ready
const { server } = await client.servers.createAndWait({
  name: "web-1",
  server_type: "cx22",
  image: "ubuntu-24.04",
  location: "nbg1",
});

// Iterate over all servers - pages are fetched on demand
for await (const s of client.servers.iterate({ label_selector: "env=production" })) {
  console.log(s.name, s.status, s.public_net.ipv4?.ip);
}

// Every mutating call returns an action you can wait for
await client.actions.waitFor(await client.servers.reboot(server.id));
```

## Features

- **Complete** - every Cloud API resource plus DNS zones and Storage Boxes
- **Fully typed** - parameters and responses inferred from [Zod](https://zod.dev) schemas, which are exported too
- **Auto-pagination** - `listAll()`, `iterate()`, `first()` and `getByName()` on every list endpoint
- **Action waiting** - `waitFor()` / `waitForAll()` with batched polling, backoff and progress callbacks
- **Resilient** - automatic retries with exponential backoff, jitter, `Retry-After` and rate limit tracking
- **Typed errors** - `HCloudNotFoundError`, `HCloudRateLimitError`, `HCloudActionError`, ... no string matching
- **Cancellable** - `AbortSignal` and per-request timeouts on every call
- **Observable** - request/response/retry hooks and a debug logger that never leaks your token
- **Forward compatible** - unknown response fields are preserved, schema drift warns instead of breaking production
- **Runs everywhere** - Node.js 20+, Bun, Deno, browsers, edge runtimes; ESM + CommonJS; one dependency

## Usage

### Client

```typescript
import { HCloudClient } from "@nilovonjs/hcloud-js";

const client = new HCloudClient({
  token: process.env.HCLOUD_TOKEN, // default: HCLOUD_TOKEN env var
  timeout: 30_000,
  retry: { maxRetries: 5 },
  userAgent: "my-app/1.2.3",
});
```

### Reading

```typescript
// One page, exactly as the API returns it
const { servers, meta } = await client.servers.list({ status: ["running"], sort: "name:asc" });
const { server } = await client.servers.get(42);

// Helpers that return plain items
const all = await client.servers.listAll({ label_selector: "env=production" });
const web = await client.servers.getByName("web-1"); // Server | undefined
const newest = await client.images.first({ type: "snapshot", sort: "created:desc" });
```

### Writing and waiting

```typescript
const { volume, action, next_actions } = await client.volumes.create({
  name: "data",
  size: 50,
  server: 42,
  format: "ext4",
});

// Accepts actions, IDs or whole responses (action + next_actions)
await client.actions.waitForAll({ action, next_actions });

await client.actions.waitFor(await client.volumes.resize(volume.id, { size: 100 }), {
  timeout: 120_000,
  onProgress: (a) => console.log(`${a.command}: ${a.progress}%`),
});
```

### Errors

```typescript
import {
  HCloudActionError,
  HCloudApiError,
  HCloudNotFoundError,
  isHCloudError,
} from "@nilovonjs/hcloud-js";

try {
  await client.servers.delete(42);
} catch (error) {
  if (error instanceof HCloudNotFoundError) {
    // already gone
  } else if (isHCloudError(error, "protected")) {
    console.error("Server is delete-protected");
  } else if (error instanceof HCloudApiError) {
    console.error(error.status, error.code, error.message, error.requestId);
  } else {
    throw error;
  }
}
```

### Request options

The last argument of every method:

```typescript
await client.servers.listAll({}, { signal: controller.signal, timeout: 10_000, retry: false });
```

### Hooks and debugging

```typescript
const client = new HCloudClient({
  debug: true,
  hooks: {
    onResponse: ({ request, response, durationMs }) =>
      console.log(`${request.method} ${request.path} ${response.status} ${durationMs}ms`),
    onRetry: ({ error, delayMs }) => console.warn(`retrying in ${delayMs}ms: ${error.code}`),
  },
});

console.log(client.rateLimit); // { limit: 3600, remaining: 3597, reset: Date }
```

### Utilities

```typescript
import {
  labelSelector,
  parseTimeSeries,
  isServerRunning,
  serverSchema,
} from "@nilovonjs/hcloud-js";

labelSelector({ env: ["staging", "production"], legacy: false });
// "env in (staging,production),!legacy"
```

## Resources

| Client                     | Resource                                   |
| -------------------------- | ------------------------------------------ |
| `client.servers`           | Servers, all server actions, metrics       |
| `client.serverTypes`       | Server types                               |
| `client.images`            | Images, snapshots, backups                 |
| `client.isos`              | ISOs                                       |
| `client.placementGroups`   | Placement groups                           |
| `client.sshKeys`           | SSH keys                                   |
| `client.volumes`           | Volumes                                    |
| `client.networks`          | Networks, subnets, routes                  |
| `client.firewalls`         | Firewalls                                  |
| `client.floatingIPs`       | Floating IPs                               |
| `client.primaryIPs`        | Primary IPs                                |
| `client.loadBalancers`     | Load balancers, services, targets, metrics |
| `client.loadBalancerTypes` | Load balancer types                        |
| `client.certificates`      | TLS certificates                           |
| `client.dns`               | DNS zones and RRSets                       |
| `client.storageBoxes`      | Storage Boxes, snapshots, subaccounts      |
| `client.storageBoxTypes`   | Storage Box types                          |
| `client.locations`         | Locations                                  |
| `client.datacenters`       | Datacenters (deprecated by Hetzner)        |
| `client.pricing`           | Prices                                     |
| `client.actions`           | Actions, `waitFor()`, `waitForAll()`       |

Anything missing? `client.request()` gives you authenticated, retried, typed-error
access to any endpoint.

## Requirements

Node.js 20+, Bun, Deno or any runtime with `fetch`. TypeScript 5+ is optional.

## License

[MIT](./LICENSE)
