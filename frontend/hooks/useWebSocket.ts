"use client"

import { useState, useEffect, useRef } from "react"

export enum ConnectionState {
  CONNECTING = "connecting",
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  ERROR = "error",
}

export function useWebSocket(url: string) {
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED)
  const [messages, setMessages] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  useEffect(() => {
    const connect = () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }

      try {
        setConnectionState(ConnectionState.CONNECTING)
        setError(null)

        ws.current = new WebSocket(url)

        ws.current.onopen = () => {
          setConnectionState(ConnectionState.CONNECTED)
          setError(null)
          reconnectAttempts.current = 0
          console.log("[v0] WebSocket connected successfully")
        }

        ws.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            setMessages((prev) => [data, ...prev].slice(0, 50)) // Keep last 50 messages
            console.log("[v0] Received token data:", data)
          } catch (e) {
            console.error("[v0] Failed to parse WebSocket message:", e)
            setError("Failed to parse incoming message")
          }
        }

        ws.current.onclose = (event) => {
          setConnectionState(ConnectionState.DISCONNECTED)
          console.log("[v0] WebSocket disconnected, code:", event.code, "reason:", event.reason)

          if (reconnectAttempts.current < maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000) // Max 10 seconds
            reconnectAttempts.current++

            setError(
              `Connection lost. Reconnecting in ${delay / 1000}s... (${reconnectAttempts.current}/${maxReconnectAttempts})`,
            )

            reconnectTimeoutRef.current = setTimeout(() => {
              console.log("[v0] Attempting to reconnect...")
              connect()
            }, delay)
          } else {
            setError("Failed to connect after multiple attempts. Please check if the Go backend is running.")
            setConnectionState(ConnectionState.ERROR)
          }
        }

        ws.current.onerror = (error) => {
          console.error("[v0] WebSocket error:", error)
          setConnectionState(ConnectionState.ERROR)

          if (reconnectAttempts.current === 0) {
            setError("Cannot connect to backend server. Make sure the Go backend is running on localhost:8080")
          } else {
            setError("Connection error occurred during reconnection attempt")
          }
        }
      } catch (error) {
        console.error("[v0] Failed to create WebSocket connection:", error)
        setConnectionState(ConnectionState.ERROR)
        setError("Failed to create WebSocket connection")
      }
    }

    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [url])

  const reconnect = () => {
    reconnectAttempts.current = 0
    setError(null)
    if (ws.current) {
      ws.current.close()
    }
  }

  return {
    connected: connectionState === ConnectionState.CONNECTED,
    connectionState,
    messages,
    error,
    reconnect,
  }
}
