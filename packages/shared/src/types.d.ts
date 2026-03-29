export interface FileMetadata {
    id: string;
    shareCode: string;
    filename: string;
    size: number;
    sha256: string;
    mimeType: string;
    uploadedAt: number;
    expiresAt: number;
    usesLeft: number;
    maxUses: number;
    s3Key: string;
    scanStatus: ScanStatus;
    scanResults?: ScanResults;
    encrypted: boolean;
    scanSkipped?: boolean;
}
export declare enum ScanStatus {
    PENDING = "pending",
    SCANNING = "scanning",
    CLEAN = "clean",
    INFECTED = "infected",
    SKIPPED = "skipped",
    ERROR = "error"
}
export interface ScanResults {
    clamav: {
        infected: boolean;
        virus?: string;
        scannedAt: number;
    };
    virustotal?: {
        score: number;
        positives: number;
        scannedAt: number;
        permalink?: string;
    };
}
export interface UploadMetaRequest {
    filename: string;
    size: number;
    sha256: string;
    mimeType: string;
    ttlHours?: number;
    maxUses?: number;
    encrypted?: boolean;
    scanSkipped?: boolean;
}
export interface UploadMetaResponse {
    shareCode: string;
    uploadUrls: string[];
    uploadId: string;
    expiresAt: number;
}
export interface RedeemRequest {
    shareCode: string;
    captchaToken?: string;
}
export interface RedeemResponse {
    downloadUrl: string;
    filename: string;
    size: number;
    sha256: string;
    mimeType: string;
    usesLeft: number;
    expiresAt: number;
    isQuarantined?: boolean;
    scanSkipped?: boolean;
}
export interface ErrorResponse {
    error: string;
    code: ErrorCode;
    details?: any;
}
export declare enum ErrorCode {
    INVALID_CODE = "INVALID_CODE",
    EXPIRED = "EXPIRED",
    NO_USES_LEFT = "NO_USES_LEFT",
    RATE_LIMITED = "RATE_LIMITED",
    CAPTCHA_REQUIRED = "CAPTCHA_REQUIRED",
    SCAN_PENDING = "SCAN_PENDING",
    MALWARE_DETECTED = "MALWARE_DETECTED",
    INVALID_REQUEST = "INVALID_REQUEST",
    SERVER_ERROR = "SERVER_ERROR"
}
export interface RateLimitInfo {
    ip: string;
    requests: number;
    resetAt: number;
    captchaRequired: boolean;
}

