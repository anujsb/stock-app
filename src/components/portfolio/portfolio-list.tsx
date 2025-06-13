
// // components/portfolio/portfolio-list.tsx
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Edit, Trash2 } from 'lucide-react'
// import { Button } from '../ui/button'

// export function PortfolioList() {
//   // Mock data - replace with real data from your backend
//   const portfolioItems = [
//     { id: 1, symbol: 'AAPL', quantity: 50, buyPrice: 150.25 },
//     { id: 2, symbol: 'GOOGL', quantity: 25, buyPrice: 2500.00 },
//     { id: 3, symbol: 'MSFT', quantity: 75, buyPrice: 300.50 },
//   ]

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Current Holdings</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-3">
//           {portfolioItems.map((item) => (
//             <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
//               <div>
//                 <p className="font-medium">{item.symbol}</p>
//                 <p className="text-sm text-gray-600">
//                   {item.quantity} shares @ ${item.buyPrice.toFixed(2)}
//                 </p>
//               </div>
//               <div className="flex space-x-2">
//                 <Button className="p-1 text-gray-400 hover:text-blue-600">
//                   <Edit className="h-4 w-4" />
//                 </Button>
//                 <Button className="p-1 text-gray-400 hover:text-red-600">
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }



// components/portfolio/portfolio-list.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Trash2, FileText } from 'lucide-react'
import { Button } from '../ui/button'

// Import the PortfolioItem type from the main page
import type { PortfolioItem } from '@/app/portfolio/page'

interface PortfolioListProps {
  portfolioItems: PortfolioItem[]
  onEdit: (item: PortfolioItem) => void
  onDelete: (id: string) => void
}

export function PortfolioList({ portfolioItems, onEdit, onDelete }: PortfolioListProps) {
  const totalValue = portfolioItems.reduce((sum, item) => sum + (item.quantity * item.buyPrice), 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Current Holdings</CardTitle>
          {portfolioItems.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-lg font-bold text-gray-900">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {portfolioItems.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No portfolio items yet</p>
            <p className="text-sm text-gray-400">Upload a CSV or Excel file to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {portfolioItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-lg">{item.symbol}</p>
                  <p className="text-sm text-gray-600">
                    {item.quantity.toLocaleString()} shares @ ${item.buyPrice.toFixed(2)}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    Total: ${(item.quantity * item.buyPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                    title="Edit holding"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                    title="Delete holding"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}