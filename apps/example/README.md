# Hetzner Cloud SDK Example Application

This is a comprehensive example application demonstrating how to use the Hetzner Cloud TypeScript SDK.

## Prerequisites

- [Bun](https://bun.sh) installed (version 1.3.3 or later)
- A Hetzner Cloud API token ([Get one here](https://console.hetzner.cloud/))

## Setup

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Configure your API token:**
   
   Create a `.env` file in the `apps/example` directory:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Hetzner Cloud API token:
   ```
   HCLOUD_API_TOKEN=your-api-token-here
   ```
   
   Alternatively, you can set the environment variable directly:
   ```bash
   export HCLOUD_API_TOKEN=your-api-token-here
   ```

## Running Examples

### Run All Examples

Run all examples at once:
```bash
bun run dev
```

### Run Individual Examples

Run specific API examples:

**Servers API:**
```bash
bun run servers
```

**Images API:**
```bash
bun run images
```

**Actions API:**
```bash
bun run actions
```

## Examples Included

### Servers API (`src/examples/servers.ts`)

- ✅ List all servers
- ✅ List servers with filters (status, sorting, pagination)
- ✅ Get a specific server by ID
- ✅ Get server metrics

### Images API (`src/examples/images.ts`)

- ✅ List all images
- ✅ List images by type (system, snapshot, backup)
- ✅ Filter images by status and architecture
- ✅ Get a specific image by ID
- ✅ Update image (description, labels) - for snapshots/backups only

### Actions API (`src/examples/actions.ts`)

- ✅ List all actions
- ✅ List actions by status (running, success, error)
- ✅ Filter actions by IDs
- ✅ Get a specific action by ID
- ✅ Sort actions by various fields

## Project Structure

```
apps/example/
├── src/
│   ├── index.ts              # Main entry point
│   ├── config.ts             # Configuration management
│   └── examples/
│       ├── servers.ts        # Servers API examples
│       ├── images.ts         # Images API examples
│       └── actions.ts        # Actions API examples
├── .env.example              # Example environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Configuration

The application reads configuration from environment variables:

- `HCLOUD_API_TOKEN` (required): Your Hetzner Cloud API token
- `HCLOUD_API_BASE_URL` (optional): API base URL (defaults to `https://api.hetzner.cloud/v1`)
- `HCLOUD_API_TIMEOUT` (optional): Request timeout in milliseconds (defaults to `30000`)

## Error Handling

All examples include proper error handling. If an API call fails, you'll see:
- ❌ Clear error messages
- Stack traces for debugging
- Graceful fallbacks where appropriate

## Tips

1. **Start with Servers API**: It's the most commonly used endpoint
2. **Check your token**: Make sure your API token has the necessary permissions
3. **Handle rate limits**: The Hetzner Cloud API has rate limits, so be mindful of making too many requests
4. **Use filters**: When listing resources, use filters to reduce response size and improve performance

## Troubleshooting

**"API token is required" error:**
- Make sure you've set `HCLOUD_API_TOKEN` in your `.env` file or environment variables

**401 Unauthorized error:**
- Check that your API token is valid and has the correct permissions
- Verify the token is set correctly in your environment

**Network errors:**
- Check your internet connection
- Verify the API base URL is correct (if using a custom one)

## Learn More

- [Hetzner Cloud API Documentation](https://docs.hetzner.cloud/reference/cloud)
- [SDK Documentation](../../packages/library/README.md)
- [Hetzner Cloud Console](https://console.hetzner.cloud/)
