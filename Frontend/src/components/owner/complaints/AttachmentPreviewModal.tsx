"use client";

import React from "react";
import { ComplaintAttachment } from "@/types/complaint";
import { X, Download, ExternalLink, FileText } from "lucide-react";

interface AttachmentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: ComplaintAttachment | null;
}

export function AttachmentPreviewModal({
  isOpen,
  onClose,
  attachment,
}: AttachmentPreviewModalProps) {
  if (!isOpen || !attachment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl border border-brand-border shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-brand-border/70 bg-brand-offwhite/60">
          <div className="flex items-center gap-2.5 min-w-0 pr-4">
            <div className="w-7 h-7 rounded-lg bg-white border border-brand-border flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5 text-brand-charcoal" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-brand-charcoal truncate">
                {attachment.name}
              </h4>
              <p className="text-[10px] text-brand-muted">
                {attachment.size || "Image"} • Uploaded {attachment.uploadedAt}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-brand-muted hover:text-brand-charcoal hover:bg-brand-offwhite rounded-lg transition-colors"
              title="Open full size in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-brand-muted hover:text-brand-charcoal hover:bg-brand-offwhite rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image / Content Display */}
        <div className="p-4 bg-black/5 flex items-center justify-center max-h-[70vh] overflow-auto">
          {attachment.type === "image" ? (
            <img
              src={attachment.url}
              alt={attachment.name}
              className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain shadow-xs border border-brand-border"
            />
          ) : (
            <div className="p-8 text-center space-y-3">
              <FileText className="w-12 h-12 text-brand-muted mx-auto" />
              <p className="text-xs font-semibold text-brand-charcoal">{attachment.name}</p>
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-obsidian text-white text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Document</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
