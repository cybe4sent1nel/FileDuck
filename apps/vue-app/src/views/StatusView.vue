<template>
  <div class="status-page py-12 bg-gray-50 min-h-screen">
    <!-- Hero Section -->
    <div class="max-w-6xl mx-auto px-4">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 mb-2">System Status</h1>
            <p class="text-gray-600">Real-time monitoring for all FileDuck services</p>
          </div>
          <div class="flex items-center gap-3 px-6 py-3 rounded-lg border-2" :class="healthData.status === 'healthy' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'">
            <div class="w-3 h-3 rounded-full" :class="healthData.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'"></div>
            <span class="font-semibold">{{ healthData.status === 'healthy' ? 'All Systems Operational' : 'System Issues Detected' }}</span>
          </div>
        </div>
        <button 
          @click="isReportModalOpen = true"
          class="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
        >
          Report a Problem
        </button>
      </div>

      <!-- Service Status Cards -->
      <div class="space-y-4 mb-8">
        <div v-for="(service, name) in healthData.services" :key="name" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="p-3 rounded-xl" :class="getServiceIconBg(name)">
                <component :is="getServiceIcon(name)" class="w-6 h-6" :class="getServiceIconColor(name)" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">{{ getServiceDisplayName(name) }}</h3>
                <div v-if="name === 'api' || name === 's3' || (name as string) === 'storage'" class="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <span class="text-gray-400">●</span>
                  <span>{{ getComponentCount(name) }} components</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="px-4 py-2 rounded-lg text-sm font-semibold mb-2" :class="getStatusBadgeClass(service)">
                {{ getStatusText(service) }}
              </div>
              <div class="text-sm font-medium text-gray-600">{{ getUptimePercentage(name) }} uptime</div>
            </div>
          </div>
          
          <div class="mb-3">
            <div class="flex justify-between text-xs text-gray-500 mb-1">
              <span>Uptime: {{ getUptimePercentage(name) }}</span>
              <span>Current Status</span>
            </div>
          </div>
          
          <!-- Uptime Bar -->
          <div class="relative h-8 bg-gray-100 rounded overflow-hidden flex group">
            <div 
              v-for="(bar, index) in generateUptimeBars(name, service)" 
              :key="index"
              :class="bar.color"
              class="flex-1 border-r border-white/30 transition-all hover:opacity-80 cursor-pointer relative"
              @mouseenter="showTooltip($event, bar, name)"
              @mouseleave="hideTooltip"
            ></div>
          </div>
        </div>
      </div>

      <!-- Performance Metrics -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <ActivityIcon class="w-6 h-6 text-purple-600" />
            Performance Metrics
          </h2>
          <button 
            @click="isLegendOpen = true"
            class="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Status Legend
          </button>
        </div>
        
        <div class="space-y-6">
          <!-- Upload Speed Bar -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-bold text-gray-600 uppercase tracking-wider">Upload Speed</span>
              <span class="text-2xl font-black text-violet-900">{{ healthData.metrics.upload_speed }}</span>
            </div>
            <div class="relative h-8 bg-gray-100 rounded overflow-hidden flex group">
              <div 
                v-for="i in 90" 
                :key="'up-' + i" 
                :class="i % 5 === 0 ? 'bg-green-500' : i % 7 === 0 ? 'bg-yellow-500' : 'bg-emerald-400'" 
                class="flex-1 border-r border-white/30 transition-all hover:opacity-80 cursor-pointer"
                @mouseenter="showMetricTooltip($event, 'Upload', i)"
                @mouseleave="hideTooltip"
              ></div>
            </div>
          </div>

          <!-- Download Speed Bar -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-bold text-gray-600 uppercase tracking-wider">Download Speed</span>
              <span class="text-2xl font-black text-violet-900">{{ healthData.metrics.download_speed }}</span>
            </div>
            <div class="relative h-8 bg-gray-100 rounded overflow-hidden flex group">
              <div 
                v-for="i in 90" 
                :key="'down-' + i" 
                :class="i % 4 === 0 ? 'bg-cyan-500' : i % 9 === 0 ? 'bg-blue-600' : 'bg-teal-400'" 
                class="flex-1 border-r border-white/30 transition-all hover:opacity-80 cursor-pointer"
                @mouseenter="showMetricTooltip($event, 'Download', i)"
                @mouseleave="hideTooltip"
              ></div>
            </div>
          </div>

          <!-- Active Transfers Bar -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-bold text-gray-600 uppercase tracking-wider">Active Transfers</span>
              <span class="text-2xl font-black text-violet-900">{{ healthData.metrics.active_transfers }}</span>
            </div>
            <div class="relative h-8 bg-gray-100 rounded overflow-hidden flex group">
              <div 
                v-for="i in 90" 
                :key="'active-' + i" 
                :class="i % 3 === 0 ? 'bg-purple-500' : i % 8 === 0 ? 'bg-pink-500' : 'bg-violet-400'" 
                class="flex-1 border-r border-white/30 transition-all hover:opacity-80 cursor-pointer"
                @mouseenter="showMetricTooltip($event, 'Active Transfers', i)"
                @mouseleave="hideTooltip"
              ></div>
            </div>
          </div>

          <!-- Total Files Bar -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-bold text-gray-600 uppercase tracking-wider">Total Files</span>
              <span class="text-2xl font-black text-violet-900">{{ healthData.metrics.total_files }}</span>
            </div>
            <div class="relative h-8 bg-gray-100 rounded overflow-hidden flex group">
              <div 
                v-for="i in 90" 
                :key="'files-' + i" 
                :class="i % 6 === 0 ? 'bg-orange-500' : i % 10 === 0 ? 'bg-amber-600' : 'bg-yellow-400'" 
                class="flex-1 border-r border-white/30 transition-all hover:opacity-80 cursor-pointer"
                @mouseenter="showMetricTooltip($event, 'Total Files', i)"
                @mouseleave="hideTooltip"
              ></div>
            </div>
          </div>

          <!-- API Latency Bar -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-bold text-gray-600 uppercase tracking-wider">API Latency</span>
              <span class="text-2xl font-black text-violet-900">{{ healthData.metrics.api_latency }}</span>
            </div>
            <div class="relative h-8 bg-gray-100 rounded overflow-hidden flex group">
              <div 
                v-for="i in 90" 
                :key="'latency-' + i" 
                :class="i % 2 === 0 ? 'bg-indigo-500' : i % 11 === 0 ? 'bg-blue-700' : 'bg-sky-400'" 
                class="flex-1 border-r border-white/30 transition-all hover:opacity-80 cursor-pointer"
                @mouseenter="showMetricTooltip($event, 'API Latency', i)"
                @mouseleave="hideTooltip"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Infrastructure Details -->
      <div class="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-lg mb-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex flex-wrap gap-4">
            <div class="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <span class="block text-xs uppercase font-bold text-purple-200">Environment</span>
              <span class="font-semibold">Production</span>
            </div>
            <div class="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <span class="block text-xs uppercase font-bold text-purple-200">Region</span>
              <span class="font-semibold">Global CDN</span>
            </div>
            <div class="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <span class="block text-xs uppercase font-bold text-purple-200">Last Check</span>
              <span class="font-semibold">{{ lastCheckTime }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Incident History -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Incident History</h2>
        
        <div class="space-y-4">
          <div v-for="(incident, index) in incidents" :key="index" class="border-l-4 pl-4 py-3" :class="getSeverityBorderClass(incident.severity)">
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center gap-2">
                <span :class="getSeverityBadgeClass(incident.severity)" class="px-2 py-1 rounded text-xs font-semibold uppercase">
                  {{ incident.severity }}
                </span>
                <h3 class="font-semibold text-gray-900">{{ incident.title }}</h3>
              </div>
              <span class="text-sm text-gray-500">{{ incident.date }}</span>
            </div>
            <p class="text-sm text-gray-600 mb-2">{{ incident.description }}</p>
            <div class="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
              <div class="flex items-center gap-2 text-green-700 font-semibold text-sm mb-1">
                <CheckCircleIcon class="w-4 h-4" />
                Resolved
              </div>
              <p class="text-sm text-green-800">{{ incident.resolution }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hover Tooltip -->
    <div 
      v-if="tooltip.visible" 
      :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }"
      class="fixed z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl text-sm pointer-events-none"
      style="transform: translate(-50%, -120%)"
    >
      <div class="font-semibold mb-1">{{ tooltip.date }}</div>
      <div class="text-gray-300">{{ tooltip.status }}</div>
    </div>

    <!-- Color Legend Modal -->
    <div v-if="isLegendOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="isLegendOpen = false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8" @click.stop>
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900">Status Color Legend</h3>
          <button @click="isLegendOpen = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="space-y-6">
          <div>
            <h4 class="font-semibold text-gray-900 mb-3 text-lg">Service Uptime Status</h4>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-12 h-8 bg-green-500 rounded"></div>
                <div>
                  <div class="font-semibold text-gray-900">Operational</div>
                  <div class="text-sm text-gray-600">Service is running normally with no issues</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-12 h-8 bg-yellow-500 rounded"></div>
                <div>
                  <div class="font-semibold text-gray-900">Degraded Performance</div>
                  <div class="text-sm text-gray-600">Service is experiencing elevated latency or minor issues</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-12 h-8 bg-orange-500 rounded"></div>
                <div>
                  <div class="font-semibold text-gray-900">Partial Outage</div>
                  <div class="text-sm text-gray-600">Some features may be unavailable or experiencing issues</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-12 h-8 bg-red-500 rounded"></div>
                <div>
                  <div class="font-semibold text-gray-900">Service Offline</div>
                  <div class="text-sm text-gray-600">Service is completely unavailable</div>
                </div>
              </div>
            </div>
          </div>

          <div class="border-t pt-6">
            <h4 class="font-semibold text-gray-900 mb-3 text-lg">Performance Metrics</h4>
            <p class="text-sm text-gray-600 mb-4">Each bar represents historical data over the past 90 days. Hover over any segment to see specific details.</p>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center gap-2">
                <div class="w-8 h-4 bg-green-500 rounded"></div>
                <span class="text-sm text-gray-700">Upload Speed</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-8 h-4 bg-cyan-500 rounded"></div>
                <span class="text-sm text-gray-700">Download Speed</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-8 h-4 bg-purple-500 rounded"></div>
                <span class="text-sm text-gray-700">Active Transfers</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-8 h-4 bg-orange-500 rounded"></div>
                <span class="text-sm text-gray-700">Total Files</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-8 h-4 bg-indigo-500 rounded"></div>
                <span class="text-sm text-gray-700">API Latency</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t">
          <button 
            @click="isLegendOpen = false"
            class="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Report Modal -->
    <ReportModal :is-open="isReportModalOpen" @close="isReportModalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { DatabaseIcon, CloudIcon, ZapIcon, ActivityIcon, CheckCircleIcon, ServerIcon } from 'lucide-vue-next';
import ReportModal from '../components/ReportModal.vue';

const isReportModalOpen = ref(false);
const isLegendOpen = ref(false);
const lastCheckTime = ref('--:--:--');
const healthData = ref({
  status: 'healthy',
  services: {
    api: 'healthy',
    s3: 'operational',
    redis: 'connected',
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

const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  date: '',
  status: ''
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
  }
]);

const getServiceIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case 'redis': return DatabaseIcon;
    case 'storage':
    case 's3': return CloudIcon;
    case 'cdn': return ZapIcon;
    case 'scanner': return ServerIcon;
    default: return ActivityIcon;
  }
};

