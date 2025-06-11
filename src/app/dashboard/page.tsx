// app/dashboard/page.tsx
import { PortfolioOverview } from '@/components/dashboard/portfolio-overview'
import { StockTable } from '@/components/dashboard/stock-table'
import { PerformanceChart } from '@/components/dashboard/performance-chart'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>
      
      <PortfolioOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StockTable />
        </div>
        <div>
          <PerformanceChart />
        </div>
      </div>
    </div>
  )
}
