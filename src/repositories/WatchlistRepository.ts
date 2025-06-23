// src/repositories/WatchlistRepository.ts
import { db } from '@/lib/db';
import { userWatchlists, stocks, stockPrices } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { stockService } from '@/lib/stock-service';

export class WatchlistRepository {
  // Fetch user's watchlist with stock and price data
  async getUserWatchlist(userId: string) {
    const watchlistData = await db
      .select({
        stock: stocks,
        price: stockPrices,
      })
      .from(userWatchlists)
      .innerJoin(stocks, eq(userWatchlists.stock_id, stocks.id))
      .leftJoin(stockPrices, eq(stocks.id, stockPrices.stock_id))
      .where(eq(userWatchlists.user_id, userId));

    return watchlistData;
  }

  // Get stock by symbol
  async getStockBySymbol(symbol: string) {
    const result = await db
      .select()
      .from(stocks)
      .where(eq(stocks.symbol, symbol.toUpperCase()))
      .limit(1);
    return result[0];
  }

  // Create a new stock in the database
  async createStock(symbol: string) {
    const stockData = await stockService.getSingleStock(symbol);
    const [newStock] = await db
      .insert(stocks)
      .values({
        symbol: symbol.toUpperCase(),
        full_symbol: stockData.symbol,
        company_name: stockData.symbol.split('.')[0], // Simplified; fetch real name if needed
        exchange: stockData.symbol.endsWith('.NS') ? 'NSE' : 'BSE',
      })
      .returning();
    return newStock;
  }

  // Add stock to user's watchlist
  async addToWatchlist(userId: string, stockId: number) {
    await db
      .insert(userWatchlists)
      .values({
        user_id: userId,
        stock_id: stockId,
      })
      .onConflictDoNothing();
  }

  // Remove stock from user's watchlist
  async removeFromWatchlist(userId: string, stockId: number) {
    await db
      .delete(userWatchlists)
      .where(
        and(
          eq(userWatchlists.user_id, userId),
          eq(userWatchlists.stock_id, stockId)
        )
      );
  }

  // Update stock prices for stale or missing data
  async updateStockPrices(symbols: string[]) {
    const batchData = await stockService.getMultipleStocks(symbols);
    for (const price of batchData.successful_stocks) {
      const stock = await this.getStockBySymbol(price.symbol.split('.')[0]);
      if (stock) {
        await db
          .insert(stockPrices)
          .values({
            stock_id: stock.id,
            current_price: price.current_price.toString(),
            previous_close: price.previous_close.toString(),
            change_amount: price.change.toString(),
            change_percent: price.change_percent.toString(),
            volume: price.volume,
            market_cap: price.market_cap || null,
            last_updated: new Date(price.last_updated),
          })
          .onConflictDoUpdate({
            target: stockPrices.stock_id,
            set: {
              current_price: price.current_price.toString(),
              previous_close: price.previous_close.toString(),
              change_amount: price.change.toString(),
              change_percent: price.change_percent.toString(),
              volume: price.volume,
              market_cap: price.market_cap || null,
              last_updated: new Date(price.last_updated),
            },
          });
      }
    }
  }
}