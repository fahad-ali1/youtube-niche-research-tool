import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BarChart, Loader2, RefreshCw } from 'lucide-react';
import { VideoStatistics } from '@/types';

interface WordFrequency {
  word: string;
  count: number;
}

interface WordFrequencyResponse {
  totalVideos: number;
  totalVideosWithTitles: number;
  wordFrequency: WordFrequency[];
}

interface WordFrequencyDialogProps {
  currentVideos: VideoStatistics[];
}

export function WordFrequencyDialog({ currentVideos }: WordFrequencyDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<WordFrequencyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Analyze the currently loaded videos
  const analyzeCurrentVideos = () => {
    setLoading(true);
    setError(null);
    
    try {
      // Filter out videos without titles
      const videosWithTitles = currentVideos.filter(v => v.title);
      const totalVideos = currentVideos.length;
      const totalVideosWithTitles = videosWithTitles.length;
      
      // Process titles to get word frequency
      const wordFrequency: Record<string, number> = {};
      
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
      
      videosWithTitles.forEach(video => {
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
        .map(([word, count]) => ({ word, count }));
      
      setData({
        totalVideos,
        totalVideosWithTitles,
        wordFrequency: sortedWords
      });
    } catch (err) {
      console.error('Error analyzing word frequency:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Analyze videos when dialog is opened
  useEffect(() => {
    if (open) {
      analyzeCurrentVideos();
    }
  }, [open, currentVideos]);

  // Reset state when dialog is closed
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setData(null);
    }
  };

  // Calculate the maximum count for scaling
  const maxCount = data?.wordFrequency?.[0]?.count || 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="border border-gray-300 hover:border-[#587aff] hover:text-[#587aff] cursor-pointer"
        >
          <BarChart className="h-4 w-4 mr-1" />
          Analyze
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col border-2 border-black shadow-[4px_4px_0px_0px_rgba(88,122,255,0.8)]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl">Word Frequency Analysis</DialogTitle>
          <DialogDescription>
            Most common words in the currently loaded video titles
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#587aff] mb-2" />
                <p className="text-gray-600">Analyzing video titles...</p>
              </div>
            </div>
          ) : error ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center text-red-500 border border-red-300 rounded-md p-4 bg-red-50">
                <p className="font-semibold">Error analyzing titles</p>
                <p>{error}</p>
              </div>
            </div>
          ) : data ? (
            <>
              <div className="mb-4 border-b border-gray-200 pb-2 text-center">
                <p className="text-sm text-gray-600">
                  Analyzed {data.totalVideosWithTitles} of {data.totalVideos} visible videos
                </p>
                
                <div className="flex items-center justify-center mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={analyzeCurrentVideos}
                    className="border border-gray-300 hover:border-[#587aff] hover:text-[#587aff]"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" /> Refresh
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {data.wordFrequency.length > 0 ? (
                  data.wordFrequency.map((item, index) => (
                    <div 
                      key={item.word}
                      className="flex items-center border border-gray-200 rounded-md p-2 hover:bg-gray-50"
                    >
                      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#587aff] bg-opacity-10 text-[#587aff] font-medium text-xs">
                        {index + 1}
                      </div>
                      <div className="ml-2 flex-1">
                        <div className="font-medium text-sm">{item.word}</div>
                        <div className="flex items-center">
                          <div className="h-2 bg-[#587aff] rounded-full" style={{ width: `${(item.count / maxCount) * 100}%` }} />
                          <span className="ml-2 text-xs text-gray-600">{item.count}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    No common words found in the current videos
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
} 