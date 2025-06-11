// import { RecommendationForm } from '@/components/recommendations/recommendation-form'
// import { RecommendationList } from '@/components/recommendations/recommendation-list'

// export default function RecommendationsPage() {
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-gray-900">AI Recommendations</h1>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div>
//           <RecommendationForm />
//         </div>
//         <div className="lg:col-span-2">
//           <RecommendationList />
//         </div>
//       </div>
//     </div>
//   )
// }

import { ChatInterface } from "@/components/recommendations/chat-interface"

export default function RecommendationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              AI Investment Assistant
            </h1>
            <p className="text-gray-600 text-lg">Get personalized stock recommendations powered by advanced AI</p>
          </div>

          <ChatInterface />
        </div>
      </div>
    </div>
  )
}
