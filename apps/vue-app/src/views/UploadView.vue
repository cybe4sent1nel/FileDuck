<template>
  <div class="max-w-5xl mx-auto px-2 sm:px-4">
    <!-- Hero Section -->
    <div class="text-center mb-8 sm:mb-12 max-w-4xl mx-auto -mt-4">
      <!-- Designer Cat Animation -->
      <div class="flex justify-center mb-4">
        <Vue3Lottie
          :animationData="DesignerCatAnimation"
          :height="200"
          :width="200"
          class="sm:!h-[250px] sm:!w-[250px] md:!h-[280px] md:!w-[280px]"
          :loop="true"
        />
      </div>
      
      <div class="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 mb-4 px-2">
        <img src="/logo.png" alt="FileDuck Logo" class="h-24 sm:h-32 md:h-40 w-24 sm:w-32 md:w-40 object-contain" />
        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-indigo-950 leading-tight text-center md:text-left">
          Share Files Securely
        </h1>
      </div>

      <!-- Scanning Animation Component -->
      <div class="-mt-4 mb-3">
        <ScanningAnimation />
      </div>
      
      <p class="text-xl text-gray-600 mb-3 max-w-2xl mx-auto leading-relaxed">
        Upload, scan, and share files with enterprise-grade security. Protected by AI-powered malware detection and end-to-end encryption.
      </p>
      <div class="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-4 mb-6 max-w-2xl mx-auto">
        <p class="text-sm text-gray-700 flex items-center justify-center">
          <LockIcon class="w-5 h-5 mr-2 text-green-600" />
          <strong class="text-green-700 mr-1">End-to-End Encrypted:</strong>
          Your data is encrypted during transfer. Only sender and receiver can access the content.
        </p>
      </div>
      <div class="flex flex-wrap justify-center gap-4 mb-8">
        <div class="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
          <img src="/malware scanned.png" alt="Malware Protected" class="h-10 object-contain" />
        </div>
        <div class="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
          <img src="/cdn.png" alt="Global CDN" class="h-10 object-contain" />
        </div>
        <div class="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
          <img src="/privacy.png" alt="Privacy Protected" class="h-10 object-contain" />
        </div>
      </div>

      <!-- Product Hunt Badge -->
      <div class="flex justify-center mb-8">
        <a
          href="https://www.producthunt.com/products/fileduck?launch=fileduck"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <img src="/product hint.png" alt="#1 Product of the Day on Product Hunt" class="h-16 md:h-20 object-contain" />
        </a>
      </div>
    </div>

    <!-- Live Activity Tracker -->
    <div class="max-w-4xl mx-auto mb-12">
      <LiveActivityTracker />
    </div>

    <!-- Main Upload Card -->
    <div id="upload" class="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-10 border border-purple-100 max-w-3xl mx-auto mb-12 sm:mb-20 scroll-mt-20">

      <div v-if="!uploadComplete" class="space-y-6">
        <!-- File Selection with Animation -->
        <div
          @click="triggerFileInput"
          @drop.prevent="handleDrop"
          @dragover.prevent
          @dragenter="isDragging = true"
          @dragleave="isDragging = false"
          :class="[
            'border-2 sm:border-3 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center cursor-pointer transition-all duration-300',
            isDragging
              ? 'border-purple-400 bg-purple-50'
              : 'border-purple-200 hover:border-purple-300 hover:bg-purple-50/30',
          ]"
        >
          <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            class="hidden"
            id="file-input"
            accept="*/*"
          />
          <div class="cursor-pointer">
            <div v-if="!selectedFile" class="flex flex-col items-center">
              <Vue3Lottie
                :animationData="UploadFilesAnimation"
                :height="120"
                :width="120"
                class="sm:!h-[140px] sm:!w-[140px] md:!h-[160px] md:!w-[160px]"
                :loop="true"
              />
              <p class="text-xl sm:text-2xl font-bold text-gray-800 mt-4 sm:mt-6 px-2">
                Drop your file here
              </p>
              <p class="text-sm sm:text-base text-gray-500 mt-2">or click to browse</p>
              <p class="text-xs sm:text-sm text-gray-400 mt-3 sm:mt-4 flex items-center justify-center">
                <HardDriveIcon class="w-4 h-4 mr-2" />
                Maximum file size: 500GB • Pause/Resume supported
              </p>
            </div>
            <div v-else class="relative flex items-center justify-between bg-purple-50 rounded-xl p-6 border border-purple-200">
              <div class="flex items-center space-x-4">
                <FileIcon class="w-12 h-12 text-purple-400" />
                <div class="text-left">
                  <p class="text-xl font-bold text-gray-800">{{ selectedFile.name }}</p>
                  <p class="text-base text-gray-600 flex items-center mt-1">
                    <HardDriveIcon class="w-4 h-4 mr-1" />
                    {{ formatSize(selectedFile.size) }}
                  </p>
                </div>
              </div>
              <button 
                @click.stop="removeFile" 
                class="absolute top-4 right-4 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-110"
                title="Remove file"
              >
                <XIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Scanning in Progress -->
        <div v-if="isScanning" class="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <Vue3Lottie
                :animationData="ScanningDocumentAnimation"
                :height="80"
                :width="80"
                :loop="true"
              />
            </div>
            <div class="flex-1">
              <p class="text-lg font-bold text-blue-800 mb-1">🔍 Scanning for malware...</p>
              <p class="text-sm text-blue-600">Please wait while we verify your file is safe.</p>
            </div>
          </div>
        </div>

        <!-- File Clean Message (Only after scan is clean) -->
        <div v-else-if="scanStatus === 'clean' && !uploadComplete" class="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <ShieldCheckIcon class="w-12 h-12 text-green-600" />
            </div>
            <div class="flex-1">
              <p class="text-lg font-bold text-green-800">✓ File is virus free</p>
              <p class="text-sm text-green-600">No viruses found. Uploading...</p>
            </div>
          </div>
        </div>

        <!-- Malicious File Warning (Only after scan detects threat) -->
        <div v-else-if="scanStatus === 'malicious' && !virusDetails.includes('Scan error')" class="bg-red-50 border-2 border-red-300 rounded-xl p-6">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <Vue3Lottie
                :animationData="COVID19Animation"
                :height="100"
                :width="100"
                :loop="true"
              />
            </div>
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <AlertTriangleIcon class="w-7 h-7 text-red-600" />
                <p class="text-xl font-bold text-red-800">⚠️ Malicious File Detected!</p>
              </div>
              <p class="text-red-700 font-medium mb-2">
                {{ virusDetails || 'This file contains potentially harmful content and cannot be uploaded.' }}
              </p>
              <p class="text-sm text-red-600">
                Please select a different file to upload.
              </p>
            </div>
          </div>
        </div>

        <!-- Scan Error Warning (When scanning fails) -->
        <div v-else-if="scanStatus === 'malicious' && virusDetails.includes('Scan error')" class="bg-orange-50 border-2 border-orange-300 rounded-xl p-6">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <Vue3Lottie
                :animationData="StressedWomanAnimation"
                :height="100"
                :width="100"
                :loop="true"
              />
            </div>
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <AlertTriangleIcon class="w-7 h-7 text-orange-600" />
                <p class="text-xl font-bold text-orange-800">😰 Scanning Error</p>
              </div>
              <p class="text-orange-700 font-medium mb-2">
                {{ virusDetails }}
              </p>
              <p class="text-sm text-orange-600">
                Please try again or contact support if the issue persists.
              </p>
            </div>
          </div>
        </div>

        <!-- Scan Skipped Warning (Large files or scanner unavailable) -->
        <div v-else-if="scanStatus === 'skipped'" class="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <AlertTriangleIcon class="w-16 h-16 text-yellow-600" />
            </div>
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <AlertTriangleIcon class="w-7 h-7 text-yellow-600" />
                <p class="text-xl font-bold text-yellow-800">
                  ⚠️
                  <span v-if="scanSkipReason === 'too_large'">File Too Large for Scanning</span>
                  <span v-else-if="scanSkipReason === 'scanner_unavailable'">Scanner Temporarily Unavailable</span>
                  <span v-else-if="selectedFile && selectedFile.size > 50 * 1024 * 1024">Large File - Scanning Disabled by Default</span>
                  <span v-else>Scanning Disabled</span>
                </p>
              </div>
              <p class="text-yellow-700 font-medium mb-2">
                <span v-if="scanSkipReason === 'too_large'">
                  This file is larger than 100MB and cannot be scanned with our malware scanner.
                </span>
                <span v-else-if="scanSkipReason === 'scanner_unavailable'">
                  Our large-file scanner is currently unavailable.
                </span>
                <span v-else-if="selectedFile && selectedFile.size > 50 * 1024 * 1024">
                  Large files (&gt;50MB) have scanning disabled by default to reduce delays.
                </span>
                <span v-else>
                  You have disabled malware scanning for this file.
                </span>
              </p>
              <p class="text-sm text-yellow-600 mb-3">
                The file will be uploaded <strong>without malware scanning</strong>. Recipients will be warned that this file was not scanned.
              </p>
              <p class="text-xs text-yellow-600" v-if="selectedFile && selectedFile.size > 50 * 1024 * 1024">
                💡 <strong>Tip:</strong> Enable scanning toggle above to scan files before upload. Large files may take longer to scan.
              </p>
              <p class="text-xs text-yellow-600" v-else>
                💡 <strong>Tip:</strong> Enable the scanning toggle above to scan this file for malware before upload.
              </p>
            </div>
          </div>
        </div>

        <!-- SHA256 Hash for Verification -->
        <div v-if="selectedFile && sha256Hash" class="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
          <p class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <ShieldCheckIcon class="w-4 h-4 mr-2 text-blue-600" />
            File Verification Hash (SHA-256)
          </p>
          <p class="text-xs text-gray-600 mb-3">
            This unique code verifies your file hasn't been tampered with during transfer
          </p>
          <div class="flex items-center justify-between bg-white rounded-lg p-3 border border-blue-100">
            <p class="font-mono text-xs text-blue-600 break-all flex-1">
              {{ sha256Hash }}
            </p>
            <button @click="copyHash" class="ml-3 text-blue-500 hover:text-blue-600 hover:scale-110 transition-transform flex-shrink-0">
              <CopyIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Upload Options -->
        <div v-if="selectedFile" class="space-y-5 bg-white rounded-xl p-6 border border-purple-100">
          <div>
            <label class="flex items-center text-base font-semibold text-gray-700 mb-3">
              <ClockIcon class="w-5 h-5 mr-2 text-purple-400" />
              Time to Live
            </label>
            <select v-model="ttlHours" class="input-field text-base w-full p-3 border border-gray-200 rounded-lg focus:border-purple-300 focus:ring-2 focus:ring-purple-100 bg-white font-sans font-medium text-gray-800 cursor-pointer hover:border-purple-400 transition-colors">
              <option :value="1" class="font-sans font-medium text-gray-800 py-2">1 hour</option>
              <option :value="6" class="font-sans font-medium text-gray-800 py-2">6 hours</option>
              <option :value="24" class="font-sans font-medium text-gray-800 py-2">24 hours (default)</option>
              <option :value="72" class="font-sans font-medium text-gray-800 py-2">3 days</option>
              <option :value="168" class="font-sans font-medium text-gray-800 py-2">7 days</option>
            </select>
          </div>

          <div>
            <label class="flex items-center text-base font-semibold text-gray-700 mb-3">
              <DownloadIcon class="w-5 h-5 mr-2 text-lemon-500" />
              Maximum Downloads
            </label>
            <select v-model="maxUses" class="input-field text-base w-full p-3 border border-gray-200 rounded-lg focus:border-purple-300 focus:ring-2 focus:ring-purple-100 bg-white font-sans font-medium text-gray-800 cursor-pointer hover:border-purple-400 transition-colors">
              <option :value="1" class="font-sans font-medium text-gray-800 py-2">One-time (default)</option>
              <option :value="3" class="font-sans font-medium text-gray-800 py-2">3 downloads</option>
              <option :value="5" class="font-sans font-medium text-gray-800 py-2">5 downloads</option>
              <option :value="10" class="font-sans font-medium text-gray-800 py-2">10 downloads</option>
              <option :value="999" class="font-sans font-medium text-gray-800 py-2">Unlimited</option>
            </select>
          </div>

          <div class="flex items-center space-x-3 bg-purple-50 rounded-lg p-4 border border-purple-100">
            <label class="neon-checkbox">
              <input type="checkbox" v-model="enableEncryption" id="encryption" />
              <div class="neon-checkbox__frame">
                <div class="neon-checkbox__box">
                  <div class="neon-checkbox__check-container">
                    <svg viewBox="0 0 24 24" class="neon-checkbox__check">
                      <path d="M3,12.5l7,7L21,5"></path>
                    </svg>
                  </div>
                  <div class="neon-checkbox__glow"></div>
                  <div class="neon-checkbox__borders">
                    <span></span><span></span><span></span><span></span>
                  </div>
                </div>
                <div class="neon-checkbox__effects">
                  <div class="neon-checkbox__particles">
                    <span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span>
                  </div>
                  <div class="neon-checkbox__rings">
                    <div class="ring"></div>
                    <div class="ring"></div>
                    <div class="ring"></div>
                  </div>
                  <div class="neon-checkbox__sparks">
                    <span></span><span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </label>
            <label for="encryption" class="flex items-center text-base font-medium text-gray-700 cursor-pointer">
              <LockIcon class="w-5 h-5 mr-2 text-purple-400" />
              Enable client-side encryption (zero-knowledge)
            </label>
          </div>

          <!-- Captcha Toggle -->
          <CaptchaToggle v-model="requireCaptcha" :isAutoEnabled="isCaptchaAutoEnabled" />

          <!-- Scan Toggle -->
          <ScanToggle v-model="enableScan" />
        </div>

        <!-- Upload Progress with Animation -->
        <div v-if="isUploading || isPaused" class="space-y-5 bg-white rounded-xl p-8 border border-purple-100">
          <div class="flex justify-center">
            <Vue3Lottie
              ref="uploadLottieRef"
              :animationData="FileStorageAnimation"
              :height="140"
              :width="140"
              :loop="true"
              :autoplay="!isPaused"
              :paused="isPaused"
            />
          </div>
          <div class="space-y-3">
            <div class="flex justify-between text-base font-semibold text-gray-700">
              <span class="flex items-center">
                <UploadIcon class="w-5 h-5 mr-2 text-purple-400" />
                {{ isPaused ? 'Upload Paused' : 'Uploading...' }}
              </span>
              <span class="font-bold text-xl text-purple-500">{{ uploadProgress }}%</span>
            </div>
            <div class="w-full h-5 rail-track relative p-[2px]">
              <div
                class="h-full plasma-fill rounded-sm"
                :class="{ 'progress-bar-animated': !isPaused, 'progress-bar-paused': isPaused }"
                :style="{ width: uploadProgress + '%' }"
              >
                <div v-if="uploadProgress > 0 && !isPaused" class="fusion-head"></div>
              </div>
            </div>
            <!-- Upload Stats -->
            <div class="flex justify-between text-sm text-gray-600">
              <span>{{ uploadSpeed }}</span>
              <span>{{ timeRemaining }}</span>
            </div>
            <!-- Pause/Resume Button -->
            <div class="flex flex-col items-center gap-2 mt-4">
              <div class="flex gap-3">
                <button
                  v-if="!isPaused"
                  @click="pauseUpload"
                  class="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <PauseIcon class="w-5 h-5" />
                  <span>Pause</span>
                </button>
                <button
                  v-else
                  @click="resumeUpload"
                  class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <PlayIcon class="w-5 h-5" />
                  <span>Resume</span>
                </button>
              </div>
              <p v-if="isPaused" class="text-xs text-gray-500 text-center">
                ✓ Progress saved - Resume will continue from where you left off
              </p>
            </div>
          </div>
        </div>

        <!-- Upload Button -->
        <button
          @click="uploadFile"
          :disabled="!selectedFile || isUploading || isScanning || scanStatus === 'malicious'"
          class="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
        >
          <RocketIcon v-if="!isUploading && !isScanning" class="w-6 h-6 mr-2" />
          <LoaderIcon v-else class="w-6 h-6 mr-2 animate-spin" />
          {{ isScanning ? 'Scanning...' : (isUploading ? 'Uploading...' : (scanStatus === 'clean' ? 'Upload File' : (scanStatus === 'skipped' ? 'Upload File (Unscanned)' : 'Scan & Upload File'))) }}
        </button>
      </div>

      <!-- Success View -->
      <div v-else class="space-y-6">
        <div class="text-center py-8">
          <Vue3Lottie
            :animationData="UploadSuccessAnimation"
            :height="180"
            :width="180"
            :loop="true"
          />
          <h2 class="text-3xl font-bold text-gray-800 mb-2 mt-4">
            File Uploaded Successfully!
          </h2>
          <p class="text-gray-500">Share your code to let others download</p>
        </div>

        <div class="bg-purple-50 border-2 border-purple-200 rounded-xl p-8">
          <p class="text-base font-semibold text-gray-700 mb-3 flex items-center">
            <KeyIcon class="w-5 h-5 mr-2 text-purple-400" />
            Share Code
          </p>
          <div class="flex items-center justify-between bg-white rounded-lg p-5 border border-purple-100">
            <p class="font-mono text-3xl font-bold text-purple-500">
              {{ shareCode }}
            </p>
            <button @click="copyShareCode" class="text-purple-400 hover:text-purple-500 hover:scale-110 transition-transform">
              <CopyIcon class="w-8 h-8" />
            </button>
          </div>
        </div>

        <div class="bg-lemon-50 border-2 border-lemon-200 rounded-xl p-6 space-y-3 text-base">
          <p class="flex items-center">
            <FileIcon class="w-5 h-5 mr-3 text-gray-600" />
            <strong class="text-gray-800">Filename:</strong>&nbsp;<span class="text-gray-600">{{ selectedFile?.name }}</span>
          </p>
          <p class="flex items-center">
            <HardDriveIcon class="w-5 h-5 mr-3 text-gray-600" />
            <strong class="text-gray-800">Size:</strong>&nbsp;<span class="text-gray-600">{{ formatSize(selectedFile?.size || 0) }}</span>
          </p>
          <p class="flex items-center">
            <ClockIcon class="w-5 h-5 mr-3 text-gray-600" />
            <strong class="text-gray-800">Expires:</strong>&nbsp;<span class="text-gray-600">{{ formatExpiry(expiresAt) }}</span>
          </p>
          <p class="flex items-center">
            <DownloadIcon class="w-5 h-5 mr-3 text-gray-600" />
            <strong class="text-gray-800">Downloads left:</strong>&nbsp;<span class="text-gray-600">{{ maxUses === 999 ? 'Unlimited' : maxUses }}</span>
          </p>
        </div>

        <!-- SHA256 Hash Verification -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
          <p class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <ShieldCheckIcon class="w-4 h-4 mr-2 text-blue-600" />
            File Verification Hash (SHA-256)
          </p>
          <p class="text-xs text-gray-600 mb-3">
            Share this hash with recipients to verify file integrity. They can compare it after download to ensure the file hasn't been modified.
          </p>
          <div class="flex items-center justify-between bg-white rounded-lg p-3 border border-blue-100">
            <p class="font-mono text-xs text-blue-600 break-all flex-1">
              {{ sha256Hash }}
            </p>
            <button @click="copyHash" class="ml-3 text-blue-500 hover:text-blue-600 hover:scale-110 transition-transform flex-shrink-0">
              <CopyIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Scanning Status -->
        <div v-if="isScanning" class="bg-white border-2 border-purple-200 rounded-xl p-6">
          <div class="flex items-center">
            <Vue3Lottie
              :animationData="ScanningDocumentAnimation"
              :height="60"
              :width="60"
              :loop="true"
              class="mr-4"
            />
            <p class="text-base text-gray-700">
              <strong class="text-lg text-gray-800">Scanning for viruses and malware...</strong><br/>
              <span class="text-gray-500">Please wait while we verify your file is safe.</span>
            </p>
          </div>
        </div>

        <!-- Malware Detected Warning -->
        <div v-else-if="scanStatus === 'malicious'" class="bg-red-50 border-3 border-red-300 rounded-xl p-6">
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
                MALICIOUS FILE DETECTED!
              </p>
              <p class="text-base text-red-800 mb-4 bg-white/50 p-3 rounded">
                {{ virusDetails }}
              </p>
              <p class="text-sm text-red-700 mb-4">
                <strong>File has been quarantined.</strong> This file will not be available for public download. Only users you explicitly share the code with will be warned before download.
              </p>
              <div class="flex items-center space-x-3 bg-white/70 rounded-lg p-3">
                <input
                  type="checkbox"
                  v-model="allowQuarantine"
                  id="acknowledge-risk"
                  class="w-5 h-5 text-red-600"
                />
                <label for="acknowledge-risk" class="text-sm text-red-900 font-semibold">
                  I understand the risks and want to keep this file in quarantine for controlled sharing
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Clean Scan Result -->
        <div v-else-if="scanStatus === 'clean'" class="bg-green-50 border-2 border-green-200 rounded-xl p-5">
          <p class="text-base text-gray-700 flex items-center">
            <ShieldCheckIcon class="w-6 h-6 mr-3 text-green-600" />
            <strong class="text-base text-gray-800">Scan complete:</strong>&nbsp;<span class="text-green-600">No threats detected. File is safe to share.</span>
          </p>
        </div>

        <button @click="resetForm" class="btn-secondary w-full flex items-center justify-center text-lg py-4">
          <RefreshCwIcon class="w-6 h-6 mr-2" />
          Upload Another File
        </button>
      </div>
    </div>

    <!-- How It Works Section -->
    <HowItWorks />

    <!-- Testimonials Section -->
    <Testimonials />

    <!-- About Section -->
    <AboutSection />

    <!-- Trusted By Section -->
    <TrustedBy />

    <!-- CTA Section -->
    <CTASection />

    <!-- Info Boxes -->
    <div class="grid md:grid-cols-3 gap-6 mt-16 mb-12 max-w-6xl mx-auto">
      <!-- Malware Scanned Badge -->
      <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-purple-100 aspect-square flex flex-col">
        <div class="flex-1 flex flex-col items-center justify-center text-center">
          <div class="mb-4 w-full flex justify-center">
            <img src="/malware scanned.png" alt="AI-Powered Malware Scanning" class="w-32 h-32 object-contain" />
          </div>
          <h3 class="font-bold text-lg text-gray-900 mb-2">AI-Powered Protection</h3>
          <p class="text-sm text-gray-600 leading-relaxed">
            Every file is scanned using advanced threat detection for complete safety.
          </p>
        </div>
      </div>

      <!-- Global CDN Badge -->
      <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-yellow-100 aspect-square flex flex-col">
        <div class="flex-1 flex flex-col items-center justify-center text-center">
          <div class="mb-4 w-full flex justify-center">
            <img src="/cdn.png" alt="Global CDN Network" class="w-32 h-32 object-contain" />
          </div>
          <h3 class="font-bold text-lg text-gray-900 mb-2">Lightning-Fast Delivery</h3>
          <p class="text-sm text-gray-600 leading-relaxed">
            Powered by global CDN with servers worldwide for blazing-fast downloads.
          </p>
        </div>
      </div>

      <!-- Privacy Badge -->
      <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-purple-100 aspect-square flex flex-col">
        <div class="flex-1 flex flex-col items-center justify-center text-center">
          <div class="mb-4 w-full flex justify-center">
            <img src="/privacy.png" alt="Privacy-First Architecture" class="w-32 h-32 object-contain" />
          </div>
          <h3 class="font-bold text-lg text-gray-900 mb-2">Privacy-First Design</h3>
          <p class="text-sm text-gray-600 leading-relaxed">
            Zero-knowledge encryption and time-limited links keep your files completely private.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Vue3Lottie } from 'vue3-lottie';
