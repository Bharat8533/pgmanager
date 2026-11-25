"use client";

import React from "react";
import { StaffMember, StaffRole } from "@/types/staff";
import {
  User,
  Shield,
  ChefHat,
  Sparkles,
  Wrench,
  Headphones,
  Calculator,
  Briefcase,
  Phone,
  Building2,
  Calendar,
  IndianRupee,
  MoreVertical,
  Eye,
  Edit2,
  RefreshCw,
  Trash2,
  Users,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StaffMobileListProps {
  staffList: StaffMember[];
  onViewProfile: (staff: StaffMember) => void;
  onEditStaff: (staff: StaffMember) => void;
  onChangeStatus: (staff: StaffMember) => void;
  onDeleteStaff: (staff: StaffMember) => void;
  onClearFilters: () => void;
}

const ROLE_ICONS: Record<StaffRole, React.ReactNode> = {
  Manager: <UserCheck className="w-3.5 h-3.5 text-purple-600" />,
  Warden: <Shield className="w-3.5 h-3.5 text-blue-600" />,
  "Security Guard": <Shield className="w-3.5 h-3.5 text-emerald-600" />,
  "Cook / Chef": <ChefHat className="w-3.5 h-3.5 text-amber-600" />,
  Housekeeping: <Sparkles className="w-3.5 h-3.5 text-teal-600" />,
  "Maintenance Staff": <Wrench className="w-3.5 h-3.5 text-orange-600" />,
  Receptionist: <Headphones className="w-3.5 h-3.5 text-indigo-600" />,
  Accountant: <Calculator className="w-3.5 h-3.5 text-cyan-600" />,
  Other: <User className="w-3.5 h-3.5 text-gray-600" />,
};

const STATUS_BADGES: Record<
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

export function StaffMobileList({
  staffList,
  onViewProfile,
  onEditStaff,
  onChangeStatus,
  onDeleteStaff,
  onClearFilters,
}: StaffMobileListProps) {
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  // Close open dropdown on outside tap
  React.useEffect(() => {
    const handleOutsideClick = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener("click", handleOutsideClick);
      return () => document.removeEventListener("click", handleOutsideClick);
    }
  }, [openMenuId]);

  if (staffList.length === 0) {
    return (
      <div className="block md:hidden bg-white border border-brand-border rounded-3xl p-8 text-center shadow-xs">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mb-3">
          <Users className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-brand-charcoal mb-1">
          No Staff Members Found
        </h3>
        <p className="text-xs text-brand-muted max-w-xs mx-auto mb-4 leading-relaxed">
          No employee records match your active search filters. Try modifying or clearing your filter criteria.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="text-xs font-bold text-brand-charcoal bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors border border-slate-200"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="block md:hidden space-y-3">
      {staffList.map((staff) => {
        const statusConfig = STATUS_BADGES[staff.status] || STATUS_BADGES.inactive;
        const isMenuOpen = openMenuId === staff.id;

        return (
          <div
            key={staff.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs relative hover:border-slate-300 transition-all"
          >
            {/* Top row: Avatar, Info, Status, Menu */}
            <div className="flex items-start justify-between gap-2.5 mb-3">
              <div
                className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                onClick={() => onViewProfile(staff)}
              >
                {/* Avatar with Role Badge */}
                <div className="relative shrink-0">
                  {staff.profilePhoto ? (
                    <img
                      src={staff.profilePhoto}
                      alt={staff.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-brand-obsidian text-brand-lime font-black text-sm flex items-center justify-center shadow-2xs">
                      {staff.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md bg-white border border-slate-200 shadow-2xs flex items-center justify-center">
                    {ROLE_ICONS[staff.role]}
                  </div>
                </div>

                {/* Name & Role */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-brand-charcoal text-sm truncate">
                      {staff.name}
                    </h3>
                    <span className="text-[10px] font-mono font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 shrink-0">
                      {staff.employeeId}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-brand-muted mt-0.5 truncate">
                    <span className="font-medium text-slate-700 truncate">
                      {staff.customRoleTitle || staff.role}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="truncate text-slate-500">{staff.propertyName}</span>
                  </div>
                </div>
              </div>

              {/* Status and Action dropdown */}
              <div className="flex items-center gap-1 shrink-0">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border",
                    statusConfig.badgeClass
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", statusConfig.dotClass)} />
                  <span>{statusConfig.label}</span>
                </span>

                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(isMenuOpen ? null : staff.id);
                    }}
                    aria-label={`Actions for ${staff.name}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-charcoal hover:bg-slate-100 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {isMenuOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          onViewProfile(staff);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-brand-charcoal hover:bg-slate-50 transition-colors text-left font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>View Profile</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          onEditStaff(staff);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-brand-charcoal hover:bg-slate-50 transition-colors text-left font-semibold"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Edit Details</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          onChangeStatus(staff);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-brand-charcoal hover:bg-slate-50 transition-colors text-left font-semibold"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Change Status</span>
                      </button>
                      <div className="h-px bg-slate-100 my-1" />
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          onDeleteStaff(staff);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Staff</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-slate-100">
              {/* Tap to Call */}
              <div className="flex items-center gap-1.5 truncate">
                <a
                  href={`tel:${staff.phone}`}
                  className="font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200/70 inline-flex items-center gap-1.5 transition-colors truncate text-xs"
                >
                  <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{staff.phone}</span>
                </a>
              </div>

              {/* Salary */}
              <div className="flex items-center justify-end gap-1 font-black text-brand-charcoal text-xs">
                <span className="text-[11px] text-slate-500 font-medium">Salary:</span>
                <span className="text-emerald-700 font-extrabold">
                  ₹{staff.monthlySalary.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-slate-400 font-normal">/mo</span>
              </div>

              {/* Joining Date */}
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] truncate mt-0.5">
                <Calendar className="w-3 h-3 shrink-0 text-slate-400" />
                <span className="truncate">
                  Joined{" "}
                  {new Date(staff.joiningDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Shift */}
              <div className="text-right text-[11px] font-semibold text-slate-600 capitalize truncate mt-0.5">
                {staff.shiftTiming} shift
              </div>
            </div>

            {/* Bottom Action Row */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onViewProfile(staff)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-charcoal text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>View Full Profile</span>
              </button>
              <button
                type="button"
                onClick={() => onEditStaff(staff)}
                className="py-2 px-3.5 rounded-xl bg-white hover:bg-slate-50 text-brand-charcoal text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
