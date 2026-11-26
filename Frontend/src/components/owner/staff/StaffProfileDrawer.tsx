"use client";

import React, { useState } from "react";
import { StaffMember, StaffRole, StaffDocument } from "@/types/staff";
import {
  X,
  Edit2,
  RefreshCw,
  Trash2,
  User,
  Briefcase,
  IndianRupee,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Shield,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Building2,
  GraduationCap,
  Sparkles,
  Copy,
  Check,
  CreditCard,
  HeartPulse,
  UserCheck,
  Eye,
  ShieldCheck,
  ChevronRight,
  Fingerprint,
} from "lucide-react";
import { cn, getNameInitials } from "@/lib/utils";

interface StaffProfileDrawerProps {
  staff: StaffMember | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (staff: StaffMember) => void;
  onChangeStatus: (staff: StaffMember) => void;
  onDelete: (staff: StaffMember) => void;
}

type TabType =
  | "attendance"
  | "personal"
  | "employment"
  | "salary"
  | "emergency"
  | "documents"
  | "additional";

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotClass: string; pulseClass: string }
> = {
  active: {
    label: "Active Duty",
    badgeClass: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/90 dark:border-emerald-800/70",
    dotClass: "bg-emerald-500",
    pulseClass: "bg-emerald-400",
  },
  on_leave: {
    label: "On Leave",
    badgeClass: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/90 dark:border-amber-800/70",
    dotClass: "bg-amber-500",
    pulseClass: "bg-amber-400",
  },
  inactive: {
    label: "Inactive",
    badgeClass: "bg-neutral-100 dark:bg-slate-800/70 text-neutral-600 dark:text-slate-300 border-neutral-200 dark:border-slate-700",
    dotClass: "bg-neutral-400",
    pulseClass: "bg-neutral-300",
  },
};

const ROLE_ICONS: Record<StaffRole, React.ReactNode> = {
  Manager: <UserCheck className="w-3.5 h-3.5 text-purple-600" />,
  Warden: <Shield className="w-3.5 h-3.5 text-blue-600" />,
  "Security Guard": <Shield className="w-3.5 h-3.5 text-emerald-600" />,
  "Cook / Chef": <Sparkles className="w-3.5 h-3.5 text-amber-600" />,
  Housekeeping: <Sparkles className="w-3.5 h-3.5 text-teal-600" />,
  "Maintenance Staff": <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />,
  Receptionist: <User className="w-3.5 h-3.5 text-indigo-600" />,
  Accountant: <CreditCard className="w-3.5 h-3.5 text-cyan-600" />,
  Other: <User className="w-3.5 h-3.5 text-gray-600" />,
};

