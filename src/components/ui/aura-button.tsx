/**
 * AURA BUTTON COMPONENT
 * Professional's Digital Desk UI System
 * Based on Gemini's specification for Mrs. Pragnya Pradhan's CS practice
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Loading spinner component
const LoadingSpinner = ({ color = "white" }: { color?: "white" | "blue" }) => (
  <svg
    className={cn(
      "animate-spin h-4 w-4",
      color === "white" ? "text-white" : "text-blue-600"
    )}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

const auraButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed border-0",
  {
    variants: {
      variant: {
        // Primary Button - Aura Blue Primary with white text
        primary: [
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90 hover:shadow-md",
          "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
          "disabled:opacity-50",
          "transition-all duration-200"
        ].join(" "),

        // Secondary Button - Light gray background for contrast on white cards
        secondary: [
          "border border-border bg-gray-50 text-foreground",
          "hover:bg-gray-100 hover:border-gray-300",
          "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
          "disabled:opacity-50",
          "transition-all duration-200"
        ].join(" "),

        // Tertiary/Text Button - Primary text only
        tertiary: [
          "text-primary bg-transparent",
          "hover:bg-secondary",
          "focus-visible:bg-secondary",
          "disabled:text-muted-foreground disabled:cursor-not-allowed",
          "transition-all duration-200"
        ].join(" "),

        // Destructive variant for dangerous actions
        destructive: [
          "bg-red-600 text-white",
          "hover:bg-red-700 hover:shadow-md",
          "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600",
          "disabled:opacity-50",
          "transition-all duration-200"
        ].join(" "),

        // Success variant for positive actions
        success: [
          "bg-green-600 text-white",
          "hover:bg-green-700 hover:shadow-md",
          "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-600",
          "disabled:opacity-50",
          "transition-all duration-200"
        ].join(" "),
      },
      size: {
        // Professional sizing with golden ratio proportions
        sm: "h-8 px-3 text-sm rounded-md", // 32px height
        md: "h-10 px-4 text-sm rounded-md", // 40px height (default)
        lg: "h-11 px-6 text-base rounded-lg", // 44px height
        xl: "h-12 px-8 text-base rounded-lg", // 48px height
        icon: "h-10 w-10 rounded-md", // Square icon button
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface AuraButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof auraButtonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
  icon?: React.ReactNode
}

const AuraButton = React.forwardRef<HTMLButtonElement, AuraButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    isLoading = false,
    loadingText,
    icon,
    children,
    disabled,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button"

    // Determine spinner color based on variant
    const spinnerColor = variant === 'secondary' || variant === 'tertiary' ? 'blue' : 'white'

    // Show loading content or regular content
    const content = isLoading ? (
      <>
        <LoadingSpinner color={spinnerColor} />
        {loadingText && <span className="ml-2">{loadingText}</span>}
      </>
    ) : (
      <>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </>
    )

    return (
      <Comp
        className={cn(auraButtonVariants({ variant, size }), className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {content}
      </Comp>
    )
  }
)

AuraButton.displayName = "AuraButton"

export { AuraButton, auraButtonVariants }