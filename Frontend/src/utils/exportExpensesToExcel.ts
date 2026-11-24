import * as XLSX from "xlsx";
import { Expense } from "@/types/expense";

interface ExportOptions {
  propertyName?: string;
  dateRangeLabel?: string;
}

/**
 * Exports expense records to an Excel (.xlsx) file.
 * Formats columns cleanly with proper headers, currency values, and metadata.
 */
export const exportExpensesToExcel = (
  expenses: Expense[],
  options?: ExportOptions
) => {
  if (!expenses || expenses.length === 0) {
    alert("No expense records available to export.");
    return false;
  }

  // 1. Prepare formatted data for Excel worksheet
  const formattedData = expenses.map((item, index) => {
    return {
      "S.No": index + 1,
      "Expense ID": item.id,
      "Date": item.date,
      "Title / Description": item.title,
      "Category": item.category,
      "Property / Scope": item.propertyName,
      "Payment Mode": item.paymentMode,
      "Amount (₹)": item.amount,
      "Remark / Notes": item.remark || "-",
      "Has Receipt": item.attachment ? "Yes" : "No",
      "Recorded By": item.recordedBy || "Owner",
    };
  });

  // 2. Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Set column widths for polished presentation
  worksheet["!cols"] = [
    { wch: 6 },  // S.No
    { wch: 12 }, // Expense ID
    { wch: 12 }, // Date
    { wch: 28 }, // Title
    { wch: 22 }, // Category
    { wch: 24 }, // Property
    { wch: 14 }, // Payment Mode
    { wch: 14 }, // Amount
    { wch: 28 }, // Remark
    { wch: 12 }, // Has Receipt
    { wch: 16 }, // Recorded By
  ];

  // 3. Create workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses Report");

  // 4. Generate clean filename
  const now = new Date();
  const dateStamp = now.toISOString().split("T")[0];
  const propertySlug = (options?.propertyName || "All_Properties")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .substring(0, 20);

  const filename = `StayManage_Expenses_${propertySlug}_${dateStamp}.xlsx`;

  // 5. Trigger download
  XLSX.writeFile(workbook, filename);
  return true;
};
