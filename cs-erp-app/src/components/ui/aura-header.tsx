/**
 * AURA HEADER COMPONENT
 * Professional's Digital Desk UI System
 * Clean, focused header for Mrs. Pragnya Pradhan's CS practice
 */

import React from 'react'
import { cn } from '@/lib/utils'

interface AuraHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
  className?: string
}

const AuraHeader: React.FC<AuraHeaderProps> = ({
  title,
  subtitle,
  actions,
  breadcrumbs,
  className
}) => {
  return (
    <header className={cn(
      "bg-white border-b border-gray-200",
      "sticky top-0 z-20 backdrop-blur-sm bg-white/95",
      className
    )}>
      <div className="px-6 py-4">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-2" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <svg
                      className="w-4 h-4 mx-2 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="hover:text-gray-900 transition-colors duration-200"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-gray-900 font-medium">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Main header content */}
        <div className="flex items-center justify-between">
          {/* Title section */}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-gray-600">
                {subtitle}
              </p>
            )}
          </div>

          {/* Actions section */}
          {actions && (
            <div className="ml-6 flex items-center space-x-3 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export { AuraHeader }