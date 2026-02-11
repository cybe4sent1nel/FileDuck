<template>
  <div class="py-20 my-16">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <!-- Left: Animation -->
        <div class="flex justify-center">
          <Vue3Lottie
            :animationData="EarthAnimation"
            :height="320"
            :width="320"
            :loop="true"
          />
        </div>

        <!-- Right: Content -->
        <div>
          <h2 class="text-4xl md:text-5xl font-extrabold font-display tracking-tight mb-6 text-purple-950">
            About FileDuck
          </h2>
          <p class="text-xl text-gray-700 mb-6 leading-relaxed">
            We're on a mission to make file sharing <strong class="text-purple-600">secure</strong>, 
            <strong class="text-gray-900">fast</strong>, and <strong class="text-purple-600">private</strong> for everyone.
          </p>
          <p class="text-lg text-gray-600 mb-8 leading-relaxed">
            FileDuck combines enterprise-grade security with consumer simplicity. Every file is automatically scanned 
            for malware, encrypted in transit, and delivered through our global CDN network for lightning-fast downloads worldwide.
          </p>

          <div class="space-y-4">
            <div class="flex items-start">
              <div class="bg-purple-50 rounded-lg p-3 mr-4 border border-purple-100">
                <ShieldCheckIcon class="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h4 class="font-bold text-xl text-gray-800 mb-2">High-Level Security</h4>
                <p class="text-gray-600">Multi-engine malware scanning, SHA-256 checksums, and zero-knowledge encryption</p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="bg-yellow-100 rounded-lg p-3 mr-4">
                <ZapIcon class="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h4 class="font-bold text-xl text-gray-800 mb-2">Lightning Fast</h4>
                <p class="text-gray-600">Powered by our global CDN infrastructure for instant downloads from anywhere</p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="bg-purple-100 rounded-lg p-3 mr-4">
                <EyeOffIcon class="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h4 class="font-bold text-xl text-gray-800 mb-2">Privacy First</h4>
                <p class="text-gray-600">Time-limited links, one-time downloads, and no tracking or data mining</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie';
import { ShieldCheckIcon, ZapIcon, EyeOffIcon } from 'lucide-vue-next';
import EarthAnimation from '../../../../animations/Earth globe rotating with Seamless loop animation.json';
</script>
