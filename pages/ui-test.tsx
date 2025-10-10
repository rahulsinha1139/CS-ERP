/**
 * UI Test Page - Verify Professional Styling
 * Tests McKinsey-grade design system components
 */

import React from 'react';
import Head from 'next/head';

export default function UITestPage() {
  return (
    <>
      <Head>
        <title>UI Test - CS ERP Professional Suite</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Header Test */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Professional UI Test Suite
            </h1>
            <p className="text-muted-foreground">
              Verifying McKinsey-grade design system components
            </p>
          </div>

          {/* Color System Test */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 bg-card border border-border rounded-lg text-center">
              <div className="w-12 h-12 bg-primary rounded-lg mx-auto mb-2"></div>
              <p className="text-sm text-card-foreground">Primary</p>
            </div>
            <div className="p-6 bg-secondary border border-border rounded-lg text-center">
              <div className="w-12 h-12 bg-success rounded-lg mx-auto mb-2"></div>
              <p className="text-sm text-secondary-foreground">Success</p>
            </div>
            <div className="p-6 bg-muted border border-border rounded-lg text-center">
              <div className="w-12 h-12 bg-warning rounded-lg mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Warning</p>
            </div>
            <div className="p-6 bg-accent border border-border rounded-lg text-center">
              <div className="w-12 h-12 bg-destructive rounded-lg mx-auto mb-2"></div>
              <p className="text-sm text-accent-foreground">Destructive</p>
            </div>
          </div>

          {/* Button Tests */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Buttons</h2>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all duration-phi-fast">
                Primary Button
              </button>
              <button className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-all duration-phi-fast">
                Secondary Button
              </button>
              <button className="px-6 py-2 border border-border hover:bg-muted transition-all duration-phi-fast rounded-md">
                Outline Button
              </button>
            </div>
          </div>

          {/* Card Tests */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Cards</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-card border border-border rounded-lg shadow-professional hover:shadow-professional-lg transition-all duration-phi-medium">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Professional Card
                </h3>
                <p className="text-muted-foreground mb-4">
                  This is a professional card with proper styling and hover effects.
                </p>
                <div className="text-primary font-semibold">₹25,000</div>
              </div>

              <div className="p-6 bg-card border border-border rounded-lg shadow-professional hover:shadow-professional-lg transition-all duration-phi-medium">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Status Card
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Revenue</span>
                    <span className="text-success font-semibold">↑ 12.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Expenses</span>
                    <span className="text-destructive font-semibold">↓ 3.2%</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-card border border-border rounded-lg shadow-professional hover:shadow-professional-lg transition-all duration-phi-medium">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Loading Card
                </h3>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded loading-skeleton"></div>
                  <div className="h-4 bg-muted rounded loading-skeleton w-3/4"></div>
                  <div className="h-4 bg-muted rounded loading-skeleton w-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Tests */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Form Elements</h2>
            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter company name"
                    className="w-full px-3 py-2 bg-input border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter description"
                    rows={3}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="flex gap-4">
                  <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all duration-phi-fast">
                    Save
                  </button>
                  <button className="px-6 py-2 border border-border hover:bg-muted transition-all duration-phi-fast rounded-md">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Typography Tests */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Typography</h2>
            <div className="p-6 bg-card border border-border rounded-lg space-y-4">
              <h1 className="professional-heading-xl">Extra Large Heading</h1>
              <h2 className="professional-heading-lg">Large Heading</h2>
              <h3 className="professional-heading-md">Medium Heading</h3>
              <p className="professional-body">
                This is professional body text with proper line height and spacing
                optimized using mathematical ratios for maximum readability.
              </p>
              <p className="text-muted-foreground text-sm">
                Muted secondary text for descriptions and metadata.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}