/**
 * Loading Screen Component
 * Modern orbital particles animation with royal blue theme
 *
 * Features:
 * - Animated orbital particles
 * - Pulsing glow effects
 * - Smooth CSS animations
 * - Professional loading message
 */

'use client';

import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  message?: string;
  progress?: number;
}

export function LoadingScreen({ message = 'Loading CS ERP System...', progress }: LoadingScreenProps) {
  const [dots, setDots] = useState('');

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-blue-600/20 animate-pulse" />
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center space-y-12">
        {/* Orbital Loader */}
        <div className="relative h-40 w-40">
          {/* Center core */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-8 w-8 rounded-full bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.8)] animate-pulse" />
          </div>

          {/* Orbiting particles */}
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2"
              style={{
                animation: `orbit ${3 + index * 0.5}s linear infinite`,
                animationDelay: `${index * 0.3}s`,
              }}
            >
              <div
                className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]"
                style={{
                  filter: 'blur(0.5px)',
                }}
              />
            </div>
          ))}

          {/* Outer ring glow */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-0 rounded-full border border-blue-400/40" />
        </div>

        {/* Loading text */}
        <div className="text-center space-y-4">
          <p className="text-xl font-medium text-blue-100">
            {message}{dots}
          </p>

          {/* Progress bar (if provided) */}
          {progress !== undefined && (
            <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Subtext */}
          <p className="text-sm text-blue-300/70">
            Initializing your workspace
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-blue-500/50"
              style={{
                animation: `bounce 1.4s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes orbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Simple Loading Spinner (lightweight alternative)
 */
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="h-full w-full animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
    </div>
  );
}
