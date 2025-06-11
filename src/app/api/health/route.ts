
// src/app/api/health/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stockService } from '@/lib/stock-service';

export async function GET(request: NextRequest) {
  try {
    const isHealthy = await stockService.healthCheck();
    
    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        python_stock_service: isHealthy ? 'up' : 'down',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        services: {
          python_stock_service: 'down',
        },
      },
      { status: 503 }
    );
  }
}