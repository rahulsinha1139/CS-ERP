/**
 * Style Test Page - Immediate verification
 */

import React from 'react';
import Head from 'next/head';

export default function TestStylesPage() {
  return (
    <>
      <Head>
        <title>Style Test - CS ERP</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Using inline styles to verify rendering */}
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#0f172a'
      }}>

        {/* Professional Header */}
        <header style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '1rem 2rem'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: '0',
            color: '#0f172a'
          }}>
            CS ERP Professional - Style Test
          </h1>
        </header>

        {/* Main Content */}
        <main style={{ padding: '2rem' }}>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '0.5rem',
              color: '#0f172a'
            }}>
              Dashboard
            </h2>
            <p style={{ color: '#64748b', margin: '0' }}>
              Business overview and key metrics for your CS practice
            </p>
          </div>

          {/* Metrics Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>

            {/* Total Revenue */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#64748b',
                  margin: '0'
                }}>
                  Total Revenue
                </h3>
                <div style={{
                  color: '#22c55e',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  ↑ 12.5%
                </div>
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#0f172a'
              }}>
                ₹8,47,500.00
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: '#64748b',
                margin: '0.25rem 0 0 0'
              }}>
                vs last month
              </p>
            </div>

            {/* Pending Invoices */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#64748b',
                  margin: '0'
                }}>
                  Pending Invoices
                </h3>
                <div style={{
                  color: '#f59e0b',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  12
                </div>
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#0f172a'
              }}>
                ₹2,85,000.00
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: '#64748b',
                margin: '0.25rem 0 0 0'
              }}>
                awaiting payment
              </p>
            </div>

          </div>

          {/* Testing Tailwind Classes */}
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#0f172a' }}>Tailwind Class Test:</h3>

            <div className="p-4 bg-blue-500 text-white rounded-lg mb-4">
              This should be blue with white text (Tailwind classes)
            </div>

            <div className="p-6 bg-card border border-border rounded-lg shadow-professional">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                Professional Card with Custom Variables
              </h3>
              <p className="text-muted-foreground">
                This should use our custom CSS variables if Tailwind is working properly.
              </p>
            </div>

            <div style={{
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginTop: '1rem'
            }}>
              This is styled with inline styles (should always work)
            </div>
          </div>

        </main>
      </div>
    </>
  );
}