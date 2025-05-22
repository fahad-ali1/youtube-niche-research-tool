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
  afterDate: Date,
  forceRefresh: boolean = false
): Promise<YouTubeApiResponse & { videos?: any[] }> => {
  // Search for videos from this channel published after the specified date
  const searchEndpoint = "https://www.googleapis.com/youtube/v3/search";

  let allVideos: any[] = [];
  let nextPageToken: string | undefined = undefined;
  let attempts = 0;
  const maxAttempts = 5; // Limit how many pages we'll request to avoid infinite loops

  console.log(
    `Fetching videos for channel ${channelId} published after ${afterDate.toISOString()}`
  );

  do {
    attempts++;
    const searchParams: Record<string, string> = {
      part: "snippet",
      channelId,
      maxResults: "50", // Maximum allowed by YouTube API
      order: "date",
      type: "video",
      publishedAfter: afterDate.toISOString(),
    };

    // Add page token if we have one from a previous request
    if (nextPageToken) {
      searchParams.pageToken = nextPageToken;
    }

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
      // No more videos found
      break;
    }

    // Get the next page token if any
    nextPageToken = searchResponse.data.nextPageToken;

    // Extract video IDs and collect them
    const videoIds = searchResponse.data.items
      .filter((item: any) => item && item.id && item.id.videoId)
      .map((item: any) => item.id.videoId);

    if (videoIds.length === 0) {
      break;
    }

    console.log(
      `Found ${videoIds.length} videos on page ${attempts} for channel ${channelId}`
    );

    // Create a map to store the original channel IDs for each video
    // This is crucial to ensure we only include videos from the requested channel
    const videoChannelMap: Record<string, string> = {};
    searchResponse.data.items.forEach((item: any) => {
      if (
        item &&
        item.id &&
        item.id.videoId &&
        item.snippet &&
        item.snippet.channelId
      ) {
        videoChannelMap[item.id.videoId] = item.snippet.channelId;
      }
    });

    // Fetch detailed info for these videos
    const videosEndpoint = "https://www.googleapis.com/youtube/v3/videos";
    const videosParams = {
      part: "snippet,contentDetails,statistics",
      id: videoIds.join(","),
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
    if (
      !videosResponse.data.items ||
      !Array.isArray(videosResponse.data.items)
    ) {
      break;
    }

    // Process all videos and add isShort flag based on duration
    // IMPORTANT: Filter to only include videos that actually belong to the requested channel
    const processedVideos = videosResponse.data.items
      .filter((video: any) => {
        // Verify this video belongs to the requested channel using our map
        const videoId = video.id;
        return videoChannelMap[videoId] === channelId;
      })
      .map((video: any) => {
        try {
          if (video && video.contentDetails && video.contentDetails.duration) {
            const duration = parseDuration(video.contentDetails.duration);
            // Mark videos under 180 seconds as shorts
            video.isShort = duration < 180;
          } else {
            video.isShort = false;
          }
          return video;
        } catch (error) {
          console.error(`Error processing video:`, error);
          video.isShort = false;
          return video;
        }
      });

    // Log any discarded videos (videos that don't belong to the channel)
    const originalCount = videosResponse.data.items.length;
    const filteredCount = processedVideos.length;
    if (originalCount > filteredCount) {
      console.log(
        `Filtered out ${
          originalCount - filteredCount
        } videos that didn't match channel ${channelId}`
      );
    }

    // Add videos to our collection
    allVideos = [...allVideos, ...processedVideos];

    // Continue fetching next pages if we have a token and haven't hit our attempt limit
    // For manual refreshes, we'll try to get more pages
  } while (nextPageToken && attempts < maxAttempts);

  console.log(
    `Total videos fetched for channel ${channelId}: ${allVideos.length}`
  );

  return {
    success: true,
    videos: allVideos,
    keyUsed: "multiple", // We might have used multiple keys across pages
  };
};

