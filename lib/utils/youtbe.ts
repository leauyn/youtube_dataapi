// utils/youtube.ts
import ytSearch from "yt-search";
import ytdl from "ytdl-core";
import YouTube from "youtube-sr";

export class YouTubeService {
  // 使用多个搜索源
  async searchWithFallback(query: string) {
    try {
      // 首选 youtube-sr
      const results = await YouTube.search(query, {
        limit: 20,
        type: "video",
      });
      return results;
    } catch (error) {
      try {
        // 备选 yt-search
        const results = await ytSearch(query);
        return results.videos;
      } catch (secondError) {
        console.error("All search methods failed:", secondError);
        throw new Error("Search failed");
      }
    }
  }

  // 获取视频详情
  async getVideoDetails(videoId: string) {
    try {
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      const info = await ytdl.getInfo(url);
      return info;
    } catch (error) {
      console.error("Error getting video details:", error);
      throw error;
    }
  }

  // 获取字幕
  async getCaptions(videoId: string) {
    try {
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      const info = await ytdl.getInfo(url);
      return info.player_response.captions;
    } catch (error) {
      console.error("Error getting captions:", error);
      throw error;
    }
  }
}
