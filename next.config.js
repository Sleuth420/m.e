/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

// Only add basePath and assetPrefix when building for production/GitHub Pages
if (process.env.NODE_ENV === 'production') {
  nextConfig.basePath = '/m.e';
  nextConfig.assetPrefix = 'https://sleuth420.github.io/m.e';
}

module.exports = nextConfig;
