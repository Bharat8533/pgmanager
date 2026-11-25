import * as XLSX from "xlsx";
import { StaffMember } from "@/types/staff";

export interface ExportStaffOptions {
  propertyName?: string;
  filterLabel?: string;
}

/**
 * Exports filtered staff records into a structured Excel workbook (.xlsx).
 */
export function exportStaffToExcel(
  staffList: StaffMember[],
  options?: ExportStaffOptions
): boolean {
  if (!staffList || staffList.length === 0) {
    return false;
  }

  const workbook = XLSX.utils.book_new();

  const formattedRows = staffList.map((s, index) => {
    const netSalary =
      (s.monthlySalary || 0) +
      (s.additionalAllowance || 0) +
      (s.bonus || 0) -
      (s.deductions || 0);

    const formattedJoiningDate = s.joiningDate
      ? new Date(s.joiningDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

    const statusLabel =
      s.status === "active"
        ? "Active"
        : s.status === "on_leave"
        ? "On Leave"
        : "Inactive";

    const employmentTypeLabel =
      s.employmentType === "full_time"
        ? "Full-time"
        : s.employmentType === "part_time"
        ? "Part-time"
        : s.employmentType === "contract"
        ? "Contract"
        : "Temporary";

    return {
      "S.No": index + 1,
      "Employee ID": s.employeeId,
      "Name": s.name,
      "Designation": s.customRoleTitle || s.role,
      "Department": s.department,
      "Assigned Property": s.propertyName,
      "Phone Number": s.phone,
      "Email Address": s.email || "-",
      "Joining Date": formattedJoiningDate,
      "Employment Type": employmentTypeLabel,
      "Shift Timing": s.shiftTiming,
      "Status": statusLabel,
      "Monthly Base Salary (₹)": s.monthlySalary,
      "Allowance (₹)": s.additionalAllowance || 0,
      "Bonus (₹)": s.bonus || 0,
      "Deductions (₹)": s.deductions || 0,
      "Net Estimated Salary (₹)": netSalary,
      "Emergency Contact": `${s.emergencyContact.name} (${s.emergencyContact.relationship}) - ${s.emergencyContact.primaryPhone}`,
      "Bank Account": s.bankDetails?.accountNumber
        ? `•••• •••• ${s.bankDetails.accountNumber.slice(-4)} (${s.bankDetails.bankName})`
        : "-",
      "UPI ID": s.bankDetails?.upiId || "-",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedRows);

  // Set column widths for clean readability
  worksheet["!cols"] = [
    { wch: 6 },  // S.No
    { wch: 14 }, // Employee ID
    { wch: 24 }, // Name
    { wch: 20 }, // Designation
    { wch: 20 }, // Department
    { wch: 30 }, // Assigned Property
    { wch: 16 }, // Phone Number
    { wch: 28 }, // Email Address
    { wch: 14 }, // Joining Date
    { wch: 16 }, // Employment Type
    { wch: 14 }, // Shift Timing
    { wch: 12 }, // Status
    { wch: 22 }, // Base Salary
    { wch: 14 }, // Allowance
    { wch: 12 }, // Bonus
    { wch: 14 }, // Deductions
    { wch: 24 }, // Net Salary
    { wch: 36 }, // Emergency Contact
    { wch: 26 }, // Bank Account
    { wch: 22 }, // UPI ID
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Staff Roster");

  const todayStr = new Date().toISOString().slice(0, 10);
  const propertySuffix = options?.propertyName
    ? `_${options.propertyName.replace(/[^a-zA-Z0-9]/g, "_")}`
    : "";
  const filename = `PG_Master_Staff_Roster${propertySuffix}_${todayStr}.xlsx`;

  XLSX.writeFile(workbook, filename);
  return true;
}
