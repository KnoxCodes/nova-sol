"use client"

import { Navigation } from "./navigation"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                <span className="text-black font-bold text-sm">N</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Nova
              </h1>
            </div>
          </div>

          <Navigation />

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-400">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Solana Devnet</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
