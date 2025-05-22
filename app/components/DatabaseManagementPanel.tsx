"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DownloadCloud, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  quotaExceeded?: boolean;
  keyUsed?: string;
  videosAdded?: number;
  videosUpdated?: number;
}

export default function DatabaseManagementPanel() {
  const [isFetchingNewVideos, setIsFetchingNewVideos] = useState(false);
  const [isUpdatingVideos, setIsUpdatingVideos] = useState(false);
  const [apiStatus, setApiStatus] = useState<{
    message: string;
    type: "success" | "error" | "info";
    timestamp: Date;
    details?: any;
  } | null>(null);

  const handleFetchNewVideos = async () => {
    setIsFetchingNewVideos(true);
    setApiStatus({
      message: "Fetching new videos from YouTube...",
      type: "info",
      timestamp: new Date(),
    });

    try {
      const response = await fetch("/api/youtube/fetch-new-videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        toast.success(data.message || "Successfully fetched new videos");
        setApiStatus({
          message: `Successfully fetched ${data.videosAdded} new videos using key: ${data.keyUsed}`,
          type: "success",
          timestamp: new Date(),
          details: data,
        });
      } else {
        if (data.quotaExceeded) {
          toast.error(`YouTube API quota exceeded for key: ${data.keyUsed}`);
        } else {
          toast.error(data.error || "Failed to fetch new videos");
        }

        setApiStatus({
          message: data.error || "Failed to fetch new videos",
          type: "error",
          timestamp: new Date(),
          details: data,
        });
      }
    } catch (error) {
      console.error("Error fetching new videos:", error);
      toast.error("Error connecting to the API");
      setApiStatus({
        message: "Error connecting to the API",
        type: "error",
        timestamp: new Date(),
        details: error,
      });
    } finally {
      setIsFetchingNewVideos(false);
    }
  };

  const handleUpdateVideos = async () => {
    setIsUpdatingVideos(true);
    setApiStatus({
      message: "Updating existing videos...",
      type: "info",
      timestamp: new Date(),
    });

    try {
      const response = await fetch("/api/youtube/update-videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        toast.success(data.message || "Successfully updated videos");
        setApiStatus({
          message: `Successfully updated ${data.videosUpdated} videos using key: ${data.keyUsed}`,
          type: "success",
          timestamp: new Date(),
          details: data,
        });
      } else {
        if (data.quotaExceeded) {
          toast.error(`YouTube API quota exceeded for key: ${data.keyUsed}`);
        } else {
          toast.error(data.error || "Failed to update videos");
        }

        setApiStatus({
          message: data.error || "Failed to update videos",
          type: "error",
          timestamp: new Date(),
          details: data,
        });
      }
    } catch (error) {
      console.error("Error updating videos:", error);
      toast.error("Error connecting to the API");
      setApiStatus({
        message: "Error connecting to the API",
        type: "error",
        timestamp: new Date(),
        details: error,
      });
    } finally {
      setIsUpdatingVideos(false);
    }
  };

  return (
    <Card className="border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Database Management
        </CardTitle>
        <CardDescription>
          Fetch new videos from YouTube or update existing video statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              onClick={handleFetchNewVideos}
              disabled={isFetchingNewVideos || isUpdatingVideos}
              className="bg-black text-white font-bold hover:bg-gray-800 flex items-center gap-2"
            >
              {isFetchingNewVideos ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <DownloadCloud className="h-4 w-4" />
              )}
              {isFetchingNewVideos ? "Fetching..." : "Fetch New Videos"}
            </Button>

            <Button
              onClick={handleUpdateVideos}
              disabled={isFetchingNewVideos || isUpdatingVideos}
              className="bg-blue-600 text-white font-bold hover:bg-blue-700 flex items-center gap-2"
            >
              {isUpdatingVideos ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isUpdatingVideos ? "Updating..." : "Update Existing Videos"}
            </Button>
          </div>

          {apiStatus && (
            <div
              className={`mt-4 p-4 rounded-lg border-2 ${
                apiStatus.type === "success"
                  ? "bg-green-50 border-green-500"
                  : apiStatus.type === "error"
                  ? "bg-red-50 border-red-500"
                  : "bg-blue-50 border-blue-500"
              }`}
            >
              <p className="font-semibold">{apiStatus.message}</p>
              <p className="text-sm text-gray-600 mt-1">
                {apiStatus.timestamp.toLocaleTimeString()}
              </p>
              {apiStatus.details?.keyUsed && (
                <p className="text-sm mt-1">
                  API Key Used: {apiStatus.details.keyUsed}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
