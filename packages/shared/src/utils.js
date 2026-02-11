"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTANTS = void 0;
exports.generateShareCode = generateShareCode;
exports.validateShareCode = validateShareCode;
exports.computeSHA256 = computeSHA256;
exports.formatFileSize = formatFileSize;
exports.formatTimeRemaining = formatTimeRemaining;
exports.sanitizeFilename = sanitizeFilename;
exports.isValidMimeType = isValidMimeType;
exports.getFileExtension = getFileExtension;
const nanoid_1 = require("nanoid");
// Base62 alphabet (a-zA-Z0-9)
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
// Generate 8-10 character code = 47-59 bits entropy
const nanoid = (0, nanoid_1.customAlphabet)(BASE62, 10);
function generateShareCode() {
    return nanoid();
}
function validateShareCode(code) {
    // Must be 8-10 base62 characters
    return /^[0-9A-Za-z]{8,10}$/.test(code);
}
// Browser-only function - used in Vue app
function computeSHA256(file) {
    return new Promise((resolve, reject) => {
        if (typeof globalThis.window === 'undefined') {
            reject(new Error('computeSHA256 can only be used in browser environment'));
            return;
        }
        const reader = new globalThis.FileReader();
        reader.onload = async (e) => {
            try {
                const buffer = e.target?.result;
                const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
                resolve(hashHex);
            }
            catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}
function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
}
function formatTimeRemaining(expiresAt) {
    const remaining = expiresAt - Date.now();
    if (remaining <= 0)
        return 'Expired';
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0)
        return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}
function sanitizeFilename(filename) {
    // Remove potentially dangerous characters
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 255);
}
function isValidMimeType(mimeType) {
    // Basic MIME type validation
    return /^[a-z]+\/[a-z0-9\-\+\.]+$/i.test(mimeType);
}
function getFileExtension(filename) {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
}
exports.CONSTANTS = {
    MIN_CODE_LENGTH: 8,
    MAX_CODE_LENGTH: 10,
    MIN_ENTROPY_BITS: 40,
    MAX_FILE_SIZE: 5 * 1024 * 1024 * 1024, // 5 GB
    DEFAULT_TTL_HOURS: 24,
    DEFAULT_MAX_USES: 1,
    MULTIPART_CHUNK_SIZE: 100 * 1024 * 1024, // 100 MB
    SIGNED_URL_EXPIRY: 3600, // 1 hour
    RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
    RATE_LIMIT_MAX: 10,
    CAPTCHA_THRESHOLD: 3, // Failed attempts before CAPTCHA
};
