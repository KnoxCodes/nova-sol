"use client"

import { useState, useEffect } from "react"
import { useWebSocket, ConnectionState } from "../../hooks/useWebSocket"
import { Activity, Search, Wifi, WifiOff, Copy, ExternalLink, RefreshCw, AlertTriangle, Play } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

type TokenData = {
  mint: string
  name: string
  symbol: string
  uri: string
}

const demoTokens: TokenData[] = [
  {
    mint: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    name: "PEPE",
    symbol: "PEPE",
    uri: "https://cf-ipfs.com/ipfs/QmWmyoMoctfbAaiEs2G46gpeUmhqFRDW6KWo64y5r581Vz",
  },
  {
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    name: "Bonk",
    symbol: "BONK",
    uri: "https://cf-ipfs.com/ipfs/QmNjvQzKsqxgtFqAn7QxHDzHbGruHwkNLt7Eqg7qdoVXjK",
  },
  {
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    name: "USD Coin",
    symbol: "USDC",
    uri: "https://cf-ipfs.com/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
  },
]

export default function Cosmo() {
  const { connected, connectionState, messages, error, reconnect } = useWebSocket("ws://localhost:8080/connect")
  const [searchQuery, setSearchQuery] = useState("")
  const [demoMode, setDemoMode] = useState(false)
  const [displayMessages, setDisplayMessages] = useState<TokenData[]>([])

  useEffect(() => {
    if (connected) {
      setDisplayMessages(messages)
      setDemoMode(false)
    } else if (demoMode) {
      setDisplayMessages(demoTokens)
    } else {
      setDisplayMessages(messages)
    }
  }, [connected, messages, demoMode])

  const filteredMessages = displayMessages.filter((token: TokenData) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      token.name?.toLowerCase().includes(query) ||
      token.symbol?.toLowerCase().includes(query) ||
      token.mint?.toLowerCase().includes(query)
    )
  })

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${label} copied successfully`,
      variant: "success",
    })
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Live Token Feed
            </h1>
            <p className="text-gray-400">Discover new PumpFun tokens as they're created on Solana in real-time</p>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl glass-card ${
                connected
                  ? "border-green-500/30"
                  : connectionState === ConnectionState.CONNECTING
                    ? "border-yellow-500/30"
                    : connectionState === ConnectionState.ERROR
                      ? "border-red-500/30"
                      : demoMode
                        ? "border-blue-500/30"
                        : "border-gray-500/30"
              }`}
            >
              {connectionState === ConnectionState.CONNECTING ? (
                <>
                  <RefreshCw className="h-4 w-4 text-yellow-400 animate-spin" />
                  <span className="text-yellow-400 font-medium">Connecting...</span>
                  <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
                </>
              ) : connected ? (
                <>
                  <Wifi className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-medium">Connected</span>
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                </>
              ) : demoMode ? (
                <>
                  <Play className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 font-medium">Demo Mode</span>
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                </>
              ) : connectionState === ConnectionState.ERROR ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-red-400 font-medium">Error</span>
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400 font-medium">Disconnected</span>
                  <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                </>
              )}
            </div>

            <Badge
              variant="outline"
              className={`${demoMode ? "border-blue-500/30 text-blue-400 bg-blue-500/10" : "border-cyan-500/30 text-cyan-400 bg-cyan-500/10"}`}
            >
              <Activity className="h-3 w-3 mr-1" />
              {demoMode ? "DEMO" : "LIVE"}
            </Badge>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tokens by name, symbol, or mint address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-black/20 border-white/10 focus:border-cyan-500/50 text-white placeholder:text-gray-500"
          />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-4 text-sm text-gray-400">
          <span>
            Total Tokens: <span className="text-cyan-400 font-medium">{displayMessages.length}</span>
          </span>
          <span>
            Filtered: <span className="text-purple-400 font-medium">{filteredMessages.length}</span>
          </span>
          {demoMode && <span className="text-blue-400 font-medium">• Demo Data</span>}
        </div>
      </div>

      {/* Token Feed */}
      <div className="space-y-6">
        {!connected && !demoMode && (
          <Card
            className={`glass-card p-6 ${
              connectionState === ConnectionState.ERROR
                ? "border-red-500/30"
                : connectionState === ConnectionState.CONNECTING
                  ? "border-yellow-500/30"
                  : "border-yellow-500/30"
            }`}
          >
            <div
              className={`flex items-start gap-3 ${
                connectionState === ConnectionState.ERROR
                  ? "text-red-400"
                  : connectionState === ConnectionState.CONNECTING
                    ? "text-yellow-400"
                    : "text-yellow-400"
              }`}
            >
              {connectionState === ConnectionState.CONNECTING ? (
                <RefreshCw className="h-5 w-5 animate-spin mt-0.5" />
              ) : connectionState === ConnectionState.ERROR ? (
                <AlertTriangle className="h-5 w-5 mt-0.5" />
              ) : (
                <WifiOff className="h-5 w-5 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold">
                  {connectionState === ConnectionState.CONNECTING
                    ? "Connecting to Backend..."
                    : connectionState === ConnectionState.ERROR
                      ? "Connection Error"
                      : "Backend Not Connected"}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{error || "The Go backend server is not running"}</p>


                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  {connectionState === ConnectionState.ERROR && (
                    <Button
                      onClick={reconnect}
                      size="sm"
                      className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-cyan-400 border border-cyan-500/30"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry Connection
                    </Button>
                  )}

                  <Button
                    onClick={() => setDemoMode(true)}
                    size="sm"
                    className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 text-blue-400 border border-blue-500/30"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Try Demo Mode
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Demo Mode Banner */}
        {demoMode && !connected && (
          <Card className="glass-card border-blue-500/30 p-4">
            <div className="flex items-center gap-3 text-blue-400">
              <Play className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Demo Mode Active</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Showing sample tokens. Start the Go backend to see real-time PumpFun data.
                </p>
              </div>
              <Button
                onClick={() => setDemoMode(false)}
                size="sm"
                variant="outline"
                className="ml-auto border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
              >
                Exit Demo
              </Button>
            </div>
          </Card>
        )}

        {(connected || demoMode) && filteredMessages.length === 0 && !searchQuery && (
          <Card className="glass-card border-cyan-500/30 p-8 text-center">
            <Activity className="h-12 w-12 text-cyan-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {demoMode ? "Demo Tokens Ready" : "Waiting for tokens..."}
            </h3>
            <p className="text-gray-400">
              {demoMode
                ? "Explore the interface with sample token data"
                : "New PumpFun tokens will appear here as they're created on Solana"}
            </p>
          </Card>
        )}

        {(connected || demoMode) && filteredMessages.length === 0 && searchQuery && (
          <Card className="glass-card border-purple-500/30 p-8 text-center">
            <Search className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No tokens found</h3>
            <p className="text-gray-400">Try adjusting your search query</p>
          </Card>
        )}

        {/* Token Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMessages.map((token: TokenData, index: number) => (
            <Card
              key={token.mint ?? index}
              className={`glass-card border-white/10 hover:border-cyan-500/30 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4 ${
                demoMode ? "border-blue-500/20" : ""
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-6">
                {/* Demo Badge */}
                {demoMode && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-xs">
                      DEMO
                    </Badge>
                  </div>
                )}

                {/* Token Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img
                      src="/digital-token.png"
                      alt={token.symbol ?? "Token"}
                      width={48}
                      height={48}
                      className="rounded-xl border border-white/10 group-hover:border-cyan-500/30 transition-colors"
                    />
                    <div
                      className={`absolute -top-1 -right-1 h-3 w-3 rounded-full animate-pulse ${
                        demoMode ? "bg-blue-500" : "bg-green-500"
                      }`}
                    ></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
                      {token.name ?? "Unknown Token"}
                    </h3>
                    {token.symbol && (
                      <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/10 mt-1">
                        {token.symbol}
                      </Badge>
                    )}
                  </div>
                </div>

                {token.uri && (
                  <div className="mb-4">
                    <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Metadata URI</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 text-xs bg-black/30 text-purple-400 px-3 py-2 rounded-lg border border-white/10 font-mono truncate">
                        {token.uri}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-purple-500/20 hover:text-purple-400"
                        onClick={() => window.open(token.uri, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Mint Address */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Mint Address</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 text-xs bg-black/30 text-cyan-400 px-3 py-2 rounded-lg border border-white/10 font-mono truncate">
                        {token.mint ?? "—"}
                      </code>
                      {token.mint && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-cyan-500/20 hover:text-cyan-400"
                            onClick={() => copyToClipboard(token.mint!, "Mint address")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-purple-500/20 hover:text-purple-400"
                            onClick={() => window.open(`https://solscan.io/token/${token.mint}`, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Token Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-cyan-400 border border-cyan-500/30"
                    onClick={() => window.open(`https://pump.fun/${token.mint}`, "_blank")}
                  >
                    View on PumpFun
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      {(connected || demoMode) && displayMessages.length > 0 && (
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Showing {filteredMessages.length} of {displayMessages.length} tokens •
            {demoMode ? " Demo data for interface preview" : " Updates in real-time via PumpFun"}
          </p>
        </div>
      )}
    </div>
  )
}
