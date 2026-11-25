"use client";

import React, { useState } from "react";
import { StaffMember, StaffStatus } from "@/types/staff";
import { X, RefreshCw, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChangeStaffStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
  onConfirm: (staffId: string, newStatus: StaffStatus) => void;
}

export function ChangeStaffStatusModal({
  isOpen,
  onClose,
  staff,
  onConfirm,
}: ChangeStaffStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<StaffStatus>(
    staff?.status || "active"
  );

  React.useEffect(() => {
    if (staff) {
      setSelectedStatus(staff.status);
    }
  }, [staff]);

  if (!isOpen || !staff) return null;

  const handleUpdate = () => {
    onConfirm(staff.id, selectedStatus);
    onClose();
  };

  const statusOptions: {
    status: StaffStatus;
    title: string;
    description: string;
    badgeClass: string;
    icon: React.ReactNode;
  }[] = [
    {
      status: "active",
      title: "Active Duty",
      description: "Employee is currently present, performing duties, and active on shift rosters.",
      badgeClass: "border-emerald-200 bg-emerald-50/60 text-emerald-800",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    },
    {
      status: "on_leave",
      title: "On Leave",
      description: "Employee is temporarily on sanctioned leave or medical rest. Shift duties are paused.",
      badgeClass: "border-amber-200 bg-amber-50/60 text-amber-800",
      icon: <Clock className="w-5 h-5 text-amber-600" />,
    },
    {
      status: "inactive",
      title: "Inactive / Deactivated",
      description: "Employee has left the PG or contract is terminated. Excluded from active daily schedules.",
      badgeClass: "border-neutral-200 bg-neutral-100 text-neutral-700",
      icon: <AlertTriangle className="w-5 h-5 text-neutral-500" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-obsidian/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-brand-border p-5 sm:p-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-offwhite border border-brand-border flex items-center justify-center text-brand-charcoal">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-charcoal">
                Change Employment Status
              </h3>
              <p className="text-xs text-brand-muted">
                {staff.name} ({staff.employeeId})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-brand-offwhite text-brand-muted hover:text-brand-charcoal transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="py-4 space-y-2.5">
          {statusOptions.map((opt) => {
            const isSelected = selectedStatus === opt.status;
            return (
              <label
                key={opt.status}
                onClick={() => setSelectedStatus(opt.status)}
                className={cn(
                  "flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all",
                  isSelected
                    ? "border-brand-obsidian bg-brand-offwhite/50 shadow-2xs"
                    : "border-brand-border hover:bg-brand-offwhite/30"
                )}
              >
                <div className="pt-0.5 shrink-0">{opt.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-charcoal">
                      {opt.title}
                    </span>
                    <input
                      type="radio"
                      name="staff_status"
                      value={opt.status}
                      checked={isSelected}
                      onChange={() => setSelectedStatus(opt.status)}
                      className="accent-brand-obsidian w-3.5 h-3.5"
                    />
                  </div>
                  <p className="text-[11px] text-brand-muted mt-0.5 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-brand-border flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-brand-border bg-brand-offwhite hover:bg-neutral-200 text-brand-charcoal transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-obsidian text-brand-lime hover:bg-brand-obsidian/90 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Update Status</span>
          </button>
        </div>
      </div>
    </div>
  );
}
