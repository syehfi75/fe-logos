"use client";

import { usePostUmum, usePutUmum } from "@/utils/useFetchUmum";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

interface ReactVideoPlayerProps {
  videoId?: string;
  url: string | undefined;
  controls?: boolean;
  playing?: boolean;
  loop?: boolean;
  muted?: boolean;
  width?: string;
  height?: string;
  trackProgress?: boolean;
  className?: string;
  last_duration?: number;
  duration?: number;
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
  trackProgress = false,
  className,
  last_duration = 0,
  duration = 0,
}: ReactVideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const lastSavedRef = useRef<number>(0);

  const STORAGE_KEY = `video-progress-${videoId}`;
  const [postProgress] = usePutUmum(
    "apiBase",
    `/dummy-api/lessons/${videoId}/progress`
  );

  const handleProgress = async () => {
    if (trackProgress) {
      const now = Date.now();
      const body = {
        last_position: Math.round(playerRef.current.currentTime),
        video_duration: duration,
      };
      if (now - lastSavedRef.current > 30000) {
        const result = await postProgress(body);
        if (result?.status) {
          console.log("Progress saved successfully", result?.data);
        }
        lastSavedRef.current = now;
      }
    }
  };

  const onReady = useCallback(() => {
    playerRef.current.currentTime = last_duration;
  }, [last_duration]);

  const handleEnded = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
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
      // className="absolute inset-0"
      onReady={() => onReady()}
    />
  );
}
