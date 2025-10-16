"use strict";
/**
 * Custom Fields Type System
 * Dynamic field definitions for specialized CS services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_VALIDATORS = exports.VALIDATION_MESSAGES = exports.FIELD_PATTERNS = void 0;
exports.validateCustomFields = validateCustomFields;
exports.groupFieldsByCategory = groupFieldsByCategory;
exports.formatCustomFieldValue = formatCustomFieldValue;
exports.getEmptyCustomFieldData = getEmptyCustomFieldData;
// Common field patterns for CS services
exports.FIELD_PATTERNS = {
    // Corporate Identification Number (21 chars)
    CIN: /^[A-Z]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/,
    // Director Identification Number (8 digits)
    DIN: /^\d{8}$/,
    // Permanent Account Number (10 chars)
    PAN: /^[A-Z]{5}\d{4}[A-Z]$/,
    // GSTIN (15 chars)
    GSTIN: /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$/,
    // Service Request Number (SRN) - varies, typically alphanumeric
    SRN: /^[A-Z0-9]{10,20}$/,
    // Mobile number (10 digits)
    MOBILE: /^[6-9]\d{9}$/,
    // Email
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    // Postal PIN code (6 digits)
    PINCODE: /^\d{6}$/,
    // Aadhaar number (12 digits)
    AADHAAR: /^\d{12}$/,
};
// Helper validation messages
exports.VALIDATION_MESSAGES = {
    REQUIRED: 'This field is required',
    INVALID_CIN: 'Invalid CIN format (e.g., U12345KA2020PTC123456)',
    INVALID_DIN: 'Invalid DIN format (8 digits)',
    INVALID_PAN: 'Invalid PAN format (e.g., ABCDE1234F)',
    INVALID_GSTIN: 'Invalid GSTIN format',
    INVALID_SRN: 'Invalid SRN format',
    INVALID_MOBILE: 'Invalid mobile number',
    INVALID_EMAIL: 'Invalid email address',
    INVALID_PINCODE: 'Invalid PIN code (6 digits)',
    INVALID_AADHAAR: 'Invalid Aadhaar number (12 digits)',
    MIN_LENGTH: (min) => `Minimum ${min} characters required`,
    MAX_LENGTH: (max) => `Maximum ${max} characters allowed`,
    MIN_VALUE: (min) => `Minimum value is ${min}`,
    MAX_VALUE: (max) => `Maximum value is ${max}`,
};
// Default validators for common field types
exports.DEFAULT_VALIDATORS = {
    text: (value, field) => {
        if (field.required && (!value || value.trim() === '')) {
            return exports.VALIDATION_MESSAGES.REQUIRED;
        }
        if (field.validation?.pattern && value) {
            const regex = new RegExp(field.validation.pattern);
            if (!regex.test(value)) {
                return field.validation.message || 'Invalid format';
            }
        }
        if (field.validation?.minLength && value && value.length < field.validation.minLength) {
            return exports.VALIDATION_MESSAGES.MIN_LENGTH(field.validation.minLength);
        }
        if (field.validation?.maxLength && value && value.length > field.validation.maxLength) {
            return exports.VALIDATION_MESSAGES.MAX_LENGTH(field.validation.maxLength);
        }
        return undefined;
    },
    number: (value, field) => {
        if (field.required && (value === null || value === undefined || value === '')) {
            return exports.VALIDATION_MESSAGES.REQUIRED;
        }
        if (value && isNaN(Number(value))) {
            return 'Must be a valid number';
        }
        if (field.validation?.min !== undefined && Number(value) < field.validation.min) {
            return exports.VALIDATION_MESSAGES.MIN_VALUE(field.validation.min);
        }
        if (field.validation?.max !== undefined && Number(value) > field.validation.max) {
            return exports.VALIDATION_MESSAGES.MAX_VALUE(field.validation.max);
        }
        return undefined;
    },
    date: (value, field) => {
        if (field.required && !value) {
            return exports.VALIDATION_MESSAGES.REQUIRED;
        }
        if (value && isNaN(new Date(value).getTime())) {
            return 'Invalid date format';
        }
        return undefined;
    },
    select: (value, field) => {
        if (field.required && !value) {
            return exports.VALIDATION_MESSAGES.REQUIRED;
        }
        if (value && field.options && !field.options.includes(value)) {
            return 'Invalid selection';
        }
        return undefined;
    },
    textarea: (value, field) => {
        // Same validation as text
        return exports.DEFAULT_VALIDATORS.text?.(value, field);
    },
    checkbox: (value, field) => {
        if (field.required && !value) {
            return exports.VALIDATION_MESSAGES.REQUIRED;
        }
        return undefined;
    },
    currency: (value, field) => {
        // Same validation as number
        return exports.DEFAULT_VALIDATORS.number?.(value, field);
    },
};
// Utility: Validate custom field data
function validateCustomFields(data, fieldDefinitions) {
    const errors = [];
    for (const field of fieldDefinitions) {
        const value = data[field.name];
        const validator = exports.DEFAULT_VALIDATORS[field.type];
        if (validator) {
            const error = validator(value, field);
            if (error) {
                errors.push({ fieldName: field.name, message: error });
            }
        }
    }
    return errors;
}
// Utility: Group fields by group property
function groupFieldsByCategory(fields) {
    const grouped = new Map();
    for (const field of fields) {
        const groupName = field.group || 'Other';
        if (!grouped.has(groupName)) {
            grouped.set(groupName, []);
        }
        grouped.get(groupName).push(field);
    }
    return Array.from(grouped.entries()).map(([name, fields]) => ({
        name,
        fields,
    }));
}
// Utility: Format custom field value for display
function formatCustomFieldValue(value, field) {
    if (value === null || value === undefined)
        return '-';
    switch (field.type) {
        case 'date':
            return new Date(value).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        case 'currency':
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
            }).format(Number(value));
        case 'checkbox':
            return value ? 'Yes' : 'No';
        case 'number':
            return String(value);
        default:
            return String(value);
    }
}
// Utility: Get empty custom field data structure
function getEmptyCustomFieldData(fieldDefinitions) {
    const data = {};
    for (const field of fieldDefinitions) {
        data[field.name] = field.defaultValue ?? null;
    }
    return data;
}