import HowItWorks from '../components/HowItWorks.vue';
import Testimonials from '../components/Testimonials.vue';
import AboutSection from '../components/AboutSection.vue';
import LiveActivityTracker from '../components/LiveActivityTracker.vue';
import ScanningAnimation from '../components/ScanningAnimation.vue';
import CaptchaToggle from '../components/CaptchaToggle.vue';
import ScanToggle from '../components/ScanToggle.vue';
import { useNotifications } from '../composables/useNotifications';
import TrustedBy from '../components/TrustedBy.vue';
import CTASection from '../components/CTASection.vue';
import {
  FileIcon, ShieldCheckIcon, CopyIcon, ClockIcon, DownloadIcon,
  LockIcon, UploadIcon, RocketIcon, LoaderIcon, KeyIcon,
  HardDriveIcon, RefreshCwIcon, GlobeIcon, EyeOffIcon, AlertTriangleIcon, ZapIcon, XIcon,
  PauseIcon, PlayIcon
} from 'lucide-vue-next';
import { computeSHA256, formatFileSize, formatTimeRemaining } from '@fileduck/shared';
import { uploadFileMeta, uploadToS3, scanFileBeforeUpload } from '../services/api';
import { addToUploadHistory, requestPersistentStorage } from '../services/uploadHistory';
import {
  saveResumableUploadState,
  getResumableUploadState,
  deleteResumableUploadState,
  markChunkUploaded,
  isChunkUploaded,
  setUploadPaused,
  type ResumableUploadState
} from '../services/resumableUpload';

