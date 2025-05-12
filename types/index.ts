export interface Competitor {
  id: string;
  url: string;
  title: string | null;
}

export interface VideoStatistics {
  id: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  publish_time: Date;
  title: string | null;
  sent: boolean;
  channel_id: string;
  thumbnail: string | null;
}

export interface FilterOptions {
  channelId?: string;
  sortBy?: 'view_count' | 'like_count' | 'comment_count' | 'publish_time';
  sortOrder?: 'asc' | 'desc';
  timeFrame?: '1w' | '2w' | '1m' | '2m';
  outlierMultiplier?: number;
  outliersOnly?: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
} 