export function StaffProfileDrawer({
  staff,
  isOpen,
  onClose,
  onEdit,
  onChangeStatus,
  onDelete,
}: StaffProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("attendance");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<StaffDocument | null>(null);

  if (!isOpen || !staff) return null;

  const statusInfo = STATUS_CONFIG[staff.status] || STATUS_CONFIG.inactive;

  // Calculate Net Monthly Salary
  const baseSalary = staff.monthlySalary || 0;
  const allowances = staff.additionalAllowance || 0;
  const bonus = staff.bonus || 0;
  const deductions = staff.deductions || 0;
  const netSalary = baseSalary + allowances + bonus - deductions;

  const copyUpi = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const copyEmployeeId = () => {
    navigator.clipboard.writeText(staff.employeeId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: "attendance",
      label: "Attendance (Beta)",
      icon: <UserCheck className="w-3.5 h-3.5" />,
      badge: "Active",
    },
    { id: "personal", label: "Personal Info", icon: <User className="w-3.5 h-3.5" /> },
    { id: "employment", label: "Employment", icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: "salary", label: "Salary & Bank", icon: <IndianRupee className="w-3.5 h-3.5" /> },
    { id: "emergency", label: "Emergency", icon: <HeartPulse className="w-3.5 h-3.5" /> },
    {
      id: "documents",
      label: "Documents",
      icon: <FileText className="w-3.5 h-3.5" />,
      badge: staff.documents.length.toString(),
    },
    { id: "additional", label: "Experience", icon: <GraduationCap className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-obsidian/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <aside
        aria-label={`Staff Profile: ${staff.name}`}
        className="relative w-full max-w-2xl bg-white dark:bg-[#0D111A] h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-brand-border dark:border-[#222E42] animate-in slide-in-from-right duration-200"
      >
        {/* Mobile Pull Handle Indicator */}
        <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto mt-2 sm:hidden shrink-0" />

        {/* Top Header Bar */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-brand-border dark:border-[#1E2638] bg-white dark:bg-[#111622] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs sm:text-sm font-bold text-brand-charcoal dark:text-white uppercase tracking-wider truncate">
              Staff Profile
            </span>
            <button
              type="button"
              onClick={copyEmployeeId}
              className="text-[11px] font-mono font-semibold text-brand-charcoal dark:text-slate-200 bg-slate-100 dark:bg-[#182232] hover:bg-slate-200 dark:hover:bg-[#222E42] px-2 py-0.5 rounded-md border border-slate-200 dark:border-[#263346] flex items-center gap-1 transition-colors shrink-0"
              title="Click to copy employee ID"
            >
              <span>{staff.employeeId}</span>
              {copiedId ? (
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
            </button>
          </div>

          {/* Desktop/Tablet Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onEdit(staff)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#182232] hover:bg-slate-200 dark:hover:bg-[#222E42] text-brand-charcoal dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-[#263346]"
                title="Edit Staff Member"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeStatus(staff)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#182232] hover:bg-slate-200 dark:hover:bg-[#222E42] text-brand-charcoal dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-[#263346]"
                title="Change Status"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Status</span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(staff)}
                className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-200 dark:border-rose-900/80"
                title="Delete Staff Member"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
              <div className="w-px h-5 bg-slate-200 dark:bg-[#263346] mx-1" />
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#182232] hover:bg-slate-200 dark:hover:bg-[#222E42] text-slate-600 dark:text-slate-300 hover:text-brand-charcoal dark:hover:text-white flex items-center justify-center transition-colors"
              title="Close Profile"
              aria-label="Close Profile"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Hero Section */}
        <div className="p-4 sm:p-6 bg-linear-to-b from-slate-50/80 via-white to-slate-50/40 dark:from-[#111622] dark:via-[#131B28] dark:to-[#0F141E] border-b border-brand-border dark:border-[#1E2638] shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Avatar with Role Badge */}
            <div className="relative shrink-0 self-start sm:self-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-obsidian dark:bg-[#182232] text-brand-lime font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md border-2 border-white dark:border-[#222E42] tracking-wider">
                {getNameInitials(staff.name)}
              </div>
              {/* Corner Badge */}
              <div
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-white dark:bg-[#151D2A] border border-slate-200 dark:border-[#263346] shadow-xs flex items-center justify-center"
                title={staff.role}
              >
                {ROLE_ICONS[staff.role]}
              </div>
            </div>

            {/* Info and Chips */}
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-brand-charcoal dark:text-white tracking-tight truncate">
                  {staff.name}
                </h2>
                {/* Status Indicator Pill */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs",
                    statusInfo.badgeClass
                  )}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className={cn(
                        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                        statusInfo.pulseClass
                      )}
                    />
                    <span
                      className={cn(
                        "relative inline-flex rounded-full h-2 w-2",
                        statusInfo.dotClass
                      )}
                    />
                  </span>
                  <span>{statusInfo.label}</span>
                </span>
              </div>

              {/* Designation, Property, and Joined metadata */}
              <div className="flex flex-wrap items-center gap-y-1 gap-x-2 text-xs text-brand-muted dark:text-slate-400">
                <span className="font-semibold text-brand-charcoal dark:text-slate-200 bg-white dark:bg-[#182232] border border-slate-200 dark:border-[#263346] px-2 py-0.5 rounded-lg shadow-2xs inline-flex items-center gap-1">
                  {ROLE_ICONS[staff.role]}
                  <span>{staff.customRoleTitle || staff.role}</span>
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="inline-flex items-center gap-1 truncate text-slate-600 dark:text-slate-300">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{staff.propertyName}</span>
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    Joined{" "}
                    {new Date(staff.joiningDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </span>
              </div>

              {/* Quick Actions (Call, Email) */}
              <div className="pt-1 flex items-center gap-2 flex-wrap">
                <a
                  href={`tel:${staff.phone}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors shadow-2xs"
                >
                  <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{staff.phone}</span>
                </a>

                {staff.email && (
                  <a
                    href={`mailto:${staff.email}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border border-blue-200/80 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors shadow-2xs truncate max-w-[200px]"
                  >
                    <Mail className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="truncate">{staff.email}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Strip (Horizontal Touch-friendly Scroll) */}
        <div className="px-3 sm:px-5 border-b border-brand-border dark:border-[#1E2638] bg-white dark:bg-[#0D111A] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 py-2.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-2xs",
                  isActive
                    ? "bg-brand-obsidian text-brand-lime dark:bg-[#1E293B] dark:text-brand-lime dark:border dark:border-[#C6F36B]/40 shadow-xs"
                    : "bg-slate-50 dark:bg-[#151D2A] hover:bg-slate-100 dark:hover:bg-[#1C2638] text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-[#263346] hover:text-brand-charcoal dark:hover:text-white"
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                      isActive
                        ? "bg-brand-lime text-brand-obsidian"
                        : "bg-slate-200 dark:bg-[#1E2638] text-slate-700 dark:text-slate-300"
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Scrollable Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-24 sm:pb-6">
          {/* TAB 1: ATTENDANCE (BETA) */}
          {activeTab === "attendance" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Header Box */}
              <div className="bg-slate-50/80 dark:bg-[#111622] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-[#222E42]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-brand-charcoal dark:text-white flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Attendance & Duty Schedule
                    </h3>
                    <p className="text-xs text-brand-muted dark:text-slate-400 mt-0.5">
                      Current monthly cycle tracking & biometric logs
                    </p>
                  </div>

                  <span className="self-start sm:self-auto text-xs font-bold bg-brand-obsidian text-brand-lime dark:bg-[#1E293B] dark:text-brand-lime dark:border dark:border-[#C6F36B]/30 px-3 py-1 rounded-xl shadow-2xs uppercase tracking-wider">
                    {staff.shiftTiming} Shift
                  </span>
                </div>

                {/* 4 KPI Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-4">
                  {/* Present Days */}
                  <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/60 rounded-2xl p-3.5 text-center flex flex-col justify-between shadow-2xs">
                    <span className="text-xs text-emerald-900 dark:text-emerald-300 font-bold uppercase tracking-wider block">
                      Present
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 my-1">
                      24
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">
                      92.3% rate
                    </span>
                  </div>

                  {/* Leaves Taken */}
                  <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/60 rounded-2xl p-3.5 text-center flex flex-col justify-between shadow-2xs">
                    <span className="text-xs text-amber-900 dark:text-amber-300 font-bold uppercase tracking-wider block">
                      Leaves
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-400 my-1">
                      2
                    </span>
                    <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 block">
                      Sanctioned
                    </span>
                  </div>

                  {/* Half Days */}
                  <div className="bg-slate-100/80 dark:bg-[#182232] border border-slate-200 dark:border-[#263346] rounded-2xl p-3.5 text-center flex flex-col justify-between shadow-2xs">
                    <span className="text-xs text-slate-800 dark:text-slate-300 font-bold uppercase tracking-wider block">
                      Half Days
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white my-1">
                      0
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                      0 hrs cut
                    </span>
                  </div>

                  {/* Overtime */}
                  <div className="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/90 dark:border-blue-800/60 rounded-2xl p-3.5 text-center flex flex-col justify-between shadow-2xs">
                    <span className="text-xs text-blue-900 dark:text-blue-300 font-bold uppercase tracking-wider block">
                      Overtime
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-blue-700 dark:text-blue-400 my-1">
                      6 hrs
                    </span>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 block">
                      +₹600 allowance
                    </span>
                  </div>
                </div>

                {/* Biometric Sync Status Bar */}
                <div className="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-200 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="block font-bold">Biometric Attendance Synced</strong>
                    <span className="text-emerald-700 dark:text-emerald-300 text-[11px] block truncate">
                      Punched in today at <strong>08:58 AM</strong> at {staff.propertyName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Phase 3 Roadmap Card */}
              <div className="p-4 sm:p-5 bg-linear-to-r from-brand-obsidian to-slate-900 dark:from-[#111622] dark:to-[#182232] text-white rounded-2xl shadow-sm border border-slate-800 dark:border-[#222E42]">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-brand-lime" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Smart Payroll & Biometric Turnstile Sync (Phase 3 Roadmap)
                  </h4>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  This attendance card is prepared for live biometric turnstile syncing, facial recognition logs, and automated salary deductions in the upcoming release.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL INFORMATION */}
          {activeTab === "personal" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-50/80 dark:bg-[#111622] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-[#222E42]">
                <h3 className="text-xs font-bold text-brand-charcoal dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand-muted dark:text-slate-400" />
                  Contact & Personal Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Primary Mobile</label>
                    <div className="mt-1">
                      <a
                        href={`tel:${staff.phone}`}
                        className="font-bold text-brand-charcoal dark:text-white hover:underline flex items-center gap-1.5 text-sm"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        {staff.phone}
                      </a>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Alternate Mobile</label>
                    <div className="mt-1 font-semibold text-brand-charcoal dark:text-slate-200 text-sm">
                      {staff.alternatePhone ? (
                        <a href={`tel:${staff.alternatePhone}`} className="hover:underline">
                          {staff.alternatePhone}
                        </a>
                      ) : (
                        <span className="text-brand-muted dark:text-slate-500 italic font-normal text-xs">
                          Not provided
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Email Address</label>
                    <div className="mt-1 font-semibold text-brand-charcoal dark:text-slate-200">
                      {staff.email ? (
                        <a
                          href={`mailto:${staff.email}`}
                          className="hover:underline text-blue-600 dark:text-blue-400 flex items-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          {staff.email}
                        </a>
                      ) : (
                        <span className="text-brand-muted dark:text-slate-500 italic font-normal">Not provided</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Date of Birth</label>
                    <div className="mt-1 font-semibold text-brand-charcoal dark:text-slate-200">
                      {staff.dob ? (
                        new Date(staff.dob).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      ) : (
                        <span className="text-brand-muted dark:text-slate-500 italic font-normal">Not recorded</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Gender</label>
                    <div className="mt-1 font-semibold text-brand-charcoal dark:text-slate-200">
                      {staff.gender || <span className="text-brand-muted dark:text-slate-500 italic font-normal">Not specified</span>}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Blood Group</label>
                    <div className="mt-1">
                      {staff.bloodGroup ? (
                        <span className="px-2.5 py-0.5 rounded-md font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                          {staff.bloodGroup}
                        </span>
                      ) : (
                        <span className="text-brand-muted dark:text-slate-500 italic font-normal">Not recorded</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="bg-slate-50/80 dark:bg-[#111622] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-[#222E42]">
                <h3 className="text-xs font-bold text-brand-charcoal dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-muted dark:text-slate-400" />
                  Residential Addresses
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Current Address</label>
                    <p className="mt-1 text-brand-charcoal dark:text-slate-200 font-semibold leading-relaxed">
                      {staff.currentAddress || (
                        <span className="text-brand-muted dark:text-slate-500 italic font-normal">
                          No current address recorded
                        </span>
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Permanent Address</label>
                    <p className="mt-1 text-brand-charcoal dark:text-slate-200 font-semibold leading-relaxed">
                      {staff.permanentAddress || (
                        <span className="text-brand-muted dark:text-slate-500 italic font-normal">
                          Same as current address
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EMPLOYMENT INFORMATION */}
          {activeTab === "employment" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-50/80 dark:bg-[#111622] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-[#222E42]">
                <h3 className="text-xs font-bold text-brand-charcoal dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-brand-muted dark:text-slate-400" />
                  Designation & Property Assignment
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Role / Title</label>
                    <div className="mt-1 font-bold text-brand-charcoal dark:text-white text-sm flex items-center gap-1.5">
                      {ROLE_ICONS[staff.role]}
                      <span>{staff.customRoleTitle || staff.role}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Department</label>
                    <div className="mt-1 font-semibold text-brand-charcoal dark:text-slate-200">
                      {staff.department}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Assigned Property</label>
                    <div className="mt-1 font-semibold text-brand-charcoal dark:text-slate-200 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {staff.propertyName}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Employment Type</label>
                    <div className="mt-1 font-semibold text-brand-charcoal dark:text-slate-200 capitalize">
                      {staff.employmentType.replace("_", " ")}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Shift Timing</label>
                    <div className="mt-1 font-semibold text-brand-charcoal dark:text-slate-200 capitalize flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{staff.shiftTiming} Shift</span>
                      {staff.customShiftDetails && (
                        <span className="text-[11px] text-brand-muted dark:text-slate-400">
                          ({staff.customShiftDetails})
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Reporting Manager</label>
                    <div className="mt-1 font-semibold text-brand-charcoal dark:text-slate-200">
                      {staff.reportingManager || "Property Owner / Direct"}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Official Joining Date</label>
                    <div className="mt-1 font-bold text-brand-charcoal dark:text-white">
                      {new Date(staff.joiningDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="bg-slate-50/80 dark:bg-[#111622] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-[#222E42]">
                <h3 className="text-xs font-bold text-brand-charcoal dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-muted dark:text-slate-400" />
                  Key Responsibilities & Scope of Duties
                </h3>
                <p className="text-xs text-brand-charcoal dark:text-slate-200 font-medium leading-relaxed">
                  {staff.responsibilities || (
                    <span className="text-brand-muted dark:text-slate-500 italic">No specific responsibilities recorded.</span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: SALARY BREAKDOWN & BANK DETAILS */}
          {activeTab === "salary" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Net Salary Highlight Card */}
              <div className="bg-brand-obsidian dark:bg-[#151D2A] text-white rounded-2xl p-5 shadow-sm border border-transparent dark:border-[#263346]">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                    Net Monthly Compensation
                  </span>
                  <span className="text-xs font-bold bg-brand-lime text-brand-obsidian px-2.5 py-0.5 rounded-full">
                    Cycle: {staff.salaryPaymentType.toUpperCase()}
                  </span>
                </div>
                <div className="text-3xl font-black text-white flex items-center gap-1">
                  <span>₹{netSalary.toLocaleString("en-IN")}</span>
                  <span className="text-sm font-normal text-white/60">/ month</span>
                </div>
                <p className="text-[11px] text-white/60 mt-1">
                  Calculated: Base Salary + Allowances + Bonus - Deductions
                </p>
              </div>

              {/* Salary Breakdown */}
              <div className="bg-slate-50/80 dark:bg-[#111622] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-[#222E42]">
                <h3 className="text-xs font-bold text-brand-charcoal dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-brand-muted dark:text-slate-400" />
                  Monthly Payout Breakdown
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-200 dark:border-[#1E2638]">
                    <span className="text-brand-muted dark:text-slate-400">Base Monthly Salary</span>
                    <span className="font-bold text-brand-charcoal dark:text-slate-200">
                      ₹{baseSalary.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-200 dark:border-[#1E2638]">
                    <span className="text-brand-muted dark:text-slate-400">Additional Allowance (Food / Mobile)</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      + ₹{allowances.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-200 dark:border-[#1E2638]">
                    <span className="text-brand-muted dark:text-slate-400">Performance Bonus / Overtime</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      + ₹{bonus.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-200 dark:border-[#1E2638]">
                    <span className="text-brand-muted dark:text-slate-400">Monthly Deductions (PF / Advance)</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                      - ₹{deductions.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-sm font-black">
                    <span className="text-brand-charcoal dark:text-white">Total Net Take-Home</span>
                    <span className="text-brand-charcoal dark:text-white">₹{netSalary.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {staff.salaryPaymentDate && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-[#1E2638] text-xs text-brand-muted dark:text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Disbursement scheduled on the <strong className="text-brand-charcoal dark:text-white">{staff.salaryPaymentDate}th</strong> of every calendar month.
                    </span>
                  </div>
                )}
              </div>

              {/* Bank Account Details */}
              <div className="bg-slate-50/80 dark:bg-[#111622] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-[#222E42]">
                <h3 className="text-xs font-bold text-brand-charcoal dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-brand-muted dark:text-slate-400" />
                  Bank & Payment Transfer Details
                </h3>

                {staff.bankDetails ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Bank Name</label>
                      <div className="mt-1 font-bold text-brand-charcoal dark:text-slate-200">
                        {staff.bankDetails.bankName || "—"}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Account Holder</label>
                      <div className="mt-1 font-semibold text-brand-charcoal dark:text-slate-200">
                        {staff.bankDetails.accountHolderName || staff.name}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Account Number</label>
                      <div className="mt-1 font-mono font-bold text-brand-charcoal dark:text-slate-200 tracking-wider">
                        {staff.bankDetails.accountNumber}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">IFSC Code</label>
                      <div className="mt-1 font-mono font-bold text-brand-charcoal dark:text-slate-200">
                        {staff.bankDetails.ifscCode}
                      </div>
                    </div>

                    {staff.bankDetails.upiId && (
                      <div className="sm:col-span-2">
                        <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">UPI ID</label>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-brand-charcoal dark:text-slate-200 bg-white dark:bg-[#182232] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#263346]">
                            {staff.bankDetails.upiId}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyUpi(staff.bankDetails?.upiId || "")}
                            className="p-1 rounded-lg text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1E293B] transition-colors"
                            title="Copy UPI ID"
                          >
                            {copiedUpi ? (
                              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-brand-muted dark:text-slate-400 italic">
                    No bank details added for this staff member. You can edit the profile to provide bank account and IFSC.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: EMERGENCY CONTACT */}
          {activeTab === "emergency" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl p-4 sm:p-5 border border-rose-200 dark:border-rose-900/60">
                <h3 className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  Primary Emergency Contact
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">Contact Person Name</label>
                    <div className="mt-1 font-black text-rose-950 dark:text-rose-100 text-base">
                      {staff.emergencyContact.name}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">Relationship</label>
                    <div className="mt-1">
                      <span className="px-2.5 py-0.5 rounded-md font-bold bg-white dark:bg-[#151D2A] text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900/60 shadow-2xs">
                        {staff.emergencyContact.relationship}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">Emergency Mobile</label>
                    <div className="mt-1">
                      <a
                        href={`tel:${staff.emergencyContact.primaryPhone}`}
                        className="font-black text-rose-950 dark:text-rose-100 hover:underline flex items-center gap-1.5 text-base"
                      >
                        <Phone className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        {staff.emergencyContact.primaryPhone}
                      </a>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">Alternate Emergency Phone</label>
                    <div className="mt-1 font-semibold text-rose-900 dark:text-rose-200">
                      {staff.emergencyContact.alternatePhone ? (
                        <a
                          href={`tel:${staff.emergencyContact.alternatePhone}`}
                          className="hover:underline flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-rose-500" />
                          {staff.emergencyContact.alternatePhone}
                        </a>
                      ) : (
                        <span className="text-rose-400 dark:text-rose-500 italic">None provided</span>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">Emergency Address</label>
                    <p className="mt-1 text-rose-950 dark:text-rose-100 font-semibold leading-relaxed">
                      {staff.emergencyContact.address || (
                        <span className="text-rose-400 dark:text-rose-500 italic">Address not recorded</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Call Button Action */}
                <div className="mt-4 pt-3 border-t border-rose-200/80 dark:border-rose-900/60">
                  <a
                    href={`tel:${staff.emergencyContact.primaryPhone}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Emergency Contact Now</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DOCUMENTS & KYC */}
          {activeTab === "documents" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-brand-charcoal dark:text-white uppercase tracking-wider">
                  Attached KYC & Legal Verification
                </h3>
                <span className="text-xs font-semibold text-brand-muted dark:text-slate-400">
                  {staff.documents.length} File(s)
                </span>
              </div>

              {staff.documents.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-[#111622] rounded-2xl border border-slate-200 dark:border-[#222E42]">
                  <FileText className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-xs font-bold text-brand-charcoal dark:text-white">
                    No Documents Uploaded
                  </p>
                  <p className="text-xs text-brand-muted dark:text-slate-400 mt-0.5">
                    No Aadhaar, PAN, or employment contracts have been attached yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {staff.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-[#222E42] bg-white dark:bg-[#111622] hover:border-slate-300 dark:hover:border-[#2E3C54] transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#182232] border border-slate-200 dark:border-[#263346] flex items-center justify-center text-brand-charcoal dark:text-slate-200 shrink-0">
                          <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-brand-charcoal dark:text-white truncate">
                            {doc.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-brand-muted dark:text-slate-400 mt-0.5">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {doc.type}
                            </span>
                            <span>•</span>
                            <span>{doc.fileSize}</span>
                            <span>•</span>
                            <span>
                              {new Date(doc.uploadDate).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors"
                          title="Preview Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            alert(`Simulated download for: ${doc.name}`);
                          }}
                          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors"
                          title="Download Document"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Doc Preview Modal */}
              {previewDoc && (
                <div className="fixed inset-0 z-60 bg-brand-obsidian/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-[#111622] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-brand-border dark:border-[#222E42]">
                    <div className="flex items-center justify-between pb-3 border-b border-brand-border dark:border-[#1E2638]">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-charcoal dark:text-slate-200" />
                        <h4 className="text-sm font-bold text-brand-charcoal dark:text-white truncate">
                          {previewDoc.name}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(null)}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#182232] text-slate-500 dark:text-slate-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="py-8 text-center bg-slate-50 dark:bg-[#151D2A] rounded-xl my-4 border border-slate-200 dark:border-[#263346]">
                      <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-brand-charcoal dark:text-white">
                        {previewDoc.type}
                      </p>
                      <p className="text-xs text-brand-muted dark:text-slate-400 mt-1">
                        Encrypted copy ({previewDoc.fileSize})
                      </p>
                      <p className="text-[11px] text-brand-muted dark:text-slate-400 mt-0.5">
                        Uploaded on {previewDoc.uploadDate}
                      </p>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(null)}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-[#182232] hover:bg-slate-200 dark:hover:bg-[#222E42] text-brand-charcoal dark:text-slate-200"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          alert(`Simulated download for: ${previewDoc.name}`);
                          setPreviewDoc(null);
                        }}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-brand-obsidian text-brand-lime dark:bg-brand-lime dark:text-[#0A0D12] flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download File
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: EXPERIENCE & NOTES */}
          {activeTab === "additional" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-50/80 dark:bg-[#111622] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-[#222E42]">
                <h3 className="text-xs font-bold text-brand-charcoal dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-brand-muted dark:text-slate-400" />
                  Experience & Background
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Prior Experience</label>
                    <div className="mt-1 font-bold text-brand-charcoal dark:text-white">
                      {staff.previousExperience || "—"}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Previous Employer</label>
                    <div className="mt-1 font-semibold text-brand-charcoal dark:text-slate-200">
                      {staff.previousEmployer || "—"}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">Qualifications</label>
                    <div className="mt-1 font-semibold text-brand-charcoal dark:text-slate-200">
                      {staff.qualifications || "Standard Vocational / High School"}
                    </div>
                  </div>

                  {staff.skills && staff.skills.length > 0 && (
                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-brand-muted dark:text-slate-400 font-medium mb-1.5 block">
                        Skills & Competencies
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {staff.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-white dark:bg-[#182232] text-brand-charcoal dark:text-slate-200 border border-slate-200 dark:border-[#263346] px-3 py-1 rounded-xl font-bold shadow-2xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes & Directives */}
              <div className="bg-slate-50/80 dark:bg-[#111622] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-[#222E42]">
                <h3 className="text-xs font-bold text-brand-charcoal dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-muted dark:text-slate-400" />
                  Owner Notes & Directives
                </h3>
                <p className="text-xs text-brand-charcoal dark:text-slate-200 font-medium leading-relaxed">
                  {staff.notes || (
                    <span className="text-brand-muted dark:text-slate-500 italic">No internal notes added.</span>
                  )}
                </p>

                {staff.specialInstructions && (
                  <div className="mt-3 p-3 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200">
                    <strong className="block text-[11px] uppercase tracking-wider text-amber-950 dark:text-amber-300 mb-0.5">
                      Special Directive:
                    </strong>
                    {staff.specialInstructions}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Mobile Bottom Action Bar (Fixed for Mobile Screens) */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-[#111622]/95 backdrop-blur-md border-t border-brand-border dark:border-[#222E42] p-3 sm:hidden flex items-center gap-2 z-20 shadow-lg">
          <button
            type="button"
            onClick={() => onEdit(staff)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-brand-obsidian text-brand-lime dark:bg-brand-lime dark:text-[#0A0D12] font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-transform"
          >
            <Edit2 className="w-3.5 h-3.5 text-brand-lime dark:text-[#0A0D12]" />
            <span>Edit Profile</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeStatus(staff)}
            className="py-2.5 px-3.5 rounded-xl bg-slate-100 dark:bg-[#182232] hover:bg-slate-200 dark:hover:bg-[#222E42] text-brand-charcoal dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-[#263346] flex items-center justify-center gap-1.5 transition-colors"
            title="Change Status"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Status</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(staff)}
            className="py-2.5 px-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-900/80 flex items-center justify-center gap-1.5 transition-colors"
            title="Delete Staff"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </div>
  );
}
