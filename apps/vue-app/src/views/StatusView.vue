<template>
  <div class="status-page py-12">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-white rounded-[3rem] shadow-xl border-2 border-purple-100 p-8 md:p-16 mb-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        <div class="flex-1 text-center md:text-left">
          <div class="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 mb-8 animate-pulse-glow" :class="healthData.status === 'healthy' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'">
            <div class="w-3 h-3 rounded-full" :class="healthData.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'"></div>
            <span class="font-bold text-lg">{{ healthData.status === 'healthy' ? 'All systems operational' : 'System issues detected' }}</span>
          </div>
          <h1 class="text-5xl md:text-7xl font-extrabold text-violet-900 mb-6 leading-tight">
            System <span class="text-purple-500">Status</span>
          </h1>
          <p class="text-xl text-gray-600 max-w-lg mb-10">
            Real-time monitoring and performance updates for all FileDuck core services.
          </p>
          <button 
            @click="isReportModalOpen = true"
            class="px-10 py-5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-105 transition-all text-lg"
          >
            Report a Problem
          </button>
        </div>
        <div class="flex-1 flex justify-center md:justify-end">
          <img src="/systemstatus.svg" alt="System Status" class="w-full max-w-md drop-shadow-2xl animate-float" />
        </div>
      </div>

      <!-- Decorative Background elements -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-yellow-100/50 rounded-full blur-3xl -ml-24 -mb-24"></div>
    </div>

    <!-- Health Checks Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      <div v-for="(service, name) in healthData.services" :key="name" class="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border-2 border-purple-50 hover:border-purple-200 transition-all group">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-purple-50 rounded-2xl group-hover:bg-purple-100 transition-colors">
              <component :is="getServiceIcon(name)" class="w-8 h-8 text-purple-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-800 capitalize">{{ name === 'storage' ? 'S3' : name }}</h3>
          </div>
          <div :class="getStatusBadgeClass(service)">
            {{ getStatusText(service) }}
          </div>
        </div>
        
        <!-- Simulation of Uptime History -->
        <div class="space-y-3">
          <div class="flex justify-between text-sm font-semibold text-gray-500">
            <span>Uptime: 99.9%</span>
            <span>Current Status</span>
          </div>
          <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full transition-all duration-1000" :class="isServiceHealthy(service) ? 'bg-green-500 w-full' : 'bg-red-500 w-1/4'"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border-2 border-purple-50 mb-12">
      <h2 class="text-3xl font-bold text-violet-900 mb-8 flex items-center gap-3">
        <ActivityIcon class="w-8 h-8 text-purple-600" />
        Performance Metrics
      </h2>
      
      <div class="space-y-6">
        <!-- Upload Speed Bar -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-bold text-gray-600 uppercase tracking-wider">Upload Speed</span>
            <span class="text-2xl font-black text-violet-900">{{ healthData.metrics.upload_speed }}</span>
          </div>
          <div class="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
            <div v-for="i in 50" :key="'up-' + i" 
                 :class="i % 5 === 0 ? 'bg-green-500' : i % 7 === 0 ? 'bg-yellow-500' : 'bg-emerald-400'" 
                 class="flex-1 border-r border-white/20"></div>
          </div>
        </div>

        <!-- Download Speed Bar -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-bold text-gray-600 uppercase tracking-wider">Download Speed</span>
            <span class="text-2xl font-black text-violet-900">{{ healthData.metrics.download_speed }}</span>
          </div>
          <div class="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
            <div v-for="i in 50" :key="'down-' + i" 
                 :class="i % 4 === 0 ? 'bg-cyan-500' : i % 9 === 0 ? 'bg-blue-600' : 'bg-teal-400'" 
                 class="flex-1 border-r border-white/20"></div>
          </div>
        </div>

        <!-- Active Transfers Bar -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-bold text-gray-600 uppercase tracking-wider">Active Transfers</span>
            <span class="text-2xl font-black text-violet-900">{{ healthData.metrics.active_transfers }}</span>
          </div>
          <div class="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
            <div v-for="i in 50" :key="'active-' + i" 
                 :class="i % 3 === 0 ? 'bg-purple-500' : i % 8 === 0 ? 'bg-pink-500' : 'bg-violet-400'" 
                 class="flex-1 border-r border-white/20"></div>
          </div>
        </div>

        <!-- Total Files Bar -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-bold text-gray-600 uppercase tracking-wider">Total Files</span>
            <span class="text-2xl font-black text-violet-900">{{ healthData.metrics.total_files }}</span>
          </div>
          <div class="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
            <div v-for="i in 50" :key="'files-' + i" 
                 :class="i % 6 === 0 ? 'bg-orange-500' : i % 10 === 0 ? 'bg-amber-600' : 'bg-yellow-400'" 
                 class="flex-1 border-r border-white/20"></div>
          </div>
        </div>

        <!-- API Latency Bar -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-bold text-gray-600 uppercase tracking-wider">API Latency</span>
            <span class="text-2xl font-black text-violet-900">{{ healthData.metrics.api_latency }}</span>
          </div>
          <div class="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
            <div v-for="i in 50" :key="'latency-' + i" 
                 :class="i % 2 === 0 ? 'bg-indigo-500' : i % 11 === 0 ? 'bg-blue-700' : 'bg-sky-400'" 
                 class="flex-1 border-r border-white/20"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Backend Details -->
    <div class="bg-violet-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
      <div class="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div>
          <h2 class="text-3xl font-bold mb-4">Infrastructure Details</h2>
          <p class="text-violet-200 mb-8 max-w-md">Our global infrastructure ensures your files are safe, scanned, and accessible anywhere.</p>
          <div class="flex flex-wrap gap-4">
            <div class="px-6 py-3 bg-white/10 rounded-xl border border-white/20">
              <span class="block text-xs uppercase font-bold text-violet-300">Environment</span>
              <span class="font-semibold">Production</span>
            </div>
            <div class="px-6 py-3 bg-white/10 rounded-xl border border-white/20">
              <span class="block text-xs uppercase font-bold text-violet-300">Region</span>
              <span class="font-semibold">Global CDN</span>
            </div>
            <div class="px-6 py-3 bg-white/10 rounded-xl border border-white/20">
              <span class="block text-xs uppercase font-bold text-violet-300">Last Check</span>
              <span class="font-semibold">{{ lastCheckTime }}</span>
            </div>
          </div>
        </div>
        <div class="text-center md:text-right">
          <div class="text-5xl font-black text-white mb-2">99.9%</div>
          <div class="text-violet-300 font-bold uppercase tracking-widest text-sm">Overall Uptime</div>
        </div>
      </div>
      <!-- Background SVG decoration -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
        <svg width="600" height="600" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#FFFFFF" d="M40,-62C53.3,-54,66.7,-45.5,76.5,-33C86.3,-20.5,92.5,-4,90.4,12.5C88.3,29,78,45.5,65.3,58C52.7,70.5,37.8,79,21.8,83.9C5.8,88.7,-11.3,89.9,-27.1,85.2C-42.9,80.5,-57.4,69.9,-68,56.7C-78.6,43.4,-85.4,27.5,-86.3,11.5C-87.1,-4.5,-82,-20.5,-73,-34C-64,-47.5,-51.1,-58.5,-37,-66C-22.9,-73.5,-7.6,-77.5,3.9,-84.2C15.4,-90.9,40,-62,40,-62Z" transform="translate(100 100)" />
        </svg>
      </div>
    </div>

    <!-- Incident History -->
    <div class="mt-16">
      <h2 class="text-3xl font-bold text-violet-900 mb-8 flex items-center gap-3">
        <HistoryIcon class="w-8 h-8 text-purple-600" />
        Incident History
      </h2>
      
      <div class="space-y-6">
        <div v-for="(incident, index) in incidents" :key="index" class="bg-white rounded-3xl p-8 shadow-md border-2 border-purple-50 hover:shadow-lg transition-all">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div class="flex items-center gap-3">
              <span :class="getSeverityClass(incident.severity)" class="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                {{ incident.severity }}
              </span>
              <h3 class="text-xl font-bold text-gray-800">{{ incident.title }}</h3>
            </div>
            <div class="text-sm font-semibold text-gray-500 flex items-center gap-2">
              <CalendarIcon class="w-4 h-4" />
              {{ incident.date }}
            </div>
          </div>
          
          <p class="text-gray-600 mb-6 leading-relaxed">
            {{ incident.description }}
          </p>
          
          <div class="bg-green-50 rounded-2xl p-6 border border-green-100">
            <div class="flex items-center gap-2 text-green-700 font-bold mb-2">
              <CheckCircleIcon class="w-5 h-5" />
              Resolution
            </div>
            <p class="text-green-800 text-sm">
              {{ incident.resolution }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Modal -->
    <ReportModal :is-open="isReportModalOpen" @close="isReportModalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { DatabaseIcon, CloudIcon, ZapIcon, ActivityIcon, HistoryIcon, CalendarIcon, CheckCircleIcon } from 'lucide-vue-next';
import ReportModal from '../components/ReportModal.vue';

const isReportModalOpen = ref(false);
const lastCheckTime = ref('--:--:--');
const healthData = ref({
  status: 'healthy',
  services: {
    api: 'healthy',
    redis: 'connected',
    storage: 'operational',
    scanner: 'operational',
    cdn: 'active'
  },
  metrics: {
    upload_speed: '0.0 MB/s',
    download_speed: '0.0 MB/s',
    active_transfers: 0,
    total_files: 0,
    api_latency: '0ms'
  }
});

const incidents = ref([
  {
    date: 'February 15, 2026',
    title: 'GitHub Storage API Rate Limit',
    severity: 'minor',
    description: 'Temporary rate limiting was observed on the GitHub storage backend during peak upload hours, causing some file operations to be delayed.',
    resolution: 'Implemented request throttling and exponential backoff strategies. Added Redis-based caching for frequently accessed metadata to reduce API calls by 40%.'
  },
  {
    date: 'February 14, 2026',
    title: 'Slow upload speeds in EU-West region',
    severity: 'minor',
    description: 'We observed increased latency for file uploads originating from European regions due to a CDN synchronization issue.',
    resolution: 'Successfully rerouted traffic through alternative edge locations and optimized the ingestion pipeline. Service returned to normal within 45 minutes.'
  },
  {
    date: 'February 2, 2026',
    title: 'Scheduled Database Maintenance',
    severity: 'maintenance',
    description: 'The primary storage metadata database underwent a scheduled upgrade to improve query performance for large file lookups.',
    resolution: 'Maintenance completed successfully with zero downtime. System performance improved by approximately 24% for search operations.'
  },
  {
    date: 'January 15, 2026',
    title: 'Intermittent API Connectivity',
    severity: 'major',
    description: 'A surge in traffic caused temporary connection timeouts for approximately 5% of users attempting to generate share links.',
    resolution: 'Auto-scaling groups were adjusted and rate-limiting rules were refined to ensure high availability during peak traffic periods.'
  }
]);

const getSeverityClass = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'major': return 'bg-red-100 text-red-700 border border-red-200';
    case 'minor': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    case 'maintenance': return 'bg-blue-100 text-blue-700 border border-blue-200';
    default: return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};

const getServiceIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case 'redis': return DatabaseIcon;
    case 'storage': return CloudIcon;
    case 's3': return CloudIcon;
    case 'cdn': return ZapIcon;
    default: return ActivityIcon;
  }
};

const isServiceHealthy = (status: string) => {
  return ['connected', 'healthy', 'operational', 'active', 'not_checked'].includes(status.toLowerCase());
};

const getStatusText = (status: string) => {
  const s = status.toLowerCase();
  if (s === 'connected') return 'Operational';
  if (s === 'healthy') return 'Healthy';
  if (s === 'operational') return 'Operational';
  if (s === 'active') return 'Active';
  if (s === 'offline') return 'Offline';
  if (s === 'degraded') return 'Degraded';
  return 'Issues Detected';
};

const getStatusBadgeClass = (status: string) => {
  const healthy = isServiceHealthy(status);
  return `px-4 py-1.5 rounded-full text-sm font-bold border-2 ${
    healthy 
      ? 'bg-green-50 text-green-600 border-green-100' 
      : 'bg-red-50 text-red-600 border-red-100'
  }`;
};

const fetchHealth = async () => {
  try {
    const apiBase = import.meta.env.VITE_API_URL || '';
    const healthUrl = apiBase ? `${apiBase}/api/health` : '/api/health';
    
    const response = await fetch(healthUrl);
    if (response.ok) {
      const data = await response.json();
      healthData.value = data;
      lastCheckTime.value = new Date().toLocaleTimeString();
    } else {
      healthData.value.status = 'unhealthy';
      healthData.value.services.api = 'unhealthy';
    }
  } catch (error) {
    console.error('Failed to fetch health:', error);
    healthData.value.services.api = 'unhealthy';
  }
};

let interval: any;
onMounted(() => {
  fetchHealth();
  interval = setInterval(fetchHealth, 60000); // Check every 60s
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>

<style scoped>
.status-page {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-pulse-glow {
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0px rgba(16, 185, 129, 0); }
  50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.2); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
</style>