const { success, error } = useNotifications();

// Import animations
import FileStorageAnimation from '../../../../animations/File storage.json';
import UploadFilesAnimation from '../../../../animations/Upload Files.json';
import UploadSuccessAnimation from '../../../../animations/upload success.json';
import ScanningDocumentAnimation from '../../../../animations/Scanning document.json';
import COVID19Animation from '../../../../animations/COVID19.json';
import DesignerCatAnimation from '../../../../animations/Designer cat.json';
import StressedWomanAnimation from '../../../../animations/Stressed Woman at work.json';

const fileInput = ref<HTMLInputElement | null>(null);
const uploadLottieRef = ref<any>(null);
const selectedFile = ref<File | null>(null);
const sha256Hash = ref('');
const verificationCode = ref('');
const isDragging = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);
const uploadComplete = ref(false);
const shareCode = ref('');
const expiresAt = ref(0);
const ttlHours = ref(24);
const maxUses = ref(1);
const enableEncryption = ref(false);
const isScanning = ref(false);
const scanStatus = ref<'pending' | 'clean' | 'malicious' | 'skipped' | null>(null);
const virusDetails = ref('');
const scanSkipReason = ref<'too_large' | 'user_disabled' | 'scanner_unavailable' | ''>('');
const allowQuarantine = ref(false);
const requireCaptcha = ref(false);
const enableScan = ref(true); // Scanning ON by default for small files
const isCaptchaAutoEnabled = ref(false); // Track if captcha was auto-enabled

