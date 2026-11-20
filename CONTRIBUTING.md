# Contributing to hcloud-js

Thanks for your interest in contributing!

## Setup

```bash
git clone https://github.com/Nilovon/hcloud-js.git
cd hcloud-js
bun install
```

Requires [Bun](https://bun.sh) 1.4 or later.

## Workflow

```bash
bun run test          # unit tests
bun run check-types   # TypeScript
bun run lint          # oxlint
bun run format        # oxfmt (writes)
bun run ci            # everything the CI runs
```

Run a single test file from `packages/library`:

```bash
bun test test/apis/servers.test.ts
```

## How the SDK is structured

```
packages/library/
├── src/
│   ├── client.ts            # HCloudClient: wires up all resource clients
│   ├── core/
│   │   ├── base-client.ts   # request pipeline: auth, retries, timeouts, hooks
│   │   ├── http.ts          # URL building, backoff, error mapping
│   │   ├── errors.ts        # error classes
│   │   ├── resource.ts      # ApiResource / ListableResource / NamedResource
│   │   ├── pagination.ts    # page iteration
│   │   └── validation.ts    # Zod helpers
│   ├── apis/<resource>/
│   │   ├── schemas.ts       # Zod schemas (entities, requests, responses)
│   │   ├── types.ts         # types inferred from the schemas
│   │   └── index.ts         # the resource client
│   └── utils/               # label selectors, metrics, type guards
└── test/
    ├── helpers.ts           # mockClient(): a client backed by a fake fetch
    ├── core/                # tests for the request pipeline
    └── apis/                # one test file per resource
```

### Adding or changing an endpoint

`src/apis/ssh-keys` is the smallest complete example.

1. **Schema** (`schemas.ts`): describe the request body and the response with
   Zod. Response schemas are checks only - no transforms or defaults - and
   should be tolerant (`.optional()` / `.nullable()`) where the API is.
2. **Types** (`types.ts`): `z.input<...>` for request params, `z.infer<...>` for
   responses. List params are interfaces extending `PageParams`.
3. **Client** (`index.ts`): add a method using `this._get` / `this._post` /
   `this._put` / `this._delete` and the `path` template tag. Every method takes
   `options?: RequestOptions` as its last parameter.
4. **Test** (`test/apis/<resource>.test.ts`): assert method, path, query/body
   and that a realistic response fixture passes validation.
5. **Docs** (`apps/docs/content/docs/API/<resource>.mdx`).

Exported names must be unique across the SDK, because `src/index.ts`
re-exports every module with `export *`.

## Pull requests

- Keep changes focused and add tests.
- Add an entry to `CHANGELOG.md` for user-facing changes.
- Make sure `bun run ci` passes.

## Reporting issues

Please include the SDK version, runtime (Node.js/Bun/Deno + version), a minimal
reproduction and, for API errors, the `requestId` of the error.

## License

By contributing, you agree that your contributions are licensed under the MIT License.
