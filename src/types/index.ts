
// types/index.ts
export interface Stock {
  symbol: string
  quantity: number
  buyPrice: number
  currentPrice?: number
  gainLoss?: number
}

export interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  publishedAt: string
  url: string
  symbol?: string
}

export interface Recommendation {
  id: string
  symbol: string
  action: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  reason: string
  timestamp: string
}

export interface PortfolioMetrics {
  totalValue: number
  totalGainLoss: number
  dayChange: number
  holdings: number
}