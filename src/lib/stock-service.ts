// "use client";
// // src/lib/stock-service.ts
// export interface StockPrice {
//   symbol: string;
//   current_price: number;
//   previous_close: number;
//   change: number;
//   change_percent: number;
//   volume: number;
//   market_cap?: number;
//   last_updated: string;
// }

// export interface StockError {
//   error: string;
//   message: string;
//   symbol?: string;
// }

// export interface BatchStockResponse {
//   successful_stocks: StockPrice[];
//   failed_stocks: StockError[];
//   total_requested: number;
//   successful_count: number;
//   failed_count: number;
// }

// export class StockServiceError extends Error {
//   constructor(
//     message: string,
//     public errorCode: string,
//     public symbol?: string
//   ) {
//     super(message);
//     this.name = 'StockServiceError';
//   }
// }

// // Environment-aware URL configuration
// function getStockServiceUrl(): string {
//   // Check if we're on the client side
//   if (typeof window !== 'undefined') {
//     // Client-side: Use environment variable or fallback
//     return process.env.NEXT_PUBLIC_STOCK_API_URL || 
//            process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') ||
//            'http://localhost:8000';
//   }
  
//   // Server-side: Use server environment variable or fallback
//   return process.env.PYTHON_STOCK_SERVICE_URL || 
//          process.env.STOCK_API_URL ||
//          'http://localhost:8000';
// }

// // Check if we're in development mode
// function isDevelopment(): boolean {
//   return process.env.NODE_ENV === 'development';
// }

// // Log environment info (only in development)
// if (isDevelopment() && typeof window !== 'undefined') {
//   console.log('🔧 Stock Service Configuration:', {
//     environment: process.env.NODE_ENV,
//     stockServiceUrl: getStockServiceUrl(),
//     isDevelopment: isDevelopment(),
//   });
// }

// export class StockService {
//   private baseUrl: string;
//   private timeout: number;

//   constructor(baseUrl?: string, timeout: number = 30000) {
//     this.baseUrl = baseUrl || getStockServiceUrl();
//     this.timeout = timeout;
    
//     // Log the URL being used (only in development)
//     if (isDevelopment()) {
//       console.log(`📡 StockService initialized with URL: ${this.baseUrl}`);
//     }
//   }

//   private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), this.timeout);

//     try {
//       const response = await fetch(url, {
//         ...options,
//         signal: controller.signal,
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           ...options.headers,
//         },
//       });

//       clearTimeout(timeoutId);
//       return response;
//     } catch (error) {
//       clearTimeout(timeoutId);
//       if (error instanceof Error && error.name === 'AbortError') {
//         throw new StockServiceError('Request timeout', 'TIMEOUT_ERROR');
//       }
//       throw error;
//     }
//   }

//   private handleApiError(error: any, symbol?: string): never {
//     if (error instanceof StockServiceError) {
//       throw error;
//     }

//     if (error.name === 'TypeError' && error.message.includes('fetch')) {
//       const devMessage = isDevelopment() 
//         ? ` Please check if the Python service is running on ${this.baseUrl}`
//         : '';
      
//       throw new StockServiceError(
//         `Unable to connect to stock service.${devMessage}`,
//         'CONNECTION_ERROR',
//         symbol
//       );
//     }

//     throw new StockServiceError(
//       error.message || 'Unknown error occurred',
//       'UNKNOWN_ERROR',
//       symbol
//     );
//   }

//   async healthCheck(): Promise<boolean> {
//     try {
//       const response = await this.fetchWithTimeout(`${this.baseUrl}/health`);
//       const result = response.ok;
      
//       if (isDevelopment()) {
//         console.log(`🏥 Health check: ${result ? '✅ Healthy' : '❌ Unhealthy'} (${this.baseUrl})`);
//       }
      
//       return result;
//     } catch (error) {
//       if (isDevelopment()) {
//         console.error('❌ Health check failed:', error);
//       }
//       return false;
//     }
//   }

//   async getSingleStock(symbol: string, exchange: string = 'NS'): Promise<StockPrice> {
//     try {
//       const url = `${this.baseUrl}/stock/${encodeURIComponent(symbol)}?exchange=${exchange}`;
      
//       if (isDevelopment()) {
//         console.log(`📊 Fetching single stock: ${symbol} from ${url}`);
//       }
      
//       const response = await this.fetchWithTimeout(url);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new StockServiceError(
//           errorData.detail?.message || `Failed to fetch stock data for ${symbol}`,
//           errorData.detail?.error || 'API_ERROR',
//           symbol
//         );
//       }

