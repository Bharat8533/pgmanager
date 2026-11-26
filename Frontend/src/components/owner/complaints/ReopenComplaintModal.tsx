"use client";

import React, { useState } from "react";
import { Complaint } from "@/types/complaint";
import { RotateCcw, X, AlertCircle, Info } from "lucide-react";

interface ReopenComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  onConfirm: (complaintId: string, reason: string) => void;
}

export function ReopenComplaintModal({
  isOpen,
  onClose,
  complaint,
  onConfirm,
}: ReopenComplaintModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !complaint) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason for reopening this complaint ticket.");
      return;
    }
    setError(null);
    onConfirm(complaint.id, reason.trim());
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111622] rounded-3xl border border-brand-border dark:border-[#222E42] shadow-2xl p-6 overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-brand-border/70 dark:border-[#1E2638]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 border border-transparent dark:border-amber-500/30">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-charcoal dark:text-white">
                Reopen Complaint Ticket
              </h3>
              <p className="text-xs text-brand-muted dark:text-slate-400">
                {complaint.complaintNumber} • Currently {complaint.status.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white hover:bg-brand-offwhite dark:hover:bg-[#151D2A] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info notice */}
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30 rounded-xl flex items-start gap-2.5 text-amber-800 dark:text-amber-300 text-xs">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Reopening will transition this ticket back to <strong>Pending (In-Progress)</strong> status. An activity timeline entry will be recorded automatically.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="p-3 bg-brand-offwhite/60 dark:bg-[#151D2A] rounded-xl border border-brand-border/60 dark:border-[#263346]">
            <p className="text-xs font-semibold text-brand-charcoal dark:text-white">
              {complaint.title}
            </p>
            <p className="text-[11px] text-brand-muted dark:text-slate-400 mt-1 line-clamp-2">
              {complaint.description}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-charcoal dark:text-white mb-1.5">
              Reason for Reopening <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              placeholder="State why this ticket is being reopened (e.g. Resident reported issue recurred after 2 days, or repair was incomplete)..."
              className="w-full text-xs p-3 rounded-xl border border-brand-border dark:border-[#263346] bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white focus:border-amber-500 focus:outline-none transition-colors resize-none placeholder:text-brand-muted/70 dark:placeholder:text-slate-500"
            />
            {error && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-brand-border/70 dark:border-[#1E2638] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-muted dark:text-slate-300 hover:text-brand-charcoal dark:hover:text-white hover:bg-brand-offwhite dark:hover:bg-[#151D2A] border border-brand-border dark:border-[#263346] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reopen Ticket to Pending</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
