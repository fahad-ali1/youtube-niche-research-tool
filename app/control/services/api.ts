import { toast } from "react-hot-toast";
import { Competitor, VideoStatistics } from "@/types";

// Competitor-related API calls
export const fetchCompetitors = async (): Promise<Competitor[]> => {
  try {
    const response = await fetch("/api/competitors");
    if (!response.ok) throw new Error("Failed to fetch competitors");
    return await response.json();
  } catch (error) {
    console.error("Error fetching competitors:", error);
    toast.error("Failed to load competitors");
    return [];
  }
};

export const fetchCompetitorStats = async (): Promise<Record<string, number>> => {
  try {
    const response = await fetch("/api/channels/stats");
    if (!response.ok) throw new Error("Failed to fetch channel statistics");
    return await response.json();
  } catch (error) {
    console.error("Error fetching competitor stats:", error);
    return {};
  }
};

export const addCompetitor = async (formData: { id: string }): Promise<boolean> => {
  try {
    const response = await fetch("/api/competitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add channel");
    }

    toast.success("Channel added successfully");
    return true;
  } catch (error) {
    console.error("Error adding channel:", error);
    
    // Don't show toast here - we'll handle it in the component
    // to provide better error messages and actions
    
    // Re-throw the error so it can be handled by the component
    throw error;
  }
};

export const updateCompetitor = async (
  editFormData: { id: string; url: string; title: string; profilePic: string }
): Promise<boolean> => {
  try {
    const response = await fetch(`/api/competitors/${editFormData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editFormData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update channel");
    }

    toast.success("Channel updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating channel:", error);
    toast.error(error instanceof Error ? error.message : "Failed to update channel");
    return false;
  }
};

export const deleteCompetitor = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/competitors/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete channel");
    }

    toast.success("Channel deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting channel:", error);
    toast.error("Failed to delete channel");
    return false;
  }
};

// Channel-related API calls
export const fetchChannelStats = async (
  channelId: string
): Promise<{ videos: VideoStatistics[] }> => {
  try {
    const response = await fetch(`/api/channels/${channelId}/stats`);
    if (!response.ok) throw new Error("Failed to fetch channel stats");
    return await response.json();
  } catch (error) {
    console.error("Error fetching channel stats:", error);
    toast.error("Failed to load channel statistics");
    return { videos: [] };
  }
};

// Video-related API calls
export const updateVideos = async (timePeriod: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/youtube/update-videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timePeriod: parseInt(timePeriod),
      }),
    });
    const data = await response.json();

    if (data.timedOut) {
      toast.success(data.message || "Workflow is updating! Refresh in a few minutes");
      return false;
    }

    if (data.success) {
      toast.success("Videos updated successfully");
      return true;
    } else {
      toast.error("Failed to update videos");
      console.error("Failed to update videos:", data);
      return false;
    }
  } catch (error) {
    console.error("Error updating videos:", error);
    toast.error("Error updating videos");
    return false;
  }
};

export const fetchNewVideos = async (timePeriod: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/youtube/fetch-new-videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timePeriod: parseInt(timePeriod),
      }),
    });

    const data = await response.json();

    if (data.success) {
      toast.success(`Added ${data.videosAdded} new videos`);
      return true;
    } else {
      toast.error(data.error || "Failed to fetch new videos");
      console.error("Failed to fetch new videos:", data);
      return false;
    }
  } catch (error) {
    console.error("Error fetching new videos:", error);
    toast.error("Error fetching new videos");
    return false;
  }
};

export const wipeCache = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/cache", {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Cache wiped successfully");
      return true;
    } else {
      toast.error(data.error || "Failed to wipe cache");
      return false;
    }
  } catch (error) {
    toast.error("Error wiping cache");
    console.error("Error wiping cache:", error);
    return false;
  }
};

// Update all videos (both existing and new)
export const updateAllVideos = async (timePeriod: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/videos/update-all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timePeriod: parseInt(timePeriod),
      }),
    });
    const data = await response.json();

    if (data.success) {
      toast.success(`Updated ${data.videosUpdated} videos and added ${data.videosAdded} new videos`);
      return true;
    } else {
      toast.error(data.error || "Failed to update videos");
      console.error("Failed to update videos:", data);
      return false;
    }
  } catch (error) {
    console.error("Error updating all videos:", error);
    toast.error("Error updating videos");
    return false;
  }
};
