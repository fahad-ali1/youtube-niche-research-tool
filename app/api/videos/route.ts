import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCachedData, setCachedData } from '@/lib/redis';
import { subWeeks, subMonths } from 'date-fns';
import { VideoStatistics } from '@/types';

interface ChannelAverage {
  channelId: string;
  avgViews: number;
}

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const channelId = searchParams.get('channelId') || undefined;
    const sortBy = searchParams.get('sortBy') || 'publish_time';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '0', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const timeFrame = searchParams.get('timeFrame') || undefined;
    const outlierMultiplier = parseFloat(searchParams.get('outlierMultiplier') || '2');
    const outliersOnly = searchParams.get('outliersOnly') === 'true';
    
    // Create cache key based on request parameters
    const cacheKey = `videos:${channelId || 'all'}-${sortBy}-${sortOrder}-${page}-${pageSize}-${timeFrame || 'all'}-${outlierMultiplier}-${outliersOnly ? 'outliers' : 'all'}`;
    
    // Try to get data from cache first
    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }
    
    // Filter by date range if timeFrame is provided
    let dateFilter = {};
    if (timeFrame) {
      const now = new Date();
      let startDate;
      
      switch (timeFrame) {
        case '1w':
          startDate = subWeeks(now, 1);
          break;
        case '2w':
          startDate = subWeeks(now, 2);
          break;
        case '1m':
          startDate = subMonths(now, 1);
          break;
        case '2m':
          startDate = subMonths(now, 2);
          break;
        default:
          startDate = subMonths(now, 3); // Default to 3 months
      }
      
      dateFilter = {
        publish_time: {
          gte: startDate
        }
      };
    }

    // Build the query based on parameters
    const where = {
      ...(channelId ? { channel_id: channelId } : {}),
      ...dateFilter
    };

    // Different handling for outliers vs regular videos
    if (outliersOnly) {
      // For outliers, we need to:
      // 1. Get all channel IDs in the system or the single requested channel
      // 2. Calculate the average for each channel
      // 3. Get videos that exceed those averages by the multiplier
      
      // Get channel IDs (either all or the specific one)
      const channelIds = channelId 
        ? [channelId] 
        : (await prisma.video_statistics.findMany({
            distinct: ['channel_id'],
            select: { channel_id: true }
          })).map(item => item.channel_id);
      
      // Get averages for all channels
      const channelAverages = await Promise.all(
        channelIds.map(async (id) => {
          const threeMonthsAgo = subMonths(new Date(), 3);
          
          const channelVideos = await prisma.video_statistics.findMany({
            where: {
              channel_id: id,
              view_count: { gt: 0 },
              publish_time: {
                gte: threeMonthsAgo
              }
            },
            select: {
              view_count: true
            },
            take: 100,
            orderBy: {
              publish_time: 'desc'
            }
          });
          
          const totalViews = channelVideos.reduce((sum: number, video: any) => sum + video.view_count, 0);
          const avgViews = channelVideos.length > 0 ? totalViews / channelVideos.length : 0;
          
          return { 
            channelId: id, 
            avgViews,
            threshold: avgViews * outlierMultiplier
          };
        })
      );
      
      // Find outlier videos for each channel with its specific threshold
      const outliersByChannel = await Promise.all(
        channelAverages
          .filter(channel => channel.avgViews > 0) // Only include channels with videos
          .map(async (channel) => {
            const channelOutliers = await prisma.video_statistics.findMany({
              where: {
                channel_id: channel.channelId,
                view_count: { 
                  gte: Math.floor(channel.avgViews * outlierMultiplier) // Using gte to get all videos >= threshold
                },
                ...dateFilter
              },
              orderBy: {
                [sortBy as string]: sortOrder
              },
            });
            
            return channelOutliers.map(video => ({
              ...video,
              isOutlier: true,
              channelAvgViews: channel.avgViews
            }));
          })
      );
      
      // Flatten and sort all outliers
      const allOutliers = outliersByChannel.flat();
     
      // Sort according to requested sort (since we now have items from different channels)
      const sortedOutliers = allOutliers.sort((a, b) => {
        if (sortOrder === 'desc') {
          return (b as any)[sortBy] - (a as any)[sortBy];
        } else {
          return (a as any)[sortBy] - (b as any)[sortBy];
        }
      });
      
      // Apply pagination to the sorted outliers
      const start = page * pageSize;
      const end = start + pageSize;
      const paginatedOutliers = sortedOutliers.slice(start, end);
      
      // Prepare response
      const responseData = {
        videos: paginatedOutliers,
        pagination: {
          page,
          pageSize,
          totalCount: allOutliers.length,
          totalPages: Math.ceil(allOutliers.length / pageSize)
        }
      };
      
      // Cache and return
      await setCachedData(cacheKey, responseData, 600);
      return NextResponse.json(responseData);
    } 
    else {
      // Regular flow (not outliers only)
      // Count total videos matching the criteria
      const totalCount = await prisma.video_statistics.count({ 
        where,
        // Add index hint for performance
        orderBy: { [sortBy as string]: sortOrder }
      });
      
      // Get videos with pagination and sorting
      const videos = await prisma.video_statistics.findMany({
        where,
        orderBy: {
          [sortBy as string]: sortOrder
        },
        skip: page * pageSize,
        take: pageSize,
      });

      // Calculate outliers and add status to videos
      const allChannelIds = videos.map((v) => v.channel_id);
      const uniqueChannelIds = [...new Set(allChannelIds)] as string[];
      
      // Get each channel's average views in the last 3 months
      // But limit to only the channels we need for this page
      const channelAveragesData = await Promise.all(
        uniqueChannelIds.map(async (id) => {
          const threeMonthsAgo = subMonths(new Date(), 3);
          
          // Filter out videos with 0 views
          const channelVideos = await prisma.video_statistics.findMany({
            where: {
              channel_id: id,
              view_count: { gt: 0 },
              publish_time: {
                gte: threeMonthsAgo
              }
            },
            // Only retrieve the fields we need
            select: {
              view_count: true
            },
            // Limit to a reasonable number of videos for average calculation
            take: 100,
            orderBy: {
              publish_time: 'desc'
            }
          });
          
          const totalViews = channelVideos.reduce((sum: number, video: any) => sum + video.view_count, 0);
          const avgViews = channelVideos.length > 0 ? totalViews / channelVideos.length : 0;
          
          return { channelId: id, avgViews };
        })
      );
      
      // Map averages to an object for faster lookups
      const channelAverages: Record<string, number> = {};
      channelAveragesData.forEach(channel => {
        channelAverages[channel.channelId] = channel.avgViews;
      });
      
      // Add outlier status to videos
      const videosWithOutlierStatus = videos.map((video) => {
        const channelAvg = channelAverages[video.channel_id] || 0;
        const isOutlier = channelAvg > 0 && video.view_count >= channelAvg * outlierMultiplier; // Changed to >= to match the outliers-only case
        
        return {
          ...video,
          isOutlier,
          channelAvgViews: channelAvg
        };
      });

      // Prepare response data
      const responseData = {
        videos: videosWithOutlierStatus,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize)
        }
      };

      // Cache the results for 10 minutes (600 seconds)
      await setCachedData(cacheKey, responseData, 600);
      return NextResponse.json(responseData);
    }
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 