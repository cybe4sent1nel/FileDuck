/**
 * Resumable Upload State Manager
 * Tracks upload progress for large files to support pause/resume
 */

export interface UploadChunkState {
  chunkIndex: number;
  uploaded: boolean;
  etag?: string;
}

export interface ResumableUploadState {
  shareCode: string;
  filename: string;
  fileSize: number;
  sha256: string;
  totalChunks: number;
  uploadedChunks: UploadChunkState[];
  uploadProgress: number;
  lastUpdate: number;
  isPaused: boolean;
  uploadType: 'github' | 's3';
}

const STORAGE_KEY = 'fileduck_resumable_uploads';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Get all resumable upload states
 */
export function getResumableUploads(): Map<string, ResumableUploadState> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return new Map();

    const states: Record<string, ResumableUploadState> = JSON.parse(data);

    // Clean up old uploads (>7 days)
    const now = Date.now();
    const filtered: Record<string, ResumableUploadState> = {};

    for (const [key, state] of Object.entries(states)) {
      if (now - state.lastUpdate < MAX_AGE_MS) {
        filtered[key] = state;
      }
    }

    return new Map(Object.entries(filtered));
  } catch (error) {
    console.error('Failed to get resumable uploads:', error);
    return new Map();
  }
}

/**
 * Save resumable upload state
 */
export function saveResumableUploadState(fileHash: string, state: ResumableUploadState): void {
  try {
    const states = getResumableUploads();
    states.set(fileHash, {
      ...state,
      lastUpdate: Date.now(),
    });

    const obj = Object.fromEntries(states.entries());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (error) {
    console.error('Failed to save resumable upload state:', error);
  }
}

/**
 * Get resumable upload state for a specific file
 */
export function getResumableUploadState(fileHash: string): ResumableUploadState | null {
  const states = getResumableUploads();
  return states.get(fileHash) || null;
}

/**
 * Delete resumable upload state (after completion or cancellation)
 */
export function deleteResumableUploadState(fileHash: string): void {
  try {
    const states = getResumableUploads();
    states.delete(fileHash);

    const obj = Object.fromEntries(states.entries());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (error) {
    console.error('Failed to delete resumable upload state:', error);
  }
}

/**
 * Mark a chunk as uploaded
 */
export function markChunkUploaded(fileHash: string, chunkIndex: number, etag?: string): void {
  const state = getResumableUploadState(fileHash);
  if (!state) return;

  state.uploadedChunks[chunkIndex] = {
    chunkIndex,
    uploaded: true,
    etag,
  };

  // Calculate progress
  const uploadedCount = state.uploadedChunks.filter(c => c.uploaded).length;
  state.uploadProgress = Math.floor((uploadedCount / state.totalChunks) * 100);

  saveResumableUploadState(fileHash, state);
}

/**
 * Check if a chunk has been uploaded
 */
export function isChunkUploaded(fileHash: string, chunkIndex: number): boolean {
  const state = getResumableUploadState(fileHash);
  if (!state) return false;

  return state.uploadedChunks[chunkIndex]?.uploaded || false;
}

/**
 * Get upload progress percentage
 */
export function getUploadProgress(fileHash: string): number {
  const state = getResumableUploadState(fileHash);
  if (!state) return 0;

  return state.uploadProgress;
}

/**
 * Set upload as paused
 */
export function setUploadPaused(fileHash: string, paused: boolean): void {
  const state = getResumableUploadState(fileHash);
  if (!state) return;

  state.isPaused = paused;
  saveResumableUploadState(fileHash, state);
}
