
// components/recommendations/recommendation-list.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react'

export function RecommendationList() {
  // Mock data - replace with real data from your backend
  const recommendations = [
    {
      id: 1,
      symbol: 'NVDA',
      action: 'BUY',
      confidence: 85,
      reason: 'Strong AI market growth and excellent Q3 earnings. GPU demand remains high.',
      timestamp: '1 hour ago',
    },
    {
      id: 2,
      symbol: 'META',
      action: 'HOLD',
      confidence: 70,
      reason: 'Stable growth in advertising revenue, but regulatory concerns persist.',
      timestamp: '3 hours ago',
    },
    {
      id: 3,
      symbol: 'NFLX',
      action: 'SELL',
      confidence: 60,
      reason: 'Increased competition in streaming market and subscriber growth slowdown.',
      timestamp: '1 day ago',
    },
  ]

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'BUY':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'SELL':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-yellow-600" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY':
        return 'bg-green-100 text-green-800'
      case 'SELL':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg">{rec.symbol}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium flex items-center ${getActionColor(rec.action)}`}>
                    {getActionIcon(rec.action)}
                    <span className="ml-1">{rec.action}</span>
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Confidence: {rec.confidence}%</div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {rec.timestamp}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">{rec.reason}</p>
              
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${rec.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

