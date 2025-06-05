import { getStoredTokens } from "@/lib/youtube-oauth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if we have tokens stored
    const tokens = await getStoredTokens();
    
    // Check if tokens exist
    if (!tokens) {
      return NextResponse.json({
        authenticated: false,
        error: "No authentication tokens found"
      });
    }
    
    // Check if refresh token exists
    if (!tokens.refresh_token) {
      return NextResponse.json({
        authenticated: false,
        error: "No refresh token is set. Please re-authenticate."
      });
    }
    
    // Check if token is expired
    if (tokens.expiry_date && Date.now() > tokens.expiry_date) {
      return NextResponse.json({
        authenticated: false,
        error: "Authentication has expired. Please re-authenticate.",
        expiryDate: new Date(tokens.expiry_date)
      });
    }

    return NextResponse.json({
      authenticated: true,
      expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
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
