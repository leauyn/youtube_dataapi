"use server";

import { google, youtube_v3 } from "googleapis";
import { parseSync, Node, NodeCue } from "subtitle";

const youtube = google.youtube("v3");

type VideoSearchResult = {
  video: youtube_v3.Schema$SearchResult; // 直接使用 YouTube API 的类型
  segments: SubtitleSegment[];
};

interface SubtitleSegment {
  start: number;
  end: number;
  text: string;
}

function isNodeCue(node: Node): node is NodeCue {
  return node.type === "cue";
}

async function fetchCaptions(videoId: string): Promise<string | null> {
  try {
    const captionList = await youtube.captions.list({
      key: process.env.YOUTUBE_API_KEY,
      videoId: videoId,
      part: ["snippet"],
    });

    const englishCaption = captionList.data.items?.find(
      (caption) => caption.snippet?.language === "en"
    );

    if (!englishCaption) return null;

    const caption = await youtube.captions.download({
      key: process.env.YOUTUBE_API_KEY,
      id: englishCaption.id!,
    });
    console.log("caption data: ", caption.data);

    // 使用类型断言
    return caption.data as string;
  } catch (error) {
    console.error("Error fetching captions:", error);
    return null;
  }
}

export async function searchVideos(
  searchQuery: string
): Promise<VideoSearchResult[]> {
  try {
    const searchResponse = await youtube.search.list({
      key: process.env.YOUTUBE_API_KEY,
      part: ["snippet"],
      q: searchQuery,
      type: ["video"],
      videoCaption: "closedCaption",
      maxResults: 10,
    });

    const videos = searchResponse.data.items || [];
    console.log("videos: ", videos);
    const results: VideoSearchResult[] = [];

    for (const video of videos) {
      const videoId = video.id?.videoId;
      if (!videoId) continue;

      const captionData = await fetchCaptions(videoId);
      if (!captionData) continue;

      const subtitles = parseSync(captionData);
      const matchingSegments: SubtitleSegment[] = subtitles
        .filter(isNodeCue)
        .filter((node) =>
          node.data.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((node) => ({
          start: node.data.start,
          end: node.data.end,
          text: node.data.text,
        }));

      if (matchingSegments.length > 0) {
        results.push({
          video, // 不需要类型断言，因为类型已经正确定义
          segments: matchingSegments,
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Search failed:", error);
    throw error;
  }
}
