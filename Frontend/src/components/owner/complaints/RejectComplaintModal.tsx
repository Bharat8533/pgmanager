"use client";

import React, { useState } from "react";
import { Complaint } from "@/types/complaint";
import { XCircle, X, AlertTriangle, AlertCircle } from "lucide-react";

interface RejectComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  onConfirm: (complaintId: string, reason: string) => void;
}

export function RejectComplaintModal({
  isOpen,
  onClose,
  complaint,
  onConfirm,
}: RejectComplaintModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !complaint) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Rejection reason is mandatory. An explanation is required before declining.");
      return;
    }
    setError(null);
    onConfirm(complaint.id, reason.trim());
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-brand-border shadow-2xl p-6 overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-brand-border/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-charcoal">
                Reject Complaint
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

        {/* Warning Badge */}
        <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Per PG Master policy, complaints can never be rejected without an explicit explanation. The resident will see this rejection reason in their tenant portal.
          </p>
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
              Reason for Rejection <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              placeholder="State the clear factual reason for rejection (e.g. Request violates PG Visitor Policy Rule #4, or requested alteration is not permitted under tenant agreement)..."
              className="w-full text-xs p-3 rounded-xl border border-brand-border bg-white text-brand-charcoal focus:border-rose-500 focus:outline-none transition-colors resize-none placeholder:text-brand-muted/70"
            />
            {error && (
              <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
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
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>Confirm Rejection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
