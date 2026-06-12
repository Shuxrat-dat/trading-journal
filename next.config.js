/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Allow serving files from /public/uploads
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
