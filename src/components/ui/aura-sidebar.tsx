/**
 * AURA SIDEBAR COMPONENT
 * Professional's Digital Desk UI System
 * Following Gemini's specification: 240px width, 72px collapsed, hamburger below 768px
 */

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
  badge?: string | number
}

interface AuraSidebarProps {
  navigationItems: NavItem[]
  companyName?: string
  companyLogo?: React.ReactNode
  userSection?: React.ReactNode
  className?: string
  isOpen?: boolean
  onToggle?: () => void
}

const AuraSidebar: React.FC<AuraSidebarProps> = ({
  navigationItems,
  companyName = "CS ERP",
  companyLogo,
  userSection,
  className,
  isOpen = false,
  onToggle,
}) => {
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Responsive behavior
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const mobile = width < 768
      const tablet = width >= 768 && width < 1024

      setIsMobile(mobile)
      setIsTablet(tablet)

      // Auto-collapse on tablet
      if (tablet) {
        setIsCollapsed(true)
      } else if (!mobile) {
        setIsCollapsed(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (isMobile && isOpen && onToggle) {
      onToggle()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return router.asPath === '/'
    }
    return router.asPath.startsWith(href)
  }

  // Default company logo
  const defaultLogo = (
    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
      <span className="text-white font-bold text-sm">CS</span>
    </div>
  )

  const sidebarWidth = isMobile
    ? (isOpen ? 'w-64' : 'w-0')
    : isCollapsed
      ? 'w-18'
      : 'w-60' // 240px as specified

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200",
        "transition-all duration-300 ease-in-out overflow-hidden",
        isMobile ? "z-50" : "z-30",
        sidebarWidth,
        isMobile && !isOpen && "translate-x-[-100%]",
        className
      )}>
        <div className="flex h-full flex-col">
          {/* Logo/Brand section */}
          <div className={cn(
            "flex items-center border-b border-gray-200",
            "px-4 py-4 flex-shrink-0",
            isCollapsed && !isMobile ? "justify-center" : "justify-between"
          )}>
            {!isCollapsed || isMobile ? (
              <div className="flex items-center space-x-3">
                {companyLogo || defaultLogo}
                <div className="min-w-0">
                  <h2 className="font-semibold text-text-primary text-sm truncate">
                    {companyName}
                  </h2>
                  <p className="text-xs text-text-tertiary truncate">
                    Professional Suite
                  </p>
                </div>
              </div>
            ) : (
              companyLogo || defaultLogo
            )}

            {/* Mobile close button */}
            {isMobile && (
              <button
                onClick={onToggle}
                className="p-1 rounded-md hover:bg-surface-secondary aura-transition-fast"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = isActiveRoute(item.href)
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-lg text-sm font-medium",
                    "transition-colors duration-200 cursor-pointer",
                    "hover:bg-gray-50",
                    isCollapsed && !isMobile
                      ? "px-3 py-3 justify-center"
                      : "px-3 py-2",
                    isActive
                      ? "bg-blue-50 text-blue-600 border-r-2 border-blue-500"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                  title={isCollapsed && !isMobile ? item.name : undefined}
                >
                  <Icon className="flex-shrink-0 w-5 h-5" />

                  {(!isCollapsed || isMobile) && (
                    <>
                      <span className="ml-3 truncate">{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          {userSection && (
            <div className={cn(
              "border-t border-border-primary flex-shrink-0",
              isCollapsed && !isMobile ? "p-2" : "p-4"
            )}>
              {userSection}
            </div>
          )}

          {/* Desktop collapse toggle */}
          {!isMobile && (
            <div className="border-t border-border-primary p-2">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={cn(
                  "w-full flex items-center justify-center p-2 rounded-md",
                  "hover:bg-surface-secondary text-text-secondary",
                  "aura-transition-fast"
                )}
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <svg
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    isCollapsed && "rotate-180"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export { AuraSidebar }