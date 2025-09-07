"use client"

import { useState, useEffect, useRef } from "react"

export function useWebSocket(url: string) {
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    const connect = () => {
      try {
        ws.current = new WebSocket(url)

        ws.current.onopen = () => {
          setConnected(true)
          console.log("WebSocket connected")
        }

        ws.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            setMessages((prev) => [data, ...prev].slice(0, 50)) // Keep last 50 messages
          } catch (e) {
            console.error("Failed to parse WebSocket message:", e)
          }
        }

        ws.current.onclose = () => {
          setConnected(false)
          console.log("WebSocket disconnected")
          // Attempt to reconnect after 3 seconds
          setTimeout(connect, 3000)
        }

        ws.current.onerror = (error) => {
          console.error("WebSocket error:", error)
          setConnected(false)
        }
      } catch (error) {
        console.error("Failed to create WebSocket connection:", error)
        setConnected(false)
        // Attempt to reconnect after 3 seconds
        setTimeout(connect, 3000)
      }
    }

    connect()

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [url])

  return { connected, messages }
}
