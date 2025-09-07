import { PublicKey } from "@solana/web3.js"

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address)
    return true
  } catch {
    return false
  }
}

export function solToLamports(sol: number): number {
  return Math.floor(sol * 1_000_000_000) // 1 SOL = 1 billion lamports
}

export function lamportsToSol(lamports: number): number {
  return lamports / 1_000_000_000
}
