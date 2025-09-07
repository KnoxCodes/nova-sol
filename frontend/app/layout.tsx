import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Header } from "@/components/layout/header"
import { Toaster } from "@/components/ui/toaster"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Nova - Solana Trading Interface",
  description: "Modern Solana token trading and transfer interface",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <div className="min-h-screen bg-background relative">
          <AnimatedBackground />
          <Suspense fallback={<div>Loading...</div>}>
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">{children}</main>
          </Suspense>
        </div>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
