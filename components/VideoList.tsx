import { SearchResult } from "@/app/page";
import { formatTime } from "@/lib/utils/common";
import Image from "next/image";

export default function VideoList({
  results,
  searchQuery,
}: {
  results: SearchResult[];
  searchQuery: string;
}) {
  if (results.length === 0) {
    return <p>No results found.</p>;
  }

  return (
    <div className="space-y-8">
      {results.map((result, index) => {
        // 获取缩略图 URL，如果不存在则使用默认图片
        const thumbnailUrl =
          result.video.snippet?.thumbnails?.medium?.url ||
          "/default-thumbnail.jpg";
        const title = result.video.snippet?.title || "Untitled Video";

        return (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                {/* 使用 Next.js Image 组件 */}
                <Image
                  src={thumbnailUrl}
                  alt={title}
                  width={160}
                  height={90}
                  className="rounded"
                />
                {/* 如果要使用普通 img 标签，这样处理： */}
                {/* <img
                  src={thumbnailUrl}
                  alt={title}
                  className="w-40 h-auto rounded"
                /> */}
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <p className="text-gray-600 mb-4">
                  {result.video.snippet?.description ||
                    "No description available"}
                </p>
                <div className="space-y-2">
                  {result.segments.map((segment, segmentIndex) => (
                    <div key={segmentIndex} className="bg-gray-100 p-2 rounded">
                      <div className="text-sm text-gray-500 mb-1">
                        {formatTime(segment.start)} - {formatTime(segment.end)}
                      </div>
                      <div className="text-gray-800">
                        {highlightText(segment.text, searchQuery)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function highlightText(text: string, query: string) {
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) => (
        <span
          key={i}
          className={
            part.toLowerCase() === query.toLowerCase() ? "bg-yellow-200" : ""
          }
        >
          {part}
        </span>
      ))}
    </>
  );
}
