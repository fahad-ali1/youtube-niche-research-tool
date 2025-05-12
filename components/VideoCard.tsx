import Image from 'next/image';
import { format, formatDistanceToNow, differenceInHours } from 'date-fns';
import { VideoStatistics, Competitor } from '@/types';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar, Eye, MessageSquare, PlayCircle, ThumbsUp, Clock } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VideoCardProps {
  video: VideoStatistics & {
    isOutlier?: boolean;
    channelAvgViews?: number;
  };
  onChannelClick: (channelId: string) => void;
  competitors: Competitor[];
}

export function VideoCard({ video, onChannelClick, competitors }: VideoCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const {
    id,
    title,
    thumbnail,
    view_count,
    like_count,
    comment_count,
    publish_time,
    channel_id,
    isOutlier,
    channelAvgViews
  } = video;

  // Find the channel in competitors to get the title
  const channel = competitors.find(comp => comp.id === channel_id);
  const channelTitle = channel?.title || channel_id;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num);
  };

  // Get relative time (e.g., "2 days ago")
  const getRelativeTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Check if video is new (less than 72 hours old)
  const isNewVideo = () => {
    const publishDate = new Date(publish_time);
    const hoursSincePublished = differenceInHours(new Date(), publishDate);
    return hoursSincePublished <= 72;
  };

  // Construct YouTube video URL
  const videoUrl = `https://www.youtube.com/watch?v=${id}`;

  const handleChannelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChannelClick(channel_id);
  };

  const calculatePerformance = () => {
    if (channelAvgViews && channelAvgViews > 0) {
      const percentage = (view_count / channelAvgViews) * 100;
      return Math.round(percentage);
    }
    return null;
  };

  const performance = calculatePerformance();

  // Determine performance level to apply appropriate styling
  const getPerformanceStyle = () => {
    if (!performance || !channelAvgViews) return { color: 'text-gray-400', label: '' };
    
    if (performance >= 120) {
      return { color: 'text-green-600', label: 'High performer' };
    } else if (performance >= 80) {
      return { color: 'text-blue-600', label: 'Average' };
    } else if (performance >= 50) {
      return { color: 'text-amber-600', label: 'Below average' };
    } else if (performance >= 20) {
      return { color: 'text-orange-600', label: 'Poor performer' };
    } else {
      return { color: 'text-red-500', label: 'Very low' };
    }
  };

  const { color: performanceColor, label: performanceLabel } = getPerformanceStyle();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div 
          className={`
            flex flex-col bg-white border-2 border-black p-3 rounded-lg 
            shadow-[4px_4px_0px_0px_rgba(88,122,255,0.8)] 
            transform transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(88,122,255,1)]
            cursor-pointer relative
            ${isOutlier ? 'bg-yellow-50' : 'bg-white'}
          `}
        >
          {/* Performance indicator (for all videos) */}
          {channelAvgViews && performance && (
            <div className="flex items-center mb-2">
              <div className={`px-2 py-0.5 rounded-full mr-2 text-xs font-medium ${
                performance >= 120 ? 'bg-green-100 text-green-800' : 
                performance >= 80 ? 'bg-blue-100 text-blue-800' : 
                performance >= 50 ? 'bg-amber-100 text-amber-800' : 
                performance >= 20 ? 'bg-orange-100 text-orange-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {performance}% 
                {isOutlier && <span className="ml-1">⚡</span>}
              </div>
              <span className={`text-xs ${performanceColor} font-medium`}>
                {performance > 100 ? `+${performance - 100}%` : `${performance - 100}%`} vs avg
              </span>
              
              {/* New video indicator with tooltip */}
              {isNewVideo() && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-2 text-xs bg-blue-50 text-blue-600 px-1 py-0.5 rounded font-medium border border-blue-100">
                        new
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">New videos usually have lower percentages</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}
          
          {/* Thumbnail */}
          <div className="relative aspect-video w-full border border-gray-200 overflow-hidden rounded-md mb-2">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={title || 'Video thumbnail'}
                fill
                className="object-cover"
                quality={20}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-gray-400" />
              </div>
            )}
            {/* Overlay view count */}
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
              {formatNumber(view_count)} views
            </div>
          </div>
          
          <h3 className="font-medium text-sm line-clamp-2 mb-2">
            {title || 'Untitled Video'}
          </h3>
          
          <div className="flex justify-between items-end mt-auto">
            <button 
              onClick={handleChannelClick}
              className="self-start px-2 py-0.5 text-xs font-medium border border-gray-300 rounded-md hover:border-[#587aff] hover:text-[#587aff]"
            >
              {channelTitle}
            </button>
            
            {/* Relative time indicator */}
            <div className="text-xs text-gray-500 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {getRelativeTime(new Date(publish_time))}
            </div>
          </div>
        </div>
      </DialogTrigger>
      
      {/* Dialog for Full Details */}
      <DialogContent className="sm:max-w-[600px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(88,122,255,0.8)]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold line-clamp-2">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Thumbnail */}
          <div className="relative aspect-video w-full border border-gray-300 overflow-hidden rounded-md">
            {thumbnail ? (
              <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                <Image
                  src={thumbnail}
                  alt={title || 'Video thumbnail'}
                  fill
                  className="object-cover"
                  quality={20}
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-12 h-12 text-white" />
                </div>
              </a>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No thumbnail</span>
              </div>
            )}
          </div>
          
          {/* Channel */}
          <div className="flex items-center">
            <button 
              onClick={handleChannelClick}
              className="px-3 py-1 bg-[#587aff] bg-opacity-10 text-white font-medium text-sm border border-[#587aff] rounded-md hover:bg-opacity-20 cursor-pointer hover:scale-105 transition-all duration-200"
            >
              {channelTitle}
            </button>
            
            <a 
              href={videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-auto px-3 py-1 bg-black text-white text-sm rounded-md hover:bg-gray-800 flex items-center"
            >
              <PlayCircle className="w-4 h-4 mr-1" /> Watch on YouTube
            </a>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="flex items-center p-2 border border-gray-200 rounded-md">
              <Eye className="w-4 h-4 text-[#587aff] mr-2" />
              <div>
                <div className="text-sm font-medium">{formatNumber(view_count)}</div>
                <div className="text-xs text-gray-500">Views</div>
              </div>
            </div>
            
            <div className="flex items-center p-2 border border-gray-200 rounded-md">
              <ThumbsUp className="w-4 h-4 text-[#587aff] mr-2" />
              <div>
                <div className="text-sm font-medium">{formatNumber(like_count)}</div>
                <div className="text-xs text-gray-500">Likes</div>
              </div>
            </div>
            
            <div className="flex items-center p-2 border border-gray-200 rounded-md">
              <MessageSquare className="w-4 h-4 text-[#587aff] mr-2" />
              <div>
                <div className="text-sm font-medium">{formatNumber(comment_count)}</div>
                <div className="text-xs text-gray-500">Comments</div>
              </div>
            </div>
            
            <div className="flex items-center p-2 border border-gray-200 rounded-md">
              <Calendar className="w-4 h-4 text-[#587aff] mr-2" />
              <div>
                <div className="text-sm font-medium">{format(new Date(publish_time), 'MMM d, yyyy')}</div>
                <div className="text-xs text-gray-500">{getRelativeTime(new Date(publish_time))}</div>
              </div>
            </div>
          </div>
          
          {/* Performance Info (visible for all videos with available data) */}
          {channelAvgViews !== undefined && performance !== null && (
            <div className={`p-3 border rounded-md mt-4 ${
              performance >= 120 ? 'border-green-300 bg-green-50' : 
              performance >= 80 ? 'border-blue-300 bg-blue-50' : 
              performance >= 50 ? 'border-amber-300 bg-amber-50' : 
              performance >= 20 ? 'border-red-300 bg-red-50' : 
              'border-gray-300 bg-gray-50'
            }`}>
              <div className="text-sm font-medium flex items-center">
                <span>Performance Metrics</span>
                {isOutlier && <span className="ml-2 px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs rounded-full">Outlier</span>}
                {isNewVideo() && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    New Video
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <div className="text-xs text-gray-500">Channel average</div>
                  <div className="text-sm">{formatNumber(channelAvgViews)} views</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Performance</div>
                  <div className={`text-sm font-medium ${performanceColor}`}>
                    {performance}% of average
                  </div>
                </div>
                <div className="col-span-2 mt-1">
                  <div className="text-xs text-gray-500">Category</div>
                  <div className={`text-sm font-medium ${performanceColor}`}>
                    {performanceLabel}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 