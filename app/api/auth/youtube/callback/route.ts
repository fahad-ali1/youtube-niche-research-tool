import { getTokensFromCode, saveTokens } from "@/lib/youtube-oauth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(
        new URL("/control?error=no_code", request.url)
      );
    }

    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);

    // Save tokens
    await saveTokens(tokens);

    // Redirect back to control panel with success message
    return NextResponse.redirect(new URL("/control?auth=success", request.url));
  } catch (error) {
    console.error("Error in OAuth callback:", error);
    return NextResponse.redirect(
      new URL(
        `/control?error=${encodeURIComponent(
          error instanceof Error ? error.message : "Unknown error"
        )}`,
        request.url
      )
    );
  }
}
