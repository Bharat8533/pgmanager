"use client";

import React, { useState, useMemo } from "react";
import { ExpenseProvider, useExpense } from "@/contexts/ExpenseContext";
import { useOwner } from "@/contexts/OwnerContext";
import {
  Expense,
  ExpenseFiltersState,
  ExpensePayload,
  ExpenseSummaryStats,
  MonthlyTrendDataPoint,
  CategoryBreakdownDataPoint,
} from "@/types/expense";
import { ExpenseStats } from "@/components/owner/expenses/ExpenseStats";
import { ExpenseCharts } from "@/components/owner/expenses/ExpenseCharts";
import { ExpenseFilters } from "@/components/owner/expenses/ExpenseFilters";
import { ExpenseTable } from "@/components/owner/expenses/ExpenseTable";
import { ExpensePagination } from "@/components/owner/expenses/ExpensePagination";
import { ExpenseFormModal } from "@/components/owner/expenses/ExpenseFormModal";
import { DeleteExpenseDialog } from "@/components/owner/expenses/DeleteExpenseDialog";
import { ExpenseReceiptModal } from "@/components/owner/expenses/ExpenseReceiptModal";
import { exportExpensesToExcel } from "@/utils/exportExpensesToExcel";
import { Plus, CheckCircle2, AlertCircle, X, Building2 } from "lucide-react";

