import { NextRequest, NextResponse } from 'next/server';

// Helper function to make YouTube API calls with failover
async function makeYouTubeApiCall(url: string, apiKeys: string[], retryCount = 0): Promise<any> {
  const maxRetries = apiKeys.length;
  
  if (retryCount >= maxRetries) {
    throw new Error('All YouTube API keys have exceeded their quota');
  }
  
  const apiKey = apiKeys[retryCount];
  const urlWithKey = url.replace(/key=PLACEHOLDER/, `key=${apiKey}`);
  
  console.log(`Trying API key ${retryCount + 1}/${maxRetries}: ${apiKey.substring(0, 10)}...`);
  
  const response = await fetch(urlWithKey);
  
  if (response.status === 403) {
    const errorData = await response.json();
    if (errorData.error?.errors?.[0]?.reason === 'quotaExceeded') {
      console.log(`API key ${apiKey.substring(0, 10)}... quota exceeded, trying next key...`);
      return makeYouTubeApiCall(url, apiKeys, retryCount + 1);
    }
  }
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('YouTube API error:', response.status, errorText);
    throw new Error(`YouTube API error: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  return response.json();
}

// Helper function to parse YouTube duration format (PT#M#S) to seconds
function parseDuration(duration: string | undefined): number {
  if (!duration || typeof duration !== 'string') return 0;
  
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  return hours * 3600 + minutes * 60 + seconds;
}

// Helper function to format duration in readable format
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  return `${Math.floor(seconds / 3600)}:${Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}

// Helper function to categorize video duration
function categorizeDuration(seconds: number): 'short' | 'medium' | 'long' {
  if (seconds <= 180) return 'short'; // Shorts are up to 3 minutes (180 seconds)
  if (seconds < 1200) return 'medium'; // Medium: 3-20 minutes
  return 'long'; // Long: 20+ minutes
}

// Helper function to get related terms using multiple smart methods
async function getRelatedTerms(keyword: string, apiKeys: string[]): Promise<string[]> {
  const relatedTerms: Set<string> = new Set();
  
  try {
    // Method 1: Use YouTube's search suggestions API
    const suggestUrl = `https://www.googleapis.com/youtube/v3/search?key=PLACEHOLDER&q=${encodeURIComponent(keyword)}&part=snippet&type=video&maxResults=20&order=relevance`;
    const searchData = await makeYouTubeApiCall(suggestUrl, apiKeys);
    
    if (searchData.items) {
      // Extract keywords from video titles and descriptions
      searchData.items.forEach((video: any) => {
        const text = `${video.snippet.title} ${video.snippet.description}`.toLowerCase();
        
        // Extract hashtags
        const hashtags = text.match(/#\w+/g);
        if (hashtags) {
          hashtags.forEach(tag => {
            const cleanTag = tag.replace('#', '');
            if (cleanTag.length > 2 && cleanTag !== keyword.toLowerCase()) {
              relatedTerms.add(cleanTag);
            }
          });
        }
        
        // Extract common keywords (simple word frequency)
        const words = text.split(/\s+/).filter(word => 
          word.length > 3 && 
          !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'will', 'your', 'like', 'more', 'time', 'just', 'make', 'some', 'what', 'when', 'where'].includes(word) &&
          word !== keyword.toLowerCase()
        );
        
        // Count word frequency
        const wordCount: Record<string, number> = {};
        words.forEach(word => {
          wordCount[word] = (wordCount[word] || 0) + 1;
        });
        
        // Add most frequent words
        Object.entries(wordCount)
          .filter(([word, count]) => count >= 2) // Appears at least twice
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .forEach(([word]) => relatedTerms.add(word));
      });
    }
  } catch (error) {
    console.error('Error getting smart related terms:', error);
  }
  
  // Method 2: Fallback to curated high-quality terms for common niches
  const fallbackTermsMap: Record<string, string[]> = {
    'horror': ['scary', 'creepy', 'terrifying', 'spooky', 'paranormal', 'nightmare'],
    'cooking': ['recipe', 'food', 'chef', 'baking', 'kitchen', 'meal'],
    'fitness': ['workout', 'exercise', 'gym', 'training', 'health', 'muscle'],
    'gaming': ['gameplay', 'gamer', 'esports', 'games', 'streaming', 'console'],
    'beauty': ['makeup', 'skincare', 'tutorial', 'fashion', 'style', 'cosmetics'],
    'tech': ['technology', 'review', 'unboxing', 'gadgets', 'smartphone', 'software'],
    'music': ['song', 'cover', 'beats', 'artist', 'instrumental', 'melody'],
    'travel': ['vacation', 'adventure', 'destination', 'explore', 'journey', 'trip'],
    'education': ['tutorial', 'lesson', 'learning', 'guide', 'tips', 'course'],
    'comedy': ['funny', 'humor', 'jokes', 'hilarious', 'entertainment', 'meme']
  };
  
  const lowerKeyword = keyword.toLowerCase();
  for (const [key, terms] of Object.entries(fallbackTermsMap)) {
    if (lowerKeyword.includes(key) || key.includes(lowerKeyword)) {
      terms.forEach(term => relatedTerms.add(term));
      break;
    }
  }
  
  // Convert to array and limit to top 5 terms
  const result = Array.from(relatedTerms).slice(0, 5);
  console.log(`Smart related terms for "${keyword}":`, result);
  
  return result;
}

// Helper function to get random automation-friendly niche keywords
function getRandomNicheKeywords(count: number = 4): string[] {
  const automationFriendlyNiches = [
    // Story-Based Content (Perfect for AI/Automation)
    'horror stories', 'scary stories', 'creepy stories', 'ghost stories', 'paranormal stories', 'nightmare stories',
    'sleep stories', 'bedtime stories', 'relaxing stories', 'calming stories', 'meditation stories',
    'true crime stories', 'mystery stories', 'unsolved mysteries', 'crime documentaries',
    'history stories', 'historical events', 'ancient history', 'medieval history', 'war stories',
    'science stories', 'space stories', 'ocean mysteries', 'nature documentaries', 'animal stories',
    'mythology stories', 'folklore tales', 'urban legends', 'conspiracy theories', 'unexplained phenomena',
    
    // Educational Narrative Content
    'how humans discovered', 'how humans invented', 'how humans survived', 'how humans built',
    'what if humans', 'before humans existed', 'human evolution', 'ancient civilizations',
    'lost civilizations', 'forgotten history', 'historical mysteries', 'ancient technology',
    'historical figures', 'famous inventors', 'explorers', 'scientists throughout history',
    
    // Sleep & Relaxation Content
    'sleep to history', 'sleep to science', 'sleep to stories', 'boring history for sleep',
    'rain sounds', 'nature sounds', 'ambient sounds', 'white noise', 'brown noise',
    'meditation music', 'relaxing music', 'study music', 'focus music', 'calm music',
    
    // Fact-Based Automation Content
    'amazing facts', 'weird facts', 'unknown facts', 'science facts', 'history facts',
    'psychology facts', 'animal facts', 'space facts', 'ocean facts', 'body facts',
    'mind blowing facts', 'disturbing facts', 'creepy facts', 'interesting facts',
    
    // List-Based Content (Easy to Automate)
    'top 10 mysteries', 'top 10 discoveries', 'top 10 inventions', 'top 10 civilizations',
    'strangest discoveries', 'weirdest animals', 'scariest places', 'most haunted places',
    'abandoned places', 'lost cities', 'ancient artifacts', 'unexplained discoveries',
    
    // Voice-Over Friendly Niches
    'documentary', 'explained', 'breakdown', 'analysis', 'deep dive', 'investigation',
    'theories', 'predictions', 'what happened to', 'the truth about', 'secrets of',
    'hidden history', 'forbidden knowledge', 'classified information', 'cover ups',
    
    // Trending Automation Formats
    'reddit stories', 'reddit horror', 'reddit mysteries', 'reddit confessions',
    'text to speech', 'ai generated', 'automated stories', 'generated content',
    'compilation', 'collection', 'series', 'episodes', 'chapters',
    
    // Specific Automation-Friendly Topics
    'sleep paralysis stories', 'lucid dreaming', 'dream analysis', 'nightmare experiences',
    'time travel theories', 'parallel universe', 'simulation theory', 'mandela effect',
    'cryptids', 'bigfoot', 'ufo sightings', 'alien encounters', 'government secrets',
    'ancient aliens', 'lost technology', 'forbidden archaeology', 'suppressed history'
  ];
  
  // Shuffle and return random keywords
  const shuffled = [...automationFriendlyNiches].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper function to detect Hindi/Indian content
function isHindiOrIndianContent(title: string, channelTitle: string, description?: string): boolean {
  const text = `${title} ${channelTitle} ${description || ''}`.toLowerCase();
  
  // Hindi/Devanagari script detection
  const hindiPattern = /[\u0900-\u097F]/;
  if (hindiPattern.test(text)) return true;
  
  // Common Hindi/Indian keywords and phrases
  const indianKeywords = [
    'hindi', 'bollywood', 'bharat', 'india', 'indian', 'desi', 'punjabi', 'tamil', 'telugu', 'bengali', 'gujarati', 'marathi',
    'bhajan', 'mandir', 'puja', 'ganesh', 'krishna', 'rama', 'shiva', 'durga', 'diwali', 'holi',
    'chai', 'masala', 'curry', 'roti', 'naan', 'biryani', 'samosa', 'daal',
    'mumbai', 'delhi', 'bangalore', 'kolkata', 'chennai', 'hyderabad', 'pune', 'ahmedabad',
    'rupee', 'crore', 'lakh', 'paisa',
    'bhai', 'didi', 'ji', 'sahab', 'aunty', 'uncle',
    'भारत', 'हिंदी', 'इंडिया'
  ];
  
  // Check for multiple Indian keywords (more strict filtering)
  const foundKeywords = indianKeywords.filter(keyword => text.includes(keyword));
  if (foundKeywords.length >= 2) return true;
  
  // Check for single strong indicators
  const strongIndicators = ['hindi', 'bollywood', 'bharat'];
  if (strongIndicators.some(indicator => text.includes(indicator))) return true;
  
  return false;
}

interface SearchFilters {
  minViews: number;
  maxViews?: number;
  minSubscribers?: number;
  maxSubscribers: number;
  maxResults: number;
  publishedAfter?: string; // ISO date string
  minVideosUploaded?: number;
  maxVideosUploaded?: number;
  minEngagementRate?: number;
  maxEngagementRate?: number;
  videoDuration?: 'short' | 'medium' | 'long' | 'any'; // YouTube duration filter
  excludeHindi?: boolean; // Exclude Hindi/Indian content
  publishedAfterDays?: number; // Filter by videos published in the last N days
  useRelatedTerms?: boolean; // Whether to search for related terms
}

async function searchKeywordVideos(keyword: string, filters: SearchFilters, apiKeys: string[]) {
  // Build search terms list
  let searchTerms = [keyword];
  
  // Add related terms if enabled and keyword exists
  if (keyword && filters.useRelatedTerms) {
    const relatedTerms = await getRelatedTerms(keyword, apiKeys);
    if (relatedTerms.length > 0) {
      // Add top 3 related terms to avoid too many API calls
      searchTerms = searchTerms.concat(relatedTerms.slice(0, 3));
      console.log(`Expanded search: "${keyword}" + related terms:`, relatedTerms.slice(0, 3));
    }
  }
  
  // For no-keyword searches, use random niche keywords for discovery
  if (!keyword) {
    const randomNiches = getRandomNicheKeywords(4);
    searchTerms = randomNiches;
    console.log('Discovery mode - using random niches:', randomNiches);
  }

  // Build time-based strategies
  let searchStrategies = [];
  
  if (filters.publishedAfterDays) {
    const publishedAfter = new Date(Date.now() - filters.publishedAfterDays * 24 * 60 * 60 * 1000).toISOString();
    searchStrategies = [
      { order: 'date', publishedAfter }, // Most recent first
      { order: 'viewCount', publishedAfter }, // Most viewed in timeframe
      { order: 'relevance', publishedAfter }, // Most relevant in timeframe
    ];
  } else {
    // Default strategies for broader search
    searchStrategies = [
      { order: 'relevance', publishedAfter: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }, // Recent relevant
      { order: 'date', publishedAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() }, // Very recent
      { order: 'relevance', publishedAfter: undefined }, // All time relevant
    ];
  }
  
  let allSearchResults: any[] = [];
  
  // Search for each term with each strategy
  for (const searchTerm of searchTerms) {
    for (const strategy of searchStrategies) {
      try {
        // Build search URL with duration filter (placeholder key will be replaced)
        let searchUrl = `https://www.googleapis.com/youtube/v3/search?key=PLACEHOLDER&q=${encodeURIComponent(searchTerm)}&part=snippet&type=video&order=${strategy.order}&maxResults=${Math.floor(filters.maxResults / (searchTerms.length * searchStrategies.length))}`;
        
        if (strategy.publishedAfter) {
          searchUrl += `&publishedAfter=${strategy.publishedAfter}`;
        }
        
        // Add duration filter if specified
        if (filters.videoDuration && filters.videoDuration !== 'any') {
          // YouTube API uses different duration values
          let ytDuration = filters.videoDuration;
          if (filters.videoDuration === 'long') {
            ytDuration = 'long'; // 20+ minutes in YouTube API
          } else if (filters.videoDuration === 'medium') {
            ytDuration = 'medium'; // 4-20 minutes in YouTube API  
          } else if (filters.videoDuration === 'short') {
            ytDuration = 'short'; // Under 4 minutes in YouTube API
          }
          searchUrl += `&videoDuration=${ytDuration}`;
        }
        
        const searchData = await makeYouTubeApiCall(searchUrl, apiKeys);
        
        if (searchData.items && searchData.items.length > 0) {
          allSearchResults = allSearchResults.concat(searchData.items);
        }
      } catch (error) {
        console.error(`Search failed for term "${searchTerm}" with strategy ${strategy.order}:`, error);
        continue; // Try next strategy/term
      }
    }
  }
  
  console.log('Total search results from all strategies:', allSearchResults.length);
  
  if (allSearchResults.length === 0) {
    console.log('No search results returned from YouTube API');
    return [];
  }
  
  // Remove duplicates based on video ID
  const uniqueResults = allSearchResults.filter((item, index, self) => 
    index === self.findIndex(t => t.id.videoId === item.id.videoId)
  );
  
  console.log('Unique search results after deduplication:', uniqueResults.length);
  
  // Get video IDs for stats lookup from unique results
  const videoIds = uniqueResults.map((item: any) => item.id.videoId).join(',');
  
  // Get detailed stats and content details for all videos
  const statsUrl = `https://www.googleapis.com/youtube/v3/videos?key=PLACEHOLDER&id=${videoIds}&part=statistics,snippet,contentDetails`;
  const statsData = await makeYouTubeApiCall(statsUrl, apiKeys);
  
  // Get unique channel IDs to fetch detailed channel info
  const channelIds = [...new Set(statsData.items.map((video: any) => video.snippet.channelId))];
  const channelUrl = `https://www.googleapis.com/youtube/v3/channels?key=PLACEHOLDER&id=${channelIds.join(',')}&part=statistics,snippet`;
  const channelData = await makeYouTubeApiCall(channelUrl, apiKeys);
  
  // Create a map of channel stats
  const channelStats: Record<string, any> = {};
  channelData.items.forEach((channel: any) => {
    const publishedAt = new Date(channel.snippet.publishedAt);
    const monthsActive = Math.max(1, Math.floor((Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24 * 30.44))); // Average days per month
    const totalVideos = parseInt(channel.statistics.videoCount, 10);
    const totalViews = parseInt(channel.statistics.viewCount, 10);
    const subscriberCount = parseInt(channel.statistics.subscriberCount, 10);
    
    console.log(`Channel: ${channel.snippet.title} - Subs: ${subscriberCount}, Videos: ${totalVideos}, Views: ${totalViews}`);
    
    channelStats[channel.id] = {
      subscriberCount,
      videoCount: totalVideos,
      viewCount: totalViews,
      publishedAt: channel.snippet.publishedAt,
      monthsActive,
      avgViewsPerMonth: totalViews / monthsActive,
      avgVideosPerMonth: totalVideos / monthsActive,
      title: channel.snippet.title,
      description: channel.snippet.description
    };
  });
  
  // Filter and format results
  const allVideos = statsData.items.map((video: any) => {
    const channelInfo = channelStats[video.snippet.channelId] || {};
    const viewCount = parseInt(video.statistics.viewCount, 10);
    const likeCount = parseInt(video.statistics.likeCount || '0', 10);
    const commentCount = parseInt(video.statistics.commentCount || '0', 10);
    const engagementRate = viewCount > 0 ? ((likeCount + commentCount) / viewCount) * 100 : 0;
    
    // Parse video duration with safety checks
    const durationSeconds = parseDuration(video.contentDetails?.duration);
    const durationFormatted = formatDuration(durationSeconds);
    const durationCategory = categorizeDuration(durationSeconds);
    
    return {
      id: video.id,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      channelId: video.snippet.channelId,
      thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default.url,
      publishedAt: video.snippet.publishedAt,
      viewCount,
      likeCount,
      commentCount,
      engagementRate,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      channelUrl: `https://www.youtube.com/channel/${video.snippet.channelId}`,
      
      // Duration metrics
      durationSeconds,
      durationFormatted,
      durationCategory,
      
      // Channel metrics
      subscriberCount: channelInfo.subscriberCount || 0,
      channelVideoCount: channelInfo.videoCount || 0,
      channelViewCount: channelInfo.viewCount || 0,
      channelMonthsActive: channelInfo.monthsActive || 0,
      channelAvgViewsPerMonth: channelInfo.avgViewsPerMonth || 0,
      channelAvgVideosPerMonth: channelInfo.avgVideosPerMonth || 0,
      channelCreatedAt: channelInfo.publishedAt,
      
      // Opportunity metrics
      viewsToSubsRatio: channelInfo.subscriberCount > 0 ? viewCount / channelInfo.subscriberCount : 0,
      competitionScore: channelInfo.subscriberCount > 0 ? (viewCount / channelInfo.subscriberCount) / (channelInfo.videoCount / Math.max(channelInfo.monthsActive, 1)) : 0
    };
  });

  console.log('Total videos before filtering:', allVideos.length);
  console.log('Filter criteria - minViews:', filters.minViews, 'maxSubscribers:', filters.maxSubscribers);
  
  const filteredVideos = allVideos
    .filter((video: any) => {
      const passesMinViews = video.viewCount >= filters.minViews;
      const passesMaxViews = !filters.maxViews || video.viewCount <= filters.maxViews;
      const passesMinSubs = !filters.minSubscribers || video.subscriberCount >= filters.minSubscribers;
      const passesMaxSubs = video.subscriberCount <= filters.maxSubscribers;
      const passesMinVideos = !filters.minVideosUploaded || video.channelVideoCount >= filters.minVideosUploaded;
      const passesMaxVideos = !filters.maxVideosUploaded || video.channelVideoCount <= filters.maxVideosUploaded;
      const passesMinEngagement = !filters.minEngagementRate || video.engagementRate >= filters.minEngagementRate;
      const passesMaxEngagement = !filters.maxEngagementRate || video.engagementRate <= filters.maxEngagementRate;
      
      // Duration filtering - client-side filtering to ensure accuracy
      const passesDurationFilter = !filters.videoDuration || filters.videoDuration === 'any' || 
        (filters.videoDuration === 'short' && video.durationSeconds <= 180) ||
        (filters.videoDuration === 'medium' && video.durationSeconds > 180 && video.durationSeconds < 1200) ||
        (filters.videoDuration === 'long' && video.durationSeconds >= 180); // Long-form is 3+ minutes
      
      // Language filtering - exclude Hindi/Indian content if requested
      const passesLanguageFilter = !filters.excludeHindi || !isHindiOrIndianContent(video.title, video.channelTitle);
      
      console.log(`Video "${video.title.substring(0, 30)}" - Duration: ${video.durationSeconds}s (${video.durationCategory}), Filter: ${filters.videoDuration}, Passes: ${passesDurationFilter}`);
      
      return passesMinViews && passesMaxViews && passesMinSubs && passesMaxSubs && 
             passesMinVideos && passesMaxVideos && passesMinEngagement && passesMaxEngagement &&
             passesDurationFilter && passesLanguageFilter;
    })
    .sort((a: any, b: any) => b.competitionScore - a.competitionScore); // Sort by competition score
  
  console.log('Videos after filtering:', filteredVideos.length);
  
  return filteredVideos;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword, filters = {}, apiKeys = [] } = body;
    
    console.log('Received search request:', { keyword, filters, apiKeysCount: apiKeys.length });
    
    if (!apiKeys || apiKeys.length === 0) {
      return NextResponse.json(
        { error: 'At least one YouTube API key is required' },
        { status: 400 }
      );
    }
    
    // Allow empty keyword for discovery mode
    const searchKeyword = keyword || '';
    
    // Default filters for niche research
    const searchFilters: SearchFilters = {
      minViews: filters.minViews || 10000, // At least 10K views to show it's performing
      maxViews: filters.maxViews,
      minSubscribers: filters.minSubscribers,
      maxSubscribers: filters.maxSubscribers || 100000, // Max 100K subs to find smaller channels
      maxResults: filters.maxResults || 50,
      publishedAfter: filters.publishedAfter, // Optional date filter
      minVideosUploaded: filters.minVideosUploaded,
      maxVideosUploaded: filters.maxVideosUploaded,
      minEngagementRate: filters.minEngagementRate,
      maxEngagementRate: filters.maxEngagementRate,
      videoDuration: filters.videoDuration,
      excludeHindi: filters.excludeHindi,
      publishedAfterDays: filters.publishedAfterDays,
      useRelatedTerms: filters.useRelatedTerms
    };
    
    const videos = await searchKeywordVideos(searchKeyword, searchFilters, apiKeys);
    
    return NextResponse.json({
      success: true,
      keyword,
      filters: searchFilters,
      totalResults: videos.length,
      videos: videos.slice(0, 20), // Return top 20 opportunities
      summary: {
        averageViews: videos.length > 0 ? Math.round(videos.reduce((sum: number, v: any) => sum + v.viewCount, 0) / videos.length) : 0,
        averageSubscribers: videos.length > 0 ? Math.round(videos.reduce((sum: number, v: any) => sum + v.subscriberCount, 0) / videos.length) : 0,
        averageEngagement: videos.length > 0 ? (videos.reduce((sum: number, v: any) => sum + v.engagementRate, 0) / videos.length).toFixed(2) : 0,
        topOpportunity: videos.length > 0 ? videos[0] : null
      }
    });
  } catch (error) {
    console.error('Error searching keyword videos:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search videos',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
