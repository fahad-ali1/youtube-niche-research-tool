import { PrismaClient } from "@/lib/generated/prisma";
import {
  fetchChannelVideosFromPlaylist,
  fetchCompetitorVideos,
} from "@/lib/youtube-api";
import { fetchVideosWithOAuth, getStoredTokens } from "@/lib/youtube-oauth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Define a common interface for YouTube API responses
interface YouTubeApiResponse {
  success: boolean;
  videos?: any[];
  error?: string;
  keyUsed?: string;
  invalidKey?: boolean;
  quotaExceeded?: boolean;
}

export async function POST(request: Request) {
  try {
    // Parse request body to get the time period
    let requestBody = { timePeriod: 3 }; // Default to 3 months
    try {
      const body = await request.json();
      if (body && typeof body.timePeriod === "number") {
        requestBody.timePeriod = body.timePeriod;
      }
    } catch (e) {
      // If parsing fails, use default values
      console.log("Could not parse request body, using default time period");
    }

    console.log(`Using time period: ${requestBody.timePeriod} months`);

    // Flag to indicate this is a manual fetch (from control panel) vs. automated
    const isManualFetch = true;

    // Fetch all competitors from the database
    const competitors = await prisma.competitors.findMany();

    if (competitors.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No competitors found in the database",
      });
    }

    // Check if we have OAuth tokens available
    const oauthTokens = await getStoredTokens();
    const useOAuth = !!oauthTokens;

    if (useOAuth) {
      console.log("Using OAuth authentication for YouTube API requests");
    } else {
      console.log("Using API key authentication for YouTube API requests");
    }

    let totalVideosAdded = 0;
    let lastKeyUsed = "";
    const errors: any[] = [];
    let oauthQuotaExceeded = false;

    // Process each competitor channel
    for (const competitor of competitors) {
      try {
        // Get the latest video publish time for this channel
        const latestVideo = await prisma.video_statistics.findFirst({
          where: { channel_id: competitor.id },
          orderBy: { publish_time: "desc" },
          select: { publish_time: true },
        });

        // Set the date to search from: either after the latest video or based on the requested time period
        let searchAfterDate: Date;

        // Get the current date - force it to be now
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const currentDay = now.getDate();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentSecond = now.getSeconds();

        // Create a properly constructed current date
        const currentDate = new Date(
          currentYear,
          currentMonth,
          currentDay,
          currentHour,
          currentMinute,
          currentSecond
        );

        // Calculate the time period date
        const timePeriodDate = new Date(currentDate);
        timePeriodDate.setMonth(
          timePeriodDate.getMonth() - requestBody.timePeriod
        );

        if (latestVideo?.publish_time) {
          // Use the latest video's publish time, but verify it's not in the future
          const latestVideoDate = new Date(latestVideo.publish_time);

          if (latestVideoDate > currentDate) {
            console.log(
              `WARNING: Latest video date (${latestVideoDate.toISOString()}) is in the future! Using ${
                requestBody.timePeriod
              } months ago instead for channel ${competitor.id}`
            );
            // Use time period ago instead
            searchAfterDate = timePeriodDate;
          } else if (isManualFetch) {
            // For manual fetches, always use the requested time period
            // This ensures we get all videos within the requested time range
            searchAfterDate = timePeriodDate;
            console.log(
              `Manual fetch: Using requested ${
                requestBody.timePeriod
              } month period: ${searchAfterDate.toISOString()} for channel ${
                competitor.id
              }`
            );
          } else {
            // For automated fetches, use the max to avoid duplicate fetching
            // This ensures we don't miss videos but also respect the user's time period selection
            searchAfterDate =
              latestVideoDate > timePeriodDate
                ? latestVideoDate
                : timePeriodDate;
            console.log(
              `Using search date: ${searchAfterDate.toISOString()} for channel ${
                competitor.id
              } (Latest video: ${latestVideoDate.toISOString()}, Time period: ${timePeriodDate.toISOString()})`
            );
          }
        } else {
          // No videos found, search from the specified time period ago
          searchAfterDate = timePeriodDate;
          console.log(
            `No previous videos, using ${
              requestBody.timePeriod
            } months ago: ${searchAfterDate.toISOString()} for channel ${
              competitor.id
            }`
          );
        }

        console.log(
          `Fetching videos for channel ${
            competitor.id
          } after ${searchAfterDate.toISOString()} (Current date: ${currentDate.toISOString()})`
        );

        // Fetch videos for this channel
        let result: YouTubeApiResponse;

        // For manual fetches with a long time period, use the channel uploads playlist to get older videos
        if (isManualFetch && requestBody.timePeriod > 3) {
          console.log(
            `Using channel uploads playlist to get videos older than 3 months for channel ${competitor.id}`
          );

          // Try to fetch up to 100 videos for each channel
          result = await fetchChannelVideosFromPlaylist(
            competitor.id,
            searchAfterDate,
            100
          );
        }
        // Otherwise use regular search methods (which only go back ~3 months)
        else {
          // If OAuth is available and its quota hasn't been exceeded, try OAuth first
          if (useOAuth && !oauthQuotaExceeded) {
            result = await fetchVideosWithOAuth(competitor.id, searchAfterDate);

            // If OAuth quota exceeded, mark it so we don't try again and fall back to API keys
            if (!result.success && result.quotaExceeded) {
              console.log(
                "OAuth quota exceeded, falling back to API key authentication"
              );
              oauthQuotaExceeded = true;
              result = await fetchCompetitorVideos(
                competitor.id,
                searchAfterDate,
                isManualFetch
              );
            }
          } else {
            // Use API key authentication
            result = await fetchCompetitorVideos(
              competitor.id,
              searchAfterDate,
              isManualFetch
            );
          }
        }

        // If result is unsuccessful and it's a manual fetch with a time period > 3 months,
        // try the normal search method as a fallback
        if (!result.success && isManualFetch && requestBody.timePeriod > 3) {
          console.log(
            `Uploads playlist method failed, falling back to search API for channel ${competitor.id}`
          );

          if (useOAuth && !oauthQuotaExceeded) {
            result = await fetchVideosWithOAuth(competitor.id, searchAfterDate);

            if (!result.success && result.quotaExceeded) {
              oauthQuotaExceeded = true;
              result = await fetchCompetitorVideos(
                competitor.id,
                searchAfterDate,
                isManualFetch
              );
            }
          } else {
            result = await fetchCompetitorVideos(
              competitor.id,
              searchAfterDate,
              isManualFetch
            );
          }
        }

        // If API key failed but we have OAuth available and OAuth quota isn't exceeded, try OAuth as fallback
        if (
          !result.success &&
          result.invalidKey &&
          useOAuth &&
          !oauthQuotaExceeded
        ) {
          console.log(
            `API key authentication failed, falling back to OAuth for channel ${competitor.id}`
          );
          result = await fetchVideosWithOAuth(competitor.id, searchAfterDate);

          // If OAuth also fails with quota exceeded, mark it
          if (!result.success && result.quotaExceeded) {
            oauthQuotaExceeded = true;
          }
        }

        if (!result.success) {
          errors.push({
            channelId: competitor.id,
            error: result.error,
            quotaExceeded: result.quotaExceeded,
            invalidKey: result.invalidKey,
          });

          if (result.invalidKey) {
            console.error(
              `Invalid YouTube API key detected for channel ${competitor.id}. Please check your API keys.`
            );
            return NextResponse.json({
              success: false,
              error:
                "Invalid YouTube API key. Please check your API key configuration.",
              invalidKey: true,
              keyUsed: result.keyUsed || "unknown",
              videosAdded: totalVideosAdded,
              errors,
            });
          }

          if (result.quotaExceeded) {
            // If this is an API key quota exceeded, we already tried all available keys
            if (result.keyUsed !== "oauth") {
              console.log(
                `All API keys have exceeded their quota for channel ${competitor.id}, skipping remaining channels`
              );
              return NextResponse.json({
                success: false,
                error: "All YouTube API keys have exceeded their quota",
                quotaExceeded: true,
                keyUsed: result.keyUsed || "unknown",
                videosAdded: totalVideosAdded,
                errors,
              });
            } else if (oauthQuotaExceeded) {
              // We've already tried falling back to API keys above, so if we're still here, they failed too
              console.log(
                `Both OAuth and all API keys have exceeded their quota for channel ${competitor.id}, skipping remaining channels`
              );
              return NextResponse.json({
                success: false,
                error: "Both OAuth and all API keys have exceeded their quota",
                quotaExceeded: true,
                keyUsed: "all",
                videosAdded: totalVideosAdded,
                errors,
              });
            }
          }

          continue;
        }

        lastKeyUsed = result.keyUsed || lastKeyUsed;

        if (!result.videos || result.videos.length === 0) {
          console.log(`No new videos found for channel ${competitor.id}`);
          continue;
        }

        // Save videos to database
        for (const video of result.videos) {
          try {
            // Check if video already exists
            const existingVideo = await prisma.video_statistics.findUnique({
              where: { id: video.id },
            });

            if (existingVideo) {
              if (isManualFetch) {
                // For manual fetches, update existing videos with the latest stats
                console.log(
                  `Updating existing video ${video.id} (manual fetch)`
                );

                let duration = 0;
                if (video.contentDetails?.duration) {
                  duration = parseDuration(video.contentDetails.duration);
                } else if (existingVideo.duration) {
                  duration = existingVideo.duration;
                }

                await prisma.video_statistics.update({
                  where: { id: video.id },
                  data: {
                    view_count: parseInt(
                      video.statistics?.viewCount ||
                        video.statistics.viewCount ||
                        "0"
                    ),
                    like_count: parseInt(
                      video.statistics?.likeCount ||
                        video.statistics.likeCount ||
                        "0"
                    ),
                    comment_count: parseInt(
                      video.statistics?.commentCount ||
                        video.statistics.commentCount ||
                        "0"
                    ),
                    title: video.snippet?.title || video.snippet.title,
                    duration: duration,
                    isShort: duration < 180,
                  },
                });

                totalVideosAdded++; // Count updates as "added" for reporting
              } else {
                console.log(`Video ${video.id} already exists, skipping`);
              }
              continue;
            }

            // Extract data based on whether we're using OAuth or API key (different response structures)
            let videoData;
            if (result.keyUsed === "oauth") {
              // OAuth response structure
              const duration = parseInt(
                parseDuration(
                  video.contentDetails?.duration || "PT0S"
                ).toString()
              );

              videoData = {
                id: video.id,
                channel_id: competitor.id,
                view_count: parseInt(video.statistics?.viewCount || "0"),
                like_count: parseInt(video.statistics?.likeCount || "0"),
                comment_count: parseInt(video.statistics?.commentCount || "0"),
                publish_time: new Date(video.snippet?.publishedAt),
                title: video.snippet?.title,
                thumbnail:
                  video.snippet?.thumbnails?.high?.url ||
                  video.snippet?.thumbnails?.default?.url,
                duration: duration,
                isShort: duration < 180, // Mark videos under 180 seconds as shorts
              };
            } else {
              // API key response structure (original format)
              const duration = parseInt(
                parseDuration(video.contentDetails.duration).toString()
              );

              videoData = {
                id: video.id,
                channel_id: competitor.id,
                view_count: parseInt(video.statistics.viewCount) || 0,
                like_count: parseInt(video.statistics.likeCount) || 0,
                comment_count: parseInt(video.statistics.commentCount) || 0,
                publish_time: new Date(video.snippet.publishedAt),
                title: video.snippet.title,
                thumbnail:
                  video.snippet.thumbnails.high?.url ||
                  video.snippet.thumbnails.default?.url,
                duration: duration,
                isShort: duration < 180, // Mark videos under 180 seconds as shorts
              };
            }

            // Add video to database
            await prisma.video_statistics.create({ data: videoData });

            totalVideosAdded++;
          } catch (videoError) {
            console.error(`Error adding video ${video.id}:`, videoError);
          }
        }

        console.log(
          `Added ${result.videos.length} videos for channel ${competitor.id}`
        );
      } catch (channelError: any) {
        console.error(
          `Error processing channel ${competitor.id}:`,
          channelError
        );
        errors.push({
          channelId: competitor.id,
          error: channelError.message || "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Added ${totalVideosAdded} new videos from ${competitors.length} channels`,
      videosAdded: totalVideosAdded,
      keyUsed: lastKeyUsed,
      authMethod: oauthQuotaExceeded
        ? "api_key"
        : useOAuth
        ? "oauth"
        : "api_key",
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("Error fetching new videos:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch new videos",
      },
      { status: 500 }
    );
  }
}

// Parse ISO 8601 duration format to seconds
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");

  return hours * 3600 + minutes * 60 + seconds;
}
