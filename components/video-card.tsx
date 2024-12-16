// components/video-card.tsx
import { VideoResult } from "@/types/youtube";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface VideoCardProps {
  video: VideoResult;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Card className="overflow-hidden">
      {/* <div> */}
      <div className="relative aspect-video">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
          {video.duration}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-2">{video.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {video.channelName}
        </p>
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <span>{video.views.toLocaleString()} views</span>
          <span>•</span>
          <span>{video.uploaded}</span>
        </div>
      </div>
      {/* </div> */}
    </Card>
  );
}
