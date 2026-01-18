# Pre-Publish Checklist

Use this checklist before publishing to npm:

## ✅ Package Configuration
- [x] Package name: `@nilovonjs/hcloud-js`
- [x] Version is set (currently 0.1.0)
- [x] `publishConfig.access: "public"` is set
- [x] Repository URLs are correct
- [x] Homepage points to documentation

## ✅ Files
- [x] README.md exists and is complete
- [x] LICENSE file exists (MIT)
- [x] CHANGELOG.md created
- [x] CONTRIBUTING.md created
- [x] .npmignore is configured
- [x] Only necessary files are included

## ✅ Dependencies
- [x] All dependencies are listed correctly
- [x] No workspace dependencies in published package
- [x] peerDependencies are set correctly
- [x] No devDependencies that shouldn't be published

## ✅ Code Quality
- [x] All TypeScript files are valid
- [x] No build errors
- [x] Exports are correct
- [x] Types are exported properly

## 📝 Before Publishing

1. **Remove workspace dependencies**:
   - Remove `@hcloud-js/config` from devDependencies (already done)
   - Ensure no workspace:* references remain

2. **Test the package locally**:
   ```bash
   cd packages/library
   npm pack
   # This creates a .tgz file - test installing it in a test project
   ```

3. **Verify what will be published**:
   ```bash
   npm pack --dry-run
   ```

4. **Login to npm**:
   ```bash
   npm login
   # Make sure you're logged in as a member of @nilovonjs org
   ```

5. **Verify organization access**:
   ```bash
   npm org ls nilovonjs
   ```

6. **Publish**:
   ```bash
   npm publish
   # or
   bun publish
   ```

## 🔍 Post-Publish Verification

1. Check npm registry: https://www.npmjs.com/package/@nilovonjs/hcloud-js
2. Test installation: `npm install @nilovonjs/hcloud-js`
3. Verify package works in a test project
4. Update documentation links if needed
