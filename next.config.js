/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['frontend-take-home.fetch.com'],
      },
        // Define the `exportPathMap` function
      exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
        return {
          // Add the path for the favicon
          '/favicon.ico': { page: '/favicon.ico' },
          // Add any other paths you need to map
          // ...
          ...defaultPathMap,
        };
      },
}

module.exports = nextConfig
