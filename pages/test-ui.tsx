/**
 * Simple UI Test Page - Debug CSS and component issues
 */

import React from 'react';
import Head from 'next/head';

export default function TestUI() {
  return (
    <>
      <Head>
        <title>UI Test - CS ERP</title>
      </Head>

      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Test Basic Styling */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-foreground mb-4">UI Component Test</h1>
            <p className="text-muted-foreground mb-4">Testing if CSS classes are working correctly</p>
          </div>

          {/* Test Color System */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Blue 500</div>
              <div className="text-sm opacity-90">Standard Tailwind Blue</div>
            </div>
            <div className="bg-green-500 text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Green 500</div>
              <div className="text-sm opacity-90">Standard Tailwind Green</div>
            </div>
            <div className="bg-yellow-500 text-black p-4 rounded-lg text-center">
              <div className="font-semibold">Yellow 500</div>
              <div className="text-sm opacity-90">Standard Tailwind Yellow</div>
            </div>
            <div className="bg-red-500 text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Red 500</div>
              <div className="text-sm opacity-90">Standard Tailwind Red</div>
            </div>
          </div>

          {/* Test Custom Colors */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-primary-500 text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Primary 500</div>
              <div className="text-sm opacity-90">Custom Primary (should be blue)</div>
            </div>
            <div className="bg-success-500 text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Success 500</div>
              <div className="text-sm opacity-90">Custom Success (should be green)</div>
            </div>
            <div className="bg-warning-500 text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Warning 500</div>
              <div className="text-sm opacity-90">Custom Warning (should be yellow)</div>
            </div>
            <div className="bg-danger-500 text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Danger 500</div>
              <div className="text-sm opacity-90">Custom Danger (should be red)</div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="bg-card border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Button Tests</h2>
            <div className="flex gap-4 flex-wrap">
              <button
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                onClick={() => alert('Button 1 clicked!')}
              >
                Primary Button
              </button>
              <button
                className="bg-success-500 text-white px-4 py-2 rounded-lg hover:bg-success-600 transition-colors"
                onClick={() => alert('Button 2 clicked!')}
              >
                Success Button
              </button>
              <button
                className="border border-border bg-background text-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => alert('Button 3 clicked!')}
              >
                Outline Button
              </button>
            </div>
          </div>

          {/* Test Layout */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-card border rounded-lg p-6 shadow-cs-default">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-primary-500 rounded"></div>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Card 1</h3>
              <p className="text-muted-foreground text-sm">Testing card layout and shadows</p>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-cs-default">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-success-500 rounded"></div>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Card 2</h3>
              <p className="text-muted-foreground text-sm">Testing card layout and shadows</p>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-cs-default">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-warning-500 rounded"></div>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Card 3</h3>
              <p className="text-muted-foreground text-sm">Testing card layout and shadows</p>
            </div>
          </div>

          {/* Debug Info */}
          <div className="bg-gray-100 border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Debug Information</h3>
            <div className="space-y-2 text-sm font-mono">
              <div>Tailwind CSS Status: <span className="text-green-600">Should be styled if working</span></div>
              <div>Custom Colors: <span className="text-primary-600">Primary</span> | <span className="text-success-600">Success</span> | <span className="text-warning-600">Warning</span></div>
              <div>Background: <span className="bg-background px-2 py-1 rounded">Background Color</span></div>
              <div>Foreground: <span className="text-foreground px-2 py-1 rounded bg-muted">Foreground Color</span></div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}