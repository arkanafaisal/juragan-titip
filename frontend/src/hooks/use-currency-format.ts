import { useCallback } from "react"

export function useCurrencyFormat() {
  const format = useCallback((value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }, [])

  const parse = useCallback((value: string): number => {
    const cleaned = value.replace(/[^0-9]/g, "")
    return parseInt(cleaned, 10) || 0
  }, [])

  const formatCompact = useCallback((value: number): string => {
    if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)}M`
    if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}jt`
    if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}rb`
    return `Rp ${value}`
  }, [])

  return { format, parse, formatCompact }
}
