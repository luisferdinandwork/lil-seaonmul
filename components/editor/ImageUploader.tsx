/* eslint-disable @typescript-eslint/no-explicit-any */
// components/editor/ImageUploader.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon, Link2 } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: "video" | "square" | "free";
  hint?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = "Image",
  aspectRatio = "video",
  hint,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClass =
    aspectRatio === "video"  ? "aspect-video"  :
    aspectRatio === "square" ? "aspect-square"  :
    "min-h-[120px]";

  const upload = useCallback(async (file: File) => {
    setError(null);
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowed.includes(file.type)) {
      setError("Please upload a JPEG, PNG, WebP, GIF, or AVIF image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be under 10 MB.");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
    } catch (err: any) {
      setError(err.message ?? "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }, [upload]);

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
      setTab("upload");
    }
  };

  const handleRemove = () => {
    onChange("");
    setError(null);
  };

  return (
    <div className="w-full">
      {label && (
        <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-2">
          {label}
        </p>
      )}

      {value ? (
        <div className={`relative group rounded-xl overflow-hidden bg-stone-100 ${aspectClass}`}>
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-stone-800 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1.5 bg-pink-500/90 hover:bg-pink-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-stone-200 overflow-hidden">
          <div className="flex border-b border-stone-100">
            {(["upload", "url"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-xs font-semibold transition-colors ${
                  tab === t
                    ? "bg-white text-pink-600 border-b-2 border-pink-400"
                    : "bg-stone-50 text-stone-400 hover:text-stone-600"
                }`}
              >
                {t === "upload" ? "Upload file" : "Paste URL"}
              </button>
            ))}
          </div>

          {tab === "upload" ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 px-6 py-8 cursor-pointer transition-colors ${
                dragOver ? "bg-pink-50" : "bg-white hover:bg-stone-50"
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
                  <p className="text-xs text-stone-500 font-medium">Uploading...</p>
                </>
              ) : (
                <>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    dragOver ? "bg-pink-100" : "bg-stone-100"
                  }`}>
                    <ImageIcon className={`w-5 h-5 transition-colors ${
                      dragOver ? "text-pink-500" : "text-stone-400"
                    }`} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-stone-700">
                      {dragOver ? "Drop to upload" : "Click or drag & drop"}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      JPEG, PNG, WebP, GIF · Max 10 MB
                    </p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="bg-white p-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-200 placeholder:text-stone-300 transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  disabled={!urlInput.trim()}
                  className="px-4 py-2.5 text-xs font-semibold bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-40 transition-all"
                >
                  Use
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-500 flex items-center gap-1.5">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}

      {hint && !error && (
        <p className="mt-1.5 text-[11px] text-stone-400">{hint}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}