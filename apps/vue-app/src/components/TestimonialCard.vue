<template>
  <div class="flex-shrink-0 w-96 bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100 hover:border-purple-300">
    <!-- Stars -->
    <div class="flex gap-1 mb-6">
      <StarIcon v-for="i in testimonial.rating" :key="i" class="w-5 h-5 text-lemon-500 fill-lemon-500" />
    </div>

    <!-- Testimonial Text -->
    <p class="text-gray-700 leading-relaxed mb-6 text-base font-medium">
      "{{ testimonial.text }}"
    </p>

    <!-- User Info -->
    <div class="flex items-center gap-4">
      <!-- User Image -->
      <img 
        :src="testimonial.image" 
        :alt="testimonial.name"
        :data-fallback="testimonial.fallbackImage"
        @error="handleImageError"
        class="w-14 h-14 rounded-full object-cover border-2 border-purple-200 flex-shrink-0"
      />
      
      <!-- User Details -->
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-gray-900 text-lg truncate">{{ testimonial.name }}</h4>
        <p class="text-sm text-gray-600 truncate">{{ testimonial.role }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StarIcon } from 'lucide-vue-next';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  fallbackImage: string;
  text: string;
  rating: number;
  bgGradient: string;
}

defineProps<{
  testimonial: Testimonial;
}>();

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  const fallback = target.dataset.fallback || '/testimonials/emma.svg';
  if (target.src.endsWith(fallback)) {
    return;
  }
  target.src = fallback;
};
</script>

<style scoped>
/* Smooth transitions on hover */
div {
  @apply transition-colors;
}
</style>
