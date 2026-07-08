/** @type {import('next').NextConfig} */
const nextConfig = {
  // 允许在生产环境使用 streaming
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;
