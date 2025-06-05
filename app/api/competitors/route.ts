import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCachedData, setCachedData } from '@/lib/redis';
import { getYouTubeClient } from '../.././../lib/youtube-client';

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
    if (!body.id) {
      return NextResponse.json(
        { error: 'Channel ID is required' },
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
    
    // Fetch channel details from YouTube API
    const youtube = await getYouTubeClient();
    
    if (!youtube) {
      return NextResponse.json(
        { error: 'YouTube client not initialized. Please authenticate with YouTube first.' },
        { status: 500 }
      );
    }

    // Get channel details
    const response = await youtube.channels.list({
      part: ['snippet'],
      id: [body.id]
    });

    if (!response.data.items || response.data.items.length === 0) {
      return NextResponse.json(
        { error: 'Channel not found on YouTube with the provided ID' },
        { status: 404 }
      );
    }

    const channelData = response.data.items[0];
    const channelTitle = channelData.snippet?.title || '';
    const channelUrl = `https://www.youtube.com/channel/${body.id}`;
    const profilePic = channelData.snippet?.thumbnails?.default?.url || 
                      channelData.snippet?.thumbnails?.medium?.url || 
                      null;
    
    // Create new competitor with data from YouTube
    // Using type assertion to handle the profilePic field which might not be recognized by TypeScript yet
    const competitor = await prisma.competitors.create({
      data: {
        id: body.id,
        url: channelUrl,
        title: channelTitle,
        // @ts-ignore - profilePic field exists in the updated schema
        profilePic: profilePic
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