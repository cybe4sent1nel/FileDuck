/**
 * Local Storage Manager for Activity History (No Sign-In Required)
 * Stores user's upload and download history in browser localStorage + IndexedDB
 */

export interface UploadHistoryItem {
  id: string;
  shareCode: string;
  filename: string;
  size: number;
  uploadedAt: number;
  expiresAt: number;
  verificationCode: string;
  maxUses: number;
  usesLeft: number;
  downloadUrl?: string;
  githubReleaseId?: number; // For deletion
  githubMetadata?: any; // Chunk info, compression, etc.
  activityType?: 'upload' | 'download'; // Track activity type
  downloadedAt?: number; // Timestamp for downloads
}

const STORAGE_KEY = 'fileduck_upload_history';
const MAX_HISTORY_ITEMS = 50; // Keep last 50 uploads
const MAX_TTL_DAYS = 7; // Maximum 7 days
const DB_NAME = 'fileduck_db';
const DB_VERSION = 1;
const STORE_NAME = 'upload_history';

// Request persistent storage to prevent deletion on cache clear
export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage || !navigator.storage.persist) {
    return false;
  }

  try {
    // Check if already persisted
    if (await navigator.storage.persisted()) {
      return true;
    }

    // Request persistence (requires user interaction)
    const isPersisted = await navigator.storage.persist();
    if (isPersisted) {
      console.log('✓ Persistent storage granted - Upload history will be preserved');
    }
    return isPersisted;
  } catch (error) {
    // Silently fail - app works fine without persistent storage
    return false;
  }
}

// Don't auto-request on module load - wait for user interaction

// IndexedDB wrapper for persistent storage
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

// Save to IndexedDB for better persistence
async function saveToIndexedDB(history: UploadHistoryItem[]): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put(history, STORAGE_KEY);
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error('Failed to save to IndexedDB:', error);
  }
}

// Load from IndexedDB
async function loadFromIndexedDB(): Promise<UploadHistoryItem[] | null> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(STORAGE_KEY);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to load from IndexedDB:', error);
    return null;
  }
}

// Service worker registration is handled in main.ts

/**
 * Get all upload history from localStorage and IndexedDB
 */
export async function getUploadHistory(): Promise<UploadHistoryItem[]> {
  try {
    // Try IndexedDB first (more persistent)
    const indexedDBData = await loadFromIndexedDB();
    if (indexedDBData) {
      return indexedDBData.sort((a, b) => b.uploadedAt - a.uploadedAt);
    }
    
    // Fallback to localStorage
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const history: UploadHistoryItem[] = JSON.parse(data);
    
    // Migrate to IndexedDB
    if (history.length > 0) {
      await saveToIndexedDB(history);
    }
    
    // Keep all items (including expired or exhausted) to show badges in history
    return history.sort((a, b) => b.uploadedAt - a.uploadedAt);
  } catch (error) {
    console.error('Failed to get upload history:', error);
    return [];
  }
}

/**
 * Add new upload to history
 */
export async function addToUploadHistory(item: UploadHistoryItem): Promise<void> {
  try {
    const history = await getUploadHistory();

    // Mark as upload activity
    if (!item.activityType) {
      item.activityType = 'upload';
    }

    // Add new item at the beginning
    history.unshift(item);

    // Keep only MAX_HISTORY_ITEMS
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

    await saveUploadHistory(trimmedHistory);
  } catch (error) {
    console.error('Failed to add to upload history:', error);
  }
}

/**
 * Add new download to history
 */
export async function addToDownloadHistory(item: Partial<UploadHistoryItem>): Promise<void> {
  try {
    const history = await getUploadHistory();

    // Create download activity record
    const downloadItem: UploadHistoryItem = {
      id: item.id || `download-${Date.now()}`,
      shareCode: item.shareCode || '',
      filename: item.filename || 'Unknown',
      size: item.size || 0,
      uploadedAt: item.uploadedAt || Date.now(),
      expiresAt: item.expiresAt || 0,
      verificationCode: item.verificationCode || '',
      maxUses: item.maxUses || 0,
      usesLeft: item.usesLeft || 0,
      downloadUrl: item.downloadUrl,
      activityType: 'download',
      downloadedAt: Date.now(),
    };

    // Check if this download already exists in history (to avoid duplicates)
    const existingIndex = history.findIndex(h => h.shareCode === downloadItem.shareCode && h.activityType === 'download');
    if (existingIndex !== -1) {
      // Update existing download record
      history[existingIndex] = downloadItem;
    } else {
      // Add new download at the beginning
      history.unshift(downloadItem);
    }

    // Keep only MAX_HISTORY_ITEMS
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

    await saveUploadHistory(trimmedHistory);
  } catch (error) {
    console.error('Failed to add to download history:', error);
  }
}

