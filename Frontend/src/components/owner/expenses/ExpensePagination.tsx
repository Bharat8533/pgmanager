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
    <div className="px-6 py-4 border-t border-[#F0F2EE] bg-[#FAFAF8] flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Records per page + Record range info */}
      <div className="flex items-center gap-4 text-xs text-[#777D78]">
        <div className="flex items-center gap-2">
          <span>Show:</span>
          <select
            value={recordsPerPage}
            onChange={(e) => onRecordsPerPageChange(Number(e.target.value))}
            aria-label="Records per page"
            className="px-2 py-1 bg-white border border-[#E2E5DF] rounded-lg text-xs font-semibold text-[#171A18] focus:outline-hidden focus:border-[#171A18] cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>per page</span>
        </div>

        <span className="hidden sm:inline-block text-[#CCD0C8]">|</span>

        <span>
          Showing <strong className="text-[#171A18]">{startIndex}</strong> -{" "}
          <strong className="text-[#171A18]">{endIndex}</strong> of{" "}
          <strong className="text-[#171A18]">{totalRecords}</strong>
        </span>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous Page"
          className="p-1.5 rounded-lg border border-[#E2E5DF] bg-white text-[#777D78] hover:text-[#171A18] hover:bg-[#F4F5F2] disabled:opacity-40 disabled:pointer-events-none transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {startPage > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className="w-8 h-8 rounded-lg text-xs font-semibold text-[#777D78] hover:text-[#171A18] hover:bg-white transition-all"
            >
              1
            </button>
            {startPage > 2 && <span className="text-[#777D78] px-1 text-xs">...</span>}
          </>
        )}

        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#171A18] text-white shadow-2xs"
                  : "bg-white border border-[#E2E5DF] text-[#777D78] hover:text-[#171A18] hover:bg-[#F4F5F2]"
              }`}
            >
              {p}
            </button>
          );
        })}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-[#777D78] px-1 text-xs">...</span>}
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className="w-8 h-8 rounded-lg text-xs font-semibold text-[#777D78] hover:text-[#171A18] hover:bg-white transition-all"
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
          className="p-1.5 rounded-lg border border-[#E2E5DF] bg-white text-[#777D78] hover:text-[#171A18] hover:bg-[#F4F5F2] disabled:opacity-40 disabled:pointer-events-none transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
