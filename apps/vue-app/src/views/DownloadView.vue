<template>
  <div class="max-w-3xl mx-auto px-2 sm:px-4">
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border-2 border-yellow-100">
      <div class="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8 gap-3 sm:gap-0">
        <img src="/logo.png" alt="FileDuck" class="h-12 sm:h-16 w-12 sm:w-16 sm:mr-4 transform hover:rotate-12 transition-transform" />
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-center text-fuchsia-900">
          Download File
        </h1>
      </div>

      <div v-if="!downloadUrl" class="space-y-6">
        <!-- Verify Code Animation -->
        <div class="flex justify-center bg-gradient-to-br from-yellow-50 to-cream-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
          <Vue3Lottie
            :animationData="VerifyCodeAnimation"
            :height="150"
            :width="150"
            class="sm:!h-[180px] sm:!w-[180px] md:!h-[200px] md:!w-[200px]"
            :loop="true"
          />
        </div>

        <!-- Share Code Input -->
        <div class="bg-gradient-to-r from-purple-50 to-yellow-50 rounded-xl p-4 sm:p-6 border-2 border-purple-200">
          <label class="text-sm sm:text-base font-bold text-purple-700 mb-3 flex items-center justify-center sm:justify-start">
            <KeyIcon class="w-5 h-5 mr-2" />
            Enter Share Code
          </label>
          <input
            v-model="inputCode"
            type="text"
            placeholder="e.g., aBc123XyZ9"
            class="input-field text-center text-xl sm:text-2xl md:text-3xl font-mono uppercase tracking-wider bg-white text-gray-900 placeholder-gray-400 caret-purple-600 focus:caret-purple-700"
            @keyup.enter="redeemCode"
            maxlength="10"
          />
        </div>

        <!-- CAPTCHA (if required) -->
        <div v-if="captchaRequired" class="bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-400 rounded-xl p-4 sm:p-6 shadow-lg">
          <p class="text-sm sm:text-base font-bold text-yellow-900 mb-4 flex items-center justify-center sm:justify-start">
            <AlertTriangleIcon class="w-5 sm:w-6 h-5 sm:h-6 mr-2" />
            CAPTCHA verification required
          </p>
          <div class="flex justify-center">
            <TurnstileWidget
              :siteKey="turnstilesiteKey"
              action="download"
              @verified="handleCaptchaVerified"
              @error="handleCaptchaError"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-gradient-to-r from-red-100 to-red-50 border-2 border-red-400 rounded-xl p-6 shadow-xl">
          <div class="flex items-start">
            <Vue3Lottie
              v-if="errorMessage.toLowerCase().includes('malicious') || errorMessage.toLowerCase().includes('quarantine')"
              :animationData="ShockedDuckAnimation"
              :height="100"
              :width="100"
              :loop="false"
              class="mr-4 flex-shrink-0"
            />
            <XCircleIcon v-else class="w-8 h-8 text-red-600 mr-3 flex-shrink-0" />
            <div class="flex-1">
              <p class="text-lg font-bold text-red-900 mb-2">
                {{ errorMessage.toLowerCase().includes('malicious') || errorMessage.toLowerCase().includes('quarantine') ? '⚠️ WARNING: Potentially Malicious File' : 'Error' }}
              </p>
              <p class="text-base text-red-800 bg-white/50 p-3 rounded">
                {{ errorMessage }}
              </p>
              <p v-if="errorMessage.toLowerCase().includes('quarantine')" class="text-sm text-red-700 mt-3">
                This file has been flagged by our security systems. Proceed with extreme caution and scan with your own antivirus before opening.
              </p>
            </div>
          </div>
        </div>

        <!-- Redeem Button -->
        <button
          @click="redeemCode"
          :disabled="!inputCode || isRedeeming"
          class="btn-primary w-full text-base sm:text-lg md:text-xl py-3 sm:py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <LoaderIcon v-if="isRedeeming" class="w-5 sm:w-6 h-5 sm:h-6 mr-2 animate-spin" />
          <UnlockIcon v-else class="w-5 sm:w-6 h-5 sm:h-6 mr-2" />
          {{ isRedeeming ? 'Verifying...' : 'Access File' }}
        </button>
      </div>

      <!-- File Info & Download -->
      <div v-else class="space-y-6">
        <!-- Scan Skipped Warning (for large unscanned files) -->
        <div v-if="fileInfo.scanSkipped && !fileInfo.isQuarantined" class="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6 shadow-lg">
          <div class="flex items-start">
            <AlertTriangleIcon class="w-16 h-16 text-yellow-600 mr-4 flex-shrink-0" />
            <div class="flex-1">
              <p class="text-lg font-bold text-yellow-900 mb-3 flex items-center">
                <AlertTriangleIcon class="w-6 h-6 mr-2" />
                ⚠️ SECURITY NOTICE: FILE NOT SCANNED
              </p>
              <p class="text-base text-yellow-800 mb-3 bg-white/50 p-3 rounded">
                This file was <strong>not scanned for viruses or malware</strong> before upload.
              </p>
              <ul class="text-sm text-yellow-700 space-y-2 mb-4 bg-white/30 p-3 rounded">
                <li class="flex items-start"><span class="mr-2">•</span>File was not scanned because scanning was skipped for large files or by the sender</li>
                <li class="flex items-start"><span class="mr-2">•</span><strong class="text-red-700">DOWNLOAD AT YOUR OWN RESPONSIBILITY</strong> - File may contain harmful content</li>
                <li class="flex items-start"><span class="mr-2">•</span><strong>Strongly recommended:</strong> Scan with your own antivirus before opening</li>
                <li class="flex items-start"><span class="mr-2">•</span>Verify the SHA-256 checksum below to ensure file integrity</li>
              </ul>
              <p class="text-sm font-bold text-yellow-900">
                💡 FileDuck is not responsible for any damage caused by downloading unscanned files. Proceed with extreme caution.
              </p>

              <div class="mt-4">
                <button
                  @click="runPreDownloadScan"
                  :disabled="isPreDownloadScanning"
                  class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isPreDownloadScanning ? 'Scanning...' : 'Run security scan before download' }}
                </button>
                <p v-if="preDownloadScanMessage" class="mt-3 text-sm" :class="preDownloadScanStatus === 'clean' ? 'text-green-700' : preDownloadScanStatus === 'infected' ? 'text-red-700' : 'text-yellow-700'">
                  {{ preDownloadScanMessage }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quarantine Warning (if applicable) -->
        <div v-if="fileInfo.isQuarantined" class="bg-red-50 border-2 border-red-400 rounded-lg p-4">
          <div class="flex items-start">
            <Vue3Lottie
              :animationData="ShockedDuckAnimation"
              :height="80"
              :width="80"
              :loop="false"
              class="mr-4 flex-shrink-0"
            />
            <div class="flex-1">
              <p class="text-lg font-bold text-red-900 mb-3 flex items-center">
                <AlertTriangleIcon class="w-6 h-6 mr-2" />
                SECURITY WARNING: QUARANTINED FILE
              </p>
              <p class="text-base text-red-800 mb-3 bg-white/50 p-3 rounded">
                This file has been flagged as potentially malicious by one or more antivirus engines.
              </p>
              <ul class="text-sm text-red-700 space-y-2 mb-4 bg-white/30 p-3 rounded">
                <li class="flex items-start"><span class="mr-2">\u2022</span>File is stored in quarantine and isolated from public access</li>
                <li class="flex items-start"><span class="mr-2">\u2022</span>Download at your own risk</li>
                <li class="flex items-start"><span class="mr-2">\u2022</span>Scan with updated antivirus before opening</li>
                <li class="flex items-start"><span class="mr-2">\u2022</span>Do NOT execute or open if you are unsure</li>
              </ul>
              <p class="text-sm font-bold text-red-900">
                FileDuck is not responsible for any damage caused by downloading this file.
              </p>
            </div>
          </div>
        </div>

        <div class="text-center bg-gradient-to-r from-yellow-50 to-cream-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
          <Vue3Lottie
            :animationData="DataDownloadingAnimation"
            :height="160"
            :width="160"
            class="sm:!h-[200px] sm:!w-[200px] md:!h-[220px] md:!w-[220px]"
            :loop="true"
          />
          <h2 class="text-xl sm:text-2xl md:text-3xl font-bold mb-2" :class="fileInfo.isQuarantined ? 'text-red-600' : 'text-green-600'">
            {{ fileInfo.isQuarantined ? 'Quarantined File Access' : 'File Ready for Download' }}
          </h2>
        </div>

        <div class="bg-gradient-to-r from-purple-50 to-yellow-50 border-2 border-purple-200 rounded-xl p-6 space-y-4">
          <div class="flex justify-between items-center text-base">
            <span class="flex items-center font-bold text-purple-700">
              <FileIcon class="w-5 h-5 mr-2" />
              Filename:
            </span>
            <span class="text-gray-800">{{ fileInfo.filename }}</span>
          </div>
          <div class="flex justify-between items-center text-base">
            <span class="flex items-center font-bold text-purple-700">
              <HardDriveIcon class="w-5 h-5 mr-2" />
              Size:
            </span>
            <span class="text-gray-800">{{ formatSize(fileInfo.size) }}</span>
          </div>
          <div class="flex justify-between items-center text-base">
            <span class="flex items-center font-bold text-yellow-700">
              <DownloadIcon class="w-5 h-5 mr-2" />
              Downloads left:
            </span>
            <span class="text-gray-800">{{ fileInfo.usesLeft === 999 ? 'Unlimited' : fileInfo.usesLeft }}</span>
          </div>
          <div class="flex justify-between items-center text-base">
            <span class="flex items-center font-bold text-yellow-700">
              <ClockIcon class="w-5 h-5 mr-2" />
              Expires:
            </span>
            <span class="text-gray-800">{{ formatExpiry(fileInfo.expiresAt) }}</span>
          </div>
        </div>

        <!-- SHA-256 Checksum -->
        <div class="bg-gradient-to-r from-green-100 to-emerald-50 border-2 border-green-300 rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-base font-bold text-green-800 flex items-center">
                <ShieldCheckIcon class="w-6 h-6 mr-2" />
                SHA-256 Checksum
              </p>
              <p class="font-mono text-sm text-green-700 mt-2 break-all bg-white/50 p-2 rounded">
                {{ fileInfo.sha256 }}
              </p>
            </div>
            <button @click="copyChecksum" class="text-green-600 hover:text-green-700 hover:scale-110 transition-transform ml-4">
              <CopyIcon class="w-6 h-6" />
            </button>
          </div>
          <p class="text-sm text-green-600 mt-3 flex items-center font-semibold">
            <CheckCircleIcon class="w-4 h-4 mr-2" />
            Verify this checksum after download to ensure integrity
          </p>
        </div>

        <!-- Download Progress -->
        <div v-if="downloadProgress > 0 && downloadProgress < 100" class="space-y-3 bg-gradient-to-br from-purple-100 to-yellow-100 rounded-xl p-6 border-2 border-purple-300">
          <div class="flex justify-between text-base font-semibold text-purple-700">
            <span class="flex items-center">
              <DownloadIcon class="w-5 h-5 mr-2" />
              Downloading...
            </span>
            <span class="font-bold text-xl">{{ downloadProgress }}%</span>
          </div>
          <div class="w-full h-8 rounded-full prism-track relative overflow-hidden">
            <div
              class="h-full prism-fill rounded-full relative transition-all duration-200 ease-out"
              :style="{ width: downloadProgress + '%' }"
            >
              <div class="absolute inset-0 opacity-30" style="background-image: radial-gradient(white 1px, transparent 1px); background-size: 10px 10px;"></div>
            </div>
            <div class="absolute inset-0 prism-glass-overlay rounded-full"></div>
          </div>
        </div>

        <!-- Download Success Animation -->
        <div v-if="downloadSuccess" class="bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl p-6 border-2 border-green-300">
          <div class="flex flex-col items-center">
            <Vue3Lottie
              :animationData="DownloadSuccessAnimation"
              :height="160"
              :width="160"
              :loop="true"
            />
            <p class="text-xl font-bold text-green-800 mt-4">✅ Download Complete!</p>
            <p class="text-sm text-green-600 mt-2">Check your downloads folder</p>
          </div>
        </div>

        <!-- Optional Safety Scan (if upload was not scanned) -->
        <div v-if="fileInfo.scanSkipped" class="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-5 shadow-lg">
          <div class="flex items-start">
            <AlertTriangleIcon class="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" />
            <div class="flex-1">
              <p class="text-sm font-bold text-yellow-900 mb-2">Optional safety scan available</p>
              <p class="text-sm text-yellow-800 mb-3">
                This file was uploaded without a scan. You can run a safety scan before downloading.
              </p>
              <div class="flex flex-wrap gap-3 items-center">
                <button
                  @click="runSafetyScan"
                  :disabled="scanBeforeStatus === 'scanning'"
                  class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {{ scanBeforeStatus === 'scanning' ? 'Scanning...' : 'Run Safety Scan' }}
                </button>
                <span v-if="scanBeforeMessage" class="text-sm font-semibold" :class="scanBeforeClass">
                  {{ scanBeforeMessage }}
                </span>
              </div>
              <p class="text-xs text-yellow-700 mt-2">
                This is optional and does not affect your download availability.
              </p>
            </div>
          </div>
        </div>

        <!-- Download Button -->
        <button
          @click="initiateDownload"
          class="btn-primary w-full text-base sm:text-lg md:text-xl py-3 sm:py-4 flex items-center justify-center shadow-xl hover:shadow-2xl"
        >
          <DownloadIcon class="w-5 sm:w-6 h-5 sm:h-6 mr-2" />
          Download File
        </button>

        <button @click="resetForm" class="btn-secondary w-full flex items-center justify-center text-base sm:text-lg md:text-xl py-3 sm:py-4 shadow-xl hover:shadow-2xl">
          <RefreshCwIcon class="w-5 sm:w-6 h-5 sm:h-6 mr-2" />
          Download Another File
        </button>

        <!-- Warning -->
        <div class="bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-400 rounded-xl p-5 shadow-lg">
          <p class="text-sm text-yellow-900 flex items-center font-semibold">
            <AlertTriangleIcon class="w-5 h-5 mr-2" />
            This link expires in 1 hour. The file was scanned for malware, but always verify the checksum and scan downloads with your antivirus.
          </p>
        </div>
      </div>
    </div>

    <!-- Security Info -->
    <div class="mt-8 bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl shadow-xl p-8 border-2 border-green-300">
      <div class="flex items-start space-x-4">
        <ShieldCheckIcon class="w-12 h-12 text-green-600 flex-shrink-0" />
        <div>
          <h3 class="font-bold text-2xl text-green-800 mb-4">Security Verified</h3>
          <ul class="text-base text-green-700 space-y-3">
            <li class="flex items-center">
              <CheckCircleIcon class="w-5 h-5 mr-3 flex-shrink-0" />
              <span>Scanned by advanced antivirus engine</span>
            </li>
            <li class="flex items-center">
              <CheckCircleIcon class="w-5 h-5 mr-3 flex-shrink-0" />
              <span>Checked against VirusTotal database</span>
            </li>
            <li class="flex items-center">
              <CheckCircleIcon class="w-5 h-5 mr-3 flex-shrink-0" />
              <span>SHA-256 integrity checksum provided</span>
            </li>
            <li class="flex items-center">
              <CheckCircleIcon class="w-5 h-5 mr-3 flex-shrink-0" />
              <span>Served via secure CDN with signed URLs</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Vue3Lottie } from 'vue3-lottie';
