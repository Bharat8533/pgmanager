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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-obsidian/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-brand-border p-5 sm:p-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-brand-border">
          <div className="flex items-center gap-2 text-rose-600">
            <Trash2 className="w-5 h-5" />
            <h3 className="text-sm font-bold text-brand-charcoal">
              Delete Staff Member
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-brand-offwhite text-brand-muted hover:text-brand-charcoal transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="py-4 space-y-3">
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 leading-relaxed">
              <strong className="block font-semibold mb-0.5">
                Warning: Permanent Action
              </strong>
              This will remove <strong>{staff.name}</strong> ({staff.employeeId}) from your staff directory and property records.
            </div>
          </div>

          <div className="bg-brand-offwhite/50 p-3.5 rounded-2xl border border-brand-border/60 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-brand-muted">Employee:</span>
              <strong className="text-brand-charcoal font-semibold">{staff.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Role:</span>
              <span className="text-brand-charcoal">{staff.customRoleTitle || staff.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Assigned PG:</span>
              <span className="text-brand-charcoal">{staff.propertyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Contact:</span>
              <span className="text-brand-charcoal">{staff.phone}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
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
