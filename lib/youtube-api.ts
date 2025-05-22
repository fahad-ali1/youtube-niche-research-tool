import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// Interface for YouTube API key status
interface ApiKeyStatus {
  key: string;
  quotaExceeded: boolean;
  lastUsed: Date;
  disabled: boolean; // New field to track completely disabled keys
}

// Response type for YouTube API requests
interface YouTubeApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  keyUsed?: string;
  rawError?: any;
  exception?: any;
  quotaExceeded?: boolean;
  invalidKey?: boolean;
}

// Keep track of API key status in memory
let apiKeys: ApiKeyStatus[] = [];
let initialized = false;

// Initialize API keys from environment variables
const initializeApiKeys = () => {
  if (initialized) return;

  const key1 = process.env.YOUTUBE_API_KEY_1;
  const key2 = process.env.YOUTUBE_API_KEY_2;
  const key3 = process.env.YOUTUBE_API_KEY_3;

  apiKeys = [
    ...(key1
      ? [
          {
            key: key1,
            quotaExceeded: false,
            lastUsed: new Date(0),
            disabled: false,
          },
        ]
      : []),
    ...(key2
      ? [
          {
            key: key2,
            quotaExceeded: false,
            lastUsed: new Date(0),
            disabled: false,
          },
        ]
      : []),
    ...(key3
      ? [
          {
            key: key3,
            quotaExceeded: false,
            lastUsed: new Date(0),
            disabled: false,
          },
        ]
      : []),
  ];

  if (apiKeys.length === 0) {
    console.error("No YouTube API keys found in environment variables");
  } else {
    console.log(`Initialized ${apiKeys.length} YouTube API keys`);
  }

  initialized = true;
};

// Get the next available API key
const getNextAvailableKey = (): string | null => {
  initializeApiKeys();

  // Find keys that aren't marked as quota exceeded or disabled
  const availableKeys = apiKeys.filter(
    (key) => !key.quotaExceeded && !key.disabled
  );

  if (availableKeys.length === 0) {
    console.error(
      "All YouTube API keys have exceeded their quota or are disabled"
    );
    return null;
  }

  // Sort by last used (oldest first)
  availableKeys.sort((a, b) => a.lastUsed.getTime() - b.lastUsed.getTime());

  // Update the last used time for this key
  const selectedKey = availableKeys[0];
  const keyIndex = apiKeys.findIndex((k) => k.key === selectedKey.key);
  apiKeys[keyIndex].lastUsed = new Date();

  // Log which key we're using (masked)
  const maskedKey =
    selectedKey.key.substring(0, 5) +
    "..." +
    selectedKey.key.substring(selectedKey.key.length - 4);
  console.log(`Using YouTube API key: ${maskedKey}`);

  return selectedKey.key;
};

// Mark an API key as having exceeded its quota
const markKeyAsExceeded = (key: string) => {
  const keyIndex = apiKeys.findIndex((k) => k.key === key);
  if (keyIndex !== -1) {
    apiKeys[keyIndex].quotaExceeded = true;
    const maskedKey =
      key.substring(0, 5) + "..." + key.substring(key.length - 4);
    console.log(`YouTube API key ${maskedKey} marked as exceeded quota`);

    // Log how many keys are still available
    const availableKeys = apiKeys.filter(
      (k) => !k.quotaExceeded && !k.disabled
    );
    console.log(`${availableKeys.length} API keys still available for use`);
  }
};

// Mark an API key as permanently disabled (e.g., invalid key)
const disableKey = (key: string) => {
  const keyIndex = apiKeys.findIndex((k) => k.key === key);
  if (keyIndex !== -1) {
    apiKeys[keyIndex].disabled = true;
    apiKeys[keyIndex].quotaExceeded = true; // Also mark as quota exceeded to be sure
    const maskedKey =
      key.substring(0, 5) + "..." + key.substring(key.length - 4);
    console.log(
      `YouTube API key ${maskedKey} permanently disabled (invalid key)`
    );

    // Log how many keys are still available
    const availableKeys = apiKeys.filter(
      (k) => !k.quotaExceeded && !k.disabled
    );
    console.log(`${availableKeys.length} API keys still available for use`);
  }
};

