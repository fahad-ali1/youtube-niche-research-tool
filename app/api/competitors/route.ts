import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCachedData, setCachedData } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    // Check if the request is from the control panel
    const referer = request.headers.get('referer') || '';
    const isControlPanel = referer.includes('/control');
    
    // Skip cache for control panel requests
    if (isControlPanel) {
      // Fetch all competitors directly from database
      const competitors = await prisma.competitors.findMany();
      return NextResponse.json(competitors);
    }
    
    // For dashboard requests, continue using cache
    const cacheKey = 'competitors:all';
    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }
    
    // Fetch all competitors from database
    const competitors = await prisma.competitors.findMany();
    
    // Cache the results for 1 hour (3600 seconds) for dashboard use
    await setCachedData(cacheKey, competitors, 3600);

    return NextResponse.json(competitors);
  } catch (error) {
    console.error('Error fetching competitors:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch competitors',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.id || !body.url) {
      return NextResponse.json(
        { error: 'Channel ID and URL are required' },
        { status: 400 }
      );
    }
    
    // Check if competitor already exists
    const existingCompetitor = await prisma.competitors.findUnique({
      where: { id: body.id }
    });
    
    if (existingCompetitor) {
      return NextResponse.json(
        { error: 'A channel with this ID already exists' },
        { status: 409 }
      );
    }
    
    // Create new competitor
    const competitor = await prisma.competitors.create({
      data: {
        id: body.id,
        url: body.url,
        title: body.title || null
      }
    });
    
    // Invalidate cache
    const cacheKey = 'competitors:all';
    await setCachedData(cacheKey, null, 0);
    
    return NextResponse.json(competitor, { status: 201 });
  } catch (error) {
    console.error('Error creating competitor:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create competitor',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 