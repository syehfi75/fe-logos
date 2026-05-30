"use client";

import { useEffect, useState, useRef } from "react";
import { openDB, IDBPDatabase } from "idb";
import {
  Play,
  Pause,
  Download,
  CheckCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const DB_NAME = "AudioDB";
const STORE_NAME = "tracks";

interface PlayerProps {
  audioUrl: string;
  trackId: string;
}

export default function OfflineAudioPlayer({ audioUrl, trackId }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [db, setDb] = useState<IDBPDatabase | null>(null);
  const [audioSrc, setAudioSrc] = useState<string>(audioUrl);

  const [isCached, setIsCached] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "downloading" | "success" | "error"
  >("idle");
  const [isOnline, setIsOnline] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    async function initDB() {
      try {
        const database = await openDB(DB_NAME, 1, {
          upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME);
            }
          },
        });
        setDb(database);
        await cekAksesLokal(database);
      } catch (error) {
        console.error("IndexedDB Error:", error);
      }
    }
    initDB();

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [audioUrl, trackId]);

  const cekAksesLokal = async (database: IDBPDatabase) => {
    const cachedBuffer = await database.get(STORE_NAME, trackId);
    if (cachedBuffer) {
      aktifkanBlobUrl(cachedBuffer);
      setIsCached(true);
      setDownloadStatus("success");
    } else {
      setAudioSrc(audioUrl);
      setIsCached(false);
      setDownloadStatus("idle");
    }
  };

  const aksiDownloadKeLokal = async () => {
    if (!db) return;
    if (!navigator.onLine) {
      alert("Anda harus online untuk mengunduh file ini pertama kali!");
      return;
    }

    setDownloadStatus("downloading");

    try {
      const response = await fetch(audioUrl);
      if (!response.ok)
        throw new Error("Gagal mengambil file dari server asal");

      const arrayBuffer = await response.arrayBuffer();

      await db.put(STORE_NAME, arrayBuffer, trackId);

      aktifkanBlobUrl(arrayBuffer);
      setIsCached(true);
      setDownloadStatus("success");
    } catch (error) {
      console.error(error);
      setDownloadStatus("error");
    }
  };

  const aktifkanBlobUrl = (buffer: ArrayBuffer) => {
    const isM4a = audioUrl.endsWith(".m4a");
    const mimeType = isM4a ? "audio/mp4" : "audio/mp3";

    const blob = new Blob([buffer], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    setAudioSrc(blobUrl);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (!isOnline && !isCached) {
        toast.error(
          "Koneksi terputus! Anda belum mendownload file ini untuk akses offline.",
        );

        return;
      }
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col p-5 bg-white rounded-2xl max-w-sm mx-auto mt-10 shadow-lg border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Audiobook Player
        </span>
      </div>

      <div className="mb-4 text-left">
        <h4 className="text-sm font-bold text-slate-800 truncate">
          Materi Audio Pembelajaran
        </h4>
      </div>

      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          controls
          controlsList="nodownload noplaybackrate"
          onContextMenu={(e) => e.preventDefault()}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          className="w-full mb-4 accent-blue-600"
        />
      )}

      <div className="w-full">
        {/* <button
          onClick={togglePlay}
          className={`flex-1 flex items-center justify-center gap-2 font-semibold py-2.5 px-4 rounded-xl text-sm transition-all cursor-pointer text-white shadow-sm ${
            isPlaying
              ? "bg-slate-800 hover:bg-slate-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
          {isPlaying ? "Pause" : "Putar Audio"}
        </button> */}

        {downloadStatus === "idle" && (
          <button
            onClick={aksiDownloadKeLokal}
            disabled={!isOnline}
            title="Simpan untuk putar offline tanpa kuota"
            className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border w-full cursor-pointer transition-all ${
              isOnline
                ? "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                : "border-slate-100 text-slate-300 cursor-not-allowed"
            }`}
          >
            <Download className="w-4.5 h-4.5" />
            Unduh audiobook
          </button>
        )}

        {downloadStatus === "downloading" && (
          <div className="flex items-center justify-center p-2.5 bg-slate-50 border border-slate-100 text-blue-600 rounded-xl">
            <RefreshCw className="w-4.5 h-4.5 animate-spin" />
          </div>
        )}

        {downloadStatus === "success" && (
          <div
            title="Tersimpan Offline"
            className="flex items-center justify-center p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100"
          >
            <CheckCircle className="w-4.5 h-4.5" />
          </div>
        )}

        {downloadStatus === "error" && (
          <button
            onClick={aksiDownloadKeLokal}
            title="Unduhan gagal, klik untuk mencoba kembali"
            className="flex items-center justify-center p-2.5 bg-red-50 text-red-600 rounded-xl border border-red-100 hover:bg-red-100"
          >
            <AlertCircle className="w-4.5 h-4.5" />
          </button>
        )}
      </div>
    </div>
  );
}
