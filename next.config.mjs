/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  images: {
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