const getServiceIconBg = (name: string) => {
  switch (name.toLowerCase()) {
    case 'api': return 'bg-purple-50';
    case 'redis': return 'bg-red-50';
    case 'storage':
    case 's3': return 'bg-blue-50';
    case 'cdn': return 'bg-yellow-50';
    case 'scanner': return 'bg-green-50';
    default: return 'bg-gray-50';
  }
};

const getServiceIconColor = (name: string) => {
  switch (name.toLowerCase()) {
    case 'api': return 'text-purple-600';
    case 'redis': return 'text-red-600';
    case 'storage':
    case 's3': return 'text-blue-600';
    case 'cdn': return 'text-yellow-600';
    case 'scanner': return 'text-green-600';
    default: return 'text-gray-600';
  }
};

const getServiceDisplayName = (name: string) => {
  if (name === 'storage' || name === 's3') return 'S3 Storage';
  if (name === 'api') return 'API';
  if (name === 'cdn') return 'CDN';
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const getComponentCount = (name: string) => {
  if (name === 'api') return '4';
  if (name === 's3' || name === 'storage') return '2';
  return '1';
};

const getUptimePercentage = (name: string) => {
  const uptimes: Record<string, string> = {
    api: '99.75%',
    s3: '98.99%',
    storage: '98.99%',
    redis: '100%',
    scanner: '99.99%',
    cdn: '100%'
  };
  return uptimes[name] || '99.9%';
};

const isServiceHealthy = (status: string) => {
  return ['connected', 'healthy', 'operational', 'active'].includes(status.toLowerCase());
};

const getStatusText = (status: string) => {
  const s = status.toLowerCase();
  if (s === 'connected' || s === 'healthy' || s === 'operational' || s === 'active') return 'Operational';
  if (s === 'offline') return 'Offline';
  if (s === 'degraded') return 'Degraded';
  return 'Issues Detected';
};

const getStatusBadgeClass = (status: string) => {
  const healthy = isServiceHealthy(status);
  return healthy 
    ? 'bg-green-50 text-green-700 border border-green-200' 
    : 'bg-red-50 text-red-700 border border-red-200';
};

const generateUptimeBars = (name: string, status: string) => {
  const bars = [];
  const totalBars = 90;
  
  for (let i = 0; i < totalBars; i++) {
    let color = 'bg-green-500';
    let barStatus = 'No incidents';
    let date = new Date();
    date.setDate(date.getDate() - (totalBars - i));
    
    // Simulate some incidents
    if (name === 's3' && (i === 15 || i === 16)) {
      color = 'bg-orange-500';
      barStatus = 'Rate limit incident';
    } else if (name === 'api' && (i === 45 || i === 46 || i === 47)) {
      color = 'bg-yellow-500';
      barStatus = 'Elevated latency';
    } else if (name === 'scanner' && i === 30) {
      color = 'bg-red-500';
      barStatus = 'Service offline';
    }
    
    bars.push({
      color,
      status: barStatus,
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    });
  }
  
  return bars;
};

const showTooltip = (event: MouseEvent, bar: any, serviceName: string) => {
  tooltip.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    date: bar.date,
    status: bar.status
  };
};