// Reset quota exceeded status for all keys (can be called daily)
const resetQuotaStatus = () => {
  apiKeys.forEach((key) => {
    if (!key.disabled) {
      // Don't reset disabled keys
      key.quotaExceeded = false;
    }
  });
  console.log(
    "Reset quota status for all YouTube API keys (except disabled keys)"
  );
};

// Make a YouTube API request with automatic key rotation
export const makeYoutubeApiRequest = async (
  endpoint: string,
  params: Record<string, string>
): Promise<YouTubeApiResponse> => {
  const maxRetries = 3;
  let currentAttempt = 0;

  while (currentAttempt < maxRetries) {
    const apiKey = getNextAvailableKey();
    if (!apiKey) {
      return {
        success: false,
        error: "All YouTube API keys have exceeded their quota or are invalid",
        quotaExceeded: true,
      };
    }

    try {
      // Add the API key to the params
      const urlParams = new URLSearchParams({
        ...params,
        key: apiKey,
      });

      console.log(`Making YouTube API request to ${endpoint}`);

      const response = await fetch(`${endpoint}?${urlParams.toString()}`);
      const data = await response.json();

      // For logging purposes, mask the API key
      const maskedKey = apiKey.substring(0, 6) + "...";

      // Check for API key validation errors
      if (data.error) {
        if (
          data.error.code === 400 &&
          data.error.message?.includes("API key not valid")
        ) {
          console.error(`Invalid YouTube API key: ${maskedKey}`);
          disableKey(apiKey); // Permanently disable this key
          currentAttempt++;
          continue; // Try the next key
        }
      }

      // Check for quota errors
      if (
        response.status === 403 &&
        (data.error?.errors?.some(
          (e: any) =>
            e.reason === "quotaExceeded" || e.reason === "dailyLimitExceeded"
        ) ||
          data.error?.message?.includes("quota") ||
          data.error?.message?.includes("limit exceeded"))
      ) {
        console.log(
          `YouTube API key ${maskedKey} quota exceeded, rotating to next key`
        );
        markKeyAsExceeded(apiKey);
        currentAttempt++;
        continue; // Try the next key
      }

      // Check for any other errors in the response
      if (data.error) {
        return {
          success: false,
          error: data.error.message || "YouTube API returned an error",
          keyUsed: maskedKey,
          rawError: data.error,
        };
      }

      // Return successful response with the key used
      return {
        success: true,
        data,
        keyUsed: maskedKey, // Only return a portion of the key for security
      };
    } catch (error) {
      console.error(
        `Error with YouTube API request (key: ${apiKey.substring(0, 6)}...):`,
        error
      );
      currentAttempt++;

      // If this was the last attempt, return the error
      if (currentAttempt >= maxRetries) {
        return {
          success: false,
          error: "Failed to make YouTube API request after multiple attempts",
          exception: error,
        };
      }
    }
  }

  return {
    success: false,
    error: "Failed to make YouTube API request after exhausting all retries",
  };
};

