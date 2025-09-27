import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // Performance optimizations
  corePlugins: {
    preflight: true,
  },

  // Reduce CSS size by removing unused utilities
  future: {
    hoverOnlyWhenSupported: true,
  },
  safelist: [
    // Force include color variants that might not be detected
    'bg-primary-50', 'bg-primary-100', 'bg-primary-200', 'bg-primary-300', 'bg-primary-400', 'bg-primary-500', 'bg-primary-600', 'bg-primary-700', 'bg-primary-800', 'bg-primary-900',
    'bg-success-50', 'bg-success-100', 'bg-success-200', 'bg-success-300', 'bg-success-400', 'bg-success-500', 'bg-success-600', 'bg-success-700', 'bg-success-800', 'bg-success-900',
    'bg-warning-50', 'bg-warning-100', 'bg-warning-200', 'bg-warning-300', 'bg-warning-400', 'bg-warning-500', 'bg-warning-600', 'bg-warning-700', 'bg-warning-800', 'bg-warning-900',
    'bg-danger-50', 'bg-danger-100', 'bg-danger-200', 'bg-danger-300', 'bg-danger-400', 'bg-danger-500', 'bg-danger-600', 'bg-danger-700', 'bg-danger-800', 'bg-danger-900',
    'text-primary-50', 'text-primary-100', 'text-primary-200', 'text-primary-300', 'text-primary-400', 'text-primary-500', 'text-primary-600', 'text-primary-700', 'text-primary-800', 'text-primary-900',
    'text-success-50', 'text-success-100', 'text-success-200', 'text-success-300', 'text-success-400', 'text-success-500', 'text-success-600', 'text-success-700', 'text-success-800', 'text-success-900',
    'text-warning-50', 'text-warning-100', 'text-warning-200', 'text-warning-300', 'text-warning-400', 'text-warning-500', 'text-warning-600', 'text-warning-700', 'text-warning-800', 'text-warning-900',
    'text-danger-50', 'text-danger-100', 'text-danger-200', 'text-danger-300', 'text-danger-400', 'text-danger-500', 'text-danger-600', 'text-danger-700', 'text-danger-800', 'text-danger-900',
    'border-primary-50', 'border-primary-100', 'border-primary-200', 'border-primary-300', 'border-primary-400', 'border-primary-500', 'border-primary-600', 'border-primary-700', 'border-primary-800', 'border-primary-900',
    'border-success-50', 'border-success-100', 'border-success-200', 'border-success-300', 'border-success-400', 'border-success-500', 'border-success-600', 'border-success-700', 'border-success-800', 'border-success-900',
    'border-warning-50', 'border-warning-100', 'border-warning-200', 'border-warning-300', 'border-warning-400', 'border-warning-500', 'border-warning-600', 'border-warning-700', 'border-warning-800', 'border-warning-900',
    'border-danger-50', 'border-danger-100', 'border-danger-200', 'border-danger-300', 'border-danger-400', 'border-danger-500', 'border-danger-600', 'border-danger-700', 'border-danger-800', 'border-danger-900',
    'hover:bg-primary-50', 'hover:bg-primary-100', 'hover:bg-primary-200', 'hover:bg-primary-300', 'hover:bg-primary-400', 'hover:bg-primary-500', 'hover:bg-primary-600', 'hover:bg-primary-700', 'hover:bg-primary-800', 'hover:bg-primary-900',
    'hover:bg-success-50', 'hover:bg-success-100', 'hover:bg-success-200', 'hover:bg-success-300', 'hover:bg-success-400', 'hover:bg-success-500', 'hover:bg-success-600', 'hover:bg-success-700', 'hover:bg-success-800', 'hover:bg-success-900',
    'hover:bg-warning-50', 'hover:bg-warning-100', 'hover:bg-warning-200', 'hover:bg-warning-300', 'hover:bg-warning-400', 'hover:bg-warning-500', 'hover:bg-warning-600', 'hover:bg-warning-700', 'hover:bg-warning-800', 'hover:bg-warning-900',
    'hover:bg-danger-50', 'hover:bg-danger-100', 'hover:bg-danger-200', 'hover:bg-danger-300', 'hover:bg-danger-400', 'hover:bg-danger-500', 'hover:bg-danger-600', 'hover:bg-danger-700', 'hover:bg-danger-800', 'hover:bg-danger-900',
    // Shadow classes
    'shadow-cs-default', 'shadow-cs-sm', 'shadow-cs-md', 'shadow-cs-lg', 'shadow-cs-xl'
  ],
  theme: {
    extend: {
      // Mathematical constants for professional design
      spacing: {
        'phi': 'calc(var(--phi) * 1rem)',
        'phi-sm': 'calc(var(--phi) * 0.5rem)',
        'phi-lg': 'calc(var(--phi) * 1.5rem)',
        'phi-xl': 'calc(var(--phi) * 2rem)',
      },
      // Professional color system using CSS variables
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#4169E1",
          foreground: "#ffffff",
          50: "#f0f2ff",
          100: "#e1e6ff",
          200: "#c9d2ff",
          300: "#a5b4ff",
          400: "#818dff",
          500: "#4169E1",
          600: "#3751cd",
          700: "#2d3eb8",
          800: "#253294",
          900: "#1f2777",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "#22c55e",
          foreground: "#ffffff",
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        warning: {
          DEFAULT: "#eab308",
          foreground: "#ffffff",
          50: "#fefce8",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        danger: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
        neutral: {
          50: "hsl(0 0 98)",
          100: "hsl(0 0 96)",
          200: "hsl(0 0 90)",
          300: "hsl(0 0 83)",
          400: "hsl(0 0 64)",
          500: "hsl(0 0 45)",
          600: "hsl(0 0 32)",
          700: "hsl(0 0 25)",
          800: "hsl(0 0 15)",
          900: "hsl(0 0 9)",
        },
      },
      // Mathematical animation durations
      transitionDuration: {
        'phi-fast': '160ms',   // phi^-1 * 260ms
        'phi-medium': '260ms', // base
        'phi-slow': '420ms',   // phi * 260ms
      },
      // Professional border radius
      borderRadius: {
        DEFAULT: "var(--radius)",
        lg: "calc(var(--radius) * 1.5)",
        md: "var(--radius)",
        sm: "calc(var(--radius) * 0.75)",
      },
      // Professional shadows
      boxShadow: {
        'professional-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'professional': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'professional-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'professional-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'professional-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        // Additional shadows used in components
        'cs-default': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'cs-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'cs-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'cs-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'cs-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "professional-gradient": "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
