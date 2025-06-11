import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react'

export function PortfolioOverview() {
  // Mock data - replace with real data from your backend
  const metrics = [
    {
      title: 'Total Value',
      value: '$125,430.50',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Total Gain/Loss',
      value: '$8,240.30',
      change: '+7.2%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Day Change',
      value: '-$420.50',
      change: '-0.34%',
      trend: 'down',
      icon: TrendingDown,
    },
    {
      title: 'Holdings',
      value: '23',
      change: '+2',
      trend: 'up',
      icon: Target,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className={`text-xs ${
              metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
