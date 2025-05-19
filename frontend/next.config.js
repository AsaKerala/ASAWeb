/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Add hot reload options
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300, // Delay before rebuilding
      ignored: ['**/node_modules', '**/.git', '**/.next']
    };
    return config;
  },
  // Ensure Next.js watches for file changes
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 4,
  },
  // Optimize for Docker environment
  output: 'standalone',
  
  // Configure allowed image domains
  images: {
    domains: ['localhost', '127.0.0.1', 'cluster0.ebg70lj.mongodb.net', 'asakeralaweb.vercel.app', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: '**.mongodb.net',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  
  // Add redirects for legacy routes
  async redirects() {
    return [
      // Redirect old events/programs route to separate pages
      {
        source: '/programs-events',
        destination: '/programs',
        permanent: true,
      },
      {
        source: '/programs-events/:path*',
        destination: '/events/:path*',
        permanent: true,
      },
      // Handle any other legacy paths
      {
        source: '/program/:slug',
        destination: '/programs/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig; 