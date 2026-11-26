"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ExpensePaginationProps {
  currentPage: number;
  totalRecords: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
  onRecordsPerPageChange: (size: number) => void;
}

export const ExpensePagination: React.FC<ExpensePaginationProps> = ({
  currentPage,
  totalRecords,
  recordsPerPage,
  onPageChange,
  onRecordsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalRecords / recordsPerPage) || 1;
  const startIndex = totalRecords === 0 ? 0 : (currentPage - 1) * recordsPerPage + 1;
  const endIndex = Math.min(currentPage * recordsPerPage, totalRecords);

  // Generate page numbers
  const pages: number[] = [];
  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="px-6 py-4 border-t border-[#F0F2EE] dark:border-[#1E2638] bg-[#FAFAF8] dark:bg-[#151D2A] flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Records per page + Record range info */}
      <div className="flex items-center gap-4 text-xs text-[#777D78] dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>Show:</span>
          <select
            value={recordsPerPage}
            onChange={(e) => onRecordsPerPageChange(Number(e.target.value))}
            aria-label="Records per page"
            className="px-2 py-1 bg-white dark:bg-[#111622] border border-[#E2E5DF] dark:border-[#263346] rounded-lg text-xs font-semibold text-[#171A18] dark:text-white focus:outline-hidden focus:border-[#171A18] dark:focus:border-brand-lime cursor-pointer"
          >
            <option value={10} className="dark:bg-[#111622] dark:text-white">10</option>
            <option value={25} className="dark:bg-[#111622] dark:text-white">25</option>
            <option value={50} className="dark:bg-[#111622] dark:text-white">50</option>
          </select>
          <span>per page</span>
        </div>

        <span className="hidden sm:inline-block text-[#CCD0C8] dark:text-[#263346]">|</span>

        <span>
          Showing <strong className="text-[#171A18] dark:text-white">{startIndex}</strong> -{" "}
          <strong className="text-[#171A18] dark:text-white">{endIndex}</strong> of{" "}
          <strong className="text-[#171A18] dark:text-white">{totalRecords}</strong>
        </span>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous Page"
          className="p-1.5 rounded-lg border border-[#E2E5DF] dark:border-[#263346] bg-white dark:bg-[#111622] text-[#777D78] dark:text-slate-400 hover:text-[#171A18] dark:hover:text-white hover:bg-[#F4F5F2] dark:hover:bg-[#1E293B] disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {startPage > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className="w-8 h-8 rounded-lg text-xs font-semibold text-[#777D78] dark:text-slate-400 hover:text-[#171A18] dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B] transition-all cursor-pointer"
            >
              1
            </button>
            {startPage > 2 && <span className="text-[#777D78] dark:text-slate-400 px-1 text-xs">...</span>}
          </>
        )}

        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#171A18] dark:bg-brand-lime text-white dark:text-brand-obsidian shadow-2xs"
                  : "bg-white dark:bg-[#111622] border border-[#E2E5DF] dark:border-[#263346] text-[#777D78] dark:text-slate-400 hover:text-[#171A18] dark:hover:text-white hover:bg-[#F4F5F2] dark:hover:bg-[#1E293B]"
              }`}
            >
              {p}
            </button>
          );
        })}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-[#777D78] dark:text-slate-400 px-1 text-xs">...</span>}
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className="w-8 h-8 rounded-lg text-xs font-semibold text-[#777D78] dark:text-slate-400 hover:text-[#171A18] dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B] transition-all cursor-pointer"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next Page"
          className="p-1.5 rounded-lg border border-[#E2E5DF] dark:border-[#263346] bg-white dark:bg-[#111622] text-[#777D78] dark:text-slate-400 hover:text-[#171A18] dark:hover:text-white hover:bg-[#F4F5F2] dark:hover:bg-[#1E293B] disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
