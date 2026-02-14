/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Exclude problematic packages from server components
  serverComponentsExternalPackages: ['@mapbox/node-pre-gyp', 'bcrypt', 'nodemailer'],
  webpack: (config, { isServer }) => {
    // Ignore HTML files from node_modules (they shouldn't be imported)
    config.module.rules.push({
      test: /\.html$/,
      include: /node_modules/,
      type: 'asset/resource',
    });

    // Exclude native modules from client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
      };
    }

    // Ignore node-pre-gyp and related packages
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mapbox/node-pre-gyp': false,
    };

    return config;
  },
}

module.exports = nextConfig