//       const stockData: StockPrice = await response.json();
//       return stockData;
//     } catch (error) {
//       this.handleApiError(error, symbol);
//     }
//   }

//   async getMultipleStocks(symbols: string[]): Promise<BatchStockResponse> {
//     try {
//       if (symbols.length === 0) {
//         throw new StockServiceError('Symbols array cannot be empty', 'INVALID_INPUT');
//       }

//       if (symbols.length > 50) {
//         throw new StockServiceError('Maximum 50 symbols allowed per request', 'BATCH_SIZE_EXCEEDED');
//       }

//       const url = `${this.baseUrl}/stocks/batch`;
      
//       if (isDevelopment()) {
//         console.log(`📊 Fetching batch stocks: [${symbols.join(', ')}] from ${url}`);
//       }

//       const response = await this.fetchWithTimeout(url, {
//         method: 'POST',
//         body: JSON.stringify({ symbols }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new StockServiceError(
//           errorData.detail?.message || 'Failed to fetch multiple stocks',
//           errorData.detail?.error || 'BATCH_ERROR'
//         );
//       }

//       const batchData: BatchStockResponse = await response.json();
//       return batchData;
//     } catch (error) {
//       this.handleApiError(error);
//     }
//   }

//   async getPopularStocks(): Promise<BatchStockResponse> {
//     try {
//       const url = `${this.baseUrl}/stocks/popular`;
      
//       if (isDevelopment()) {
//         console.log(`🌟 Fetching popular stocks from ${url}`);
//       }

//       const response = await this.fetchWithTimeout(url);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new StockServiceError(
//           errorData.detail?.message || 'Failed to fetch popular stocks',
//           errorData.detail?.error || 'POPULAR_STOCKS_ERROR'
//         );
//       }

//       const popularData: BatchStockResponse = await response.json();
//       return popularData;
//     } catch (error) {
//       this.handleApiError(error);
//     }
//   }

//   // Format Indian stock symbols
//   formatSymbol(symbol: string, exchange: 'NS' | 'BO' = 'NS'): string {
//     const cleanSymbol = symbol.toUpperCase().trim();
//     if (!cleanSymbol.endsWith('.NS') && !cleanSymbol.endsWith('.BO')) {
//       return `${cleanSymbol}.${exchange}`;
//     }
//     return cleanSymbol;
//   }

//   // Validate Indian stock symbol
//   isValidIndianSymbol(symbol: string): boolean {
//     const pattern = /^[A-Z0-9]+\.(NS|BO)$/;
//     return pattern.test(symbol.toUpperCase());
//   }

//   // Get current configuration info
//   getConfig() {
//     return {
//       baseUrl: this.baseUrl,
//       timeout: this.timeout,
//       environment: process.env.NODE_ENV,
//       isDevelopment: isDevelopment(),
//     };
//   }
// }

// // Export singleton instance with environment-aware configuration
// export const stockService = new StockService();

// // React Hook for stock data (only if running in browser)
// import { useState, useEffect, useCallback } from 'react';

// export interface UseStockDataOptions {
//   refreshInterval?: number; // in milliseconds
//   autoRefresh?: boolean;
//   onError?: (error: StockServiceError) => void;
//   onSuccess?: (data: BatchStockResponse) => void;
// }

// export function useStockData(
//   symbols: string[],
//   options: UseStockDataOptions = {}
// ) {
//   const { 
//     refreshInterval = 300000, // 5 minutes default
//     autoRefresh = true,
//     onError,
//     onSuccess 
//   } = options;
  
//   const [data, setData] = useState<BatchStockResponse | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

//   const fetchData = useCallback(async () => {
//     if (symbols.length === 0) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const result = await stockService.getMultipleStocks(symbols);
//       setData(result);
//       setLastUpdated(new Date());
//       onSuccess?.(result);
      
//       if (isDevelopment()) {
//         console.log(`✅ Stock data updated: ${result.successful_count}/${result.total_requested} successful`);
//       }
//     } catch (err) {
//       const stockError = err instanceof StockServiceError 
//         ? err 
//         : new StockServiceError('Failed to fetch stock data', 'UNKNOWN_ERROR');
      
//       setError(stockError.message);
//       onError?.(stockError);
      
//       if (isDevelopment()) {
//         console.error('❌ Stock data fetch error:', stockError);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [symbols, onError, onSuccess]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   useEffect(() => {
//     if (!autoRefresh || symbols.length === 0) return;

//     const interval = setInterval(fetchData, refreshInterval);
//     return () => clearInterval(interval);
//   }, [fetchData, refreshInterval, autoRefresh, symbols]);

