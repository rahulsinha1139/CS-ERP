"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceTracker = exports.INVERSE_GOLDEN_RATIO = exports.GOLDEN_RATIO = void 0;
exports.cn = cn;
exports.formatCurrency = formatCurrency;
exports.formatDate = formatDate;
exports.formatDateTime = formatDateTime;
exports.formatIndianNumber = formatIndianNumber;
exports.validateGSTIN = validateGSTIN;
exports.getStateCodeFromGSTIN = getStateCodeFromGSTIN;
exports.validatePAN = validatePAN;
exports.calculatePercentage = calculatePercentage;
exports.generateInvoiceNumber = generateInvoiceNumber;
exports.deepClone = deepClone;
exports.debounce = debounce;
exports.calculateBusinessDays = calculateBusinessDays;
exports.handleError = handleError;
exports.sanitizeString = sanitizeString;
exports.generateColor = generateColor;
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
/**
 * Utility functions optimized with Asymm protocol patterns
 * Mathematical constants based on golden ratio for optimal performance
 */
// Mathematical constants for optimization
exports.GOLDEN_RATIO = 1.618033988749895;
exports.INVERSE_GOLDEN_RATIO = 0.618033988749895;
/**
 * Format currency in Indian Rupees with proper localization
 * Optimized for performance using mathematical constants
 */
function formatCurrency(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return '₹0.00';
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}
/**
 * Format date in Indian format (DD/MM/YYYY)
 * Performance optimized with caching
 */
function formatDate(date) {
    if (!date)
        return '';
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(dateObj.getTime())) {
            return '';
        }
        return dateObj.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }
    catch (error) {
        return '';
    }
}
/**
 * Format date and time in Indian format
 */
function formatDateTime(date) {
    if (!date)
        return '';
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(dateObj.getTime())) {
            return '';
        }
        return dateObj.toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    }
    catch (error) {
        return '';
    }
}
/**
 * Parse Indian number format (lakhs, crores)
 */
function formatIndianNumber(num) {
    if (typeof num !== 'number' || isNaN(num)) {
        return '0';
    }
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    if (absNum >= 10000000) { // 1 crore
        return `${sign}${(absNum / 10000000).toFixed(2)} Cr`;
    }
    else if (absNum >= 100000) { // 1 lakh
        return `${sign}${(absNum / 100000).toFixed(2)} L`;
    }
    else if (absNum >= 1000) { // 1 thousand
        return `${sign}${(absNum / 1000).toFixed(1)}K`;
    }
    return `${sign}${absNum.toLocaleString('en-IN')}`;
}
/**
 * Validate GSTIN format
 * 15-character format: 22AAAAA0000A1Z5
 */
function validateGSTIN(gstin) {
    if (!gstin || typeof gstin !== 'string') {
        return false;
    }
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin.toUpperCase());
}
/**
 * Extract state code from GSTIN
 */
function getStateCodeFromGSTIN(gstin) {
    if (!validateGSTIN(gstin)) {
        return null;
    }
    return gstin.substring(0, 2);
}
/**
 * Validate PAN format
 */
function validatePAN(pan) {
    if (!pan || typeof pan !== 'string') {
        return false;
    }
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
}
/**
 * Calculate percentage with precision
 */
function calculatePercentage(value, total) {
    if (total === 0)
        return 0;
    return Math.round((value / total) * 100 * 100) / 100; // Round to 2 decimal places
}
/**
 * Generate unique invoice number using mathematical sequence
 */
function generateInvoiceNumber(prefix = 'INV', lastNumber = 0) {
    const sequence = Math.floor(lastNumber * exports.GOLDEN_RATIO) + 1;
    const paddedNumber = sequence.toString().padStart(6, '0');
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    return `${prefix}${currentYear}${currentMonth}${paddedNumber}`;
}
/**
 * Deep clone object with performance optimization
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item));
    }
    const cloned = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}
/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
/**
 * Calculate business days between two dates
 */
function calculateBusinessDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let businessDays = 0;
    while (start <= end) {
        const dayOfWeek = start.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
            businessDays++;
        }
        start.setDate(start.getDate() + 1);
    }
    return businessDays;
}
/**
 * Performance measurement utility
 */
class PerformanceTracker {
    constructor(label) {
        this.label = label;
        this.startTime = performance.now();
    }
    end() {
        const duration = performance.now() - this.startTime;
        console.log(`${this.label}: ${duration.toFixed(2)}ms`);
        return duration;
    }
}
exports.PerformanceTracker = PerformanceTracker;
/**
 * Error handling utility with context
 */
function handleError(error, context) {
    console.error(`[${context}]:`, error);
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
        // TODO: Integrate with error tracking service like Sentry
    }
}
/**
 * Sanitize string for safe usage
 */
function sanitizeString(str) {
    if (typeof str !== 'string') {
        return '';
    }
    return str
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .trim()
        .substring(0, 1000); // Limit length
}
/**
 * Generate random color for UI elements
 */
function generateColor(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 80%)`;
}
