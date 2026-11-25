"use client";

import React, { useState } from "react";
import { Complaint } from "@/types/complaint";
import { CheckCircle2, X, AlertCircle, Calendar } from "lucide-react";

interface ResolveComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  onConfirm: (complaintId: string, remarks: string, resolutionDate?: string) => void;
}

export function ResolveComplaintModal({
  isOpen,
  onClose,
  complaint,
  onConfirm,
}: ResolveComplaintModalProps) {
  const [remarks, setRemarks] = useState("");
  const [resolutionDate, setResolutionDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !complaint) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) {
      setError("Resolution remarks are required. Please describe the action taken.");
      return;
    }
    setError(null);
    onConfirm(complaint.id, remarks.trim(), resolutionDate);
    setRemarks("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-brand-border shadow-2xl p-6 overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-brand-border/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-charcoal">
                Resolve Complaint
              </h3>
              <p className="text-xs text-brand-muted">
                {complaint.complaintNumber} • {complaint.residentName} (Room {complaint.roomNumber})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-brand-muted hover:text-brand-charcoal hover:bg-brand-offwhite rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="p-3 bg-brand-offwhite/60 rounded-xl border border-brand-border/60">
            <p className="text-xs font-semibold text-brand-charcoal">
              {complaint.title}
            </p>
            <p className="text-[11px] text-brand-muted mt-1 line-clamp-2">
              {complaint.description}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-charcoal mb-1.5">
              Resolution Remarks <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={remarks}
              onChange={(e) => {
                setRemarks(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Describe how the problem was resolved (e.g. Geyser thermostat replaced by electrician, tested hot water flow with resident)..."
              className="w-full text-xs p-3 rounded-xl border border-brand-border bg-white text-brand-charcoal focus:border-brand-charcoal focus:outline-none transition-colors resize-none placeholder:text-brand-muted/70"
            />
            {error && (
              <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-charcoal mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-muted" />
              <span>Resolution Date</span>
            </label>
            <input
              type="date"
              value={resolutionDate}
              onChange={(e) => setResolutionDate(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-brand-border bg-white text-brand-charcoal focus:border-brand-charcoal focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-brand-border/70 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-muted hover:text-brand-charcoal hover:bg-brand-offwhite border border-brand-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Resolution</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
