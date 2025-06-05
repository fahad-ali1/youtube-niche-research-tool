"use client";

import { FilterBar } from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import NavigationMenu from "@/app/components/NavigationMenu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { VideoCard } from "@/components/VideoCard";
import { VideoCardSkeleton } from "@/components/VideoCardSkeleton";
import { WordFrequencyDialog } from "@/components/WordFrequencyDialog";
import { Competitor, FilterOptions, VideoStatistics } from "@/types";
import {
  Clock,
  DownloadCloud,
  Loader2,
  Settings,
  Trash2,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useInView } from "react-intersection-observer";

// Default filters
const DEFAULT_FILTERS: FilterOptions = {
  sortBy: "publish_time",
  sortOrder: "desc",
  videoType: "long",
  outlierMultiplier: 2,
  outliersOnly: false,
};

// Available page sizes
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function Home() {
  // State for videos and loading
  const [videos, setVideos] = useState<
    (VideoStatistics & { isOutlier?: boolean; channelAvgViews?: number })[]
  >([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
  const [page, setPage] = useState(0);
  const [filterOptions, setFilterOptions] =
    useState<FilterOptions>(DEFAULT_FILTERS);
  const [selectedChannel, setSelectedChannel] = useState<string | undefined>(
    undefined
  );
  const [loadAllMode, setLoadAllMode] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCacheWiping, setIsCacheWiping] = useState(false);

  // Intersection observer hook for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // Fetch competitors on component mount
  useEffect(() => {
    const fetchCompetitors = async () => {
      try {
        const response = await fetch("/api/competitors");
        if (!response.ok) throw new Error("Failed to fetch competitors");
        const data = await response.json();
        setCompetitors(data);
      } catch (error) {
        console.error("Error fetching competitors:", error);
      }
    };

    fetchCompetitors();
  }, []);

  // // Fetch videos when filters change or on initial load
  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      setVideos([]);
      setPage(0);
      setHasMoreVideos(true);

      try {
        if (loadAllMode) {
          // Load all videos at once
          const response = await fetchVideosPage(0, 1000);
          setVideos(response.videos);
          setHasMoreVideos(false);
        } else {
          // Load in batches
          const response = await fetchVideosPage(0, pageSize);
          setVideos(response.videos);
          setHasMoreVideos(
            response.pagination.page < response.pagination.totalPages - 1
          );
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [filterOptions, loadAllMode, pageSize]);

  // Load more videos when scroll reaches bottom
  useEffect(() => {
    const loadMoreVideos = async () => {
      if (
        inView &&
        hasMoreVideos &&
        !isLoadingMore &&
        !isLoading &&
        !loadAllMode
      ) {
        setIsLoadingMore(true);

        try {
          const nextPage = page + 1;
          const response = await fetchVideosPage(nextPage, pageSize);

          setVideos((prev) => [...prev, ...response.videos]);
          setPage(nextPage);
          setHasMoreVideos(nextPage < response.pagination.totalPages - 1);
        } catch (error) {
          console.error("Error loading more videos:", error);
        } finally {
          setIsLoadingMore(false);
        }
      }
    };

    loadMoreVideos();
  }, [
    inView,
    hasMoreVideos,
    isLoadingMore,
    isLoading,
    page,
    loadAllMode,
    pageSize,
  ]);

  // Fetch videos with current filters
  const fetchVideosPage = async (pageNumber: number, itemsPerPage: number) => {
    const params: Record<string, string> = {
      page: pageNumber.toString(),
      pageSize: itemsPerPage.toString(),
    };

    // Only add non-empty filter values
    if (filterOptions.channelId) params.channelId = filterOptions.channelId;
    if (filterOptions.sortBy) params.sortBy = filterOptions.sortBy;
    if (filterOptions.sortOrder) params.sortOrder = filterOptions.sortOrder;
    if (filterOptions.timeFrame) params.timeFrame = filterOptions.timeFrame;
    if (filterOptions.outlierMultiplier) {
      params.outlierMultiplier = filterOptions.outlierMultiplier.toString();
    }
    if (filterOptions.outliersOnly) {
      params.outliersOnly = filterOptions.outliersOnly.toString();
    }
    // Add videoType param (always include it)
    params.videoType = filterOptions.videoType || "long";

    const queryParams = new URLSearchParams(params);
    const response = await fetch(`/api/videos?${queryParams.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch videos");
    return await response.json();
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
  };

  // Reset filters to default
  const handleResetFilters = () => {
    setFilterOptions(DEFAULT_FILTERS);
    setSelectedChannel(undefined);
  };

  // Handle channel click to filter by channel
  const handleChannelClick = (channelId: string) => {
    setSelectedChannel(channelId);
    setFilterOptions((prev) => ({ ...prev, channelId }));
  };

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
  };

  // Toggle between load all and pagination modes
  const toggleLoadMode = () => {
    setLoadAllMode(!loadAllMode);
  };

  // Handle wiping the cache
  const handleWipeCache = async () => {
    try {
      setIsCacheWiping(true);
      const response = await fetch("/api/cache", {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Cache wiped successfully");
        // Refresh the videos with current filters
        setVideos([]);
        setPage(0);

        // Refetch with current filters
        const response = await fetchVideosPage(0, pageSize);
        setVideos(response.videos);
        setHasMoreVideos(
          response.pagination.page < response.pagination.totalPages - 1
        );
      } else {
        toast.error(data.error || "Failed to wipe cache");
      }
    } catch (error) {
      toast.error("Error wiping cache");
      console.error("Error wiping cache:", error);
    } finally {
      setIsCacheWiping(false);
    }
  };

  // Handle updating videos from the backend
  const handleUpdateVideos = async () => {
    setIsUpdating(true);

    try {
      const response = await fetch("/api/fetch-videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.timedOut) {
        // Show timeout message
        toast.success(
          data.message || "Workflow is updating! Refresh in a few minutes"
        );
        setIsUpdating(false);
        return;
      }

      if (data.success) {
        // Refresh the videos with no cache
        setVideos([]);
        setPage(0);

        // Refetch with current filters
        const response = await fetchVideosPage(0, pageSize);
        setVideos(response.videos);
        setHasMoreVideos(
          response.pagination.page < response.pagination.totalPages - 1
        );

        // Show success message
        toast.success("Videos updated successfully");
      } else {
        // Show error message
        toast.error("Failed to update videos");
        console.error("Failed to update videos:", data);
      }
    } catch (error) {
      console.error("Error updating videos:", error);
      toast.error("Error updating videos");
    } finally {
      setIsUpdating(false);
    }
  };

  // Generate skeleton loaders
  const renderSkeletons = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <VideoCardSkeleton key={`skeleton-${index}`} />
    ));
  };

  // Render spinning loader
  const renderSpinningLoader = () => {
    return (
      <div className="col-span-full flex items-center justify-center py-12">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#587aff] mb-3" />
          <p className="text-sm text-gray-600">Loading videos...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-4">
          {/* Navigation Menu */}
          <NavigationMenu 
            isUpdating={isUpdating}
            isCacheWiping={isCacheWiping}
            onUpdate={handleUpdateVideos}
            onWipeCache={handleWipeCache}
          />
          
          {/* Word Frequency Dialog */}
          <div className="flex justify-end mb-2">
            <WordFrequencyDialog currentVideos={videos} />
          </div>

          {/* Filters */}
          <FilterBar
            competitors={competitors}
            selectedChannel={selectedChannel}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />

          {/* Video loading controls */}
          <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-2 mb-3 text-sm">
            <div className="text-gray-600">
              <span className="font-medium">
                Showing {videos.length} videos
              </span>
              {!loadAllMode && hasMoreVideos && (
                <span className="text-gray-500"> (more available)</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2 bg-gray-50 rounded-md px-2 py-1 border border-gray-200">
                  <Label
                    htmlFor="loadAll"
                    className="text-xs cursor-pointer whitespace-nowrap font-medium text-gray-700"
                  >
                    Load all
                  </Label>
                  <Switch
                    id="loadAll"
                    checked={loadAllMode}
                    onCheckedChange={toggleLoadMode}
                    className="data-[state=checked]:bg-[#587aff] border border-gray-200"
                  />
                </div>
                {!loadAllMode && (
                  <Select
                    value={pageSize.toString()}
                    onValueChange={handlePageSizeChange}
                  >
                    <SelectTrigger className="h-7 w-28 border border-gray-300 text-xs flex items-center justify-between">
                      <span>{pageSize} per page</span>
                    </SelectTrigger>
                    <SelectContent className="border border-gray-300">
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} per page
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Video grid */}
        <main>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderSpinningLoader()}
            </div>
          ) : videos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onChannelClick={handleChannelClick}
                    competitors={competitors}
                  />
                ))}
              </div>

              {/* Load more trigger */}
              {hasMoreVideos && !loadAllMode && (
                <div ref={ref} className="flex justify-center mt-8 mb-4">
                  {isLoadingMore && (
                    <div className="flex justify-center w-full py-6">
                      <Loader2 className="h-8 w-8 animate-spin text-[#587aff]" />
                    </div>
                  )}
                </div>
              )}

              {!hasMoreVideos && videos.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                  {loadAllMode ? "All videos loaded" : "No more videos to load"}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 border-2 border-black rounded-lg bg-white">
              <h3 className="text-xl font-bold mb-2">No videos found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
