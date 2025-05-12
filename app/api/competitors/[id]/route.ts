import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { setCachedData } from '@/lib/redis';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Properly await the params object before accessing its properties
    const { id } = await params;
    
    // Check if competitor exists
    const competitor = await prisma.competitors.findUnique({
      where: { id }
    });
    
    if (!competitor) {
      return NextResponse.json(
        { error: 'Competitor not found' },
        { status: 404 }
      );
    }
    
    // First, delete all videos associated with this channel
    const deleteVideosResult = await prisma.video_statistics.deleteMany({
      where: { channel_id: id }
    });
    
    // Then delete the competitor
    await prisma.competitors.delete({
      where: { id }
    });
    
    // Invalidate cache
    const cacheKey = 'competitors:all';
    await setCachedData(cacheKey, null, 0);
    
    // Also wipe videos cache as the videos filtering will be affected
    await setCachedData('videos*', null, 0);
    
    return NextResponse.json({
      success: true, 
      message: `Competitor deleted successfully. ${deleteVideosResult.count} associated videos were also removed.`
    });
  } catch (error) {
    console.error('Error deleting competitor:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete competitor',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 