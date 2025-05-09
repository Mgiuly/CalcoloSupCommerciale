import { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const config: NextConfig = {
  output: 'standalone',
  compress: true,
  env: {
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000', 'localhost:3002']
    }
  },
  webpack: (config) => {
    // Exclude source map files
    config.module.rules.push({
      test: /\.map$/,
      use: ['ignore-loader'],
    });

    // Handle Puppeteer dependencies
    config.externals = [...(config.externals || []), 'puppeteer', 'puppeteer-core'];

    return config;
  }
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(config);
