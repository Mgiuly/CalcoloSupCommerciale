import { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const config: NextConfig = {
  output: 'standalone',
  compress: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  typescript: {
    ignoreBuildErrors: false
  },
  images: {
    unoptimized: true
  }
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(config);
