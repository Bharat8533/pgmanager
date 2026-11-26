"use client";

import React, { useState } from "react";
import { StaffMember, StaffStatus, StaffRole } from "@/types/staff";
import {
  Eye,
  Edit,
  MoreVertical,
  Building2,
  Phone,
  Shield,
  Utensils,
  Sparkles,
  Wrench,
  UserCheck,
  Calculator,
  User,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  UserX,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StaffTableProps {
  staffList: StaffMember[];
  onViewStaff: (staff: StaffMember) => void;
  onEditStaff: (staff: StaffMember) => void;
  onChangeStatus: (staff: StaffMember) => void;
  onDeleteStaff: (staff: StaffMember) => void;
}

export function getRoleIcon(role: StaffRole) {
  switch (role) {
    case "Manager":
      return <UserCheck className="w-3.5 h-3.5 text-blue-600" />;
    case "Warden":
      return <Shield className="w-3.5 h-3.5 text-indigo-600" />;
    case "Security Guard":
      return <Shield className="w-3.5 h-3.5 text-purple-600" />;
    case "Cook / Chef":
      return <Utensils className="w-3.5 h-3.5 text-amber-600" />;
    case "Housekeeping":
      return <Sparkles className="w-3.5 h-3.5 text-emerald-600" />;
    case "Maintenance Staff":
      return <Wrench className="w-3.5 h-3.5 text-orange-600" />;
    case "Receptionist":
      return <User className="w-3.5 h-3.5 text-teal-600" />;
    case "Accountant":
      return <Calculator className="w-3.5 h-3.5 text-indigo-700" />;
    default:
      return <User className="w-3.5 h-3.5 text-slate-600" />;
  }
}

export function getStatusBadge(status: StaffStatus) {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active</span>
        </span>
      );
    case "on_leave":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-2.5 h-2.5 text-amber-600" />
          <span>On Leave</span>
        </span>
      );
    case "inactive":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
          <UserX className="w-2.5 h-2.5 text-slate-500" />
          <span>Inactive</span>
        </span>
      );
  }
}

export function StaffTable({
  staffList,
  onViewStaff,
  onEditStaff,
  onChangeStatus,
  onDeleteStaff,
}: StaffTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const formatINR = (val: number) => "₹" + val.toLocaleString("en-IN");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (staffList.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-brand-border/80 p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-brand-muted flex items-center justify-center mx-auto mb-3">
          <UserCheck className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-bold text-brand-charcoal">No Staff Members Found</h3>
        <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
          No employee records match your active search filters. Try resetting the filters or add a new staff member.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-border/80 shadow-xs overflow-hidden w-full min-w-0 max-w-full">
      <div className="overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x w-full [scrollbar-width:thin]">
        <table className="w-full text-left text-xs min-w-[880px] border-collapse">
          <thead>
            <tr className="bg-slate-50/90 border-b border-brand-border text-[10px] font-bold uppercase text-brand-muted tracking-wider">
              <th className="py-3 px-4">Staff Member</th>
              <th className="py-3 px-4">Employee ID</th>
              <th className="py-3 px-4">Role & Dept</th>
              <th className="py-3 px-4">Assigned Property</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Joining Date</th>
              <th className="py-3 px-4 text-right">Monthly Salary</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staffList.map((staff) => (
              <tr
                key={staff.id}
                className="hover:bg-slate-50/70 dark:hover:bg-[#1A2332] transition-colors group cursor-pointer"
                onClick={() => onViewStaff(staff)}
              >
                {/* 1. Staff Member Avatar & Name */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {staff.profilePhoto ? (
                      <img
                        src={staff.profilePhoto}
                        alt={staff.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-brand-border flex-shrink-0 shadow-2xs"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center text-xs flex-shrink-0 shadow-2xs">
                        {getInitials(staff.name)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-brand-charcoal truncate text-xs group-hover:text-blue-600 transition-colors">
                        {staff.name}
                      </p>
                      <p className="text-[10px] text-brand-muted truncate">
                        {staff.email || "No email on record"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* 2. Employee ID */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="font-mono font-bold text-[11px] text-brand-charcoal bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80">
                    {staff.employeeId}
                  </span>
                </td>

                {/* 3. Role & Dept */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    {getRoleIcon(staff.role)}
                    <div>
                      <span className="font-bold text-brand-charcoal block">
                        {staff.customRoleTitle || staff.role}
                      </span>
                      <span className="text-[10px] text-brand-muted block">
                        {staff.department}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 4. Assigned Property */}
                <td className="py-3 px-4 text-brand-charcoal whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Building2 className="w-3.5 h-3.5 text-brand-muted flex-shrink-0" />
                    <span className="font-medium truncate max-w-[180px]" title={staff.propertyName}>
                      {staff.propertyName}
                    </span>
                  </div>
                </td>

                {/* 5. Contact */}
                <td className="py-3 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={`tel:${staff.phone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-charcoal hover:text-blue-600 transition-colors"
                  >
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>{staff.phone}</span>
                  </a>
                </td>

                {/* 6. Joining Date */}
                <td className="py-3 px-4 whitespace-nowrap text-brand-muted text-xs">
                  {new Date(staff.joiningDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                {/* 7. Monthly Salary */}
                <td className="py-3 px-4 whitespace-nowrap text-right">
                  <p className="font-extrabold text-brand-charcoal text-xs">
                    {formatINR(staff.monthlySalary)}
                  </p>
                  <p className="text-[10px] text-brand-muted font-medium capitalize">
                    {staff.salaryPaymentType}
                  </p>
                </td>

                {/* 8. Status */}
                <td className="py-3 px-4 whitespace-nowrap text-center">
                  {getStatusBadge(staff.status)}
                </td>

                {/* 9. Action Buttons */}
                <td className="py-3 px-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onViewStaff(staff)}
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-brand-charcoal text-[11px] font-bold border border-slate-200 transition-colors"
                      title="View Profile"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditStaff(staff)}
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-brand-charcoal text-[11px] font-bold border border-slate-200 transition-colors"
                      title="Edit Staff Info"
                    >
                      <Edit className="w-3.5 h-3.5 text-amber-600" />
                    </button>

                    {/* Quick Dropdown Menu */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenMenuId(openMenuId === staff.id ? null : staff.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-brand-muted hover:text-brand-charcoal transition-colors"
                        aria-label="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenuId === staff.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-brand-border py-1 z-50 animate-fadeIn text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onViewStaff(staff);
                              }}
                              className="w-full px-3 py-2 text-xs font-semibold text-brand-charcoal hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-600" />
                              <span>View Profile</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onEditStaff(staff);
                              }}
                              className="w-full px-3 py-2 text-xs font-semibold text-brand-charcoal hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Edit className="w-3.5 h-3.5 text-amber-600" />
                              <span>Edit Details</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onChangeStatus(staff);
                              }}
                              className="w-full px-3 py-2 text-xs font-semibold text-brand-charcoal hover:bg-slate-50 flex items-center gap-2"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Change Status</span>
                            </button>
                            <div className="my-1 border-t border-slate-100" />
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onDeleteStaff(staff);
                              }}
                              className="w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Delete Record</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
