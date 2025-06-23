// src/app/api/update-prices/route.ts
import { NextResponse } from 'next/server';
import { WatchlistRepository } from '@/repositories/WatchlistRepository';
import { db } from '@/lib/db';
import { stocks } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const watchlistRepo = new WatchlistRepository();
    const activeStocks = await db
      .select({ symbol: stocks.symbol })
      .from(stocks)
      .where(eq(stocks.is_active, true));
    const symbols = activeStocks.map((stock) => stock.symbol);
    await watchlistRepo.updateStockPrices(symbols.slice(0, 8)); // Respect batch limit
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update stock prices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update stock prices' },
      { status: 500 }
    );
  }
}