<template>
  <div class="py-20 my-16">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto text-center bg-white rounded-3xl shadow-xl p-12 border border-purple-100">
        <h2 class="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight mb-6 text-slate-900">
          Ready to Share Files Securely?
        </h2>
        <p class="text-xl md:text-2xl text-gray-600 mb-10 font-light">
          Join 500,000+ users who trust FileDuck for secure file sharing
        </p>
        
        <div class="flex flex-col md:flex-row justify-center gap-4">
          <a href="/#upload" @click.prevent="scrollToUpload" class="bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-4 px-10 rounded-lg text-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer">
            <UploadIcon class="w-6 h-6 mr-2" />
            Upload a File Now
          </a>
          <router-link to="/download" class="bg-gradient-to-r from-lemon-400 to-lemon-500 hover:from-lemon-500 hover:to-lemon-600 text-gray-800 font-semibold py-4 px-10 rounded-lg text-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center">
            <DownloadIcon class="w-6 h-6 mr-2" />
            Download a File
          </router-link>
        </div>

        <div class="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div class="text-center">
            <div class="flex justify-center mb-3">
              <div class="bg-purple-100 p-3 rounded-full">
                <LockIcon class="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div class="text-gray-700 font-medium">100% Secure</div>
          </div>
          <div class="text-center">
            <div class="flex justify-center mb-3">
              <div class="bg-yellow-100 p-3 rounded-full">
                <ZapIcon class="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div class="text-gray-700 font-medium">Ultra Fast</div>
          </div>
          <div class="text-center">
            <div class="flex justify-center mb-3">
              <div class="bg-blue-100 p-3 rounded-full">
                <GlobeIcon class="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div class="text-gray-700 font-medium">Global CDN</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { UploadIcon, DownloadIcon, LockIcon, ZapIcon, GlobeIcon } from 'lucide-vue-next';

const router = useRouter();

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
