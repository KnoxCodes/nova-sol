/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Add your deployed backend URL
  env: {
    NEXT_PUBLIC_BACKEND_WS_URL: process.env.NEXT_PUBLIC_BACKEND_WS_URL || 'wss://your-backend-url.railway.app/connect',
    NEXT_PUBLIC_HELIUS_RPC: process.env.NEXT_PUBLIC_HELIUS_RPC || 'https://devnet.helius-rpc.com/?api-key=0f803376-0189-4d72-95f6-a5f41cef157d',
    NEXT_PUBLIC_COINGECKO_SIMPLE_PRICE: process.env.NEXT_PUBLIC_COINGECKO_SIMPLE_PRICE || 'https://api.coingecko.com/api/v3/simple/price'
  }
}

module.exports = nextConfig