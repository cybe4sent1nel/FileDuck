/**
 * Quick Service Worker Test - Check registration error
 */

import puppeteer from 'puppeteer';

async function quickTest() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Capture all console messages with more detail
  page.on('console', async msg => {
    const args = [];
    for (const arg of msg.args()) {
      try {
        const val = await arg.jsonValue();
        args.push(val);
      } catch {
        try {
          const text = await arg.evaluate(obj => {
            if (obj instanceof Error) {
              return {
                name: obj.name,
                message: obj.message,
                stack: obj.stack,
              };
            }
            return String(obj);
          });
          args.push(text);
        } catch {
          args.push(arg.toString());
        }
      }
    }
    console.log(`[Browser ${msg.type()}]:`, ...args);
  });

  // Capture page errors
  page.on('pageerror', error => {
    console.log('[Page Error]:', error.message);
  });

  // Navigate to the app
  console.log('Navigating to http://localhost:4173...');
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });

  // Wait a bit for SW registration
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Check SW registration status
  const swStatus = await page.evaluate(async () => {
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        return {
          success: true,
          scope: reg.scope,
          state: reg.active?.state || reg.installing?.state || reg.waiting?.state || 'unknown',
          scriptURL: reg.active?.scriptURL || reg.installing?.scriptURL || reg.waiting?.scriptURL,
        };
      }
      return { success: false, error: 'No registration found' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  console.log('\nService Worker Status:', JSON.stringify(swStatus, null, 2));

  // Keep browser open for inspection
  console.log('\nBrowser will stay open for 30 seconds. Check DevTools for errors...');
  await new Promise(resolve => setTimeout(resolve, 30000));

  await browser.close();
}

quickTest().catch(console.error);
