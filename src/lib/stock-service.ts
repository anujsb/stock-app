// src/lib/stock-service.ts
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
}

export class StockServiceError extends Error {
  constructor(
    message: string,
    public errorCode: string,
    public symbol?: string
  ) {
    super(message);
    this.name = 'StockServiceError';
  }
}

// Environment-aware URL configuration
function getStockServiceUrl(): string {
  // Check if we're on the client side
  if (typeof window !== 'undefined') {
    // Client-side: Use environment variable or fallback
    return process.env.NEXT_PUBLIC_STOCK_API_URL || 
           process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') ||
           'http://localhost:8000';
  }
  
  // Server-side: Use server environment variable or fallback
  return process.env.PYTHON_STOCK_SERVICE_URL || 
         process.env.STOCK_API_URL ||
         'http://localhost:8000';
}

// Check if we're in development mode
function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

// Log environment info (only in development)
if (isDevelopment() && typeof window !== 'undefined') {
  console.log('🔧 Stock Service Configuration:', {
    environment: process.env.NODE_ENV,
    stockServiceUrl: getStockServiceUrl(),
    isDevelopment: isDevelopment(),
  });
}

export class StockService {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl?: string, timeout: number = 30000) {
    this.baseUrl = baseUrl || getStockServiceUrl();
    this.timeout = timeout;
    
    // Log the URL being used (only in development)
    if (isDevelopment()) {
      console.log(`📡 StockService initialized with URL: ${this.baseUrl}`);
    }
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
        throw new StockServiceError('Request timeout', 'TIMEOUT_ERROR');
      }
      throw error;
    }
  }

  private handleApiError(error: any, symbol?: string): never {
    if (error instanceof StockServiceError) {
      throw error;
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
        const errorData = await response.json();
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

      if (symbols.length > 50) {
        throw new StockServiceError('Maximum 50 symbols allowed per request', 'BATCH_SIZE_EXCEEDED');
      }

      const url = `${this.baseUrl}/stocks/batch`;
      
      if (isDevelopment()) {
        console.log(`📊 Fetching batch stocks: [${symbols.join(', ')}] from ${url}`);
      }

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        body: JSON.stringify({ symbols }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new StockServiceError(
          errorData.detail?.message || 'Failed to fetch multiple stocks',
          errorData.detail?.error || 'BATCH_ERROR'
        );
      }

      const batchData: BatchStockResponse = await response.json();
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
      }

      const response = await this.fetchWithTimeout(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new StockServiceError(
          errorData.detail?.message || 'Failed to fetch popular stocks',
          errorData.detail?.error || 'POPULAR_STOCKS_ERROR'
        );
      }

      const popularData: BatchStockResponse = await response.json();
      return popularData;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  // Format Indian stock symbols
  formatSymbol(symbol: string, exchange: 'NS' | 'BO' = 'NS'): string {
    const cleanSymbol = symbol.toUpperCase().trim();
    if (!cleanSymbol.endsWith('.NS') && !cleanSymbol.endsWith('.BO')) {
      return `${cleanSymbol}.${exchange}`;
    }
    return cleanSymbol;
  }

  // Validate Indian stock symbol
  isValidIndianSymbol(symbol: string): boolean {
    const pattern = /^[A-Z0-9]+\.(NS|BO)$/;
    return pattern.test(symbol.toUpperCase());
  }

  // Get current configuration info
  getConfig() {
    return {
      baseUrl: this.baseUrl,
      timeout: this.timeout,
      environment: process.env.NODE_ENV,
      isDevelopment: isDevelopment(),
    };
  }
}

// Export singleton instance with environment-aware configuration
export const stockService = new StockService();

// React Hook for stock data (only if running in browser)
import { useState, useEffect, useCallback } from 'react';

export interface UseStockDataOptions {
  refreshInterval?: number; // in milliseconds
  autoRefresh?: boolean;
  onError?: (error: StockServiceError) => void;
  onSuccess?: (data: BatchStockResponse) => void;
}

export function useStockData(
  symbols: string[],
  options: UseStockDataOptions = {}
) {
  const { 
    refreshInterval = 300000, // 5 minutes default
    autoRefresh = true,
    onError,
    onSuccess 
  } = options;
  
  const [data, setData] = useState<BatchStockResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    if (symbols.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const result = await stockService.getMultipleStocks(symbols);
      setData(result);
      setLastUpdated(new Date());
      onSuccess?.(result);
      
      if (isDevelopment()) {
        console.log(`✅ Stock data updated: ${result.successful_count}/${result.total_requested} successful`);
      }
    } catch (err) {
      const stockError = err instanceof StockServiceError 
        ? err 
        : new StockServiceError('Failed to fetch stock data', 'UNKNOWN_ERROR');
      
      setError(stockError.message);
      onError?.(stockError);
      
      if (isDevelopment()) {
        console.error('❌ Stock data fetch error:', stockError);
      }
    } finally {
      setLoading(false);
    }
  }, [symbols, onError, onSuccess]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh || symbols.length === 0) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval, autoRefresh, symbols]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch: fetchData,
  };
}

// Health check hook with better status tracking
export function useStockServiceHealth() {
  const [isHealthy, setIsHealthy] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = useCallback(async () => {
    setChecking(true);
    try {
      const healthy = await stockService.healthCheck();
      setIsHealthy(healthy);
      setLastChecked(new Date());
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
    const interval = setInterval(checkHealth, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkHealth]);

  return { 
    isHealthy, 
    checking, 
    lastChecked,
    recheckHealth: checkHealth,
    config: stockService.getConfig()
  };
}