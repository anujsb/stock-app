
// src/app/api/stocks/batch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stockService } from '@/lib/stock-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbols } = body;

    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json(
        { error: 'INVALID_REQUEST', message: 'Symbols must be an array' },
        { status: 400 }
      );
    }

    const batchData = await stockService.getMultipleStocks(symbols);
    
    return NextResponse.json(batchData, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('Batch API Error:', error);
    
    const statusCode = error.errorCode === 'CONNECTION_ERROR' ? 503 : 500;
    
    return NextResponse.json(
      {
        error: error.errorCode || 'BATCH_ERROR',
        message: error.message || 'Failed to process batch request',
      },
      { status: statusCode }
    );
  }
}
