"use client";

import { useEffect, useRef } from "react";
import { usePutUmum } from "@/utils/useFetchUmum";

export default function VideoPlayer({
  videoId,
  url,
  last_duration = 0,
  duration = 0,
  trackProgress = false,
}: any) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<any>(null);
  const lastSavedRef = useRef<number>(0);

  const [postProgress] = usePutUmum(
    "apiBase",
    `/api/user/lessons/${videoId}/progress`
  );

  useEffect(() => {
    if (!iframeRef.current) return;

    let player: any;

    import("player.js").then(({ default: Player }) => {
      player = new Player(iframeRef.current!);
      playerRef.current = player;

      player.on("ready", () => {
        if (last_duration > 0) {
          player.setCurrentTime(last_duration);
        }
      });

      player.on("timeupdate", async ({ seconds, duration: videoDuration }: any) => {
        if (!trackProgress) return;

        const now = Date.now();
        if (now - lastSavedRef.current < 30000) return;

        await postProgress({
          last_position: Math.round(seconds),
          video_duration: Math.round(videoDuration ?? duration),
          watched_duration: Math.round(seconds),
        });

        lastSavedRef.current = now;
      });

      player.on("ended", async () => {
        await postProgress({
          last_position: duration,
          video_duration: duration,
          watched_duration: duration,
          completed: true,
        });
      });
    });

    return () => {
      if (player) {
        player.off("ready");
        player.off("timeupdate");
        player.off("ended");
      }
    };
  }, [videoId]);

  return (
    <iframe
      ref={iframeRef}
      src={`${url}?playerjs=1`}
      className="w-full h-full"
      allow="autoplay; fullscreen"
    />
  );
}