import {
  KeyIcon, AlertTriangleIcon, XCircleIcon, UnlockIcon, LoaderIcon,
  FileIcon, HardDriveIcon, DownloadIcon, ClockIcon, ShieldCheckIcon,
  CopyIcon, CheckCircleIcon, RefreshCwIcon
} from 'lucide-vue-next';
import { formatFileSize, formatTimeRemaining } from '@fileduck/shared';
import { redeemShareCode, scanBeforeDownload } from '../services/api';
import { useNotifications } from '../composables/useNotifications';
import TurnstileWidget from '../components/TurnstileWidget.vue';

// Import animations
import VerifyCodeAnimation from '../../../../animations/Verify Code.json';
import DataDownloadingAnimation from '../../../../animations/Data Downloading.json';
import ShockedDuckAnimation from '../../../../animations/Shocked Duck.json';
import DownloadSuccessAnimation from '../../../../animations/download success.json';

const route = useRoute();
const { success, error } = useNotifications();
const inputCode = ref('');
const isRedeeming = ref(false);
const captchaRequired = ref(false);
const captchaToken = ref('');
const errorMessage = ref('');
const downloadUrl = ref('');
const downloadProgress = ref(0);
const scanBeforeStatus = ref<'idle' | 'scanning' | 'clean' | 'infected' | 'suspicious' | 'skipped' | 'error'>('idle');
const scanBeforeMessage = ref('');
const isPreDownloadScanning = ref(false);
const preDownloadScanStatus = ref<'idle' | 'clean' | 'infected' | 'suspicious' | 'error'>('idle');
const preDownloadScanMessage = ref('');
const fileInfo = ref({
  filename: '',
  size: 0,
  sha256: '',
  mimeType: '',
  usesLeft: 0,
  expiresAt: 0,
  isQuarantined: false,
  scanSkipped: false,
});

