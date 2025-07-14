"use client";

import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

interface ReactVideoPlayerProps {
  videoId?: string; // Unique ID per video untuk key localStorage
  url: string;
  controls?: boolean;
  playing?: boolean;
  loop?: boolean;
  muted?: boolean;
  width?: string;
  height?: string;
  trackProgress?: boolean;
}

export default function VideoPlayer({
  videoId,
  url,
  controls = true,
  playing = false,
  loop = false,
  muted = false,
  width = "100%",
  height = "100%",
  trackProgress = false
}: ReactVideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const lastSavedRef = useRef<number>(0);

  const STORAGE_KEY = `video-progress-${videoId}`;

  // Simpan posisi terakhir (throttle setiap 5 detik)
  const handleProgress = ({ timeStamp }: { timeStamp: number }) => {
    if (trackProgress) {
      const now = Date.now();
      if (now - lastSavedRef.current > 5000) {
        localStorage.setItem(STORAGE_KEY, String(timeStamp));
        lastSavedRef.current = now;
      }
    }
  };

  // Hapus progress saat video selesai
  const handleEnded = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="aspect-video max-w-4xl mx-auto">
      <ReactPlayer
        ref={playerRef}
        src={url}
        controls={controls}
        playing={playing}
        loop={loop}
        muted={muted}
        width={width}
        height={height}
        onTimeUpdate={handleProgress}
        onEnded={handleEnded}
      />
    </div>
  );
}
