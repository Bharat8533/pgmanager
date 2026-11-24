"use client";

import React, { useState, useMemo } from "react";
import { PaymentProvider, usePayment } from "@/contexts/PaymentContext";
import { useOwner } from "@/contexts/OwnerContext";
import { useRoom } from "@/contexts/RoomContext";
import {
  PaymentRecord,
  RentLedgerItem,
  ResidentDepositRecord,
  PaymentFiltersState,
  FinancialSummaryStats,
  MonthlyCollectionTrendPoint,
  PaymentMethodDataPoint,
  CollectionPerformanceDistribution,
  CAReportOptions,
} from "@/types/payment";
import { FinancialSummaryCards } from "@/components/owner/payments/FinancialSummaryCards";
import { CollectionAnalytics } from "@/components/owner/payments/CollectionAnalytics";
import { PaymentFilters } from "@/components/owner/payments/PaymentFilters";
import { RentLedgerTable } from "@/components/owner/payments/RentLedgerTable";
import { PaymentPagination } from "@/components/owner/payments/PaymentPagination";
import { PendingDuesTab } from "@/components/owner/payments/PendingDuesTab";
import { SecurityDepositTab } from "@/components/owner/payments/SecurityDepositTab";
import { RecordPaymentModal } from "@/components/owner/payments/RecordPaymentModal";
import { PaymentDetailsDrawer } from "@/components/owner/payments/PaymentDetailsDrawer";
import { PaymentReceiptModal } from "@/components/owner/payments/PaymentReceiptModal";
import { MonthlyBillingModal } from "@/components/owner/payments/MonthlyBillingModal";
import { ExportCAReportsDialog } from "@/components/owner/payments/ExportCAReportsDialog";
import { DepositAdjustmentModal } from "@/components/owner/payments/DepositAdjustmentModal";
import { exportCAPaymentsReport } from "@/utils/exportPaymentsToExcel";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
  Plus,
  Clock,
  Shield,
  Layers,
  CalendarPlus,
} from "lucide-react";

