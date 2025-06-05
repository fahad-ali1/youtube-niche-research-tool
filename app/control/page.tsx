"use client";

import NavigationMenu from "@/app/components/NavigationMenu";
import YouTubeAuthButton from "@/app/components/YouTubeAuthButton";
import { Competitor, VideoStatistics } from "@/types";
import { useEffect, useState } from "react";

// Import modular components
import AddChannelForm from "./components/AddChannelForm";
import ChannelStatistics from "./components/ChannelStatistics";
import CompetitorsList from "./components/CompetitorsList";
import VideoFetchingPanel from "./components/VideoFetchingPanel";

// Import services and utilities
import * as api from "./services/api";

export default function ControlPanel() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [channelVideos, setChannelVideos] = useState<VideoStatistics[]>([]);
  const [channelStatsLoading, setChannelStatsLoading] = useState(false);
  const [competitorStats, setCompetitorStats] = useState<
    Record<string, number>
  >({});
  const [isFetchingVideos, setIsFetchingVideos] = useState(false);
  const [isUpdatingVideos, setIsUpdatingVideos] = useState(false);
  const [isCacheWiping, setIsCacheWiping] = useState(false);
  const [isUpdatingAll, setIsUpdatingAll] = useState(false);
  const [timePeriod, setTimePeriod] = useState("3"); // Default to 3 months

  // Fetch competitors on mount
  useEffect(() => {
    fetchCompetitors();
  }, []);

  useEffect(() => {
    if (competitors.length > 0) {
      fetchCompetitorStats();
    }
  }, [competitors]);

  const fetchCompetitors = async () => {
    setLoading(true);
    try {
      const data = await api.fetchCompetitors();
      setCompetitors(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompetitorStats = async () => {
    try {
      const statsMap = await api.fetchCompetitorStats();
      setCompetitorStats(statsMap);
    } catch (error) {
      console.error("Error fetching competitor stats:", error);
    }
  };

  const handleUpdateVideos = async () => {
    setIsUpdatingVideos(true);
    try {
      const success = await api.updateVideos(timePeriod);
      if (success) {
        await fetchCompetitors();
        if (selectedChannel) {
          await handleChannelClick(selectedChannel);
        }
      }
    } finally {
      setIsUpdatingVideos(false);
    }
  };

  const handleWipeCache = async () => {
    setIsCacheWiping(true);
    try {
      const success = await api.wipeCache();
      if (success) {
        await fetchCompetitors();
        if (selectedChannel) {
          await handleChannelClick(selectedChannel);
        }
      }
    } finally {
      setIsCacheWiping(false);
    }
  };

  // Handle updating all videos (both existing and new)
  const handleUpdateAll = async () => {
    setIsUpdatingAll(true);
    try {
      const success = await api.updateAllVideos(timePeriod);
      if (success) {
        await fetchCompetitors();
        if (selectedChannel) {
          await handleChannelClick(selectedChannel);
        }
      }
    } finally {
      setIsUpdatingAll(false);
    }
  };

  const handleDirectFetch = async () => {
    setIsFetchingVideos(true);
    try {
      const success = await api.fetchNewVideos(timePeriod);
      if (success) {
        await fetchCompetitors();
        if (selectedChannel) {
          await handleChannelClick(selectedChannel);
        }
      }
    } finally {
      setIsFetchingVideos(false);
    }
  };

  const handleAddChannel = async (formData: { id: string }) => {
    const success = await api.addCompetitor(formData);
    if (success) {
      await fetchCompetitors();
    }
  };

  const handleDeleteChannel = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete channel ${id}?`)) {
      return;
    }

    const success = await api.deleteCompetitor(id);
    if (success) {
      await fetchCompetitors();

      // If the deleted channel was selected, clear the selection
      if (selectedChannel === id) {
        setSelectedChannel(null);
        setChannelVideos([]);
      }
    }
  };

  const handleChannelClick = async (channelId: string) => {
    setSelectedChannel(channelId);
    setChannelStatsLoading(true);
    setChannelVideos([]);

    try {
      const data = await api.fetchChannelStats(channelId);
      setChannelVideos(data.videos);
    } finally {
      setChannelStatsLoading(false);
    }
  };

  const handleUpdateChannel = async (editFormData: {
    id: string;
    url: string;
    title: string;
    profilePic: string;
  }) => {
    const success = await api.updateCompetitor(editFormData);
    if (success) {
      await fetchCompetitors();
    }
  };

  const selectedCompetitor = competitors.find((c) => c.id === selectedChannel);

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Menu */}
        <NavigationMenu
          isUpdating={isUpdatingAll}
          isCacheWiping={isCacheWiping}
          onUpdate={handleUpdateAll}
          onWipeCache={handleWipeCache}
        />

        <div className="grid grid-cols-1 mt-6 lg:grid-cols-2 gap-8 mb-8">
          {/* YouTube Authentication */}
          <YouTubeAuthButton />

          {/* Video Fetching Panel */}
          <VideoFetchingPanel
            timePeriod={timePeriod}
            isFetchingVideos={isFetchingVideos}
            isUpdatingVideos={isUpdatingVideos}
            onTimePeriodChange={setTimePeriod}
            onFetchVideos={handleDirectFetch}
            onUpdateVideos={handleUpdateVideos}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Channel Management */}
          <div>
            {/* Add Channel Form */}
            <AddChannelForm onAddChannel={handleAddChannel} />

            {/* Competitors List */}
            <CompetitorsList
              competitors={competitors}
              competitorStats={competitorStats}
              selectedChannel={selectedChannel}
              loading={loading}
              onChannelClick={handleChannelClick}
              onDeleteChannel={handleDeleteChannel}
              onUpdateChannel={handleUpdateChannel}
            />
          </div>

          {/* Channel Statistics */}
          <div className="bg-white p-6 border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-bold mb-4">
              {selectedCompetitor?.title || selectedChannel} Statistics
            </h2>
            <ChannelStatistics
              selectedChannel={selectedChannel}
              selectedCompetitor={selectedCompetitor}
              channelVideos={channelVideos}
              channelStatsLoading={channelStatsLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
