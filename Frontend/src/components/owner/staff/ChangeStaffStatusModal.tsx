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
      badgeClass: "border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      status: "on_leave",
      title: "On Leave",
      description: "Employee is temporarily on sanctioned leave or medical rest. Shift duties are paused.",
      badgeClass: "border-amber-200 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300",
      icon: <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    },
    {
      status: "inactive",
      title: "Inactive / Deactivated",
      description: "Employee has left the PG or contract is terminated. Excluded from active daily schedules.",
      badgeClass: "border-neutral-200 dark:border-slate-700 bg-neutral-100 dark:bg-slate-800/60 text-neutral-700 dark:text-slate-300",
      icon: <AlertTriangle className="w-5 h-5 text-neutral-500 dark:text-slate-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-obsidian/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-[#111622] rounded-3xl shadow-2xl border border-brand-border dark:border-[#222E42] p-5 sm:p-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-border dark:border-[#1E2638]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-offwhite dark:bg-[#182232] border border-brand-border dark:border-[#263346] flex items-center justify-center text-brand-charcoal dark:text-white">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-charcoal dark:text-white">
                Change Employment Status
              </h3>
              <p className="text-xs text-brand-muted dark:text-slate-400">
                {staff.name} ({staff.employeeId})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-brand-offwhite dark:hover:bg-[#182232] text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white transition-colors"
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
                    ? "border-brand-obsidian dark:border-brand-lime bg-brand-offwhite/50 dark:bg-[#182232] shadow-2xs"
                    : "border-brand-border dark:border-[#222E42] hover:bg-brand-offwhite/30 dark:hover:bg-[#151D2A]"
                )}
              >
                <div className="pt-0.5 shrink-0">{opt.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-charcoal dark:text-white">
                      {opt.title}
                    </span>
                    <input
                      type="radio"
                      name="staff_status"
                      value={opt.status}
                      checked={isSelected}
                      onChange={() => setSelectedStatus(opt.status)}
                      className="accent-brand-obsidian dark:accent-brand-lime w-3.5 h-3.5"
                    />
                  </div>
                  <p className="text-[11px] text-brand-muted dark:text-slate-400 mt-0.5 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-brand-border dark:border-[#1E2638] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-brand-border dark:border-[#263346] bg-brand-offwhite dark:bg-[#182232] hover:bg-neutral-200 dark:hover:bg-[#222E42] text-brand-charcoal dark:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-obsidian text-brand-lime hover:bg-black dark:bg-brand-lime dark:text-[#0A0D12] dark:hover:bg-[#b8e85c] transition-all flex items-center gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Update Status</span>
          </button>
        </div>
      </div>
    </div>
  );
}
