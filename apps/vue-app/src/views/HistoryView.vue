<template>
  <div class="min-h-screen bg-gradient-to-br from-cream via-white to-lemon-50 py-12 px-4">
    <div class="container mx-auto max-w-6xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
          <ActivityIcon class="w-12 h-12 text-purple-600" />
          <span class="text-indigo-950 font-display tracking-tight">My Activity</span>
        </h1>
        <p class="text-xl text-gray-600">
          Track your uploads and downloads - No sign-in required!
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid md:grid-cols-5 gap-4 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
          <div class="text-3xl font-bold text-purple-600">{{ stats.totalUploads }}</div>
          <div class="text-sm text-gray-600 mt-1">Total Uploads</div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-lg border border-green-100">
          <div class="text-3xl font-bold text-green-600">{{ stats.activeUploads }}</div>
          <div class="text-sm text-gray-600 mt-1">Active Files</div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <div class="text-3xl font-bold text-blue-600">{{ formatSize(stats.totalSize) }}</div>
          <div class="text-sm text-gray-600 mt-1">Uploaded Size</div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
          <div class="text-3xl font-bold text-orange-600">{{ stats.expiringSoon }}</div>
          <div class="text-sm text-gray-600 mt-1">Expiring Soon</div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-lg border border-teal-100">
          <div class="text-3xl font-bold text-teal-600">{{ downloadStats.totalDownloads }}</div>
          <div class="text-sm text-gray-600 mt-1">Total Downloads</div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="uploads.length === 0 && downloads.length === 0" class="text-center py-20">
        <Vue3Lottie
          :animationData="EmptyAnimation"
          :height="200"
          :width="200"
          :loop="true"
          class="mx-auto"
        />
        <p class="text-xl text-gray-600 mt-4">No activity yet</p>
        <router-link to="/" class="inline-block mt-4 px-6 py-3 bg-purple-400 text-white rounded-lg hover:bg-purple-500">
          Upload Your First File
        </router-link>
      </div>

      <!-- Activity Sections -->
      <div v-else class="space-y-8">
        <!-- Uploads Section -->
        <div v-if="uploads.length > 0" class="bg-white rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden">
          <div class="bg-gradient-to-r from-purple-500 to-purple-400 p-6 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <UploadIcon class="w-8 h-8 text-white" />
              <div>
                <h2 class="text-2xl font-bold text-white">My Uploads</h2>
                <p class="text-purple-100 text-sm">{{ uploads.length }} file{{ uploads.length !== 1 ? 's' : '' }} uploaded</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                type="button"
                @click="syncUploadMetadata"
                :disabled="isSyncing"
                class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh status from server"
              >
                <RefreshCwIcon class="w-4 h-4" :class="{ 'animate-spin': isSyncing }" />
                <span>{{ isSyncing ? 'Syncing...' : 'Refresh' }}</span>
              </button>
              <button
                type="button"
                @click="confirmClearUploads"
                class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Trash2Icon class="w-4 h-4" />
                <span>Clear Uploads</span>
              </button>
            </div>
          </div>

          <!-- Important Notice -->
          <div class="bg-yellow-50 border-b-2 border-yellow-300 p-4">
            <p class="text-sm text-gray-700 flex items-center">
              <svg class="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <strong class="mr-1">Important:</strong>
              Deleting from history will permanently remove the file from our storage and make it inaccessible to anyone with the share code.
            </p>
          </div>

          <div class="p-6 space-y-4">
            <div
              v-for="item in uploads"
              :key="item.shareCode"
              class="bg-gradient-to-r from-purple-50 to-white rounded-xl p-6 shadow-md border border-purple-100 hover:shadow-lg transition-all relative"
            >
              <!-- Expired/Limit Badges -->
              <div v-if="isExpiredItem(item)" class="absolute top-0 right-0">
                <!-- Show EXPIRED if time ran out (takes priority) -->
                <span v-if="isExpiredByTime(item.expiresAt)" class="bg-red-500 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl font-bold text-sm shadow-lg flex items-center gap-2">
                  <img src="/expired-svgrepo-com.svg" alt="Expired" class="w-4 h-4 inline-block" />
                  EXPIRED
                </span>
                <!-- Show LIMIT REACHED only if time hasn't expired yet but downloads hit zero -->
                <span v-else-if="isExpiredByUses(item)" class="bg-orange-500 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl font-bold text-sm shadow-lg flex items-center gap-2">
                  <img src="/perimeter-limit-svgrepo-com.svg" alt="Limit" class="w-4 h-4 inline-block" />
                  LIMIT REACHED
                </span>
              </div>

              <div class="flex items-center justify-between">
                <!-- File Info -->
                <div class="flex items-center space-x-4 flex-1">
                  <div class="bg-purple-100 rounded-lg p-3">
                    <FileIcon class="w-8 h-8 text-purple-500" />
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-lg text-gray-800">{{ item.filename }}</h3>
                    <div class="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>{{ formatSize(item.size) }}</span>
                      <span>•</span>
                      <span>{{ formatDateTime12Hour(item.uploadedAt) }}</span>
                      <span>•</span>
                      <span :class="getExpiryClass(item)" class="flex items-center space-x-1">
                        <ClockLoader v-if="!isExpiredItem(item)" />
                        <span>{{ getLiveTimeRemaining(item) }}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center space-x-3">
                  <button
                    @click="copyShareCode(item.shareCode)"
                    class="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 flex items-center space-x-2"
                  >
                    <CopyIcon class="w-4 h-4" />
                    <span>Copy Code</span>
                  </button>
                  <button
                    @click="deleteUpload(item.shareCode)"
                    class="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    <Trash2Icon class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Extended Info -->
              <div class="mt-4 pt-4 border-t border-gray-200 grid md:grid-cols-3 gap-4">
                <div>
                  <div class="text-xs text-gray-500 mb-1">Share Code</div>
                  <div class="font-mono font-bold text-purple-600">{{ item.shareCode }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 mb-1">Verification Code</div>
                  <div class="font-mono font-bold text-green-600">{{ item.verificationCode }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 mb-1">Uses Remaining</div>
                  <div class="font-bold" :class="item.usesLeft <= 0 ? 'text-red-600' : 'text-gray-800'">
                    {{ Math.max(0, item.usesLeft) }} / {{ item.maxUses }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Downloads Section -->
        <div v-if="downloads.length > 0" class="bg-white rounded-2xl shadow-xl border-2 border-teal-200 overflow-hidden">
          <div class="bg-gradient-to-r from-teal-500 to-teal-400 p-6 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <DownloadIcon class="w-8 h-8 text-white" />
              <div>
                <h2 class="text-2xl font-bold text-white">My Downloads</h2>
                <p class="text-teal-100 text-sm">{{ downloads.length }} file{{ downloads.length !== 1 ? 's' : '' }} downloaded</p>
              </div>
            </div>
            <button
              @click="confirmClearDownloads"
              class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <Trash2Icon class="w-4 h-4" />
              <span>Clear Downloads</span>
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div
              v-for="item in downloads"
              :key="item.shareCode + '-download'"
              class="bg-gradient-to-r from-teal-50 to-white rounded-xl p-6 shadow-md border border-teal-100 hover:shadow-lg transition-all relative"
            >
              <div class="flex items-center justify-between">
                <!-- File Info -->
                <div class="flex items-center space-x-4 flex-1">
                  <div class="bg-teal-100 rounded-lg p-3">
                    <FileIcon class="w-8 h-8 text-teal-500" />
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-lg text-gray-800">{{ item.filename }}</h3>
                    <div class="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>{{ formatSize(item.size) }}</span>
                      <span>•</span>
                      <span>Downloaded {{ formatDate(item.downloadedAt || item.uploadedAt) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Extended Info -->
              <div class="mt-4 pt-4 border-t border-gray-200 grid md:grid-cols-2 gap-4">
                <div>
                  <div class="text-xs text-gray-500 mb-1">Share Code</div>
                  <div class="font-mono font-bold text-teal-600">{{ item.shareCode }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 mb-1">Downloaded At</div>
                  <div class="font-bold text-gray-800">{{ formatDateTime12Hour(item.downloadedAt || item.uploadedAt) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Clear All Button -->
        <div class="text-center">
          <button
            @click="confirmClearAllHistory"
            class="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Clear All Activity History
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useNotifications } from '../composables/useNotifications';
import { Vue3Lottie } from 'vue3-lottie';
import { FileIcon, CopyIcon, Trash2Icon, UploadIcon, DownloadIcon, ActivityIcon, RefreshCwIcon } from 'lucide-vue-next';
import ClockLoader from '../components/ClockLoader.vue';
import {
  getUploadHistory,
  getUploadStats,
  getDownloadStats,
  removeFromUploadHistory,
  clearUploadHistory,
  clearUploadsOnly,
  clearDownloadsOnly,
  updateUploadHistory,
  requestPersistentStorage,
  type UploadHistoryItem,
} from '../services/uploadHistory';
import { deleteFile, getFileMetadata } from '../services/api';
import { formatFileSize } from '@fileduck/shared';
import FileStorageAnimation from '../../../../animations/File storage.json';

const EmptyAnimation = FileStorageAnimation;
const { success, confirm } = useNotifications();

const history = ref<UploadHistoryItem[]>([]);
const isSyncing = ref(false);
const stats = ref({
  totalUploads: 0,
  activeUploads: 0,
  totalSize: 0,
  expiringSoon: 0,
});
const downloadStats = ref({
  totalDownloads: 0,
  totalSize: 0,
});

// Computed properties for filtered lists
const uploads = computed(() => history.value.filter(item => !item.activityType || item.activityType === 'upload'));
const downloads = computed(() => history.value.filter(item => item.activityType === 'download'));

let countdownInterval: NodeJS.Timeout;
let syncInterval: NodeJS.Timeout;

onMounted(async () => {
  await loadHistory();
  await syncUploadMetadata();

  // Prompt for persistent storage (show in console and try to request permission)
  requestPersistentStorage().then(granted => {
    if (granted) console.log('✓ Persistent storage granted for history');
    else console.log('ℹ️ Persistent storage not available - history may be evicted by browser');
  }).catch(() => {});

  // Update countdown every second
  countdownInterval = setInterval(() => {
    // Force reactivity update for live countdown
    history.value = [...history.value];
  }, 1000);

  // Sync metadata from server every 10 seconds to update badges
  syncInterval = setInterval(() => {
    syncUploadMetadata();
  }, 10000);

  // Sync when page becomes visible (user returns to tab)
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  if (syncInterval) {
    clearInterval(syncInterval);
  }
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});

function handleVisibilityChange() {
  if (!document.hidden) {
    // Page became visible - sync immediately
    syncUploadMetadata();
  }
}

async function loadHistory() {
  history.value = await getUploadHistory();
  stats.value = await getUploadStats();
  downloadStats.value = await getDownloadStats();
}

// Sync upload metadata from server to get updated usesLeft
async function syncUploadMetadata() {
  if (isSyncing.value) return; // Prevent concurrent syncs

  isSyncing.value = true;
  const uploadItems = uploads.value;

  console.log(`🔄 Syncing ${uploadItems.length} upload(s)...`);

  // Collect all updates first
  const updatePromises: Promise<void>[] = [];

  // Sync ALL uploads to ensure badges show correctly
  // Don't filter by expiration - we need to sync even expired files
  for (const item of uploadItems) {
    const updatePromise = (async () => {
      try {
        const metadata = await getFileMetadata(item.shareCode);

        console.log(`✓ Synced ${item.shareCode}: usesLeft=${metadata.usesLeft}, maxUses=${metadata.maxUses}, expires=${new Date(metadata.expiresAt).toLocaleString()}`);

        // Update local storage with server data
        await updateUploadHistory(item.shareCode, {
          usesLeft: metadata.usesLeft,
          expiresAt: metadata.expiresAt,
          maxUses: metadata.maxUses,
        });
      } catch (error: any) {
        // If file not found (404), it means it was deleted or expired on server
        if (error.response?.status === 404) {
          console.log(`⚠️ File ${item.shareCode} not found on server - marking as expired`);

          // Mark as expired in local storage
          await updateUploadHistory(item.shareCode, {
            usesLeft: 0,
          });
        } else {
          // Silently fail for other errors (like network issues)
          console.log(`⚠️ Sync skipped for ${item.shareCode}:`, error.message);
        }
      }
    })();

    updatePromises.push(updatePromise);
  }

  // Wait for ALL updates to complete before reloading
  await Promise.all(updatePromises);

  // Additional delay to ensure IndexedDB writes complete
  await new Promise(resolve => setTimeout(resolve, 150));

  // Reload history after sync to update UI
  await loadHistory();
  console.log(`✓ History reloaded, checking badge status...`);

  // Log badge status for debugging
  uploads.value.forEach(item => {
    const expired = isExpiredItem(item);
    const byTime = isExpiredByTime(item.expiresAt);
    const byUses = isExpiredByUses(item);
    console.log(`📊 ${item.shareCode}: expired=${expired}, byTime=${byTime}, byUses=${byUses}, usesLeft=${item.usesLeft}`);
  });

  isSyncing.value = false;

  // Force reactivity update
  history.value = [...history.value];
}

function formatSize(bytes: number): string {
  return formatFileSize(bytes);
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString();
}

function formatDateTime12Hour(timestamp: number): string {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  return date.toLocaleString('en-US', options);
}

function isExpiredByTime(expiresAt: number): boolean {
  return expiresAt <= Date.now();
}

function isExpiredByUses(item: UploadHistoryItem): boolean {
  return item.usesLeft <= 0;
}

function isExpiredItem(item: UploadHistoryItem): boolean {
  return isExpiredByTime(item.expiresAt) || isExpiredByUses(item);
}

function getExpiryBadgeText(item: UploadHistoryItem): string {
  if (isExpiredByUses(item) && isExpiredByTime(item.expiresAt)) return 'EXPIRED';
  if (isExpiredByUses(item)) return 'LIMIT REACHED';
  return 'EXPIRED';
}

function getLiveTimeRemaining(item: UploadHistoryItem): string {
  if (isExpiredByUses(item)) return 'Limit reached';

  const now = Date.now();
  const remaining = item.expiresAt - now;

  if (remaining <= 0) return 'Expired';

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function getExpiryClass(item: UploadHistoryItem): string {
  if (isExpiredByUses(item)) return 'text-gray-400 line-through';

  const remaining = item.expiresAt - Date.now();
  const oneHour = 60 * 60 * 1000;

  if (remaining <= 0) return 'text-gray-400 line-through';
  if (remaining < oneHour) return 'text-red-600 font-bold';
  if (remaining < 24 * oneHour) return 'text-orange-600';
  return 'text-green-600';
}

function copyShareCode(shareCode: string) {
  navigator.clipboard.writeText(shareCode);
  success(`✓ Share code ${shareCode} copied to clipboard!`);
}

async function deleteUpload(shareCode: string) {
  const confirmed = await confirm('⚠️ This will PERMANENTLY delete the file from storage and make it inaccessible to anyone with the share code. Continue?');
  if (confirmed) {
    try {
      // Delete from backend storage (GitHub/S3) and Redis
      await deleteFile(shareCode);

      // Remove from local history
      await removeFromUploadHistory(shareCode);
      await loadHistory();
      success('✓ File permanently deleted from storage and history');
    } catch (error: any) {
      console.error('Delete failed:', error);
      // Even if backend deletion fails, remove from local history
      await removeFromUploadHistory(shareCode);
      await loadHistory();

      if (error.response?.status === 404) {
        success('✓ File already deleted or expired');
      } else {
        success('⚠️ Removed from history (backend deletion may have failed)');
      }
    }
  }
}

async function confirmClearUploads() {
  if (uploads.value.length === 0) {
    success('No uploads to clear');
    return;
  }

  const confirmed = await confirm(`⚠️ Clear all ${uploads.value.length} upload record${uploads.value.length !== 1 ? 's' : ''}? This will remove them from your local browser history. This cannot be undone.`);
  if (!confirmed) return;

  // Ask whether to also delete files from remote storage
  const deleteRemote = await confirm('Also delete these files from remote storage (this will PERMANENTLY remove them and cannot be undone)?');

  if (deleteRemote) {
    // Attempt to delete each upload from backend storage
    for (const item of uploads.value) {
      try {
        // Only attempt deletion if we have a share code
        if (item.shareCode) {
          await deleteFile(item.shareCode).catch(() => null);
        }
      } catch (e) {
        // ignore individual failures
      }
    }
    success('✓ Attempted to delete uploads from remote storage (some may have already been removed)');
  }

  // Clear uploads from local history
  await clearUploadsOnly();
  await loadHistory();
  success('✓ Upload history cleared locally');
}


async function confirmClearDownloads() {
  const confirmed = await confirm(`⚠️ Clear all ${downloads.value.length} download record${downloads.value.length !== 1 ? 's' : ''}? This will not delete files from storage, only remove them from your local browser history. Uploads will be kept. This cannot be undone.`);
  if (confirmed) {
    await clearDownloadsOnly();
    await loadHistory();
    success('✓ Download history cleared');
  }
}

async function confirmClearAllHistory() {
  const confirmed = await confirm('⚠️ Clear ALL activity history (uploads and downloads)? This will not delete files from storage, only remove them from your local browser history. This cannot be undone.');
  if (confirmed) {
    await clearUploadHistory();
    await loadHistory();
    success('✓ All activity history cleared');
  }
}
</script>

