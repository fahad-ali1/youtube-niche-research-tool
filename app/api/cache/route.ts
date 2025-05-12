import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

export async function DELETE() {
  try {
    const client = await getRedisClient();
    if (!client) {
      throw new Error('Redis client not available');
    }
    
    await client.flushAll();
    return NextResponse.json({ success: true, message: 'Cache successfully wiped' });
  } catch (error) {
    console.error('Error wiping cache:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to wipe cache', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 