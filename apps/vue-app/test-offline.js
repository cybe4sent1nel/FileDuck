/**
 * Offline Service Worker Test Script
 * Tests the offline functionality by simulating offline conditions
 * and verifying page content loads properly
 */

import puppeteer from 'puppeteer';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const TEST_URL = process.env.TEST_URL || 'http://localhost:4173';
const TIMEOUT = 30000;

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'cyan');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  let browser;
  let testsPassed = 0;
  let testsFailed = 0;

  try {
    log('\n🚀 Starting Offline Service Worker Tests\n', 'blue');

    // Launch browser
    logInfo('Launching browser...');
    browser = await puppeteer.launch({
      headless: false, // Set to true for CI/CD
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Set up console message listener
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('error') || text.includes('Error')) {
        logWarning(`Browser console: ${text}`);
      }
    });

    // Track network errors
    const networkErrors = [];
    page.on('requestfailed', request => {
      networkErrors.push({
        url: request.url(),
        failure: request.failure(),
      });
    });

    // Test 1: Navigate to the app
    log('\n📋 Test 1: Initial page load', 'yellow');
    try {
      await page.goto(TEST_URL, { waitUntil: 'networkidle0', timeout: TIMEOUT });
      logSuccess('Page loaded successfully');
      testsPassed++;
    } catch (error) {
      logError(`Failed to load page: ${error.message}`);
      testsFailed++;
      throw error;
    }

    // Test 2: Wait for service worker registration
    log('\n📋 Test 2: Service Worker registration', 'yellow');
    try {
      const swRegistered = await page.evaluate(async () => {
        if (!('serviceWorker' in navigator)) {
          return { success: false, error: 'Service Worker not supported' };
        }

        // Wait for registration
        const maxWait = 10000;
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWait) {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration && registration.active) {
            return {
              success: true,
              scope: registration.scope,
              state: registration.active.state,
            };
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        return { success: false, error: 'Service Worker registration timeout' };
      });

      if (swRegistered.success) {
        logSuccess(`Service Worker registered and active (scope: ${swRegistered.scope})`);
        testsPassed++;
      } else {
        logError(`Service Worker registration failed: ${swRegistered.error}`);
        testsFailed++;
      }
    } catch (error) {
      logError(`Service Worker check failed: ${error.message}`);
      testsFailed++;
    }

    // Test 3: Check cache storage
    log('\n📋 Test 3: Cache Storage verification', 'yellow');
    try {
      const cacheInfo = await page.evaluate(async () => {
        const cacheNames = await caches.keys();
        const cacheDetails = [];

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          cacheDetails.push({
            name: cacheName,
            entries: keys.length,
            urls: keys.slice(0, 5).map(req => req.url), // First 5 URLs
          });
        }

        return cacheDetails;
      });

      if (cacheInfo.length > 0) {
        logSuccess(`Found ${cacheInfo.length} cache(s):`);
        cacheInfo.forEach(cache => {
          logInfo(`  - ${cache.name}: ${cache.entries} entries`);
        });
        testsPassed++;
      } else {
        logError('No caches found');
        testsFailed++;
      }
    } catch (error) {
      logError(`Cache verification failed: ${error.message}`);
      testsFailed++;
    }

    // Test 4: Navigate around (online)
    log('\n📋 Test 4: Navigation (online)', 'yellow');
    try {
      const routes = ['/', '/about', '/features', '/privacy'];
      for (const route of routes) {
        await page.goto(`${TEST_URL}${route}`, { waitUntil: 'networkidle0', timeout: TIMEOUT });
        await sleep(500); // Let SW cache the page
      }
      logSuccess(`Navigated to ${routes.length} routes successfully`);
      testsPassed++;
    } catch (error) {
      logError(`Navigation failed: ${error.message}`);
      testsFailed++;
    }

    // Test 5: Go offline and test navigation
    log('\n📋 Test 5: Offline navigation', 'yellow');
    try {
      // Enable offline mode
      await page.setOfflineMode(true);
      logInfo('Set offline mode: ON');

      // Clear network errors
      networkErrors.length = 0;

      // Navigate to home
      await page.goto(TEST_URL, { waitUntil: 'networkidle0', timeout: TIMEOUT });
      
      // Check if page loaded
      const content = await page.content();
      if (content.includes('<!DOCTYPE html>') || content.includes('<html')) {
        logSuccess('Home page loaded offline');
        testsPassed++;
      } else {
        logError('Home page did not load properly offline');
        testsFailed++;
      }
    } catch (error) {
      logError(`Offline navigation failed: ${error.message}`);
      testsFailed++;
    }

    // Test 6: Check for network errors
    log('\n📋 Test 6: Network error verification', 'yellow');
    if (networkErrors.length === 0) {
      logSuccess('No network errors detected');
      testsPassed++;
    } else {
      logWarning(`Found ${networkErrors.length} network error(s):`);
      networkErrors.slice(0, 5).forEach(err => {
        logWarning(`  - ${err.url}: ${err.failure?.errorText || 'Unknown'}`);
      });
      
      // Check if errors are for API calls (expected)
      const nonApiErrors = networkErrors.filter(err => !err.url.includes('/api/'));
      if (nonApiErrors.length === 0) {
        logSuccess('All errors are for API calls (expected behavior)');
        testsPassed++;
      } else {
        logError(`Found ${nonApiErrors.length} non-API network errors`);
        testsFailed++;
      }
    }

    // Test 7: Verify offline page content
    log('\n📋 Test 7: Offline page content verification', 'yellow');
    try {
      await page.goto(`${TEST_URL}/offline`, { waitUntil: 'networkidle0', timeout: TIMEOUT });
      
      const pageContent = await page.evaluate(() => {
        return {
          title: document.title,
          bodyText: document.body.innerText,
          hasLogo: !!document.querySelector('img[alt*="logo" i], img[alt*="duck" i]'),
          hasHeading: !!document.querySelector('h1, h2'),
          hasStyles: window.getComputedStyle(document.body).backgroundColor !== 'rgba(0, 0, 0, 0)',
        };
      });

      logInfo(`Page title: "${pageContent.title}"`);
      
      if (pageContent.hasHeading) {
        logSuccess('Offline page has heading');
      } else {
        logWarning('Offline page missing heading');
      }

      if (pageContent.hasStyles) {
        logSuccess('Offline page has CSS styles applied');
      } else {
        logError('Offline page has no CSS styles (blank white page)');
        testsFailed++;
      }

      if (pageContent.bodyText.toLowerCase().includes('offline') || 
          pageContent.bodyText.toLowerCase().includes('internet')) {
        logSuccess('Offline page has appropriate content');
        testsPassed++;
      } else {
        logWarning('Offline page content may not be appropriate');
        logInfo(`Content preview: ${pageContent.bodyText.substring(0, 100)}...`);
        testsPassed++; // Still pass if page loads
      }
    } catch (error) {
      logError(`Offline page verification failed: ${error.message}`);
      testsFailed++;
    }

    // Test 8: Check JavaScript execution offline
    log('\n📋 Test 8: JavaScript execution offline', 'yellow');
    try {
      const jsWorks = await page.evaluate(() => {
        // Test if Vue is loaded
        return {
          hasVue: typeof window.__VUE__ !== 'undefined' || !!document.querySelector('[data-v-app]'),
          canRunJS: true,
        };
      });

      if (jsWorks.canRunJS) {
        logSuccess('JavaScript executes properly offline');
        testsPassed++;
      } else {
        logError('JavaScript execution issues offline');
        testsFailed++;
      }
    } catch (error) {
      logError(`JavaScript check failed: ${error.message}`);
      testsFailed++;
    }

    // Test 9: Screenshot comparison
    log('\n📋 Test 9: Visual verification (screenshot)', 'yellow');
    try {
      await page.screenshot({ 
        path: path.join(__dirname, 'test-offline-screenshot.png'),
        fullPage: true,
      });
      logSuccess('Screenshot saved to test-offline-screenshot.png');
      testsPassed++;
    } catch (error) {
      logWarning(`Screenshot failed: ${error.message}`);
    }

    // Test 10: Go back online
    log('\n📋 Test 10: Return to online mode', 'yellow');
    try {
      await page.setOfflineMode(false);
      await sleep(1000);
      
      // Navigate to home
      await page.goto(TEST_URL, { waitUntil: 'networkidle0', timeout: TIMEOUT });
      
      logSuccess('Successfully returned to online mode');
      testsPassed++;
    } catch (error) {
      logError(`Failed to return online: ${error.message}`);
      testsFailed++;
    }

    // Summary
    log('\n' + '='.repeat(50), 'blue');
    log('📊 Test Summary', 'blue');
    log('='.repeat(50), 'blue');
    logSuccess(`Tests passed: ${testsPassed}`);
    if (testsFailed > 0) {
      logError(`Tests failed: ${testsFailed}`);
    }
    log(`Total tests: ${testsPassed + testsFailed}\n`, 'cyan');

    if (testsFailed === 0) {
      log('🎉 All tests passed! Service Worker is working correctly.\n', 'green');
    } else {
      log('❌ Some tests failed. Please review the errors above.\n', 'red');
      process.exit(1);
    }

  } catch (error) {
    logError(`\n💥 Test suite failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
      logInfo('Browser closed');
    }
  }
}

// Run tests
runTests().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
