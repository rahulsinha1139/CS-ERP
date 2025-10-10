/**
 * Service Type Selector Component
 * Dropdown for selecting which type of service to add to invoice
 */

import React from 'react';
import { ServiceType, SERVICE_TYPE_OPTIONS } from '@/types/service-types';

interface ServiceTypeSelectorProps {
  value: ServiceType;
  onChange: (serviceType: ServiceType) => void;
  disabled?: boolean;
}

export const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Service Type
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ServiceType)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {SERVICE_TYPE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Show description of selected service type */}
      <p className="text-xs text-gray-500">
        {SERVICE_TYPE_OPTIONS.find((opt) => opt.value === value)?.description}
      </p>
    </div>
  );
};
