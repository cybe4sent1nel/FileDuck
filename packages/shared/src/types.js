"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = exports.ScanStatus = void 0;
var ScanStatus;
(function (ScanStatus) {
    ScanStatus["PENDING"] = "pending";
    ScanStatus["SCANNING"] = "scanning";
    ScanStatus["CLEAN"] = "clean";
    ScanStatus["INFECTED"] = "infected";
    ScanStatus["SKIPPED"] = "skipped";
    ScanStatus["ERROR"] = "error";
})(ScanStatus || (exports.ScanStatus = ScanStatus = {}));
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["INVALID_CODE"] = "INVALID_CODE";
    ErrorCode["EXPIRED"] = "EXPIRED";
    ErrorCode["NO_USES_LEFT"] = "NO_USES_LEFT";
    ErrorCode["RATE_LIMITED"] = "RATE_LIMITED";
    ErrorCode["CAPTCHA_REQUIRED"] = "CAPTCHA_REQUIRED";
    ErrorCode["SCAN_PENDING"] = "SCAN_PENDING";
    ErrorCode["MALWARE_DETECTED"] = "MALWARE_DETECTED";
    ErrorCode["INVALID_REQUEST"] = "INVALID_REQUEST";
    ErrorCode["SERVER_ERROR"] = "SERVER_ERROR";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
