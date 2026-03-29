<template>
  <div class="flex-shrink-0 w-80 bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
    <!-- Profile Section -->
    <div class="flex items-start gap-4 mb-4">
      <div class="relative flex-shrink-0">
        <!-- Profile Image -->
        <img 
          v-if="!imageError"
          :src="card.image" 
          :alt="`${card.name} profile`"
          class="w-16 h-16 rounded-full object-cover"
          @error="handleImageError"
        />
        <!-- Fallback Avatar -->
        <svg 
          v-else
          class="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>

        <!-- Verification Badge (bottom right of avatar) -->
        <div class="absolute bottom-0 right-0 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
          <svg class="w-4 h-4 text-white font-bold" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
          </svg>
        </div>
      </div>

      <!-- Profile Info -->
      <div class="flex-1">
        <h3 class="font-semibold text-gray-900 text-base">{{ card.name }}</h3>
        <p class="text-sm text-gray-500">{{ card.handle }}</p>
        <p class="text-xs text-gray-400">{{ card.profession }}</p>
      </div>
    </div>

    <!-- Star Rating -->
    <div class="flex gap-1 mb-3">
      <svg v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </div>

    <!-- Review Text -->
    <p class="text-sm text-gray-700 leading-relaxed">
      "{{ card.review }}"
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Testimonial {
  image: string;
  name: string;
  handle: string;
  profession: string;
  review: string;
}

interface Props {
  card: Testimonial;
}

defineProps<Props>();

const imageError = ref(false);

const handleImageError = () => {
  imageError.value = true;
};
</script>

