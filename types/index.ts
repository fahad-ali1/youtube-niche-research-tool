export interface Competitor {
  id: string;
  url: string;
  title?: string;
  profilePic?: string;
}

export interface VideoStatistics {
  id: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  publish_time: string | Date;
  channel_id: string;
  thumbnail?: string;
  title?: string;
  duration?: number;
}

export interface FilterOptions {
  channelId?: string;
  sortBy?: "view_count" | "like_count" | "comment_count" | "publish_time";
  sortOrder?: "asc" | "desc";
  timeFrame?: "1w" | "2w" | "1m" | "2m";
  videoType?: "all" | "short" | "long";
  outlierMultiplier?: number;
  outliersOnly?: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}
