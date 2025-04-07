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

// Configure for GitHub Pages deployment
if (process.env.NODE_ENV === 'production') {
  // If deploying to GitHub Pages with custom domain
  nextConfig.assetPrefix = 'https://profile.oakcodeandtechsolutions.com';
}

export default nextConfig;
