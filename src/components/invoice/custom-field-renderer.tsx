/**
 * Custom Field Renderer
 * Dynamically renders form fields based on custom field definitions
 */

import React from 'react';
import { CustomFieldRendererProps, DEFAULT_VALIDATORS } from '@/types/custom-fields';
import { AuraInput } from '@/components/ui/aura-input';
import { AuraSelect } from '@/components/ui/aura-select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DollarSign, Calendar, Hash, Type, CheckSquare, List } from 'lucide-react';

export function CustomFieldRenderer({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  className = '',
}: CustomFieldRendererProps) {
  const handleChange = (newValue: any) => {
    onChange(newValue);
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  const renderFieldInput = () => {
    switch (field.type) {
      case 'text':
        return (
          <AuraInput
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={field.placeholder}
            disabled={disabled}
            icon={<Type className="h-4 w-4" />}
            className={className}
          />
        );

      case 'number':
        return (
          <AuraInput
            type="number"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value ? Number(e.target.value) : null)}
            onBlur={handleBlur}
            placeholder={field.placeholder}
            disabled={disabled}
            icon={<Hash className="h-4 w-4" />}
            className={className}
          />
        );

      case 'date':
        return (
          <AuraInput
            type="date"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            disabled={disabled}
            icon={<Calendar className="h-4 w-4" />}
            className={className}
          />
        );

      case 'select':
        return (
          <AuraSelect
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            disabled={disabled}
            icon={<List className="h-4 w-4" />}
            className={className}
          >
            <option value="">-- Select {field.label} --</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </AuraSelect>
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={field.placeholder}
            disabled={disabled}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
            rows={4}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`checkbox-${field.name}`}
              checked={value || false}
              onCheckedChange={(checked) => handleChange(checked)}
              disabled={disabled}
            />
            <Label
              htmlFor={`checkbox-${field.name}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
            </Label>
          </div>
        );

      case 'currency':
        return (
          <AuraInput
            type="number"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value ? Number(e.target.value) : null)}
            onBlur={handleBlur}
            placeholder={field.placeholder || '0.00'}
            disabled={disabled}
            icon={<DollarSign className="h-4 w-4" />}
            className={className}
          />
        );

      default:
        return (
          <AuraInput
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={field.placeholder}
            disabled={disabled}
            className={className}
          />
        );
    }
  };

  // For checkbox, label is rendered inside the input
  if (field.type === 'checkbox') {
    return (
      <div className="space-y-2">
        {renderFieldInput()}
        {field.helpText && (
          <p className="text-sm text-gray-500">{field.helpText}</p>
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`field-${field.name}`} className="flex items-center gap-1">
        {field.label}
        {field.required && <span className="text-red-500">*</span>}
      </Label>
      {renderFieldInput()}
      {field.helpText && (
        <p className="text-sm text-gray-500">{field.helpText}</p>
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

/**
 * Custom Fields Group Renderer
 * Renders a group of custom fields with a section header
 */
interface CustomFieldsGroupProps {
  groupName: string;
  fields: CustomFieldRendererProps[];
}

export function CustomFieldsGroup({ groupName, fields }: CustomFieldsGroupProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
        {groupName}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((fieldProps) => (
          <CustomFieldRenderer key={fieldProps.field.name} {...fieldProps} />
        ))}
      </div>
    </div>
  );
}

/**
 * Custom Fields Display Component
 * Read-only display of custom field values
 */
interface CustomFieldsDisplayProps {
  fields: Array<{
    field: { name: string; label: string; type: string };
    value: any;
  }>;
}

export function CustomFieldsDisplay({ fields }: CustomFieldsDisplayProps) {
  const formatValue = (value: any, type: string): string => {
    if (value === null || value === undefined) return '-';

    switch (type) {
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
  };

  return (
    <div className="space-y-3">
      {fields.map(({ field, value }) => (
        <div key={field.name} className="flex items-start justify-between py-2 border-b">
          <span className="text-sm font-medium text-gray-600">{field.label}:</span>
          <span className="text-sm text-gray-900">{formatValue(value, field.type)}</span>
        </div>
      ))}
    </div>
  );
}
