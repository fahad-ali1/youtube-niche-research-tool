import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

// Words to exclude from analysis (common stop words)
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'from',
  'in', 'of', 'with', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between',
  'out', 'during', 'without', 'before', 'under', 'around', 'among', 'is', 'are', 'was',
  'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'i', 'you',
  'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'its', 'our', 'their',
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'will', 'would',
  'shall', 'should', 'may', 'might', 'can', 'could', 'me', 'him', 'them', 'how'
]);

export async function GET(request: NextRequest) {
  try {
    // Get the limit parameter from the URL, default to 100 if not provided
    const { searchParams } = request.nextUrl;
    const limitParam = searchParams.get('limit');
    
    // "all" means no limit, otherwise use the provided number or default to 100
    const limit = limitParam === 'all' ? undefined : 
                  limitParam ? parseInt(limitParam, 10) : 100;
    
    // Fetch all videos with titles from database
    const videos = await prisma.video_statistics.findMany({
      select: {
        title: true
      },
      where: {
        title: {
          not: null
        }
      }
    });
    
    // Process titles to get word frequency
    const wordFrequency: Record<string, number> = {};
    
    videos.forEach(video => {
      if (!video.title) return;
      
      // Convert to lowercase, remove special characters, and split into words
      const words = video.title
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, '') // Remove non-alphanumeric characters (supporting Unicode)
        .split(/\s+/); // Split by whitespace
      
      // Count word frequency (excluding stop words and short words)
      words.forEach(word => {
        if (word.length < 3 || STOP_WORDS.has(word)) return;
        
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      });
    });
    
    // Sort words by frequency (descending)
    const sortedWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit) // Limit to requested number or return all if limit is undefined
      .map(([word, count]) => ({ word, count }));
    
    const result = {
      totalVideos: videos.length,
      totalVideosWithTitles: videos.filter(v => v.title !== null).length,
      wordFrequency: sortedWords
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing word frequency:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze word frequency',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 