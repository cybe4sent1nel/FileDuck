<template>
  <div class="py-20 my-16 overflow-hidden">
    <div class="container mx-auto px-4">
      <h3 class="text-center text-4xl font-bold text-indigo-950 font-display tracking-tight leading-tight mb-12 pb-2">
        Trusted by Leading Organizations Worldwide
      </h3>

      <!-- Infinite Scrolling Logos -->
      <div class="relative mb-12">
        <div class="flex animate-scroll">
          <div class="flex space-x-16 items-center">
            <!-- Row 1 -->
            <div v-for="logo in [...brandLogos, ...brandLogos]" :key="logo.id" class="flex-shrink-0">
              <div class="bg-white rounded-2xl px-8 py-6 shadow-md hover:shadow-lg transition-all transform hover:scale-105 border border-purple-100">
                <img :src="logo.image" :alt="logo.name" class="h-12 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12 text-center" ref="statsSection">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div class="text-center">
            <div class="text-4xl font-bold text-purple-500 mb-2 font-mono">{{ displayStats.filesShared }}</div>
            <div class="text-gray-600">Files Shared</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-purple-500 mb-2 font-mono">{{ displayStats.activeUsers }}</div>
            <div class="text-gray-600">Active Users</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-yellow-400 mb-2 font-mono">{{ displayStats.uptime }}</div>
            <div class="text-purple-200">Uptime</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-yellow-400 mb-2 font-mono">{{ displayStats.countries }}</div>
            <div class="text-purple-200">Countries</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const brandLogos = ref([
  { id: 1, name: 'Microsoft', image: '/trusted/microsoft-svgrepo-com.svg' },
  { id: 2, name: 'Google', image: '/trusted/google-color-svgrepo-com.svg' },
  { id: 3, name: 'Amazon', image: '/trusted/amazon-color-svgrepo-com.svg' },
  { id: 4, name: 'Meta', image: '/trusted/meta-logo-facebook-svgrepo-com.svg' },
  { id: 5, name: 'Apple', image: '/trusted/apple-173-svgrepo-com.svg' },
  { id: 6, name: 'Netflix', image: '/trusted/netflix-1-logo-svgrepo-com.svg' },
  { id: 7, name: 'Adobe', image: '/trusted/adobe-svgrepo-com.svg' },
  { id: 8, name: 'Spotify', image: '/trusted/spotify-color-svgrepo-com.svg' },
  { id: 9, name: 'Uber', image: '/trusted/uber-svgrepo-com.svg' },
  { id: 10, name: 'Airbnb', image: '/trusted/airbnb-svgrepo-com.svg' },
]);

const statsSection = ref<HTMLElement | null>(null);
const isAnimating = ref(false);

const displayStats = ref({
  filesShared: '0M+',
  activeUsers: '0K+',
  uptime: '0.0%',
  countries: '0+'
});

const targetStats = {
  filesShared: 10,
  activeUsers: 500,
  uptime: 99.9,
  countries: 150
};

const animateCounter = (target: number, callback: (value: string) => void, suffix: string, isDecimal = false) => {
  const duration = 2000;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  const chars = '0123456789';
  
  const interval = setInterval(() => {
    if (current < target) {
      // Decrypting effect - show random characters briefly
      const randomChars = Array.from({ length: String(Math.floor(target)).length }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ).join('');
      
      callback(randomChars + suffix);
      
      setTimeout(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        
        if (isDecimal) {
          callback(current.toFixed(1) + suffix);
        } else {
          callback(Math.floor(current) + suffix);
        }
      }, 20);
    }
  }, duration / steps);
};

const startAnimation = () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  
  animateCounter(targetStats.filesShared, (val) => {
    displayStats.value.filesShared = val;
  }, 'M+');
  
  animateCounter(targetStats.activeUsers, (val) => {
    displayStats.value.activeUsers = val;
  }, 'K+');
  
  animateCounter(targetStats.uptime, (val) => {
    displayStats.value.uptime = val;
  }, '%', true);
  
  animateCounter(targetStats.countries, (val) => {
    displayStats.value.countries = val;
  }, '+');
};

let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isAnimating.value) {
          startAnimation();
        }
      });
    },
    { threshold: 0.5 }
  );
  
  if (statsSection.value) {
    observer.observe(statsSection.value);
  }
});

onUnmounted(() => {
  if (observer && statsSection.value) {
    observer.unobserve(statsSection.value);
  }
});
</script>

<style scoped>
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-scroll {
  animation: scroll 30s linear infinite;
}

.animate-scroll:hover {
  animation-play-state: paused;
}
</style>
