// lib/youtube-service.ts
import ytSearch from "yt-search";
import YouTube from "youtube-sr";
import { VideoResult } from "@/types/youtube";

export class YouTubeService {
  private async searchWithYtSearch(query: string): Promise<VideoResult[]> {
    console.log("searchWithYtSearch: ", query);
    const results = await ytSearch(query);
    return results.videos.map((video) => ({
      id: video.videoId,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail!,
      duration: video.duration.timestamp,
      views: video.views,
      uploaded: video.ago,
      channelName: video.author.name,
      url: video.url,
    }));
  }

  private async searchWithYoutubeSr(query: string): Promise<VideoResult[]> {
    console.log("searchWithYoutubeSr: ", query);
    const results = await YouTube.search(query, {
      limit: 20,
      type: "video",
    });

    return results.map((video) => ({
      id: video.id!,
      title: video.title!,
      description: video.description || "",
      thumbnail: video.thumbnail?.url || "",
      duration: video.durationFormatted || "",
      views: video.views || 0,
      uploaded: video.uploadedAt || "",
      channelName: video.channel?.name || "",
      url: `https://youtube.com/watch?v=${video.id}`,
    }));
  }

  async search(query: string): Promise<VideoResult[]> {
    try {
      // // 首先尝试使用 youtube-sr
      // const results = await this.searchWithYoutubeSr(query);
      // if (results.length > 0) return results;

      // // 如果失败，使用 yt-search 作为备选
      // return await this.searchWithYtSearch(query);
      return await this.searchWithYoutubeSr(query);
    } catch (error) {
      console.error("Search failed:", error);
      throw new Error("Failed to search videos");
    }
  }
}
