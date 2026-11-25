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
  Manager: <Briefcase className="w-3.5 h-3.5 text-purple-600" />,
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
      <div className="block md:hidden bg-white border border-brand-border rounded-2xl p-8 text-center shadow-xs">
        <div className="w-14 h-14 mx-auto rounded-full bg-brand-offwhite border border-brand-border flex items-center justify-center text-brand-muted mb-3">
          <Users className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-brand-charcoal mb-1">
          No Staff Members Found
        </h3>
        <p className="text-xs text-brand-muted max-w-xs mx-auto mb-4">
          No staff records match your current filter or search criteria. Try modifying or clearing your filters.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="text-xs font-medium text-brand-charcoal bg-brand-offwhite hover:bg-neutral-200 px-4 py-2 rounded-xl transition-colors border border-brand-border"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="block md:hidden space-y-3.5">
      {staffList.map((staff) => {
        const statusConfig = STATUS_BADGES[staff.status] || STATUS_BADGES.inactive;
        const isMenuOpen = openMenuId === staff.id;

        return (
          <div
            key={staff.id}
            className="bg-white border border-brand-border rounded-2xl p-4 shadow-xs relative hover:border-brand-charcoal/30 transition-all"
          >
            {/* Top row: Avatar, Info, Status, Menu */}
            <div className="flex items-start justify-between gap-2.5 mb-3">
              <div
                className="flex items-center gap-3 cursor-pointer min-w-0"
                onClick={() => onViewProfile(staff)}
              >
                {staff.profilePhoto ? (
                  <img
                    src={staff.profilePhoto}
                    alt={staff.name}
                    className="w-11 h-11 rounded-full object-cover border border-brand-border shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-brand-obsidian text-brand-lime font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {staff.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-semibold text-brand-charcoal text-sm truncate">
                      {staff.name}
                    </h3>
                    <span className="text-[10px] font-mono text-brand-muted bg-brand-offwhite px-1.5 py-0.5 rounded border border-brand-border">
                      {staff.employeeId}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-brand-muted mt-0.5 truncate">
                    {ROLE_ICONS[staff.role]}
                    <span className="font-medium text-brand-charcoal">
                      {staff.customRoleTitle || staff.role}
                    </span>
                    <span>•</span>
                    <span className="truncate">{staff.propertyName}</span>
                  </div>
                </div>
              </div>

              {/* Status and Action dropdown */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                    statusConfig.badgeClass
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", statusConfig.dotClass)} />
                  {statusConfig.label}
                </span>

                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(isMenuOpen ? null : staff.id);
                    }}
                    aria-label={`Actions for ${staff.name}`}
                    className="p-1.5 rounded-lg text-brand-muted hover:text-brand-charcoal hover:bg-brand-offwhite transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {isMenuOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-lg border border-brand-border py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          onViewProfile(staff);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-brand-charcoal hover:bg-brand-offwhite transition-colors text-left font-medium"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-muted" />
                        View Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          onEditStaff(staff);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-brand-charcoal hover:bg-brand-offwhite transition-colors text-left font-medium"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-brand-muted" />
                        Edit Details
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          onChangeStatus(staff);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-brand-charcoal hover:bg-brand-offwhite transition-colors text-left font-medium"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-brand-muted" />
                        Change Status
                      </button>
                      <div className="h-px bg-brand-border my-1" />
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          onDeleteStaff(staff);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Staff
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-brand-border/60">
              {/* Phone */}
              <div className="flex items-center gap-1.5 text-brand-muted truncate">
                <Phone className="w-3.5 h-3.5 shrink-0 text-brand-charcoal/70" />
                <a
                  href={`tel:${staff.phone}`}
                  className="font-medium text-brand-charcoal hover:underline truncate"
                >
                  {staff.phone}
                </a>
              </div>

              {/* Salary */}
              <div className="flex items-center justify-end gap-1 font-semibold text-brand-charcoal">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                <span>₹{staff.monthlySalary.toLocaleString("en-IN")}</span>
                <span className="text-[10px] text-brand-muted font-normal">/mo</span>
              </div>

              {/* Joining Date */}
              <div className="flex items-center gap-1.5 text-brand-muted text-[11px] truncate">
                <Calendar className="w-3 h-3 shrink-0" />
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
              <div className="text-right text-[11px] text-brand-muted capitalize truncate">
                {staff.shiftTiming} shift
              </div>
            </div>

            {/* Bottom Quick Button */}
            <div className="mt-3 pt-2.5 border-t border-brand-border/60 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onViewProfile(staff)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-brand-offwhite text-brand-charcoal hover:bg-neutral-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-brand-border"
              >
                <Eye className="w-3.5 h-3.5 text-brand-muted" />
                View Full Profile
              </button>
              <button
                type="button"
                onClick={() => onEditStaff(staff)}
                className="py-1.5 px-3 rounded-xl bg-white text-brand-charcoal hover:bg-brand-offwhite text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-brand-border"
              >
                <Edit2 className="w-3.5 h-3.5 text-brand-muted" />
                Edit
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
