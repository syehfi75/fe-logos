"use client";

import { useEffect, useRef } from "react";
import Player from "player.js";
import { usePostUmumToken, usePutUmum } from "@/utils/useFetchUmum";

interface ReactVideoPlayerProps {
  videoId?: string;
  url?: string;
  trackProgress?: boolean;
  last_duration?: number;
  duration?: number;
}

export default function VideoPlayer({
  videoId,
  url,
  trackProgress = false,
  last_duration = 0,
  duration = 0,
}: ReactVideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<any>(null);
  const lastSavedRef = useRef<number>(0);

  const [postProgress] = usePostUmumToken(
    "apiBase",
    `/api/user/lessons/${videoId}/progress`
  );

  useEffect(() => {
    if (!iframeRef.current) return;

    const player = new Player(iframeRef.current!);
    playerRef.current = player;

    /* ========= onReady ========= */
    player.on("ready", () => {
      console.log("PLAYER READY");

      if (last_duration > 0) {
        player.setCurrentTime(last_duration);
      }
    });

    /* ========= handleProgress ========= */
    player.on("timeupdate", async ({ seconds, duration: videoDuration }: any) => {
      if (!trackProgress) return;

      const now = Date.now();

      if (now - lastSavedRef.current < 30000) return;

      const body = {
        last_position: Math.round(seconds),
        video_duration: Math.round(videoDuration ?? duration),
        watched_duration: Math.round(seconds),
      };

      const result = await postProgress(body);
      if (result?.status) {
        console.log("Progress saved", body);
      }

      lastSavedRef.current = now;
    });

    /* ========= handleEnded ========= */
    player.on("ended", async () => {
      console.log("VIDEO ENDED");

      await postProgress({
        last_position: duration,
        video_duration: duration,
        watched_duration: duration,
      });

      localStorage.removeItem(`video-progress-${videoId}`);
    });

    return () => {
      player.off("ready");
      player.off("timeupdate");
      player.off("ended");
    };
  }, [videoId, last_duration, duration, trackProgress]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full"
      src={`${url}?playerjs=1`}
      allow="autoplay; fullscreen"
    />
  );
}
