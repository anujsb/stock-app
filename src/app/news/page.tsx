import { NewsFilter } from '@/components/news/news-filter'
import { NewsList } from '@/components/news/news-list'

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Stock News</h1>
      </div>
      
      <NewsFilter />
      <NewsList />
    </div>
  )
}