const turnstilesiteKey = computed(() => import.meta.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAACYFda-OmtIrzikn');

const scanBeforeClass = computed(() => {
  if (scanBeforeStatus.value === 'clean') return 'text-green-700';
  if (scanBeforeStatus.value === 'infected') return 'text-red-700';
  if (scanBeforeStatus.value === 'suspicious') return 'text-orange-700';
  if (scanBeforeStatus.value === 'error' || scanBeforeStatus.value === 'skipped') return 'text-yellow-700';
  return 'text-yellow-800';
});

onMounted(() => {
  // Check if share code is in URL
  if (route.params.code) {
    inputCode.value = route.params.code as string;
    redeemCode();
  }
});

const redeemCode = async () => {
  if (!inputCode.value) return;
  if (captchaRequired.value && !captchaToken.value) {
    errorMessage.value = 'Please complete the CAPTCHA verification';
    return;
  }

  isRedeeming.value = true;
  errorMessage.value = '';

  try {
    const response = await redeemShareCode({
      shareCode: inputCode.value,
      captchaToken: captchaToken.value || undefined,
    });

    // Clear captcha token after successful use to prevent reuse
    captchaToken.value = '';
    captchaRequired.value = false;

    downloadUrl.value = response.downloadUrl;
    fileInfo.value = {
      filename: response.filename,
      size: response.size,
      sha256: response.sha256,
      mimeType: response.mimeType,
      usesLeft: response.usesLeft,
      expiresAt: response.expiresAt,
      isQuarantined: response.isQuarantined || false,
      scanSkipped: response.scanSkipped || false,
    };
  } catch (err: any) {
    console.error('Redeem failed:', err);

    const errorCode = err.response?.data?.code;
    const errorMsg = err.response?.data?.error;

    if (errorCode === 'EXPIRED') {
      // File has expired (time limit reached)
      errorMessage.value = 'This share code has expired. The file is no longer available.';
      error('⏰ File Expired! The time limit for this file has been reached and it\'s no longer available for download.');
    } else if (errorCode === 'NO_USES_LEFT') {
      // Download limit reached (uses = 0)
      errorMessage.value = 'Download limit reached. This file has been downloaded the maximum number of times.';
      error('🚫 Download Limit Reached! This file has already been downloaded the maximum number of times and is no longer available.');
    } else if (errorCode === 'CAPTCHA_REQUIRED') {
      captchaRequired.value = true;
      // Don't show error message - just show the captcha widget
      errorMessage.value = '';
    } else if (errorCode === 'CAPTCHA_INVALID') {
      captchaToken.value = '';
      // Force widget reload without showing error during transition
      captchaRequired.value = false;
      setTimeout(() => {
        captchaRequired.value = true;
        errorMessage.value = 'CAPTCHA verification failed or expired. Please complete it again.';
      }, 100);
    } else if (errorCode === 'SCAN_PENDING') {
      errorMessage.value = 'File is being scanned for malware. Please try again in a moment.';
    } else if (errorCode === 'MALWARE_DETECTED') {
      errorMessage.value = 'This file was flagged as malicious and has been removed.';
    } else {
      errorMessage.value = errorMsg || 'Invalid or expired share code';
    }
  } finally {
    isRedeeming.value = false;
  }
};

const handleCaptchaVerified = (token: string) => {
  console.log('✅ Captcha verified, token length:', token?.length);
  captchaToken.value = token;
  errorMessage.value = ''; // Clear any error messages immediately
  captchaRequired.value = false; // Hide captcha widget to prevent duplicate badges
  // Auto-submit after captcha verification
  setTimeout(() => redeemCode(), 100);
};

const handleCaptchaError = (error: string) => {
  errorMessage.value = `Captcha error: ${error}`;
  captchaToken.value = '';
};

const runSafetyScan = async () => {
  if (!inputCode.value || scanBeforeStatus.value === 'scanning') return;

  scanBeforeStatus.value = 'scanning';
  scanBeforeMessage.value = 'Scanning...';

    try {
      const result: any = await scanBeforeDownload(inputCode.value);

      const decision = result?.decision || (result?.clean ? 'clean' : 'unknown');

    if (decision === 'clean') {
      scanBeforeStatus.value = 'clean';
      scanBeforeMessage.value = 'No threats found.';
    } else if (decision === 'infected') {
      scanBeforeStatus.value = 'infected';
      scanBeforeMessage.value = result?.clamav?.virus
        ? `Threat detected: ${result.clamav.virus}`
        : 'Threat detected.';
    } else if (decision === 'suspicious') {
      scanBeforeStatus.value = 'suspicious';
      scanBeforeMessage.value = 'Potential risk detected.';
    } else if (decision === 'skipped') {
      scanBeforeStatus.value = 'skipped';
      scanBeforeMessage.value = 'Scan unavailable right now.';
    } else {
      scanBeforeStatus.value = 'error';
      scanBeforeMessage.value = 'Scan failed. You can still download.';
    }
  } catch (err) {
    console.error('Safety scan failed:', err);
    scanBeforeStatus.value = 'error';
    scanBeforeMessage.value = 'Scan failed. You can still download.';
  }
};

const downloadSuccess = ref(false);

const runPreDownloadScan = async () => {
  if (!inputCode.value || isPreDownloadScanning.value) return;

  try {
    isPreDownloadScanning.value = true;
    preDownloadScanStatus.value = 'idle';
    preDownloadScanMessage.value = 'Running security scan...';

    const result = await scanBeforeDownload(inputCode.value);

    if (result.decision === 'infected') {
      preDownloadScanStatus.value = 'infected';
      preDownloadScanMessage.value = 'Scan result: Threat detected. Avoid downloading unless you trust the sender.';
    } else if (result.decision === 'suspicious') {
      preDownloadScanStatus.value = 'suspicious';
      preDownloadScanMessage.value = 'Scan result: Suspicious signals found. Download with caution.';
    } else if (result.decision === 'clean') {
      preDownloadScanStatus.value = 'clean';
      preDownloadScanMessage.value = 'Scan result: No threats detected.';
    } else {
      preDownloadScanStatus.value = 'error';
      preDownloadScanMessage.value = 'Scan result: Unable to determine. Please try again later.';
    }
  } catch (err) {
    console.error('Pre-download scan failed:', err);
    preDownloadScanStatus.value = 'error';
    preDownloadScanMessage.value = 'Scan failed. Please try again later.';
  } finally {
    isPreDownloadScanning.value = false;
  }
};

const initiateDownload = async () => {
  if (!downloadUrl.value) return;

  try {
    downloadProgress.value = 0;
    success('📥 Download started! Please wait...');

    // Always use direct download URL (no proxy)
    // GitHub/S3/CDN URLs are already configured with CORS
    const fetchUrl = downloadUrl.value;

    console.log(`📥 Fetching from: ${fetchUrl}`);

    // For very large files, let the browser handle the download directly to avoid high memory usage
    const LARGE_FILE_THRESHOLD = +(import.meta.env.VITE_LARGE_FILE_THRESHOLD || 25 * 1024 * 1024); // default 25 MB
    if (fileInfo.value.size && fileInfo.value.size >= LARGE_FILE_THRESHOLD) {
      const isGitHubAsset = fetchUrl.includes('github.com') && fetchUrl.includes('/releases/download/');
      const apiBase = import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).replace(/\/+$/,'') : '';
      // Normalize proxy path to avoid duplicating '/api' when VITE_API_URL already contains it
      const proxyPath = apiBase ? `${apiBase}/proxy-download` : '/api/proxy-download';
      const downloadOpenUrl = isGitHubAsset ? `${proxyPath}?assetUrl=${encodeURIComponent(fetchUrl)}` : fetchUrl;

      // Open in new tab so the browser manages the download (supports resume via Range headers)
      window.open(downloadOpenUrl, '_blank');
      success('Opening large download in a new tab for browser-managed download.');
      return;
    }

    // Fetch with progress tracking (suitable for small/medium files)
    const isGitHubAsset = fetchUrl.includes('github.com') && fetchUrl.includes('/releases/download/');
    const apiBase = import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).replace(/\/+$/,'') : '';
    // Normalize proxy path: if VITE_API_URL is '/api' (relative), don't add another '/api' prefix
    const proxyPath = apiBase ? `${apiBase}/proxy-download` : '/api/proxy-download';
    const proxyUrl = `${proxyPath}?assetUrl=${encodeURIComponent(fetchUrl)}`;

    let response;
    try {
      response = await fetch(fetchUrl);
    } catch (err) {
      console.warn('Direct fetch failed with network error, attempting proxy fallback for GitHub assets', err);
      if (isGitHubAsset) {
        try {
          response = await fetch(proxyUrl);
        } catch (proxyErr) {
          console.error('Proxy fetch failed as fallback:', proxyErr);
          throw new Error('Download failed: network error and proxy fallback failed');
        }
      } else {
        throw err;
      }
    }

    // If we have a response but it's not OK, try proxy for GitHub-hosted assets
    if (!response || !response.ok) {
      if (isGitHubAsset) {
        try {
          console.warn('Direct fetch returned non-OK response, trying proxy');
          response = await fetch(proxyUrl);
        } catch (proxyErr) {
          const errorText = response ? await response.text().catch(() => '') : '';
          console.error('Download failed:', response?.status, errorText, 'Proxy error:', proxyErr);
          // Include proxyErr message if available
          throw new Error((proxyErr as any)?.message || 'Download failed: network error or proxy failed.');
        }
      }

      if (!response || !response.ok) {
        // Try to parse JSON error from proxy for friendly messaging
        const text = await response.text().catch(() => '');
        let parsedMsg = '';
        try {
          const json = JSON.parse(text || '{}') as any;
          parsedMsg = json.message || json.error || json.details || '';
        } catch {}

        const errorMessage = parsedMsg || `Download failed: ${response?.status || 'network error'}`;
        console.error('Download failed:', response?.status, text || parsedMsg);
        throw new Error(errorMessage);
      }
    }

    const reader = response.body?.getReader();
    const contentLength = +(response.headers.get('Content-Length') || fileInfo.value.size);

    let receivedLength = 0;
    const chunks = [];

    console.log(`📥 Downloading file: ${fileInfo.value.filename} (${contentLength} bytes)`);

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;
        const progress = Math.min(Math.round((receivedLength / contentLength) * 100), 99);
        downloadProgress.value = progress;
        
        console.log(`📊 Download progress: ${progress}% (${receivedLength}/${contentLength} bytes)`);
      }
    }
    
    console.log('✅ Download complete, creating file...');

    // Create blob and download
    const blob = new Blob(chunks);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileInfo.value.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    downloadProgress.value = 100;
    downloadSuccess.value = true;
    success('✅ Download completed successfully!');
    console.log(`✅ File saved: ${fileInfo.value.filename}`);

    // Record download activity to local history
    try {
      const { addToDownloadHistory } = await import('../services/uploadHistory');
      await addToDownloadHistory({
        id: `download-${inputCode.value}-${Date.now()}`,
        shareCode: inputCode.value,
        filename: fileInfo.value.filename,
        size: fileInfo.value.size,
        uploadedAt: Date.now(),
        expiresAt: fileInfo.value.expiresAt,
        verificationCode: '',
        maxUses: 0,
        usesLeft: fileInfo.value.usesLeft,
        downloadUrl: downloadUrl.value,
      });
      console.log('✅ Download activity recorded');
    } catch (err) {
      console.error('Failed to record download activity:', err);
    }

    // Confirm download on backend (decrements uses and auto-deletes if needed)
    try {
      const confirmResponse = await fetch(`${import.meta.env.VITE_API_URL}/confirm-download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareCode: inputCode.value }),
      });
      const confirmData = await confirmResponse.json();
      console.log('✅ Download confirmed:', confirmData);

      // Update history uses count after confirmation
      import('../services/uploadHistory').then(({ updateUploadHistory }) => {
        updateUploadHistory(inputCode.value, {
          usesLeft: confirmData.usesLeft || 0,
        });
      });

      // Update local uses count
      fileInfo.value.usesLeft = confirmData.usesLeft || 0;
    } catch (err) {
      console.error('Failed to confirm download:', err);
      // Still show success since file was downloaded
    }
    
    // Keep success animation visible for 5 seconds
    setTimeout(() => {
      downloadSuccess.value = false;
      // Keep progress at 100% for a bit longer before resetting
      setTimeout(() => {
        downloadProgress.value = 0;
      }, 2000);
    }, 5000);
  } catch (err) {
    console.error('Download failed:', err);
    error((err as any)?.message || 'Download failed. Please try again.');
    downloadProgress.value = 0;
    downloadSuccess.value = false;
  }
};

const resetForm = () => {
  inputCode.value = '';
  downloadUrl.value = '';
  errorMessage.value = '';
  captchaRequired.value = false;
  captchaToken.value = '';
  downloadProgress.value = 0;
  scanBeforeStatus.value = 'idle';
  scanBeforeMessage.value = '';
};

const copyChecksum = () => {
  navigator.clipboard.writeText(fileInfo.value.sha256);
  success('✓ Checksum copied to clipboard!');
};

const formatSize = formatFileSize;
const formatExpiry = formatTimeRemaining;
</script>