// Pause/Resume state
const isPaused = ref(false);
const uploadSpeed = ref('0 MB/s');
const timeRemaining = ref('');
let uploadAbortController: AbortController | null = null;
let lastProgressTime = Date.now();
let lastProgressBytes = 0;

// Watch file size changes to auto-enable/disable scanning and captcha
watch(selectedFile, (file) => {
  if (file) {
    // Auto-enable scanning for files ≤50MB
    // For files >50MB, user must manually enable
    if (file.size <= 50 * 1024 * 1024) {
      enableScan.value = true;
    } else {
      enableScan.value = false;
    }

    // Auto-enable CAPTCHA for files >50MB (for bot protection)
    // User can still disable it if they want
    if (file.size > 50 * 1024 * 1024) {
      requireCaptcha.value = true;
      isCaptchaAutoEnabled.value = true;
    } else {
      // Don't auto-disable if user manually enabled it for small files
      if (isCaptchaAutoEnabled.value) {
        requireCaptcha.value = false;
        isCaptchaAutoEnabled.value = false;
      }
    }
  }
});

// Watch enableScan toggle - trigger scan when manually enabled for large files
watch(enableScan, async (newValue, oldValue) => {
  // Only trigger scan if:
  // 1. Toggle changed from false to true (user manually enabled)
  // 2. File is selected
  // 3. File hasn't been scanned yet or was previously skipped
  if (newValue && !oldValue && selectedFile.value && sha256Hash.value) {
    if (scanStatus.value === 'skipped' || scanStatus.value === null) {
      await performScan();
    }
  }
});

