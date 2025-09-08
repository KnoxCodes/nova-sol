/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Add your deployed backend URL
  env: {
    NEXT_PUBLIC_BACKEND_WS_URL: process.env.NEXT_PUBLIC_BACKEND_WS_URL || 'https://nova-sol.onrender.com',
    NEXT_PUBLIC_HELIUS_RPC: process.env.NEXT_PUBLIC_HELIUS_RPC,
    NEXT_PUBLIC_COINGECKO_SIMPLE_PRICE: process.env.NEXT_PUBLIC_COINGECKO_SIMPLE_PRICE || 'https://api.coingecko.com/api/v3/simple/price'
  }
}

module.exports = nextConfig
