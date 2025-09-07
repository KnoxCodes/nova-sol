import Link from "next/link"
import { Activity, Send, TrendingUp, Zap, Server } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BackendSetup } from "@/components/backend-setup"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-transparent opacity-50"></div>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <h1 className="text-6xl sm:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              Nova
            </h1>
            <div className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full glow-cyan"></div>
          </div>

          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            The next-generation Solana trading interface.
            <span className="text-cyan-400 font-semibold"> Live PumpFun token discovery</span> and
            <span className="text-purple-400 font-semibold"> seamless transfers</span> in one powerful platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            >
              <Link href="/cosmo" className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Explore Live Feed
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 px-8 py-3 rounded-xl bg-transparent"
            >
              <Link href="/transfer" className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Transfer SOL
              </Link>
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium">Network Status</span>
              </div>
              <p className="text-lg font-bold text-white">Solana Mainnet</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">PumpFun Tokens</span>
              </div>
              <p className="text-lg font-bold text-white">Real-time</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 text-purple-400 mb-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">Fast Transfers</span>
              </div>
              <p className="text-lg font-bold text-white">Instant</p>
            </div>
          </div>
        </div>
      </section>

      {/* Backend Setup Section */}
      <section className="py-8">
        <div className="mx-auto max-w-4xl">
          <BackendSetup />
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Powerful Features
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Live Token Feed Card */}
            <Card className="glass-card border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 group-hover:from-cyan-500/30 group-hover:to-cyan-600/30 transition-all duration-300">
                    <Activity className="h-8 w-8 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">PumpFun Token Feed</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm text-green-400 font-medium">LIVE</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  Discover new PumpFun tokens as they're created in real-time on Solana mainnet. Get instant access to
                  token metadata, mint addresses, and creation events through our Go backend WebSocket connection.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-400"></div>
                    <span>Real-time PumpFun program monitoring</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-400"></div>
                    <span>Go backend with Helius RPC integration</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-400"></div>
                    <span>Beautiful glassmorphism interface</span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-xl"
                >
                  <Link href="/cosmo" className="flex items-center justify-center gap-2">
                    <Activity className="h-4 w-4" />
                    View Live Feed
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Transfer SOL Card */}
            <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all duration-300">
                    <Send className="h-8 w-8 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Transfer SOL</h3>
                    <span className="text-sm text-purple-400 font-medium">Phantom Wallet</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  Send SOL tokens quickly and securely using your Phantom wallet. Features real-time USD conversion,
                  balance checking, and transaction confirmation.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                    <span>Phantom wallet integration</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                    <span>Real-time USD conversion</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                    <span>Secure transaction handling</span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl"
                >
                  <Link href="/transfer" className="flex items-center justify-center gap-2">
                    <Send className="h-4 w-4" />
                    Start Transfer
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-16 border-t border-white/10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Trading?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Connect your Phantom wallet and start exploring PumpFun tokens with Nova's powerful real-time monitoring
            tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl"
            >
              <Link href="/cosmo">Get Started</Link>
            </Button>
          </div>

          {/* Backend Required Note */}
          <div className="mt-8 p-4 glass-card border-yellow-500/30 rounded-xl">
            <div className="flex items-center justify-center gap-2 text-yellow-400 mb-2">
              <Server className="h-4 w-4" />
              <span className="text-sm font-medium">Backend Required</span>
            </div>
            <p className="text-xs text-gray-400">
              Run <code className="bg-black/30 px-2 py-1 rounded text-cyan-400">go run .</code> in the backend directory
              to start the WebSocket server for live token data.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
