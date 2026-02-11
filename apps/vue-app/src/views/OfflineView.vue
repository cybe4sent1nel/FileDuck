<template>
  <div class="min-h-screen bg-[#FFFBF5] relative overflow-hidden">
    <!-- Navbar -->
    <nav class="bg-white/95 backdrop-blur-md shadow-2xl border-b-2 border-purple-200 sticky top-0 z-50">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between gap-4">
          <router-link to="/" class="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0">
            <div class="relative">
              <div class="absolute inset-0 bg-purple-100 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <img src="/logo.png" alt="FileDuck" class="h-10 w-10 sm:h-12 sm:w-12 transform group-hover:scale-110 group-hover:rotate-12 transition-all relative z-10" />
            </div>
            <span class="text-xl sm:text-2xl font-bold font-display tracking-tight text-violet-900">FileDuck</span>
          </router-link>

          <!-- Mobile Menu Button -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 rounded-lg hover:bg-purple-50 transition-colors">
            <svg v-if="!mobileMenuOpen" class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Desktop Menu -->
          <div class="hidden md:flex flex-1 justify-between items-center ml-8 max-w-5xl">
            <router-link to="/" class="flex items-center text-gray-700 hover:text-purple-600 transition-all font-semibold px-3 lg:px-4 py-2 rounded-lg hover:bg-purple-50 group">
              <HomeIcon class="w-5 h-5 mr-1 lg:mr-2 group-hover:scale-110 transition-transform" />
              <span class="text-sm lg:text-base">Home</span>
            </router-link>
            <a href="/#upload" @click.prevent="scrollToUpload" class="flex items-center text-gray-700 hover:text-purple-600 transition-all font-semibold px-3 lg:px-4 py-2 rounded-lg hover:bg-purple-50 group cursor-pointer">
              <UploadIcon class="w-5 h-5 mr-1 lg:mr-2 group-hover:scale-110 transition-transform" />
              <span class="text-sm lg:text-base">Upload</span>
            </a>
            <router-link to="/download" class="flex items-center text-gray-700 hover:text-yellow-600 transition-all font-semibold px-3 lg:px-4 py-2 rounded-lg hover:bg-yellow-50 group cursor-pointer">
              <DownloadIcon class="w-5 h-5 mr-1 lg:mr-2 group-hover:scale-110 transition-transform" />
              <span class="text-sm lg:text-base">Download</span>
            </router-link>
            <router-link to="/history" class="flex items-center text-gray-700 hover:text-purple-600 transition-all font-semibold px-3 lg:px-4 py-2 rounded-lg hover:bg-purple-50 group cursor-pointer">
              <ClockIcon class="w-5 h-5 mr-1 lg:mr-2 group-hover:scale-110 transition-transform" />
              <span class="text-sm lg:text-base">My Activity</span>
            </router-link>
            <router-link to="/docs" class="flex items-center text-gray-700 hover:text-blue-600 transition-all font-semibold px-3 lg:px-4 py-2 rounded-lg hover:bg-blue-50 group cursor-pointer">
              <BookOpenIcon class="w-5 h-5 mr-1 lg:mr-2 group-hover:scale-110 transition-transform" />
              <span class="text-sm lg:text-base">Docs</span>
            </router-link>
            <router-link to="/faq" class="flex items-center text-gray-700 hover:text-green-600 transition-all font-semibold px-3 lg:px-4 py-2 rounded-lg hover:bg-green-50 group cursor-pointer">
              <HelpCircleIcon class="w-5 h-5 mr-1 lg:mr-2 group-hover:scale-110 transition-transform" />
              <span class="text-sm lg:text-base">FAQ</span>
            </router-link>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden mt-4 pb-2 space-y-2">
          <router-link @click="mobileMenuOpen = false" to="/" class="flex items-center text-gray-700 hover:text-purple-600 transition-all font-semibold px-4 py-3 rounded-lg hover:bg-purple-50 group">
            <HomeIcon class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            Home
          </router-link>
          <a @click="scrollToUpload(); mobileMenuOpen = false" href="/#upload" class="flex items-center text-gray-700 hover:text-purple-600 transition-all font-semibold px-4 py-3 rounded-lg hover:bg-purple-50 group cursor-pointer">
            <UploadIcon class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            Upload
          </a>
          <router-link @click="mobileMenuOpen = false" to="/download" class="flex items-center text-gray-700 hover:text-yellow-600 transition-all font-semibold px-4 py-3 rounded-lg hover:bg-yellow-50 group cursor-pointer">
            <DownloadIcon class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            Download
          </router-link>
          <router-link @click="mobileMenuOpen = false" to="/history" class="flex items-center text-gray-700 hover:text-purple-600 transition-all font-semibold px-4 py-3 rounded-lg hover:bg-purple-50 group">
            <ClockIcon class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            My Activity
          </router-link>
          <router-link @click="mobileMenuOpen = false" to="/docs" class="flex items-center text-gray-700 hover:text-blue-600 transition-all font-semibold px-4 py-3 rounded-lg hover:bg-blue-50 group">
            <BookOpenIcon class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            Docs
          </router-link>
          <router-link @click="mobileMenuOpen = false" to="/faq" class="flex items-center text-gray-700 hover:text-green-600 transition-all font-semibold px-4 py-3 rounded-lg hover:bg-green-50 group">
            <HelpCircleIcon class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            FAQ
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Error Content -->
    <div class="flex items-center justify-center px-4 py-8 relative overflow-hidden" style="min-height: calc(100vh - 80px);">
    <!-- Background Animation -->
    <div class="absolute inset-0 flex items-center justify-center opacity-20">
      <Vue3Lottie
        :animationData="NoInternetAnimation"
        :height="800"
        :width="800"
        :loop="true"
        class="pointer-events-none"
      />
    </div>

    <!-- Content -->
    <div class="max-w-2xl w-full relative z-10">
      <div class="text-center">
        <!-- Error Code -->
        <div class="flex items-center justify-center gap-3 mb-6">
          <WifiOff class="w-16 h-16 text-orange-500" />
          <h1 class="text-6xl font-bold text-gray-800">Offline</h1>
        </div>

        <!-- Witty Message -->
        <div class="flex items-center justify-center gap-3 mb-4">
          <img src="/logo.png" alt="FileDuck" class="w-10 h-10" />
          <h2 class="text-3xl font-semibold text-gray-700">{{ wittyMessage }}</h2>
        </div>
        
        <p class="text-lg text-gray-600 mb-8">
          It seems you've lost your internet connection. Your files are safe, but you'll need to reconnect to continue.
        </p>

        <!-- Troubleshooting Toggle -->
        <button
          @click="showTroubleshooting = !showTroubleshooting"
          class="mb-8 inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          <Lightbulb class="w-5 h-5" />
          {{ showTroubleshooting ? 'Hide' : 'Show' }} Troubleshooting Steps
          <ChevronDown class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showTroubleshooting }" />
        </button>

        <!-- Troubleshooting Steps -->
        <div v-if="showTroubleshooting" class="bg-white/80 backdrop-blur rounded-xl p-6 mb-8 text-left shadow-lg">
          <div class="flex items-center gap-2 mb-4">
            <Lightbulb class="w-5 h-5 text-yellow-500" />
            <h3 class="text-xl font-semibold text-gray-800">Troubleshooting Steps</h3>
          </div>
          
          <ol class="space-y-3 text-gray-700">
            <li class="flex items-start gap-3">
              <span class="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-600 text-sm font-semibold shrink-0 mt-0.5">1</span>
              <div>
                <div class="flex items-center gap-2 font-medium">
                  <Wifi class="w-4 h-4" />
                  Check your WiFi or network connection
                </div>
                <p class="text-sm text-gray-500 mt-1">Make sure you're connected to a network</p>
              </div>
            </li>
            
            <li class="flex items-start gap-3">
              <span class="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-600 text-sm font-semibold shrink-0 mt-0.5">2</span>
              <div>
                <div class="flex items-center gap-2 font-medium">
                  <Router class="w-4 h-4" />
                  Restart your router or modem
                </div>
                <p class="text-sm text-gray-500 mt-1">Unplug for 30 seconds, then plug back in</p>
              </div>
            </li>
            
            <li class="flex items-start gap-3">
              <span class="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-600 text-sm font-semibold shrink-0 mt-0.5">3</span>
              <div>
                <div class="flex items-center gap-2 font-medium">
                  <ToggleLeft class="w-4 h-4" />
                  Try airplane mode on/off
                </div>
                <p class="text-sm text-gray-500 mt-1">Toggle to reset your connection</p>
              </div>
            </li>
            
            <li class="flex items-start gap-3">
              <span class="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-600 text-sm font-semibold shrink-0 mt-0.5">4</span>
              <div>
                <div class="flex items-center gap-2 font-medium">
                  <RefreshCw class="w-4 h-4" />
                  Refresh this page once connected
                </div>
                <p class="text-sm text-gray-500 mt-1">We'll automatically detect when you're back online</p>
              </div>
            </li>
          </ol>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="retryConnection"
            class="btn-primary inline-flex items-center justify-center px-6 py-3"
          >
            <RefreshCw class="w-5 h-5 mr-2" :class="{ 'animate-spin': isRetrying }" />
            {{ isRetrying ? 'Checking...' : 'Retry Connection' }}
          </button>
          
          <router-link
            to="/"
            class="btn-secondary inline-flex items-center justify-center px-6 py-3"
          >
            <Home class="w-5 h-5 mr-2" />
            Go Home
          </router-link>
        </div>

        <!-- Online Status Indicator -->
        <div class="mt-8 flex items-center justify-center gap-2 text-sm">
          <div :class="isOnline ? 'bg-green-500' : 'bg-red-500'" class="w-2 h-2 rounded-full animate-pulse"></div>
          <span class="text-gray-600">{{ isOnline ? 'Back online!' : 'Currently offline' }}</span>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Vue3Lottie } from 'vue3-lottie';
