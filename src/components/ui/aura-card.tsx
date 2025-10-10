/**
 * AURA CARD COMPONENT
 * Professional's Digital Desk UI System
 * Styled for Mrs. Pragnya Pradhan's CS practice with royal blue accents
 */

import * as React from "react"
import { cn } from "@/lib/utils"

const AuraCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-border-primary bg-surface-primary text-text-primary shadow-professional",
      className
    )}
    {...props}
  />
))
AuraCard.displayName = "AuraCard"

const AuraCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
AuraCardHeader.displayName = "AuraCardHeader"

const AuraCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight text-text-primary",
      className
    )}
    {...props}
  />
))
AuraCardTitle.displayName = "AuraCardTitle"

const AuraCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-text-secondary", className)}
    {...props}
  />
))
AuraCardDescription.displayName = "AuraCardDescription"

const AuraCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
AuraCardContent.displayName = "AuraCardContent"

const AuraCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
AuraCardFooter.displayName = "AuraCardFooter"

export {
  AuraCard,
  AuraCardHeader,
  AuraCardFooter,
  AuraCardTitle,
  AuraCardDescription,
  AuraCardContent
}