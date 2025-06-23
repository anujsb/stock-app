// // import { FileUpload } from '@/components/portfolio/file-upload'
// // import { PortfolioList } from '@/components/portfolio/portfolio-list'

// // export default function PortfolioPage() {
// //   return (
// //     <div className="space-y-6">
// //       <div className="flex items-center justify-between">
// //         <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
// //       </div>
      
// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //         <div>
// //           <FileUpload />
// //         </div>
// //         <div className="lg:col-span-2">
// //           <PortfolioList />
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }


// // app/portfolio/page.tsx
// 'use client'

// import { useState } from 'react'
// import { FileUpload } from '@/components/portfolio/file-upload'
// import { PortfolioList } from '@/components/portfolio/portfolio-list'

// // Types
// export interface PortfolioItem {
//   id: string
//   symbol: string
//   quantity: number
//   buyPrice: number
// }

// export default function PortfolioPage() {
//   const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])

//   const handleFileProcessed = (data: PortfolioItem[]) => {
//     setPortfolioItems(prev => [...prev, ...data])
//   }

//   const handleEdit = (item: PortfolioItem) => {
//     // For now, just log the item to edit
//     // You can implement a modal or form for editing
//     console.log('Edit item:', item)
//     alert(`Edit functionality for ${item.symbol} - implement as needed`)
//   }

//   const handleDelete = (id: string) => {
//     setPortfolioItems(prev => prev.filter(item => item.id !== id))
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
//         <div className="text-right">
//           <p className="text-sm text-gray-600">{portfolioItems.length} holdings</p>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div>
//           <FileUpload onFileProcessed={handleFileProcessed} />
//         </div>
//         <div className="lg:col-span-2">
//           <PortfolioList 
//             portfolioItems={portfolioItems}
//             onEdit={handleEdit}
//             onDelete={handleDelete}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }


// src/app/portfolio/page.tsx
'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { userPortfolios, stocks, stockPrices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { stockService } from '@/lib/stock-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, RefreshCw, Search } from 'lucide-react';

