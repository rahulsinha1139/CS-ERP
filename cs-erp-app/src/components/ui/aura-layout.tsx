/**
 * AURA LAYOUT COMPONENT
 * Professional's Digital Desk UI System
 * Complete layout wrapper for Mrs. Pragnya Pradhan's CS practice
 */

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { AuraHeader } from './aura-header'
import { AuraSidebar } from './aura-sidebar'

// Default navigation items for CS practice
const defaultNavigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 7 4-4 4 4" />
      </svg>
    ),
    description: 'Overview and analytics'
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    description: 'Customer management and invoice repository'
  },
  {
    name: 'Invoices',
    href: '/invoices',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    description: 'Manage invoices and billing'
  },
  {
    name: 'Payments',
    href: '/payments',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    description: 'Track payments and reconciliation'
  },
  {
    name: 'Compliance',
    href: '/compliance',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    description: 'Compliance calendar and deadlines'
  },
]

interface AuraLayoutProps {
  children: React.ReactNode

  // Header props
  title?: string
  subtitle?: string
  headerActions?: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>

  // Sidebar props
  navigationItems?: typeof defaultNavigationItems
  companyName?: string
  companyLogo?: React.ReactNode

  // Layout options
  className?: string
  contentClassName?: string

  // User section
  userEmail?: string
  userName?: string
}

const AuraLayout: React.FC<AuraLayoutProps> = ({
  children,
  title,
  subtitle,
  headerActions,
  breadcrumbs,
  navigationItems = defaultNavigationItems,
  companyName = "CS ERP",
  companyLogo = (
    <img
      src="/images/company-logo.png"
      alt="Company Logo"
      className="w-10 h-10 object-contain"
      onError={(e) => {
        // Fallback if logo doesn't load
        e.currentTarget.style.display = 'none';
      }}
    />
  ),
  className,
  contentClassName,
  userEmail = "pragnyap.pradhan@gmail.com",
  userName = "Mrs. Pragnya Pradhan",
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Default user section
  const defaultUserSection = (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
        <span className="text-white font-medium text-sm">
          {userEmail.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          {userEmail}
        </p>
        <p className="text-xs text-text-tertiary truncate">
          {userName}
        </p>
      </div>
    </div>
  )

  return (
    <div className={cn("min-h-screen bg-surface-primary", className)}>
      {/* Sidebar */}
      <AuraSidebar
        navigationItems={navigationItems}
        companyName={companyName}
        companyLogo={companyLogo}
        userSection={defaultUserSection}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main content area - accounts for sidebar */}
      <div className="md:pl-18 lg:pl-60">
        {/* Mobile menu button */}
        <div className="md:hidden sticky top-0 z-30 bg-surface-primary border-b border-border-primary px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center space-x-2 text-text-primary hover:text-primary-500 aura-transition-fast"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="font-medium">{companyName}</span>
          </button>
        </div>

        {/* Header */}
        {(title || headerActions || breadcrumbs) && (
          <AuraHeader
            title={title || ""}
            subtitle={subtitle}
            actions={headerActions}
            breadcrumbs={breadcrumbs}
          />
        )}

        {/* Main content */}
        <main className={cn(
          "flex-1 p-6 aura-animate-fade-in",
          contentClassName
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}

export { AuraLayout }