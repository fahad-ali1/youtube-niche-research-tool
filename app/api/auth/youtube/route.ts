import { getAuthUrl } from "@/lib/youtube-oauth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authUrl = getAuthUrl();

    return NextResponse.json({
      success: true,
      authUrl,
    });
  } catch (error) {
    console.error("Error generating auth URL:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate auth URL",
      },
      { status: 500 }
    );
  }
}
