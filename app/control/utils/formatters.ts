import { VideoStatistics } from "@/types";

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};

/**
 * Calculate average views from videos
 */
export const calculateAverageViews = (videos: VideoStatistics[]): number => {
  const videosWithViews = videos.filter((video) => video.view_count > 0);
  if (videosWithViews.length === 0) return 0;
  
  const totalViews = videosWithViews.reduce(
    (sum, video) => sum + video.view_count,
    0
  );
  return totalViews / videosWithViews.length;
};

/**
 * Sort competitors by title
 */
export const sortCompetitors = (competitors: any[]) => {
  return [...competitors].sort((a, b) => {
    // If neither has a title, sort by ID
    if (!a.title && !b.title) {
      return a.id.localeCompare(b.id);
    }
    // If a doesn't have a title, it comes first
    if (!a.title) return -1;
    // If b doesn't have a title, it comes first
    if (!b.title) return 1;
    // Both have titles, sort alphabetically
    return a.title.localeCompare(b.title);
  });
};

/**
 * Filter competitors by search query
 */
export const filterCompetitorsByQuery = (competitors: any[], searchQuery: string) => {
  if (searchQuery.trim() === "") return competitors;
  
  return competitors.filter(
    (comp) =>
      (comp.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
      comp.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
};
