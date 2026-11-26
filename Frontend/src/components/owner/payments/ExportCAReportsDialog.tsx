"use client";

import React, { useState } from "react";
import {
  X,
  FileSpreadsheet,
  Download,
  Building2,
  Calendar,
  CheckCircle2,
  Shield,
  Layers,
} from "lucide-react";
import { CAReportOptions } from "@/types/payment";

interface ExportCAReportsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: CAReportOptions) => void;
  propertyName: string;
  propertyId: string;
}

export const ExportCAReportsDialog: React.FC<ExportCAReportsDialogProps> = ({
  isOpen,
  onClose,
  onExport,
  propertyName,
  propertyId,
}) => {
  const [reportType, setReportType] = useState<CAReportOptions["reportType"]>("consolidated_summary");
  const [dateRange, setDateRange] = useState("this_month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!isOpen) return null;

  const handleExportSubmit = () => {
    let dateRangeLabel = "This Month";
    if (dateRange === "today") dateRangeLabel = "Today";
    else if (dateRange === "previous_month") dateRangeLabel = "Previous Month";
    else if (dateRange === "this_financial_year") dateRangeLabel = "FY 2026-27";
    else if (dateRange === "custom" && startDate && endDate) dateRangeLabel = `${startDate} to ${endDate}`;

    onExport({
      reportType,
      propertyId,
      propertyName,
      dateRangeLabel,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111622] rounded-3xl border border-[#E2E5DF] dark:border-[#222E42] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F0F2EE] dark:border-[#1E2638] flex items-center justify-between bg-[#FAFAF8] dark:bg-[#0D111A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#171A18] dark:bg-[#1E2638] text-[#C6F36B] dark:text-brand-lime border border-transparent dark:border-[#263346] flex items-center justify-center font-black">
              <FileSpreadsheet className="w-5 h-5 text-[#C6F36B] dark:text-brand-lime" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#171A18] dark:text-white">Export CA Financial Reports</h3>
              <p className="text-xs text-[#777D78] dark:text-slate-400">
                Download structured, reconciliation-ready Excel (.xlsx) spreadsheets for your CA
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#777D78] dark:text-slate-400 hover:text-[#171A18] dark:hover:text-white hover:bg-[#F4F5F2] dark:hover:bg-[#151D2A] rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Property Locked Card */}
          <div className="p-3 bg-[#F4F5F2] dark:bg-[#151D2A] border border-[#E2E5DF] dark:border-[#263346] rounded-xl flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#171A18] dark:text-brand-lime" />
            <div>
              <span className="font-bold text-[#171A18] dark:text-white block">{propertyName}</span>
              <span className="text-[11px] text-[#777D78] dark:text-slate-400">
                Excel report will strictly contain records for this property.
              </span>
            </div>
          </div>

          {/* Report Type Selector */}
          <div>
            <label className="block text-xs font-bold text-[#171A18] dark:text-slate-300 uppercase tracking-wider mb-2">
              Select Report Type *
            </label>
            <div className="space-y-2">
              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  reportType === "consolidated_summary"
                    ? "bg-[#171A18] dark:bg-[#1E2638] text-white border-[#171A18] dark:border-brand-lime shadow-xs"
                    : "bg-white dark:bg-[#151D2A] border-[#E2E5DF] dark:border-[#263346] text-[#171A18] dark:text-slate-200 hover:bg-[#FAFAF8] dark:hover:bg-[#1E293B]"
                }`}
              >
                <div>
                  <span className="font-bold text-xs block">Consolidated CA Package (Recommended)</span>
                  <span className={`text-[11px] ${reportType === "consolidated_summary" ? "text-gray-300 dark:text-slate-300" : "text-[#777D78] dark:text-slate-400"}`}>
                    Multi-sheet workbook: Ledger, Transactions, Dues, Deposits & P&L Summary
                  </span>
                </div>
                <input
                  type="radio"
                  name="reportType"
                  checked={reportType === "consolidated_summary"}
                  onChange={() => setReportType("consolidated_summary")}
                  className="hidden"
                />
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  reportType === "payment_transactions"
                    ? "bg-[#171A18] dark:bg-[#1E2638] text-white border-[#171A18] dark:border-brand-lime shadow-xs"
                    : "bg-white dark:bg-[#151D2A] border-[#E2E5DF] dark:border-[#263346] text-[#171A18] dark:text-slate-200 hover:bg-[#FAFAF8] dark:hover:bg-[#1E293B]"
                }`}
              >
                <div>
                  <span className="font-bold text-xs block">Payment Transactions Only</span>
                  <span className={`text-[11px] ${reportType === "payment_transactions" ? "text-gray-300 dark:text-slate-300" : "text-[#777D78] dark:text-slate-400"}`}>
                    Every actual payment received with UTR/receipt reference numbers
                  </span>
                </div>
                <input
                  type="radio"
                  name="reportType"
                  checked={reportType === "payment_transactions"}
                  onChange={() => setReportType("payment_transactions")}
                  className="hidden"
                />
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  reportType === "rent_ledger"
                    ? "bg-[#171A18] dark:bg-[#1E2638] text-white border-[#171A18] dark:border-brand-lime shadow-xs"
                    : "bg-white dark:bg-[#151D2A] border-[#E2E5DF] dark:border-[#263346] text-[#171A18] dark:text-slate-200 hover:bg-[#FAFAF8] dark:hover:bg-[#1E293B]"
                }`}
              >
                <div>
                  <span className="font-bold text-xs block">Monthly Rent Ledger Only</span>
                  <span className={`text-[11px] ${reportType === "rent_ledger" ? "text-gray-300 dark:text-slate-300" : "text-[#777D78] dark:text-slate-400"}`}>
                    Month-wise rent billed, received, and pending per resident
                  </span>
                </div>
                <input
                  type="radio"
                  name="reportType"
                  checked={reportType === "rent_ledger"}
                  onChange={() => setReportType("rent_ledger")}
                  className="hidden"
                />
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  reportType === "outstanding_dues"
                    ? "bg-[#171A18] dark:bg-[#1E2638] text-white border-[#171A18] dark:border-brand-lime shadow-xs"
                    : "bg-white dark:bg-[#151D2A] border-[#E2E5DF] dark:border-[#263346] text-[#171A18] dark:text-slate-200 hover:bg-[#FAFAF8] dark:hover:bg-[#1E293B]"
                }`}
              >
                <div>
                  <span className="font-bold text-xs block">Outstanding Dues & Aging Report</span>
                  <span className={`text-[11px] ${reportType === "outstanding_dues" ? "text-gray-300 dark:text-slate-300" : "text-[#777D78] dark:text-slate-400"}`}>
                    Unpaid and partially paid invoices with days overdue
                  </span>
                </div>
                <input
                  type="radio"
                  name="reportType"
                  checked={reportType === "outstanding_dues"}
                  onChange={() => setReportType("outstanding_dues")}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Date Range Scope */}
          <div>
            <label className="block text-xs font-bold text-[#171A18] dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Period / Financial Scope *
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAFAF8] dark:bg-[#151D2A] border border-[#E2E5DF] dark:border-[#263346] rounded-xl text-xs sm:text-sm font-semibold text-[#171A18] dark:text-white focus:outline-hidden focus:border-[#171A18] dark:focus:border-brand-lime"
            >
              <option value="this_month" className="dark:bg-[#151D2A]">This Month (Current Billing Cycle)</option>
              <option value="previous_month" className="dark:bg-[#151D2A]">Previous Month</option>
              <option value="this_financial_year" className="dark:bg-[#151D2A]">Current Financial Year (FY 2026-27)</option>
              <option value="today" className="dark:bg-[#151D2A]">Today Only</option>
              <option value="custom" className="dark:bg-[#151D2A]">Custom Date Range</option>
            </select>
          </div>

          {/* Custom Date Inputs if active */}
          {dateRange === "custom" && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#F4F5F2] dark:bg-[#151D2A] border border-transparent dark:border-[#263346] rounded-xl">
              <div>
                <label className="block text-[11px] font-bold text-[#777D78] dark:text-slate-400 mb-1">From Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-[#111622] border border-[#E2E5DF] dark:border-[#263346] text-[#171A18] dark:text-white rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#777D78] dark:text-slate-400 mb-1">To Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-[#111622] border border-[#E2E5DF] dark:border-[#263346] text-[#171A18] dark:text-white rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {/* CA Format Compliance Note */}
          <div className="p-3 rounded-xl bg-[#F4F5F2] dark:bg-[#151D2A] border border-transparent dark:border-[#263346] text-[11px] text-[#777D78] dark:text-slate-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#15803D] dark:text-emerald-400 shrink-0" />
            <span>
              Excel includes numeric INR amounts, proper header freezing, and separated security deposits.
            </span>
          </div>

          {/* CTAs */}
          <div className="pt-3 border-t border-[#F0F2EE] dark:border-[#1E2638] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#777D78] dark:text-slate-300 hover:text-[#171A18] dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExportSubmit}
              className="px-5 py-2.5 bg-[#171A18] dark:bg-brand-lime hover:bg-[#2A2E2B] dark:hover:bg-[#BCE600] text-white dark:text-brand-obsidian rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-[#C6F36B] dark:text-brand-obsidian" />
              <span>Download Excel (.xlsx)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
