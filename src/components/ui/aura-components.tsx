/**
 * AURA DESIGN SYSTEM COMPONENTS
 * Professional's Digital Desk UI System
 * Supporting components for dashboard and other pages
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// Grid Component for layouts
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: 'sm' | 'md' | 'lg' | 'xl'
}

export const AuraGrid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = 'md', ...props }, ref) => {
    const gridClasses = {
      cols: {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
        12: 'grid-cols-12'
      },
      gap: {
        sm: 'gap-4',
        md: 'gap-6',
        lg: 'gap-8',
        xl: 'gap-12'
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          gridClasses.cols[cols],
          gridClasses.gap[gap],
          className
        )}
        {...props}
      />
    )
  }
)
AuraGrid.displayName = "AuraGrid"

// Heading Component with Aura typography
const auraHeadingVariants = cva(
  "font-semibold text-text-primary leading-tight",
  {
    variants: {
      size: {
        xs: "text-sm",
        sm: "text-base",
        default: "text-lg",
        lg: "text-xl",
        xl: "text-2xl",
        "2xl": "text-3xl",
        "3xl": "text-4xl"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
)

interface AuraHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof auraHeadingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const AuraHeading = React.forwardRef<HTMLHeadingElement, AuraHeadingProps>(
  ({ className, size, as = 'h2', ...props }, ref) => {
    const Comp = as
    return (
      <Comp
        ref={ref}
        className={cn(auraHeadingVariants({ size }), className)}
        {...props}
      />
    )
  }
)
AuraHeading.displayName = "AuraHeading"

// Status Badge with Aura colors
const auraStatusBadgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
  {
    variants: {
      status: {
        draft: "bg-gray-100 text-gray-800",
        pending: "bg-blue-100 text-blue-800",
        paid: "bg-green-100 text-green-800",
        overdue: "bg-red-100 text-red-800",
        failed: "bg-red-100 text-red-800",
        success: "bg-green-100 text-green-800",
        warning: "bg-blue-100 text-blue-800",
        info: "bg-blue-100 text-blue-800"
      }
    },
    defaultVariants: {
      status: "draft"
    }
  }
)

interface AuraStatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof auraStatusBadgeVariants> {}

export const AuraStatusBadge = React.forwardRef<HTMLSpanElement, AuraStatusBadgeProps>(
  ({ className, status, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(auraStatusBadgeVariants({ status }), className)}
      {...props}
    />
  )
)
AuraStatusBadge.displayName = "AuraStatusBadge"

// Loading Card for skeleton states
export const AuraLoadingCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-border-primary bg-surface-primary p-6 shadow-professional animate-pulse",
      className
    )}
    {...props}
  >
    <div className="space-y-3">
      <div className="h-4 bg-surface-secondary rounded w-3/4"></div>
      <div className="h-4 bg-surface-secondary rounded w-1/2"></div>
      <div className="h-8 bg-surface-secondary rounded w-full"></div>
    </div>
  </div>
))
AuraLoadingCard.displayName = "AuraLoadingCard"

// Progress Bar Component
interface AuraProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max: number
  color?: 'primary' | 'success' | 'warning' | 'danger'
}

export const AuraProgressBar = React.forwardRef<HTMLDivElement, AuraProgressBarProps>(
  ({ className, value, max, color = 'primary', ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    const colorClasses = {
      primary: 'bg-primary-500',
      success: 'bg-green-600',
      warning: 'bg-blue-600',
      danger: 'bg-red-600'
    }

    return (
      <div
        ref={ref}
        className={cn("w-full bg-surface-secondary rounded-full h-2", className)}
        {...props}
      >
        <div
          className={cn("h-2 rounded-full transition-all duration-300", colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  }
)
AuraProgressBar.displayName = "AuraProgressBar"

// Metric Card for dashboard stats
interface AuraMetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  description?: string
  icon?: React.ReactNode
}

export const AuraMetricCard = React.forwardRef<HTMLDivElement, AuraMetricCardProps>(
  ({ className, title, value, change, description, icon, onClick, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border-2 border-blue-100 bg-surface-primary p-6 shadow-professional",
        "hover:border-blue-400 hover:shadow-lg transition-all duration-200",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-blue-600">{value}</p>
          {description && (
            <p className="text-xs text-text-tertiary">{description}</p>
          )}
          {change && (
            <p className={cn(
              "text-xs font-medium",
              change.type === 'increase' ? "text-green-600" : "text-red-600"
            )}>
              {change.type === 'increase' ? '↗' : '↘'} {change.value}%
            </p>
          )}
        </div>
        {icon && (
          <div className="ml-4 flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  )
)
AuraMetricCard.displayName = "AuraMetricCard"