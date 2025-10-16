/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // Standalone output for Electron - minimal server with only runtime dependencies
  output: 'standalone',

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  images: {
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
