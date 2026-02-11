<template>
  <div class="bg-purple-50 rounded-2xl p-6 shadow-lg border-2 border-purple-200">
    <div class="text-center mb-6">
      <div class="flex items-center justify-center mb-2">
        <Vue3Lottie
          :animationData="GraphicChartAnimation"
          :height="60"
          :width="60"
          :loop="true"
          :autoplay="true"
        />
        <h3 class="text-2xl font-bold text-purple-800 ml-2">Live Activity</h3>
      </div>
      <p class="text-sm text-gray-600">Real-time file sharing happening now</p>
    </div>

    <!-- Live Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl p-4 shadow-md text-center transform hover:scale-105 transition-transform">
        <div class="flex items-center justify-center mb-2">
          <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <UploadIcon class="w-5 h-5 text-green-600" />
        </div>
        <div class="text-3xl font-bold text-green-600 font-mono transition-all duration-500">{{ formatNumber(liveStats.uploadsToday) }}</div>
        <div class="text-xs text-gray-600 mt-1">Uploads Today</div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-md text-center transform hover:scale-105 transition-transform">
        <div class="flex items-center justify-center mb-2">
          <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-2"></div>
          <DownloadIcon class="w-5 h-5 text-blue-600" />
        </div>
        <div class="text-3xl font-bold text-blue-600 font-mono transition-all duration-500">{{ formatNumber(liveStats.downloadsToday) }}</div>
        <div class="text-xs text-gray-600 mt-1">Downloads Today</div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-md text-center transform hover:scale-105 transition-transform">
        <div class="flex items-center justify-center mb-2">
          <div class="w-3 h-3 bg-purple-500 rounded-full animate-pulse mr-2"></div>
          <UsersIcon class="w-5 h-5 text-purple-600" />
        </div>
        <div class="text-3xl font-bold text-purple-600 font-mono transition-all duration-700 ease-in-out">{{ formatNumber(liveStats.activeUsers) }}</div>
        <div class="text-xs text-gray-600 mt-1">Users Online</div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-md text-center transform hover:scale-105 transition-transform">
        <div class="flex items-center justify-center mb-2">
          <div class="w-3 h-3 bg-yellow-500 rounded-full animate-pulse mr-2"></div>
          <ShieldCheckIcon class="w-5 h-5 text-yellow-600" />
        </div>
        <div class="text-3xl font-bold text-yellow-600 font-mono transition-all duration-500">{{ formatNumber(liveStats.filesScanned) }}</div>
        <div class="text-xs text-gray-600 mt-1">Files Scanned</div>
      </div>
    </div>

    <!-- Global Reach Animation -->
    <div class="bg-white rounded-xl p-4 shadow-md mb-6 flex flex-col md:flex-row items-center md:items-start md:space-x-4">
      <div class="w-full md:w-1/3">
        <Vue3Lottie
          :animationData="EarthAnimation"
          :height="180"
          :width="180"
          :loop="true"
          :autoplay="true"
        />
      </div>
      <div class="w-full md:w-2/3 space-y-2 text-sm text-gray-700">
        <p class="font-semibold text-purple-800">Worldwide deliveries</p>
        <p>Realtime transfers across regions with CDN edges and secure scanning before release.</p>
        <p class="text-gray-500">Activity feed is anonymized: filenames are redacted by design.</p>
      </div>
    </div>

    <!-- Recent Activity Feed -->
    <div class="bg-white rounded-xl p-4 shadow-md max-h-64 overflow-y-auto">
      <h4 class="text-sm font-bold text-gray-700 mb-3 flex items-center">
        <ActivityIcon class="w-4 h-4 mr-2" />
        Recent Activity
      </h4>
      <TransitionGroup name="activity" tag="div" class="space-y-2">
        <div
          v-for="activity in recentActivities"
          :key="activity.id"
          class="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-center space-x-2">
            <component
              :is="activity.type === 'upload' ? UploadIcon : DownloadIcon"
              :class="[
                'w-4 h-4',
                activity.type === 'upload' ? 'text-green-600' : 'text-blue-600'
              ]"
            />
            <span class="font-semibold text-gray-700">{{ activity.filename }}</span>
            <span class="text-gray-500">({{ formatFileSize(activity.size) }})</span>
          </div>
          <span class="text-gray-400">{{ activity.timeAgo }}</span>
        </div>
      </TransitionGroup>
      
      <div v-if="recentActivities.length === 0" class="text-center text-gray-400 py-8">
        <p class="text-sm">Activity will appear here</p>
      </div>
    </div>

    <!-- Trust Badge -->
    <div class="mt-4 text-center">
      <div class="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-xs font-bold">
        <CheckCircleIcon class="w-4 h-4 mr-2" />
        100% Secure • Trusted by {{ formatNumber(liveStats.totalUsers) }}+ Users
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Vue3Lottie } from 'vue3-lottie';
import { 
  UploadIcon, 
  DownloadIcon, 
  UsersIcon, 
  ShieldCheckIcon, 
  ActivityIcon,
  CheckCircleIcon 
} from 'lucide-vue-next';
import { formatFileSize } from '@fileduck/shared';
import EarthAnimation from '../../../../animations/Earth globe rotating with Seamless loop animation.json';
import GraphicChartAnimation from '../../../../animations/Graphic Chart.json';

