import { Competitor, VideoStatistics } from "@/types";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { formatNumber, calculateAverageViews } from "../utils/formatters";

interface ChannelStatisticsProps {
  selectedChannel: string | null;
  selectedCompetitor: Competitor | undefined;
  channelVideos: VideoStatistics[];
  channelStatsLoading: boolean;
}

export default function ChannelStatistics({
  selectedChannel,
  selectedCompetitor,
  channelVideos,
  channelStatsLoading,
}: ChannelStatisticsProps) {
  if (!selectedChannel) {
    return (
      <div className="h-64 flex flex-col items-center justify-center">
        <p className="text-xl text-gray-500 mb-2">
          Select a channel to view statistics
        </p>
        <p className="text-gray-400">
          Click on a channel from the list to see its statistics
        </p>
      </div>
    );
  }

  if (channelStatsLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (channelVideos.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500">
          No videos found for this channel in the last 3 months
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 p-4 bg-blue-50 border-2 border-black rounded-lg">
        <h3 className="text-lg font-bold mb-2">
          3-Month Average Calculation
        </h3>
        <p>
          <strong>Total Videos:</strong> {channelVideos.length}
        </p>
        <p>
          <strong>Videos with Views (used for average):</strong>{" "}
          {channelVideos.filter((v) => v.view_count > 0).length}
        </p>
        <p>
          <strong>Total Views:</strong>{" "}
          {formatNumber(
            channelVideos
              .filter((v) => v.view_count > 0)
              .reduce((sum, v) => sum + v.view_count, 0)
          )}
        </p>
        <p className="text-xl mt-2">
          <strong>Average Views:</strong>{" "}
          {formatNumber(
            Math.round(calculateAverageViews(channelVideos))
          )}
        </p>
      </div>

      <h3 className="text-lg font-bold mb-2">Video Breakdown</h3>
      <div className="overflow-auto max-h-[600px] border-2 border-black rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left border-b-2 border-black">
                Video
              </th>
              <th className="px-4 py-2 text-right border-b-2 border-black">
                Views
              </th>
              <th className="px-4 py-2 text-right border-b-2 border-black">
                Published
              </th>
            </tr>
          </thead>
          <tbody>
            {channelVideos.map((video) => (
              <tr
                key={video.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
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
                <td className="px-4 py-3 text-right">
                  {formatNumber(video.view_count)}
                </td>
                <td className="px-4 py-3 text-right">
                  {format(
                    new Date(video.publish_time),
                    "MMM d, yyyy"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
