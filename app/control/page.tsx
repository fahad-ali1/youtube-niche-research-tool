'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Competitor, VideoStatistics } from '@/types';
import { toast } from 'react-hot-toast';
import { Trash2, ArrowLeft, ExternalLink, DownloadCloud, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function ControlPanel() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ id: '', url: '', title: '' });
  const [submitting, setSubmitting] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [channelVideos, setChannelVideos] = useState<VideoStatistics[]>([]);
  const [channelStatsLoading, setChannelStatsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [competitorStats, setCompetitorStats] = useState<Record<string, number>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCacheWiping, setIsCacheWiping] = useState(false);

  // Fetch competitors on mount
  useEffect(() => {
    fetchCompetitors();
  }, []);

  useEffect(() => {
    if (competitors.length > 0) {
      fetchCompetitorStats();
    }
  }, [competitors]);

  // Handle updating videos from the backend
  const handleUpdateVideos = async () => {
    setIsUpdating(true);
    
    try {
      const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || "http://localhost:5678/webhook/fetch_videos";
      const response = await fetch(webhookUrl);
      const data = await response.json();
      
      if (data.success) {
        toast.success("Videos updated successfully");
        // Refresh the competitors stats
        await fetchCompetitors();
        if (selectedChannel) {
          await handleChannelClick(selectedChannel);
        }
      } else {
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
        // Refresh the current data
        await fetchCompetitors();
        if (selectedChannel) {
          await handleChannelClick(selectedChannel);
        }
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

  const fetchCompetitors = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/competitors');
      if (!response.ok) throw new Error('Failed to fetch competitors');
      const data = await response.json();
      setCompetitors(data);
    } catch (error) {
      console.error('Error fetching competitors:', error);
      toast.error('Failed to load competitors');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompetitorStats = async () => {
    try {
      // Fetch all channel stats in a single API call
      const response = await fetch('/api/channels/stats');
      if (!response.ok) throw new Error('Failed to fetch channel statistics');
      
      const statsMap = await response.json();
      setCompetitorStats(statsMap);
    } catch (error) {
      console.error('Error fetching competitor stats:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate form data
      if (!formData.id.trim() || !formData.url.trim()) {
        toast.error('Channel ID and URL are required');
        return;
      }

      // Add channel
      const response = await fetch('/api/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add channel');
      }

      // Refresh the competitors list
      await fetchCompetitors();
      
      // Reset form
      setFormData({ id: '', url: '', title: '' });
      toast.success('Channel added successfully');
    } catch (error) {
      console.error('Error adding channel:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add channel');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteChannel = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete channel ${id}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/competitors/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete channel');
      }

      // Refresh the competitors list
      await fetchCompetitors();
      toast.success('Channel deleted successfully');
      
      // If the deleted channel was selected, clear the selection
      if (selectedChannel === id) {
        setSelectedChannel(null);
        setChannelVideos([]);
      }
    } catch (error) {
      console.error('Error deleting channel:', error);
      toast.error('Failed to delete channel');
    }
  };

  const handleChannelClick = async (channelId: string) => {
    setSelectedChannel(channelId);
    setChannelStatsLoading(true);
    setChannelVideos([]);

    try {
      const response = await fetch(`/api/channels/${channelId}/stats`);
      if (!response.ok) throw new Error('Failed to fetch channel stats');
      
      
      const data = await response.json();

      console.log(data);

      setChannelVideos(data.videos);
    } catch (error) {
      console.error('Error fetching channel stats:', error);
      toast.error('Failed to load channel statistics');
    } finally {
      setChannelStatsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const calculateAverageViews = (videos: VideoStatistics[]) => {
    const videosWithViews = videos.filter(video => video.view_count > 0);
    if (videosWithViews.length === 0) return 0;
    const totalViews = videosWithViews.reduce((sum, video) => sum + video.view_count, 0);
    return totalViews / videosWithViews.length;
  };

  const selectedCompetitor = competitors.find(c => c.id === selectedChannel);

  const filteredCompetitors = searchQuery.trim() === '' 
    ? competitors 
    : competitors.filter(comp => 
        (comp.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
        comp.id.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="bg-black text-white border-4 border-black rounded-lg p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center justify-between flex-1">
                <h1 className="text-3xl md:text-2xl font-bold text-center text-white">Control Panel</h1>
                <Link href="/">
                  <Button variant="outline" className="border-2 border-white text-black hover:bg-gray-200 cursor-pointer">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  disabled={isUpdating}
                  onClick={handleUpdateVideos}
                  className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1"
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <DownloadCloud className="h-4 w-4" />
                  )}
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isCacheWiping}
                  onClick={handleWipeCache}
                  className="border border-gray-300 bg-white hover:border-red-500 hover:text-red-500 text-black flex items-center gap-1"
                >
                  {isCacheWiping ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {isCacheWiping ? "Wiping..." : "Wipe Cache"}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Channel Management */}
          <div>
            <div className="bg-white p-6 border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
              <h2 className="text-2xl font-bold mb-4">Add New Channel</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="id" className="text-sm font-bold">Channel ID</Label>
                  <Input 
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    className="border-2 border-black mt-1"
                    placeholder="e.g. UCnRGF5GzH5Lz4hOpjq2FrOw"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="url" className="text-sm font-bold">Channel URL</Label>
                  <Input 
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="border-2 border-black mt-1"
                    placeholder="https://www.youtube.com/channel/UCnRGF5GzH5Lz4hOpjq2FrOw"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="title" className="text-sm font-bold">Channel Title</Label>
                  <Input 
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="border-2 border-black mt-1"
                    placeholder="e.g. Channel Name"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-black text-white font-bold hover:bg-gray-800 w-full"
                >
                  {submitting ? 'Adding...' : 'Add Channel'}
                </Button>
              </form>
            </div>

            <div className="bg-white p-6 border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-bold mb-4">Competitors</h2>
              
              {/* Search input */}
              <div className="mb-4">
                <Input
                  placeholder="Search competitors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-2 border-black"
                />
              </div>
              
              {loading ? (
                <p>Loading competitors...</p>
              ) : competitors.length === 0 ? (
                <p className="text-gray-500">No competitors found</p>
              ) : (
                <div className="h-[400px] overflow-y-auto border-2 border-black rounded-lg">
                  <ul className="space-y-2 p-2">
                    {filteredCompetitors.map((competitor) => (
                      <li 
                        key={competitor.id}
                        className={`
                          p-4 border-2 border-black rounded-lg 
                          ${selectedChannel === competitor.id ? 'bg-blue-50' : 'bg-white'}
                          hover:bg-gray-50 cursor-pointer transition-colors
                        `}
                      >
                        <div className="flex justify-between items-start">
                          <div 
                            className="flex-grow" 
                            onClick={() => handleChannelClick(competitor.id)}
                          >
                            <p className="font-bold">{competitor.title || competitor.id}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="truncate">{competitor.url}</span>
                              <a 
                                href={competitor.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-1 text-blue-500 hover:text-blue-700"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink size={14} />
                              </a>
                            </div>
                            <div className="mt-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full inline-block">
                              {competitorStats[competitor.id] !== undefined 
                                ? `${competitorStats[competitor.id]} videos` 
                                : 'Update to get stats'}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-2 border-red-500 text-red-500 hover:bg-red-50 ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChannel(competitor.id);
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Channel Statistics */}
          <div className="bg-white p-6 border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {selectedChannel ? (
              <>
                <h2 className="text-2xl font-bold mb-4">
                  {selectedCompetitor?.title || selectedChannel} Statistics
                </h2>
                {channelStatsLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <p>Loading statistics...</p>
                  </div>
                ) : channelVideos.length > 0 ? (
                  <div>
                    <div className="mb-6 p-4 bg-blue-50 border-2 border-black rounded-lg">
                      <h3 className="text-lg font-bold mb-2">3-Month Average Calculation</h3>
                      <p><strong>Total Videos:</strong> {channelVideos.length}</p>
                      <p><strong>Videos with Views (used for average):</strong> {channelVideos.filter(v => v.view_count > 0).length}</p>
                      <p><strong>Total Views:</strong> {formatNumber(channelVideos.filter(v => v.view_count > 0).reduce((sum, v) => sum + v.view_count, 0))}</p>
                      <p className="text-xl mt-2">
                        <strong>Average Views:</strong> {formatNumber(Math.round(calculateAverageViews(channelVideos)))}
                      </p>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2">Video Breakdown</h3>
                    <div className="overflow-auto max-h-[600px] border-2 border-black rounded-lg">
                      <table className="min-w-full">
                        <thead className="bg-gray-100 sticky top-0">
                          <tr>
                            <th className="px-4 py-2 text-left border-b-2 border-black">Video</th>
                            <th className="px-4 py-2 text-right border-b-2 border-black">Views</th>
                            <th className="px-4 py-2 text-right border-b-2 border-black">Published</th>
                          </tr>
                        </thead>
                        <tbody>
                          {channelVideos.map((video) => (
                            <tr key={video.id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <a 
                                  href={`https://www.youtube.com/watch?v=${video.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline font-medium flex items-center"
                                >
                                  {video.title || video.id}
                                  <ExternalLink size={14} className="ml-1" />
                                </a>
                              </td>
                              <td className="px-4 py-3 text-right">{formatNumber(video.view_count)}</td>
                              <td className="px-4 py-3 text-right">
                                {format(new Date(video.publish_time), 'MMM d, yyyy')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-500">No videos found for this channel in the last 3 months</p>
                  </div>
                )}
              </>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center">
                <p className="text-xl text-gray-500 mb-2">Select a channel to view statistics</p>
                <p className="text-gray-400">Click on a channel from the list to see its statistics</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 