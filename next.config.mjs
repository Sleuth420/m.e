import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'oakcodeandtechsolutions.com' }],
        destination: 'https://www.oakcodeandtechsolutions.com/:path*',
        permanent: true,
      },
      {
        source: '/services/emergency-electrician-melbourne',
        destination: '/services/electrician-melbourne',
        permanent: true,
      },
      {
        source: '/services/24-hour-electrician-melbourne',
        destination: '/services/electrician-melbourne',
        permanent: true,
      },
      {
        source: '/services/website-development-melbourne',
        destination: '/services/web-developer-melbourne',
        permanent: true,
      },
      {
        source: '/services/custom-web-development-melbourne',
        destination: '/services/web-developer-melbourne',
        permanent: true,
      },
      {
        source: '/services/app-developer-melbourne',
        destination: '/services/app-development-melbourne',
        permanent: true,
      },
      {
        source: '/services/software-developer-melbourne',
        destination: '/services/app-development-melbourne',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "upgrade-insecure-requests; default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' https: data:; font-src 'self' data: https:; connect-src 'self' https:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
