/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Add security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://profile.oakcodeandtechsolutions.com',
          },
          {
            key: 'Content-Security-Policy',
            value: "upgrade-insecure-requests; default-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' https: data:; font-src 'self' https: data:;",
          },
        ],
      },
    ];
  },
};

// Only add basePath when building for production/GitHub Pages
if (process.env.NODE_ENV === 'production') {
  // Remove basePath and update assetPrefix for custom domain
  nextConfig.assetPrefix = 'https://profile.oakcodeandtechsolutions.com';
}

module.exports = nextConfig;