/**
 * Update existing upload in history
 */
export async function updateUploadHistory(shareCode: string, updates: Partial<UploadHistoryItem>): Promise<void> {
  try {
    const history = await getUploadHistory();
    // Find the UPLOAD entry (not download) with matching shareCode
    const index = history.findIndex(item => item.shareCode === shareCode && (!item.activityType || item.activityType === 'upload'));

    if (index !== -1) {
      history[index] = { ...history[index], ...updates };
      await saveUploadHistory(history);
    }
  } catch (error) {
    console.error('Failed to update upload history:', error);
  }
}

/**
 * Remove upload from history
 */
export async function removeFromUploadHistory(shareCode: string): Promise<void> {
  try {
    const history = await getUploadHistory();
    const filtered = history.filter(item => item.shareCode !== shareCode);
    await saveUploadHistory(filtered);
  } catch (error) {
    console.error('Failed to remove from upload history:', error);
  }
}

/**
 * Clear all upload history
 */
export async function clearUploadHistory(): Promise<void> {
  try {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);

    // Clear IndexedDB
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(STORAGE_KEY);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error('Failed to clear upload history:', error);
  }
}

/**
 * Clear only upload records (keep downloads)
 */
export async function clearUploadsOnly(): Promise<void> {
  try {
    const history = await getUploadHistory();
    // Keep only downloads
    const downloadsOnly = history.filter(item => item.activityType === 'download');
    await saveUploadHistory(downloadsOnly);
  } catch (error) {
    console.error('Failed to clear uploads:', error);
  }
}

/**
 * Clear only download records (keep uploads)
 */
export async function clearDownloadsOnly(): Promise<void> {
  try {
    const history = await getUploadHistory();
    // Keep only uploads
    const uploadsOnly = history.filter(item => !item.activityType || item.activityType === 'upload');
    await saveUploadHistory(uploadsOnly);
  } catch (error) {
    console.error('Failed to clear downloads:', error);
  }
}

/**
 * Get time remaining for an upload
 */
export function getTimeRemaining(expiresAt: number): string {
  const now = Date.now();
  const remaining = expiresAt - now;
  
  if (remaining <= 0) return 'Expired';
  
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
}

/**
 * Get upload statistics
 */
export async function getUploadStats(): Promise<{
  totalUploads: number;
  activeUploads: number;
  totalSize: number;
  expiringSoon: number;
}> {
  const history = await getUploadHistory();
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  // Filter to only uploads for statistics
  const uploads = history.filter(item => !item.activityType || item.activityType === 'upload');

  return {
    totalUploads: uploads.length,
    activeUploads: uploads.filter(item => item.usesLeft > 0 && item.expiresAt > now).length,
    totalSize: uploads.reduce((sum, item) => sum + (item.size || 0), 0),
    expiringSoon: uploads.filter(item => item.usesLeft > 0 && item.expiresAt - now < oneHour && item.expiresAt > now).length,
  };
}

/**
 * Get download statistics
 */
export async function getDownloadStats(): Promise<{
  totalDownloads: number;
  totalSize: number;
}> {
  const history = await getUploadHistory();

  // Filter to only downloads
  const downloads = history.filter(item => item.activityType === 'download');

  return {
    totalDownloads: downloads.length,
    totalSize: downloads.reduce((sum, item) => sum + (item.size || 0), 0),
  };
}

// Private helper
async function saveUploadHistory(history: UploadHistoryItem[]): Promise<void> {
  // Save to localStorage (backward compatibility)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  
  // Save to IndexedDB (better persistence)
  await saveToIndexedDB(history);
  
  // Also save to service worker for persistence
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SAVE_UPLOAD_HISTORY',
      payload: history,
    });
  }
}

/**
 * Enforce maximum TTL of 7 days
 */
export function enforceMaxTTL(ttlHours: number): number {
  const maxHours = MAX_TTL_DAYS * 24;
  return Math.min(ttlHours, maxHours);
}

/**
 * Calculate expiration time with 7-day max
 */
export function calculateExpirationTime(ttlHours?: number): number {
  const hours = ttlHours || MAX_TTL_DAYS * 24; // Default to 7 days
  const enforcedHours = enforceMaxTTL(hours);
  return Date.now() + (enforcedHours * 60 * 60 * 1000);
}
