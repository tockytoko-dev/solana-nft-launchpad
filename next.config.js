/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Image optimization configuration
  images: {
    domains: [
      'arweave.net',
      'gateway.arweave.co',
      'ar-io.dev',
      'arweave.app',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.arweave.net',
      },
      {
        protocol: 'https',
        hostname: '**.ar-io.dev',
      },
      {
        protocol: 'https',
        hostname: 'gateway.arweave.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Webpack configuration with fallbacks
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
      path: require.resolve('path-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      util: require.resolve('util'),
      assert: require.resolve('assert'),
      url: require.resolve('url'),
    };

    // Handle .node files
    config.module.rules.push({
      test: /\.node$/,
      use: [
        {
          loader: 'node-loader',
        },
      ],
    });

    return config;
  },

  // Headers configuration
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
    ];
  },

  // Redirects configuration (optional)
  async redirects() {
    return [];
  },

  // Environment variables (can be expanded as needed)
  env: {
    NEXT_PUBLIC_ARWEAVE_GATEWAY: process.env.NEXT_PUBLIC_ARWEAVE_GATEWAY || 'https://arweave.net',
  },
};

module.exports = nextConfig;
