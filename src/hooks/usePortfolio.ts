// hooks/usePortfolio.ts
'use client'

import { useState, useEffect } from 'react'
import { Stock, PortfolioMetrics } from '@/types'

export function usePortfolio() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call - replace with actual backend integration
    const fetchPortfolio = async () => {
      setIsLoading(true)
      
      // Mock data
      const mockStocks: Stock[] = [
        { symbol: 'AAPL', quantity: 50, buyPrice: 150.25, currentPrice: 175.80, gainLoss: 17.02 },
        { symbol: 'GOOGL', quantity: 25, buyPrice: 2500.00, currentPrice: 2650.30, gainLoss: 6.01 },
        { symbol: 'MSFT', quantity: 75, buyPrice: 300.50, currentPrice: 285.20, gainLoss: -5.09 },
        { symbol: 'TSLA', quantity: 30, buyPrice: 850.00, currentPrice: 920.45, gainLoss: 8.29 },
      ]
      
      const mockMetrics: PortfolioMetrics = {
        totalValue: 125430.50,
        totalGainLoss: 8240.30,
        dayChange: -420.50,
        holdings: mockStocks.length,
      }
      
      setTimeout(() => {
        setStocks(mockStocks)
        setMetrics(mockMetrics)
        setIsLoading(false)
      }, 1000)
    }

    fetchPortfolio()
  }, [])

  const addStock = (stock: Stock) => {
    setStocks(prev => [...prev, stock])
  }

  const removeStock = (symbol: string) => {
    setStocks(prev => prev.filter(stock => stock.symbol !== symbol))
  }

  const updateStock = (symbol: string, updates: Partial<Stock>) => {
    setStocks(prev => prev.map(stock => 
      stock.symbol === symbol ? { ...stock, ...updates } : stock
    ))
  }

  return {
    stocks,
    metrics,
    isLoading,
    addStock,
    removeStock,
    updateStock,
  }
}