// Watch requireCaptcha toggle - clear auto-enabled flag when user manually changes it
watch(requireCaptcha, (newValue, oldValue) => {
  // If user manually disables an auto-enabled captcha, clear the auto-enabled flag
  if (!newValue && isCaptchaAutoEnabled.value) {
    isCaptchaAutoEnabled.value = false;
  }
});

const triggerFileInput = (event: MouseEvent) => {
  // Don't trigger if clicking on the remove button
  const target = event.target as HTMLElement;
  if (target.closest('button')) {
    return;
  }
  fileInput.value?.click();
};

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    await processFile(target.files[0]);
  }
};

const handleDrop = async (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    await processFile(event.dataTransfer.files[0]);
  }
};

// Perform malware scan on the currently selected file
const performScan = async () => {
  if (!selectedFile.value || !sha256Hash.value) return;

  // Reset scan state
  scanStatus.value = 'pending';
  virusDetails.value = '';
  scanSkipReason.value = '';
  isScanning.value = true;

  try {
    // Call actual scan API and ensure minimum scanning duration for UX
    const [scanResult] = await Promise.all([
      scanFileBeforeUpload(selectedFile.value, sha256Hash.value),
      new Promise(resolve => setTimeout(resolve, 2000)) // Minimum 2s scanning animation
    ]);

    if (scanResult.decision === 'infected' || scanResult.decision === 'suspicious') {
      scanStatus.value = 'malicious';

      // Build detailed virus information
      const virusName = scanResult.clamav?.virus || 'Unknown threat';
      const vtInfo = scanResult.virustotal
        ? ` (${scanResult.virustotal.positives}/${scanResult.virustotal.total} engines detected threats)`
        : '';

      virusDetails.value = scanResult.clamav?.infected
        ? `Virus Detected: ${virusName}${vtInfo}`
        : `Suspicious File: Security scan flagged this file${vtInfo}`;
    } else {
      scanStatus.value = 'clean';
    }
    isScanning.value = false;
  } catch (scanError: any) {
    console.error('Scan failed:', scanError);
    isScanning.value = false;

    // Handle different scan failure scenarios
    if (scanError.response?.status === 413 || scanError.message?.includes('too large') || scanError.message?.includes('payload')) {
      // File too large for scanning
      console.warn('File too large for scanning');
      scanStatus.value = 'malicious';
      virusDetails.value = 'Scan error: This file is too large to scan. Our scanner cannot process files of this size.';
    } else if (scanError.response?.status === 503 && scanError.response?.data?.code === 'SCANNER_UNAVAILABLE') {
      // Scanner service unavailable
      console.warn('Scanner unavailable, skipping scan');
      scanStatus.value = 'skipped';
      scanSkipReason.value = 'scanner_unavailable';
    } else if (scanError.code === 'ERR_NETWORK' || scanError.message?.includes('Network Error')) {
      // Network error
      console.warn('Scanner service unavailable, proceeding without scan');
      scanStatus.value = 'skipped';
      scanSkipReason.value = 'scanner_unavailable';
    } else if (scanError.response?.status === 504 || scanError.code === 'ECONNABORTED') {
      // Timeout - likely too large
      console.warn('Scan timeout - file too large');
      scanStatus.value = 'malicious';
      virusDetails.value = 'Scan error: Scanning timed out. The file is too large to scan.';
    } else {
      // Other scan errors
      scanStatus.value = 'malicious';
      virusDetails.value = `Scan error: ${scanError.response?.data?.message || scanError.message || 'Unable to scan file. Please try again.'}`;
    }
  }
};

const processFile = async (file: File) => {
  selectedFile.value = file;
  scanStatus.value = null;
  virusDetails.value = '';
  isScanning.value = false;
  scanSkipReason.value = '';

  try {
    // Compute SHA-256 hash
    const hash = await computeSHA256(file);
    sha256Hash.value = hash;

    // Check if there's a resumable upload state for this file
    const existingState = getResumableUploadState(hash);
    if (existingState && existingState.shareCode) {
      // File was previously being uploaded
      uploadProgress.value = existingState.uploadProgress;
      shareCode.value = existingState.shareCode;
      isPaused.value = true; // Start in paused state so user can choose to resume

      // Show notification
      success(`📁 Found previous upload at ${existingState.uploadProgress}% - Click Resume to continue`);
      return;
    }

    // Check if user disabled scanning
    if (!enableScan.value) {
      console.warn('Scanning disabled by user');
      scanSkipReason.value = 'user_disabled';
      isScanning.value = false;
      scanStatus.value = 'skipped';
      return;
    }

    // Start pre-upload scan (uses appropriate scanner based on file size)
    // Files ≤32MB use fast API-based scanning
    // Files >32MB use ClamAV scanner
    await performScan();
  } catch (err) {
    console.error('Failed to process file:', err);
    isScanning.value = false;
  }
};

