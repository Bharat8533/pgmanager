import * as XLSX from "xlsx";
import { Complaint } from "@/types/complaint";
import { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES, COMPLAINT_STATUSES } from "@/constants/mockComplaintsData";

export interface ExportComplaintsOptions {
  propertyName?: string;
  filterLabel?: string;
}

/**
 * Exports filtered complaints into a structured, executive-ready Excel workbook (.xlsx).
 */
export function exportComplaintsToExcel(
  complaints: Complaint[],
  options?: ExportComplaintsOptions
): boolean {
  if (!complaints || complaints.length === 0) {
    return false;
  }

  const workbook = XLSX.utils.book_new();

  const formattedRows = complaints.map((c, index) => {
    const categoryLabel = COMPLAINT_CATEGORIES[c.category]?.label || c.category;
    const priorityLabel = COMPLAINT_PRIORITIES[c.priority]?.label || c.priority;
    const statusLabel = COMPLAINT_STATUSES[c.status]?.label || c.status;

    const formattedSubmittedDate = new Date(c.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const formattedUpdatedDate = new Date(c.updatedAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const formattedResolvedDate = c.resolvedAt
      ? new Date(c.resolvedAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

    return {
      "S.No": index + 1,
      "Complaint ID": c.complaintNumber,
      "Property": c.propertyName,
      "Room No": c.roomNumber,
      "Resident Name": c.residentName,
      "Contact Phone": c.residentPhone,
      "Category": categoryLabel,
      "Title": c.title,
      "Full Description": c.description,
      "Priority": priorityLabel.toUpperCase(),
      "Status": statusLabel.toUpperCase(),
      "Submitted Date": formattedSubmittedDate,
      "Last Updated": formattedUpdatedDate,
      "Resolved Date": formattedResolvedDate,
      "Resolution Remarks": c.resolutionRemarks || "-",
      "Rejection Reason": c.rejectionReason || "-",
      "Internal Notes Count": c.internalNotes?.length || 0,
      "Attachments Count": c.attachments?.length || 0,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedRows);

  worksheet["!cols"] = [
    { wch: 6 },  // S.No
    { wch: 16 }, // Complaint ID
    { wch: 28 }, // Property
    { wch: 10 }, // Room No
    { wch: 20 }, // Resident Name
    { wch: 16 }, // Contact Phone
    { wch: 24 }, // Category
    { wch: 35 }, // Title
    { wch: 55 }, // Full Description
    { wch: 12 }, // Priority
    { wch: 14 }, // Status
    { wch: 20 }, // Submitted Date
    { wch: 20 }, // Last Updated
    { wch: 20 }, // Resolved Date
    { wch: 45 }, // Resolution Remarks
    { wch: 45 }, // Rejection Reason
    { wch: 14 }, // Notes Count
    { wch: 14 }, // Attachments Count
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Complaints Register");

  // Summary statistics sheet
  const summaryRows = [
    { Metric: "Total Complaints Exported", Count: complaints.length },
    { Metric: "New Complaints (Awaiting Review)", Count: complaints.filter((c) => c.status === "new").length },
    { Metric: "Pending Complaints (In Progress)", Count: complaints.filter((c) => c.status === "pending").length },
    { Metric: "Resolved Complaints", Count: complaints.filter((c) => c.status === "resolved").length },
    { Metric: "Rejected Complaints", Count: complaints.filter((c) => c.status === "rejected").length },
    { Metric: "Urgent Priority Count", Count: complaints.filter((c) => c.priority === "urgent").length },
    { Metric: "High Priority Count", Count: complaints.filter((c) => c.priority === "high").length },
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
  summarySheet["!cols"] = [{ wch: 35 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary Metrics");

  const todayStr = new Date().toISOString().split("T")[0];
  const filename = `PGMaster_Complaints_Report_${todayStr}.xlsx`;

  XLSX.writeFile(workbook, filename);
  return true;
}
