# Offline Service Worker Test Results

## Test Summary
**Date**: February 6, 2026
**Environment**: Local Preview Server (localhost:4173)
**Browser**: Puppeteer Chromium

## Test Results

### ✓ Service Worker File Generation
- **Status**: PASS
- **Details**: sw.js successfully generated (27,686 bytes)
- **Features Detected**:
  - ✓ Workbox integration
  - ✓ Precache manifest (23 entries)
  - ✓ Fetch event listener
  - ✓ Cache strategies configured
  - ✓ No syntax errors

### ✗ Service Worker Registration  
- **Status**: FAIL
- **Error**: Service Worker registration timeout / Empty error object
- **Root Cause**: Conflicting fetch event listeners
  - Workbox adds its own fetch listener
  - Custom fetch listener added afterward causes conflict
  - Both try to handle the same requests

## Problem Identified

The current `sw.ts` has a custom `fetch` event listener that conflicts with Workbox's built-in routing:

```typescript
// In sw.ts - THIS CONFLICTS WITH WORKBOX
self.addEventListener('fetch', (event) => {
  // Custom caching logic...
});
```

**Why it fails:**
1. Workbox already registers a fetch listener via `registerRoute()` and routing system
2. Adding another `addEventListener('fetch')` creates race conditions
3. Service Worker fails to activate properly due to this conflict

## Solution

**Remove the custom fetch handler** and rely entirely on Workbox's routing system:

### Current Approach (Broken):
```typescript
// ❌ Don't do this - conflicts with Workbox
self.addEventListener('fetch', (event) => {
  // manual caching logic
});
```

### Correct Approach:
```typescript
// ✓ Let Workbox handle everything via its routing system
registerRoute(
  ({request}) => !request.url.includes('/api/'),
  new CacheFirst({
    cacheName: 'runtime-cache-v1',
    plugins: [...]
  })
);
```

## Recommended Fix

Update `apps/vue-app/src/sw.ts` to use **only** Workbox routing:

1. Remove the custom `self.addEventListener('fetch', ...)` block
2. Use Workbox's `NavigationRoute` for offline navigation
3. Use Workbox's `CacheFirst` strategy for assets
4. Use Workbox's `NetworkFirst` strategy with fallback for HTML

## Test Checklist for Next Run

After implementing the fix, verify:

- [ ] Service Worker registers successfully
- [ ] No errors in browser console
- [ ] Cache Storage shows precached entries
- [ ] Assets (JS/CSS) load from cache when offline
- [ ] Navigation works offline (no blank pages)
- [ ] Offline page (`/offline`) displays properly
- [ ] Online/offline transitions work smoothly
- [ ] No `ERR_NAME_NOT_RESOLVED` or `ERR_INTERNET_DISCONNECTED` errors for cached assets

## Next Steps

1. **Fix sw.ts** to remove conflicting fetch handler
2. **Rebuild** the app: `pnpm run build`
3. **Run test again**: `pnpm run test:offline`
4. **Manual verification** in DevTools
5. **Commit and deploy** once tests pass

## Current Test Script

The automated test script (`test-offline.js`) successfully:
- ✓ Launches browser
- ✓ Navigates to app
- ✓ Checks service worker registration status
- ✓ Verifies cache storage
- ✓ Simulates offline mode
- ✓ Captures screenshots
- ✓ Reports detailed results

The test script is ready to use once the SW registration issue is fixed.
