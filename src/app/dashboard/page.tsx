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


// // src/app/dashboard/page.tsx
// 'use client';

// import React from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Skeleton } from '@/components/ui/skeleton';
// import { 
//   TrendingUp, 
//   TrendingDown, 
//   RefreshCw, 
//   Search, 
//   Activity,
//   Eye,
//   EyeOff,
//   BarChart3,
//   Clock,
//   DollarSign,
//   Users,
//   ArrowUpRight,
//   ArrowDownRight
// } from 'lucide-react';
// import { useStockData, useStockServiceHealth } from '@/lib/stock-service';
// import type { StockPrice } from '@/lib/stock-service';

// interface MarketStat {
//   label: string;
//   value: string;
//   change: string;
//   isPositive: boolean;
//   icon: React.ReactNode;
// }

// export default function EnhancedStockDashboard() {
//   const [searchSymbol, setSearchSymbol] = React.useState('');
//   const [watchlistSymbols, setWatchlistSymbols] = React.useState([
//     'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR', 'ICICIBANK'
//   ]);
//   const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
//   const [showOnlyGainers, setShowOnlyGainers] = React.useState(false);
  
//   const { data, loading, error, lastUpdated, refetch } = useStockData(watchlistSymbols, {
//     refreshInterval: 300000, // 5 minutes
//     autoRefresh: true
//   });
  
//   const { isHealthy, checking } = useStockServiceHealth();

//   const addToWatchlist = () => {
//     if (searchSymbol && !watchlistSymbols.includes(searchSymbol.toUpperCase())) {
//       setWatchlistSymbols([...watchlistSymbols, searchSymbol.toUpperCase()]);
//       setSearchSymbol('');
//     }
//   };

//   const removeFromWatchlist = (symbol: string) => {
//     setWatchlistSymbols(watchlistSymbols.filter(s => s !== symbol));
//   };

//   const formatCurrency = (value: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 2
//     }).format(value);
//   };

//   const formatNumber = (value: number) => {
//     if (value >= 10000000) { // 1 crore
//       return `₹${(value / 10000000).toFixed(2)}Cr`;
//     } else if (value >= 100000) { // 1 lakh
//       return `₹${(value / 100000).toFixed(2)}L`;
//     }
//     return new Intl.NumberFormat('en-IN').format(value);
//   };

//   const formatVolume = (volume: number) => {
//     if (volume >= 10000000) {
//       return `${(volume / 10000000).toFixed(2)}Cr`;
//     } else if (volume >= 100000) {
//       return `${(volume / 100000).toFixed(2)}L`;
//     }
//     return new Intl.NumberFormat('en-IN').format(volume);
//   };

//   // Calculate market statistics
//   const marketStats = React.useMemo((): MarketStat[] => {
//     if (!data?.successful_stocks.length) return [];
    
//     const stocks = data.successful_stocks;
//     const gainers = stocks.filter(s => s.change > 0).length;
//     const losers = stocks.filter(s => s.change < 0).length;
//     const totalVolume = stocks.reduce((sum, s) => sum + s.volume, 0);
//     const avgChange = stocks.reduce((sum, s) => sum + s.change_percent, 0) / stocks.length;
    
//     return [
//       {
//         label: 'Gainers',
//         value: gainers.toString(),
//         change: `${((gainers / stocks.length) * 100).toFixed(1)}%`,
//         isPositive: gainers > losers,
//         icon: <TrendingUp className="w-4 h-4" />
//       },
//       {
//         label: 'Losers',
//         value: losers.toString(),
//         change: `${((losers / stocks.length) * 100).toFixed(1)}%`,
//         isPositive: losers < gainers,
//         icon: <TrendingDown className="w-4 h-4" />
//       },
//       {
//         label: 'Avg Change',
//         value: `${avgChange.toFixed(2)}%`,
//         change: avgChange > 0 ? 'Positive' : 'Negative',
//         isPositive: avgChange > 0,
//         icon: <BarChart3 className="w-4 h-4" />
//       },
//       {
//         label: 'Total Volume',
//         value: formatVolume(totalVolume),
//         change: 'Combined',
//         isPositive: true,
//         icon: <Users className="w-4 h-4" />
//       }
//     ];
//   }, [data]);

//   // Filter stocks based on view preferences
//   const filteredStocks = React.useMemo(() => {
//     if (!data?.successful_stocks) return [];
    
//     let filtered = [...data.successful_stocks];
    
//     if (showOnlyGainers) {
//       filtered = filtered.filter(stock => stock.change > 0);
//     }
    
//     // Sort by change percentage (descending)
//     filtered.sort((a, b) => b.change_percent - a.change_percent);
    
//     return filtered;
//   }, [data?.successful_stocks, showOnlyGainers]);

