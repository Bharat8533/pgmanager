"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ComplaintPaginationProps {
  currentPage: number;
  totalRecords: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
  onRecordsPerPageChange: (size: number) => void;
}

export function ComplaintPagination({
  currentPage,
  totalRecords,
  recordsPerPage,
  onPageChange,
  onRecordsPerPageChange,
}: ComplaintPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalRecords / recordsPerPage));
  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
      {/* Records info & Page Size */}
      <div className="flex items-center gap-3 text-brand-muted dark:text-slate-400">
        <span>
          Showing <strong className="text-brand-charcoal dark:text-white">{startRecord}</strong> to{" "}
          <strong className="text-brand-charcoal dark:text-white">{endRecord}</strong> of{" "}
          <strong className="text-brand-charcoal dark:text-white">{totalRecords}</strong> complaints
        </span>

        <div className="flex items-center gap-1.5 ml-2">
          <label className="text-[11px] text-brand-muted dark:text-slate-400">Per page:</label>
          <select
            value={recordsPerPage}
            onChange={(e) => onRecordsPerPageChange(Number(e.target.value))}
            aria-label="Records per page"
            className="text-xs py-1 px-2 rounded-lg border border-brand-border dark:border-[#263346] bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white focus:border-brand-charcoal dark:focus:border-brand-lime focus:outline-none"
          >
            <option value={5} className="dark:bg-[#151D2A]">5</option>
            <option value={10} className="dark:bg-[#151D2A]">10</option>
            <option value={20} className="dark:bg-[#151D2A]">20</option>
            <option value={50} className="dark:bg-[#151D2A]">50</option>
          </select>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-brand-border dark:border-[#263346] bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-slate-200 hover:bg-brand-offwhite dark:hover:bg-[#1E293B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((p, idx) => {
          if (p === "...") {
            return (
              <span key={`dots-${idx}`} className="px-2 py-1 text-brand-muted dark:text-slate-400">
                ...
              </span>
            );
          }
          const pageNum = p as number;
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-brand-obsidian dark:bg-brand-lime text-white dark:text-brand-obsidian font-bold"
                  : "border border-brand-border dark:border-[#263346] bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-slate-200 hover:bg-brand-offwhite dark:hover:bg-[#1E293B]"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-brand-border dark:border-[#263346] bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-slate-200 hover:bg-brand-offwhite dark:hover:bg-[#1E293B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
