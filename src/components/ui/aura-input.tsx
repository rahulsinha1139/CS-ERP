/**
 * AURA INPUT COMPONENT
 * Professional's Digital Desk UI System
 * Input fields styled for Mrs. Pragnya Pradhan's CS practice
 */

import * as React from "react"
import { cn } from "@/lib/utils"

export interface AuraInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const AuraInput = React.forwardRef<HTMLInputElement, AuraInputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && type !== "date" && type !== "time" && type !== "datetime-local" && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-200",
              icon && type !== "date" && type !== "time" && type !== "datetime-local" && "pl-10",
              error && "border-red-300 focus:border-red-400 focus:ring-red-500/20",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)
AuraInput.displayName = "AuraInput"

export { AuraInput }