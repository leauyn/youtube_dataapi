import SearchForm from "@/components/SearchForm";
import VideoList from "@/components/VideoList";
import { searchVideos } from "@/lib/actions/youtube";
import { youtube_v3 } from "googleapis";

export interface SubtitleSegment {
  start: number;
  end: number;
  text: string;
}

export interface SearchResult {
  video: youtube_v3.Schema$SearchResult;
  segments: SubtitleSegment[];
}

export default async function Home({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  let results: SearchResult[] = [];
  const query = searchParams.q;
  console.log("query: ", query);

  if (query) {
    results = await searchVideos(query);
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">YouTube Subtitle Search</h1>
      <SearchForm initialQuery={query} />
      {query && <VideoList results={results} searchQuery={query} />}
    </main>
  );
}
