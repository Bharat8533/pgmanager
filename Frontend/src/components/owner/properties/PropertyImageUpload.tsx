"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  X,
  Star,
  Image as ImageIcon,
  AlertCircle,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyImageUploadProps {
  images: string[];
  coverImage: string;
  onImagesChange: (images: string[]) => void;
  onCoverImageChange: (cover: string) => void;
  error?: string;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export function PropertyImageUpload({
  images,
  coverImage,
  onImagesChange,
  onCoverImageChange,
  error,
}: PropertyImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);

  // Clean up created object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);

    const newImageUrls: string[] = [];

    Array.from(files).forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setUploadError(`"${file.name}" is not a supported format. Please upload JPG, PNG, or WebP.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setUploadError(`"${file.name}" exceeds the 5MB file size limit.`);
        return;
      }

      const objUrl = URL.createObjectURL(file);
      objectUrlsRef.current.push(objUrl);
      newImageUrls.push(objUrl);
    });

    if (newImageUrls.length > 0) {
      const updated = [...images, ...newImageUrls];
      onImagesChange(updated);

      // If no cover is set or previous was empty, set first as cover
      if (!coverImage || !updated.includes(coverImage)) {
        onCoverImageChange(updated[0]);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const targetUrl = images[indexToRemove];
    if (targetUrl.startsWith("blob:")) {
      URL.revokeObjectURL(targetUrl);
    }

    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onImagesChange(updated);

    if (coverImage === targetUrl) {
      onCoverImageChange(updated[0] || "");
    }
  };

  const handleSetCover = (url: string) => {
    onCoverImageChange(url);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">
          Property Photos & Cover Image <span className="text-rose-500">*</span>
        </label>
        <p className="text-[11px] text-brand-muted mt-0.5">
          Upload clear photos of the building facade, bedrooms, and common areas. Star an image to set it as Cover.
        </p>
      </div>

      {/* Drag & drop upload box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all select-none group",
          isDragging
            ? "border-brand-obsidian bg-brand-lime/10"
            : "border-brand-border/80 hover:border-brand-charcoal/40 bg-slate-50/50 hover:bg-white"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="w-12 h-12 rounded-2xl bg-white border border-brand-border flex items-center justify-center mx-auto mb-3 text-brand-charcoal group-hover:scale-105 transition-transform shadow-xs">
          <UploadCloud className="w-6 h-6 text-brand-charcoal" />
        </div>

        <p className="text-xs font-bold text-brand-charcoal">
          Click to upload or drag & drop property images
        </p>
        <p className="text-[11px] text-brand-muted mt-1">
          Supports JPG, PNG, and WebP (up to 5MB each)
        </p>
      </div>

      {/* Error feedback */}
      {(uploadError || error) && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError || error}</span>
        </div>
      )}

      {/* Previews Grid */}
      {images.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span className="font-semibold text-brand-charcoal">
              Uploaded Images ({images.length})
            </span>
            <span className="text-[11px]">
              Click the star to set cover image
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((imgUrl, index) => {
              const isCover = imgUrl === coverImage;
              return (
                <div
                  key={`${imgUrl}-${index}`}
                  className={cn(
                    "relative aspect-4/3 rounded-xl overflow-hidden border-2 transition-all group shadow-2xs",
                    isCover
                      ? "border-brand-obsidian ring-2 ring-brand-lime"
                      : "border-slate-200 hover:border-slate-400"
                  )}
                >
                  {/* Image */}
                  <img
                    src={imgUrl}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Top Overlay Badge / Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    {/* Make Cover Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetCover(imgUrl);
                      }}
                      className={cn(
                        "p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-md",
                        isCover
                          ? "bg-brand-lime text-brand-obsidian"
                          : "bg-white text-brand-charcoal hover:bg-brand-lime hover:text-brand-obsidian"
                      )}
                      title={isCover ? "Current Cover Image" : "Make Cover Image"}
                    >
                      <Star className={cn("w-3.5 h-3.5", isCover && "fill-brand-obsidian")} />
                      <span className="text-[10px] hidden sm:inline">
                        {isCover ? "Cover" : "Set Cover"}
                      </span>
                    </button>

                    {/* Delete Image Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                      className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Persistent Cover Star Tag */}
                  {isCover && (
                    <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-brand-obsidian text-brand-lime font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Star className="w-2.5 h-2.5 fill-brand-lime" />
                      <span>Cover Photo</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