//   const StockCard = ({ stock }: { stock: StockPrice }) => {
//     const isPositive = stock.change >= 0;
    
//     return (
//       <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
//         <CardHeader className="pb-3">
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle className="text-lg font-semibold flex items-center gap-2">
//                 {stock.symbol.replace('.NS', '')}
//                 <Badge variant={isPositive ? 'default' : 'destructive'} className="text-xs">
//                   {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
//                 </Badge>
//               </CardTitle>
//               <CardDescription className="flex items-center gap-1">
//                 <Clock className="w-3 h-3" />
//                 {new Date(stock.last_updated).toLocaleTimeString()}
//               </CardDescription>
//             </div>
//             <div className="text-right">
//               <Badge variant={isPositive ? 'default' : 'destructive'}>
//                 {stock.change_percent.toFixed(2)}%
//               </Badge>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div>
//               <p className="text-2xl font-bold flex items-center gap-1">
//                 <DollarSign className="w-5 h-5 text-muted-foreground" />
//                 {formatCurrency(stock.current_price)}
//               </p>
//               <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
//                 {isPositive ? '+' : ''}{formatCurrency(stock.change)}
//               </p>
//             </div>
            
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               <div className="bg-muted/30 p-2 rounded">
//                 <p className="text-muted-foreground text-xs">Previous Close</p>
//                 <p className="font-semibold">{formatCurrency(stock.previous_close)}</p>
//               </div>
//               <div className="bg-muted/30 p-2 rounded">
//                 <p className="text-muted-foreground text-xs">Volume</p>
//                 <p className="font-semibold">{formatVolume(stock.volume)}</p>
//               </div>
//             </div>
            
//             {stock.market_cap && (
//               <div className="bg-muted/30 p-2 rounded">
//                 <p className="text-muted-foreground text-xs">Market Cap</p>
//                 <p className="font-semibold">{formatNumber(stock.market_cap)}</p>
//               </div>
//             )}
            
//             <div className="flex gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => removeFromWatchlist(stock.symbol.split('.')[0])}
//                 className="flex-1"
//               >
//                 <EyeOff className="w-3 h-3 mr-1" />
//                 Remove
//               </Button>
//               <Button
//                 variant="secondary"
//                 size="sm"
//                 className="px-3"
//                 onClick={() => window.open(`https://finance.yahoo.com/quote/${stock.symbol}`, '_blank')}
//               >
//                 <BarChart3 className="w-3 h-3" />
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   };

//   const StockListItem = ({ stock }: { stock: StockPrice }) => {
//     const isPositive = stock.change >= 0;
    
//     return (
//       <Card className="hover:shadow-md transition-shadow duration-200">
//         <CardContent className="p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div>
//                 <h3 className="font-semibold text-lg">{stock.symbol.replace('.NS', '')}</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Vol: {formatVolume(stock.volume)}
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-6">
//               <div className="text-right">
//                 <p className="text-xl font-bold">{formatCurrency(stock.current_price)}</p>
//                 <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
//                   {isPositive ? '+' : ''}{formatCurrency(stock.change)}
//                 </p>
//               </div>
              
//               <Badge variant={isPositive ? 'default' : 'destructive'} className="min-w-[80px] justify-center">
//                 {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
//                 {stock.change_percent.toFixed(2)}%
//               </Badge>
              
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => removeFromWatchlist(stock.symbol.split('.')[0])}
//               >
//                 <EyeOff className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   };

//   const LoadingSkeleton = () => (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <Skeleton className="h-6 w-24" />
//           <Skeleton className="h-6 w-16" />
//         </div>
//         <Skeleton className="h-4 w-32" />
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-3">
//           <Skeleton className="h-8 w-24" />
//           <div className="grid grid-cols-2 gap-4">
//             <Skeleton className="h-12 w-full" />
//             <Skeleton className="h-12 w-full" />
//           </div>
//           <Skeleton className="h-8 w-full" />
//         </div>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
//       <div className="container mx-auto p-6 max-w-7xl">
//         <div className="space-y-6">
//           {/* Header Section */}
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//             <div>
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 Stock Market Dashboard
//               </h1>
//               <p className="text-muted-foreground mt-1">
//                 Real-time Indian stock market data with advanced analytics
//               </p>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <Badge variant={isHealthy ? 'default' : 'destructive'} className="px-3 py-1">
//                 <Activity className="w-3 h-3 mr-1" />
//                 {checking ? 'Checking...' : isHealthy ? 'Live' : 'Offline'}
//               </Badge>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={refetch}
//                 disabled={loading}
//                 className="min-w-[100px]"
//               >
//                 <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
//                 {loading ? 'Updating...' : 'Refresh'}
//               </Button>
//             </div>
//           </div>

