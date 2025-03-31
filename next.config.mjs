/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  serverExternalPackages: ['mongoose'],
};

export default nextConfig;
