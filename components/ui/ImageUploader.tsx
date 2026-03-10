"use client";

import React, { useState, useRef } from "react";
import { Upload, X, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
}

export const ImageUploader = ({ 
  onUploadSuccess, 
  folder = "general", 
  label = "Upload Image",
  className 
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Use JPG, PNG or WebP");
      return;
    }

    setError(null);
    setIsUploading(true);

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (f) => setPreview(f.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        onUploadSuccess(data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div 
        className={cn(
          "relative border-2 border-dashed rounded-[2rem] transition-all duration-500 overflow-hidden group",
          isUploading ? "border-accent/50 bg-accent/5" : "border-white/10 hover:border-accent/30 bg-zinc-900/50",
          preview && "border-solid border-accent/20"
        )}
      >
        {!preview ? (
          <label className="flex flex-col items-center justify-center p-12 cursor-pointer">
            <Upload className="w-10 h-10 text-zinc-600 group-hover:text-accent transition-colors mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors">{label}</p>
            <p className="text-[8px] text-zinc-700 mt-2 uppercase tracking-widest">Max 5MB / JPG, PNG, WEBP</p>
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </label>
        ) : (
          <div className="relative aspect-square md:aspect-video w-full">
            <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-50" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
              {isUploading ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 text-accent animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-accent">Encrypting to Cloud</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-500">
                  <CheckCircle className="w-8 h-8 text-accent" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Upload Complete</span>
                  <button 
                    onClick={clearPreview}
                    className="mt-2 text-[8px] font-black uppercase tracking-widest text-zinc-400 hover:text-white underline underline-offset-4"
                  >
                    Remove & Replace
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest px-4">{error}</p>}
    </div>
  );
};
