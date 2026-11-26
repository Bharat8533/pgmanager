"use client";

import React, { useState } from "react";
import {
  Complaint,
  ComplaintPriority,
  ComplaintStatus,
  ComplaintAttachment,
} from "@/types/complaint";
import {
  COMPLAINT_CATEGORIES,
  COMPLAINT_PRIORITIES,
  COMPLAINT_STATUSES,
} from "@/constants/mockComplaintsData";
import {
  X,
  Phone,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
  FileText,
  Paperclip,
  Plus,
  Send,
  MessageSquare,
  ShieldAlert,
  User,
  Wrench,
  Utensils,
  Sparkles,
  Zap,
  BedDouble,
  CreditCard,
  EyeOff,
  HelpCircle,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplaintDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  onMarkAsPending: (complaintId: string) => void;
  onOpenResolveModal: (complaint: Complaint) => void;
  onOpenRejectModal: (complaint: Complaint) => void;
  onOpenReopenModal: (complaint: Complaint) => void;
  onUpdatePriority: (complaintId: string, priority: ComplaintPriority) => void;
  onAddInternalNote: (complaintId: string, noteText: string) => void;
  onPreviewAttachment: (attachment: ComplaintAttachment) => void;
}

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  maintenance_repairs: <Wrench className="w-4 h-4" />,
  food_mess: <Utensils className="w-4 h-4" />,
  cleanliness_hygiene: <Sparkles className="w-4 h-4" />,
  water_electricity: <Zap className="w-4 h-4" />,
  security_safety: <ShieldAlert className="w-4 h-4" />,
  room_facilities: <BedDouble className="w-4 h-4" />,
  payment_deposit: <CreditCard className="w-4 h-4" />,
  privacy_rules: <EyeOff className="w-4 h-4" />,
  other: <HelpCircle className="w-4 h-4" />,
};