// Pause upload
const pauseUpload = () => {
  // Immediately abort network request
  if (uploadAbortController) {
    uploadAbortController.abort();
    uploadAbortController = null;
  }

  // IMMEDIATELY freeze the state - no async operations
  isPaused.value = true;
  isUploading.value = false;  // Stop the upload state
  uploadSpeed.value = '0 MB/s';
  timeRemaining.value = '';

  // Manually pause Lottie animation immediately
  if (uploadLottieRef.value) {
    try {
      uploadLottieRef.value.pause();
    } catch (e) {
      // Silently fail if pause method not available
    }
  }

  // Force Vue to update DOM immediately to freeze progress bar
  // This ensures the CSS transition is removed before any more updates
  Promise.resolve().then(() => {
    // Save paused state after DOM update
    if (sha256Hash.value) {
      setUploadPaused(sha256Hash.value, true);
    }
  });
};

// Resume upload
const resumeUpload = async () => {
  if (!selectedFile.value || !sha256Hash.value) return;

  isPaused.value = false;

  // Manually resume Lottie animation immediately
  if (uploadLottieRef.value) {
    try {
      uploadLottieRef.value.play();
    } catch (e) {
      // Silently fail if play method not available
    }
  }

  // Update paused state
  setUploadPaused(sha256Hash.value, false);

  // Continue upload from where it was paused
  await uploadFile();
};

// Calculate upload speed and time remaining
const updateUploadStats = (bytesUploaded: number) => {
  const now = Date.now();
  const timeDiff = (now - lastProgressTime) / 1000; //seconds
  const bytesDiff = bytesUploaded - lastProgressBytes;

  if (timeDiff > 0) {
    const bytesPerSecond = bytesDiff / timeDiff;
    const mbPerSecond = bytesPerSecond / (1024 * 1024);
    uploadSpeed.value = `${mbPerSecond.toFixed(2)} MB/s`;

    if (selectedFile.value && bytesPerSecond > 0) {
      const remainingBytes = selectedFile.value.size - bytesUploaded;
      const remainingSeconds = remainingBytes / bytesPerSecond;

      if (remainingSeconds < 60) {
        timeRemaining.value = `${Math.ceil(remainingSeconds)}s remaining`;
      } else if (remainingSeconds < 3600) {
        timeRemaining.value = `${Math.ceil(remainingSeconds / 60)}m remaining`;
      } else {
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.ceil((remainingSeconds % 3600) / 60);
        timeRemaining.value = `${hours}h ${minutes}m remaining`;
      }
    }

    lastProgressTime = now;
    lastProgressBytes = bytesUploaded;
  }
};

