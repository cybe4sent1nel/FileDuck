<template>
  <div class="py-20 my-16">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <!-- Duck Love Animation -->
        <div class="flex justify-center mb-6">
          <Vue3Lottie
            :animationData="DuckLoveAnimation"
            :height="120"
            :width="120"
            :loop="true"
          />
        </div>
        
        <h2 class="text-5xl font-bold mb-4 text-indigo-950 font-display tracking-tight leading-tight pb-2">
          What Our Users Say
        </h2>
        <p class="text-xl text-gray-600">
          Trusted by 500K+ users worldwide
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- Testimonial 1 -->
        <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-purple-100">
          <div class="flex items-center mb-6">
            <div class="bg-gradient-to-r from-purple-400 to-purple-500 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold">
              SK
            </div>
            <div class="ml-4">
              <h4 class="font-bold text-lg text-gray-800">Sarah Kim</h4>
              <p class="text-sm text-gray-500">Product Designer</p>
            </div>
          </div>
          <div class="flex mb-4">
            <StarIcon v-for="i in 5" :key="i" class="w-5 h-5 text-lemon-400 fill-lemon-400" />
          </div>
          <p class="text-gray-600 leading-relaxed">
            "FileDuck has been a game-changer for sharing design files with clients. The virus scanning gives everyone peace of mind, and the speed is incredible!"
          </p>
        </div>

        <!-- Testimonial 2 -->
        <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-purple-100">
          <div class="flex items-center mb-6">
            <div class="bg-gradient-to-r from-lemon-400 to-lemon-500 rounded-full w-16 h-16 flex items-center justify-center text-gray-800 text-2xl font-bold">
              MJ
            </div>
            <div class="ml-4">
              <h4 class="font-bold text-lg text-gray-800">Michael Johnson</h4>
              <p class="text-sm text-yellow-600">Software Developer</p>
            </div>
          </div>
          <div class="flex mb-4">
            <StarIcon v-for="i in 5" :key="i" class="w-5 h-5 text-yellow-500 fill-yellow-500" />
          </div>
          <p class="text-gray-700 leading-relaxed">
            "I love the SHA-256 checksums and zero-knowledge encryption. Finally, a file sharing service that takes security seriously. Highly recommended!"
          </p>
        </div>

        <!-- Testimonial 3 -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-purple-200">
          <div class="flex items-center mb-6">
            <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold">
              AR
            </div>
            <div class="ml-4">
              <h4 class="font-bold text-lg text-gray-800">Aisha Rahman</h4>
              <p class="text-sm text-purple-600">Marketing Manager</p>
            </div>
          </div>
          <div class="flex mb-4">
            <StarIcon v-for="i in 5" :key="i" class="w-5 h-5 text-yellow-500 fill-yellow-500" />
          </div>
          <p class="text-gray-700 leading-relaxed">
            "The one-time download links are perfect for sending sensitive marketing materials. Clean interface, fast performance, and great security features!"
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie';
import { StarIcon } from 'lucide-vue-next';
import DuckLoveAnimation from '../../../../animations/Duck love.json';
</script>
