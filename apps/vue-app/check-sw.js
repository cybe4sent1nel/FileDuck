/**
 * Manual SW Test - Load and check for syntax errors
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swPath = join(__dirname, 'dist', 'sw.js');

try {
  console.log('Reading sw.js from:', swPath);
  const swContent = readFileSync(swPath, 'utf-8');
  
  console.log('\n✓ File loaded successfully');
  console.log(`File size: ${swContent.length} bytes`);
  
  // Check for our custom fetch handler
  const hasFetchListener = swContent.includes('addEventListener("fetch"') || swContent.includes('addEventListener(\'fetch\'');
  console.log(`${hasFetchListener ? '✓' : '✗'} Has fetch event listener`);
  
  // Check for syntax patterns that might cause issues
  const patterns = {
    'Has self reference': /\bself\b/.test(swContent),
    'Has caches reference': /\bcaches\b/.test(swContent),
    'Has fetch reference': /\bfetch\b/.test(swContent),
    'Has precache manifest': /precache/.test(swContent),
    'Has workbox': /workbox/.test(swContent),
  };
  
  Object.entries(patterns).forEach(([name, result]) => {
    console.log(`${result ? '✓' : '✗'} ${name}`);
  });
  
  // Look for our custom fetch handler at the end
  const lines = swContent.split('\n');
  const lastLines = lines.slice(-20).join('\n');
  
  console.log('\nLast 20 lines of sw.js:');
  console.log('='.repeat(60));
  console.log(lastLines);
  console.log('='.repeat(60));
  
  // Try to evaluate it (basic syntax check)
  try {
    // Note: This won't fully work in Node but will catch basic syntax errors
    new Function(swContent);
    console.log('\n✓ No obvious syntax errors detected');
  } catch (err) {
    console.error('\n✗ Syntax error detected:', err.message);
  }
  
} catch (err) {
  console.error('✗ Error reading sw.js:', err.message);
  process.exit(1);
}
