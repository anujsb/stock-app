
// src/app/api/stocks/popular/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stockService } from '@/lib/stock-service';

export async function GET(request: NextRequest) {
  try {
    const popularData = await stockService.getPopularStocks();
    
    return NextResponse.json(popularData, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    });
  } catch (error: any) {
    console.error('Popular Stocks API Error:', error);
    
    const statusCode = error.errorCode === 'CONNECTION_ERROR' ? 503 : 500;
    
    return NextResponse.json(
      {
        error: error.errorCode || 'POPULAR_STOCKS_ERROR',
        message: error.message || 'Failed to fetch popular stocks',
      },
      { status: statusCode }
    );
  }
}
