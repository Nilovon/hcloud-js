# hcloud-js examples

Runnable examples for [`@nilovonjs/hcloud-js`](../../packages/library).

## Setup

```bash
bun install
cp apps/example/.env.example apps/example/.env   # then add your API token
```

Create a token in the [Hetzner Console](https://console.hetzner.cloud/) under
_Security > API tokens_. A read-only token is enough for everything except the
server lifecycle example.

## Examples

Run them from `apps/example`:

| Command                                 | What it shows                                                      |
| --------------------------------------- | ------------------------------------------------------------------ |
| `bun run quickstart`                    | Listing resources, rate limit state                                |
| `bun run pagination`                    | `list()`, `listAll()`, `iterate()`, label selectors, `getByName()` |
| `bun run errors`                        | Typed errors, request validation, timeouts                         |
| `bun run observability`                 | Hooks, retries, low-level requests with response metadata          |
| `HCLOUD_EXAMPLE_WRITE=1 bun run server` | Create a server, wait for actions, power-cycle and delete it       |
| `bun run dev`                           | All read-only examples in a row                                    |

Set `HCLOUD_DEBUG=1` to log every request.

> The server lifecycle example creates a billable server (and deletes it again).
> It only runs when `HCLOUD_EXAMPLE_WRITE=1` is set.
