# hcloud-js

TypeScript SDK for the Hetzner Cloud API - Monorepo

This is a Turborepo monorepo containing:
- **@nilovonjs/hcloud-js** - The main TypeScript SDK package (published to npm)
- **apps/docs** - Documentation website
- **apps/example** - Example usage application

## Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun run dev
```

## Project Structure

```
hcloud-js/
├── apps/
│   ├── docs/          # Documentation website
│   └── example/       # Example application
├── packages/
│   ├── library/       # Main SDK package (@nilovonjs/hcloud-js)
│   └── config/        # Shared TypeScript config
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run check-types`: Check TypeScript types across all apps
- `bun run check`: Run Oxlint and Oxfmt
- `bun run publish:library`: Publish the library package to npm
- `bun run publish:library:dry-run`: Test what would be published

## Publishing

To publish the `@nilovonjs/hcloud-js` package:

```bash
# From root
bun run publish:library

# Or directly from the package directory
cd packages/library
npm publish
```

## License

MIT