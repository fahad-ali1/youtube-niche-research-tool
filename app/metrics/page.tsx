"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import NavigationMenu from "@/app/components/NavigationMenu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DailyMetricsData {
  date: string;
  contentMinutes: number;
  videoCount: number;
}

interface Video {
  id: string;
  title: string;
  duration: number;
  view_count: number;
  publish_time: string;
  isShort: boolean;
  channel_id: string;
  thumbnail?: string;
}

export default function Metrics() {
  const [metricsData, setMetricsData] = useState<DailyMetricsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [includeShorts, setIncludeShorts] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateVideos, setSelectedDateVideos] = useState<Video[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [isCacheWiping, setIsCacheWiping] = useState(false);

  useEffect(() => {
    fetchMetricsData(timeRange, includeShorts);
  }, [timeRange, includeShorts]);

  // Refetch videos for selected date when includeShorts toggle changes
  useEffect(() => {
    if (selectedDate) {
      fetchVideosForDate(selectedDate);
    }
  }, [selectedDate, includeShorts]);

  const fetchMetricsData = async (
    days: number | string,
    includeShorts: boolean
  ) => {
    setIsLoading(true);
    try {
      const shortsParam = includeShorts ? "" : "&excludeShorts=true";
      const response = await fetch(
        days === "all"
          ? `/api/metrics?timeRange=all${shortsParam}`
          : `/api/metrics?days=${days}${shortsParam}`
      );
      if (!response.ok) throw new Error("Failed to fetch metrics data");
      const data = await response.json();
      setMetricsData(data);
    } catch (error) {
      console.error("Error fetching metrics data:", error);
      toast.error("Failed to load metrics data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMetricsData(timeRange, includeShorts);
    setIsRefreshing(false);
  };
  
  // Handle wiping the cache
  const handleWipeCache = async () => {
    setIsCacheWiping(true);
    try {
      const response = await fetch("/api/cache", {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Cache wiped successfully");
        // Refresh the data
        await fetchMetricsData(timeRange, includeShorts);
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
    setIsRefreshing(true);

    try {
      const response = await fetch("/api/fetch-videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timePeriod: 3, // Default to 3 months
        }),
      });
      const data = await response.json();

      if (data.timedOut) {
        toast.success(data.message || "Workflow is updating! Refresh in a few minutes");
        setIsRefreshing(false);
        return;
      }

      if (data.success) {
        toast.success("Videos updated successfully");
        // Refresh the data
        await fetchMetricsData(timeRange, includeShorts);
      } else {
        toast.error("Failed to update videos");
        console.error("Failed to update videos:", data);
      }
    } catch (error) {
      console.error("Error updating videos:", error);
      toast.error("Error updating videos");
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchVideosForDate = async (date: string) => {
    setIsLoadingVideos(true);
    try {
      const shortsParam = includeShorts ? "" : "&excludeShorts=true";
      const response = await fetch(
        `/api/videos/by-date?date=${date}${shortsParam}`
      );
      if (!response.ok) throw new Error("Failed to fetch videos for this date");
      const data = await response.json();
      setSelectedDateVideos(data);
    } catch (error) {
      console.error("Error fetching videos for date:", error);
      toast.error("Failed to load videos for this date");
      setSelectedDateVideos([]);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const handleDateClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const clickedDate = data.activePayload[0].payload.date;
      setSelectedDate(clickedDate);
      fetchVideosForDate(clickedDate);
    }
  };

  // Calculate summary statistics
  const getTotalMinutes = () => {
    return metricsData.reduce((sum, day) => sum + day.contentMinutes, 0);
  };

  const getTotalVideos = () => {
    return metricsData.reduce((sum, day) => sum + day.videoCount, 0);
  };

  const getAverageMinutesPerDay = () => {
    if (metricsData.length === 0) return 0;
    return getTotalMinutes() / metricsData.length;
  };

  const formatMinutes = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      return `${hours}h ${mins}m`;
    }
    return `${Math.round(minutes)}m`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    }

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(88,122,255,0.8)] rounded-md">
          <p className="font-bold">{format(parseISO(label), "MMM d, yyyy")}</p>
          <p className="text-[#587aff]">
            <span className="font-medium">Content:</span>{" "}
            {formatMinutes(payload[0].value)}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Videos:</span> {payload[1].value}
          </p>
          <p className="text-xs italic mt-1">Click to view videos</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Menu */}
        <NavigationMenu 
          isUpdating={isRefreshing}
          isCacheWiping={isCacheWiping}
          onUpdate={handleUpdateVideos}
          onWipeCache={handleWipeCache}
        />
        
        <header className="mb-4">

          {/* Filters and controls */}
          <div className="bg-white border-2 border-black rounded-lg p-3 mb-4 shadow-[4px_4px_0px_0px_rgba(88,122,255,0.8)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#587aff]" />
                <h2 className="font-semibold">Time Range:</h2>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px] border border-gray-300">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="14">Last 14 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="60">Last 60 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2 ml-4">
                  <Switch
                    id="include-shorts"
                    checked={includeShorts}
                    onCheckedChange={setIncludeShorts}
                  />
                  <Label htmlFor="include-shorts">Include Shorts</Label>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 md:gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#587aff]" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Total Content
                    </p>
                    <p className="font-bold text-lg">
                      {formatMinutes(getTotalMinutes())}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#587aff]" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Videos Published
                    </p>
                    <p className="font-bold text-lg">{getTotalVideos()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 flex items-center justify-center text-[#587aff]">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">/d</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Daily Average
                    </p>
                    <p className="font-bold text-lg">
                      {formatMinutes(getAverageMinutesPerDay())}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main>
          {isLoading ? (
            <div
              className="bg-white border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(88,122,255,0.8)] flex items-center justify-center"
              style={{ height: "400px" }}
            >
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-[#587aff] mb-3" />
                <p className="text-sm text-gray-600">Loading metrics data...</p>
              </div>
            </div>
          ) : metricsData.length > 0 ? (
            <div className="bg-white border-2 border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(88,122,255,0.8)]">
              <h2 className="text-xl font-bold mb-4">
                Daily Content Published (in minutes)
              </h2>
              <div style={{ height: "400px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={metricsData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    onClick={handleDateClick}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(parseISO(date), "MMM d")}
                      stroke="#333"
                    />
                    <YAxis yAxisId="left" stroke="#587aff" />
                    <YAxis yAxisId="right" orientation="right" stroke="#888" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="contentMinutes"
                      name="Content (minutes)"
                      stroke="#587aff"
                      fill="rgba(88, 122, 255, 0.2)"
                      strokeWidth={2}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="videoCount"
                      name="Videos"
                      stroke="#888"
                      fill="rgba(136, 136, 136, 0.1)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 border-t pt-4 text-sm text-gray-500">
                <p>
                  * This chart shows the total minutes of content published each
                  day. Only videos with duration information are included.
                </p>
                <p>
                  * Click on any day in the chart to view all videos published
                  on that day.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-black rounded-lg p-8 shadow-[4px_4px_0px_0px_rgba(88,122,255,0.8)] text-center">
              <h3 className="text-xl font-bold mb-2">
                No metrics data available
              </h3>
              <p className="text-gray-500 mb-4">
                No videos with duration information were found in the selected
                time range.
              </p>
              <Button
                onClick={handleRefresh}
                className="bg-[#587aff] hover:bg-[#4563d0] text-white"
              >
                Refresh Data
              </Button>
            </div>
          )}

          {/* Video list for selected date */}
          {selectedDate && (
            <div className="bg-white border-2 border-black rounded-lg p-4 mt-6 shadow-[4px_4px_0px_0px_rgba(88,122,255,0.8)]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Videos Published on{" "}
                  {format(parseISO(selectedDate), "MMMM d, yyyy")}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(null)}
                  className="border border-gray-300 hover:border-[#587aff] hover:text-[#587aff]"
                >
                  Clear Selection
                </Button>
              </div>

              {isLoadingVideos ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#587aff] mr-2" />
                  <p>Loading videos...</p>
                </div>
              ) : selectedDateVideos.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Video</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Views</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedDateVideos.map((video) => (
                      <TableRow key={video.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            {video.thumbnail && (
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-16 h-9 object-cover rounded"
                              />
                            )}
                            <a
                              href={`https://youtube.com/watch?v=${video.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#587aff] hover:underline"
                            >
                              {video.title}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>{formatDuration(video.duration)}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              video.isShort
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {video.isShort ? "Short" : "Standard"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {video.view_count.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No videos found for this date.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
