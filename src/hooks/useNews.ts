
// // hooks/useNews.ts
// 'use client'

// import { useState, useEffect } from 'react'
// import { NewsItem } from '@/types'

// export function useNews() {
//   const [news, setNews] = useState<NewsItem[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedSymbol, setSelectedSymbol] = useState('')

//   useEffect(() => {
//     const fetchNews = async () => {
//       setIsLoading(true)
      
//       // Mock data - replace with actual NewsAPI integration
//       const mockNews: NewsItem[] = [
//         {
//           id: '1',
//           title: 'Apple Reports Strong Q4 Earnings',
//           summary: 'Apple Inc. reported better-than-expected earnings for Q4, driven by strong iPhone sales and services growth.',
//           source: 'Reuters',
//           publishedAt: '2 hours ago',
//           url: '#',
//           symbol: 'AAPL',
//         },
//         {
//           id: '2',
//           title: 'Google Cloud Revenue Surges 35%',
//           summary: 'Alphabet Inc. sees significant growth in cloud computing division as businesses continue digital transformation.',
//           source: 'Bloomberg',
//           publishedAt: '4 hours ago',
//           url: '#',
//           symbol: 'GOOGL',
//         },
//         {
//           id: '3',
//           title: 'Microsoft Azure Gains Market Share',
//           summary: 'Microsoft Corporation continues to compete strongly in the cloud infrastructure market with new AI integrations.',
//           source: 'TechCrunch',
//           publishedAt: '6 hours ago',
//           url: '#',
//           symbol: 'MSFT',
//         },
//         {
//           id: '4',
//           title: 'Tesla Announces New Gigafactory',
//           summary: 'Tesla Inc. plans to build a new manufacturing facility in Southeast Asia to meet growing EV demand.',
//           source: 'The Verge',
//           publishedAt: '8 hours ago',
//           url: '#',
//           symbol: 'TSLA',
//         },
//       ]
      
//       setTimeout(() => {
//         setNews(mockNews)
//         setIsLoading(false)
//       }, 800)
//     }

//     fetchNews()
//   }, [searchTerm, selectedSymbol])

//   const filteredNews = news.filter(item => {
//     const matchesSearch = !searchTerm || 
//       item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.summary.toLowerCase().includes(searchTerm.toLowerCase())
    
//     const matchesSymbol = !selectedSymbol || item.symbol === selectedSymbol
    
//     return matchesSearch && matchesSymbol
//   })

//   return {
//     news: filteredNews,
//     isLoading,
//     searchTerm,
//     setSearchTerm,
//     selectedSymbol,
//     setSelectedSymbol,
//   }
// }

// hooks/useNews.ts
import { useState, useEffect } from 'react';
import { NewsArticle } from '@/types/news';

interface UseNewsProps {
  category?: string;
  query?: string;
  autoRefresh?: boolean;
}

interface UseNewsReturn {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  totalResults: number;
  currentPage: number;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export const useNews = ({ 
  category = 'business', 
  query, 
  autoRefresh = false 
}: UseNewsProps = {}): UseNewsReturn => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = async (page: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        category,
        page: page.toString(),
        pageSize: '20',
      });

      if (query) {
        params.append('q', query);
      }

      const response = await fetch(`/api/news?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch news');
      }

      if (append) {
        setArticles(prev => [...prev, ...data.articles]);
      } else {
        setArticles(data.articles);
      }

      setTotalResults(data.totalResults);
      setCurrentPage(page);
      setHasMore(data.articles.length === 20 && articles.length + data.articles.length < data.totalResults);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchNews(currentPage + 1, true);
    }
  };

  const refresh = () => {
    setCurrentPage(1);
    fetchNews(1, false);
  };

  useEffect(() => {
    fetchNews();
  }, [category, query]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        refresh();
      }, 5 * 60 * 1000); // Refresh every 5 minutes

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  return {
    articles,
    loading,
    error,
    totalResults,
    currentPage,
    hasMore,
    loadMore,
    refresh,
  };
};