//           {/* Market Statistics */}
//           {marketStats.length > 0 && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               {marketStats.map((stat, index) => (
//                 <Card key={index} className="border-l-4 border-l-blue-500">
//                   <CardContent className="p-4">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-muted-foreground">{stat.label}</p>
//                         <p className="text-2xl font-bold">{stat.value}</p>
//                         <p className={`text-xs ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
//                           {stat.change}
//                         </p>
//                       </div>
//                       <div className={`p-2 rounded-full ${stat.isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
//                         {stat.icon}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}

//           {/* Controls Section */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Search className="w-5 h-5" />
//                   Add Stock to Watchlist
//                 </CardTitle>
//                 <CardDescription>
//                   Enter stock symbol (e.g., RELIANCE, TCS, HDFCBANK)
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex gap-2">
//                   <Input
//                     placeholder="Enter stock symbol..."
//                     value={searchSymbol}
//                     onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
//                     onKeyPress={(e) => e.key === 'Enter' && addToWatchlist()}
//                     className="flex-1"
//                   />
//                   <Button onClick={addToWatchlist} disabled={!searchSymbol}>
//                     <Eye className="w-4 h-4 mr-2" />
//                     Add
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>View Options</CardTitle>
//                 <CardDescription>
//                   Customize your dashboard view
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex gap-2">
//                   <Button
//                     variant={showOnlyGainers ? 'default' : 'outline'}
//                     size="sm"
//                     onClick={() => setShowOnlyGainers(!showOnlyGainers)}
//                   >
//                     <TrendingUp className="w-4 h-4 mr-2" />
//                     {showOnlyGainers ? 'Show All' : 'Gainers Only'}
//                   </Button>
//                   <Button
//                     variant={viewMode === 'grid' ? 'default' : 'outline'}
//                     size="sm"
//                     onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
//                   >
//                     <BarChart3 className="w-4 h-4 mr-2" />
//                     {viewMode === 'grid' ? 'List View' : 'Grid View'}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Status Information */}
//           {lastUpdated && (
//             <Alert className="border-l-4 border-l-green-500">
//               <Activity className="h-4 w-4" />
//               <AlertDescription>
//                 <strong>Last updated:</strong> {lastUpdated.toLocaleString()} • 
//                 <strong> Showing:</strong> {filteredStocks.length} of {data?.successful_count || 0} stocks • 
//                 <strong> Auto-refresh:</strong> Every 5 minutes
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* Error Handling */}
//           {error && (
//             <Alert variant="destructive">
//               <AlertDescription>
//                 <strong>Error:</strong> {error}
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* Stock Display */}
//           <div className={viewMode === 'grid' 
//             ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
//             : "space-y-4"
//           }>
//             {loading && !data ? (
//               // Initial loading state
//               Array.from({ length: 6 }).map((_, i) => (
//                 <LoadingSkeleton key={i} />
//               ))
//             ) : (
//               <>
//                 {/* Display stocks */}
//                 {filteredStocks.map((stock) => 
//                   viewMode === 'grid' ? (
//                     <StockCard key={stock.symbol} stock={stock} />
//                   ) : (
//                     <StockListItem key={stock.symbol} stock={stock} />
//                   )
//                 )}
                
//                 {/* Loading cards for new requests */}
//                 {loading && Array.from({ 
//                   length: Math.max(0, watchlistSymbols.length - (data?.successful_stocks.length || 0)) 
//                 }).map((_, i) => (
//                   <LoadingSkeleton key={`loading-${i}`} />
//                 ))}
//               </>
//             )}
//           </div>

//           {/* No Results */}
//           {!loading && filteredStocks.length === 0 && data?.successful_stocks.length > 0 && (
//             <Card>
//               <CardContent className="p-8 text-center">
//                 <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
//                 <h3 className="text-lg font-semibold mb-2">No stocks match your filter</h3>
//                 <p className="text-muted-foreground mb-4">
//                   Try adjusting your view options or add more stocks to your watchlist.
//                 </p>
//                 <Button onClick={() => setShowOnlyGainers(false)} variant="outline">
//                   Show All Stocks
//                 </Button>
//               </CardContent>
//             </Card>
//           )}

//           {/* Failed Stocks */}
//           {data?.failed_stocks && data.failed_stocks.length > 0 && (
//             <Card className="border-l-4 border-l-red-500">
//               <CardHeader>
//                 <CardTitle className="text-destructive flex items-center gap-2">
//                   <AlertDescription className="w-5 h-5" />
//                   Failed to Load ({data.failed_stocks.length})
//                 </CardTitle>
//                 <CardDescription>
//                   These stocks couldn't be fetched
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   {data.failed_stocks.map((error, index) => (
//                     <Alert key={index} variant="destructive" className="p-3">
//                       <AlertDescription className="text-sm">
//                         <strong>{error.symbol}:</strong> {error.message}
//                       </AlertDescription>
//                     </Alert>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }