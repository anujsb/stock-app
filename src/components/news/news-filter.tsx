'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Search } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function NewsFilter() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSymbol, setSelectedSymbol] = useState('all') // default to 'all'

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <Select
            value={selectedSymbol}
            onValueChange={(value) => setSelectedSymbol(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stocks</SelectItem>
              <SelectItem value="AAPL">AAPL</SelectItem>
              <SelectItem value="GOOGL">GOOGL</SelectItem>
              <SelectItem value="MSFT">MSFT</SelectItem>
              <SelectItem value="TSLA">TSLA</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
