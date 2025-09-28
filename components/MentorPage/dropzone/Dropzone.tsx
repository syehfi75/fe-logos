"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type DropzoneProps = {
  name?: string;          
  multiple?: boolean;
  accept?: string;        
  maxSizeMB?: number;     
  onChange?: (files: File[]) => void;
};

export default function Dropzone({
  name = "files",
  multiple = true,
  accept = "image/*,application/pdf,video/*",
  maxSizeMB = 10,
  onChange,
}: DropzoneProps) {
  const [isOver, setIsOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  

  // revoke object URLs when unmount
  useEffect(() => {
    return () => {
      files.forEach((f: any) => f.preview && URL.revokeObjectURL(f.preview));
    };
  }, [files]);

  const openPicker = () => inputRef.current?.click();

  const addFiles = useCallback(
    (list: FileList | File[]) => {
      const arr = Array.from(list);
      const passed = arr.filter((f) => f.size <= maxSizeMB * 1024 * 1024);
      const enhanced = passed.map((f) => {
        // @ts-ignore
        f.preview = URL.createObjectURL(f);
        return f;
      });
      const next = multiple ? [...files, ...enhanced] : enhanced.slice(0, 1);
      setFiles(next);
      onChange?.(next);
    },
    [files, multiple, maxSizeMB, onChange]
  );

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      addFiles(e.dataTransfer.files);
    }
  };

  const removeAt = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
    onChange?.(next);
  };

  return (
    <div className="space-y-3">
      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        name={name}
        multiple={multiple}
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files && addFiles(e.target.files)}
      />

      {/* Drop area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={onDrop}
        onClick={openPicker}
        role="button"
        aria-label="Upload files"
        className={`rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition
          ${isOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
        `}
      >
        <p className="font-medium">Tarik & lepaskan file ke sini</p>
        <p className="text-sm text-muted-foreground mt-1">
          atau <span className="underline">klik</span> untuk memilih file
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Format: {accept} • Maks {maxSizeMB}MB / file
        </p>
      </div>

      {/* Preview list */}
      {files.length > 0 && (
        <div className="rounded-md border divide-y">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              {/* preview kecil utk image/video, selain itu tampil ikon generic */}
              {f.type.startsWith("image/") ? (
                // @ts-ignore
                <img src={f.preview} alt={f.name} className="w-12 h-12 rounded object-cover" />
              ) : f.type.startsWith("video/") ? (
                <div className="w-12 h-12 rounded bg-black/80 text-white text-[10px] flex items-center justify-center">
                  VIDEO
                </div>
              ) : (
                <div className="w-12 h-12 rounded bg-gray-200 text-gray-700 text-[10px] flex items-center justify-center">
                  FILE
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{f.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(f.size / 1024 / 1024).toFixed(2)} MB • {f.type || "unknown"}
                </p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeAt(i)}>
                Hapus
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
