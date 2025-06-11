
// components/news/news-list.tsx
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink, Clock } from 'lucide-react'

export function NewsList() {
  // Mock data - replace with real data from your backend
  const newsItems = [
    {
      id: 1,
      title: 'Apple Reports Strong Q4 Earnings',
      summary: 'Apple Inc. reported better-than-expected earnings for Q4, driven by strong iPhone sales...',
      source: 'Reuters',
      publishedAt: '2 hours ago',
      url: '#',
      symbol: 'AAPL',
    },
    {
      id: 2,
      title: 'Google Cloud Revenue Surges 35%',
      summary: 'Alphabet Inc. sees significant growth in cloud computing division as businesses continue digital transformation...',
      source: 'Bloomberg',
      publishedAt: '4 hours ago',
      url: '#',
      symbol: 'GOOGL',
    },
    {
      id: 3,
      title: 'Microsoft Azure Gains Market Share',
      summary: 'Microsoft Corporation continues to compete strongly in the cloud infrastructure market...',
      source: 'TechCrunch',
      publishedAt: '6 hours ago',
      url: '#',
      symbol: 'MSFT',
    },
  ]

  return (
    <div className="space-y-4">
      {newsItems.map((item) => (
        <Card key={item.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {item.symbol}
              </span>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {item.publishedAt}
              </div>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{item.summary}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Source: {item.source}</span>
              <a
                href={item.url}
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
              >
                Read more
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
