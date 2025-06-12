// src/app/test/page.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, RefreshCw, Search, Activity } from 'lucide-react';
import { useStockData, useStockServiceHealth } from '@/lib/stock-service';
import type { StockPrice } from '@/lib/stock-service';

export default function StockTestPage() {
  const [searchSymbol, setSearchSymbol] = React.useState('');
  const [watchlistSymbols, setWatchlistSymbols] = React.useState([
    'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR'
  ]);
  
  const { data, loading, error, lastUpdated, refetch } = useStockData(watchlistSymbols, {
    refreshInterval: 300000, // 5 minutes
    autoRefresh: true
  });
  
  const { isHealthy, checking } = useStockServiceHealth();

  const addToWatchlist = () => {
    if (searchSymbol && !watchlistSymbols.includes(searchSymbol.toUpperCase())) {
      setWatchlistSymbols([...watchlistSymbols, searchSymbol.toUpperCase()]);
      setSearchSymbol('');
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlistSymbols(watchlistSymbols.filter(s => s !== symbol));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const StockCard = ({ stock }: { stock: StockPrice }) => {
    const isPositive = stock.change >= 0;
    
    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              {stock.symbol.replace('.NS', '')}
            </CardTitle>
            <Badge variant={isPositive ? 'default' : 'destructive'} className="ml-2">
              {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {stock.change_percent.toFixed(2)}%
            </Badge>
          </div>
          <CardDescription>
            NSE • Last updated: {new Date(stock.last_updated).toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-2xl font-bold">
                {formatCurrency(stock.current_price)}
              </p>
              <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{formatCurrency(stock.change)} ({stock.change_percent.toFixed(2)}%)
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Previous Close</p>
                <p className="font-medium">{formatCurrency(stock.previous_close)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Volume</p>
                <p className="font-medium">{formatNumber(stock.volume)}</p>
              </div>
            </div>
            
            {stock.market_cap && (
              <div>
                <p className="text-muted-foreground text-sm">Market Cap</p>
                <p className="font-medium">{formatCurrency(stock.market_cap)}</p>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeFromWatchlist(stock.symbol.split('.')[0])}
              className="w-full"
            >
              Remove from Watchlist
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
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Stock Watchlist</h1>
            <p className="text-muted-foreground">
              Stocks to monitor for price changes and performance updates.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={isHealthy ? 'default' : 'destructive'}>
              <Activity className="w-3 h-3 mr-1" />
              {checking ? 'Checking...' : isHealthy ? 'Service Online' : 'Service Offline'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Add Stock Section */}
        <Card>
          <CardHeader>
            <CardTitle>Add Stock to Watchlist</CardTitle>
            <CardDescription>
              Enter stock symbol (e.g., RELIANCE, TCS, HDFCBANK)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter stock symbol..."
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && addToWatchlist()}
                className="flex-1"
              />
              <Button onClick={addToWatchlist} disabled={!searchSymbol}>
                <Search className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Information */}
        {lastUpdated && (
          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription>
              Last updated: {lastUpdated.toLocaleString()} • 
              Showing {data?.successful_count || 0} stocks • 
              Auto-refresh every 5 minutes
            </AlertDescription>
          </Alert>
        )}

        {/* Error Handling */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Stock Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && !data ? (
            // Initial loading state
            Array.from({ length: 6 }).map((_, i) => (
              <LoadingSkeleton key={i} />
            ))
          ) : (
            <>
              {/* Successful stocks */}
              {data?.successful_stocks.map((stock) => (
                <StockCard key={stock.symbol} stock={stock} />
              ))}
              
              {/* Loading cards for new requests */}
              {loading && Array.from({ length: Math.max(0, watchlistSymbols.length - (data?.successful_stocks.length || 0)) }).map((_, i) => (
                <LoadingSkeleton key={`loading-${i}`} />
              ))}
            </>
          )}
        </div>

        {/* Failed Stocks */}
        {data?.failed_stocks && data.failed_stocks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Failed to Load</CardTitle>
              <CardDescription>
                These stocks couldn't be fetched
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.failed_stocks.map((error, index) => (
                  <Alert key={index} variant="destructive">
                    <AlertDescription>
                      <strong>{error.symbol}:</strong> {error.message}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{data.total_requested}</p>
                  <p className="text-muted-foreground">Total Requested</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{data.successful_count}</p>
                  <p className="text-muted-foreground">Successfully Loaded</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{data.failed_count}</p>
                  <p className="text-muted-foreground">Failed to Load</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}