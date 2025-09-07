"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, Home, Send } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Live Feed", href: "/cosmo", icon: Activity },
  { name: "Transfer", href: "/transfer", icon: Send },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-6">
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              "hover:bg-white/10 hover:text-cyan-400",
              isActive ? "bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/25" : "text-gray-300",
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
