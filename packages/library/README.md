# @nilovonjs/hcloud-js

TypeScript SDK for the Hetzner Cloud API - Fully typed, validated, and easy to use.

## Installation

```bash
npm install @nilovonjs/hcloud-js
# or
yarn add @nilovonjs/hcloud-js
# or
pnpm add @nilovonjs/hcloud-js
# or
bun add @nilovonjs/hcloud-js
```

## Quick Start

```typescript
import { HCloudClient } from '@nilovonjs/hcloud-js';

const client = new HCloudClient({
  token: 'your-api-token'
});

// List all servers
const servers = await client.servers.list();
console.log(`Found ${servers.servers.length} server(s)`);

// Get a specific server
const server = await client.servers.get(12345);
console.log(server.server.name);

// Create a new server
const newServer = await client.servers.create({
  name: 'my-server',
  server_type: 'cpx11',
  image: 'ubuntu-22.04',
  location: 'nbg1'
});
```

## Features

- ✅ **Fully Typed** - Complete TypeScript types for all API endpoints
- ✅ **Validated** - Built-in validation using Zod schemas
- ✅ **Easy to Use** - Simple, intuitive API
- ✅ **Complete Coverage** - All Hetzner Cloud API endpoints supported
- ✅ **Well Documented** - Comprehensive documentation with examples

## Supported APIs

- Servers
- Images
- Actions
- Certificates
- SSH Keys
- Locations
- Firewalls
- Floating IPs
- ISOs
- Placement Groups
- Primary IPs
- Server Types
- Load Balancers
- Networks
- Pricing
- Volumes
- DNS (Zones)

## Documentation

Full documentation is available at: [https://hcloud-js.nilovon.app](https://hcloud-js.nilovon.app)

## Requirements

- Node.js >= 18.0.0
- TypeScript >= 5.0.0

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a list of changes.

## License

MIT © [Nilovon](https://github.com/nilovonjs)
