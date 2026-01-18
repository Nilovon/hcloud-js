# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
