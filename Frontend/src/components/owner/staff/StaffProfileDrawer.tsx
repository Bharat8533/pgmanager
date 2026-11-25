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
  ExternalLink,
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
  ChevronRight,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StaffProfileDrawerProps {
  staff: StaffMember | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (staff: StaffMember) => void;
  onChangeStatus: (staff: StaffMember) => void;
  onDelete: (staff: StaffMember) => void;
}

type TabType =
  | "personal"
  | "employment"
  | "salary"
  | "emergency"
  | "documents"
  | "additional"
  | "attendance";

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  active: {
    label: "Active",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  on_leave: {
    label: "On Leave",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500",
  },
  inactive: {
    label: "Inactive",
    badgeClass: "bg-neutral-100 text-neutral-600 border-neutral-200",
    dotClass: "bg-neutral-400",
  },
};

export function StaffProfileDrawer({
  staff,
  isOpen,
  onClose,
  onEdit,
  onChangeStatus,
  onDelete,
}: StaffProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<StaffDocument | null>(null);

  if (!isOpen || !staff) return null;

  const statusInfo = STATUS_CONFIG[staff.status] || STATUS_CONFIG.inactive;

  // Calculate Net Monthly Salary
  const baseSalary = staff.monthlySalary || 0;
  const allowances = staff.additionalAllowance || 0;
  const bonus = staff.bonus || 0;
  const deductions = staff.deductions || 0;
  const netSalary = baseSalary + allowances + bonus - deductions;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "personal", label: "Personal", icon: <User className="w-3.5 h-3.5" /> },
    { id: "employment", label: "Employment", icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: "salary", label: "Salary & Bank", icon: <IndianRupee className="w-3.5 h-3.5" /> },
    { id: "emergency", label: "Emergency", icon: <HeartPulse className="w-3.5 h-3.5" /> },
    {
      id: "documents",
      label: `Documents (${staff.documents.length})`,
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    { id: "additional", label: "Experience", icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: "attendance", label: "Attendance (Beta)", icon: <UserCheck className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-obsidian/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <aside
        aria-label={`Staff Profile: ${staff.name}`}
        className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-200"
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-brand-border bg-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
              Staff Member Profile
            </span>
            <span className="text-[11px] font-mono text-brand-muted bg-brand-offwhite px-2 py-0.5 rounded border border-brand-border">
              {staff.employeeId}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(staff)}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-brand-offwhite hover:bg-neutral-200 text-brand-charcoal text-xs font-semibold flex items-center gap-1.5 transition-colors border border-brand-border"
              title="Edit Staff Member"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeStatus(staff)}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-brand-offwhite hover:bg-neutral-200 text-brand-charcoal text-xs font-semibold flex items-center gap-1.5 transition-colors border border-brand-border"
              title="Change Status"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Status</span>
            </button>
            <button
              type="button"
              onClick={() => onDelete(staff)}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-200"
              title="Delete Staff Member"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>
            <div className="w-px h-5 bg-brand-border mx-1" />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-brand-offwhite text-brand-muted hover:text-brand-charcoal transition-colors"
              title="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Identity Card */}
        <div className="p-4 sm:p-5 bg-linear-to-b from-brand-offwhite/50 to-white border-b border-brand-border shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {staff.profilePhoto ? (
              <img
                src={staff.profilePhoto}
                alt={staff.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-brand-obsidian text-brand-lime font-bold text-xl flex items-center justify-center shrink-0 shadow-sm">
                {staff.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-brand-charcoal truncate">
                  {staff.name}
                </h2>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                    statusInfo.badgeClass
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", statusInfo.dotClass)} />
                  {statusInfo.label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-brand-muted">
                <div className="flex items-center gap-1 text-brand-charcoal font-medium">
                  <Briefcase className="w-3.5 h-3.5 text-brand-muted" />
                  <span>{staff.customRoleTitle || staff.role}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-brand-muted" />
                  <span>{staff.propertyName}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-muted" />
                  <span>
                    Joined{" "}
                    {new Date(staff.joiningDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 border-b border-brand-border bg-white flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 py-3 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors",
                  isActive
                    ? "border-brand-obsidian text-brand-charcoal"
                    : "border-transparent text-brand-muted hover:text-brand-charcoal hover:border-brand-border"
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: PERSONAL INFORMATION */}
          {activeTab === "personal" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-brand-offwhite/40 rounded-2xl p-4 border border-brand-border/60">
                <h3 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand-muted" />
                  Contact & Identity
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Primary Phone</label>
                    <div className="mt-1 flex items-center gap-2">
                      <a
                        href={`tel:${staff.phone}`}
                        className="font-semibold text-brand-charcoal hover:underline flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        {staff.phone}
                      </a>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Alternate Phone</label>
                    <div className="mt-1 text-brand-charcoal font-medium">
                      {staff.alternatePhone ? (
                        <a
                          href={`tel:${staff.alternatePhone}`}
                          className="hover:underline flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-brand-muted" />
                          {staff.alternatePhone}
                        </a>
                      ) : (
                        <span className="text-brand-muted italic">Not provided</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Email Address</label>
                    <div className="mt-1 text-brand-charcoal font-medium">
                      {staff.email ? (
                        <a
                          href={`mailto:${staff.email}`}
                          className="hover:underline flex items-center gap-1.5 text-blue-600"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          {staff.email}
                        </a>
                      ) : (
                        <span className="text-brand-muted italic">Not provided</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Date of Birth</label>
                    <div className="mt-1 text-brand-charcoal font-medium">
                      {staff.dob ? (
                        new Date(staff.dob).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      ) : (
                        <span className="text-brand-muted italic">Not recorded</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Gender</label>
                    <div className="mt-1 text-brand-charcoal font-medium">
                      {staff.gender || <span className="text-brand-muted italic">Not specified</span>}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Blood Group</label>
                    <div className="mt-1 text-brand-charcoal font-semibold">
                      {staff.bloodGroup ? (
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          {staff.bloodGroup}
                        </span>
                      ) : (
                        <span className="text-brand-muted italic font-normal">Not recorded</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="bg-brand-offwhite/40 rounded-2xl p-4 border border-brand-border/60">
                <h3 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-muted" />
                  Residential Addresses
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Current Address</label>
                    <p className="mt-1 text-brand-charcoal font-medium leading-relaxed">
                      {staff.currentAddress || (
                        <span className="text-brand-muted italic">No current address recorded</span>
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Permanent Address</label>
                    <p className="mt-1 text-brand-charcoal font-medium leading-relaxed">
                      {staff.permanentAddress || (
                        <span className="text-brand-muted italic">Same as current address or not recorded</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMPLOYMENT INFORMATION */}
          {activeTab === "employment" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-brand-offwhite/40 rounded-2xl p-4 border border-brand-border/60">
                <h3 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-brand-muted" />
                  Job Designation & Department
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Assigned Role</label>
                    <div className="mt-1 font-semibold text-brand-charcoal text-sm">
                      {staff.role}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Custom Designation</label>
                    <div className="mt-1 font-medium text-brand-charcoal">
                      {staff.customRoleTitle || "—"}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Department</label>
                    <div className="mt-1 font-medium text-brand-charcoal">
                      {staff.department}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Assigned Property</label>
                    <div className="mt-1 font-medium text-brand-charcoal flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-brand-muted" />
                      {staff.propertyName}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Employment Type</label>
                    <div className="mt-1 font-medium text-brand-charcoal capitalize">
                      {staff.employmentType.replace("_", " ")}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Shift Timing</label>
                    <div className="mt-1 font-medium text-brand-charcoal capitalize flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-muted" />
                      <span>{staff.shiftTiming} Shift</span>
                      {staff.customShiftDetails && (
                        <span className="text-[11px] text-brand-muted">
                          ({staff.customShiftDetails})
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Reporting Manager</label>
                    <div className="mt-1 font-medium text-brand-charcoal">
                      {staff.reportingManager || "Property Owner / Direct"}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Joining Date</label>
                    <div className="mt-1 font-semibold text-brand-charcoal">
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
              <div className="bg-brand-offwhite/40 rounded-2xl p-4 border border-brand-border/60">
                <h3 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-brand-muted" />
                  Key Responsibilities & Scope of Work
                </h3>
                <p className="text-xs text-brand-charcoal font-medium leading-relaxed">
                  {staff.responsibilities || (
                    <span className="text-brand-muted italic">No specific responsibilities listed.</span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: SALARY BREAKDOWN & BANK DETAILS */}
          {activeTab === "salary" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Net Salary Highlight Card */}
              <div className="bg-brand-obsidian text-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                    Net Monthly Compensation
                  </span>
                  <span className="text-xs font-medium bg-brand-lime text-brand-obsidian px-2.5 py-0.5 rounded-full font-bold">
                    Pay Cycle: {staff.salaryPaymentType.toUpperCase()}
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-white flex items-center gap-1">
                  <span>₹{netSalary.toLocaleString("en-IN")}</span>
                  <span className="text-sm font-normal text-white/60">/ month</span>
                </div>
                <p className="text-[11px] text-white/60 mt-1">
                  Calculated as: Base Salary + Allowances + Bonus - Deductions
                </p>
              </div>

              {/* Salary Breakdown */}
              <div className="bg-brand-offwhite/40 rounded-2xl p-4 border border-brand-border/60">
                <h3 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-brand-muted" />
                  Salary Breakdown
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-brand-border/60">
                    <span className="text-brand-muted">Base Monthly Salary</span>
                    <span className="font-semibold text-brand-charcoal">
                      ₹{baseSalary.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-brand-border/60">
                    <span className="text-brand-muted">Additional Allowance (Food / Travel / Mobile)</span>
                    <span className="font-semibold text-emerald-600">
                      + ₹{allowances.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-brand-border/60">
                    <span className="text-brand-muted">Performance Bonus / Overtime</span>
                    <span className="font-semibold text-emerald-600">
                      + ₹{bonus.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-brand-border/60">
                    <span className="text-brand-muted">Deductions (PF / Advance / Penalties)</span>
                    <span className="font-semibold text-rose-600">
                      - ₹{deductions.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-sm font-bold">
                    <span className="text-brand-charcoal">Total Net Payout</span>
                    <span className="text-brand-charcoal">₹{netSalary.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {staff.salaryPaymentDate && (
                  <div className="mt-3 pt-3 border-t border-brand-border/60 text-[11px] text-brand-muted flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Disbursement scheduled on the <strong>{staff.salaryPaymentDate}th</strong> of every calendar month.</span>
                  </div>
                )}

                {staff.salaryNotes && (
                  <div className="mt-2 text-[11px] text-brand-muted bg-white p-2 rounded-xl border border-brand-border">
                    <strong>Note:</strong> {staff.salaryNotes}
                  </div>
                )}
              </div>

              {/* Bank Account Details */}
              <div className="bg-brand-offwhite/40 rounded-2xl p-4 border border-brand-border/60">
                <h3 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-brand-muted" />
                  Bank & Payment Transfer Details
                </h3>

                {staff.bankDetails ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-[11px] text-brand-muted font-medium">Bank Name</label>
                      <div className="mt-1 font-semibold text-brand-charcoal">
                        {staff.bankDetails.bankName || "—"}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-brand-muted font-medium">Account Holder Name</label>
                      <div className="mt-1 font-medium text-brand-charcoal">
                        {staff.bankDetails.accountHolderName || staff.name}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-brand-muted font-medium">Account Number</label>
                      <div className="mt-1 font-mono font-bold text-brand-charcoal tracking-wider">
                        {staff.bankDetails.accountNumber}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-brand-muted font-medium">IFSC Code</label>
                      <div className="mt-1 font-mono font-bold text-brand-charcoal">
                        {staff.bankDetails.ifscCode}
                      </div>
                    </div>

                    {staff.bankDetails.upiId && (
                      <div className="sm:col-span-2">
                        <label className="text-[11px] text-brand-muted font-medium">UPI ID</label>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-brand-charcoal bg-white px-2.5 py-1 rounded-lg border border-brand-border">
                            {staff.bankDetails.upiId}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(staff.bankDetails?.upiId || "")}
                            className="p-1 rounded-lg text-brand-muted hover:text-brand-charcoal hover:bg-neutral-200 transition-colors"
                            title="Copy UPI ID"
                          >
                            {copiedUpi ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-brand-muted italic">
                    No bank details added for this staff member. You can edit the profile to provide bank account and IFSC.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: EMERGENCY CONTACT */}
          {activeTab === "emergency" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-brand-offwhite/40 rounded-2xl p-4 border border-brand-border/60">
                <h3 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  Primary Emergency Contact
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Contact Person Name</label>
                    <div className="mt-1 font-bold text-brand-charcoal text-sm">
                      {staff.emergencyContact.name}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Relationship</label>
                    <div className="mt-1 font-semibold text-brand-charcoal">
                      <span className="px-2 py-0.5 rounded bg-brand-offwhite border border-brand-border">
                        {staff.emergencyContact.relationship}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Emergency Mobile Number</label>
                    <div className="mt-1">
                      <a
                        href={`tel:${staff.emergencyContact.primaryPhone}`}
                        className="font-bold text-brand-charcoal hover:underline flex items-center gap-1.5 text-sm"
                      >
                        <Phone className="w-4 h-4 text-rose-600" />
                        {staff.emergencyContact.primaryPhone}
                      </a>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Alternate Emergency Number</label>
                    <div className="mt-1 font-medium text-brand-charcoal">
                      {staff.emergencyContact.alternatePhone ? (
                        <a
                          href={`tel:${staff.emergencyContact.alternatePhone}`}
                          className="hover:underline flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-brand-muted" />
                          {staff.emergencyContact.alternatePhone}
                        </a>
                      ) : (
                        <span className="text-brand-muted italic">None provided</span>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-brand-muted font-medium">Emergency Contact Address</label>
                    <p className="mt-1 text-brand-charcoal font-medium leading-relaxed">
                      {staff.emergencyContact.address || (
                        <span className="text-brand-muted italic">Address not recorded</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DOCUMENTS & IDENTITY */}
          {activeTab === "documents" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                  Attached KYC & Legal Verification
                </h3>
                <span className="text-[11px] text-brand-muted">
                  {staff.documents.length} File(s)
                </span>
              </div>

              {staff.documents.length === 0 ? (
                <div className="p-8 text-center bg-brand-offwhite/50 rounded-2xl border border-brand-border">
                  <FileText className="w-8 h-8 mx-auto text-brand-muted mb-2" />
                  <p className="text-xs font-semibold text-brand-charcoal">
                    No Documents Uploaded
                  </p>
                  <p className="text-[11px] text-brand-muted mt-0.5">
                    No Aadhaar, PAN, or employment documents have been attached yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {staff.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-brand-border bg-white hover:border-brand-charcoal/30 transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-brand-offwhite border border-brand-border flex items-center justify-center text-brand-charcoal shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-brand-charcoal truncate">
                            {doc.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-brand-muted mt-0.5">
                            <span className="font-medium text-brand-charcoal/80">
                              {doc.type}
                            </span>
                            <span>•</span>
                            <span>{doc.fileSize}</span>
                            <span>•</span>
                            <span>
                              Uploaded {new Date(doc.uploadDate).toLocaleDateString("en-IN", {
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
                          className="p-1.5 rounded-lg text-brand-muted hover:text-brand-charcoal hover:bg-brand-offwhite transition-colors"
                          title="Preview Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            alert(`Simulated download for: ${doc.name}`);
                          }}
                          className="p-1.5 rounded-lg text-brand-muted hover:text-brand-charcoal hover:bg-brand-offwhite transition-colors"
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
                <div className="fixed inset-0 z-60 bg-brand-obsidian/60 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-brand-border">
                    <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-charcoal" />
                        <h4 className="text-sm font-bold text-brand-charcoal truncate">
                          {previewDoc.name}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(null)}
                        className="p-1 rounded-lg hover:bg-brand-offwhite text-brand-muted"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="py-8 text-center bg-brand-offwhite/40 rounded-xl my-4 border border-brand-border/60">
                      <FileText className="w-12 h-12 text-brand-muted mx-auto mb-2" />
                      <p className="text-xs font-semibold text-brand-charcoal">
                        {previewDoc.type}
                      </p>
                      <p className="text-[11px] text-brand-muted mt-1">
                        Mock preview of encrypted file ({previewDoc.fileSize})
                      </p>
                      <p className="text-[10px] text-brand-muted mt-0.5">
                        Uploaded on {previewDoc.uploadDate}
                      </p>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(null)}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-brand-offwhite hover:bg-neutral-200 text-brand-charcoal"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          alert(`Simulated download for: ${previewDoc.name}`);
                          setPreviewDoc(null);
                        }}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-brand-obsidian text-brand-lime flex items-center gap-1.5"
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

          {/* TAB 6: EXPERIENCE & NOTES */}
          {activeTab === "additional" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-brand-offwhite/40 rounded-2xl p-4 border border-brand-border/60">
                <h3 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-brand-muted" />
                  Experience & Qualifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Prior Experience</label>
                    <div className="mt-1 font-semibold text-brand-charcoal">
                      {staff.previousExperience || "—"}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-brand-muted font-medium">Previous Employer</label>
                    <div className="mt-1 font-medium text-brand-charcoal">
                      {staff.previousEmployer || "—"}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-brand-muted font-medium">Qualifications & Certifications</label>
                    <div className="mt-1 font-medium text-brand-charcoal">
                      {staff.qualifications || "Standard Vocational / High School"}
                    </div>
                  </div>

                  {staff.skills && staff.skills.length > 0 && (
                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-brand-muted font-medium mb-1.5 block">
                        Skills & Competencies
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {staff.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-white text-brand-charcoal border border-brand-border px-2.5 py-1 rounded-lg font-medium shadow-2xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Internal Notes & Special Instructions */}
              <div className="bg-brand-offwhite/40 rounded-2xl p-4 border border-brand-border/60">
                <h3 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-muted" />
                  Internal Owner Notes & Special Instructions
                </h3>
                <p className="text-xs text-brand-charcoal font-medium leading-relaxed">
                  {staff.notes || (
                    <span className="text-brand-muted italic">No internal notes added for this employee.</span>
                  )}
                </p>

                {staff.specialInstructions && (
                  <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-800">
                    <strong className="block text-[11px] uppercase tracking-wider text-amber-900 mb-0.5">
                      Special Directive:
                    </strong>
                    {staff.specialInstructions}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: ATTENDANCE UI PLACEHOLDER (SECTION 12) */}
          {activeTab === "attendance" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-brand-offwhite/40 rounded-2xl p-4 border border-brand-border/60">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    Monthly Attendance Overview (Current Cycle)
                  </h3>
                  <span className="text-[10px] font-semibold bg-brand-lime text-brand-obsidian px-2 py-0.5 rounded-full">
                    Shift: {staff.shiftTiming.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                  <div className="bg-white p-3 rounded-xl border border-brand-border text-center">
                    <span className="text-[10px] text-brand-muted font-medium block">Present Days</span>
                    <span className="text-lg font-bold text-emerald-600">24</span>
                    <span className="text-[9px] text-brand-muted block mt-0.5">92.3% rate</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-brand-border text-center">
                    <span className="text-[10px] text-brand-muted font-medium block">Leaves Taken</span>
                    <span className="text-lg font-bold text-amber-600">2</span>
                    <span className="text-[9px] text-brand-muted block mt-0.5">Approved</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-brand-border text-center">
                    <span className="text-[10px] text-brand-muted font-medium block">Half Days</span>
                    <span className="text-lg font-bold text-brand-charcoal">0</span>
                    <span className="text-[9px] text-brand-muted block mt-0.5">0 hours cut</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-brand-border text-center">
                    <span className="text-[10px] text-brand-muted font-medium block">Overtime</span>
                    <span className="text-lg font-bold text-blue-600">6 hrs</span>
                    <span className="text-[9px] text-brand-muted block mt-0.5">+₹600 allowance</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Biometric Punch Synced:</strong> Logged in today at <strong>08:58 AM</strong> at {staff.propertyName}.
                  </span>
                </div>

                <div className="p-4 bg-brand-obsidian/5 border border-brand-border rounded-xl">
                  <h4 className="text-xs font-semibold text-brand-charcoal mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-lime" />
                    Biometric & Smart Payroll Integration (Phase 3 Roadmap)
                  </h4>
                  <p className="text-[11px] text-brand-muted leading-relaxed">
                    This attendance card is prepared for real-time biometric turnstile syncing, facial recognition check-in logs, and automated salary deductions in the upcoming Phase 3 release.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
