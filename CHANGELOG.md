# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-11-20

A rewrite of the SDK core with a focus on developer experience, robustness and
API correctness. See the [migration guide](https://hcloud-js.nilovon.com/docs/migration)
for upgrade instructions.

### Added

#### Developer experience

- **Auto-pagination** on every listable resource: `listAll()`, `iterate()`, `iteratePages()`, `first()`
- **`getByName()`** on every resource with a name filter, plus `sshKeys.getByFingerprint()`,
  `floatingIPs.getByIP()`, `primaryIPs.getByIP()`, `images.getByNameAndArchitecture()`
- **Action waiting**: `client.actions.waitFor()` and `waitForAll()` accept actions, IDs or whole
  responses (`action`, `actions`, `next_actions`), poll all pending actions in one request, use
  backoff, and support `onProgress`, `timeout` and `AbortSignal`
- `servers.createAndWait()` and `servers.waitForStatus()`
- **Request options on every method**: `signal`, `timeout`, `retry`, `headers`
- **Automatic retries** with exponential backoff and jitter for rate limits, conflicts, gateway
  errors and (for idempotent requests) network failures; honors `Retry-After`
- **Typed errors**: `HCloudApiError` (with `requestId`, `method`, `url`), `HCloudNotFoundError`,
  `HCloudUnauthorizedError`, `HCloudForbiddenError`, `HCloudConflictError`,
  `HCloudInvalidInputError`, `HCloudRateLimitError`, `HCloudServerError`, `HCloudConnectionError`,
  `HCloudTimeoutError`, `HCloudAbortError`, `HCloudValidationError`, `HCloudActionError`,
  `HCloudActionTimeoutError`, plus `isHCloudError()` and the `ErrorCode` constants
- **Hooks** (`onRequest`, `onResponse`, `onRetry`, `onError`) and a **debug logger**
- **Rate limit state** on `client.rateLimit`
- Token from the `HCLOUD_TOKEN` environment variable, token provider functions, custom `fetch`,
  custom `User-Agent`, default headers
- `client.requestWithResponse()` for response metadata; `client.request()` as an escape hatch
- `labelSelector()` builder, `parseTimeSeries()` for metrics, `isActionRunning()` type guard
- `BaseClient` and exported resource base classes for tree-shaking and custom resource clients
- Typed `sort` parameters and filters, `Date` support for metrics ranges

#### API coverage

- **Storage Boxes** (`client.storageBoxes`, `client.storageBoxTypes`): boxes, snapshots,
  subaccounts, folders and all actions (served by `api.hetzner.com`)
- **Load balancer types** (`client.loadBalancerTypes`)
- **Datacenters** as their own (deprecated) client `client.datacenters`
- **Resource action clients**: `client.<resource>.actions` (`GET /<resource>/actions`)
- Images: actions, `changeProtection()`
- Networks: `listMembers()`, `listAllMembers()`, `iterateMembers()`
- Load balancers: `public_net` on create (existing Primary IPs), health check diagnostics
- Certificates: `createManaged()`
- DNS: `listAllZones()`, `iterateZones()`, `listAllRRSets()`, `iterateRRSets()`
- New fields across resources (server `location`, server type `locations`, image `architecture`, ...)

#### Tooling

- Compiled **ESM + CommonJS** builds with type declarations (tsdown)
- Test suite with 400+ tests (`bun test`), CI workflow, package validation (publint, attw)

### Changed

- **Breaking:** the package ships compiled JavaScript instead of TypeScript sources; Node.js 20+
- **Breaking:** Zod 4; response types no longer carry index signatures
- **Breaking:** responses that do not match the SDK schemas produce a warning instead of an error
  (`responseValidation: "warn"`); responses are returned unchanged, unknown fields are preserved
- **Breaking:** low-level helpers take an options object: `client.get(path, { query, headers })`
- **Breaking:** `delete()` of SSH keys, images, placement groups, volumes, floating IPs, primary
  IPs, networks, firewalls and certificates resolves to `undefined` (the API returns no body);
  `loadBalancers.delete()` returns an action
- **Breaking:** firewall rules are a flat array with `direction`
- **Breaking:** the DNS module was rewritten to match the Zones API (entities, parameters, endpoints)
- **Breaking:** many request and response shapes were corrected, see the migration guide
- Validation error messages name the request (`POST /servers request validation failed: ...`)
- Default action poll interval is a backoff from 0.5s to 5s (was a fixed 1s)
- All dependencies and the toolchain were updated (TypeScript 7, Zod 4, Next.js 16.4, Fumadocs 16,
  Turborepo 2.11, oxlint 1.94, oxfmt 0.79)

### Deprecated

- `pollAction()`, `pollActions()`, `createAndWaitForServer()`, `findServerByName()`,
  `findImageByName()`, `findFloatingIPByIP()` - use the client methods instead
- `client.datacenters` and `locations.listDataCenters()` / `getDataCenter()` - deprecated by Hetzner
- `server.datacenter`, `primaryIP.datacenter` - use `location`

### Removed

- `createAuthHeader()`
- Per-endpoint response schemas that only wrapped an action (use `actionResponseSchema`)
- Duplicate entity schemas and types re-exported from the `servers` module

### Fixed

- `sshKeys.delete()` and other `delete()` calls always failed validation on the empty response
- `loadBalancers.updateService()` used `PUT` instead of `POST`
- DNS zone file export/import and primary nameserver endpoints used wrong URLs and field names
- `pricing.getAll()` did not unwrap the `pricing` envelope
- Floating IP assignment sent `assignee_id` instead of `server`; primary IP assignment did not
  send `assignee_type`
- Server schema required the removed `datacenter` field and modelled `backup_window` incorrectly
- Importing the package's types required Bun type definitions

## [1.0.2] - 2026-01-18

### Added

#### Utilities

- **Pagination Utilities** (`paginate()`, `getAllPages()`) - Automatically iterate through paginated API responses
  - Async generator support for memory-efficient pagination
  - Configurable options (maxPages, delay, perPage)

- **Action Polling Utilities** (`pollAction()`, `pollActions()`) - Wait for actions to complete
  - Automatic polling with configurable interval and timeout
  - Support for parallel action polling
  - Error handling and timeout management

- **Type Guards** - Runtime type checking utilities
  - `isActionCompleted()`, `isActionSuccessful()`, `isActionFailed()` - Action status checks
  - `isServerRunning()`, `isServerStopped()` - Server status checks
  - `isImageAvailable()`, `isSnapshot()`, `isBackup()`, `isSystemImage()` - Image type checks

- **Helper Functions** - Simplify common operations
  - `createAndWaitForServer()` - Create server and wait until it's running
  - `findServerByName()` - Find server by name
  - `findImageByName()` - Find image by name
  - `findFloatingIPByIP()` - Find floating IP by IP address

#### Server Actions

Complete implementation of all 25 Server Actions:

- **Power Management**: `powerOn()`, `powerOff()`, `reboot()`, `reset()`, `shutdown()`
- **ISO Management**: `attachISO()`, `detachISO()`
- **Rescue Mode**: `enableRescueMode()`, `disableRescueMode()`
- **Image Management**: `createImage()`, `rebuild()`
- **Protection**: `changeProtection()`
- **Type Changes**: `changeType()`
- **Backups**: `enableBackups()`, `disableBackups()`
- **Network Management**: `attachToNetwork()`, `detachFromNetwork()`, `changeAliasIPs()`, `changeReverseDNS()`
- **Console Access**: `requestConsole()`
- **Password Reset**: `resetRootPassword()`
- **Placement Groups**: `addToPlacementGroup()`, `removeFromPlacementGroup()`
- **Action Management**: `listActions()`, `getAction()`

#### Documentation

- Complete Utilities documentation with examples
- Expanded Server Actions documentation with detailed examples
- Updated Examples page with utility usage patterns
- Type Guards documentation with usage examples

### Changed

#### Request Handling

- **Improved JSON Serialization**: Automatic removal of `undefined` values from request bodies
  - Ensures clean JSON serialization
  - Prevents API errors from malformed requests
  - Recursive cleaning of nested objects and arrays

#### Type Safety

- Fixed type inference issues in example applications
- Improved import path resolution in monorepo setup
- Better TypeScript configuration for proper type resolution

### Fixed

- Fixed `undefined` values in request bodies causing API errors
- Fixed type inference issues in `apps/example` TypeScript configuration
- Fixed import paths for proper module resolution in monorepo
- Fixed `CreateNetworkParams` type not being properly exported
- Fixed Floating IP helper function to work with API constraints

## [1.0.0] - 2026-01-18

### Added

#### Core SDK

- Initial release of `@nilovonjs/hcloud-js`
- Complete TypeScript SDK for Hetzner Cloud API
- Built-in validation using Zod schemas
- Full TypeScript type definitions
- Comprehensive documentation

#### API Endpoints

Complete support for all Hetzner Cloud API endpoints:

- **Servers** - Full server management with all actions
- **Images** - Image management and operations
- **Actions** - Action tracking and management
- **Certificates** - SSL/TLS certificate management
- **SSH Keys** - SSH key management
- **Locations** - Datacenter location information
- **Firewalls** - Firewall configuration and management
- **Floating IPs** - Floating IP address management
- **ISOs** - ISO image management
- **Placement Groups** - Server placement group management
- **Primary IPs** - Primary IP address management
- **Server Types** - Server type information and specifications
- **Load Balancers** - Load balancer configuration and management
- **Networks** - Private network management
- **Pricing** - Pricing information retrieval
- **Volumes** - Block storage volume management
- **DNS (Zones)** - DNS zone and record management
