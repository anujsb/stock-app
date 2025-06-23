import { NextResponse } from 'next/server';
import { WatchlistRepository } from '@/repositories/WatchlistRepository';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const watchlistRepo = new WatchlistRepository();
    const watchlistData = await watchlistRepo.getUserWatchlist(userId);
    return NextResponse.json(watchlistData);
  } catch (error) {
    console.error('Failed to fetch watchlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watchlist' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId, symbol } = await request.json();
    
    if (!userId || !symbol) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const watchlistRepo = new WatchlistRepository();
    let stock = await watchlistRepo.getStockBySymbol(symbol);
    
    if (!stock) {
      stock = await watchlistRepo.createStock(symbol);
    }
    
    await watchlistRepo.addToWatchlist(userId, stock.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to add stock:', error);
    return NextResponse.json(
      { error: 'Failed to add stock to watchlist' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId, stockId } = await request.json();
    
    if (!userId || !stockId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const watchlistRepo = new WatchlistRepository();
    await watchlistRepo.removeFromWatchlist(userId, stockId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove stock:', error);
    return NextResponse.json(
      { error: 'Failed to remove stock from watchlist' },
      { status: 500 }
    );
  }
}