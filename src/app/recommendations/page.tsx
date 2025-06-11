import { RecommendationForm } from '@/components/recommendations/recommendation-form'
import { RecommendationList } from '@/components/recommendations/recommendation-list'

export default function RecommendationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">AI Recommendations</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <RecommendationForm />
        </div>
        <div className="lg:col-span-2">
          <RecommendationList />
        </div>
      </div>
    </div>
  )
}