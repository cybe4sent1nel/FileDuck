<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-cream-50 via-cream-100 to-yellow-50 relative overflow-hidden">
    <!-- Notification Container -->
    <NotificationContainer />

    <!-- Falling Icons Background - Hide on error pages -->
    <div v-if="!isErrorPage" class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div v-for="i in 15" :key="i" class="falling-icon" :style="getFallingIconStyle(i)">
        <component :is="getRandomIcon(i)" class="w-6 h-6 opacity-20" :class="getIconColor(i)" />
      </div>
    </div>

    <!-- Particle Background - Hide on error pages -->
    <ParticleBackground v-if="!isErrorPage" />

    <!-- Only show navbar if NOT on error pages -->
    <nav v-if="!isErrorPage" class="bg-white/95 backdrop-blur-md shadow-2xl border-b-2 border-purple-200 sticky top-0 z-50">
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

    <!-- Regular page content - Hide wrapper on error pages -->
    <main v-if="!isErrorPage" class="container mx-auto px-4 relative z-10">
      <!-- AdSense Display Ad (Responsive) - Only show if ads loaded -->
      <div v-if="adsLoaded" class="max-w-4xl mx-auto mb-2">
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-2332002596329232"
             data-ad-slot="auto"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>

      <router-view />

      <!-- AdSense In-feed Ad - Only show if ads loaded -->
      <div v-if="adsLoaded" class="max-w-4xl mx-auto mt-8">
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-format="fluid"
             data-ad-layout-key="-fb+5w+4e-db+86"
             data-ad-client="ca-pub-2332002596329232"
             data-ad-slot="auto"></ins>
      </div>
    </main>

    <!-- Error pages without wrapper -->
    <router-view v-if="isErrorPage" />

    <footer v-if="!isErrorPage" class="bg-cream-50 mt-16 border-t-2 border-purple-200">
      <div class="container mx-auto px-4 py-12">
        <!-- Main Footer Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <!-- Brand Section -->
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <img src="/logo.png" alt="FileDuck" class="h-10 w-10" />
              <span class="text-2xl font-bold text-purple-900">FileDuck</span>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed mb-4">
              Secure, fast, and private file sharing platform with AI-powered malware protection.
            </p>
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <MailIcon class="w-4 h-4 text-purple-500" />
              <a href="mailto:support@fileduck.com" class="hover:text-purple-600 transition-colors">
                support@fileduck.com
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="font-bold text-gray-800 mb-4 text-lg">Quick Links</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <router-link to="/" class="text-gray-600 hover:text-purple-600 transition-colors flex items-center">
                  <span class="text-purple-500 mr-2">→</span>Home
                </router-link>
              </li>
              <li>
                <router-link to="/docs" class="text-gray-600 hover:text-purple-600 transition-colors flex items-center">
                  <span class="text-purple-500 mr-2">→</span>Documentation
                </router-link>
              </li>
              <li>
                <router-link to="/faq" class="text-gray-600 hover:text-purple-600 transition-colors flex items-center">
                  <span class="text-purple-500 mr-2">→</span>FAQ
                </router-link>
              </li>
              <li>
                <router-link to="/history" class="text-gray-600 hover:text-purple-600 transition-colors flex items-center">
                  <span class="text-purple-500 mr-2">→</span>My Activity
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Security & Features -->
          <div>
            <h3 class="font-bold text-gray-800 mb-4 text-lg">Security</h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-center">
                <ShieldCheckIcon class="w-4 h-4 mr-2 text-purple-500" />
                AI Malware Scanning
              </li>
              <li class="flex items-center">
                <LockIcon class="w-4 h-4 mr-2 text-purple-500" />
                End-to-End Encryption
              </li>
              <li class="flex items-center">
                <ZapIcon class="w-4 h-4 mr-2 text-purple-500" />
                Global CDN Network
              </li>
              <li class="flex items-center">
                <ClockIcon class="w-4 h-4 mr-2 text-purple-500" />
                Time-Limited Links
              </li>
            </ul>
          </div>

          <!-- Community & Legal -->
          <div>
            <h3 class="font-bold text-gray-800 mb-4 text-lg">Community</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/yourusername/fileduck"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-600 hover:text-purple-600 transition-colors flex items-center"
                >
                  <GithubIcon class="w-4 h-4 mr-2" />
                  Contribute on GitHub
                </a>
              </li>
              <li>
                <router-link to="/privacy" class="text-gray-600 hover:text-purple-600 transition-colors flex items-center">
                  <span class="text-purple-500 mr-2">→</span>Privacy Policy
                </router-link>
              </li>
              <li>
                <router-link to="/terms" class="text-gray-600 hover:text-purple-600 transition-colors flex items-center">
                  <span class="text-purple-500 mr-2">→</span>Terms of Service
                </router-link>
              </li>
            </ul>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div class="border-t border-purple-200 pt-6">
          <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p class="text-sm text-gray-600">
              &copy; 2026 FileDuck. All rights reserved.
            </p>
            <div class="flex items-center space-x-2 text-sm">
              <span class="text-gray-600">Designed & Developed by</span>
              <span class="font-bold text-purple-600">Fahad Khan</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { UploadIcon, DownloadIcon, ClockIcon, ShieldCheckIcon, ZapIcon, FileIcon, FolderIcon, FileTextIcon, ImageIcon, FileCodeIcon, HomeIcon, BookOpenIcon, HelpCircleIcon, MailIcon, LockIcon, GithubIcon } from 'lucide-vue-next';
