/**
 * AURA DESIGN SYSTEM DEMO
 * Showcase for Mrs. Pragnya Pradhan's Professional Digital Desk
 * Complete UI transformation demonstration
 */

import React, { useState } from 'react'
import { AuraLayout } from '@/components/ui/aura-layout'
import { AuraButton } from '@/components/ui/aura-button'

// Sample icons for demo
const InvoiceIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </svg>
)

const AuraDemoPage: React.FC = () => {
  const [, setIsLoading] = useState(false)
  const [loadingDemo, setLoadingDemo] = useState<string | null>(null)

  const handleDemoAction = (action: string) => {
    setLoadingDemo(action)
    setIsLoading(true)

    // Simulate action
    setTimeout(() => {
      setIsLoading(false)
      setLoadingDemo(null)
    }, 2000)
  }

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Design System" },
    { label: "Aura Demo" }
  ]

  const headerActions = (
    <div className="flex items-center space-x-3">
      <AuraButton
        variant="tertiary"
        size="sm"
        icon={<DownloadIcon />}
      >
        Export Demo
      </AuraButton>
      <AuraButton
        variant="primary"
        icon={<PlusIcon />}
        isLoading={loadingDemo === 'create'}
        onClick={() => handleDemoAction('create')}
      >
        Create Invoice
      </AuraButton>
    </div>
  )

  return (
    <AuraLayout
      title="Aura Design System"
      subtitle="Professional's Digital Desk - Tailored for Mrs. Pragnya Pradhan"
      headerActions={headerActions}
      breadcrumbs={breadcrumbs}
      userEmail="Mrs. Pragnya Pradhan"
      userName="pragnya@pradhanassociates.com"
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-professional">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-text-primary mb-4">
              Welcome to Your Professional Digital Desk
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-6">
              The Aura design system transforms your CS practice management into a seamless,
              professional experience. Every element is crafted for efficiency and elegance.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-aura-blue-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-lg">CS</span>
                </div>
                <p className="text-sm text-text-tertiary">Professional</p>
              </div>
              <div className="w-8 h-px bg-border-primary"></div>
              <div className="text-center">
                <div className="w-12 h-12 bg-aura-success rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-text-tertiary">Efficient</p>
              </div>
              <div className="w-8 h-px bg-border-primary"></div>
              <div className="text-center">
                <div className="w-12 h-12 bg-aura-warning rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-sm text-text-tertiary">Fast</p>
              </div>
            </div>
          </div>
        </div>

        {/* Button Showcase */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-professional">
          <h3 className="text-xl font-semibold text-text-primary mb-4">
            Professional Button System
          </h3>
          <p className="text-text-secondary mb-6">
            Aura buttons follow Gemini&rsquo;s specification: Primary (blue background), Secondary (bordered),
            Tertiary (text only), with loading states and proper hover animations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary Buttons */}
            <div className="space-y-4">
              <h4 className="font-medium text-text-primary">Primary Actions</h4>
              <div className="space-y-3">
                <AuraButton variant="primary" size="sm">Small Primary</AuraButton>
                <AuraButton variant="primary" size="md">Medium Primary</AuraButton>
                <AuraButton variant="primary" size="lg">Large Primary</AuraButton>
                <AuraButton
                  variant="primary"
                  isLoading={loadingDemo === 'primary'}
                  onClick={() => handleDemoAction('primary')}
                >
                  With Loading
                </AuraButton>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div className="space-y-4">
              <h4 className="font-medium text-text-primary">Secondary Actions</h4>
              <div className="space-y-3">
                <AuraButton variant="secondary" size="sm">Small Secondary</AuraButton>
                <AuraButton variant="secondary" size="md">Medium Secondary</AuraButton>
                <AuraButton variant="secondary" size="lg">Large Secondary</AuraButton>
                <AuraButton
                  variant="secondary"
                  isLoading={loadingDemo === 'secondary'}
                  onClick={() => handleDemoAction('secondary')}
                >
                  With Loading
                </AuraButton>
              </div>
            </div>

            {/* Tertiary Buttons */}
            <div className="space-y-4">
              <h4 className="font-medium text-text-primary">Tertiary Actions</h4>
              <div className="space-y-3">
                <AuraButton variant="tertiary" size="sm">Small Tertiary</AuraButton>
                <AuraButton variant="tertiary" size="md">Medium Tertiary</AuraButton>
                <AuraButton variant="tertiary" size="lg">Large Tertiary</AuraButton>
                <AuraButton
                  variant="tertiary"
                  isLoading={loadingDemo === 'tertiary'}
                  onClick={() => handleDemoAction('tertiary')}
                >
                  With Loading
                </AuraButton>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Workflow Demo */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-professional">
          <h3 className="text-xl font-semibold text-text-primary mb-4">
            CS Practice Workflow
          </h3>
          <p className="text-text-secondary mb-6">
            Demonstrate the typical workflow for Mrs. Pradhan&rsquo;s daily operations
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Create Invoice */}
            <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-aura-blue-primary rounded-lg flex items-center justify-center">
                  <InvoiceIcon />
                </div>
                <h4 className="font-medium text-text-primary">Create Invoice</h4>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Generate GST-compliant invoices with automatic calculations
              </p>
              <AuraButton
                variant="primary"
                size="sm"
                className="w-full"
                isLoading={loadingDemo === 'invoice'}
                onClick={() => handleDemoAction('invoice')}
              >
                New Invoice
              </AuraButton>
            </div>

            {/* Track Payment */}
            <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-aura-success rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h4 className="font-medium text-text-primary">Track Payment</h4>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Monitor payment status and automate reconciliation
              </p>
              <AuraButton
                variant="secondary"
                size="sm"
                className="w-full"
                isLoading={loadingDemo === 'payment'}
                onClick={() => handleDemoAction('payment')}
              >
                View Payments
              </AuraButton>
            </div>

            {/* Compliance Check */}
            <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-aura-warning rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h4 className="font-medium text-text-primary">Compliance</h4>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Stay updated with regulatory requirements and deadlines
              </p>
              <AuraButton
                variant="tertiary"
                size="sm"
                className="w-full"
                isLoading={loadingDemo === 'compliance'}
                onClick={() => handleDemoAction('compliance')}
              >
                Check Status
              </AuraButton>
            </div>

            {/* Generate Report */}
            <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-aura-info rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="font-medium text-text-primary">Reports</h4>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Generate professional reports for practice analysis
              </p>
              <AuraButton
                variant="success"
                size="sm"
                className="w-full"
                isLoading={loadingDemo === 'report'}
                onClick={() => handleDemoAction('report')}
              >
                Generate
              </AuraButton>
            </div>
          </div>
        </div>

        {/* Design Principles */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-professional">
          <h3 className="text-xl font-semibold text-text-primary mb-4">
            Aura Design Principles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-text-primary mb-3">Professional Focus</h4>
              <ul className="space-y-2 text-text-secondary">
                <li>• Clean white backgrounds for document clarity</li>
                <li>• Royal blue (#4169E1) for authority and trust</li>
                <li>• Mathematical spacing using golden ratio (1.618)</li>
                <li>• Inter font for modern professionalism</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-3">User Experience</h4>
              <ul className="space-y-2 text-text-secondary">
                <li>• Fast animations under 250ms</li>
                <li>• Responsive design: 240px → 72px → hamburger</li>
                <li>• Accessible color contrast ratios</li>
                <li>• Consistent interaction patterns</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AuraLayout>
  )
}

export default AuraDemoPage