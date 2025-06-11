import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">Chart will be implemented with real data</p>
        </div>
      </CardContent>
    </Card>
  )
}
