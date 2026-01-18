# Contributing to @nilovonjs/hcloud-js

Thank you for your interest in contributing to @nilovonjs/hcloud-js! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/hcloud-js.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

```bash
# Install dependencies
bun install

# Run type checking
bun run check-types

# Run linting and formatting
bun run check
```

## Code Style

- Follow TypeScript best practices
- Use Zod for schema validation
- Maintain type safety throughout
- Add JSDoc comments for public APIs
- Follow the existing code structure

## Pull Request Process

1. Ensure your code passes all checks
2. Update documentation if needed
3. Add tests if applicable
4. Update CHANGELOG.md with your changes
5. Submit PR with a clear description

## Reporting Issues

Please use the GitHub issue tracker to report bugs or suggest features. Include:
- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
