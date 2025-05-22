import { PrismaClient } from "@/lib/generated/prisma";
import { updateVideoStatistics } from "@/lib/youtube-api";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Fetch videos published in the last month that need updates
    const videos = await prisma.video_statistics.findMany({
      where: {
        publish_time: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last month
        },
      },
      select: {
        id: true,
      },
    });

    if (videos.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No recent videos found to update",
        videosUpdated: 0,
      });
    }

    // Extract video IDs
    const videoIds = videos.map((video) => video.id);
    console.log(`Found ${videoIds.length} videos to update`);

    // Update videos in batches
    const result = await updateVideoStatistics(videoIds);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error || "Failed to update videos",
        quotaExceeded: result.quotaExceeded,
        keyUsed: result.keyUsed,
        videosUpdated: result.videosUpdated || 0,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${result.videosUpdated} videos`,
      videosUpdated: result.videosUpdated,
      keyUsed: result.keyUsed,
    });
  } catch (error: any) {
    console.error("Error updating videos:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update videos",
      },
      { status: 500 }
    );
  }
}