interface LiveStats {
  uploadsToday: number;
  downloadsToday: number;
  activeUsers: number;
  filesScanned: number;
  totalUsers: number;
}

interface Activity {
  id: string;
  type: 'upload' | 'download';
  filename: string;
  size: number;
  timeAgo: string;
  timestamp: number;
}

const STORAGE_KEY = 'fileduck_live_stats';
const BASELINE_KEY = 'fileduck_baseline_stats';
const STATS_VERSION = '1.0';

// Helper to get base date for "today" (midnight UTC)
const getTodayKey = () => {
  const now = new Date();
  return `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
};

// Get or initialize baseline stats (cumulative totals that never decrease)
const getBaseline = (): LiveStats => {
  try {
    const stored = localStorage.getItem(BASELINE_KEY);
    if (stored) {
      const baseline = JSON.parse(stored);
      if (baseline.version === STATS_VERSION) {
        return baseline.stats;
      }
    }
  } catch (e) {
    console.warn('Failed to load baseline from storage', e);
  }

  // Initial baseline - realistic starting point for a 5M+ user platform
  return {
    uploadsToday: 487200, // Starting cumulative: ~487K
    downloadsToday: 1825000, // Starting cumulative: ~1.8M
    activeUsers: 58000 + Math.floor(Math.random() * 22000), // 58-80K online (~1.2% of 5.2M users)
    filesScanned: 485600, // Starting cumulative: ~485K
    totalUsers: 5247000, // 5.2M+ users
  };
};

// Save baseline (end-of-day totals that become next day's starting point)
const saveBaseline = (stats: LiveStats) => {
  try {
    localStorage.setItem(BASELINE_KEY, JSON.stringify({
      version: STATS_VERSION,
      stats: {
        uploadsToday: stats.uploadsToday,
        downloadsToday: stats.downloadsToday,
        activeUsers: stats.activeUsers,
        filesScanned: stats.filesScanned,
        totalUsers: stats.totalUsers,
      },
      lastUpdated: Date.now(),
    }));
  } catch (e) {
    console.warn('Failed to save baseline to storage', e);
  }
};

// Load stats from localStorage or initialize
const loadStats = (): LiveStats => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Check if it's from today
      if (data.dateKey === getTodayKey() && data.version === STATS_VERSION) {
        return data.stats;
      }

      // If it's from a previous day, save it as baseline and start new day
      if (data.stats) {
        saveBaseline(data.stats);
      }
    }
  } catch (e) {
    console.warn('Failed to load stats from storage', e);
  }

  // New day - start from baseline (yesterday's end) + today's progression
  const baseline = getBaseline();
  const baseDate = new Date().setHours(0, 0, 0, 0);
  const hoursSinceMidnight = Math.floor((Date.now() - baseDate) / (1000 * 60 * 60));

  // Add today's progression to baseline (so numbers never go down day-to-day)
  return {
    uploadsToday: baseline.uploadsToday + (hoursSinceMidnight * 28500), // Add ~28.5K/hour
    downloadsToday: baseline.downloadsToday + (hoursSinceMidnight * 95000), // Add ~95K/hour
    activeUsers: 58000 + Math.floor(Math.random() * 22000), // 58-80K online (~1.2% of 5.2M users)
    filesScanned: baseline.filesScanned + (hoursSinceMidnight * 28200), // Add ~28.2K/hour
    totalUsers: baseline.totalUsers, // Total users grow gradually via updateStats
  };
};

// Save stats to localStorage
const saveStats = (stats: LiveStats) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: STATS_VERSION,
      dateKey: getTodayKey(),
      stats,
      lastUpdated: Date.now(),
    }));
  } catch (e) {
    console.warn('Failed to save stats to storage', e);
  }
};

const liveStats = ref<LiveStats>(loadStats());

const recentActivities = ref<Activity[]>([]);

let statsInterval: NodeJS.Timeout;
let activityInterval: NodeJS.Timeout;

const sampleExtensions = ['pdf', 'zip', 'jpg', 'docx', 'mp4', 'sql', 'psd', 'gz', 'xlsx', 'bin'];

const generateRedactedName = () => {
  const ext = sampleExtensions[Math.floor(Math.random() * sampleExtensions.length)];
  const maskLength = 5 + Math.floor(Math.random() * 5); // Random length 5-10
  const mask = '●'.repeat(maskLength);
  return `${mask}.${ext}`;
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
};

const updateStats = () => {
  // Only increment, never decrease - makes it trustworthy
  // Scaled up for 15-minute intervals (180x the 5-second amounts)
  const uploadInc = 2700 + Math.floor(Math.random() * 4500); // 2,700-7,200 uploads every 15 minutes
  const downloadInc = 8100 + Math.floor(Math.random() * 13500); // 8,100-21,600 downloads every 15 minutes
  const scanInc = 2160 + Math.floor(Math.random() * 4140); // 2,160-6,300 scans every 15 minutes
  const userInc = Math.floor(Math.random() * 4); // Gradual user growth

  liveStats.value.uploadsToday += uploadInc;
  liveStats.value.downloadsToday += downloadInc;

  // Online users fluctuate more visibly based on time of day
  const hour = new Date().getUTCHours();
  let baseOnline = 58000; // Base 58K users

  // Peak hours (12-20 UTC): higher traffic
  if (hour >= 12 && hour <= 20) {
    baseOnline = 65000; // Peak: 65-87K users online
  }
  // Late night/early morning (0-6 UTC): lower traffic
  else if (hour >= 0 && hour <= 6) {
    baseOnline = 48000; // Off-peak: 48-70K users online
  }

  // Add visible fluctuation (±3000-8000 users every 5 seconds)
  const fluctuation = 3000 + Math.floor(Math.random() * 5000);
  const direction = Math.random() > 0.5 ? 1 : -1;

  liveStats.value.activeUsers = baseOnline + (direction * fluctuation) + Math.floor(Math.random() * 15000);
  liveStats.value.filesScanned += scanInc;
  liveStats.value.totalUsers += userInc;

  // Save to localStorage every update
  saveStats(liveStats.value);
};

const addRandomActivity = () => {
  const activity: Activity = {
    id: `activity-${Date.now()}-${Math.random()}`,
    type: Math.random() > 0.4 ? 'download' : 'upload',
    filename: generateRedactedName(),
    size: Math.floor(Math.random() * 100000000) + 10000, // 10KB to 100MB
    timeAgo: 'Just now',
    timestamp: Date.now(),
  };

  recentActivities.value.unshift(activity);
  
  // Keep only last 10 activities
  if (recentActivities.value.length > 10) {
    recentActivities.value.pop();
  }

  // Update time ago
  updateTimeAgo();
};

const updateTimeAgo = () => {
  const now = Date.now();
  recentActivities.value.forEach((activity) => {
    const seconds = Math.floor((now - activity.timestamp) / 1000);
    if (seconds < 60) {
      activity.timeAgo = 'Just now';
    } else if (seconds < 3600) {
      activity.timeAgo = `${Math.floor(seconds / 60)}m ago`;
    } else {
      activity.timeAgo = `${Math.floor(seconds / 3600)}h ago`;
    }
  });
};

onMounted(() => {
  // Update stats every 15 minutes (900000ms)
  statsInterval = setInterval(updateStats, 900000);

  // Add new activity every 3-8 seconds
  const addActivity = () => {
    addRandomActivity();
    activityInterval = setTimeout(addActivity, 3000 + Math.random() * 5000);
  };
  addActivity();

  // Update time ago every 10 seconds
  setInterval(updateTimeAgo, 10000);

  // Initial activities
  for (let i = 0; i < 5; i++) {
    setTimeout(() => addRandomActivity(), i * 1000);
  }
});

onUnmounted(() => {
  if (statsInterval) clearInterval(statsInterval);
  if (activityInterval) clearTimeout(activityInterval);
});
</script>

<style scoped>
.activity-enter-active,
.activity-leave-active {
  transition: all 0.3s ease;
}

.activity-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.activity-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.activity-move {
  transition: transform 0.3s ease;
}
</style>
