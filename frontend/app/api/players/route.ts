import { NextResponse } from 'next/server';
import { loadPlayerData } from '@/lib/data';

export async function GET() {
  try {
    const players = await loadPlayerData();
    return NextResponse.json(players);
  } catch (error) {
    console.error('Error loading player data:', error);
    return NextResponse.json({ error: 'Failed to load player data' }, { status: 500 });
  }
}