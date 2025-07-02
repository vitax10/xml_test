// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/xml_test', 
  images: {
    unoptimized: true,
  },
};

export default nextConfig;