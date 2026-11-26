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
import { cn, getNameInitials } from "@/lib/utils";

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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active</span>
        </span>
      );
    case "on_leave":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
          <Clock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
          <span>On Leave</span>
        </span>
      );
    case "inactive":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <UserX className="w-2.5 h-2.5 text-slate-500 dark:text-slate-400" />
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

  if (staffList.length === 0) {
    return (
      <div className="bg-white dark:bg-[#111622] rounded-2xl border border-brand-border/80 dark:border-[#222E42] p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#182232] text-brand-muted dark:text-slate-400 flex items-center justify-center mx-auto mb-3">
          <UserCheck className="w-7 h-7 text-slate-500 dark:text-slate-400" />
        </div>
        <h3 className="text-sm font-bold text-brand-charcoal dark:text-white">No Staff Members Found</h3>
        <p className="text-xs text-brand-muted dark:text-slate-400 mt-1 max-w-sm mx-auto">
          No employee records match your active search filters. Try resetting the filters or add a new staff member.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#111622] rounded-2xl border border-brand-border/80 dark:border-[#222E42] shadow-xs overflow-hidden w-full min-w-0 max-w-full">
      <div className="overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x w-full [scrollbar-width:thin]">
        <table className="w-full text-left text-xs min-w-[880px] border-collapse">
          <thead>
            <tr className="bg-slate-50/90 dark:bg-[#151D2A] border-b border-brand-border dark:border-[#1E2638] text-[10px] font-bold uppercase text-brand-muted dark:text-slate-400 tracking-wider">
              <th className="py-3 px-4">Staff Member & ID</th>
              <th className="py-3 px-4">Role & Dept</th>
              <th className="py-3 px-4">Assigned Property</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Joining Date</th>
              <th className="py-3 px-4 text-right">Monthly Salary</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1E2638]">
            {staffList.map((staff) => (
              <tr
                key={staff.id}
                className="hover:bg-slate-50/70 dark:hover:bg-[#182232]/80 transition-colors group cursor-pointer"
                onClick={() => onViewStaff(staff)}
              >
                {/* 1. Staff Member Avatar, Name & ID */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-obsidian dark:bg-[#182232] text-brand-lime font-black flex items-center justify-center text-xs flex-shrink-0 shadow-2xs border border-slate-200/80 dark:border-[#263346] tracking-wider">
                      {getNameInitials(staff.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-bold text-brand-charcoal dark:text-white truncate text-xs group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {staff.name}
                        </p>
                        <span className="font-mono font-semibold text-[10px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#182232] px-1.5 py-0.2 rounded border border-slate-200/80 dark:border-[#263346]">
                          {staff.employeeId}
                        </span>
                      </div>
                      <p className="text-[10px] text-brand-muted dark:text-slate-400 truncate mt-0.5">
                        {staff.email || "No email on record"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* 2. Role & Dept */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-[#151D2A] border border-slate-200 dark:border-[#263346] flex items-center justify-center shrink-0">
                      {getRoleIcon(staff.role)}
                    </div>
                    <div>
                      <span className="font-bold text-brand-charcoal dark:text-slate-200 block text-xs">
                        {staff.customRoleTitle || staff.role}
                      </span>
                      <span className="text-[10px] text-brand-muted dark:text-slate-400 block">
                        {staff.department}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 3. Assigned Property */}
                <td className="py-3.5 px-4 text-brand-charcoal dark:text-slate-200 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Building2 className="w-3.5 h-3.5 text-brand-muted dark:text-slate-400 flex-shrink-0" />
                    <span className="font-medium truncate max-w-[180px]" title={staff.propertyName}>
                      {staff.propertyName}
                    </span>
                  </div>
                </td>

                {/* 4. Contact */}
                <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={`tel:${staff.phone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-charcoal dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{staff.phone}</span>
                  </a>
                </td>

                {/* 5. Joining Date */}
                <td className="py-3.5 px-4 whitespace-nowrap text-brand-muted dark:text-slate-400 text-xs">
                  {new Date(staff.joiningDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                {/* 6. Monthly Salary */}
                <td className="py-3.5 px-4 whitespace-nowrap text-right">
                  <p className="font-extrabold text-brand-charcoal dark:text-white text-xs">
                    {formatINR(staff.monthlySalary)}
                  </p>
                  <p className="text-[10px] text-brand-muted dark:text-slate-400 font-medium capitalize">
                    {staff.salaryPaymentType}
                  </p>
                </td>

                {/* 7. Status */}
                <td className="py-3.5 px-4 whitespace-nowrap text-center">
                  {getStatusBadge(staff.status)}
                </td>

                {/* 8. Action Buttons */}
                <td className="py-3.5 px-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onViewStaff(staff)}
                      className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#151D2A] hover:bg-slate-100 dark:hover:bg-[#1E293B] text-brand-charcoal dark:text-slate-200 text-[11px] font-bold border border-slate-200 dark:border-[#263346] transition-colors"
                      title="View Profile"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditStaff(staff)}
                      className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#151D2A] hover:bg-slate-100 dark:hover:bg-[#1E293B] text-brand-charcoal dark:text-slate-200 text-[11px] font-bold border border-slate-200 dark:border-[#263346] transition-colors"
                      title="Edit Staff Info"
                    >
                      <Edit className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    </button>

                    {/* Quick Dropdown Menu */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenMenuId(openMenuId === staff.id ? null : staff.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1E293B] text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white transition-colors"
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
                          <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-[#151D2A] rounded-xl shadow-xl border border-brand-border dark:border-[#263346] py-1 z-50 animate-fadeIn text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onViewStaff(staff);
                              }}
                              className="w-full px-3 py-2 text-xs font-semibold text-brand-charcoal dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1E293B] flex items-center gap-2"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span>View Profile</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onEditStaff(staff);
                              }}
                              className="w-full px-3 py-2 text-xs font-semibold text-brand-charcoal dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1E293B] flex items-center gap-2"
                            >
                              <Edit className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                              <span>Edit Details</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onChangeStatus(staff);
                              }}
                              className="w-full px-3 py-2 text-xs font-semibold text-brand-charcoal dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1E293B] flex items-center gap-2"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              <span>Change Status</span>
                            </button>
                            <div className="my-1 border-t border-slate-100 dark:border-[#1E2638]" />
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onDeleteStaff(staff);
                              }}
                              className="w-full px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
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
