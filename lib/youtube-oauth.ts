import { PrismaClient } from "@/lib/generated/prisma";
import { google } from "googleapis";

const prisma = new PrismaClient();

// Response type for YouTube API requests - matches the one in youtube-api.ts
interface YouTubeApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  keyUsed?: string;
  rawError?: any;
  exception?: any;
  quotaExceeded?: boolean;
  invalidKey?: boolean;
  videos?: any[];
}

// Create OAuth2 client
const createOAuth2Client = () => {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const redirectUri =
    process.env.YOUTUBE_REDIRECT_URI ||
    "http://localhost:3000/api/auth/callback/youtube";

  if (!clientId || !clientSecret) {
    throw new Error(
      "YouTube OAuth credentials not configured. Set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET in .env"
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
};

// Get authorization URL
export const getAuthUrl = () => {
  const oauth2Client = createOAuth2Client();

  const scopes = [
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtube.force-ssl",
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
  });

  return authUrl;
};

// Exchange auth code for tokens
export const getTokensFromCode = async (code: string) => {
  const oauth2Client = createOAuth2Client();

  try {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  } catch (error) {
    console.error("Error getting tokens:", error);
    throw new Error("Failed to exchange authorization code for tokens");
  }
};

// Save tokens to database or server storage
export const saveTokens = async (tokens: any) => {
  try {
    // Store in database (create a tokens table)
    await prisma.auth_tokens.upsert({
      where: { provider: "youtube" },
      update: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || "",
        expiry_date: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
      create: {
        provider: "youtube",
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || "",
        expiry_date: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
    });

    return true;
  } catch (error) {
    console.error("Error saving tokens:", error);
    throw new Error("Failed to save authentication tokens");
  }
};

// Get tokens from database
export const getStoredTokens = async () => {
  try {
    const tokenData = await prisma.auth_tokens.findUnique({
      where: { provider: "youtube" },
    });

    if (!tokenData) {
      return null;
    }

    return {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expiry_date: tokenData.expiry_date?.getTime(),
    };
  } catch (error) {
    console.error("Error retrieving tokens:", error);
    return null;
  }
};

// Create authenticated YouTube client
export const getYouTubeClient = async () => {
  const oauth2Client = createOAuth2Client();
  const tokens = await getStoredTokens();

  if (!tokens) {
    throw new Error(
      "No authentication tokens found. Please authenticate first."
    );
  }

  oauth2Client.setCredentials(tokens);

  // Handle token refresh if needed
  if (tokens.expiry_date && Date.now() > tokens.expiry_date) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      await saveTokens(credentials);
      oauth2Client.setCredentials(credentials);
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw new Error("Authentication expired. Please re-authenticate.");
    }
  }

  return google.youtube({
    version: "v3",
    auth: oauth2Client,
  });
};

// Fetch videos using OAuth2
export const fetchVideosWithOAuth = async (
  channelId: string,
  publishedAfter: Date
): Promise<YouTubeApiResponse> => {
  try {
    const youtube = await getYouTubeClient();

    // Search for videos
    const searchResponse = await youtube.search.list({
      part: ["snippet"],
      channelId,
      maxResults: 50,
      order: "date",
      type: ["video"],
      publishedAfter: publishedAfter.toISOString(),
    });

    if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
      return {
        success: true,
        videos: [],
        keyUsed: "oauth", // Indicate this was an OAuth request, not API key
      };
    }

    // Get video IDs
    const videoIds = searchResponse.data.items
      .filter((item) => item.id?.videoId)
      .map((item) => item.id!.videoId!);

    if (videoIds.length === 0) {
      return {
        success: true,
        videos: [],
        keyUsed: "oauth",
      };
    }

    // Get video details
    const videosResponse = await youtube.videos.list({
      part: ["snippet", "contentDetails", "statistics"],
      id: videoIds,
    });

    if (!videosResponse.data.items || videosResponse.data.items.length === 0) {
      return {
        success: true,
        videos: [],
        keyUsed: "oauth",
      };
    }

    // Filter out shorts
    const longFormVideos = videosResponse.data.items.filter((video) => {
      try {
        if (!video.contentDetails?.duration) return false;
        const duration = parseDuration(video.contentDetails.duration);
        return duration >= 60; // 60 seconds or longer
      } catch (error) {
        return false;
      }
    });

    return {
      success: true,
      videos: longFormVideos,
      keyUsed: "oauth",
    };
  } catch (error: any) {
    console.error("Error fetching videos with OAuth:", error);

    // Check if this is a quota exceeded error
    const isQuotaExceeded =
      error.message?.includes("quota") ||
      error.message?.includes("limit exceeded") ||
      error.errors?.some(
        (e: any) =>
          e.reason === "quotaExceeded" || e.reason === "dailyLimitExceeded"
      );

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch videos",
      quotaExceeded: isQuotaExceeded,
      keyUsed: "oauth",
      rawError: error,
    };
  }
};

// Parse ISO 8601 duration format to seconds
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");

  return hours * 3600 + minutes * 60 + seconds;
}
