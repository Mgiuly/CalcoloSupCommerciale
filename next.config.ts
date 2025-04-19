import { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const config: NextConfig = {
  output: 'standalone',
  compress: true,
  env: {
    NODE_ENV: process.env.NODE_ENV || 'development'
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  typescript: {
    ignoreBuildErrors: false
  },
  swcMinify: true,
  images: {
    unoptimized: true
  }
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(config);
