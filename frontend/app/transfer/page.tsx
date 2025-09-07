"use client"

import { useEffect, useState } from "react"
import { PublicKey, Connection, Transaction, SystemProgram } from "@solana/web3.js"
import axios from "axios"
import { Wallet, Send, DollarSign, AlertCircle, CheckCircle, Loader2, Copy, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { isValidSolanaAddress, solToLamports } from "../../utils/sol"

const HELIUS_RPC =
  process.env.NEXT_PUBLIC_HELIUS_RPC || "https://devnet.helius-rpc.com/?api-key=0f803376-0189-4d72-95f6-a5f41cef157d"
const COINGECKO_SIMPLE_PRICE =
  process.env.NEXT_PUBLIC_COINGECKO_SIMPLE_PRICE || "https://api.coingecko.com/api/v3/simple/price"

interface SolanaProvider {
  isPhantom?: boolean
  isConnected?: boolean
  publicKey?: PublicKey
  connect: () => Promise<{ publicKey: PublicKey }>
  disconnect: () => Promise<void>
  on: (event: string, handler: (args: any) => void) => void
  signTransaction: (tx: Transaction) => Promise<Transaction>
}

declare global {
  interface Window {
    solana?: SolanaProvider
  }
}

export default function TransferPage() {
  const [providerAvailable, setProviderAvailable] = useState(false)
  const [walletPubkey, setWalletPubkey] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)
  const [loadingBalance, setLoadingBalance] = useState(false)

  const [amountSol, setAmountSol] = useState("")
  const [toAddress, setToAddress] = useState("")
  const [showUsd, setShowUsd] = useState(true)
  const [solPriceUsd, setSolPriceUsd] = useState<number | null>(null)
  const [fetchingPrice, setFetchingPrice] = useState(false)
  const [sending, setSending] = useState(false)
  const [lastTxSignature, setLastTxSignature] = useState<string | null>(null)

  useEffect(() => {
    setProviderAvailable(!!window?.solana?.isPhantom)
    if (window?.solana?.isPhantom) {
      if (window.solana.on) {
        window.solana.on("connect", (publicKey: any) => {
          const key = publicKey?.toString?.() || window.solana?.publicKey?.toString()
          setWalletPubkey(key || null)
        })

        window.solana.on("disconnect", () => {
          setWalletPubkey(null)
          setBalance(null)
        })
      }

      if (window.solana.isConnected && window.solana.publicKey) {
        setWalletPubkey(window.solana.publicKey.toString())
      }
    }
  }, [])

  useEffect(() => {
    fetchSolPrice()
  }, [])

  useEffect(() => {
    if (walletPubkey) {
      fetchBalance()
    }
  }, [walletPubkey])

  async function fetchSolPrice() {
    setFetchingPrice(true)
    try {
      const res = await axios.get(`${COINGECKO_SIMPLE_PRICE}?ids=solana&vs_currencies=usd`)
      const price = res.data?.solana?.usd
      if (price) setSolPriceUsd(price)
    } catch (e) {
      console.error("CoinGecko error", e)
      toast({
        title: "Price fetch failed",
        description: "Could not fetch SOL price from CoinGecko",
        variant: "destructive",
      })
    } finally {
      setFetchingPrice(false)
    }
  }

  async function fetchBalance() {
    if (!walletPubkey) return
    setLoadingBalance(true)
    try {
      const connection = new Connection(HELIUS_RPC, "confirmed")
      const publicKey = new PublicKey(walletPubkey)
      const balanceInLamports = await connection.getBalance(publicKey)
      setBalance(balanceInLamports / 1_000_000_000) // Convert to SOL
    } catch (e) {
      console.error("Balance fetch error", e)
      toast({
        title: "Balance fetch failed",
        description: "Could not fetch wallet balance",
        variant: "destructive",
      })
    } finally {
      setLoadingBalance(false)
    }
  }

  async function connectWallet() {
    if (!window.solana) {
      toast({
        title: "Phantom not found",
        description: "Please install the Phantom browser extension",
        variant: "destructive",
      })
      return
    }
    try {
      setConnecting(true)
      const resp = await window.solana.connect()
      const pub = resp.publicKey?.toString?.() ?? window.solana.publicKey?.toString?.()
      setWalletPubkey(pub || null)
      if (pub) {
        toast({
          title: "Wallet connected",
          description: `Connected to ${pub.slice(0, 4)}...${pub.slice(-4)}`,
          variant: "success",
        })
      }
    } catch (e) {
      console.error("connect error", e)
      toast({
        title: "Connection failed",
        description: "Wallet connection was rejected or failed",
        variant: "destructive",
      })
    } finally {
      setConnecting(false)
    }
  }

  async function disconnectWallet() {
    try {
      if (window.solana) {
        await window.solana.disconnect()
      }
      setWalletPubkey(null)
      setBalance(null)
      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected",
      })
    } catch (e) {
      console.error("disconnect error", e)
    }
  }

  function validateFields() {
    if (!amountSol) {
      toast({
        title: "Amount required",
        description: "Please enter an amount in SOL",
        variant: "destructive",
      })
      return false
    }
    const amount = Number(amountSol)
    if (Number.isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Amount must be a positive number",
        variant: "destructive",
      })
      return false
    }
    if (balance !== null && amount > balance) {
      toast({
        title: "Insufficient balance",
        description: `You only have ${balance.toFixed(4)} SOL available`,
        variant: "destructive",
      })
      return false
    }
    if (!toAddress) {
      toast({
        title: "Address required",
        description: "Please enter a destination wallet address",
        variant: "destructive",
      })
      return false
    }
    if (!isValidSolanaAddress(toAddress)) {
      toast({
        title: "Invalid address",
        description: "Please enter a valid Solana address",
        variant: "destructive",
      })
      return false
    }
    if (!walletPubkey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your Phantom wallet first",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  async function sendTransfer() {
    if (!validateFields()) return

    setSending(true)
    const amount = Number(amountSol)
    const lamports = solToLamports(amount)

    try {
      const connection = new Connection(HELIUS_RPC, "confirmed")
      const fromPubkey = new PublicKey(walletPubkey!)
      const toPubkey = new PublicKey(toAddress)

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports,
        }),
      )

      tx.feePayer = fromPubkey
      const { blockhash } = await connection.getLatestBlockhash()
      tx.recentBlockhash = blockhash

      if (!window.solana) throw new Error("Phantom not available")

      const signed = await window.solana.signTransaction(tx)
      const txSignature = await connection.sendRawTransaction(signed.serialize(), {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      })

      await connection.confirmTransaction(txSignature, "confirmed")

      setLastTxSignature(txSignature)
      toast({
        title: "Transaction successful",
        description: `Sent ${amount} SOL successfully`,
        variant: "success",
      })

      // Reset form and refresh balance
      setAmountSol("")
      setToAddress("")
      fetchBalance()
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error("Transaction error:", err)
      toast({
        title: "Transaction failed",
        description: msg,
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const estimatedUsd = (() => {
    const amount = Number(amountSol)
    if (!showUsd || !solPriceUsd || Number.isNaN(amount)) return null
    return (amount * solPriceUsd).toFixed(2)
  })()

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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Transfer SOL
          </h1>
          <p className="text-gray-400">Send SOL tokens securely using your Phantom wallet</p>
        </div>

        <div className="space-y-6">
          {/* Wallet Connection Card */}
          <Card className="glass-card border-purple-500/20">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="h-5 w-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">Wallet Connection</h2>
              </div>

              {!providerAvailable ? (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div>
                    <p className="text-red-400 font-medium">Phantom Wallet Not Found</p>
                    <p className="text-sm text-gray-400 mt-1">Please install the Phantom browser extension</p>
                  </div>
                </div>
              ) : walletPubkey ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div className="flex-1">
                      <p className="text-green-400 font-medium">Wallet Connected</p>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm text-gray-300 bg-black/30 px-2 py-1 rounded font-mono">
                          {walletPubkey.slice(0, 8)}...{walletPubkey.slice(-8)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-green-500/20"
                          onClick={() => copyToClipboard(walletPubkey, "Wallet address")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Balance Display */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <div>
                      <p className="text-sm text-gray-400">Available Balance</p>
                      <div className="flex items-center gap-2">
                        {loadingBalance ? (
                          <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                        ) : (
                          <p className="text-lg font-semibold text-white">
                            {balance !== null ? `${balance.toFixed(4)} SOL` : "—"}
                          </p>
                        )}
                        {balance !== null && solPriceUsd && (
                          <p className="text-sm text-gray-400">≈ ${(balance * solPriceUsd).toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={fetchBalance} disabled={loadingBalance}>
                      Refresh
                    </Button>
                  </div>

                  <Button variant="outline" onClick={disconnectWallet} className="w-full bg-transparent">
                    Disconnect Wallet
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Button
                    onClick={connectWallet}
                    disabled={connecting}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl"
                  >
                    {connecting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4 mr-2" />
                        Connect Phantom Wallet
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Transfer Form */}
          {walletPubkey && (
            <Card className="glass-card border-cyan-500/20">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Send className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-lg font-semibold text-white">Send SOL</h2>
                </div>

                <div className="space-y-6">
                  {/* Amount Input */}
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-sm font-medium text-gray-300">
                      Amount (SOL)
                    </Label>
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        step="0.001"
                        min="0"
                        placeholder="0.00"
                        value={amountSol}
                        onChange={(e) => setAmountSol(e.target.value)}
                        className="text-lg font-semibold bg-black/20 border-white/10 focus:border-cyan-500/50 text-white pr-16"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                        SOL
                      </div>
                    </div>

                    {/* USD Conversion */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="showUsd"
                          checked={showUsd}
                          onChange={(e) => setShowUsd(e.target.checked)}
                          className="rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                        />
                        <label htmlFor="showUsd" className="text-gray-400">
                          Show USD estimate
                        </label>
                      </div>
                      <div className="text-gray-400">
                        {fetchingPrice
                          ? "Fetching price..."
                          : solPriceUsd
                            ? `1 SOL ≈ $${solPriceUsd.toFixed(2)}`
                            : "Price unavailable"}
                      </div>
                    </div>

                    {showUsd && estimatedUsd && (
                      <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                        <div className="flex items-center gap-2 text-cyan-400">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold">≈ ${estimatedUsd} USD</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Recipient Address */}
                  <div className="space-y-2">
                    <Label htmlFor="recipient" className="text-sm font-medium text-gray-300">
                      Recipient Address
                    </Label>
                    <Input
                      id="recipient"
                      placeholder="Enter Solana wallet address"
                      value={toAddress}
                      onChange={(e) => setToAddress(e.target.value)}
                      className="font-mono text-sm bg-black/20 border-white/10 focus:border-cyan-500/50 text-white"
                    />
                    {toAddress && !isValidSolanaAddress(toAddress) && (
                      <p className="text-sm text-red-400 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Invalid Solana address
                      </p>
                    )}
                  </div>

                  {/* Send Button */}
                  <Button
                    onClick={sendTransfer}
                    disabled={sending || !walletPubkey || !amountSol || !toAddress}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl text-lg"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Sending Transaction...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send SOL
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Last Transaction */}
          {lastTxSignature && (
            <Card className="glass-card border-green-500/20">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <h3 className="font-semibold text-white">Transaction Successful</h3>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-black/30 text-green-400 px-3 py-2 rounded-lg border border-green-500/20 font-mono truncate">
                    {lastTxSignature}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-green-500/20"
                    onClick={() => copyToClipboard(lastTxSignature, "Transaction signature")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-green-500/20"
                    onClick={() => window.open(`https://solscan.io/tx/${lastTxSignature}?cluster=devnet`, "_blank")}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Info Card */}
          <Card className="glass-card border-yellow-500/20">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-400 mb-2">Important Information</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Transactions are processed on Solana Devnet</li>
                    <li>• Make sure your Phantom wallet is set to Devnet</li>
                    <li>• Transaction fees will be deducted from your balance</li>
                    <li>• Double-check recipient addresses before sending</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
