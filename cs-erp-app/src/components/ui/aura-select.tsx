/**
 * AURA SELECT COMPONENT
 * Professional's Digital Desk UI System
 * Select dropdowns styled for Mrs. Pragnya Pradhan's CS practice
 */

import * as React from "react"
import { cn } from "@/lib/utils"

export interface AuraSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const AuraSelect = React.forwardRef<HTMLSelectElement, AuraSelectProps>(
  ({ className, label, error, icon, children, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10">
              {icon}
            </div>
          )}
          <select
            className={cn(
              "flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-10 text-sm text-gray-900",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-200 appearance-none cursor-pointer",
              icon && "pl-11",
              error && "border-red-300 focus:border-red-400 focus:ring-red-500/20",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)
AuraSelect.displayName = "AuraSelect"

export { AuraSelect }