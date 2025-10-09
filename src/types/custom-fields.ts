/**
 * Custom Fields Type System
 * Dynamic field definitions for specialized CS services
 */

// Supported field types
export type FieldType =
  | 'text'           // Single-line text input
  | 'number'         // Number input
  | 'date'           // Date picker
  | 'select'         // Dropdown select
  | 'textarea'       // Multi-line text
  | 'checkbox'       // Boolean checkbox
  | 'currency';      // Currency/money input

// Validation rules for fields
export interface FieldValidation {
  pattern?: string;      // Regex pattern for text validation
  minLength?: number;    // Min length for text/textarea
  maxLength?: number;    // Max length for text/textarea
  min?: number;          // Min value for number/currency
  max?: number;          // Max value for number/currency
  message?: string;      // Custom validation error message
}

// Custom field definition (stored in ServiceTemplate.customFields)
export interface CustomFieldDefinition {
  name: string;                  // Internal field name (e.g., "cin", "din")
  label: string;                 // Display label (e.g., "CIN", "DIN")
  type: FieldType;               // Field type
  required: boolean;             // Is field required?
  placeholder?: string;          // Placeholder text
  helpText?: string;             // Help text below field
  options?: string[];            // Options for select field
  defaultValue?: any;            // Default value
  validation?: FieldValidation;  // Validation rules
  group?: string;                // Field group for organization (e.g., "Company Details", "Director Info")
}

// Custom field data (stored in InvoiceLine.customFieldData)
export interface CustomFieldData {
  [fieldName: string]: any;      // Field name → value mapping
}

// Field group for organizing fields in UI
export interface FieldGroup {
  name: string;                  // Group name (e.g., "Company Details")
  fields: CustomFieldDefinition[]; // Fields in this group
}

// Pre-defined service template with custom fields
export interface ServiceTemplateDefinition {
  name: string;
  description: string;
  defaultRate: number;
  gstRate: number;
  hsnSac?: string;
  category?: string;
  customFields: CustomFieldDefinition[];
}

// Validation error for custom fields
export interface CustomFieldError {
  fieldName: string;
  message: string;
}

// Custom field value with metadata
export interface CustomFieldValue {
  field: CustomFieldDefinition;
  value: any;
  error?: string;
}

// Form state for custom fields
export interface CustomFieldFormState {
  data: CustomFieldData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// Validator function type
export type FieldValidator = (value: any, field: CustomFieldDefinition) => string | undefined;

// Custom field renderer props
export interface CustomFieldRendererProps {
  field: CustomFieldDefinition;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

// Service template with custom fields (DB model + types)
export interface ServiceTemplateWithCustomFields {
  id: string;
  name: string;
  description: string | null;
  defaultRate: number;
  gstRate: number;
  hsnSac: string | null;
  category: string | null;
  customFields: CustomFieldDefinition[] | null;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Invoice line with custom field data (DB model + types)
export interface InvoiceLineWithCustomFields {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  gstRate: number;
  hsnSac: string | null;
  isReimbursement: boolean;
  serviceTemplateId: string | null;
  customFieldData: CustomFieldData | null;
}

// Common field patterns for CS services
export const FIELD_PATTERNS = {
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
} as const;

// Helper validation messages
export const VALIDATION_MESSAGES = {
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
  MIN_LENGTH: (min: number) => `Minimum ${min} characters required`,
  MAX_LENGTH: (max: number) => `Maximum ${max} characters allowed`,
  MIN_VALUE: (min: number) => `Minimum value is ${min}`,
  MAX_VALUE: (max: number) => `Maximum value is ${max}`,
} as const;

// Default validators for common field types
export const DEFAULT_VALIDATORS: Record<string, FieldValidator> = {
  text: (value, field) => {
    if (field.required && (!value || value.trim() === '')) {
      return VALIDATION_MESSAGES.REQUIRED;
    }
    if (field.validation?.pattern && value) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        return field.validation.message || 'Invalid format';
      }
    }
    if (field.validation?.minLength && value && value.length < field.validation.minLength) {
      return VALIDATION_MESSAGES.MIN_LENGTH(field.validation.minLength);
    }
    if (field.validation?.maxLength && value && value.length > field.validation.maxLength) {
      return VALIDATION_MESSAGES.MAX_LENGTH(field.validation.maxLength);
    }
    return undefined;
  },

  number: (value, field) => {
    if (field.required && (value === null || value === undefined || value === '')) {
      return VALIDATION_MESSAGES.REQUIRED;
    }
    if (value && isNaN(Number(value))) {
      return 'Must be a valid number';
    }
    if (field.validation?.min !== undefined && Number(value) < field.validation.min) {
      return VALIDATION_MESSAGES.MIN_VALUE(field.validation.min);
    }
    if (field.validation?.max !== undefined && Number(value) > field.validation.max) {
      return VALIDATION_MESSAGES.MAX_VALUE(field.validation.max);
    }
    return undefined;
  },

  date: (value, field) => {
    if (field.required && !value) {
      return VALIDATION_MESSAGES.REQUIRED;
    }
    if (value && isNaN(new Date(value).getTime())) {
      return 'Invalid date format';
    }
    return undefined;
  },

  select: (value, field) => {
    if (field.required && !value) {
      return VALIDATION_MESSAGES.REQUIRED;
    }
    if (value && field.options && !field.options.includes(value)) {
      return 'Invalid selection';
    }
    return undefined;
  },

  textarea: (value, field) => {
    // Same validation as text
    return DEFAULT_VALIDATORS.text?.(value, field);
  },

  checkbox: (value, field) => {
    if (field.required && !value) {
      return VALIDATION_MESSAGES.REQUIRED;
    }
    return undefined;
  },

  currency: (value, field) => {
    // Same validation as number
    return DEFAULT_VALIDATORS.number?.(value, field);
  },
};

// Utility: Validate custom field data
export function validateCustomFields(
  data: CustomFieldData,
  fieldDefinitions: CustomFieldDefinition[]
): CustomFieldError[] {
  const errors: CustomFieldError[] = [];

  for (const field of fieldDefinitions) {
    const value = data[field.name];
    const validator = DEFAULT_VALIDATORS[field.type];

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
export function groupFieldsByCategory(fields: CustomFieldDefinition[]): FieldGroup[] {
  const grouped = new Map<string, CustomFieldDefinition[]>();

  for (const field of fields) {
    const groupName = field.group || 'Other';
    if (!grouped.has(groupName)) {
      grouped.set(groupName, []);
    }
    grouped.get(groupName)!.push(field);
  }

  return Array.from(grouped.entries()).map(([name, fields]) => ({
    name,
    fields,
  }));
}

// Utility: Format custom field value for display
export function formatCustomFieldValue(
  value: any,
  field: CustomFieldDefinition
): string {
  if (value === null || value === undefined) return '-';

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
export function getEmptyCustomFieldData(
  fieldDefinitions: CustomFieldDefinition[]
): CustomFieldData {
  const data: CustomFieldData = {};

  for (const field of fieldDefinitions) {
    data[field.name] = field.defaultValue ?? null;
  }

  return data;
}
