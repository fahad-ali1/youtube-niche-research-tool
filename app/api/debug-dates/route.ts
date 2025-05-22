import { PrismaClient } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get server time
    const serverTime = new Date();

    // Get some recent videos to check their dates
    const recentVideos = await prisma.video_statistics.findMany({
      take: 10,
      orderBy: {
        publish_time: "desc",
      },
      select: {
        id: true,
        publish_time: true,
        channel_id: true,
        title: true,
      },
    });

    // Check for channels without videos
    const competitors = await prisma.competitors.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    // Get counts of videos per channel
    const videoCountsPromises = competitors.map(async (competitor) => {
      const count = await prisma.video_statistics.count({
        where: {
          channel_id: competitor.id,
        },
      });
      return {
        channelId: competitor.id,
        channelTitle: competitor.title,
        videoCount: count,
      };
    });

    const videoCounts = await Promise.all(videoCountsPromises);

    // Find channels with no videos
    const channelsWithNoVideos = videoCounts.filter((c) => c.videoCount === 0);

    return NextResponse.json({
      serverTime: {
        raw: serverTime,
        iso: serverTime.toISOString(),
        utc: serverTime.toUTCString(),
        local: serverTime.toString(),
      },
      recentVideos,
      totalChannels: competitors.length,
      channelsWithNoVideos,
      systemInfo: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        nodeEnv: process.env.NODE_ENV,
        offset: serverTime.getTimezoneOffset(),
      },
    });
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    return NextResponse.json(
      { error: "Failed to get debug info" },
      { status: 500 }
    );
  }
}
