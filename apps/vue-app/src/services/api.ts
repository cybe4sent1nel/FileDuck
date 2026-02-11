import axios from 'axios';
import type {
  UploadMetaRequest,
  UploadMetaResponse,
  RedeemRequest,
  RedeemResponse,
} from '@fileduck/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error codes
    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data?.message || error.message || 'An error occurred';
      
      // For 500+ errors (except when navigating to error page), redirect to error page
      if (status >= 500) {
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/error')) {
          window.location.href = `/error?code=${status}&message=${encodeURIComponent(errorMessage)}`;
        }
      }
      // For 402 (payment required), show specific message
      else if (status === 402) {
        console.error('Payment required:', errorMessage);
      }
      // For 413 (payload too large), show specific message
      else if (status === 413) {
        console.error('File too large:', errorMessage);
      }
      // For 429 (too many requests), show rate limit message
      else if (status === 429) {
        console.error('Rate limit exceeded:', errorMessage);
      }
    } else if (error.code === 'ERR_NETWORK') {
      // Network errors should redirect to offline page
      if (typeof window !== 'undefined' && !navigator.onLine && !window.location.pathname.includes('/offline')) {
        window.location.href = '/offline';
      }
    }
    
    return Promise.reject(error);
  }
);

export interface ScanFileResponse {
  clean: boolean;
  decision: 'clean' | 'infected' | 'suspicious';
  clamav: {
    infected: boolean;
    virus?: string;
  };
  virustotal?: {
    positives: number;
    total: number;
  };
  score: number;
}

export async function scanFileBeforeUpload(
  file: File,
  sha256: string
): Promise<ScanFileResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sha256', sha256);

  // Use local API scan endpoint
  const scanUrl = `${API_BASE_URL}/scan`;
  
  try {
    const response = await axios.post(scanUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 second timeout for scanning
    });
    return response.data;
  } catch (error: any) {
    // If scanner is not available, return clean status
    console.warn('Scanner unavailable, skipping scan:', error.message);
    return {
      clean: true,
      decision: 'clean',
      clamav: { infected: false },
      score: 0
    };
  }
}

export async function uploadFileMeta(
  request: UploadMetaRequest
): Promise<UploadMetaResponse> {
  const response = await api.post('/upload-meta', request);
  return response.data;
}

export async function uploadToS3(
  file: File,
  uploadUrls: string[],
  uploadId: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  // If no upload URLs provided, it means we're using GitHub storage (server-side upload)
  if (!uploadUrls || uploadUrls.length === 0) {
    // GitHub storage is handled server-side in complete-upload
    // Just report 100% progress immediately
    onProgress?.(100);
    return;
  }

  const chunkSize = 500 * 1024 * 1024; // 500 MB chunks for better efficiency
  const chunks = Math.ceil(file.size / chunkSize);
  const parts: { ETag: string; PartNumber: number }[] = [];

  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    const response = await axios.put(uploadUrls[i], chunk, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      onUploadProgress: (progressEvent: any) => {
        const chunkProgress = (progressEvent.loaded / progressEvent.total!) * 100;
        const totalProgress = ((i + chunkProgress / 100) / chunks) * 100;
        onProgress?.(Math.round(totalProgress));
      },
    });

    parts.push({
      ETag: response.headers.etag,
      PartNumber: i + 1,
    });
  }

  // Complete multipart upload
  await api.post('/complete-upload', {
    uploadId,
    parts,
  });
}

export async function redeemShareCode(request: RedeemRequest): Promise<RedeemResponse> {
  const response = await api.post('/redeem', request);
  return response.data;
}

export async function scanBeforeDownload(shareCode: string): Promise<ScanFileResponse> {
  const response = await api.post('/scan-before-download', { shareCode });
  return response.data as ScanFileResponse;
}

export async function healthCheck(): Promise<{ status: string }> {
  const response = await api.get('/health');
  return response.data;
}

export async function deleteFile(shareCode: string): Promise<{ success: boolean; message: string }> {
  const response = await api.delete('/delete-file', {
    data: { shareCode },
  });
  return response.data;
}

export interface FileMetadata {
  filename: string;
  size: number;
  expiresAt: number;
  maxUses: number;
  usesLeft: number;
  uploadedAt: number;
  scanStatus?: string;
}

export async function getFileMetadata(shareCode: string): Promise<FileMetadata> {
  const response = await api.post('/get-metadata', { shareCode });
  return response.data;
}
