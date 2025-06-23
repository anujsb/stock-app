// import { NewsFilter } from '@/components/news/news-filter'
// import { NewsList } from '@/components/news/news-list'

// export default function NewsPage() {
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-gray-900">Stock News</h1>
//       </div>
      
//       <NewsFilter />
//       <NewsList />
//     </div>
//   )
// }

// app/news/page.tsx
'use client';

import { useState } from 'react';
import { useNews } from '@/hooks/useNews';
import { NewsGrid } from '@/components/news/NewsGrid';
import { NewsFilters } from '@/components/news/NewsFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Newspaper, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

const NewsLoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i}>
        <div className="aspect-video w-full">
          <Skeleton className="w-full h-full rounded-t-lg" />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Card>
    ))}
  </div>
);

export default function NewsPage() {
  const [category, setCategory] = useState('business');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    articles, 
    loading, 
    error, 
    totalResults, 
    hasMore, 
    loadMore, 
    refresh 
  } = useNews({ 
    category: searchQuery ? undefined : category, 
    query: searchQuery || 'Indian stock market OR BSE OR NSE OR NIFTY OR SENSEX',
    autoRefresh: true 
  });

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setSearchQuery(''); // Clear search when changing category
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Newspaper className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Market News</h1>
            <p className="text-muted-foreground">
              Stay updated with the latest Indian stock market and financial news
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Articles</p>
                  <p className="text-2xl font-bold">{totalResults.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Loaded</p>
                  <p className="text-2xl font-bold">{articles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="text-2xl font-bold capitalize">
                    {searchQuery ? 'Search' : category}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <NewsFilters
        onCategoryChange={handleCategoryChange}
        onSearch={handleSearch}
        onRefresh={refresh}
        loading={loading}
      />

      {/* Error State */}
      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}. Please try again or contact support if the issue persists.
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && articles.length === 0 ? (
        <NewsLoadingSkeleton />
      ) : (
        <>
          {/* News Grid */}
          <NewsGrid articles={articles} />

          {/* Load More Button */}
          {hasMore && !loading && (
            <div className="text-center mt-8">
              <Button 
                onClick={loadMore} 
                variant="outline" 
                size="lg"
                className="min-w-[200px]"
              >
                Load More Articles
              </Button>
            </div>
          )}

          {/* Loading More Indicator */}
          {loading && articles.length > 0 && (
            <div className="text-center mt-8">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-muted-foreground">Loading more articles...</span>
              </div>
            </div>
          )}

          {/* No More Articles */}
          {!hasMore && articles.length > 0 && (
            <div className="text-center mt-8">
              <p className="text-muted-foreground">
                You've reached the end of the articles.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}