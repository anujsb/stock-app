import { FileUpload } from '@/components/portfolio/file-upload'
import { PortfolioList } from '@/components/portfolio/portfolio-list'

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <FileUpload />
        </div>
        <div className="lg:col-span-2">
          <PortfolioList />
        </div>
      </div>
    </div>
  )
}
