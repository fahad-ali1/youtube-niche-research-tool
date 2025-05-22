import { PrismaClient } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Get all videos in the database
    const videos = await prisma.video_statistics.findMany({
      select: {
        id: true,
        duration: true,
        isShort: true,
      },
    });

    if (videos.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No videos found to update",
        videosUpdated: 0,
      });
    }

    console.log(`Found ${videos.length} videos to update isShort flag`);

    let updatedCount = 0;
    let unchangedCount = 0;

    // Update each video's isShort flag based on duration
    for (const video of videos) {
      // If duration is null or undefined, skip this video
      if (video.duration === null || video.duration === undefined) {
        console.log(`Skipping video ${video.id} - no duration`);
        continue;
      }

      // Calculate whether this should be a short (less than 180 seconds)
      const shouldBeShort = video.duration < 180;

      // If the current value is already correct, skip the update
      if (video.isShort === shouldBeShort) {
        unchangedCount++;
        continue;
      }

      // Update the video in the database
      await prisma.video_statistics.update({
        where: { id: video.id },
        data: {
          isShort: shouldBeShort,
        },
      });

      updatedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Updated isShort flag for ${updatedCount} videos (${unchangedCount} already correct)`,
      videosUpdated: updatedCount,
      unchangedVideos: unchangedCount,
    });
  } catch (error: any) {
    console.error("Error updating isShort flags:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update isShort flags",
      },
      { status: 500 }
    );
  }
}
