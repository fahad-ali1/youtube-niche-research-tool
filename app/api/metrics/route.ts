import { prisma } from "@/lib/db";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get("timeRange");
    const excludeShorts = searchParams.get("excludeShorts") === "true";

    // Define date range
    const endDate = new Date();
    let startDate: Date;
    let days: number;

    // Handle "all time" request or specific days
    if (timeRange === "all") {
      // For "all time", we'll set a very early start date (null will be set in the query)
      startDate = new Date(0); // January 1, 1970
      days = 0; // We won't pre-populate days for "all time" view
    } else {
      // Default to 30 days if no valid parameter
      days = parseInt(searchParams.get("days") || "30");
      startDate = subDays(endDate, days);
    }

    // Build the where clause for the query
    const whereClause: any = {};

    // Add date range filter if not "all"
    if (timeRange !== "all") {
      whereClause.publish_time = {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate),
      };
    }

    // Always require duration
    whereClause.duration = {
      not: null,
    };

    // Add shorts filter if needed
    if (excludeShorts) {
      whereClause.isShort = false;
    }

    // Get videos with duration within the date range
    const videos = await prisma.video_statistics.findMany({
      where: whereClause,
      select: {
        publish_time: true,
        duration: true,
        isShort: true,
      },
      orderBy: {
        publish_time: "asc",
      },
    });

    // Group videos by day and calculate metrics
    const metricsMap = new Map();

    if (timeRange !== "all") {
      // Initialize all days in the range with zero values (only for specific time ranges)
      for (let i = 0; i <= days; i++) {
        const date = subDays(endDate, i);
        const dateStr = format(date, "yyyy-MM-dd");
        metricsMap.set(dateStr, {
          date: dateStr,
          contentMinutes: 0,
          videoCount: 0,
        });
      }
    }

    // Populate with actual data
    videos.forEach((video) => {
      const dateStr = format(video.publish_time, "yyyy-MM-dd");
      const existingData = metricsMap.get(dateStr) || {
        date: dateStr,
        contentMinutes: 0,
        videoCount: 0,
      };

      // Convert duration from seconds to minutes
      const durationMinutes = (video.duration || 0) / 60;

      existingData.contentMinutes += durationMinutes;
      existingData.videoCount += 1;

      metricsMap.set(dateStr, existingData);
    });

    // Convert map to array and sort by date
    const metricsData = Array.from(metricsMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    return NextResponse.json(metricsData);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics data" },
      { status: 500 }
    );
  }
}
