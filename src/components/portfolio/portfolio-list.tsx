
// components/portfolio/portfolio-list.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'

export function PortfolioList() {
  // Mock data - replace with real data from your backend
  const portfolioItems = [
    { id: 1, symbol: 'AAPL', quantity: 50, buyPrice: 150.25 },
    { id: 2, symbol: 'GOOGL', quantity: 25, buyPrice: 2500.00 },
    { id: 3, symbol: 'MSFT', quantity: 75, buyPrice: 300.50 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {portfolioItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{item.symbol}</p>
                <p className="text-sm text-gray-600">
                  {item.quantity} shares @ ${item.buyPrice.toFixed(2)}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button className="p-1 text-gray-400 hover:text-blue-600">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button className="p-1 text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
