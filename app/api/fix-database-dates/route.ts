import { PrismaClient } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { yearAdjustment } = await request.json();

    if (!yearAdjustment || typeof yearAdjustment !== "number") {
      return NextResponse.json(
        { error: "Please provide a valid yearAdjustment value" },
        { status: 400 }
      );
    }

    // Get all videos with future dates
    const videosWithFutureDates = await prisma.video_statistics.findMany({
      where: {
        publish_time: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        publish_time: true,
      },
    });

    console.log(
      `Found ${videosWithFutureDates.length} videos with future dates`
    );

    // Update each video with an adjusted date
    let updatedCount = 0;
    for (const video of videosWithFutureDates) {
      const oldDate = new Date(video.publish_time);
      const newDate = new Date(video.publish_time);

      // Adjust the year by the specified amount
      newDate.setFullYear(oldDate.getFullYear() + yearAdjustment);

      // Only update if this fixed the date (made it in the past)
      if (newDate <= new Date()) {
        await prisma.video_statistics.update({
          where: { id: video.id },
          data: { publish_time: newDate },
        });
        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fixed dates for ${updatedCount} of ${videosWithFutureDates.length} videos`,
      videosWithFutureDates: videosWithFutureDates.length,
      videosUpdated: updatedCount,
    });
  } catch (error) {
    console.error("Error fixing database dates:", error);
    return NextResponse.json(
      { error: "Failed to fix database dates" },
      { status: 500 }
    );
  }
}
