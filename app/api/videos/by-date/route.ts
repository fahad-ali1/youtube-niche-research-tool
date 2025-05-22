import { prisma } from "@/lib/db";
import { endOfDay, parseISO, startOfDay } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const dateStr = searchParams.get("date");
    const excludeShorts = searchParams.get("excludeShorts") === "true";

    if (!dateStr) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    // Parse the date
    const date = parseISO(dateStr);

    // Build query filters
    const whereClause: any = {
      publish_time: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
    };

    // Add shorts filter if needed
    if (excludeShorts) {
      whereClause.isShort = false;
    }

    // Fetch videos for the specific date
    const videos = await prisma.video_statistics.findMany({
      where: whereClause,
      orderBy: [
        { isShort: "asc" }, // Non-shorts first
        { view_count: "desc" }, // Then by views (highest first)
      ],
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos by date:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos for the specified date" },
      { status: 500 }
    );
  }
}