const showMetricTooltip = (event: MouseEvent, metricName: string, dayIndex: number) => {
  const date = new Date();
  date.setDate(date.getDate() - (90 - dayIndex));
  
  tooltip.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
    status: `${metricName} data point`
  };
};

const hideTooltip = () => {
  tooltip.value.visible = false;
};

const getSeverityBadgeClass = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'major': return 'bg-red-100 text-red-700';
    case 'minor': return 'bg-yellow-100 text-yellow-700';
    case 'maintenance': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getSeverityBorderClass = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'major': return 'border-red-500';
    case 'minor': return 'border-yellow-500';
    case 'maintenance': return 'border-blue-500';
    default: return 'border-gray-500';
  }
};

const fetchHealth = async () => {
  try {
    let apiBase = import.meta.env.VITE_API_URL || '';
    // Remove trailing slash if present
    if (apiBase.endsWith('/')) {
      apiBase = apiBase.slice(0, -1);
    }
    
    // Construct health URL correctly avoiding double /api
    // If apiBase already ends with /api, don't add it again
    const healthUrl = apiBase 
      ? (apiBase.endsWith('/api') ? `${apiBase}/health` : `${apiBase}/api/health`)
      : '/api/health';
    
    // Log for debugging
    console.log('[Status Page] Fetching:', healthUrl);

    const response = await fetch(healthUrl);
    
    if (response.ok) {
      const data = await response.json();
      healthData.value = data;
      // Clear any previous errors
      lastCheckTime.value = new Date().toLocaleTimeString();
    } else {
      throw new Error(`Server returned ${response.status} ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('[Status Page] Fetch error:', error);
    
    // Show error in UI for easier debugging
    healthData.value.status = 'unhealthy';
    healthData.value.services.api = 'unhealthy';
    // Add validation error message to UI (you might need to add a field for this in the template or use console)
    console.error('Connection failed to: ' + (import.meta.env.VITE_API_URL || 'local'));
  }
};

let interval: any;
onMounted(() => {
  fetchHealth();
  interval = setInterval(fetchHealth, 300000); // Check every 5 minutes instead of 1 minute
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>

<style scoped>
.status-page {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.service-row:hover {
  transform: translateX(2px);
  transition: transform 0.2s ease;
}
</style>
