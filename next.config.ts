import { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import path from 'path';
import fs from 'fs';

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
  webpack: (config, { isServer }) => {
    // Exclude source map files
    config.module.rules.push({
      test: /\.map$/,
      use: ['ignore-loader'],
    });

    // Handle Puppeteer dependencies
    config.externals = [...(config.externals || []), 'puppeteer', 'puppeteer-core'];

    if (isServer) {
      config.plugins.push({
        apply: (compiler: any) => {
          compiler.hooks.afterEmit.tapAsync(
            'CopyChromiumPlugin',
            (compilation: any, callback: () => void) => {
              const chromiumPath = require.resolve('@sparticuz/chromium-min');
              const chromiumDir = path.dirname(chromiumPath);
              const targetDir = path.join(process.cwd(), '.next/server/chunks/chromium');

              // Create target directory if it doesn't exist
              if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
              }

              // Copy chromium files
              fs.cpSync(chromiumDir, targetDir, { recursive: true });
              callback();
            }
          );
        },
      });
    }

    return config;
  }
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(config);
