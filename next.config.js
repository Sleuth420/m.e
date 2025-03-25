/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

// Configure for production with custom domain
if (process.env.NODE_ENV === 'production') {
  nextConfig.assetPrefix = 'https://profile.oakcodeandtechsolutions.com';
}

module.exports = nextConfig; 