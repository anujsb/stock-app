// import { FileUpload } from '@/components/portfolio/file-upload'
// import { PortfolioList } from '@/components/portfolio/portfolio-list'

// export default function PortfolioPage() {
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div>
//           <FileUpload />
//         </div>
//         <div className="lg:col-span-2">
//           <PortfolioList />
//         </div>
//       </div>
//     </div>
//   )
// }


// app/portfolio/page.tsx
'use client'

import { useState } from 'react'
import { FileUpload } from '@/components/portfolio/file-upload'
import { PortfolioList } from '@/components/portfolio/portfolio-list'

// Types
export interface PortfolioItem {
  id: string
  symbol: string
  quantity: number
  buyPrice: number
}

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])

  const handleFileProcessed = (data: PortfolioItem[]) => {
    setPortfolioItems(prev => [...prev, ...data])
  }

  const handleEdit = (item: PortfolioItem) => {
    // For now, just log the item to edit
    // You can implement a modal or form for editing
    console.log('Edit item:', item)
    alert(`Edit functionality for ${item.symbol} - implement as needed`)
  }

  const handleDelete = (id: string) => {
    setPortfolioItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">{portfolioItems.length} holdings</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <FileUpload onFileProcessed={handleFileProcessed} />
        </div>
        <div className="lg:col-span-2">
          <PortfolioList 
            portfolioItems={portfolioItems}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  )
}