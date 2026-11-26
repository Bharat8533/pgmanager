"use client";

import React from "react";
import { Complaint } from "@/types/complaint";
import {
  COMPLAINT_CATEGORIES,
  COMPLAINT_PRIORITIES,
  COMPLAINT_STATUSES,
} from "@/constants/mockComplaintsData";
import {
  Eye,
  Paperclip,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Inbox,
  BedDouble,
  User,
  Wrench,
  Utensils,
  Sparkles,
  Zap,
  ShieldAlert,
  CreditCard,
  EyeOff,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplaintMobileListProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onClearFilters: () => void;
}

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  maintenance_repairs: <Wrench className="w-3 h-3" />,
  food_mess: <Utensils className="w-3 h-3" />,
  cleanliness_hygiene: <Sparkles className="w-3 h-3" />,
  water_electricity: <Zap className="w-3 h-3" />,
  security_safety: <ShieldAlert className="w-3 h-3" />,
  room_facilities: <BedDouble className="w-3 h-3" />,
  payment_deposit: <CreditCard className="w-3 h-3" />,
  privacy_rules: <EyeOff className="w-3 h-3" />,
  other: <HelpCircle className="w-3 h-3" />,
};

const STATUS_ICON_MAP: Record<string, React.ReactNode> = {
  new: <Clock className="w-3 h-3 text-blue-600" />,
  pending: <RotateCcw className="w-3 h-3 text-amber-600" />,
  resolved: <CheckCircle2 className="w-3 h-3 text-emerald-600" />,
  rejected: <XCircle className="w-3 h-3 text-rose-600" />,
};

export function ComplaintMobileList({
  complaints,
  onSelectComplaint,
  onClearFilters,
}: ComplaintMobileListProps) {
  if (complaints.length === 0) {
    return (
      <div className="md:hidden bg-white dark:bg-[#111622] rounded-2xl border border-brand-border dark:border-[#222E42] p-8 text-center shadow-2xs space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-offwhite dark:bg-[#1E2638] border border-brand-border dark:border-[#263346] flex items-center justify-center mx-auto text-brand-muted dark:text-slate-400">
          <Inbox className="w-6 h-6 text-brand-muted dark:text-slate-400" />
        </div>
        <h3 className="text-sm font-bold text-brand-charcoal dark:text-white">
          No Complaints Found
        </h3>
        <p className="text-xs text-brand-muted dark:text-slate-400 max-w-xs mx-auto">
          No records match your active filters. Try searching with a different term.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-obsidian dark:bg-brand-lime text-white dark:text-brand-obsidian text-xs font-semibold cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="md:hidden space-y-3">
      {complaints.map((complaint) => {
        const catMeta = COMPLAINT_CATEGORIES[complaint.category];
        const priMeta = COMPLAINT_PRIORITIES[complaint.priority];
        const statMeta = COMPLAINT_STATUSES[complaint.status];

        const formattedDate = new Date(complaint.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        });

        return (
          <div
            key={complaint.id}
            onClick={() => onSelectComplaint(complaint)}
            className="p-4 bg-white dark:bg-[#111622] rounded-2xl border border-brand-border dark:border-[#222E42] shadow-2xs space-y-3 cursor-pointer active:scale-[0.99] transition-transform"
          >
            {/* Top row: ID, submitted date, priority */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-mono font-bold text-brand-charcoal dark:text-white">
                <span>{complaint.complaintNumber}</span>
                {complaint.attachments.length > 0 && (
                  <Paperclip className="w-3 h-3 text-brand-muted dark:text-slate-400" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-brand-muted dark:text-slate-400">{formattedDate}</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider",
                    priMeta.badgeBg,
                    priMeta.badgeText,
                    priMeta.badgeBorder,
                    complaint.priority === "urgent" && "ring-1 ring-rose-400 font-black animate-pulse"
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", priMeta.dotColor)} />
                  <span>{priMeta.label}</span>
                </span>
              </div>
            </div>

            {/* Category badge & Title */}
            <div>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border mb-1.5",
                  catMeta.badgeBg,
                  catMeta.badgeText,
                  catMeta.badgeBorder
                )}
              >
                {CATEGORY_ICON_MAP[complaint.category]}
                <span>{catMeta.label}</span>
              </span>
              <h4 className="text-xs font-bold text-brand-charcoal dark:text-white line-clamp-1">
                {complaint.title}
              </h4>
              <p className="text-[11px] text-brand-muted dark:text-slate-400 line-clamp-2 mt-0.5">
                {complaint.description}
              </p>
            </div>

            {/* Resident & Room footer */}
            <div className="pt-2 border-t border-brand-border/60 dark:border-[#1E2638] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-brand-obsidian dark:bg-[#1E2638] text-white dark:text-brand-lime flex items-center justify-center font-bold text-[9px] shrink-0 border border-transparent dark:border-[#263346]">
                  {complaint.residentName.charAt(0)}
                </div>
                <div className="min-w-0 truncate">
                  <span className="font-semibold text-brand-charcoal dark:text-white truncate block text-[11px]">
                    {complaint.residentName}
                  </span>
                  <span className="text-[10px] text-brand-muted dark:text-slate-400 block -mt-0.5">
                    Room {complaint.roomNumber}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border",
                    statMeta.badgeBg,
                    statMeta.badgeText,
                    statMeta.badgeBorder
                  )}
                >
                  {STATUS_ICON_MAP[complaint.status]}
                  <span>{statMeta.label}</span>
                </span>
                <button
                  type="button"
                  className="p-1.5 bg-brand-offwhite dark:bg-[#151D2A] rounded-lg text-brand-charcoal dark:text-slate-200 border border-brand-border dark:border-[#263346]"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