//   return {
//     data,
//     loading,
//     error,
//     lastUpdated,
//     refetch: fetchData,
//   };
// }

// // Health check hook with better status tracking
// export function useStockServiceHealth() {
//   const [isHealthy, setIsHealthy] = useState<boolean>(false);
//   const [checking, setChecking] = useState<boolean>(true);
//   const [lastChecked, setLastChecked] = useState<Date | null>(null);

//   const checkHealth = useCallback(async () => {
//     setChecking(true);
//     try {
//       const healthy = await stockService.healthCheck();
//       setIsHealthy(healthy);
//       setLastChecked(new Date());
//     } catch (error) {
//       setIsHealthy(false);
//       if (isDevelopment()) {
//         console.error('Health check error:', error);
//       }
//     } finally {
//       setChecking(false);
//     }
//   }, []);

//   useEffect(() => {
//     checkHealth();
//     const interval = setInterval(checkHealth, 60000); // Check every minute

//     return () => clearInterval(interval);
//   }, [checkHealth]);

//   return { 
//     isHealthy, 
//     checking, 
//     lastChecked,
//     recheckHealth: checkHealth,
//     config: stockService.getConfig()
//   };
// }


"use client";
// src/lib/stock-service.ts - Enhanced version with better error handling

export interface StockPrice {
  symbol: string;
  current_price: number;
  previous_close: number;
  change: number;
  change_percent: number;
  volume: number;
  market_cap?: number;
  last_updated: string;
}

export interface StockError {
  error: string;
  message: string;
  symbol?: string;
}

export interface BatchStockResponse {
  successful_stocks: StockPrice[];
  failed_stocks: StockError[];
  total_requested: number;
  successful_count: number;
  failed_count: number;
  processing_time?: string;
}

export class StockServiceError extends Error {
  constructor(
    message: string,
    public errorCode: string,
    public symbol?: string,
    public isRateLimit: boolean = false
  ) {
    super(message);
    this.name = 'StockServiceError';
  }
}

// Environment-aware URL configuration
function getStockServiceUrl(): string {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_STOCK_API_URL || 
           process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') ||
           'http://localhost:8000';
  }
  
  return process.env.PYTHON_STOCK_SERVICE_URL || 
         process.env.STOCK_API_URL ||
         'http://localhost:8000';
}

function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

if (isDevelopment() && typeof window !== 'undefined') {
  console.log('🔧 Enhanced Stock Service Configuration:', {
    environment: process.env.NODE_ENV,
    stockServiceUrl: getStockServiceUrl(),
    isDevelopment: isDevelopment(),
  });
}

export class StockService {
  private baseUrl: string;
  private timeout: number;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;
  private requestDelay = 2000; // 2 seconds between requests

  constructor(baseUrl?: string, timeout: number = 45000) { // Increased timeout
    this.baseUrl = baseUrl || getStockServiceUrl();
    this.timeout = timeout;
    
    if (isDevelopment()) {
      console.log(`📡 Enhanced StockService initialized with URL: ${this.baseUrl}`);
    }
  }

