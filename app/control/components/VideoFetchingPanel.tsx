import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar, DownloadCloud, Loader2, RefreshCw } from "lucide-react";

interface VideoFetchingPanelProps {
  timePeriod: string;
  isFetchingVideos: boolean;
  isUpdatingVideos: boolean;
  onTimePeriodChange: (value: string) => void;
  onFetchVideos: () => Promise<void>;
  onUpdateVideos: () => Promise<void>;
}

export default function VideoFetchingPanel({
  timePeriod,
  isFetchingVideos,
  isUpdatingVideos,
  onTimePeriodChange,
  onFetchVideos,
  onUpdateVideos,
}: VideoFetchingPanelProps) {
  return (
    <div className="bg-white p-6 border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full">
      <h2 className="text-2xl font-bold mb-4">Fetch YouTube Videos</h2>
      <p className="text-gray-600 mb-6">
        Fetch new videos or update existing statistics from your competitor channels.
      </p>

      <div className="flex items-center gap-3 mb-6 bg-blue-50 p-4 border-2 border-blue-200 rounded-lg w-full">
        <Calendar className="h-5 w-5 text-blue-500 flex-shrink-0" />
        <div className="flex-grow">
          <p className="text-sm font-medium text-blue-700 mb-1">
            Time Period
          </p>
          <Select value={timePeriod} onValueChange={onTimePeriodChange}>
            <SelectTrigger className="w-full border-blue-200 focus:ring-blue-500">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Last 1 Month</SelectItem>
              <SelectItem value="3">Last 3 Months</SelectItem>
              <SelectItem value="6">Last 6 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          variant="default"
          disabled={isFetchingVideos || isUpdatingVideos}
          onClick={onFetchVideos}
          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 px-4 py-3 h-auto w-full"
        >
          {isFetchingVideos ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <DownloadCloud className="h-5 w-5" />
          )}
          <div>
            <p className="font-medium">
              {isFetchingVideos ? "Fetching..." : "Fetch New Videos"}
            </p>
            <p className="text-xs text-blue-100">
              From last {timePeriod} {parseInt(timePeriod) === 1 ? 'month' : 'months'}
            </p>
          </div>
        </Button>
        
        <Button
          variant="default"
          disabled={isFetchingVideos || isUpdatingVideos}
          onClick={onUpdateVideos}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-3 h-auto w-full"
        >
          {isUpdatingVideos ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <RefreshCw className="h-5 w-5" />
          )}
          <div>
            <p className="font-medium">
              {isUpdatingVideos ? "Updating..." : "Update Existing Videos"}
            </p>
            <p className="text-xs text-blue-100">
              From last {timePeriod} {parseInt(timePeriod) === 1 ? 'month' : 'months'}
            </p>
          </div>
        </Button>
      </div>
    </div>
  );
}