export function ComplaintDetailsDrawer({
  isOpen,
  onClose,
  complaint,
  onMarkAsPending,
  onOpenResolveModal,
  onOpenRejectModal,
  onOpenReopenModal,
  onUpdatePriority,
  onAddInternalNote,
  onPreviewAttachment,
}: ComplaintDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<"details" | "notes" | "timeline">(
    "details"
  );
  const [newNote, setNewNote] = useState("");
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen || !complaint) return null;

  const catMeta = COMPLAINT_CATEGORIES[complaint.category];
  const priMeta = COMPLAINT_PRIORITIES[complaint.priority];
  const statMeta = COMPLAINT_STATUSES[complaint.status];

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(complaint.residentPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddInternalNote(complaint.id, newNote);
    setNewNote("");
  };

  const formattedSubmitted = new Date(complaint.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-[#111622] h-full shadow-2xl border-l border-brand-border dark:border-[#222E42] flex flex-col overflow-hidden animate-slideIn">
        {/* Top Header */}
        <div className="p-5 border-b border-brand-border dark:border-[#1E2638] bg-brand-offwhite/50 dark:bg-[#0D111A] flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-obsidian dark:bg-[#1E2638] text-brand-lime flex items-center justify-center font-bold text-sm shrink-0 border border-transparent dark:border-[#263346]">
              {CATEGORY_ICON_MAP[complaint.category]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-brand-charcoal dark:text-slate-300">
                  {complaint.complaintNumber}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                    statMeta.badgeBg,
                    statMeta.badgeText,
                    statMeta.badgeBorder
                  )}
                >
                  {statMeta.label}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-brand-charcoal dark:text-white mt-0.5 line-clamp-1">
                {complaint.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white hover:bg-brand-offwhite dark:hover:bg-[#151D2A] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-brand-border dark:border-[#1E2638] bg-white dark:bg-[#111622] px-5 shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={cn(
              "py-3 font-bold border-b-2 mr-6 transition-colors cursor-pointer",
              activeTab === "details"
                ? "border-brand-obsidian dark:border-brand-lime text-brand-charcoal dark:text-brand-lime font-black"
                : "border-transparent text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white"
            )}
          >
            Overview & Resident
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("timeline")}
            className={cn(
              "py-3 font-bold border-b-2 mr-6 transition-colors flex items-center gap-1.5 cursor-pointer",
              activeTab === "timeline"
                ? "border-brand-obsidian dark:border-brand-lime text-brand-charcoal dark:text-brand-lime font-black"
                : "border-transparent text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white"
            )}
          >
            <span>Activity Timeline</span>
            <span className="w-4 h-4 rounded-full bg-brand-offwhite dark:bg-[#1E2638] text-[10px] text-brand-charcoal dark:text-slate-300 flex items-center justify-center border border-brand-border dark:border-[#263346]">
              {complaint.activityTimeline.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            className={cn(
              "py-3 font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer",
              activeTab === "notes"
                ? "border-brand-obsidian dark:border-brand-lime text-brand-charcoal dark:text-brand-lime font-black"
                : "border-transparent text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white"
            )}
          >
            <span>Internal Notes</span>
            <span className="w-4 h-4 rounded-full bg-brand-offwhite dark:bg-[#1E2638] text-[10px] text-brand-charcoal dark:text-slate-300 flex items-center justify-center border border-brand-border dark:border-[#263346]">
              {complaint.internalNotes.length}
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
          {activeTab === "details" && (
            <>
              {/* Status Specific Resolution / Rejection Banner */}
              {complaint.status === "resolved" && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl space-y-1.5 text-emerald-900 dark:text-emerald-200 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Resolved on {new Date(complaint.resolvedAt || complaint.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  </div>
                  <p className="text-xs leading-relaxed pl-6 text-emerald-950 dark:text-emerald-100">
                    <strong>Remarks:</strong> {complaint.resolutionRemarks}
                  </p>
                </div>
              )}

              {complaint.status === "rejected" && (
                <div className="p-4 bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 rounded-2xl space-y-1.5 text-rose-900 dark:text-rose-200 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-300">
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>Declined / Rejected</span>
                  </div>
                  <p className="text-xs leading-relaxed pl-6 text-rose-950 dark:text-rose-100">
                    <strong>Reason:</strong> {complaint.rejectionReason}
                  </p>
                </div>
              )}

              {/* Resident Card */}
              <div className="p-4 bg-brand-offwhite/50 dark:bg-[#151D2A] rounded-2xl border border-brand-border dark:border-[#263346] space-y-3 shadow-2xs">
                <span className="text-[10px] font-bold text-brand-muted dark:text-slate-400 uppercase tracking-wider block">
                  Resident & Room Details
                </span>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-obsidian dark:bg-[#1E2638] text-white dark:text-brand-lime flex items-center justify-center font-bold text-sm shrink-0 border border-transparent dark:border-[#263346]">
                      {complaint.residentName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-charcoal dark:text-white">
                        {complaint.residentName}
                      </h4>
                      <p className="text-xs text-brand-muted dark:text-slate-400">
                        Room {complaint.roomNumber}{" "}
                        {complaint.bedNumber && `(Bed ${complaint.bedNumber})`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className="p-2 rounded-xl bg-white dark:bg-[#111622] border border-brand-border dark:border-[#263346] text-brand-charcoal dark:text-slate-200 hover:bg-brand-offwhite dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
                      title="Copy phone number"
                    >
                      {copiedPhone ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={`tel:${complaint.residentPhone}`}
                      className="p-2 rounded-xl bg-brand-obsidian dark:bg-brand-lime text-brand-lime dark:text-brand-obsidian hover:bg-brand-obsidian-hover transition-colors"
                      title={`Call ${complaint.residentPhone}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="pt-2 border-t border-brand-border/60 dark:border-[#1E2638] grid grid-cols-2 gap-2 text-[11px] text-brand-muted dark:text-slate-400">
                  <div>
                    <span className="block text-[10px] uppercase font-semibold">
                      Property
                    </span>
                    <span className="font-semibold text-brand-charcoal dark:text-white">
                      {complaint.propertyName}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-semibold">
                      Phone Number
                    </span>
                    <span className="font-semibold text-brand-charcoal dark:text-white">
                      {complaint.residentPhone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Complaint Overview Information */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-brand-muted dark:text-slate-400 uppercase tracking-wider block">
                  Complaint Description
                </span>

                <div className="p-4 bg-white dark:bg-[#151D2A] rounded-2xl border border-brand-border dark:border-[#263346] space-y-2 shadow-2xs">
                  <h4 className="text-xs font-bold text-brand-charcoal dark:text-white">
                    {complaint.title}
                  </h4>
                  <p className="text-xs text-brand-muted dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {complaint.description}
                  </p>
                </div>

                {/* Priority Selector & Category Badges */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-brand-offwhite/40 dark:bg-[#151D2A] rounded-xl border border-brand-border/80 dark:border-[#263346]">
                    <span className="text-[10px] font-bold text-brand-muted dark:text-slate-400 uppercase block mb-1">
                      Category
                    </span>
                    <div className="flex items-center gap-1.5 text-brand-charcoal dark:text-white font-semibold">
                      {CATEGORY_ICON_MAP[complaint.category]}
                      <span>{catMeta.label}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-brand-offwhite/40 dark:bg-[#151D2A] rounded-xl border border-brand-border/80 dark:border-[#263346]">
                    <span className="text-[10px] font-bold text-brand-muted dark:text-slate-400 uppercase block mb-1">
                      Priority Level
                    </span>
                    <select
                      value={complaint.priority}
                      onChange={(e) =>
                        onUpdatePriority(
                          complaint.id,
                          e.target.value as ComplaintPriority
                        )
                      }
                      className={cn(
                        "w-full text-xs font-bold py-1 px-2 rounded-lg border focus:outline-none cursor-pointer uppercase tracking-wider",
                        priMeta.badgeBg,
                        priMeta.badgeText,
                        priMeta.badgeBorder
                      )}
                    >
                      <option value="low" className="dark:bg-[#151D2A]">Low Priority</option>
                      <option value="medium" className="dark:bg-[#151D2A]">Medium Priority</option>
                      <option value="high" className="dark:bg-[#151D2A]">High Priority</option>
                      <option value="urgent" className="dark:bg-[#151D2A]">Urgent Priority</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Attachments Section */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-brand-muted dark:text-slate-400 uppercase tracking-wider block">
                  Resident Uploaded Attachments ({complaint.attachments.length})
                </span>

                {complaint.attachments.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {complaint.attachments.map((att) => (
                      <div
                        key={att.id}
                        onClick={() => onPreviewAttachment(att)}
                        className="p-2.5 rounded-xl border border-brand-border dark:border-[#263346] bg-white dark:bg-[#151D2A] hover:bg-brand-offwhite/60 dark:hover:bg-[#1E293B] transition-all cursor-pointer group flex items-center gap-2.5 shadow-2xs"
                      >
                        {att.type === "image" ? (
                          <img
                            src={att.url}
                            alt={att.name}
                            className="w-12 h-12 rounded-lg object-cover border border-brand-border dark:border-[#263346] shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-brand-offwhite dark:bg-[#1E2638] border border-brand-border dark:border-[#263346] flex items-center justify-center shrink-0 text-brand-muted dark:text-slate-400">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-brand-charcoal dark:text-white text-[11px] truncate">
                            {att.name}
                          </p>
                          <p className="text-[10px] text-brand-muted dark:text-slate-400">
                            {att.size || "Image"} • Click to view
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-brand-muted dark:text-slate-400 italic py-2">
                    No attachments uploaded for this complaint.
                  </p>
                )}
              </div>
            </>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-brand-muted dark:text-slate-400 uppercase tracking-wider block">
                Activity & Lifecycle Log
              </span>

              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-border dark:before:bg-[#263346]">
                {complaint.activityTimeline.map((item, idx) => (
                  <div key={item.id || idx} className="relative group">
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white dark:bg-[#111622] border-2 border-brand-charcoal dark:border-brand-lime flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-charcoal dark:bg-brand-lime" />
                    </div>

                    <div className="bg-brand-offwhite/40 dark:bg-[#151D2A] p-3 rounded-xl border border-brand-border/60 dark:border-[#263346] space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-brand-charcoal dark:text-white">
                          {item.action}
                        </span>
                        <span className="text-brand-muted dark:text-slate-400 text-[10px]">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-brand-muted dark:text-slate-300 leading-relaxed">
                        {item.description}
                      </p>
                      <p className="text-[10px] text-brand-muted/80 dark:text-slate-400 font-medium">
                        By {item.performedBy} ({item.performedByRole})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-brand-muted dark:text-slate-400 uppercase tracking-wider block">
                Private Owner Internal Notes
              </span>

              {/* Add Note Form */}
              <form onSubmit={handleAddNoteSubmit} className="space-y-2">
                <textarea
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a private operational note (e.g. Electrician scheduled for tomorrow, warranty claimed on Bajaj geyser)..."
                  className="w-full text-xs p-3 rounded-xl border border-brand-border dark:border-[#263346] bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white focus:border-brand-charcoal dark:focus:border-brand-lime focus:outline-none resize-none placeholder:text-brand-muted/70 dark:placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-obsidian dark:bg-brand-lime text-white dark:text-brand-obsidian text-xs font-semibold hover:bg-brand-obsidian-hover dark:hover:bg-[#bbf057] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Send className="w-3 h-3 text-brand-lime dark:text-brand-obsidian" />
                  <span>Add Note</span>
                </button>
              </form>

              {/* Notes List */}
              <div className="space-y-2.5 pt-2">
                {complaint.internalNotes.length > 0 ? (
                  complaint.internalNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 bg-brand-offwhite/50 dark:bg-[#151D2A] rounded-xl border border-brand-border dark:border-[#263346] space-y-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-[10px] text-brand-muted dark:text-slate-400">
                        <span className="font-bold text-brand-charcoal dark:text-white">
                          {note.authorName} ({note.authorRole})
                        </span>
                        <span>{note.createdAt}</span>
                      </div>
                      <p className="text-xs text-brand-charcoal dark:text-slate-200 leading-relaxed">
                        {note.note}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-brand-muted dark:text-slate-400 italic py-4 text-center">
                    No internal notes yet. Use the form above to add private comments.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Owner Actions Bar */}
        <div className="p-4 border-t border-brand-border dark:border-[#1E2638] bg-brand-offwhite/40 dark:bg-[#0D111A] flex items-center justify-between gap-2 shrink-0">
          {/* For New Status */}
          {complaint.status === "new" && (
            <div className="flex items-center justify-between w-full gap-2">
              <button
                type="button"
                onClick={() => onOpenRejectModal(complaint)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/15 hover:bg-rose-100 dark:hover:bg-rose-500/25 border border-rose-200 dark:border-rose-500/30 transition-colors cursor-pointer"
              >
                Reject Complaint
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onMarkAsPending(complaint.id)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-brand-charcoal dark:text-slate-200 bg-white dark:bg-[#151D2A] hover:bg-brand-offwhite dark:hover:bg-[#1E293B] border border-brand-border dark:border-[#263346] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Mark as Pending</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenResolveModal(complaint)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resolve Complaint</span>
                </button>
              </div>
            </div>
          )}

          {/* For Pending Status */}
          {complaint.status === "pending" && (
            <div className="flex items-center justify-between w-full gap-2">
              <button
                type="button"
                onClick={() => onOpenRejectModal(complaint)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/15 hover:bg-rose-100 dark:hover:bg-rose-500/25 border border-rose-200 dark:border-rose-500/30 transition-colors cursor-pointer"
              >
                Reject Complaint
              </button>
              <button
                type="button"
                onClick={() => onOpenResolveModal(complaint)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Resolve Complaint</span>
              </button>
            </div>
          )}

          {/* For Resolved Status */}
          {complaint.status === "resolved" && (
            <div className="flex items-center justify-between w-full gap-2">
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Ticket Closed & Resolved</span>
              </span>
              <button
                type="button"
                onClick={() => onOpenReopenModal(complaint)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/15 hover:bg-amber-100 dark:hover:bg-amber-500/25 border border-amber-200 dark:border-amber-500/30 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Reopen Ticket</span>
              </button>
            </div>
          )}

          {/* For Rejected Status */}
          {complaint.status === "rejected" && (
            <div className="flex items-center justify-between w-full gap-2">
              <span className="text-xs text-rose-700 dark:text-rose-400 font-semibold flex items-center gap-1">
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Ticket Declined</span>
              </span>
              <button
                type="button"
                onClick={() => onOpenReopenModal(complaint)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/15 hover:bg-amber-100 dark:hover:bg-amber-500/25 border border-amber-200 dark:border-amber-500/30 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Reopen Ticket</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
