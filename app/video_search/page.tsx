// app/page.tsx
"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { SearchInput } from "@/components/SearchInputs";
import { VideoCard } from "@/components/video-card";
import { VideoResult } from "@/types/youtube";
import { searchVideos } from "@/lib/actions/search";
import { useDebounce } from "@/hooks/use-debounce";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VideoResult[]>([]);
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleSearch = useCallback(async (searchQuery: string) => {
    console.log("Client: handleSearch called with:", searchQuery); // 添加日志

    if (!searchQuery.trim()) {
      console.log("Client: Empty query, clearing results"); // 添加日志
      setResults([]);
      return;
    }

    startTransition(async () => {
      try {
        console.log("Client: Starting search transition"); // 添加日志

        // 确保直接调用 server action
        const response = await searchVideos({
          query: searchQuery.trim(),
        });

        console.log("Client: Received response:", response); // 添加日志

        if (response.error) {
          setError(response.error);
          setResults([]);
        } else {
          setResults(response.results);
          setError("");
        }
      } catch (err) {
        console.error("Client: Search error:", err); // 添加日志
        setError("Failed to search videos");
        setResults([]);
      }
    });
  }, []);

  // 直接响应输入变化，移除 useDebounce
  const handleInputChange = (value: string) => {
    setQuery(value);
    handleSearch(value);
  };

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="max-w-2xl mx-auto mb-8">
        <SearchInput
          value={query}
          onChange={handleInputChange}
          placeholder="Search YouTube videos..."
          // isLoading={isPending}
        />
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {isPending && <div className="text-center mt-4">Loading...</div>}
    </main>
  );
}
