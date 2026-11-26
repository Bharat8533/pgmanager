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
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
  Wrench,
  Utensils,
  Sparkles,
  Zap,
  ShieldAlert,
  BedDouble,
  CreditCard,
  EyeOff,
  HelpCircle,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplaintTableProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onClearFilters: () => void;
}

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  maintenance_repairs: <Wrench className="w-3.5 h-3.5" />,
  food_mess: <Utensils className="w-3.5 h-3.5" />,
  cleanliness_hygiene: <Sparkles className="w-3.5 h-3.5" />,
  water_electricity: <Zap className="w-3.5 h-3.5" />,
  security_safety: <ShieldAlert className="w-3.5 h-3.5" />,
  room_facilities: <BedDouble className="w-3.5 h-3.5" />,
  payment_deposit: <CreditCard className="w-3.5 h-3.5" />,
  privacy_rules: <EyeOff className="w-3.5 h-3.5" />,
  other: <HelpCircle className="w-3.5 h-3.5" />,
};

const STATUS_ICON_MAP: Record<string, React.ReactNode> = {
  new: <Clock className="w-3 h-3 text-blue-600" />,
  pending: <RotateCcw className="w-3 h-3 text-amber-600" />,
  resolved: <CheckCircle2 className="w-3 h-3 text-emerald-600" />,
  rejected: <XCircle className="w-3 h-3 text-rose-600" />,
};

export function ComplaintTable({
  complaints,
  onSelectComplaint,
  onClearFilters,
}: ComplaintTableProps) {
  if (complaints.length === 0) {
    return (
      <div className="bg-white dark:bg-[#111622] rounded-2xl border border-brand-border dark:border-[#222E42] p-12 text-center shadow-2xs space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-brand-offwhite dark:bg-[#1E2638] border border-brand-border dark:border-[#263346] flex items-center justify-center mx-auto text-brand-muted dark:text-slate-400">
          <Inbox className="w-7 h-7 text-brand-muted dark:text-slate-400" />
        </div>
        <h3 className="text-base font-bold text-brand-charcoal dark:text-white">
          No Complaints Found
        </h3>
        <p className="text-xs text-brand-muted dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          No complaints match the currently selected filters or status tabs. Try adjusting your search keywords or resetting filters.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-obsidian dark:bg-brand-lime text-white dark:text-brand-obsidian text-xs font-semibold hover:bg-brand-obsidian-hover dark:hover:bg-[#bbf057] transition-colors cursor-pointer"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="hidden md:block bg-white dark:bg-[#111622] rounded-2xl border border-brand-border dark:border-[#222E42] shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F8FAFC] dark:bg-[#151D2A] border-b border-brand-border dark:border-[#1E2638] text-[11px] font-bold text-brand-muted dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Complaint ID</th>
              <th className="py-3 px-4">Resident</th>
              <th className="py-3 px-3">Room</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Complaint Title</th>
              <th className="py-3 px-3">Submitted</th>
              <th className="py-3 px-3">Priority</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/60 dark:divide-[#1E2638]">
            {complaints.map((complaint) => {
              const catMeta = COMPLAINT_CATEGORIES[complaint.category];
              const priMeta = COMPLAINT_PRIORITIES[complaint.priority];
              const statMeta = COMPLAINT_STATUSES[complaint.status];

              const formattedDate = new Date(complaint.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              return (
                <tr
                  key={complaint.id}
                  onClick={() => onSelectComplaint(complaint)}
                  className="hover:bg-[#F8FAFC]/80 dark:hover:bg-[#1E293B]/50 transition-colors cursor-pointer group"
                >
                  {/* Complaint ID */}
                  <td className="py-3 px-4 font-mono font-bold text-brand-charcoal dark:text-white whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>{complaint.complaintNumber}</span>
                      {complaint.attachments.length > 0 && (
                        <span
                          className="text-brand-muted dark:text-slate-400 flex items-center"
                          title={`${complaint.attachments.length} attachment(s)`}
                        >
                          <Paperclip className="w-3 h-3 text-brand-muted dark:text-slate-400" />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Resident */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-obsidian dark:bg-[#1E2638] text-white dark:text-brand-lime flex items-center justify-center font-bold text-[10px] shrink-0 border border-transparent dark:border-[#263346]">
                        {complaint.residentName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-brand-charcoal dark:text-white group-hover:text-brand-charcoal dark:group-hover:text-brand-lime transition-colors truncate max-w-[130px]">
                          {complaint.residentName}
                        </p>
                        <p className="text-[10px] text-brand-muted dark:text-slate-400 truncate max-w-[130px]">
                          {complaint.residentPhone}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Room */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-semibold text-brand-charcoal dark:text-slate-200">
                      Rm {complaint.roomNumber}
                    </span>
                    {complaint.bedNumber && (
                      <span className="text-[10px] text-brand-muted dark:text-slate-400 block">
                        Bed {complaint.bedNumber}
                      </span>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold border",
                        catMeta.badgeBg,
                        catMeta.badgeText,
                        catMeta.badgeBorder
                      )}
                    >
                      {CATEGORY_ICON_MAP[complaint.category]}
                      <span>{catMeta.label}</span>
                    </span>
                  </td>

                  {/* Complaint Title & Description */}
                  <td className="py-3 px-4 max-w-xs">
                    <p className="font-semibold text-brand-charcoal dark:text-white truncate">
                      {complaint.title}
                    </p>
                    <p className="text-[11px] text-brand-muted dark:text-slate-400 truncate mt-0.5">
                      {complaint.description}
                    </p>
                  </td>

                  {/* Submitted Date */}
                  <td className="py-3 px-3 text-brand-muted dark:text-slate-400 whitespace-nowrap text-[11px]">
                    {formattedDate}
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
                        priMeta.badgeBg,
                        priMeta.badgeText,
                        priMeta.badgeBorder,
                        complaint.priority === "urgent" && "ring-1 ring-rose-500/30 font-black animate-pulse"
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", priMeta.dotColor)} />
                      <span>{priMeta.label}</span>
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border",
                        statMeta.badgeBg,
                        statMeta.badgeText,
                        statMeta.badgeBorder
                      )}
                    >
                      {STATUS_ICON_MAP[complaint.status]}
                      <span>{statMeta.label}</span>
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectComplaint(complaint);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-offwhite dark:bg-[#151D2A] hover:bg-brand-obsidian dark:hover:bg-brand-lime text-brand-charcoal dark:text-slate-200 hover:text-white dark:hover:text-brand-obsidian transition-colors border border-brand-border dark:border-[#263346] cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
