import { getStoredTokens } from "@/lib/youtube-oauth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if we have tokens stored
    const tokens = await getStoredTokens();

    return NextResponse.json({
      authenticated: !!tokens,
      expiryDate: tokens?.expiry_date ? new Date(tokens.expiry_date) : null,
    });
  } catch (error) {
    console.error("Error checking auth status:", error);
    return NextResponse.json(
      {
        authenticated: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to check auth status",
      },
      { status: 500 }
    );
  }
}
