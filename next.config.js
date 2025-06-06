/** @type {import('next').NextConfig} */
module.exports = nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};