const uploadFile = async () => {
  if (!selectedFile.value || !sha256Hash.value) return;

  // Check if this is a resume from an existing state
  const existingState = getResumableUploadState(sha256Hash.value);
  const isResuming = existingState && existingState.shareCode;

  if (!isResuming) {
    // Fresh upload - check scan status
    if (isUploading.value) return; // Prevent double upload
    if (scanStatus.value !== 'clean' && scanStatus.value !== 'skipped') return;
  }

  isUploading.value = true;

  // Restore progress if resuming
  if (isResuming) {
    uploadProgress.value = existingState.uploadProgress;
    shareCode.value = existingState.shareCode;
  } else {
    uploadProgress.value = 0;
    uploadComplete.value = false;
  }

  isPaused.value = false;
  uploadSpeed.value = '0 MB/s';
  timeRemaining.value = '';
  lastProgressTime = Date.now();
  lastProgressBytes = 0;
  uploadAbortController = new AbortController();

  try {
    // Request upload metadata (or reuse existing for resume)
    if (!isResuming) {
      const metaResponse = await uploadFileMeta({
        filename: selectedFile.value.name,
        size: selectedFile.value.size,
        sha256: sha256Hash.value,
        mimeType: selectedFile.value.type || 'application/octet-stream',
        ttlHours: ttlHours.value,
        maxUses: maxUses.value,
        encrypted: enableEncryption.value,
        scanSkipped: scanStatus.value === 'skipped',
        requireCaptcha: requireCaptcha.value,
      });

      shareCode.value = metaResponse.shareCode;
      expiresAt.value = metaResponse.expiresAt;
    }

    // GitHub upload with resumable chunks
    const CHUNK_SIZE = 8 * 1024 * 1024; // 8MB chunks
    const totalChunks = Math.ceil(selectedFile.value.size / CHUNK_SIZE);

    // Initialize or get existing upload state
    let uploadState: ResumableUploadState;
    if (isResuming) {
      uploadState = existingState;
    } else {
      // Create new upload state
      uploadState = {
        shareCode: shareCode.value,
        filename: selectedFile.value.name,
        fileSize: selectedFile.value.size,
        sha256: sha256Hash.value,
        totalChunks,
        uploadedChunks: Array.from({ length: totalChunks }, (_, i) => ({
          chunkIndex: i,
          uploaded: false,
        })),
        uploadProgress: 0,
        lastUpdate: Date.now(),
        isPaused: false,
        uploadType: 'github',
      };
      saveResumableUploadState(sha256Hash.value, uploadState);
    }

    console.log(`📦 ${isResuming ? 'Resuming' : 'Starting'} upload: ${totalChunks} chunks total`);

    // Upload chunks (skip already uploaded ones)
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      // Reload state to ensure we have latest uploadedChunks info
      uploadState = getResumableUploadState(sha256Hash.value)!;

      // Check if chunk already uploaded
      if (isChunkUploaded(sha256Hash.value, chunkIndex)) {
        console.log(`✓ Chunk ${chunkIndex + 1}/${totalChunks} already uploaded, skipping`);

        // Update progress for skipped chunks
        const uploadedCount = uploadState.uploadedChunks.filter(c => c.uploaded).length;
        uploadProgress.value = Math.floor((uploadedCount / totalChunks) * 100);

        continue;
      }

      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, selectedFile.value.size);
      const chunk = selectedFile.value.slice(start, end);

      console.log(`📤 Uploading chunk ${chunkIndex + 1}/${totalChunks} (${chunk.size} bytes)`);

      // Use FormData for direct binary upload
      const formData = new FormData();
      formData.append('file', chunk, selectedFile.value.name);
      formData.append('shareCode', shareCode.value);
      formData.append('filename', selectedFile.value.name);
      formData.append('sha256', sha256Hash.value);
      formData.append('chunkIndex', chunkIndex.toString());
      formData.append('totalChunks', totalChunks.toString());
      formData.append('isLastChunk', (chunkIndex === totalChunks - 1).toString());

      // Send chunk to server
      const response = await fetch(`${import.meta.env.VITE_API_URL}/github-upload`, {
        method: 'POST',
        body: formData,
        signal: uploadAbortController?.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || `Server error: ${response.status}`;
        throw new Error(errorMsg);
      }

      // Mark chunk as uploaded in state
      markChunkUploaded(sha256Hash.value, chunkIndex);

      // Reload state to get updated uploadedChunks array
      uploadState = getResumableUploadState(sha256Hash.value)!;

      // Update progress
      const uploadedCount = uploadState.uploadedChunks.filter(c => c.uploaded).length;
      uploadProgress.value = Math.floor((uploadedCount / totalChunks) * 100);
      const bytesUploaded = chunkIndex * CHUNK_SIZE + chunk.size;
      updateUploadStats(bytesUploaded);

      console.log(`✅ Chunk ${chunkIndex + 1}/${totalChunks} uploaded (${uploadProgress.value}%)`);

      // Small delay between chunks
      if (chunkIndex < totalChunks - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Ensure progress reaches 100%
    uploadProgress.value = 100;
    console.log('✅ All chunks uploaded successfully!');

    // Clean up resumable state on completion
    deleteResumableUploadState(sha256Hash.value);

    // Keep progress at 100% visible for a moment
    await new Promise(resolve => setTimeout(resolve, 1200));
    uploadComplete.value = true;
    
    // Save to local history
    addToUploadHistory({
      id: `upload-${Date.now()}`,
      shareCode: shareCode.value,
      filename: selectedFile.value.name,
      size: selectedFile.value.size,
      uploadedAt: Date.now(),
      expiresAt: expiresAt.value,
      verificationCode: '', // Not used anymore
      maxUses: maxUses.value,
      usesLeft: maxUses.value,
    });
    
    // Request persistent storage on first upload (user interaction context)
    requestPersistentStorage().catch(() => {});
    
    // Start virus scanning
    startScanSimulation();
  } catch (err: any) {
    console.error('Upload failed:', err);

    // Handle abort errors (from pause)
    if (err.name === 'AbortError') {
      console.log('Upload paused by user');
      return; // Don't show error for intentional pause
    }

    // Handle specific error codes
    let errorMessage = 'Upload failed';
    if (err.response) {
      const status = err.response.status;
      if (status === 402) {
        errorMessage = 'Payment required: Storage quota exceeded. Please upgrade your plan.';
      } else if (status === 502) {
        errorMessage = 'Server temporarily unavailable. Please try again in a moment.';
      } else if (status === 413) {
        errorMessage = 'File too large. Please ensure your connection is stable for large file uploads.';
      } else if (status === 429) {
        errorMessage = 'Too many uploads. Please wait a moment and try again.';
      } else if (status >= 500) {
        errorMessage = `Server error (${status}). Please try again later.`;
      } else {
        errorMessage = err.response.data?.message || err.message || 'Unknown error occurred';
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    error(errorMessage);
    resetForm();
  } finally {
    isUploading.value = false;
  }
};

const resetForm = () => {
  // Clean up resumable state if any
  if (sha256Hash.value) {
    deleteResumableUploadState(sha256Hash.value);
  }

  selectedFile.value = null;
  sha256Hash.value = '';
  verificationCode.value = '';
  shareCode.value = '';
  uploadProgress.value = 0;
  uploadComplete.value = false;
  ttlHours.value = 24;
  maxUses.value = 1;
  enableEncryption.value = false;
  isScanning.value = false;
  scanStatus.value = null;
  virusDetails.value = '';
  allowQuarantine.value = false;
  isPaused.value = false;
};

// Simulate scanning (replace with actual API call)
const startScanSimulation = () => {
  isScanning.value = true;
  // This would be replaced with actual polling of scan status from backend
  setTimeout(() => {
    isScanning.value = false;
    // Randomly show clean or malicious for demo (remove in production)
    // scanStatus.value = Math.random() > 0.9 ? 'malicious' : 'clean';
    // if (scanStatus.value === 'malicious') {
    //   virusDetails.value = 'Threat detected: Trojan.Generic.12345 | VirusTotal: 3/70 engines detected malicious signatures';
    // }
    scanStatus.value = 'clean'; // Default to clean
  }, 3000);
};

const removeFile = () => {
  selectedFile.value = null;
  sha256Hash.value = '';
  scanStatus.value = null;
  virusDetails.value = '';
  isScanning.value = false;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const copyHash = () => {
  navigator.clipboard.writeText(sha256Hash.value);
  success('✓ SHA-256 hash copied to clipboard!');
};

const copyShareCode = () => {
  navigator.clipboard.writeText(shareCode.value);
  success('✓ Share code copied to clipboard!');
};

const formatSize = formatFileSize;
const formatExpiry = formatTimeRemaining;
</script>

<style scoped>
/* Neon Checkbox Styles */
.neon-checkbox {
  --primary: #00ffaa;
  --primary-dark: #00cc88;
  --primary-light: #88ffdd;
  --size: 30px;
  position: relative;
  width: var(--size);
  height: var(--size);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.neon-checkbox input {
  display: none;
}

.neon-checkbox__frame {
  position: relative;
  width: 100%;
  height: 100%;
}

.neon-checkbox__box {
  position: absolute;
  inset: 0;
  background: rgba(237, 228, 228, 0.8);
  border-radius: 4px;
  border: 2px solid var(--primary-dark);
  transition: all 0.4s ease;
}

.neon-checkbox__check-container {
  position: absolute;
  inset: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.neon-checkbox__check {
  width: 80%;
  height: 80%;
  fill: none;
  stroke: var(--primary);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  transform-origin: center;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.neon-checkbox__glow {
  position: absolute;
  inset: -2px;
  border-radius: 6px;
  background: var(--primary);
  opacity: 0;
  filter: blur(8px);
  transform: scale(1.2);
  transition: all 0.4s ease;
}

.neon-checkbox__borders {
  position: absolute;
  inset: 0;
  border-radius: 4px;
  overflow: hidden;
}

.neon-checkbox__borders span {
  position: absolute;
  width: 40px;
  height: 1px;
  background: var(--primary);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.neon-checkbox__borders span:nth-child(1) {
  top: 0;
  left: -100%;
  animation: borderFlow1 2s linear infinite;
}

.neon-checkbox__borders span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 1px;
  height: 40px;
  animation: borderFlow2 2s linear infinite;
}

.neon-checkbox__borders span:nth-child(3) {
  bottom: 0;
  right: -100%;
  animation: borderFlow3 2s linear infinite;
}

.neon-checkbox__borders span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 1px;
  height: 40px;
  animation: borderFlow4 2s linear infinite;
}

.neon-checkbox__particles span {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--primary);
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  top: 50%;
  left: 50%;
  box-shadow: 0 0 6px var(--primary);
}

.neon-checkbox__rings {
  position: absolute;
  inset: -20px;
  pointer-events: none;
}

.neon-checkbox__rings .ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid var(--primary);
  opacity: 0;
  transform: scale(0);
}

.neon-checkbox__sparks span {
  position: absolute;
  width: 20px;
  height: 1px;
  background: linear-gradient(90deg, var(--primary), transparent);
  opacity: 0;
}

/* Hover Effects */
.neon-checkbox:hover .neon-checkbox__box {
  border-color: var(--primary);
  transform: scale(1.05);
}

/* Checked State */
.neon-checkbox input:checked ~ .neon-checkbox__frame .neon-checkbox__box {
  border-color: var(--primary);
  background: rgba(0, 255, 170, 0.1);
}

.neon-checkbox input:checked ~ .neon-checkbox__frame .neon-checkbox__check {
  stroke-dashoffset: 0;
  transform: scale(1.1);
}

.neon-checkbox input:checked ~ .neon-checkbox__frame .neon-checkbox__glow {
  opacity: 0.2;
}

.neon-checkbox
  input:checked
  ~ .neon-checkbox__frame
  .neon-checkbox__borders
  span {
  opacity: 1;
}

/* Particle Animations */
.neon-checkbox
  input:checked
  ~ .neon-checkbox__frame
  .neon-checkbox__particles
  span {
  animation: particleExplosion 0.6s ease-out forwards;
}

.neon-checkbox
  input:checked
  ~ .neon-checkbox__frame
  .neon-checkbox__rings
  .ring {
  animation: ringPulse 0.6s ease-out forwards;
}

.neon-checkbox
  input:checked
  ~ .neon-checkbox__frame
  .neon-checkbox__sparks
  span {
  animation: sparkFlash 0.6s ease-out forwards;
}

/* Animations */
@keyframes borderFlow1 {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(200%);
  }
}

@keyframes borderFlow2 {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(200%);
  }
}

@keyframes borderFlow3 {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-200%);
  }
}

