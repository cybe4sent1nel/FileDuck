<template>
  <div class="p-4 rounded-lg mx-2 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0 bg-white border border-purple-100">
    <div class="flex gap-3 mb-4">
      <div class="relative">
        <img 
          :src="card.image" 
          :alt="`${card.name} profile`"
          class="size-12 rounded-full object-cover"
          @error="handleImageError"
          v-if="!imageError"
        />
        <!-- Fallback SVG for broken images -->
        <svg 
          v-else
          class="size-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white p-2"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
      <div class="flex flex-col justify-center">
        <div class="flex items-center gap-1">
          <p class="font-semibold text-gray-900">{{ card.name }}</p>
          <!-- Verification Badge with Checkmark -->
          <div class="relative inline-flex items-center justify-center">
            <svg class="w-4 h-4 fill-blue-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="11" fill="currentColor" />
            </svg>
            <svg class="w-3 h-3 absolute fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          </div>
        </div>
        <span class="text-xs text-slate-500">{{ card.handle }}</span>
        <span class="text-xs text-slate-400">{{ card.profession }}</span>
      </div>
    </div>

    <!-- Star Rating -->
    <div class="flex gap-0.5 mb-3">
      <svg v-for="i in 5" :key="i" class="w-3.5 h-3.5 fill-yellow-400" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </div>

    <!-- Review Text -->
    <p class="text-sm text-gray-700 leading-relaxed line-clamp-4">
      "{{ card.review }}"
    </p>
  </div>
</template>

<script setup lang="ts" generic="T extends { image: string; name: string; handle: string; review: string; profession: string }">
import { ref } from 'vue';

interface Props {
  card: T;
}

defineProps<Props>();

const imageError = ref(false);

const handleImageError = () => {
  imageError.value = true;
};
</script>

<style scoped>
.line-clamp-4 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
</style>

