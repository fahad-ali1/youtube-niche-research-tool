import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// YouTube API key will be provided via environment variable or request
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const MAX_RESULTS = 50; // Number of videos to fetch per channel

async function fetchChannelVideos(channelId: string) {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet&order=date&type=video&maxResults=${MAX_RESULTS}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  
  // Get video IDs for stats lookup
  const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
  
  // Get detailed stats for all videos
  const statsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=statistics,snippet`;
  const statsResponse = await fetch(statsUrl);
  if (!statsResponse.ok) {
    throw new Error(`YouTube API error: ${statsResponse.status} ${statsResponse.statusText}`);
  }
  const statsData = await statsResponse.json();
  
  return statsData.items.map((video: any) => ({
    id: video.id,
    title: video.snippet.title,
    thumbnail: video.snippet.thumbnails.default.url,
    publish_time: new Date(video.snippet.publishedAt),
    view_count: parseInt(video.statistics.viewCount, 10),
    like_count: parseInt(video.statistics.likeCount || '0', 10),
    comment_count: parseInt(video.statistics.commentCount || '0', 10),
    channel_id: video.snippet.channelId
  }));
}

export async function POST() {
  try {
    // Get all competitors
    const competitors = await prisma.competitors.findMany();
    if (competitors.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No competitors found. Add some channels first."
      });
    }

    let totalVideos = 0;
    const errors: string[] = [];

    // Fetch videos for each competitor
    for (const competitor of competitors) {
      try {
        const videos = await fetchChannelVideos(competitor.id);
        
        // Store videos in database
        for (const video of videos) {
          await prisma.video_statistics.upsert({
            where: { id: video.id },
            update: video,
            create: video
          });
        }
        
        totalVideos += videos.length;
      } catch (error) {
        console.error(`Error fetching videos for ${competitor.id}:`, error);
        errors.push(`Failed to fetch videos for ${competitor.title || competitor.id}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    const data = {
      success: true,
      message: `Successfully fetched ${totalVideos} videos from ${competitors.length} channels`,
      errors: errors.length > 0 ? errors : undefined
    };
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying fetch-videos webhook request:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to call webhook',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 