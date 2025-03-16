/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/m.e',
  assetPrefix: '/m.e/',
  trailingSlash: true,
}

module.exports = nextConfig 