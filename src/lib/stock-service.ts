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

export class StockService {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = 'http://localhost:8000', timeout: number = 30000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
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
      throw new StockServiceError(
        'Unable to connect to stock service. Please check if the Python service is running.',
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
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  async getSingleStock(symbol: string, exchange: string = 'NS'): Promise<StockPrice> {
    try {
      const url = `${this.baseUrl}/stock/${encodeURIComponent(symbol)}?exchange=${exchange}`;
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

      const response = await this.fetchWithTimeout(`${this.baseUrl}/stocks/batch`, {
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
      const response = await this.fetchWithTimeout(`${this.baseUrl}/stocks/popular`);

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
}

// Export singleton instance
export const stockService = new StockService();

// React Hook for stock data (only if running in browser)
import { useState, useEffect, useCallback } from 'react';

export interface UseStockDataOptions {
  refreshInterval?: number; // in milliseconds
  autoRefresh?: boolean;
}

export function useStockData(
  symbols: string[],
  options: UseStockDataOptions = {}
) {
  const { refreshInterval = 300000, autoRefresh = true } = options; // 5 minutes default
  
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
    } catch (err) {
      const errorMessage = err instanceof StockServiceError 
        ? err.message 
        : 'Failed to fetch stock data';
      setError(errorMessage);
      console.error('Stock data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [symbols]);

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

// Health check hook
export function useStockServiceHealth() {
  const [isHealthy, setIsHealthy] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkHealth = async () => {
      setChecking(true);
      try {
        const healthy = await stockService.healthCheck();
        setIsHealthy(healthy);
      } catch (error) {
        setIsHealthy(false);
      } finally {
        setChecking(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return { isHealthy, checking };
}