@keyframes borderFlow4 {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-200%);
  }
}

@keyframes particleExplosion {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translate(
        calc(-50% + var(--x, 20px)),
        calc(-50% + var(--y, 20px))
      )
      scale(0);
    opacity: 0;
  }
}

@keyframes ringPulse {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes sparkFlash {
  0% {
    transform: rotate(var(--r, 0deg)) translateX(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: rotate(var(--r, 0deg)) translateX(30px) scale(0);
    opacity: 0;
  }
}

/* Particle Positions */
.neon-checkbox__particles span:nth-child(1) {
  --x: 25px;
  --y: -25px;
}
.neon-checkbox__particles span:nth-child(2) {
  --x: -25px;
  --y: -25px;
}
.neon-checkbox__particles span:nth-child(3) {
  --x: 25px;
  --y: 25px;
}
.neon-checkbox__particles span:nth-child(4) {
  --x: -25px;
  --y: 25px;
}
.neon-checkbox__particles span:nth-child(5) {
  --x: 35px;
  --y: 0px;
}
.neon-checkbox__particles span:nth-child(6) {
  --x: -35px;
  --y: 0px;
}
.neon-checkbox__particles span:nth-child(7) {
  --x: 0px;
  --y: 35px;
}
.neon-checkbox__particles span:nth-child(8) {
  --x: 0px;
  --y: -35px;
}
.neon-checkbox__particles span:nth-child(9) {
  --x: 20px;
  --y: -30px;
}
.neon-checkbox__particles span:nth-child(10) {
  --x: -20px;
  --y: 30px;
}
.neon-checkbox__particles span:nth-child(11) {
  --x: 30px;
  --y: 20px;
}
.neon-checkbox__particles span:nth-child(12) {
  --x: -30px;
  --y: -20px;
}

/* Spark Rotations */
.neon-checkbox__sparks span:nth-child(1) {
  --r: 0deg;
  top: 50%;
  left: 50%;
}
.neon-checkbox__sparks span:nth-child(2) {
  --r: 90deg;
  top: 50%;
  left: 50%;
}
.neon-checkbox__sparks span:nth-child(3) {
  --r: 180deg;
  top: 50%;
  left: 50%;
}
.neon-checkbox__sparks span:nth-child(4) {
  --r: 270deg;
  top: 50%;
  left: 50%;
}

/* Ring Delays */
.neon-checkbox__rings .ring:nth-child(1) {
  animation-delay: 0s;
}
.neon-checkbox__rings .ring:nth-child(2) {
  animation-delay: 0.1s;
}
.neon-checkbox__rings .ring:nth-child(3) {
  animation-delay: 0.2s;
}

/* Progress Bar Animation */
.progress-fill {
  background: linear-gradient(90deg, #a855f7, #ec4899, #f97316);
  border-radius: 9999px;
  transition: width 0.3s ease;
}

/* Enhanced Select Dropdown Styling */
select.input-field {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a855f7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25rem;
  padding-right: 2.5rem;
}

select.input-field option {
  padding: 0.75rem 1rem;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  background-color: #ffffff;
  line-height: 1.5;
}

select.input-field option:hover {
  background-color: #ecfccb;
  color: #365314;
}

select.input-field option:checked {
  background-color: #d9f99d;
  color: #365314;
  font-weight: 600;
}

/* Progress Bar Animation Control */
.progress-bar-animated {
  transition: width 0.15s ease-linear;
  animation: none;
}

.progress-bar-paused {
  /* Completely freeze all animations and transitions */
  transition: none !important;
  animation: none !important;
  -webkit-transition: none !important;
  -moz-transition: none !important;
  -o-transition: none !important;
  /* Prevent any running animations from continuing */
  animation-play-state: paused !important;
  -webkit-animation-play-state: paused !important;
}

/* Also freeze the fusion head animation when paused */
.progress-bar-paused .fusion-head {
  animation: none !important;
  -webkit-animation: none !important;
}
</style>
