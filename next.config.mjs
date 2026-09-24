/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "cdn.akamai.steamstatic.com", "shared.cloudflare.steamstatic.com"],
  },
};

export default nextConfig;
