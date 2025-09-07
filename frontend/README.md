# Nova - Solana Trading Interface

A modern, real-time Solana token trading interface with PumpFun integration.

## Features

- **Live PumpFun Token Feed**: Real-time monitoring of new token creations on Solana mainnet
- **Phantom Wallet Integration**: Secure SOL transfers with balance checking and USD conversion
- **Modern UI**: Cyberpunk-inspired design with glassmorphism effects and smooth animations
- **WebSocket Backend**: Go backend with Helius RPC integration for real-time data streaming

## Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with custom cyberpunk theme
- **Components**: shadcn/ui with custom glassmorphism effects
- **WebSocket**: Real-time connection to Go backend

### Backend (Go)
- **WebSocket Server**: Handles client connections and message broadcasting
- **Solana Integration**: Connects to Helius RPC for mainnet data
- **PumpFun Monitoring**: Listens for token creation events on PumpFun program
- **Data Processing**: Borsh decoding and event filtering

## Getting Started

### Prerequisites
- Node.js 18+ 
- Go 1.21+
- Phantom Wallet browser extension

### Backend Setup
1. Navigate to the backend directory
2. Install dependencies:
   \`\`\`bash
   go mod tidy
   \`\`\`
3. Start the server:
   \`\`\`bash
   go run .
   \`\`\`
4. Server will start on `localhost:8080` with WebSocket endpoint at `/connect`

### Frontend Setup
1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
3. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

### Frontend
- `NEXT_PUBLIC_HELIUS_RPC` - Helius RPC endpoint (optional, for additional features)
- `NEXT_PUBLIC_COINGECKO_SIMPLE_PRICE` - CoinGecko API for price data (optional)

### Backend
The Go backend uses a hardcoded Helius API key. For production, move this to an environment variable.

## Usage

1. **Start Backend**: Run `go run .` in the backend directory
2. **Start Frontend**: Run `npm run dev` in the frontend directory  
3. **Connect Wallet**: Use Phantom wallet for SOL transfers
4. **Monitor Tokens**: Visit `/cosmo` to see live PumpFun token creations
5. **Transfer SOL**: Visit `/transfer` to send SOL with your Phantom wallet

## API Endpoints

### WebSocket
- `ws://localhost:8080/connect` - Real-time token creation events

### Token Data Format
\`\`\`json
{
  "name": "Token Name",
  "symbol": "SYMBOL", 
  "uri": "https://metadata-uri.com",
  "mint": "mint-address-string"
}
\`\`\`

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Go, Gorilla WebSocket, Solana Go SDK
- **Blockchain**: Solana mainnet via Helius RPC
- **Wallet**: Phantom wallet integration
- **Real-time**: WebSocket connections for live data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## License

MIT License - see LICENSE file for details
