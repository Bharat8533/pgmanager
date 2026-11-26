"use client";

import React from "react";
import { StaffMember } from "@/types/staff";
import { X, Trash2, AlertTriangle } from "lucide-react";

interface DeleteStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
  onConfirm: (staffId: string) => void;
}

export function DeleteStaffModal({
  isOpen,
  onClose,
  staff,
  onConfirm,
}: DeleteStaffModalProps) {
  if (!isOpen || !staff) return null;

  const handleDelete = () => {
    onConfirm(staff.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-obsidian/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-[#111622] rounded-3xl shadow-2xl border border-brand-border dark:border-[#222E42] p-5 sm:p-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-brand-border dark:border-[#1E2638]">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <Trash2 className="w-5 h-5" />
            <h3 className="text-sm font-bold text-brand-charcoal dark:text-white">
              Delete Staff Member
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-brand-offwhite dark:hover:bg-[#182232] text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="py-4 space-y-3">
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
              <strong className="block font-semibold mb-0.5">
                Warning: Permanent Action
              </strong>
              This will remove <strong>{staff.name}</strong> ({staff.employeeId}) from your staff directory and property records.
            </div>
          </div>

          <div className="bg-brand-offwhite/50 dark:bg-[#151D2A] p-3.5 rounded-2xl border border-brand-border/60 dark:border-[#263346] text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-brand-muted dark:text-slate-400">Employee:</span>
              <strong className="text-brand-charcoal dark:text-white font-semibold">{staff.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted dark:text-slate-400">Role:</span>
              <span className="text-brand-charcoal dark:text-slate-200">{staff.customRoleTitle || staff.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted dark:text-slate-400">Assigned PG:</span>
              <span className="text-brand-charcoal dark:text-slate-200">{staff.propertyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted dark:text-slate-400">Contact:</span>
              <span className="text-brand-charcoal dark:text-slate-200">{staff.phone}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
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
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Staff Member</span>
          </button>
        </div>
      </div>
    </div>
  );
}
