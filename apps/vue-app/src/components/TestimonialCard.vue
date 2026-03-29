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
          <svg class="w-4 h-4 fill-blue-500" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" />
          </svg>
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

