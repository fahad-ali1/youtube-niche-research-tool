import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse request body to get the time period
    const body = await request.json().catch(() => ({}));
    const timePeriod = body.timePeriod || 3; // Default to 3 months

    // First, update existing videos
    const updateResponse = await fetch(new URL("/api/youtube/update-videos", request.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ timePeriod }),
    });

    const updateData = await updateResponse.json();
    
    if (!updateData.success) {
      return NextResponse.json({
        success: false,
        error: updateData.error || "Failed to update existing videos",
        quotaExceeded: updateData.quotaExceeded,
        keyUsed: updateData.keyUsed,
      });
    }

    // Then, fetch new videos
    const fetchResponse = await fetch(new URL("/api/youtube/fetch-new-videos", request.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ timePeriod }),
    });

    const fetchData = await fetchResponse.json();

    // Return combined results
    return NextResponse.json({
      success: true,
      message: `Updated ${updateData.videosUpdated} videos and added ${fetchData.videosAdded || 0} new videos`,
      videosUpdated: updateData.videosUpdated,
      videosAdded: fetchData.videosAdded || 0,
      keyUsed: fetchData.keyUsed || updateData.keyUsed,
      timePeriod,
    });
  } catch (error: any) {
    console.error("Error in update-all route:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update videos",
      },
      { status: 500 }
    );
  }
}
