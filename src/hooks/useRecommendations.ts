
// hooks/useRecommendations.ts
'use client'

import { useState, useEffect } from 'react'
import { Recommendation } from '@/types'

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load initial recommendations
    const mockRecommendations: Recommendation[] = [
      {
        id: '1',
        symbol: 'NVDA',
        action: 'BUY',
        confidence: 85,
        reason: 'Strong AI market growth and excellent Q3 earnings. GPU demand remains high with data center expansion.',
        timestamp: '1 hour ago',
      },
      {
        id: '2',
        symbol: 'META',
        action: 'HOLD',
        confidence: 70,
        reason: 'Stable growth in advertising revenue, but regulatory concerns and metaverse investments create uncertainty.',
        timestamp: '3 hours ago',
      },
      {
        id: '3',
        symbol: 'NFLX',
        action: 'SELL',
        confidence: 60,
        reason: 'Increased competition in streaming market and subscriber growth slowdown in key markets.',
        timestamp: '1 day ago',
      },
    ]
    
    setRecommendations(mockRecommendations)
  }, [])

  const getRecommendation = async (query: string) => {
    setIsLoading(true)
    
    // Simulate API call to LLM service
    return new Promise<Recommendation>((resolve) => {
      setTimeout(() => {
        const newRecommendation: Recommendation = {
          id: Date.now().toString(),
          symbol: 'AAPL',
          action: 'BUY',
          confidence: Math.floor(Math.random() * 30) + 70,
          reason: `Based on your query "${query}", Apple shows strong fundamentals and growth potential.`,
          timestamp: 'Just now',
        }
        
        setRecommendations(prev => [newRecommendation, ...prev])
        setIsLoading(false)
        resolve(newRecommendation)
      }, 2000)
    })
  }

  return {
    recommendations,
    isLoading,
    getRecommendation,
  }
}
