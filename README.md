# hcloud-js

[![npm](https://img.shields.io/npm/v/@nilovonjs/hcloud-js)](https://www.npmjs.com/package/@nilovonjs/hcloud-js)
[![CI](https://github.com/Nilovon/hcloud-js/actions/workflows/ci.yml/badge.svg)](https://github.com/Nilovon/hcloud-js/actions/workflows/ci.yml)

Modern TypeScript SDK for the [Hetzner Cloud API](https://docs.hetzner.cloud/reference/cloud):
fully typed and validated, with auto-pagination, action waiting, retries and
typed errors.

```bash
npm install @nilovonjs/hcloud-js
```

```typescript
import { HCloudClient } from "@nilovonjs/hcloud-js";

const client = new HCloudClient(); // reads HCLOUD_TOKEN

const { server } = await client.servers.createAndWait({
  name: "web-1",
  server_type: "cx22",
  image: "ubuntu-24.04",
});

for await (const s of client.servers.iterate()) {
  console.log(s.name, s.status);
}
```

- **Package README**: [packages/library](./packages/library/README.md)
- **Documentation**: https://hcloud-js.nilovon.com
- **Changelog**: [CHANGELOG.md](./CHANGELOG.md)

## Repository

This is a [Bun](https://bun.sh) + [Turborepo](https://turbo.build) monorepo.

```
hcloud-js/
├── packages/
│   ├── library/   # @nilovonjs/hcloud-js - the SDK published to npm
│   └── config/    # shared TypeScript config
└── apps/
    ├── docs/      # documentation site (Next.js + Fumadocs)
    └── example/   # runnable examples
```

## Development

```bash
bun install

bun run test          # unit tests (bun test)
bun run check-types   # TypeScript
bun run lint          # oxlint
bun run format        # oxfmt
bun run build         # build the SDK (tsdown) and the docs
bun run dev:docs      # docs site on http://localhost:4000
```

`bun run ci` runs everything the CI runs. See [CONTRIBUTING.md](./CONTRIBUTING.md)
for how the SDK is structured and how to add an endpoint.

## Releasing

1. Update `version` in `packages/library/package.json` and `packages/library/src/version.ts`.
2. Add a section to `CHANGELOG.md`.
3. `bun run publish:library:dry-run`, then `bun run publish:library`
   (runs type-check, tests, build and package validation first).

## License

[MIT](./LICENSE)
