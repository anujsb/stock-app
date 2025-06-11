// src/app/api/stocks/[symbol]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stockService } from '@/lib/stock-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const { searchParams } = new URL(request.url);
    const exchange = searchParams.get('exchange') || 'NS';

    if (!symbol) {
      return NextResponse.json(
        { error: 'MISSING_SYMBOL', message: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    const stockData = await stockService.getSingleStock(symbol, exchange);
    
    return NextResponse.json(stockData, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    
    const statusCode = error.errorCode === 'CONNECTION_ERROR' ? 503 : 500;
    
          return NextResponse.json(
      {
        error: error.errorCode || 'INTERNAL_ERROR',
        message: error.message || 'Internal server error',
        symbol: (await params).symbol,
      },
      { status: statusCode }
    );
  }
}