import {
  WifiOff,
  Wifi,
  Router,
  ToggleLeft,
  RefreshCw,
  Home,
  Lightbulb,
  ChevronDown,
  Home as HomeIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Clock as ClockIcon,
  BookOpen as BookOpenIcon,
  HelpCircle as HelpCircleIcon
} from 'lucide-vue-next';
import NoInternetAnimation from '../../../../animations/No internet connection.json';
import { useRouter } from 'vue-router';

const router = useRouter();
const isRetrying = ref(false);
const isOnline = ref(navigator.onLine);
const mobileMenuOpen = ref(false);

// Witty duck messages
const duckMessages = [
  "Quack! The internet flew away!",
  "Even ducks need WiFi to fly!",
  "Houston, we've lost connection!",
  "The internet took a duck break!",
  "No signal? Must be duck season!",
  "Looks like the WiFi went south for winter!",
  "Connection paddled away!",
  "The web is playing hide and seek!",
  "Internet? More like... outer-net!",
  "Even our rubber ducky can't debug this!"
];

const wittyMessage = ref(duckMessages[Math.floor(Math.random() * duckMessages.length)]);
const showTroubleshooting = ref(false);

// Scroll to upload section
const scrollToUpload = () => {
  if (router.currentRoute.value.path !== '/') {
    router.push('/').then(() => {
      setTimeout(() => {
        const uploadSection = document.querySelector('#upload');
        uploadSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    });
  } else {
    const uploadSection = document.querySelector('#upload');
    uploadSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const retryConnection = async () => {
  isRetrying.value = true;
  
  try {
    const response = await fetch('/api/health', { method: 'HEAD' });
    if (response.ok) {
      isOnline.value = true;
      setTimeout(() => {
        router.push('/');
      }, 500);
    }
  } catch (error) {
    isOnline.value = false;
  } finally {
    setTimeout(() => {
      isRetrying.value = false;
    }, 1000);
  }
};

const handleOnline = () => {
  isOnline.value = true;
  setTimeout(() => {
    router.push('/');
  }, 1000);
};

const handleOffline = () => {
  isOnline.value = false;
};

onMounted(() => {
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
});

onUnmounted(() => {
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
});
</script>
