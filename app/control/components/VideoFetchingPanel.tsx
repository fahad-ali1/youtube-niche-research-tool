import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar, DownloadCloud, Loader2 } from "lucide-react";

interface VideoFetchingPanelProps {
  timePeriod: string;
  isUpdating: boolean;
  onTimePeriodChange: (value: string) => void;
  onFetchVideos: () => Promise<void>;
}

export default function VideoFetchingPanel({
  timePeriod,
  isUpdating,
  onTimePeriodChange,
  onFetchVideos,
}: VideoFetchingPanelProps) {
  return (
    <div className="bg-white p-6 border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-2xl font-bold mb-4">Fetch YouTube Videos</h2>
      <p className="text-gray-600 mb-4">
        Fetch new videos from all your competitor channels to update your
        dashboard statistics.
      </p>

      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex items-center gap-2 bg-blue-50 p-3 border-2 border-blue-200 rounded-lg">
          <Calendar className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-blue-700 mb-1">
              Time Period
            </p>
            <Select value={timePeriod} onValueChange={onTimePeriodChange}>
              <SelectTrigger className="w-[140px] border-blue-200 focus:ring-blue-500">
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

        <Button
          variant="default"
          disabled={isUpdating}
          onClick={onFetchVideos}
          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 px-4 py-2 h-auto"
        >
          {isUpdating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <DownloadCloud className="h-5 w-5" />
          )}
          <div>
            <p className="font-medium">
              {isUpdating ? "Fetching..." : "Fetch Videos"}
            </p>
            <p className="text-xs text-blue-100">
              Using {timePeriod}-month period
            </p>
          </div>
        </Button>
      </div>
    </div>
  );
}