// Function to fetch competitor channel videos after a specific date
export const fetchCompetitorVideos = async (
  channelId: string,
  afterDate: Date
): Promise<YouTubeApiResponse & { videos?: any[] }> => {
  // Search for videos from this channel published after the specified date
  const searchEndpoint = "https://www.googleapis.com/youtube/v3/search";
  const searchParams = {
    part: "snippet",
    channelId,
    maxResults: "50",
    order: "date",
    type: "video",
    publishedAfter: afterDate.toISOString(),
  };

  const searchResponse = await makeYoutubeApiRequest(
    searchEndpoint,
    searchParams
  );

  if (!searchResponse.success) {
    return {
      success: false,
      error: searchResponse.error || "Failed to search for videos",
      invalidKey: searchResponse.invalidKey,
      quotaExceeded: searchResponse.quotaExceeded,
      keyUsed: searchResponse.keyUsed,
    };
  }

  // Check if the response has items
  if (
    !searchResponse.data.items ||
    !Array.isArray(searchResponse.data.items) ||
    searchResponse.data.items.length === 0
  ) {
    return {
      success: true,
      videos: [],
      keyUsed: searchResponse.keyUsed,
    };
  }

  // Safely extract video IDs
  const videoIds = searchResponse.data.items
    .filter((item: any) => item && item.id && item.id.videoId)
    .map((item: any) => item.id.videoId)
    .join(",");

  if (!videoIds || videoIds.length === 0) {
    return {
      success: true,
      videos: [],
      keyUsed: searchResponse.keyUsed,
    };
  }

  // Fetch detailed info for these videos
  const videosEndpoint = "https://www.googleapis.com/youtube/v3/videos";
  const videosParams = {
    part: "snippet,contentDetails,statistics",
    id: videoIds,
  };

  const videosResponse = await makeYoutubeApiRequest(
    videosEndpoint,
    videosParams
  );

  if (!videosResponse.success) {
    return {
      success: false,
      error: videosResponse.error || "Failed to fetch video details",
      invalidKey: videosResponse.invalidKey,
      quotaExceeded: videosResponse.quotaExceeded,
      keyUsed: videosResponse.keyUsed || searchResponse.keyUsed,
    };
  }

  // Check if the response has items
  if (!videosResponse.data.items || !Array.isArray(videosResponse.data.items)) {
    return {
      success: true,
      videos: [],
      keyUsed: videosResponse.keyUsed,
    };
  }

  // Filter out shorts (duration < 60 seconds)
  const longFormVideos = videosResponse.data.items.filter((video: any) => {
    try {
      if (!video || !video.contentDetails || !video.contentDetails.duration) {
        return false;
      }
      const duration = parseDuration(video.contentDetails.duration);
      return duration >= 60; // 60 seconds or longer
    } catch (error) {
      console.error(`Error parsing duration for video:`, error);
      return false;
    }
  });

  return {
    success: true,
    videos: longFormVideos,
    keyUsed: videosResponse.keyUsed,
  };
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

// Function to update existing video statistics
export const updateVideoStatistics = async (
  videoIds: string[]
): Promise<YouTubeApiResponse & { videosUpdated?: number }> => {
  // Split video IDs into chunks of 50 (YouTube API limit)
  const chunks = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    chunks.push(videoIds.slice(i, i + 50));
  }

  let updatedVideos = 0;
  let lastKeyUsed = "";

  for (const chunk of chunks) {
    const videosEndpoint = "https://www.googleapis.com/youtube/v3/videos";
    const videosParams = {
      part: "snippet,contentDetails,statistics",
      id: chunk.join(","),
    };

    const response = await makeYoutubeApiRequest(videosEndpoint, videosParams);

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || "Failed to fetch video details",
        quotaExceeded: response.quotaExceeded,
        keyUsed: response.keyUsed,
        videosUpdated: updatedVideos,
      };
    }

    lastKeyUsed = response.keyUsed || lastKeyUsed;

    // Check if items exists and is an array
    if (!response.data.items || !Array.isArray(response.data.items)) {
      console.warn(
        "No items array in YouTube API response or items is not an array"
      );
      continue;
    }

    // Update videos in the database
    for (const video of response.data.items) {
      try {
        if (!video || !video.id || !video.statistics) {
          console.warn("Skipping video with missing data:", video);
          continue;
        }

        await prisma.video_statistics.update({
          where: { id: video.id },
          data: {
            view_count: parseInt(video.statistics.viewCount) || 0,
            like_count: parseInt(video.statistics.likeCount) || 0,
            comment_count: parseInt(video.statistics.commentCount) || 0,
            title: video.snippet?.title,
            duration: video.contentDetails?.duration
              ? parseDuration(video.contentDetails.duration)
              : undefined,
          },
        });
        updatedVideos++;
      } catch (error) {
        console.error(
          `Failed to update video ${video?.id || "unknown"}:`,
          error
        );
      }
    }
  }

  return {
    success: true,
    videosUpdated: updatedVideos,
    keyUsed: lastKeyUsed,
  };
};