function RentPaymentsPageContent() {
  const {
    payments,
    ledger,
    deposits,
    recordPayment,
    reversePayment,
    generateMonthlyBilling,
    adjustDeposit,
  } = usePayment();

  const { selectedProperty, selectProperty, allPropertiesList } = useOwner();
  const { guests } = useRoom();

  // Active property context
  const currentProperty = selectedProperty || allPropertiesList[0] || null;
  const currentPropertyId = currentProperty?.id || "prop-1";
  const currentPropertyName = currentProperty?.name || "StayManage Residency";

  // Tab mode: "ledger" (default) | "pending" | "deposits"
  const [activeTab, setActiveTab] = useState<"ledger" | "pending" | "deposits">("ledger");

  // Filters State
  const [filters, setFilters] = useState<PaymentFiltersState>({
    search: "",
    dateRange: "this_month",
    customStartDate: "",
    customEndDate: "",
    paymentStatus: "all",
    paymentMethod: "all",
    paymentType: "all",
    billingMonth: "all",
    sortBy: "newest",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Modals & Drawers State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [preselectedResidentId, setPreselectedResidentId] = useState<string | undefined>(undefined);
  const [preselectedBillingMonth, setPreselectedBillingMonth] = useState<string | undefined>(undefined);

  const [selectedLedgerForDrawer, setSelectedLedgerForDrawer] = useState<RentLedgerItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [receiptPayment, setReceiptPayment] = useState<PaymentRecord | null>(null);
  const [isMonthlyBillingOpen, setIsMonthlyBillingOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  // Deposit Adjustment Modal State
  const [adjustmentTarget, setAdjustmentTarget] = useState<{
    resident: ResidentDepositRecord;
    mode: "refund" | "adjustment";
  } | null>(null);

  // Toast Notification
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFilterChange = <K extends keyof PaymentFiltersState>(
    key: K,
    value: PaymentFiltersState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      dateRange: "this_month",
      customStartDate: "",
      customEndDate: "",
      paymentStatus: "all",
      paymentMethod: "all",
      paymentType: "all",
      billingMonth: "all",
      sortBy: "newest",
    });
    setCurrentPage(1);
    showToast("Filters reset to default view.", "success");
  };

  // Helper date checking function
  const isDateInRange = (dateStr: string, range: string, start?: string, end?: string): boolean => {
    const d = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (range === "today") return d.toDateString() === today.toDateString();
    if (range === "this_week") {
      const past7 = new Date(today);
      past7.setDate(past7.getDate() - 7);
      return d >= past7 && d <= now;
    }
    if (range === "yesterday") {
      const yest = new Date(today);
      yest.setDate(yest.getDate() - 1);
      return d.toDateString() === yest.toDateString();
    }
    if (range === "last_7_days") {
      const past7 = new Date(today);
      past7.setDate(past7.getDate() - 7);
      return d >= past7 && d <= now;
    }
    if (range === "last_30_days") {
      const past30 = new Date(today);
      past30.setDate(past30.getDate() - 30);
      return d >= past30 && d <= now;
    }
    if (range === "this_month") {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }
    if (range === "previous_month") {
      const prevM = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const prevY = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      return d.getFullYear() === prevY && d.getMonth() === prevM;
    }
    if (range === "this_financial_year") {
      const fyStart = now.getMonth() >= 3 ? new Date(now.getFullYear(), 3, 1) : new Date(now.getFullYear() - 1, 3, 1);
      return d >= fyStart && d <= now;
    }
    if (range === "custom") {
      if (start && end) return d >= new Date(start) && d <= new Date(end);
      if (start) return d >= new Date(start);
      if (end) return d <= new Date(end);
      return true;
    }
    return true;
  };

  // 1. Filter records STRICTLY by current selected property
  const currentPropertyLedger = useMemo(() => {
    return ledger.filter((l) => l.propertyId === currentPropertyId);
  }, [ledger, currentPropertyId]);

  const currentPropertyPayments = useMemo(() => {
    return payments.filter((p) => p.propertyId === currentPropertyId);
  }, [payments, currentPropertyId]);

  const currentPropertyDeposits = useMemo(() => {
    return deposits.filter((d) => d.propertyId === currentPropertyId);
  }, [deposits, currentPropertyId]);

  const currentPropertyGuests = useMemo(() => {
    return guests.filter((g) => g.propertyId === currentPropertyId && g.stayStatus === "active");
  }, [guests, currentPropertyId]);

  // 2. Filtered & Sorted Rent Ledger
  const filteredLedger = useMemo(() => {
    return currentPropertyLedger
      .filter((item) => {
        // Status filter
        if (filters.paymentStatus !== "all") {
          if (item.paymentStatus !== filters.paymentStatus) return false;
        }

        // Date range filter based on dueDate
        if (
          !isDateInRange(
            item.dueDate,
            filters.dateRange,
            filters.customStartDate,
            filters.customEndDate
          )
        ) {
          return false;
        }

        // Search text
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase();
          const match =
            item.residentName.toLowerCase().includes(q) ||
            item.residentPhone.toLowerCase().includes(q) ||
            item.roomNumber.toLowerCase().includes(q) ||
            item.id.toLowerCase().includes(q) ||
            item.billingMonth.toLowerCase().includes(q);
          if (!match) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "newest") return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        if (filters.sortBy === "oldest") return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        if (filters.sortBy === "amount_high") return b.rentAmount - a.rentAmount;
        if (filters.sortBy === "amount_low") return a.rentAmount - b.rentAmount;
        return 0;
      });
  }, [currentPropertyLedger, filters]);

  // Paginated ledger slice
  const paginatedLedger = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredLedger.slice(start, start + recordsPerPage);
  }, [filteredLedger, currentPage, recordsPerPage]);

  // 3. Dynamic Financial Statistics for Current Property
  const summaryStats: FinancialSummaryStats = useMemo(() => {
    const totalExpected = filteredLedger.reduce((s, i) => s + i.rentAmount, 0);
    const totalCollected = filteredLedger.reduce((s, i) => s + i.paidAmount, 0);
    const totalPending = filteredLedger.reduce((s, i) => s + i.pendingAmount, 0);
    const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

    // Payments breakdown for current property
    const validPayments = currentPropertyPayments.filter((p) => p.status === "completed");
    const cashCollections = validPayments
      .filter((p) => p.paymentMethod === "Cash")
      .reduce((s, p) => s + p.amount, 0);
    const onlineCollections = validPayments
      .filter((p) => p.paymentMethod !== "Cash")
      .reduce((s, p) => s + p.amount, 0);

    const depositHeld = currentPropertyDeposits.reduce((s, d) => s + d.currentBalance, 0);

    return {
      totalRentExpected: totalExpected,
      totalRentCollected: totalCollected,
      totalPendingRent: totalPending,
      collectionRate,
      cashCollections,
      onlineCollections,
      securityDepositHeld: depositHeld,
      refundedRentAmount: 0,
    };
  }, [filteredLedger, currentPropertyPayments, currentPropertyDeposits]);

  // 4. Analytics Data (Monthly Trend for Current Property)
  const monthlyTrendData: MonthlyCollectionTrendPoint[] = useMemo(() => {
    const monthsMap: Record<string, MonthlyCollectionTrendPoint> = {
      "Jun 2026": { month: "Jun", expectedRent: 95000, collectedRent: 95000, pendingRent: 0 },
      "Jul 2026": { month: "Jul", expectedRent: 110000, collectedRent: 105000, pendingRent: 5000 },
      "Aug 2026": { month: "Aug", expectedRent: 125000, collectedRent: 120000, pendingRent: 5000 },
      "Sep 2026": { month: "Sep", expectedRent: 135000, collectedRent: 128000, pendingRent: 7000 },
      "Oct 2026": { month: "Oct", expectedRent: 145000, collectedRent: 145000, pendingRent: 0 },
      "Nov 2026": {
        month: "Nov",
        expectedRent: summaryStats.totalRentExpected || 155000,
        collectedRent: summaryStats.totalRentCollected || 135000,
        pendingRent: summaryStats.totalPendingRent || 20000,
      },
    };

    return Object.values(monthsMap);
  }, [summaryStats]);

  // 5. Payment Method Share Donut Data
  const paymentMethodData: PaymentMethodDataPoint[] = useMemo(() => {
    const validPayments = currentPropertyPayments.filter((p) => p.status === "completed");
    const methodCounts: Record<string, number> = {};
    let totalAmt = 0;

    validPayments.forEach((p) => {
      methodCounts[p.paymentMethod] = (methodCounts[p.paymentMethod] || 0) + p.amount;
      totalAmt += p.amount;
    });

    return Object.entries(methodCounts)
      .map(([method, amount]) => ({
        method: method as any,
        amount,
        percentage: totalAmt > 0 ? Math.round((amount / totalAmt) * 100) : 0,
        count: validPayments.filter((p) => p.paymentMethod === method).length,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [currentPropertyPayments]);

  // 6. Resident Compliance Distribution
  const performanceDistribution: CollectionPerformanceDistribution = useMemo(() => {
    let paidCount = 0;
    let paidAmount = 0;
    let partialCount = 0;
    let partialAmount = 0;
    let pendingCount = 0;
    let pendingAmount = 0;
    let overdueCount = 0;
    let overdueAmount = 0;

    filteredLedger.forEach((item) => {
      if (item.paymentStatus === "paid") {
        paidCount++;
        paidAmount += item.paidAmount;
      } else if (item.paymentStatus === "partial") {
        partialCount++;
        partialAmount += item.pendingAmount;
      } else if (item.paymentStatus === "overdue") {
        overdueCount++;
        overdueAmount += item.pendingAmount;
      } else {
        pendingCount++;
        pendingAmount += item.pendingAmount;
      }
    });

    return {
      paidCount,
      paidAmount,
      partialCount,
      partialAmount,
      pendingCount,
      pendingAmount,
      overdueCount,
      overdueAmount,
    };
  }, [filteredLedger]);

  // Handlers
  const handleOpenRecordPayment = (residentId?: string, month?: string) => {
    setPreselectedResidentId(residentId);
    setPreselectedBillingMonth(month);
    setIsRecordModalOpen(true);
  };

  const handleRecordPaymentSubmit = (payload: any) => {
    const result = recordPayment(payload);
    if (result.success && result.payment) {
      showToast(`Payment of ₹${payload.amount.toLocaleString("en-IN")} recorded for ${payload.residentName}!`, "success");
      setReceiptPayment(result.payment);
    } else {
      showToast(result.error || "Failed to record payment", "error");
    }
  };

  const handleViewDrawer = (item: RentLedgerItem) => {
    setSelectedLedgerForDrawer(item);
    setIsDrawerOpen(true);
  };

  const handleGenerateMonthlyBilling = (month: string, dueDate: string) => {
    const res = generateMonthlyBilling(
      currentPropertyId,
      currentPropertyName,
      month,
      dueDate,
      guests
    );
    if (res.success) {
      showToast(res.message, "success");
    } else {
      showToast(res.message, "error");
    }
  };

  const handleExportCAReports = (options: CAReportOptions) => {
    const success = exportCAPaymentsReport({
      payments: currentPropertyPayments,
      ledger: currentPropertyLedger,
      deposits: currentPropertyDeposits,
      summaryStats,
      options,
    });
    if (success) {
      showToast(
        `Exported CA-Ready Excel report for ${currentPropertyName} (${options.dateRangeLabel})!`,
        "success"
      );
    }
  };

  const handleReversePayment = (paymentId: string) => {
    const res = reversePayment(paymentId, "Reversed by owner from ledger drawer.");
    if (res.success) {
      showToast(`Payment ${paymentId} reversed successfully. Ledger balances restored.`, "success");
    } else {
      showToast(res.error || "Failed to reverse payment", "error");
    }
  };

  const handleDepositAdjustmentSubmit = (amount: number, reason: string) => {
    if (!adjustmentTarget) return;
    const res = adjustDeposit(
      adjustmentTarget.resident.residentId,
      adjustmentTarget.mode,
      amount,
      reason
    );
    if (res.success) {
      showToast(
        `Recorded deposit ${adjustmentTarget.mode} of ₹${amount.toLocaleString("en-IN")} for ${adjustmentTarget.resident.residentName}!`,
        "success"
      );
    } else {
      showToast(res.error || "Failed", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#171A18] text-white rounded-2xl shadow-xl border border-[#C6F36B]/30 animate-in slide-in-from-top-4 duration-300 max-w-md">
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-[#C6F36B] shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="p-1 text-[#777D78] hover:text-white rounded-lg ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Title & Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171A18] tracking-tight">
              Rent & Payments
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C6F36B] text-[#171A18]">
              Finance
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#777D78]">
            Manage monthly rent, track collections, monitor pending dues, and export financial reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMonthlyBillingOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#FAFAF8] border border-[#E2E5DF] rounded-xl text-xs sm:text-sm font-semibold text-[#171A18] transition-all shadow-2xs cursor-pointer active:scale-98"
          >
            <CalendarPlus className="w-4 h-4 text-[#171A18]" />
            <span>Monthly Billing</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExportDialogOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#FAFAF8] border border-[#E2E5DF] rounded-xl text-xs sm:text-sm font-semibold text-[#171A18] transition-all shadow-2xs cursor-pointer active:scale-98"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#171A18]" />
            <span>Export CA Reports</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenRecordPayment()}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#C6F36B] hover:bg-[#bbf057] text-[#171A18] rounded-xl text-xs sm:text-sm font-black transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4 text-[#171A18]" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* 6 Financial Overview Summary Cards */}
      <FinancialSummaryCards stats={summaryStats} dateRangeLabel={filters.dateRange} />

      {/* Collection Analytics Charts */}
      <CollectionAnalytics
        trendData={monthlyTrendData}
        methodData={paymentMethodData}
        performance={performanceDistribution}
      />

      {/* Modern Segmented Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-[#EBECE7] rounded-2xl w-full sm:w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("ledger")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "ledger"
              ? "bg-white text-[#171A18] shadow-xs"
              : "text-[#777D78] hover:text-[#171A18]"
          }`}
        >
          <CreditCard className="w-4 h-4 text-[#171A18]" />
          <span>Rent Ledger</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#F4F5F2] text-[#171A18]">
            {currentPropertyLedger.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "pending"
              ? "bg-white text-[#B91C1C] shadow-xs"
              : "text-[#777D78] hover:text-[#B91C1C]"
          }`}
        >
          <Clock className="w-4 h-4 text-[#B91C1C]" />
          <span>Pending Dues</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-700">
            {currentPropertyLedger.filter((l) => l.pendingAmount > 0).length}
          </span>
          {summaryStats.totalPendingRent > 0 && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white">
              ₹{(summaryStats.totalPendingRent / 1000).toFixed(0)}k
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("deposits")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "deposits"
              ? "bg-white text-[#171A18] shadow-xs"
              : "text-[#777D78] hover:text-[#171A18]"
          }`}
        >
          <Shield className="w-4 h-4 text-[#171A18]" />
          <span>Security Deposits</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#F4F5F2] text-[#171A18]">
            {currentPropertyDeposits.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Main Rent Ledger View */}
      {activeTab === "ledger" && (
        <div className="space-y-4">
          <PaymentFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalFilteredCount={filteredLedger.length}
          />

          <RentLedgerTable
            ledger={paginatedLedger}
            onViewDetails={handleViewDrawer}
            onRecordPaymentForResident={(item) =>
              handleOpenRecordPayment(item.residentId, item.billingMonth)
            }
          />

          {filteredLedger.length > 0 && (
            <PaymentPagination
              currentPage={currentPage}
              totalRecords={filteredLedger.length}
              recordsPerPage={recordsPerPage}
              onPageChange={(p) => setCurrentPage(p)}
              onRecordsPerPageChange={(s) => {
                setRecordsPerPage(s);
                setCurrentPage(1);
              }}
            />
          )}
        </div>
      )}

      {/* Tab 2: Pending Dues & Aging View */}
      {activeTab === "pending" && (
        <PendingDuesTab
          ledger={currentPropertyLedger}
          propertyName={currentPropertyName}
          onRecordPayment={(item) => handleOpenRecordPayment(item.residentId, item.billingMonth)}
          onViewDetails={handleViewDrawer}
        />
      )}

      {/* Tab 3: Security Deposits View */}
      {activeTab === "deposits" && (
        <SecurityDepositTab
          deposits={currentPropertyDeposits}
          onOpenAdjustmentModal={(resident, mode) => setAdjustmentTarget({ resident, mode })}
        />
      )}

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setPreselectedResidentId(undefined);
          setPreselectedBillingMonth(undefined);
        }}
        onSubmit={handleRecordPaymentSubmit}
        residents={currentPropertyGuests}
        propertyId={currentPropertyId}
        propertyName={currentPropertyName}
        outstandingLedgers={currentPropertyLedger}
        preselectedResidentId={preselectedResidentId}
        preselectedBillingMonth={preselectedBillingMonth}
      />

      {/* Payment Details Drawer */}
      <PaymentDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedLedgerForDrawer(null);
        }}
        ledgerItem={selectedLedgerForDrawer}
        residentPayments={currentPropertyPayments.filter(
          (p) => p.residentId === selectedLedgerForDrawer?.residentId
        )}
        allResidentLedgers={currentPropertyLedger.filter(
          (l) => l.residentId === selectedLedgerForDrawer?.residentId
        )}
        depositAmount={
          currentPropertyDeposits.find((d) => d.residentId === selectedLedgerForDrawer?.residentId)
            ?.currentBalance || 0
        }
        onOpenRecordPayment={(item) => {
          setIsDrawerOpen(false);
          handleOpenRecordPayment(item.residentId, item.billingMonth);
        }}
        onOpenReceipt={(payment) => setReceiptPayment(payment)}
        onReversePayment={handleReversePayment}
      />

      {/* Payment Receipt Modal */}
      <PaymentReceiptModal
        isOpen={Boolean(receiptPayment)}
        onClose={() => setReceiptPayment(null)}
        payment={receiptPayment}
        ownerBusinessName={currentPropertyName}
      />

      {/* Monthly Rent Billing Modal */}
      <MonthlyBillingModal
        isOpen={isMonthlyBillingOpen}
        onClose={() => setIsMonthlyBillingOpen(false)}
        onGenerate={handleGenerateMonthlyBilling}
        propertyId={currentPropertyId}
        propertyName={currentPropertyName}
        activeResidents={currentPropertyGuests}
      />

      {/* Export CA Reports Dialog */}
      <ExportCAReportsDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={handleExportCAReports}
        propertyId={currentPropertyId}
        propertyName={currentPropertyName}
      />

      {/* Deposit Adjustment / Refund Modal */}
      <DepositAdjustmentModal
        isOpen={Boolean(adjustmentTarget)}
        onClose={() => setAdjustmentTarget(null)}
        resident={adjustmentTarget?.resident || null}
        mode={adjustmentTarget?.mode || "refund"}
        onSubmit={handleDepositAdjustmentSubmit}
      />
    </div>
  );
}

export default function RentPaymentsPage() {
  return (
    <PaymentProvider>
      <RentPaymentsPageContent />
    </PaymentProvider>
  );
}