// Parse ISO 8601 duration format to seconds
export function parseDuration(duration: string): number {
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

        const duration = video.contentDetails?.duration
          ? parseDuration(video.contentDetails.duration)
          : 0;

        await prisma.video_statistics.update({
          where: { id: video.id },
          data: {
            view_count: parseInt(video.statistics.viewCount) || 0,
            like_count: parseInt(video.statistics.likeCount) || 0,
            comment_count: parseInt(video.statistics.commentCount) || 0,
            title: video.snippet?.title,
            duration: duration,
            isShort: duration < 180, // Mark videos under 180 seconds as shorts
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

// Function to fetch older videos directly from channel uploads playlist
// This bypasses the search API's time limitations (which only go back ~3 months)
export const fetchChannelVideosFromPlaylist = async (
  channelId: string,
  afterDate: Date,
  maxResults: number = 50
): Promise<YouTubeApiResponse & { videos?: any[] }> => {
  try {
    console.log(`Fetching channel upload playlist for ${channelId}`);

    // Step 1: Get the channel's uploads playlist ID
    const channelsEndpoint = "https://www.googleapis.com/youtube/v3/channels";
    const channelsParams = {
      part: "contentDetails",
      id: channelId,
    };

    const channelResponse = await makeYoutubeApiRequest(
      channelsEndpoint,
      channelsParams
    );

    if (!channelResponse.success || !channelResponse.data?.items?.length) {
      return {
        success: false,
        error: "Could not find channel or uploads playlist",
        keyUsed: channelResponse.keyUsed,
      };
    }

    // Get the uploads playlist ID
    const uploadsPlaylistId =
      channelResponse.data.items[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) {
      return {
        success: false,
        error: "Could not find uploads playlist for channel",
        keyUsed: channelResponse.keyUsed,
      };
    }

    console.log(
      `Found uploads playlist ${uploadsPlaylistId} for channel ${channelId}`
    );

    // Step 2: Get videos from the uploads playlist with pagination
    const playlistItemsEndpoint =
      "https://www.googleapis.com/youtube/v3/playlistItems";

    let allPlaylistItems: any[] = [];
    let nextPageToken: string | null = null;
    let pageCount = 0;
    const maxPages = 5; // Maximum number of pages to fetch (up to 250 videos)
    const afterTimestamp = afterDate.getTime();

    // Fetch playlist items with pagination
    do {
      pageCount++;
      const playlistItemsParams: Record<string, string> = {
        part: "snippet,contentDetails",
        playlistId: uploadsPlaylistId,
        maxResults: "50", // Get 50 per page (maximum allowed)
      };

      if (nextPageToken) {
        playlistItemsParams.pageToken = nextPageToken;
      }

      const playlistResponse = await makeYoutubeApiRequest(
        playlistItemsEndpoint,
        playlistItemsParams
      );

      if (!playlistResponse.success || !playlistResponse.data?.items?.length) {
        break; // No more items or error
      }

      // Save the next page token for the next iteration
      nextPageToken = playlistResponse.data.nextPageToken || null;

      // Process current page of items
      const items = playlistResponse.data.items;
      allPlaylistItems = [...allPlaylistItems, ...items];

      // Check if we should stop based on dates
      // If the last item in this batch is older than our cutoff date, we can stop paginating
      try {
        const oldestItemInBatch = items[items.length - 1];
        const oldestPublishDate = new Date(
          oldestItemInBatch.snippet.publishedAt
        ).getTime();

        // If we've reached items older than our cutoff date, we can stop
        if (oldestPublishDate < afterTimestamp) {
          console.log(
            `Reached videos older than ${afterDate.toISOString()}, stopping pagination`
          );
          break;
        }
      } catch (error) {
        console.warn("Error checking dates for pagination control:", error);
      }

      // Stop if we've fetched the maximum number of pages
      if (pageCount >= maxPages) {
        console.log(
          `Reached maximum page count (${maxPages}), stopping pagination`
        );
        break;
      }
    } while (nextPageToken);

    console.log(
      `Fetched ${allPlaylistItems.length} playlist items across ${pageCount} pages`
    );

    // Extract and filter video IDs by date
    const videoIds: string[] = [];
    // Also create a map to verify channel ownership
    const videoChannelMap: Record<string, string> = {};

    for (const item of allPlaylistItems) {
      try {
        const publishedAt = new Date(item.snippet.publishedAt).getTime();
        if (publishedAt >= afterTimestamp) {
          videoIds.push(item.contentDetails.videoId);
          // Store the channel ID for verification later
          if (item.snippet.channelId) {
            videoChannelMap[item.contentDetails.videoId] =
              item.snippet.channelId;
          }
        }
      } catch (error) {
        console.warn(`Error processing playlist item: ${error}`);
      }
    }

    if (videoIds.length === 0) {
      return {
        success: true,
        videos: [],
        keyUsed: "multiple", // We might have used multiple keys
      };
    }

    console.log(
      `Found ${
        videoIds.length
      } videos in uploads playlist after ${afterDate.toISOString()}`
    );

    // Step 3: Fetch full video details for all video IDs
    const videosEndpoint = "https://www.googleapis.com/youtube/v3/videos";
    const chunks: string[][] = [];

    // Split video IDs into chunks of 50 (YouTube API limit)
    for (let i = 0; i < videoIds.length; i += 50) {
      chunks.push(videoIds.slice(i, i + 50));
    }

    let allVideos: any[] = [];

    // Fetch video details for each chunk
    for (const chunk of chunks) {
      const videosParams = {
        part: "snippet,contentDetails,statistics",
        id: chunk.join(","),
      };

      const videosResponse = await makeYoutubeApiRequest(
        videosEndpoint,
        videosParams
      );

      if (!videosResponse.success || !videosResponse.data?.items) {
        console.warn("Failed to get video details for some videos");
        continue;
      }

      // Process videos and add isShort flag, but filter out any videos that don't belong to this channel
      const processedVideos = videosResponse.data.items
        .filter((video: any) => {
          // Verify this video belongs to the requested channel
          // First check our map, then fall back to the video's own snippet
          const videoId = video.id;
          return (
            (videoChannelMap[videoId] &&
              videoChannelMap[videoId] === channelId) ||
            (video.snippet && video.snippet.channelId === channelId)
          );
        })
        .map((video: any) => {
          try {
            if (
              video &&
              video.contentDetails &&
              video.contentDetails.duration
            ) {
              const duration = parseDuration(video.contentDetails.duration);
              video.isShort = duration < 180; // Mark videos under 180 seconds as shorts
            } else {
              video.isShort = false;
            }
            return video;
          } catch (error) {
            console.error(`Error processing video:`, error);
            video.isShort = false;
            return video;
          }
        });

      // Log any discarded videos
      const originalCount = videosResponse.data.items.length;
      const filteredCount = processedVideos.length;
      if (originalCount > filteredCount) {
        console.log(
          `Filtered out ${
            originalCount - filteredCount
          } videos that didn't match channel ${channelId} from playlist`
        );
      }

      allVideos = [...allVideos, ...processedVideos];
    }

    // Sort videos by publish date (newest first)
    allVideos.sort((a, b) => {
      const dateA = new Date(a.snippet.publishedAt).getTime();
      const dateB = new Date(b.snippet.publishedAt).getTime();
      return dateB - dateA;
    });

    return {
      success: true,
      videos: allVideos,
      keyUsed: "multiple", // We've likely used multiple keys
    };
  } catch (error) {
    console.error("Error fetching channel videos from playlist:", error);
    return {
      success: false,
      error: "Failed to fetch videos from channel uploads playlist",
      exception: error,
    };
  }
};
