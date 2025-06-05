"use client";

import { useEffect, useState } from "react";
import DatabaseManagementPanel from "@/app/components/DatabaseManagementPanel";
import YouTubeAuthButton from "@/app/components/YouTubeAuthButton";
import { Competitor, VideoStatistics } from "@/types";

// Import modular components
import Header from "./components/Header";
import VideoFetchingPanel from "./components/VideoFetchingPanel";
import AddChannelForm from "./components/AddChannelForm";
import CompetitorsList from "./components/CompetitorsList";
import ChannelStatistics from "./components/ChannelStatistics";

// Import services and utilities
import * as api from "./services/api";

export default function ControlPanel() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [channelVideos, setChannelVideos] = useState<VideoStatistics[]>([]);
  const [channelStatsLoading, setChannelStatsLoading] = useState(false);
  const [competitorStats, setCompetitorStats] = useState<Record<string, number>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCacheWiping, setIsCacheWiping] = useState(false);
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
    setIsUpdating(true);
    try {
      const success = await api.updateVideos(timePeriod);
      if (success) {
        await fetchCompetitors();
        if (selectedChannel) {
          await handleChannelClick(selectedChannel);
        }
      }
    } finally {
      setIsUpdating(false);
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

  const handleDirectFetch = async () => {
    setIsUpdating(true);
    try {
      const success = await api.fetchNewVideos(timePeriod);
      if (success) {
        await fetchCompetitors();
        if (selectedChannel) {
          await handleChannelClick(selectedChannel);
        }
      }
    } finally {
      setIsUpdating(false);
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

  const handleUpdateChannel = async (editFormData: { id: string; url: string; title: string; profilePic: string }) => {
    const success = await api.updateCompetitor(editFormData);
    if (success) {
      await fetchCompetitors();
    }
  };

  const selectedCompetitor = competitors.find((c) => c.id === selectedChannel);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with cache wipe button */}
        <Header 
          isCacheWiping={isCacheWiping} 
          onWipeCache={handleWipeCache} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Database Management Panel */}
          <DatabaseManagementPanel />

          {/* YouTube Authentication */}
          <YouTubeAuthButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Video Fetching Panel */}
          <VideoFetchingPanel
            timePeriod={timePeriod}
            isUpdating={isUpdating}
            onTimePeriodChange={setTimePeriod}
            onFetchVideos={handleDirectFetch}
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
