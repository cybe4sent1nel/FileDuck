<template>
  <div class="py-20 my-16">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl md:text-5xl font-extrabold font-display tracking-tight text-center mb-4 text-teal-900">
        How FileDuck Works
      </h2>
      <p class="text-center text-gray-600 mb-16 text-lg font-sans">
        Share files securely in 3 simple steps
      </p>

      <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- Step 1: Upload -->
        <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-purple-100">
          <div class="bg-gradient-to-r from-purple-400 to-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6">
            1
          </div>
          <Vue3Lottie
            :animationData="UploadAnimation"
            :height="140"
            :width="140"
            :loop="true"
            class="mx-auto mb-6"
          />
          <h3 class="text-2xl font-bold text-gray-800 mb-3 flex items-center">
            <UploadCloudIcon class="w-6 h-6 mr-2 text-purple-400" />
            Upload Your File
          </h3>
          <p class="text-gray-600 leading-relaxed">
            Drag & drop or select your file. We support files up to 500GB with pause/resume. Your file is encrypted in your browser before upload.
          </p>
          <div class="mt-4 flex items-center text-sm text-purple-500">
            <ShieldCheckIcon class="w-4 h-4 mr-1" />
            <span class="font-medium">End-to-end encrypted</span>
          </div>
        </div>

        <!-- Step 2: Scan -->
        <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-lemon-100">
          <div class="bg-gradient-to-r from-lemon-400 to-lemon-500 text-gray-800 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6">
            2
          </div>
          <Vue3Lottie
            :animationData="ScanAnimation"
            :height="140"
            :width="140"
            :loop="true"
            class="mx-auto mb-6"
          />
          <h3 class="text-2xl font-bold text-gray-800 mb-3 flex items-center">
            <ScanSearchIcon class="w-6 h-6 mr-2 text-lemon-500" />
            Security Scan
          </h3>
          <p class="text-gray-600 leading-relaxed">
            Every file is automatically scanned for malware using multiple security engines. Malicious files are quarantined.
          </p>
          <div class="mt-4 flex items-center text-sm text-gray-700">
            <ScanIcon class="w-4 h-4 mr-1" />
            <span class="font-medium">Real-time protection</span>
          </div>
        </div>

        <!-- Step 3: Share -->
        <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-purple-100">
          <div class="bg-gradient-to-r from-purple-400 to-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6">
            3
          </div>
          <Vue3Lottie
            :animationData="ShareAnimation"
            :height="140"
            :width="140"
            :loop="true"
            class="mx-auto mb-6"
          />
          <h3 class="text-2xl font-bold text-gray-800 mb-3 flex items-center">
            <Share2Icon class="w-6 h-6 mr-2 text-purple-400" />
            Share Securely
          </h3>
          <p class="text-gray-600 leading-relaxed">
            Get a unique code to share. Files auto-delete after the time limit. Recipients download via global CDN.
          </p>
          <div class="mt-4 flex items-center text-sm text-purple-700">
            <ClockIcon class="w-4 h-4 mr-1" />
            <span class="font-semibold">Time-limited links</span>
          </div>
        </div>
      </div>

      <!-- Additional Features -->
      <div class="mt-16 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div class="bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl p-6 shadow-lg border border-purple-200">
          <div class="flex items-start space-x-4">
            <div class="bg-white/80 p-3 rounded-lg">
              <Vue3Lottie
                :animationData="GooseAnimation"
                :height="60"
                :width="60"
                :loop="true"
              />
            </div>
            <div>
              <h4 class="text-xl font-bold mb-2 text-gray-800">Fast & Reliable</h4>
              <p class="text-gray-700">
                Powered by Cloudflare CDN for lightning-fast downloads worldwide. Your files are delivered in milliseconds.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-amber-100 to-amber-200 rounded-xl p-6 shadow-lg border border-amber-200">
          <div class="flex items-start space-x-4">
            <div class="bg-white/80 p-3 rounded-lg">
              <Vue3Lottie
                :animationData="VerifyAnimation"
                :height="60"
                :width="60"
                :loop="true"
              />
            </div>
            <div>
              <h4 class="text-xl font-bold mb-2 text-gray-800">Verified Integrity</h4>
              <p class="text-gray-700">
                Every file includes a SHA-256 checksum to verify integrity. Ensure your file arrives untampered.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie';
import { 
  UploadCloudIcon, 
  ScanSearchIcon, 
  Share2Icon, 
  ShieldCheckIcon, 
  ScanIcon,
  ClockIcon 
} from 'lucide-vue-next';

import UploadAnimation from '../../../../animations/Upload Files.json';
import ScanAnimation from '../../../../animations/Scanning document.json';
import ShareAnimation from '../../../../animations/Data Downloading.json';
import GooseAnimation from '../../../../animations/goose Wonders.json';
import VerifyAnimation from '../../../../animations/Verify Code.json';
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.hover\:-translate-y-2:hover {
  animation: float 3s ease-in-out infinite;
}
</style>
