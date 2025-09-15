'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Video {
  id: string;
  title: string;
  channelTitle: string;
  channelId: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  subscriberCount: number;
  url: string;
  channelUrl: string;
  engagementRate: number;
  viewsToSubsRatio: number;
  channelVideoCount: number;
  channelViewCount: number;
  channelMonthsActive: number;
  channelAvgViewsPerMonth: number;
  channelAvgVideosPerMonth: number;
  channelCreatedAt: string;
  competitionScore: number;
  durationSeconds: number;
  durationFormatted: string;
  durationCategory: 'short' | 'medium' | 'long';
}

interface SearchResult {
  success: boolean;
  keyword: string;
  totalResults: number;
  videos: Video[];
  summary: {
    averageViews: number;
    averageSubscribers: number;
    averageEngagement: string;
    topOpportunity: Video | null;
  };
}

const STORAGE_KEY = 'niche-research-filters';

// Helper functions for localStorage
const saveFiltersToStorage = (filters: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }
};

const loadFiltersFromStorage = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved filters:', e);
      }
    }
  }
  return null;
};

export default function NicheResearchPage() {
  const [keyword, setKeyword] = useState('');
  const [minViews, setMinViews] = useState(10000);
  const [maxViews, setMaxViews] = useState('');
  const [minSubscribers, setMinSubscribers] = useState('');
  const [maxSubscribers, setMaxSubscribers] = useState(100000);
  const [minVideos, setMinVideos] = useState('');
  const [maxVideos, setMaxVideos] = useState('');
  const [minEngagement, setMinEngagement] = useState('');
  const [maxEngagement, setMaxEngagement] = useState('');
  const [videoDuration, setVideoDuration] = useState('any');
  const [excludeHindi, setExcludeHindi] = useState(true);
  const [sortBy, setSortBy] = useState('competitionScore');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [apiKeys, setApiKeys] = useState<string[]>([]);
  const [newApiKey, setNewApiKey] = useState('');
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [useRelatedTerms, setUseRelatedTerms] = useState(true);
  const [publishedAfterDays, setPublishedAfterDays] = useState('');

  // Load saved filters on component mount
  useEffect(() => {
    const savedFilters = loadFiltersFromStorage();
    if (savedFilters) {
      setKeyword(savedFilters.keyword || '');
      setMinViews(savedFilters.minViews || 10000);
      setMaxViews(savedFilters.maxViews || '');
      setMinSubscribers(savedFilters.minSubscribers || '');
      setMaxSubscribers(savedFilters.maxSubscribers || 100000);
      setMinVideos(savedFilters.minVideos || '');
      setMaxVideos(savedFilters.maxVideos || '');
      setMinEngagement(savedFilters.minEngagement || '');
      setMaxEngagement(savedFilters.maxEngagement || '');
      setVideoDuration(savedFilters.videoDuration || 'any');
      setExcludeHindi(savedFilters.excludeHindi !== undefined ? savedFilters.excludeHindi : true);
      setSortBy(savedFilters.sortBy || 'competitionScore');
      setShowAdvanced(savedFilters.showAdvanced || false);
      setApiKeys(savedFilters.apiKeys || []);
      setUseRelatedTerms(savedFilters.useRelatedTerms !== undefined ? savedFilters.useRelatedTerms : true);
      setPublishedAfterDays(savedFilters.publishedAfterDays || '');
    }
  }, []);

  // Save filters whenever they change
  useEffect(() => {
    const filters = {
      keyword,
      minViews,
      maxViews,
      minSubscribers,
      maxSubscribers,
      minVideos,
      maxVideos,
      minEngagement,
      maxEngagement,
      videoDuration,
      excludeHindi,
      sortBy,
      showAdvanced,
      apiKeys,
      useRelatedTerms,
      publishedAfterDays
    };
    saveFiltersToStorage(filters);
  }, [keyword, minViews, maxViews, minSubscribers, maxSubscribers, minVideos, maxVideos, minEngagement, maxEngagement, videoDuration, excludeHindi, sortBy, showAdvanced, apiKeys, useRelatedTerms, publishedAfterDays]);

  const handleSearch = async () => {
    if (apiKeys.length === 0) {
      setError('Please add at least one YouTube API key in the settings above');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/keyword-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: keyword.trim(),
          apiKeys,
          filters: {
            minViews,
            maxViews: maxViews ? parseInt(maxViews) : undefined,
            minSubscribers: minSubscribers ? parseInt(minSubscribers) : undefined,
            maxSubscribers,
            minVideosUploaded: minVideos ? parseInt(minVideos) : undefined,
            maxVideosUploaded: maxVideos ? parseInt(maxVideos) : undefined,
            minEngagementRate: minEngagement ? parseFloat(minEngagement) : undefined,
            maxEngagementRate: maxEngagement ? parseFloat(maxEngagement) : undefined,
            videoDuration: videoDuration as 'short' | 'medium' | 'long' | 'any',
            excludeHindi,
            useRelatedTerms: true, // Always enabled
            publishedAfterDays: publishedAfterDays ? parseInt(publishedAfterDays) : undefined,
            maxResults: 50
          }
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }
      
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const clearSavedSettings = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      // Reset to defaults
      setKeyword('');
      setMinViews(10000);
      setMaxViews('');
      setMinSubscribers('');
      setMaxSubscribers(100000);
      setMinVideos('');
      setMaxVideos('');
      setMinEngagement('');
      setMaxEngagement('');
      setVideoDuration('any');
      setExcludeHindi(true);
      setSortBy('competitionScore');
      setShowAdvanced(false);
      setApiKeys([]);
    }
  };

  const addApiKey = () => {
    if (newApiKey.trim() && !apiKeys.includes(newApiKey.trim())) {
      setApiKeys([...apiKeys, newApiKey.trim()]);
      setNewApiKey('');
    }
  };

  const removeApiKey = (keyToRemove: string) => {
    setApiKeys(apiKeys.filter(key => key !== keyToRemove));
  };

  const validateApiKey = (key: string) => {
    // YouTube API keys format: AIzaSy[A-Za-z0-9_-]{33}
    const apiKeyPattern = /^AIzaSy[A-Za-z0-9_-]{33}$/;
    return apiKeyPattern.test(key) && key.length === 39;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const sortVideos = (videos: Video[], sortBy: string) => {
    return [...videos].sort((a, b) => {
      switch (sortBy) {
        case 'competitionScore':
          return b.competitionScore - a.competitionScore;
        case 'viewsToSubsRatio':
          return b.viewsToSubsRatio - a.viewsToSubsRatio;
        case 'viewCount':
          return b.viewCount - a.viewCount;
        case 'subscriberCount':
          return b.subscriberCount - a.subscriberCount;
        case 'engagementRate':
          return b.engagementRate - a.engagementRate;
        case 'channelAvgViewsPerMonth':
          return b.channelAvgViewsPerMonth - a.channelAvgViewsPerMonth;
        case 'channelVideoCount':
          return b.channelVideoCount - a.channelVideoCount;
        default:
          return b.competitionScore - a.competitionScore;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            🔍 NICHE RESEARCH
          </h1>
          <p className="text-lg text-gray-600">
            Find high-performing videos from smaller channels to discover untapped niches
          </p>
        </div>

        {/* API Key Management */}
        <Card className="p-4 mb-6 border-4 border-blue-500 bg-blue-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-blue-900">🔑 YouTube API Keys</h2>
              <p className="text-sm text-blue-700">
                {apiKeys.length > 0 ? `${apiKeys.length} key(s) configured` : 'No API keys configured'}
                {apiKeys.length > 1 && ' • Automatic failover enabled'}
              </p>
            </div>
            <Button
              onClick={() => setShowApiKeys(!showApiKeys)}
              variant="outline"
              size="sm"
              className="border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-100"
            >
              {showApiKeys ? '🔼 Hide Keys' : '🔽 Manage Keys'}
            </Button>
          </div>

          {showApiKeys && (
            <div className="space-y-4">
              {/* Add New API Key */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={newApiKey}
                      onChange={(e) => setNewApiKey(e.target.value)}
                      placeholder="Enter YouTube API key (AIzaSy...)"
                      className={`border-2 ${
                        newApiKey.trim() && !validateApiKey(newApiKey.trim()) 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-blue-600'
                      }`}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && validateApiKey(newApiKey.trim())) {
                          addApiKey();
                        }
                      }}
                    />
                    {newApiKey.trim() && !validateApiKey(newApiKey.trim()) && (
                      <p className="text-xs text-red-600 mt-1">
                        ❌ Invalid format. Expected: AIzaSy + 33 characters (letters, numbers, - or _)
                      </p>
                    )}
                    {newApiKey.trim() && validateApiKey(newApiKey.trim()) && (
                      <p className="text-xs text-green-600 mt-1">
                        ✅ Valid API key format
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={addApiKey}
                    disabled={!newApiKey.trim() || !validateApiKey(newApiKey.trim())}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold border-2 border-black"
                  >
                    ➕ Add Key
                  </Button>
                </div>
              </div>

              {/* API Key List */}
              {apiKeys.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-bold">Current API Keys:</Label>
                  {apiKeys.map((key, index) => (
                    <div key={key} className="flex items-center justify-between bg-white p-3 border-2 border-blue-300 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {key.substring(0, 10)}...{key.substring(key.length - 4)}
                        </code>
                        {index === 0 && <span className="text-xs bg-green-500 text-white px-2 py-1 rounded font-bold">PRIMARY</span>}
                      </div>
                      <Button
                        onClick={() => removeApiKey(key)}
                        variant="outline"
                        size="sm"
                        className="border-2 border-red-400 text-red-600 hover:bg-red-50 font-bold"
                      >
                        🗑️ Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Help Text for Empty State */}
              {apiKeys.length === 0 && (
                <div className="bg-blue-50 border-2 border-blue-400 p-3 rounded">
                  <p className="text-sm font-bold text-blue-800 mb-1">ℹ️ No API Keys Configured</p>
                  <p className="text-xs text-blue-700">Add your YouTube Data API v3 keys above to start searching. Keys are saved securely in your browser.</p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Search Form */}
        <Card className="p-6 mb-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {/* Main Search Row */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="🔍 Enter keyword (e.g., 'horror') or leave empty for random niche discovery"
                className="border-2 border-black text-lg py-3 font-medium"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                disabled={loading || apiKeys.length === 0}
                size="lg"
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-8"
              >
                {loading ? '🔄 SEARCHING...' : keyword.trim() ? '🚀 FIND NICHES' : '🔍 DISCOVER'}
              </Button>
              
              {!keyword.trim() && (
                <Button
                  onClick={() => {
                    setKeyword(''); // Ensure it's empty for random discovery
                    handleSearch();
                  }}
                  disabled={loading || apiKeys.length === 0}
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6"
                >
                  🎲 RANDOM NICHES
                </Button>
              )}
            </div>
          </div>

          {/* Enhanced Search Options */}
          <div className="flex justify-center mb-6">
            <div>
              <Label className="text-sm font-bold mb-2 block">📅 Time Filter (Last N Days)</Label>
              <div className="flex gap-2">
                {[7, 14, 30, 90].map(days => (
                  <Button
                    key={days}
                    onClick={() => setPublishedAfterDays(days.toString())}
                    variant={publishedAfterDays === days.toString() ? 'default' : 'outline'}
                    size="sm"
                    className={`font-bold border-2 border-black text-xs ${
                      publishedAfterDays === days.toString()
                        ? 'bg-pink-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-black hover:bg-gray-50'
                    }`}
                  >
                    {days}d
                  </Button>
                ))}
                <Button
                  onClick={() => setPublishedAfterDays('')}
                  variant={!publishedAfterDays ? 'default' : 'outline'}
                  size="sm"
                  className={`font-bold border-2 border-black text-xs ${
                    !publishedAfterDays
                      ? 'bg-gray-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black hover:bg-gray-50'
                  }`}
                >
                  All
                </Button>
              </div>
              <p className="text-xs text-center text-gray-600 mt-1">🔗 Related terms automatically included</p>
            </div>
          </div>

          {/* Content Type Toggle */}
          <div className="mb-6">
            <Label className="text-sm font-bold mb-3 block">📺 Content Type</Label>
            <div className="flex gap-2">
              <Button
                onClick={() => setVideoDuration('any')}
                variant={videoDuration === 'any' ? 'default' : 'outline'}
                className={`font-bold border-2 border-black ${
                  videoDuration === 'any' 
                    ? 'bg-blue-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                🎬 All Videos
              </Button>
              <Button
                onClick={() => setVideoDuration('short')}
                variant={videoDuration === 'short' ? 'default' : 'outline'}
                className={`font-bold border-2 border-black ${
                  videoDuration === 'short' 
                    ? 'bg-red-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                📱 Shorts (≤3min)
              </Button>
              <Button
                onClick={() => setVideoDuration('long')}
                variant={videoDuration === 'long' ? 'default' : 'outline'}
                className={`font-bold border-2 border-black ${
                  videoDuration === 'long' 
                    ? 'bg-green-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                🎥 Long-form (3min+)
              </Button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label className="text-sm font-bold mb-2 block">👀 Minimum Views</Label>
              <div className="flex gap-2">
                {[1000, 5000, 10000, 50000].map(value => (
                  <Button
                    key={value}
                    onClick={() => setMinViews(value)}
                    variant={minViews === value ? 'default' : 'outline'}
                    size="sm"
                    className={`font-bold border-2 border-black text-xs ${
                      minViews === value 
                        ? 'bg-yellow-500 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                        : 'bg-white text-black hover:bg-gray-50'
                    }`}
                  >
                    {value >= 1000 ? `${value/1000}K+` : `${value}+`}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-bold mb-2 block">👥 Max Subscribers (Low Competition)</Label>
              <div className="flex gap-1 flex-wrap">
                {[500, 1000, 5000, 10000, 50000, 100000].map(value => (
                  <Button
                    key={value}
                    onClick={() => setMaxSubscribers(value)}
                    variant={maxSubscribers === value ? 'default' : 'outline'}
                    size="sm"
                    className={`font-bold border-2 border-black text-xs ${
                      maxSubscribers === value 
                        ? 'bg-orange-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                        : 'bg-white text-black hover:bg-gray-50'
                    }`}
                  >
                    {value >= 1000 ? `<${value/1000}K` : `<${value}`}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-bold mb-2 block">🎯 Sort Results By</Label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-2 border-black px-3 py-2 font-bold w-full bg-white"
              >
                <option value="competitionScore">🏆 Best Opportunities</option>
                <option value="viewsToSubsRatio">📈 Views/Subs Ratio</option>
                <option value="viewCount">👀 Most Views</option>
                <option value="engagementRate">💬 Highest Engagement</option>
                <option value="subscriberCount">👥 Most Subscribers</option>
                <option value="channelVideoCount">📹 Most Videos</option>
              </select>
            </div>
          </div>

          {/* Language & Advanced Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="excludeHindi"
                  checked={excludeHindi}
                  onChange={(e) => setExcludeHindi(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="excludeHindi" className="text-sm font-bold">
                  🚫 Hide Hindi/Indian Content
                </Label>
              </div>
              
              <Button
                onClick={clearSavedSettings}
                variant="outline"
                size="sm"
                className="border-2 border-red-400 text-red-600 font-bold hover:bg-red-50"
              >
                🗑️ Reset All
              </Button>
            </div>
            
            <Button
              onClick={() => setShowAdvanced(!showAdvanced)}
              variant="outline"
              size="sm"
              className="border-2 border-gray-400 font-bold"
            >
              {showAdvanced ? '🔼 Hide Advanced' : '🔽 More Filters'}
            </Button>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="border-t-2 border-gray-300 pt-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">📊 View Range</h3>
                  <div>
                    <Label className="text-sm font-bold">Max Views</Label>
                    <Input
                      type="number"
                      value={maxViews}
                      onChange={(e) => setMaxViews(e.target.value)}
                      placeholder="No limit"
                      className="border-2 border-black mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-lg">👥 Subscriber Range</h3>
                  <div>
                    <Label className="text-sm font-bold">Min Subscribers</Label>
                    <Input
                      type="number"
                      value={minSubscribers}
                      onChange={(e) => setMinSubscribers(e.target.value)}
                      placeholder="No minimum"
                      className="border-2 border-black mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-lg">📹 Channel Activity</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-sm font-bold">Min Videos</Label>
                      <Input
                        type="number"
                        value={minVideos}
                        onChange={(e) => setMinVideos(e.target.value)}
                        placeholder="Any"
                        className="border-2 border-black mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-bold">Max Videos</Label>
                      <Input
                        type="number"
                        value={maxVideos}
                        onChange={(e) => setMaxVideos(e.target.value)}
                        placeholder="Any"
                        className="border-2 border-black mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 lg:col-span-2">
                  <h3 className="font-bold text-lg">💬 Engagement Range (%)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-bold">Min Engagement</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={minEngagement}
                        onChange={(e) => setMinEngagement(e.target.value)}
                        placeholder="No minimum"
                        className="border-2 border-black mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-bold">Max Engagement</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={maxEngagement}
                        onChange={(e) => setMaxEngagement(e.target.value)}
                        placeholder="No maximum"
                        className="border-2 border-black mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="p-4 mb-8 border-4 border-red-500 bg-red-50">
            <p className="text-red-700 font-bold">❌ {error}</p>
          </Card>
        )}

        {/* Results Summary */}
        {results && (
          <Card className="p-6 mb-8 border-4 border-green-500 bg-green-50">
            <h2 className="text-2xl font-black mb-4">📊 SEARCH SUMMARY</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-bold text-gray-600">TOTAL RESULTS</p>
                <p className="text-2xl font-black">{results.totalResults}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-600">AVG VIEWS</p>
                <p className="text-2xl font-black">{formatNumber(results.summary.averageViews)}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-600">AVG SUBSCRIBERS</p>
                <p className="text-2xl font-black">{formatNumber(results.summary.averageSubscribers)}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-600">AVG ENGAGEMENT</p>
                <p className="text-2xl font-black">{results.summary.averageEngagement}%</p>
              </div>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4 border-2 border-gray-300">
                <Skeleton className="w-full h-40 mb-4" />
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-3/4 h-4" />
              </Card>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {results && results.videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortVideos(results.videos, sortBy).map((video, index) => (
              <Card key={video.id} className="p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                {/* Opportunity Badge */}
                {index < 3 && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 border-2 border-black px-2 py-1 text-xs font-black rotate-12">
                    🔥 TOP {index + 1}
                  </div>
                )}
                
                {/* Thumbnail */}
                <div className="relative mb-4">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover border-2 border-black"
                  />
                  <div className="absolute bottom-2 right-2 bg-black text-white px-2 py-1 text-xs font-bold">
                    {formatNumber(video.viewCount)} views
                  </div>
                  <div className={`absolute bottom-2 left-2 text-white px-2 py-1 text-xs font-bold rounded ${
                    video.durationCategory === 'short' ? 'bg-red-500' : 
                    video.durationCategory === 'medium' ? 'bg-blue-500' : 'bg-green-500'
                  }`}>
                    {video.durationCategory === 'short' ? '📱 SHORT' : 
                     video.durationCategory === 'medium' ? '📺 MED' : '🎥 LONG'} • {video.durationFormatted}
                  </div>
                </div>

                {/* Video Info */}
                <div className="space-y-2">
                  <h3 className="font-bold text-sm line-clamp-2">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-600">
                      {video.channelTitle}
                    </span>
                    <span className="bg-gray-200 px-2 py-1 rounded font-bold">
                      {formatNumber(video.subscriberCount)} subs
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                    <div>
                      <p className="font-bold text-gray-600">LIKES</p>
                      <p className="font-black">{formatNumber(video.likeCount)}</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-600">COMMENTS</p>
                      <p className="font-black">{formatNumber(video.commentCount)}</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-600">ENGAGEMENT</p>
                      <p className="font-black">{video.engagementRate.toFixed(2)}%</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-2 border-2 border-blue-300 text-xs mb-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-bold text-blue-700">CHANNEL VIDEOS</p>
                        <p className="font-black">{formatNumber(video.channelVideoCount)}</p>
                      </div>
                      <div>
                        <p className="font-bold text-blue-700">MONTHS ACTIVE</p>
                        <p className="font-black">{video.channelMonthsActive}</p>
                      </div>
                      <div>
                        <p className="font-bold text-blue-700">AVG VIEWS/MONTH</p>
                        <p className="font-black">{formatNumber(video.channelAvgViewsPerMonth)}</p>
                      </div>
                      <div>
                        <p className="font-bold text-blue-700">VIDS/MONTH</p>
                        <p className="font-black">{video.channelAvgVideosPerMonth.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-100 p-2 border-2 border-green-500 text-xs">
                    <div className="grid grid-cols-2 gap-1">
                      <div>
                        <p className="font-bold text-green-700">🎯 COMPETITION SCORE</p>
                        <p className="font-black">{video.competitionScore.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="font-bold text-green-700">VIEWS/SUBS RATIO</p>
                        <p className="font-black">{video.viewsToSubsRatio.toFixed(2)}</p>
                      </div>
                    </div>
                    <p className="text-green-600 mt-1">
                      Published: {formatDate(video.publishedAt)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open(video.url, '_blank')}
                      size="sm"
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold border-2 border-black"
                    >
                      📺 WATCH
                    </Button>
                    <Button
                      onClick={() => window.open(video.channelUrl, '_blank')}
                      size="sm"
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold border-2 border-black"
                    >
                      📍 CHANNEL
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {results && results.videos.length === 0 && (
          <Card className="p-8 text-center border-4 border-gray-300">
            <p className="text-2xl font-black text-gray-500 mb-2">😔 NO RESULTS</p>
            <p className="text-gray-600">
              Try adjusting your filters or search for a different keyword
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
