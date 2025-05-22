import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { subDays, startOfDay, endOfDay, format } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    // Get the number of days from query parameters (default to 30 days)
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "30");
    
    // Calculate the start date based on the days parameter
    const endDate = new Date();
    const startDate = subDays(endDate, days);
    
    // Get videos with duration within the date range
    const videos = await prisma.video_statistics.findMany({
      where: {
        publish_time: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
        duration: {
          not: null,
        },
      },
      select: {
        publish_time: true,
        duration: true,
      },
      orderBy: {
        publish_time: "asc",
      },
    });
    
    // Group videos by day and calculate metrics
    const metricsMap = new Map();
    
    // Initialize all days in the range with zero values
    for (let i = 0; i <= days; i++) {
      const date = subDays(endDate, i);
      const dateStr = format(date, "yyyy-MM-dd");
      metricsMap.set(dateStr, {
        date: dateStr,
        contentMinutes: 0,
        videoCount: 0,
      });
    }
    
    // Populate with actual data
    videos.forEach(video => {
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
    const metricsData = Array.from(metricsMap.values())
      .sort((a, b) => a.date.localeCompare(b.date));
    
    return NextResponse.json(metricsData);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics data" },
      { status: 500 }
    );
  }
} 