import ParticleBackground from './components/ParticleBackground.vue';
import NotificationContainer from './components/NotificationContainer.vue';

const router = useRouter();
const route = useRoute();

const adsLoaded = ref(false);
const mobileMenuOpen = ref(false);

// Check if current page is an error page
const isErrorPage = computed(() => {
  const path = route.path;
  return path === '/offline' || path === '/404' || path === '/error' || route.name === 'NotFound';
});

const icons = [FileIcon, FolderIcon, FileTextIcon, ImageIcon, FileCodeIcon, ShieldCheckIcon, ZapIcon];

const getRandomIcon = (index: number) => {
  return icons[index % icons.length];
};

const getFallingIconStyle = (index: number) => {
  const left = (index * 7 + 3) % 100;
  const duration = 15 + (index % 10) * 2;
  const delay = (index * 1.5) % 10;
  return {
    left: `${left}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  };
};

const getIconColor = (index: number) => {
  const colors = ['text-purple-300', 'text-yellow-300', 'text-blue-300', 'text-pink-300', 'text-green-300'];
  return colors[index % colors.length];
};

// Initialize AdSense ads
let adsInitialized = false;

onMounted(() => {
  // Only initialize ads once
  if (adsInitialized) return;
  adsInitialized = true;

  // Handle online/offline status
  const handleOnline = () => {
    console.log('Back online - reloading to get fresh content');
    // Force reload to get fresh content when coming back online
    if (router.currentRoute.value.path === '/offline') {
      // Redirect to home and force reload
      window.location.href = '/';
    } else {
      // Just reload the current page to get fresh content
      window.location.reload();
    }
  };

  const handleOffline = () => {
    console.log('Went offline');
    const currentPath = router.currentRoute.value.path;
    // Redirect to offline page unless already there
    // Note: /history is accessible offline for viewing cached records
    if (currentPath !== '/offline' && currentPath !== '/history') {
      router.push('/offline');
    }
  };

  // Check initial offline state
  if (!navigator.onLine && router.currentRoute.value.path !== '/offline' && router.currentRoute.value.path !== '/history') {
    router.push('/offline');
  }

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Service Worker update handling
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60000); // Check every minute

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available, prompt user to reload
              console.log('New content available! Please refresh.');
              // Auto-reload after 2 seconds to get new content
              setTimeout(() => {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }, 2000);
            }
          });
        }
      });
    });
  }

  try {
    // Wait for AdSense script to load
    setTimeout(() => {
      const adElements = document.querySelectorAll('.adsbygoogle');
      
      if (adElements.length > 0 && (window as any).adsbygoogle) {
        try {
          // Only push ads that haven't been processed yet
          adElements.forEach((el) => {
            const element = el as HTMLElement;
            const status = element.getAttribute('data-adsbygoogle-status');
            
            // Skip if already processed (has any status attribute)
            if (!status) {
              ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            }
          });
        } catch (pushError) {
          console.warn('AdSense push error:', pushError);
        }
        
        // Check if ads loaded successfully
        setTimeout(() => {
          adsLoaded.value = Array.from(adElements).some(
            el => (el as HTMLElement).offsetHeight > 0 || 
                  (el as HTMLElement).getAttribute('data-ad-status') === 'filled'
          );
        }, 1500);
      } else {
        adsLoaded.value = false;
      }
    }, 500);
  } catch (err) {
    console.error('AdSense error:', err);
    adsLoaded.value = false;
  }
});

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
</script>

<style scoped>
@keyframes fall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.2;
  }
  90% {
    opacity: 0.2;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

.falling-icon {
  position: absolute;
  top: -100px;
  animation: fall linear infinite;
}
</style>
