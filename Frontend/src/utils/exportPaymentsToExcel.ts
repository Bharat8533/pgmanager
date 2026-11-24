import * as XLSX from "xlsx";
import {
  PaymentRecord,
  RentLedgerItem,
  ResidentDepositRecord,
  FinancialSummaryStats,
  CAReportOptions,
} from "@/types/payment";

interface ExportDataset {
  payments: PaymentRecord[];
  ledger: RentLedgerItem[];
  deposits: ResidentDepositRecord[];
  summaryStats: FinancialSummaryStats;
  options: CAReportOptions;
}

/**
 * Generates and downloads a structured, CA-Ready Excel (.xlsx) workbook
 * containing transaction-level records, ledger reconciliation, and summaries.
 */
export const exportCAPaymentsReport = ({
  payments,
  ledger,
  deposits,
  summaryStats,
  options,
}: ExportDataset) => {
  const workbook = XLSX.utils.book_new();
  const { propertyName, dateRangeLabel, reportType } = options;

  // 1. PAYMENT TRANSACTIONS SHEET
  if (reportType === "payment_transactions" || reportType === "consolidated_summary") {
    const paymentRows = payments.map((p, idx) => ({
      "S.No": idx + 1,
      "Payment ID": p.id,
      "Date": p.paymentDate,
      "Resident Name": p.residentName,
      "Phone Number": p.residentPhone,
      "Room / Bed": `${p.roomNumber} (${p.bedNumber})`,
      "Amount Received (₹)": p.amount,
      "Payment Mode": p.paymentMethod,
      "Transaction Ref / UTR": p.transactionReference || "-",
      "Payment Purpose": p.paymentType,
      "Billing Month": p.billingMonth,
      "Status": p.status.toUpperCase(),
      "Remarks / Notes": p.notes || "-",
    }));

    // Add total row at bottom
    const totalPaymentsAmt = payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);

    paymentRows.push({
      "S.No": "" as any,
      "Payment ID": "TOTAL RECEIVED",
      "Date": "",
      "Resident Name": "",
      "Phone Number": "",
      "Room / Bed": "",
      "Amount Received (₹)": totalPaymentsAmt,
      "Payment Mode": "" as any,
      "Transaction Ref / UTR": "",
      "Payment Purpose": "" as any,
      "Billing Month": "",
      "Status": "",
      "Remarks / Notes": "",
    });

    const paymentSheet = XLSX.utils.json_to_sheet(paymentRows);
    paymentSheet["!cols"] = [
      { wch: 6 },  // S.No
      { wch: 16 }, // Payment ID
      { wch: 12 }, // Date
      { wch: 22 }, // Resident
      { wch: 16 }, // Phone
      { wch: 14 }, // Room/Bed
      { wch: 18 }, // Amount
      { wch: 14 }, // Mode
      { wch: 26 }, // Ref / UTR
      { wch: 16 }, // Purpose
      { wch: 16 }, // Month
      { wch: 12 }, // Status
      { wch: 24 }, // Notes
    ];
    XLSX.utils.book_append_sheet(workbook, paymentSheet, "Payment Transactions");
  }

  // 2. RENT LEDGER SHEET
  if (reportType === "rent_ledger" || reportType === "consolidated_summary") {
    const ledgerRows = ledger.map((item, idx) => ({
      "S.No": idx + 1,
      "Ledger ID": item.id,
      "Resident Name": item.residentName,
      "Phone Number": item.residentPhone,
      "Room / Bed": `${item.roomNumber} (${item.bedNumber})`,
      "Billing Month": item.billingMonth,
      "Rent Billed (₹)": item.rentAmount,
      "Amount Paid (₹)": item.paidAmount,
      "Pending Due (₹)": item.pendingAmount,
      "Due Date": item.dueDate,
      "Payment Status": item.paymentStatus.toUpperCase(),
      "Last Payment Date": item.lastPaymentDate || "No Payment",
    }));

    const totalBilled = ledger.reduce((sum, i) => sum + i.rentAmount, 0);
    const totalPaid = ledger.reduce((sum, i) => sum + i.paidAmount, 0);
    const totalPending = ledger.reduce((sum, i) => sum + i.pendingAmount, 0);

    ledgerRows.push({
      "S.No": "" as any,
      "Ledger ID": "LEDGER TOTALS",
      "Resident Name": "",
      "Phone Number": "",
      "Room / Bed": "",
      "Billing Month": "",
      "Rent Billed (₹)": totalBilled,
      "Amount Paid (₹)": totalPaid,
      "Pending Due (₹)": totalPending,
      "Due Date": "",
      "Payment Status": "",
      "Last Payment Date": "",
    });

    const ledgerSheet = XLSX.utils.json_to_sheet(ledgerRows);
    ledgerSheet["!cols"] = [
      { wch: 6 },
      { wch: 16 },
      { wch: 22 },
      { wch: 16 },
      { wch: 14 },
      { wch: 16 },
      { wch: 16 },
      { wch: 16 },
      { wch: 16 },
      { wch: 12 },
      { wch: 16 },
      { wch: 18 },
    ];
    XLSX.utils.book_append_sheet(workbook, ledgerSheet, "Rent Ledger");
  }

  // 3. OUTSTANDING DUES SHEET
  if (reportType === "outstanding_dues" || reportType === "consolidated_summary") {
    const outstandingItems = ledger.filter((item) => item.pendingAmount > 0);
    const now = new Date();

    const outstandingRows = outstandingItems.map((item, idx) => {
      const dueDate = new Date(item.dueDate);
      const diffDays = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysOverdue = diffDays > 0 ? diffDays : 0;

      let agingBucket = "Not Yet Due";
      if (daysOverdue > 30) agingBucket = "> 30 Days Overdue";
      else if (daysOverdue >= 16) agingBucket = "16–30 Days Overdue";
      else if (daysOverdue >= 8) agingBucket = "8–15 Days Overdue";
      else if (daysOverdue >= 1) agingBucket = "1–7 Days Overdue";

      return {
        "S.No": idx + 1,
        "Resident Name": item.residentName,
        "Phone Number": item.residentPhone,
        "Room / Bed": `${item.roomNumber} (${item.bedNumber})`,
        "Billing Month": item.billingMonth,
        "Total Rent (₹)": item.rentAmount,
        "Amount Received (₹)": item.paidAmount,
        "Outstanding Due (₹)": item.pendingAmount,
        "Due Date": item.dueDate,
        "Days Overdue": daysOverdue,
        "Aging Category": agingBucket,
        "Status": item.paymentStatus.toUpperCase(),
      };
    });

    const totalOutstandingAmt = outstandingItems.reduce((sum, i) => sum + i.pendingAmount, 0);
    outstandingRows.push({
      "S.No": "" as any,
      "Resident Name": "TOTAL OUTSTANDING",
      "Phone Number": "",
      "Room / Bed": "",
      "Billing Month": "",
      "Total Rent (₹)": "" as any,
      "Amount Received (₹)": "" as any,
      "Outstanding Due (₹)": totalOutstandingAmt,
      "Due Date": "",
      "Days Overdue": "" as any,
      "Aging Category": "",
      "Status": "",
    });

    const duesSheet = XLSX.utils.json_to_sheet(outstandingRows);
    duesSheet["!cols"] = [
      { wch: 6 },
      { wch: 22 },
      { wch: 16 },
      { wch: 14 },
      { wch: 16 },
      { wch: 16 },
      { wch: 18 },
      { wch: 18 },
      { wch: 12 },
      { wch: 14 },
      { wch: 20 },
      { wch: 14 },
    ];
    XLSX.utils.book_append_sheet(workbook, duesSheet, "Outstanding Dues");
  }

  // 4. SECURITY DEPOSITS SHEET
  if (reportType === "security_deposits" || reportType === "consolidated_summary") {
    const depositRows = deposits.map((d, idx) => ({
      "S.No": idx + 1,
      "Resident Name": d.residentName,
      "Phone Number": d.residentPhone,
      "Room / Bed": `${d.roomNumber} (${d.bedNumber})`,
      "Deposit Received (₹)": d.depositReceived,
      "Date Received": d.dateReceived,
      "Adjustments (₹)": d.adjustments,
      "Refunds Given (₹)": d.refunds,
      "Current Balance Held (₹)": d.currentBalance,
      "Notes / Reason": d.notes || "-",
    }));

    const totalDepositHeld = deposits.reduce((sum, d) => sum + d.currentBalance, 0);
    const totalReceived = deposits.reduce((sum, d) => sum + d.depositReceived, 0);
    const totalRefunded = deposits.reduce((sum, d) => sum + d.refunds, 0);

    depositRows.push({
      "S.No": "" as any,
      "Resident Name": "TOTAL DEPOSIT LIABILITY",
      "Phone Number": "",
      "Room / Bed": "",
      "Deposit Received (₹)": totalReceived,
      "Date Received": "",
      "Adjustments (₹)": "" as any,
      "Refunds Given (₹)": totalRefunded,
      "Current Balance Held (₹)": totalDepositHeld,
      "Notes / Reason": "",
    });

    const depositSheet = XLSX.utils.json_to_sheet(depositRows);
    depositSheet["!cols"] = [
      { wch: 6 },
      { wch: 22 },
      { wch: 16 },
      { wch: 14 },
      { wch: 20 },
      { wch: 14 },
      { wch: 16 },
      { wch: 16 },
      { wch: 22 },
      { wch: 30 },
    ];
    XLSX.utils.book_append_sheet(workbook, depositSheet, "Security Deposits");
  }

  // 5. PAYMENT METHOD SUMMARY SHEET
  if (reportType === "payment_methods" || reportType === "consolidated_summary") {
    const validPayments = payments.filter((p) => p.status === "completed");
    const methodMap: Record<string, { count: number; amount: number }> = {};

    validPayments.forEach((p) => {
      const mode = p.paymentMethod;
      if (!methodMap[mode]) methodMap[mode] = { count: 0, amount: 0 };
      methodMap[mode].count += 1;
      methodMap[mode].amount += p.amount;
    });

    const totalAmt = validPayments.reduce((s, p) => s + p.amount, 0);
    const methodRows = Object.entries(methodMap).map(([method, data]) => ({
      "Payment Method": method,
      "Transaction Count": data.count,
      "Total Collected (₹)": data.amount,
      "Percentage Share (%)": totalAmt > 0 ? Math.round((data.amount / totalAmt) * 100) : 0,
    }));

    methodRows.push({
      "Payment Method": "TOTAL COLLECTIONS",
      "Transaction Count": validPayments.length,
      "Total Collected (₹)": totalAmt,
      "Percentage Share (%)": 100,
    });

    const methodSheet = XLSX.utils.json_to_sheet(methodRows);
    methodSheet["!cols"] = [{ wch: 20 }, { wch: 18 }, { wch: 20 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(workbook, methodSheet, "Payment Methods");
  }

  // 6. EXECUTIVE FINANCIAL SUMMARY SHEET
  if (reportType === "consolidated_summary") {
    const summaryRows = [
      { Metric: "Property Name", Value: propertyName },
      { Metric: "Report Period / Filter Scope", Value: dateRangeLabel },
      { Metric: "Report Generation Date", Value: new Date().toLocaleDateString("en-IN") },
      { Metric: "Currency", Value: "INR (₹)" },
      { Metric: "", Value: "" },
      { Metric: "--- RENT OPERATIONS ---", Value: "" },
      { Metric: "Total Rent Billed / Expected", Value: `₹${summaryStats.totalRentExpected.toLocaleString("en-IN")}` },
      { Metric: "Total Rent Actually Collected", Value: `₹${summaryStats.totalRentCollected.toLocaleString("en-IN")}` },
      { Metric: "Total Pending / Outstanding Rent", Value: `₹${summaryStats.totalPendingRent.toLocaleString("en-IN")}` },
      { Metric: "Rent Collection Rate", Value: `${summaryStats.collectionRate}%` },
      { Metric: "", Value: "" },
      { Metric: "--- PAYMENT MODE BREAKDOWN ---", Value: "" },
      { Metric: "Total Cash Collections", Value: `₹${summaryStats.cashCollections.toLocaleString("en-IN")}` },
      { Metric: "Total Online Collections (UPI, NetBanking, Cards)", Value: `₹${summaryStats.onlineCollections.toLocaleString("en-IN")}` },
      { Metric: "", Value: "" },
      { Metric: "--- DEPOSIT LIABILITY (NOT RENT REVENUE) ---", Value: "" },
      { Metric: "Current Security Deposit Liability Held", Value: `₹${summaryStats.securityDepositHeld.toLocaleString("en-IN")}` },
    ];

    const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
    summarySheet["!cols"] = [{ wch: 40 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Executive Summary");
  }

  // Generate Filename: StayManage_[PropertyName]_Payment_Report_[Range].xlsx
  const safePropName = propertyName.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 25);
  const nowStamp = new Date().toISOString().split("T")[0];
  const safeDateLabel = dateRangeLabel.replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `StayManage_${safePropName}_Payment_Report_${safeDateLabel}_${nowStamp}.xlsx`;

  XLSX.writeFile(workbook, filename);
  return true;
};
