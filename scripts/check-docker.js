#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkDockerRunning() {
  // Skip check in production or CI environments (like Railway)
  if (process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT || process.env.CI) {
    console.log('Skipping Docker check in production/CI environment');
    return true;
  }

  try {
    execSync('docker info', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

function getDockerStartInstructions() {
  const platform = os.platform();
  
  if (platform === 'win32') {
    return [
      '1. Open Docker Desktop from Start Menu',
      '2. Wait for Docker to start (whale icon in system tray)',
      '3. Run this command again: pnpm start',
    ];
  } else if (platform === 'darwin') {
    return [
      '1. Open Docker Desktop from Applications',
      '2. Wait for Docker to start (whale icon in menu bar)',
      '3. Run this command again: pnpm start',
    ];
  } else {
    return [
      '1. Start Docker service: sudo systemctl start docker',
      '2. Run this command again: pnpm start',
    ];
  }
}

function main() {
  log('\n🐳 Checking Docker status...', 'cyan');
  
  if (checkDockerRunning()) {
    log('✅ Docker is running!\n', 'green');
    return 0;
  }
  
  log('\n❌ Docker Desktop is not running!', 'red');
  log('\n' + '='.repeat(60), 'yellow');
  log('  Please Start Docker Desktop First', 'bold');
  log('='.repeat(60), 'yellow');
  
  log('\n📋 Steps to continue:', 'yellow');
  const instructions = getDockerStartInstructions();
  instructions.forEach((instruction) => {
    log(`  ${instruction}`, 'cyan');
  });
  
  log('\n🐳 Required Docker services:', 'yellow');
  log('  • MinIO (S3-compatible storage)', 'cyan');
  log('  • ClamAV (Antivirus scanning)', 'cyan');
  log('  • Redis (Session storage)', 'cyan');
  log('  • Scanner (Malware detection service)', 'cyan');
  
  log('\n' + '='.repeat(60), 'yellow');
  log('\n💡 You control Docker manually:', 'green');
  log('   Start Docker Desktop → pnpm start', 'green');
  log('   Stop with Docker Desktop or: pnpm docker:down\n', 'green');
  
  process.exit(1);
}

main();
