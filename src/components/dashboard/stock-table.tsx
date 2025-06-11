// components/dashboard/stock-table.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function StockTable() {
  // Mock data - replace with real data from your backend
  const stocks = [
    {
      symbol: 'AAPL',
      quantity: 50,
      buyPrice: 150.25,
      currentPrice: 175.80,
      gainLoss: 17.02,
    },
    {
      symbol: 'GOOGL',
      quantity: 25,
      buyPrice: 2500.00,
      currentPrice: 2650.30,
      gainLoss: 6.01,
    },
    {
      symbol: 'MSFT',
      quantity: 75,
      buyPrice: 300.50,
      currentPrice: 285.20,
      gainLoss: -5.09,
    },
    {
      symbol: 'TSLA',
      quantity: 30,
      buyPrice: 850.00,
      currentPrice: 920.45,
      gainLoss: 8.29,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium text-gray-600">Symbol</th>
                <th className="text-right py-2 font-medium text-gray-600">Quantity</th>
                <th className="text-right py-2 font-medium text-gray-600">Buy Price</th>
                <th className="text-right py-2 font-medium text-gray-600">Current Price</th>
                <th className="text-right py-2 font-medium text-gray-600">% Gain/Loss</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.symbol} className="border-b">
                  <td className="py-3 font-medium">{stock.symbol}</td>
                  <td className="text-right py-3">{stock.quantity}</td>
                  <td className="text-right py-3">${stock.buyPrice.toFixed(2)}</td>
                  <td className="text-right py-3">${stock.currentPrice.toFixed(2)}</td>
                  <td className={`text-right py-3 font-medium ${
                    stock.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stock.gainLoss >= 0 ? '+' : ''}{stock.gainLoss.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
