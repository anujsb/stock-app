
// hooks/useNews.ts
'use client'

import { useState, useEffect } from 'react'
import { NewsItem } from '@/types'

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSymbol, setSelectedSymbol] = useState('')

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true)
      
      // Mock data - replace with actual NewsAPI integration
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: 'Apple Reports Strong Q4 Earnings',
          summary: 'Apple Inc. reported better-than-expected earnings for Q4, driven by strong iPhone sales and services growth.',
          source: 'Reuters',
          publishedAt: '2 hours ago',
          url: '#',
          symbol: 'AAPL',
        },
        {
          id: '2',
          title: 'Google Cloud Revenue Surges 35%',
          summary: 'Alphabet Inc. sees significant growth in cloud computing division as businesses continue digital transformation.',
          source: 'Bloomberg',
          publishedAt: '4 hours ago',
          url: '#',
          symbol: 'GOOGL',
        },
        {
          id: '3',
          title: 'Microsoft Azure Gains Market Share',
          summary: 'Microsoft Corporation continues to compete strongly in the cloud infrastructure market with new AI integrations.',
          source: 'TechCrunch',
          publishedAt: '6 hours ago',
          url: '#',
          symbol: 'MSFT',
        },
        {
          id: '4',
          title: 'Tesla Announces New Gigafactory',
          summary: 'Tesla Inc. plans to build a new manufacturing facility in Southeast Asia to meet growing EV demand.',
          source: 'The Verge',
          publishedAt: '8 hours ago',
          url: '#',
          symbol: 'TSLA',
        },
      ]
      
      setTimeout(() => {
        setNews(mockNews)
        setIsLoading(false)
      }, 800)
    }

    fetchNews()
  }, [searchTerm, selectedSymbol])

  const filteredNews = news.filter(item => {
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSymbol = !selectedSymbol || item.symbol === selectedSymbol
    
    return matchesSearch && matchesSymbol
  })

  return {
    news: filteredNews,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedSymbol,
    setSelectedSymbol,
  }
}
