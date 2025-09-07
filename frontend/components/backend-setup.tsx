"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Terminal, Download } from "lucide-react"

export function BackendSetup() {
  return (
    <Card className="glass-card border-cyan-500/30 p-6 mb-8">
      <div className="flex items-start gap-4">
        <Terminal className="h-6 w-6 text-cyan-400 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">Go Backend Setup</h3>
          <p className="text-gray-400 mb-4">To see live PumpFun token data, you need to run the Go backend server.</p>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-cyan-400 mb-2">1. Install Dependencies</h4>
              <code className="block bg-black/30 text-green-400 px-4 py-2 rounded-lg text-sm font-mono">
                go mod tidy
              </code>
            </div>

            <div>
              <h4 className="text-sm font-medium text-cyan-400 mb-2">2. Run Backend Server</h4>
              <code className="block bg-black/30 text-green-400 px-4 py-2 rounded-lg text-sm font-mono">go run .</code>
            </div>

            <div>
              <h4 className="text-sm font-medium text-cyan-400 mb-2">3. Server Details</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>
                  • WebSocket endpoint: <code className="text-cyan-400">ws://localhost:8080/connect</code>
                </li>
                <li>• Streams live PumpFun token creation events</li>
                <li>• Auto-reconnects on connection loss</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 hover:from-green-500/30 hover:to-cyan-500/30 text-green-400 border border-green-500/30"
              onClick={() => window.open("https://golang.org/dl/", "_blank")}
            >
              <Download className="h-4 w-4 mr-2" />
              Install Go
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
