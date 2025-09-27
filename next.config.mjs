/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduce bundle size
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
      preventFullImport: true,
    },
  },

  // Turbopack configuration
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Experimental optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-slot'],
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      // Production optimizations
      config.resolve.alias = {
        ...config.resolve.alias,
        '@react-pdf/renderer': '@react-pdf/renderer/lib/react-pdf.browser.cjs.js',
      };

      // Exclude testing files from production bundle
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/testing': false,
        'src/testing': false,
      };

      // Advanced tree shaking for smaller bundles
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    // Reduce bundle size
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Performance optimizations for development
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };

      // Optimize module resolution
      config.resolve.symlinks = false;
    }

    return config;
  },
};

export default nextConfig;