export default function PortfolioPage() {
  const { user } = useUser();
  const [portfolio, setPortfolio] = React.useState<any[]>([]);
  const [searchSymbol, setSearchSymbol] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);

  React.useEffect(() => {
    if (user) {
      fetchPortfolio();
    }
  }, [user]);

  const fetchPortfolio = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const portfolioData = await db
        .select({
          portfolio: userPortfolios,
          stock: stocks,
          price: stockPrices,
        })
        .from(userPortfolios)
        .innerJoin(stocks, eq(userPortfolios.stock_id, stocks.id))
        .leftJoin(stockPrices, eq(stocks.id, stockPrices.stock_id))
        .where(eq(userPortfolios.user_id, user.id));

      setPortfolio(portfolioData);
      setLastUpdated(new Date());

      // Refresh stale or missing prices
      const staleStocks = portfolioData.filter(
        (item) =>
          !item.price?.last_updated ||
          Date.now() - new Date(item.price.last_updated).getTime() > 120000 // 2 minutes
      );
      if (staleStocks.length > 0) {
        refreshStalePrices(staleStocks.map((item) => item.stock.symbol));
      }
    } catch (err) {
      setError('Failed to fetch portfolio');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshStalePrices = async (symbols: string[]) => {
    try {
      const batchData = await stockService.getMultipleStocks(symbols);
      for (const price of batchData.successful_stocks) {
        const stock = portfolio.find((p) => p.stock.full_symbol === price.symbol)?.stock;
        if (stock) {
          await db
            .insert(stockPrices)
            .values({
              stock_id: stock.id,
              current_price: price.current_price,
              previous_close: price.previous_close,
              change_amount: price.change,
              change_percent: price.change_percent,
              volume: price.volume,
              market_cap: price.market_cap,
              last_updated: new Date(price.last_updated),
            })
            .onConflictDoUpdate({
              target: stockPrices.stock_id,
              set: {
                current_price: price.current_price,
                previous_close: price.previous_close,
                change_amount: price.change,
                change_percent: price.change_percent,
                volume: price.volume,
                market_cap: price.market_cap,
                last_updated: new Date(price.last_updated),
              },
            });
        }
      }
      fetchPortfolio(); // Refresh with updated prices
    } catch (err) {
      console.error('Failed to refresh prices:', err);
    }
  };

  const addToPortfolio = async () => {
    if (!user || !searchSymbol) return;
    try {
      let stock = await db
        .select()
        .from(stocks)
        .where(eq(stocks.symbol, searchSymbol.toUpperCase()))
        .limit(1)
        .then((res) => res[0]);

      if (!stock) {
        const stockData = await stockService.getSingleStock(searchSymbol);
        const [newStock] = await db
          .insert(stocks)
          .values({
            symbol: searchSymbol.toUpperCase(),
            full_symbol: stockData.symbol,
            company_name: stockData.symbol.split('.')[0], // Simplified; fetch real name if needed
            exchange: stockData.symbol.endsWith('.NS') ? 'NSE' : 'BSE',
          })
          .returning();
        stock = newStock;
      }

      await db
        .insert(userPortfolios)
        .values({
          user_id: user.id,
          stock_id: stock.id,
          quantity: 0, // Default; update via UI or API as needed
          average_buy_price: 0, // Default; update as needed
        })
        .onConflictDoNothing();

      setSearchSymbol('');
      fetchPortfolio();
    } catch (err) {
      setError('Failed to add stock to portfolio');
      console.error(err);
    }
  };

  const removeFromPortfolio = async (stockId: number) => {
    if (!user) return;
    try {
      await db
        .delete(userPortfolios)
        .where(eq(userPortfolios.stock_id, stockId))
        .where(eq(userPortfolios.user_id, user.id));
      fetchPortfolio();
    } catch (err) {
      setError('Failed to remove stock from portfolio');
      console.error(err);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const PortfolioCard = ({ item }: { item: any }) => {
    const currentPrice = item.price?.current_price ? Number(item.price.current_price) : 0;
    const quantity = Number(item.portfolio.quantity);
    const averageBuyPrice = Number(item.portfolio.average_buy_price);
    const currentValue = currentPrice * quantity;
    const investedValue = averageBuyPrice * quantity;
    const profitLoss = currentValue - investedValue;
    const isPositive = profitLoss >= 0;

    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{item.stock.symbol}</CardTitle>
            {item.price && (
              <Badge variant={isPositive ? 'default' : 'destructive'} className="ml-2">
                {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {((profitLoss / investedValue) * 100).toFixed(2)}%
              </Badge>
            )}
          </div>
          <CardDescription>
            {item.stock.exchange} • Last updated:{' '}
            {item.price?.last_updated ? new Date(item.price.last_updated).toLocaleTimeString() : 'N/A'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {item.price ? (
              <>
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(currentPrice)}</p>
                  <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{formatCurrency(profitLoss)} ({((profitLoss / investedValue) * 100).toFixed(2)}%)
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-medium">{formatNumber(quantity)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg. Buy Price</p>
                    <p className="font-medium">{formatCurrency(averageBuyPrice)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Invested</p>
                    <p className="font-medium">{formatCurrency(investedValue)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Value</p>
                    <p className="font-medium">{formatCurrency(currentValue)}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Price data unavailable</p>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeFromPortfolio(item.stock.id)}
              className="w-full"
            >
              Remove from Portfolio
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const LoadingSkeleton = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-8 w-24" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <Skeleton className="h-8 w-full" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Portfolio</h1>
            <p className="text-muted-foreground">Manage your stock holdings and track performance.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchPortfolio} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add Stock to Portfolio</CardTitle>
            <CardDescription>Enter stock symbol (e.g., RELIANCE, TCS, HDFCBANK)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter stock symbol..."
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && addToPortfolio()}
                className="flex-1"
              />
              <Button onClick={addToPortfolio} disabled={!searchSymbol || loading}>
                <Search className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {lastUpdated && (
          <Alert>
            <AlertDescription>Last updated: {lastUpdated.toLocaleString()}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && portfolio.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} />)
          ) : (
            portfolio.map((item) => <PortfolioCard key={item.portfolio.id} item={item} />)
          )}
        </div>
      </div>
    </div>
  );
}