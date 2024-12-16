// app/actions/youtube.ts
"use server";

import { YouTubeService } from "@/lib/utils/youtube-service";
import { VideoResult } from "@/types/youtube";
import { z } from "zod"; // 添加参数验证

const SearchSchema = z.object({
  query: z.string().min(1),
  page: z.string().optional(),
});

export async function searchVideos(
  formData: FormData | { query: string; page?: string }
): Promise<{
  results: VideoResult[];
  error?: string;
  nextPage?: string;
}> {
  console.log("Debuging query");
  try {
    // 支持 FormData 和直接对象传参
    const data =
      formData instanceof FormData
        ? {
            query: formData.get("query") as string,
            page: formData.get("page") as string | undefined,
          }
        : formData;
    console.log("query in searchVideos: ", data);

    // 验证参数
    const validated = SearchSchema.safeParse(data);
    if (!validated.success) {
      return {
        results: [],
        error: "Invalid search parameters",
      };
    }

    const { query, page } = validated.data;
    const youtube = new YouTubeService();
    const results = await youtube.search(query);

    return {
      results,
      nextPage: page, // 如果实现分页，这里需要返回下一页的标记
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      results: [],
      error: "Failed to search videos",
    };
  }
}
