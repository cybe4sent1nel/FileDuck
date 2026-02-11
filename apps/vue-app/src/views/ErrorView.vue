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
              <ClockIconNav class="w-5 h-5 mr-1 lg:mr-2 group-hover:scale-110 transition-transform" />
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
            <ClockIconNav class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
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
        :animationData="ErrorAnimation"
        :height="700"
        :width="700"
        :loop="true"
        class="pointer-events-none"
      />
    </div>

    <!-- Content -->
    <div class="max-w-2xl w-full relative z-10">
      <div class="text-center">
        <!-- Error Code -->
        <div class="flex items-center justify-center gap-3 mb-6">
          <AlertTriangle class="w-16 h-16 text-red-500" />
          <h1 class="text-6xl font-bold text-gray-800">{{ errorCode || 'Error' }}</h1>
        </div>

        <!-- Witty Message -->
        <div class="flex items-center justify-center gap-3 mb-4">
          <img src="/logo.png" alt="FileDuck" class="w-10 h-10" />
          <h2 class="text-3xl font-semibold text-gray-700">{{ wittyMessage }}</h2>
        </div>
        
        <p class="text-lg text-gray-600 mb-8">
          {{ errorDescription || 'Something unexpected happened. Our ducks are working on it!' }}
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
            <h3 class="text-xl font-semibold text-gray-800">Try these steps</h3>
          </div>
          
          <ol class="space-y-3 text-gray-700">
            <li class="flex items-start gap-3">
              <span class="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-600 text-sm font-semibold shrink-0 mt-0.5">1</span>
              <div>
                <div class="flex items-center gap-2 font-medium">
                  <RefreshCw class="w-4 h-4" />
                  Refresh the page
                </div>
                <p class="text-sm text-gray-500 mt-1">Sometimes a simple refresh fixes everything</p>
              </div>
            </li>
            
            <li class="flex items-start gap-3">
              <span class="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-600 text-sm font-semibold shrink-0 mt-0.5">2</span>
              <div>
                <div class="flex items-center gap-2 font-medium">
                  <Trash2 class="w-4 h-4" />
                  Clear browser cache
                </div>
                <p class="text-sm text-gray-500 mt-1">Old cached data might be causing issues</p>
              </div>
            </li>
            
            <li class="flex items-start gap-3">
              <span class="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-600 text-sm font-semibold shrink-0 mt-0.5">3</span>
              <div>
                <div class="flex items-center gap-2 font-medium">
                  <Clock class="w-4 h-4" />
                  Wait a few minutes
                </div>
                <p class="text-sm text-gray-500 mt-1">Our servers might be temporarily overwhelmed</p>
              </div>
            </li>
            
            <li class="flex items-start gap-3">
              <span class="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-600 text-sm font-semibold shrink-0 mt-0.5">4</span>
              <div>
                <div class="flex items-center gap-2 font-medium">
                  <MessageCircle class="w-4 h-4" />
                  Contact support
                </div>
                <p class="text-sm text-gray-500 mt-1">If the problem persists, let us know</p>
              </div>
            </li>
          </ol>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="reloadPage"
            class="btn-primary inline-flex items-center justify-center px-6 py-3"
          >
            <RefreshCw class="w-5 h-5 mr-2" />
            Reload Page
          </button>
          
          <router-link
            to="/"
            class="btn-secondary inline-flex items-center justify-center px-6 py-3"
          >
            <Home class="w-5 h-5 mr-2" />
            Go Home
          </router-link>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Vue3Lottie } from 'vue3-lottie';
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Lightbulb,
  Trash2,
  Clock,
  MessageCircle,
  ChevronDown,
  Home as HomeIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Clock as ClockIconNav,
  BookOpen as BookOpenIcon,
  HelpCircle as HelpCircleIcon
} from 'lucide-vue-next';
import ErrorAnimation from '../../../../animations/Error.json';
import { useRouter } from 'vue-router';

const router = useRouter();
const mobileMenuOpen = ref(false);

interface Props {
  errorCode?: string | number;
  errorDescription?: string;
}

const props = withDefaults(defineProps<Props>(), {
  errorCode: undefined,
  errorDescription: undefined,
});

// Witty duck messages
const duckMessages = [
  "Quack! Something went wrong!",
  "Our ducks tripped over the code!",
  "Error: Duck overflow detected!",
  "The server ducks are on a coffee break!",
  "Oops! A wild bug appeared!",
  "Houston, we have a duck problem!",
  "Error: Too many ducks in the system!",
  "The code went duck-shaped!",
  "Something's fishy... or should we say, ducky!",
  "Our debugging duck needs debugging!"
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

const reloadPage = () => {
  window.location.reload();
};
</script>