  private async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('Queue request failed:', error);
        }
        
        // Add delay between requests
        if (this.requestQueue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, this.requestDelay));
        }
      }
    }

    this.isProcessingQueue = false;
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new StockServiceError('Request timeout - server may be processing', 'TIMEOUT_ERROR');
      }
      throw error;
    }
  }

  private handleApiError(error: any, symbol?: string): never {
    if (error instanceof StockServiceError) {
      throw error;
    }

    // Handle rate limiting specifically
    if (error.message && error.message.includes('429')) {
      throw new StockServiceError(
        'Rate limit exceeded. Please wait a moment before making more requests.',
        'RATE_LIMIT_ERROR',
        symbol,
        true
      );
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const devMessage = isDevelopment() 
        ? ` Please check if the Python service is running on ${this.baseUrl}`
        : '';
      
      throw new StockServiceError(
        `Unable to connect to stock service.${devMessage}`,
        'CONNECTION_ERROR',
        symbol
      );
    }

    throw new StockServiceError(
      error.message || 'Unknown error occurred',
      'UNKNOWN_ERROR',
      symbol
    );
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/health`);
      const result = response.ok;
      
      if (isDevelopment()) {
        console.log(`🏥 Health check: ${result ? '✅ Healthy' : '❌ Unhealthy'} (${this.baseUrl})`);
      }
      
      return result;
    } catch (error) {
      if (isDevelopment()) {
        console.error('❌ Health check failed:', error);
      }
      return false;
    }
  }

  async getSingleStock(symbol: string, exchange: string = 'NS'): Promise<StockPrice> {
    try {
      const url = `${this.baseUrl}/stock/${encodeURIComponent(symbol)}?exchange=${exchange}`;
      
      if (isDevelopment()) {
        console.log(`📊 Fetching single stock: ${symbol} from ${url}`);
      }
      
      const response = await this.fetchWithTimeout(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 429) {
          throw new StockServiceError(
            'Rate limit exceeded. The service is being throttled to prevent overwhelming Yahoo Finance.',
            'RATE_LIMIT_ERROR',
            symbol,
            true
          );
        }
        
        throw new StockServiceError(
          errorData.detail?.message || `Failed to fetch stock data for ${symbol}`,
          errorData.detail?.error || 'API_ERROR',
          symbol
        );
      }

      const stockData: StockPrice = await response.json();
      return stockData;
    } catch (error) {
      this.handleApiError(error, symbol);
    }
  }

  async getMultipleStocks(symbols: string[]): Promise<BatchStockResponse> {
    try {
      if (symbols.length === 0) {
        throw new StockServiceError('Symbols array cannot be empty', 'INVALID_INPUT');
      }

      // Reduced batch size to prevent rate limiting
      if (symbols.length > 10) {
        throw new StockServiceError(
          'Maximum 10 symbols allowed per request to prevent rate limiting', 
          'BATCH_SIZE_EXCEEDED'
        );
      }

      const url = `${this.baseUrl}/stocks/batch`;
      
      if (isDevelopment()) {
        console.log(`📊 Fetching batch stocks: [${symbols.join(', ')}] from ${url}`);
        console.log('⏱️  This may take longer due to rate limiting prevention...');
      }

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        body: JSON.stringify({ symbols }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 429) {
          throw new StockServiceError(
            'Rate limit exceeded. Please wait a moment before making another request.',
            'RATE_LIMIT_ERROR',
            undefined,
            true
          );
        }
        
        throw new StockServiceError(
          errorData.detail?.message || 'Failed to fetch multiple stocks',
          errorData.detail?.error || 'BATCH_ERROR'
        );
      }

      const batchData: BatchStockResponse = await response.json();
      
      if (isDevelopment()) {
        console.log(`✅ Batch completed: ${batchData.successful_count}/${batchData.total_requested} successful`);
      }
      
      return batchData;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async getPopularStocks(): Promise<BatchStockResponse> {
    try {
      const url = `${this.baseUrl}/stocks/popular`;
      
      if (isDevelopment()) {
        console.log(`🌟 Fetching popular stocks from ${url}`);
        console.log('⏱️  This may take longer due to rate limiting prevention...');
      }

      const response = await this.fetchWithTimeout(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 429) {
          throw new StockServiceError(
            'Rate limit exceeded for popular stocks. Please wait a moment.',
            'RATE_LIMIT_ERROR',
            undefined,
            true
          );
        }
        
        throw new StockServiceError(
          errorData.detail?.message || 'Failed to fetch popular stocks',
          errorData.detail?.error || 'POPULAR_STOCKS_ERROR'
        );
      }

      const popularData: BatchStockResponse = await response.json();
      
      if (isDevelopment()) {
        console.log(`✅ Popular stocks: ${popularData.successful_count}/${popularData.total_requested} successful`);
      }
      
      return popularData;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  // Get cache statistics for debugging
  async getCacheStats() {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/cache/stats`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      if (isDevelopment()) {
        console.error('Failed to get cache stats:', error);
      }
    }
    return null;
  }

  // Clear cache (for development)
  async clearCache() {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/cache/clear`, {
        method: 'POST'
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      if (isDevelopment()) {
        console.error('Failed to clear cache:', error);
      }
    }
    return null;
  }

  formatSymbol(symbol: string, exchange: 'NS' | 'BO' = 'NS'): string {
    const cleanSymbol = symbol.toUpperCase().trim();
    if (!cleanSymbol.endsWith('.NS') && !cleanSymbol.endsWith('.BO')) {
      return `${cleanSymbol}.${exchange}`;
    }
    return cleanSymbol;
  }

  isValidIndianSymbol(symbol: string): boolean {
    const pattern = /^[A-Z0-9]+\.(NS|BO)$/;
    return pattern.test(symbol.toUpperCase());
  }

  getConfig() {
    return {
      baseUrl: this.baseUrl,
      timeout: this.timeout,
      environment: process.env.NODE_ENV,
      isDevelopment: isDevelopment(),
      requestDelay: this.requestDelay,
    };
  }
}

export const stockService = new StockService();

// Enhanced React Hook with better error handling
import { useState, useEffect, useCallback } from 'react';

export interface UseStockDataOptions {
  refreshInterval?: number;
  autoRefresh?: boolean;
  onError?: (error: StockServiceError) => void;
  onSuccess?: (data: BatchStockResponse) => void;
  maxRetries?: number;
}

export function useStockData(
  symbols: string[],
  options: UseStockDataOptions = {}
) {
  const { 
    refreshInterval = 600000, // Increased to 10 minutes
    autoRefresh = true,
    onError,
    onSuccess,
    maxRetries = 3
  } = options;
  
  const [data, setData] = useState<BatchStockResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const fetchData = useCallback(async (isRetry: boolean = false) => {
    if (symbols.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const result = await stockService.getMultipleStocks(symbols);
      setData(result);
      setLastUpdated(new Date());
      setRetryCount(0); // Reset retry count on success
      onSuccess?.(result);
      
      if (isDevelopment()) {
        console.log(`✅ Stock data updated: ${result.successful_count}/${result.total_requested} successful`);
      }
    } catch (err) {
      const stockError = err instanceof StockServiceError 
        ? err 
        : new StockServiceError('Failed to fetch stock data', 'UNKNOWN_ERROR');
      
      // Handle rate limiting with exponential backoff
      if (stockError.isRateLimit && retryCount < maxRetries && !isRetry) {
        const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Max 30 seconds
        setRetryCount(prev => prev + 1);
        
        if (isDevelopment()) {
          console.log(`⏳ Rate limited, retrying in ${backoffDelay/1000}s (attempt ${retryCount + 1}/${maxRetries})`);
        }
        
        setTimeout(() => {
          fetchData(true);
        }, backoffDelay);
        
        setError(`Rate limited. Retrying in ${Math.ceil(backoffDelay/1000)} seconds...`);
      } else {
        setError(stockError.message);
        onError?.(stockError);
        
        if (isDevelopment()) {
          console.error('❌ Stock data fetch error:', stockError);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [symbols, onError, onSuccess, retryCount, maxRetries]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh || symbols.length === 0) return;

    const interval = setInterval(() => {
      if (!loading) { // Don't start new request if one is in progress
        fetchData();
      }
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval, autoRefresh, symbols, loading]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    retryCount,
    refetch: () => fetchData(),
  };
}

// Enhanced health check hook
export function useStockServiceHealth() {
  const [isHealthy, setIsHealthy] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);

  const checkHealth = useCallback(async () => {
    setChecking(true);
    try {
      const [healthy, stats] = await Promise.all([
        stockService.healthCheck(),
        stockService.getCacheStats()
      ]);
      
      setIsHealthy(healthy);
      setCacheStats(stats);
      setLastChecked(new Date());
      
      if (isDevelopment()) {
        console.log('🏥 Health check completed:', { healthy, stats });
      }
    } catch (error) {
      setIsHealthy(false);
      if (isDevelopment()) {
        console.error('Health check error:', error);
      }
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 120000); // Check every 2 minutes

    return () => clearInterval(interval);
  }, [checkHealth]);

  return { 
    isHealthy, 
    checking, 
    lastChecked,
    cacheStats,
    recheckHealth: checkHealth,
    config: stockService.getConfig(),
    clearCache: () => stockService.clearCache()
  };
}

// Utility hook for handling rate-limited requests
export function useRateLimitedRequest() {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitRetryAfter, setRateLimitRetryAfter] = useState<number | null>(null);

  const executeRequest = useCallback(async <T>(
    requestFn: () => Promise<T>,
    onError?: (error: StockServiceError) => void
  ): Promise<T | null> => {
    try {
      setIsRateLimited(false);
      setRateLimitRetryAfter(null);
      return await requestFn();
    } catch (error) {
      if (error instanceof StockServiceError && error.isRateLimit) {
        setIsRateLimited(true);
        // Estimate retry time (could be enhanced with server response)
        const retryAfter = 60; // 1 minute default
        setRateLimitRetryAfter(retryAfter);
        
        if (isDevelopment()) {
          console.log(`⏳ Rate limited, suggested retry after ${retryAfter}s`);
        }
      }
      
      onError?.(error instanceof StockServiceError ? error : new StockServiceError(
        'Unknown error',
        'UNKNOWN_ERROR'
      ));
      
      return null;
    }
  }, []);

  return {
    executeRequest,
    isRateLimited,
    rateLimitRetryAfter
  };
}