/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

// Configure for GitHub Pages with custom domain
if (process.env.NODE_ENV === 'production') {
  nextConfig.assetPrefix = 'https://profile.oakcodeandtechsolutions.com';
}

export default nextConfig;
