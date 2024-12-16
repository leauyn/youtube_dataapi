// types/youtube.ts
export interface VideoResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  uploaded: string;
  channelName: string;
  url: string;
}

export interface SearchResponse {
  results: VideoResult[];
  error?: string;
  nextPage?: string;
}
