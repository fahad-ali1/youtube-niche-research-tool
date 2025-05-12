import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get video counts for all channels in a single, efficient query
    const channelCounts = await prisma.video_statistics.groupBy({
      by: ['channel_id'],
      _count: {
        id: true
      }
    });
    
    // Convert to a map for easier consumption
    const statsMap = channelCounts.reduce((map, item) => {
      map[item.channel_id] = item._count.id;
      return map;
    }, {} as Record<string, number>);
    
    return NextResponse.json(statsMap);
  } catch (error) {
    console.error('Error fetching channel statistics:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch channel statistics',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 