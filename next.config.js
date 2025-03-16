/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/m.e',
  assetPrefix: 'https://sleuth420.github.io/m.e',
  trailingSlash: true,
}

module.exports = nextConfig 