function ExpensesPageContent() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpense();
  const { selectedProperty } = useOwner();

  // Active property context
  const currentPropertyId = selectedProperty?.id || "prop-1";
  const currentPropertyName = selectedProperty?.name || "Green Valley Residency";

  // Active filters state
  const [filters, setFilters] = useState<ExpenseFiltersState>({
    propertyId: currentPropertyId,
    category: "all",
    dateRange: "this_month",
    customStartDate: "",
    customEndDate: "",
    paymentMode: "all",
    sortBy: "newest",
    search: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [receiptExpense, setReceiptExpense] = useState<Expense | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFilterChange = <K extends keyof ExpenseFiltersState>(
    key: K,
    value: ExpenseFiltersState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to page 1 on filter update
  };

  const handleResetFilters = () => {
    setFilters({
      propertyId: currentPropertyId,
      category: "all",
      dateRange: "this_month",
      customStartDate: "",
      customEndDate: "",
      paymentMode: "all",
      sortBy: "newest",
      search: "",
    });
    setCurrentPage(1);
    showToast("Filters reset to default view.", "success");
  };

  // Helper date checking functions
  const isDateInRange = (dateStr: string, range: string, start?: string, end?: string): boolean => {
    const expenseDate = new Date(dateStr);
    const now = new Date();
    
    // Normalize time to midnight
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (range === "today") {
      return expenseDate.toDateString() === today.toDateString();
    }
    if (range === "yesterday") {
      return expenseDate.toDateString() === yesterday.toDateString();
    }
    if (range === "last_7_days") {
      const past7 = new Date(today);
      past7.setDate(past7.getDate() - 7);
      return expenseDate >= past7 && expenseDate <= now;
    }
    if (range === "last_30_days") {
      const past30 = new Date(today);
      past30.setDate(past30.getDate() - 30);
      return expenseDate >= past30 && expenseDate <= now;
    }
    if (range === "this_month") {
      return (
        expenseDate.getFullYear() === now.getFullYear() &&
        expenseDate.getMonth() === now.getMonth()
      );
    }
    if (range === "previous_month") {
      const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const prevMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      return (
        expenseDate.getFullYear() === prevMonthYear &&
        expenseDate.getMonth() === prevMonth
      );
    }
    if (range === "custom") {
      if (start && end) {
        return expenseDate >= new Date(start) && expenseDate <= new Date(end);
      }
      if (start) {
        return expenseDate >= new Date(start);
      }
      if (end) {
        return expenseDate <= new Date(end);
      }
      return true;
    }
    return true;
  };

  // Strictly filter expenses for the currently selected property
  const currentPropertyExpenses = useMemo(() => {
    return expenses.filter((e) => e.propertyId === currentPropertyId);
  }, [expenses, currentPropertyId]);

  // Filtered & Sorted Expenses for Current Property
  const filteredExpenses = useMemo(() => {
    return currentPropertyExpenses
      .filter((expense) => {
        // 1. Category Filter
        if (filters.category !== "all") {
          if (expense.category !== filters.category) return false;
        }

        // 2. Payment Mode Filter
        if (filters.paymentMode !== "all") {
          if (expense.paymentMode !== filters.paymentMode) return false;
        }

        // 3. Date Range Filter
        if (
          !isDateInRange(
            expense.date,
            filters.dateRange,
            filters.customStartDate,
            filters.customEndDate
          )
        ) {
          return false;
        }

        // 4. Search Text Filter (Title, Remark, ID, Category)
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase();
          const matches =
            expense.title.toLowerCase().includes(q) ||
            (expense.remark && expense.remark.toLowerCase().includes(q)) ||
            expense.id.toLowerCase().includes(q) ||
            expense.category.toLowerCase().includes(q);
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "newest") {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (filters.sortBy === "oldest") {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (filters.sortBy === "amount_high") {
          return b.amount - a.amount;
        }
        if (filters.sortBy === "amount_low") {
          return a.amount - b.amount;
        }
        if (filters.sortBy === "category") {
          return a.category.localeCompare(b.category);
        }
        return 0;
      });
  }, [currentPropertyExpenses, filters]);

  // Paginated records for table
  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return filteredExpenses.slice(startIndex, startIndex + recordsPerPage);
  }, [filteredExpenses, currentPage, recordsPerPage]);

  // Dynamic Statistics calculation strictly for current property
  const summaryStats: ExpenseSummaryStats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    // Total expenses in active filtered view
    const totalFiltered = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);

    // This month's total for current property
    const thisMonthExpenses = currentPropertyExpenses.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });
    const thisMonthTotal = thisMonthExpenses.reduce((sum, item) => sum + item.amount, 0);

    // Today's total for current property
    const todayTotal = currentPropertyExpenses
      .filter((e) => e.date === todayStr)
      .reduce((sum, item) => sum + item.amount, 0);

    // Highest expense category in filtered selection
    const categoryTotals: Record<string, number> = {};
    filteredExpenses.forEach((item) => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
    });

    let highestCatName = "None";
    let highestCatAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > highestCatAmount) {
        highestCatAmount = amt;
        highestCatName = cat;
      }
    });

    const uniqueDates = new Set(filteredExpenses.map((e) => e.date));
    const divisor = uniqueDates.size > 0 ? uniqueDates.size : 1;
    const avgDailyExpense = Math.round(totalFiltered / divisor);

    return {
      totalExpenses: totalFiltered,
      totalFilteredExpenses: totalFiltered,
      thisMonthExpenses: thisMonthTotal,
      todayExpenses: todayTotal,
      highestCategoryName: highestCatName,
      highestCategoryAmount: highestCatAmount,
      highestCategory: {
        category: highestCatName,
        amount: highestCatAmount,
      },
      averageDailyExpense: avgDailyExpense,
    } as ExpenseSummaryStats;
  }, [currentPropertyExpenses, filteredExpenses]);

  // Analytics Trends calculation (Monthly Spending for last 6 months for current property)
  const monthlyTrendData: MonthlyTrendDataPoint[] = useMemo(() => {
    const monthsMap: Record<string, { label: string; amount: number; sortKey: string }> = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monthLabel = d.toLocaleString("en-US", { month: "short" });
      monthsMap[key] = { label: monthLabel, amount: 0, sortKey: key };
    }

    currentPropertyExpenses.forEach((item) => {
      const itemKey = item.date.substring(0, 7);
      if (monthsMap[itemKey]) {
        monthsMap[itemKey].amount += item.amount;
      }
    });

    return Object.values(monthsMap)
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map((item) => ({
        month: item.label,
        amount: item.amount,
      }));
  }, [currentPropertyExpenses]);

  // Category Breakdown for Recharts Pie Chart
  const categoryBreakdownData: CategoryBreakdownDataPoint[] = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    let total = 0;

    filteredExpenses.forEach((item) => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
      total += item.amount;
    });

    return Object.entries(categoryTotals)
      .map(([cat, amt]) => ({
        category: cat,
        amount: amt,
        percentage: total > 0 ? Math.round((amt / total) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingExpense(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (payload: ExpensePayload) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, payload);
      showToast(`Updated expense: ${payload.title}`, "success");
    } else {
      addExpense(payload);
      showToast(`Recorded new expense for ${currentPropertyName}: ${payload.title}`, "success");
    }
    setIsFormModalOpen(false);
    setEditingExpense(null);
  };

  const handleOpenDelete = (expense: Expense) => {
    setExpenseToDelete(expense);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete.id);
      showToast(`Deleted expense: ${expenseToDelete.title}`, "success");
      setIsDeleteDialogOpen(false);
      setExpenseToDelete(null);
    }
  };

  const handleViewReceipt = (expense: Expense) => {
    setReceiptExpense(expense);
  };

  const handleExportExcel = () => {
    const success = exportExpensesToExcel(filteredExpenses, {
      propertyName: currentPropertyName,
      dateRangeLabel: filters.dateRange,
    });

    if (success) {
      showToast(
        `Successfully exported ${filteredExpenses.length} expense records for ${currentPropertyName} to Excel (.xlsx)!`,
        "success"
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Alert */}
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
            className="p-1 text-[#777D78] hover:text-white rounded-lg transition-all ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171A18] dark:text-white tracking-tight">
              Expenses
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C6F36B] dark:bg-brand-lime text-[#171A18] dark:text-brand-obsidian">
              Ledger
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAFAF8] dark:bg-[#151D2A] border border-[#E2E5DF] dark:border-[#263346] text-xs font-bold text-[#171A18] dark:text-white">
              <Building2 className="w-3.5 h-3.5 text-[#171A18] dark:text-brand-lime" />
              <span>{currentPropertyName}</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#777D78] dark:text-slate-400">
            Track daily expenses, monitor operational costs, and manage spending for {currentPropertyName}.
          </p>
        </div>

        {/* Top-Right CTA */}
        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#171A18] dark:bg-brand-lime hover:bg-[#2A2E2B] dark:hover:bg-[#BCE600] text-white dark:text-brand-obsidian rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-98 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#C6F36B] dark:text-brand-obsidian" />
          <span>+ Add Expense</span>
        </button>
      </div>

      {/* 5 Summary Metric Cards */}
      <ExpenseStats stats={summaryStats} dateRange={filters.dateRange} />

      {/* Analytics Charts (Area Trend + Category Breakdown) */}
      <ExpenseCharts
        trendData={monthlyTrendData}
        categoryData={categoryBreakdownData}
        totalFilteredAmount={summaryStats.totalExpenses}
      />

      {/* Filter Controls Bar */}
      <ExpenseFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        onExportExcel={handleExportExcel}
        totalFilteredCount={filteredExpenses.length}
      />

      {/* Expense Listing Table & Pagination */}
      <div className="space-y-0">
        <ExpenseTable
          expenses={paginatedExpenses}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onViewReceipt={handleViewReceipt}
        />

        {filteredExpenses.length > 0 && (
          <ExpensePagination
            currentPage={currentPage}
            totalRecords={filteredExpenses.length}
            recordsPerPage={recordsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
            onRecordsPerPageChange={(size) => {
              setRecordsPerPage(size);
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {/* Modals & Dialogs */}
      <ExpenseFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleFormSubmit}
        initialExpense={editingExpense}
        currentPropertyId={currentPropertyId}
        currentPropertyName={currentPropertyName}
      />

      <DeleteExpenseDialog
        isOpen={isDeleteDialogOpen}
        expense={expenseToDelete}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setExpenseToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      <ExpenseReceiptModal
        isOpen={Boolean(receiptExpense)}
        expense={receiptExpense}
        onClose={() => setReceiptExpense(null)}
      />
    </div>
  );
}

export default function ExpensesPage() {
  return (
    <ExpenseProvider>
      <ExpensesPageContent />
    </ExpenseProvider>
  );
}
