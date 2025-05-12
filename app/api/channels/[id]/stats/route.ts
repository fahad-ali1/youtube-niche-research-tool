import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCachedData, setCachedData } from "@/lib/redis";
import { subMonths } from "date-fns";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object before using its properties
    const { id: channelId } = await params;

    // Create cache key
    const cacheKey = `channel:${channelId}:stats`;

    // Try to get data from cache first
    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // Check if channel exists
    const channel = await prisma.competitors.findUnique({
      where: { id: channelId },
    });

    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    // Get recent videos (last 3 months)
    const threeMonthsAgo = subMonths(new Date(), 3);

    const videos = await prisma.video_statistics.findMany({
      where: {
        channel_id: channelId,
        publish_time: {
          gte: threeMonthsAgo,
        },
      },
      orderBy: {
        publish_time: "desc",
      },
    });

    // Calculate statistics - exclude videos with 0 views
    const videosWithViews = videos.filter((video) => video.view_count > 0);
    const totalViews = videosWithViews.reduce(
      (sum, video) => sum + video.view_count,
      0
    );
    const avgViews =
      videosWithViews.length > 0 ? totalViews / videosWithViews.length : 0;

    const response = {
      channelId,
      channelTitle: channel.title,
      videos,
      stats: {
        videoCount: videos.length,
        videosWithViewsCount: videosWithViews.length,
        totalViews,
        avgViews,
      },
    };

    // Cache the results for 1 hour (3600 seconds)
    await setCachedData(cacheKey, response, 3600);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching channel statistics:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch channel statistics",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
