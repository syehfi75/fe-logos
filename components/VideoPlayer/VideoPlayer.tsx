"use client";

import { useEffect, useRef } from "react";
import { usePostUmumToken } from "@/utils/useFetchUmum";

export default function VideoPlayer({
  videoId,
  url,
  last_duration = 0,
  duration = 0,
  enableProgressTracking = false,
}: any) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<any>(null);
  const lastSavedRef = useRef<number>(Date.now());
  const isInitialized = useRef(false);

  const [postProgress] = usePostUmumToken(
    "apiBase",
    `/api/user/lessons/${videoId}/progress`,
  );

  useEffect(() => {
    isInitialized.current = false;
    lastSavedRef.current = Date.now();
    let player: any = null;

    const initPlayer = async () => {
      if (!iframeRef.current || isInitialized.current) return;

      try {
        const module = (await import("player.js")) as any;
        const Player = module.Player || module.default;

        if (!iframeRef.current) return;

        player = new Player(iframeRef.current);
        playerRef.current = player;
        isInitialized.current = true;

        player.on("ready", () => {
          if (last_duration > 0) {
            player.setCurrentTime(last_duration);
          }
        });

        player.on(
          "timeupdate",
          async ({ seconds, duration: videoDuration }: any) => {
            if (!enableProgressTracking) return;
            const now = Date.now();
            if (now - lastSavedRef.current < 30000) return;

            lastSavedRef.current = now;
            await postProgress({
              last_position: Math.round(seconds),
              video_duration: Math.round(videoDuration),
              watched_duration: Math.round(seconds),
            });
          },
        );

        player.on("ended", async () => {
          if (!enableProgressTracking) return;
          await postProgress({
            last_position: duration,
            video_duration: duration,
            watched_duration: duration,
          });
        });
      } catch (error) {
        console.error("Player Init Error:", error);
      }
    };

    initPlayer();

    return () => {
      if (player) {
        try {
          player.off("ready");
          player.off("timeupdate");
          player.off("ended");

          if (iframeRef.current) {
            player.destroy?.();
          }
        } catch (e) {
          console.warn("Safe cleanup: player already gone");
        }
      }
      playerRef.current = null;
      isInitialized.current = false;
    };
  }, [videoId, url]);

  return (
    <div className="aspect-video w-full bg-black">
      <iframe
        key={videoId}
        ref={iframeRef}
        src={`${url}?playerjs=1`}
        className="w-full h-full"
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
