"use client";

import React, { useState, useMemo } from "react";
import { ComplaintProvider, useComplaint } from "@/contexts/ComplaintContext";
import { useOwner } from "@/contexts/OwnerContext";
import {
  Complaint,
  ComplaintFiltersState,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintStatsData,
  ComplaintAttachment,
} from "@/types/complaint";
import { ComplaintsHeader } from "@/components/owner/complaints/ComplaintsHeader";
import { ComplaintStats } from "@/components/owner/complaints/ComplaintStats";
import { ComplaintStatusTabs } from "@/components/owner/complaints/ComplaintStatusTabs";
import { ComplaintFilters } from "@/components/owner/complaints/ComplaintFilters";
import { ComplaintTable } from "@/components/owner/complaints/ComplaintTable";
import { ComplaintMobileList } from "@/components/owner/complaints/ComplaintMobileList";
import { ComplaintPagination } from "@/components/owner/complaints/ComplaintPagination";
import { ComplaintDetailsDrawer } from "@/components/owner/complaints/ComplaintDetailsDrawer";
import { ResolveComplaintModal } from "@/components/owner/complaints/ResolveComplaintModal";
import { RejectComplaintModal } from "@/components/owner/complaints/RejectComplaintModal";
import { ReopenComplaintModal } from "@/components/owner/complaints/ReopenComplaintModal";
import { AttachmentPreviewModal } from "@/components/owner/complaints/AttachmentPreviewModal";
import { exportComplaintsToExcel } from "@/utils/exportComplaintsToExcel";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

function ComplaintsDashboardContent() {
  const {
    complaints,
    markAsPending,
    resolveComplaint,
    rejectComplaint,
    reopenComplaint,
    updatePriority,
    addInternalNote,
    refreshData,
  } = useComplaint();

  const { selectedProperty } = useOwner();

  // Active status tab state
  const [activeStatusTab, setActiveStatusTab] = useState<ComplaintStatus | "all">(
    "all"
  );

  // Filters State
  const [filters, setFilters] = useState<ComplaintFiltersState>({
    search: "",
    status: "all",
    category: "all",
    priority: "all",
    dateRange: "all",
    customStartDate: "",
    customEndDate: "",
    residentId: "all",
    roomNumber: "all",
    propertyId: "all",
    sortBy: "newest",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Drawers and Modals State
  const [drawerComplaintId, setDrawerComplaintId] = useState<string | null>(null);
  const [resolveTarget, setResolveTarget] = useState<Complaint | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Complaint | null>(null);
  const [reopenTarget, setReopenTarget] = useState<Complaint | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<ComplaintAttachment | null>(null);

  // Toast feedback state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Derive current drawer complaint from reactive state
  const selectedComplaintForDrawer = useMemo(() => {
    if (!drawerComplaintId) return null;
    return complaints.find((c) => c.id === drawerComplaintId) || null;
  }, [complaints, drawerComplaintId]);

  // Handle active status tab switch
  const handleStatusTabChange = (status: ComplaintStatus | "all") => {
    setActiveStatusTab(status);
    setCurrentPage(1);
  };

  // Handle individual filter field change
  const handleFilterChange = <K extends keyof ComplaintFiltersState>(
    key: K,
    value: ComplaintFiltersState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Handle Reset Filters
  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      category: "all",
      priority: "all",
      dateRange: "all",
      customStartDate: "",
      customEndDate: "",
      residentId: "all",
      roomNumber: "all",
      propertyId: "all",
      sortBy: "newest",
    });
    setActiveStatusTab("all");
    setCurrentPage(1);
    showToast("Filters reset to default view.", "info");
  };

  // Available unique residents and rooms for filter dropdowns
  const { availableResidents, availableRooms } = useMemo(() => {
    const resMap = new Map<string, string>();
    const roomsSet = new Set<string>();

    complaints.forEach((c) => {
      resMap.set(c.residentId, c.residentName);
      roomsSet.add(c.roomNumber);
    });

    return {
      availableResidents: Array.from(resMap.entries()).map(([id, name]) => ({
        id,
        name,
      })),
      availableRooms: Array.from(roomsSet).sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true })
      ),
    };
  }, [complaints]);

  // Dynamic Statistics derived from current property dataset
  const stats: ComplaintStatsData = useMemo(() => {
    // If property selected in top navbar, compute stats for that property; otherwise across all
    const baseList = selectedProperty
      ? complaints.filter((c) => c.propertyId === selectedProperty.id)
      : complaints;

    const total = baseList.length;
    const newCount = baseList.filter((c) => c.status === "new").length;
    const pendingCount = baseList.filter((c) => c.status === "pending").length;
    const resolvedCount = baseList.filter((c) => c.status === "resolved").length;
    const rejectedCount = baseList.filter((c) => c.status === "rejected").length;
    const urgentCount = baseList.filter((c) => c.priority === "urgent").length;
    const resolutionRatePercent =
      total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

    return {
      total,
      new: newCount,
      pending: pendingCount,
      resolved: resolvedCount,
      rejected: rejectedCount,
      urgentCount,
      resolutionRatePercent,
    };
  }, [complaints, selectedProperty]);

  // Date range checking helper
  const isDateInRange = (dateStr: string): boolean => {
    if (filters.dateRange === "all") return true;

    const recordDate = new Date(dateStr);
    const now = new Date();

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    if (filters.dateRange === "today") {
      return recordDate >= todayStart;
    }
    if (filters.dateRange === "yesterday") {
      return recordDate >= yesterdayStart && recordDate < todayStart;
    }
    if (filters.dateRange === "last_7_days") {
      const sevenDaysAgo = new Date(todayStart);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return recordDate >= sevenDaysAgo;
    }
    if (filters.dateRange === "last_30_days") {
      const thirtyDaysAgo = new Date(todayStart);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return recordDate >= thirtyDaysAgo;
    }
    if (filters.dateRange === "this_month") {
      return (
        recordDate.getMonth() === now.getMonth() &&
        recordDate.getFullYear() === now.getFullYear()
      );
    }
    if (filters.dateRange === "previous_month") {
      const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      return (
        recordDate.getMonth() === prevMonth && recordDate.getFullYear() === prevYear
      );
    }
    if (filters.dateRange === "custom") {
      if (!filters.customStartDate && !filters.customEndDate) return true;
      const start = filters.customStartDate ? new Date(filters.customStartDate) : new Date(0);
      const end = filters.customEndDate ? new Date(filters.customEndDate + "T23:59:59") : new Date();
      return recordDate >= start && recordDate <= end;
    }

    return true;
  };

  // Filtered & Sorted complaints list
  const filteredComplaints = useMemo(() => {
    const PRIORITY_WEIGHT: Record<ComplaintPriority, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    const STATUS_WEIGHT: Record<ComplaintStatus, number> = {
      new: 1,
      pending: 2,
      resolved: 3,
      rejected: 4,
    };

    return complaints
      .filter((c) => {
        // Property filter from global header switcher
        if (selectedProperty && c.propertyId !== selectedProperty.id) {
          return false;
        }

        // Status tab filter
        if (activeStatusTab !== "all" && c.status !== activeStatusTab) {
          return false;
        }

        // Category filter
        if (filters.category !== "all" && c.category !== filters.category) {
          return false;
        }

        // Priority filter
        if (filters.priority !== "all" && c.priority !== filters.priority) {
          return false;
        }

        // Resident filter
        if (filters.residentId !== "all" && c.residentId !== filters.residentId) {
          return false;
        }

        // Room filter
        if (filters.roomNumber !== "all" && c.roomNumber !== filters.roomNumber) {
          return false;
        }

        // Date range filter
        if (!isDateInRange(c.createdAt)) {
          return false;
        }

        // Global search input (resident name, room, complaint ID, title)
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase().trim();
          const matchesId = c.complaintNumber.toLowerCase().includes(query);
          const matchesResident = c.residentName.toLowerCase().includes(query);
          const matchesRoom = c.roomNumber.toLowerCase().includes(query);
          const matchesTitle = c.title.toLowerCase().includes(query);
          const matchesDesc = c.description.toLowerCase().includes(query);

          if (!matchesId && !matchesResident && !matchesRoom && !matchesTitle && !matchesDesc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (filters.sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (filters.sortBy === "priority_desc") {
          return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
        }
        if (filters.sortBy === "priority_asc") {
          return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
        }
        if (filters.sortBy === "status") {
          return STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status];
        }
        return 0;
      });
  }, [complaints, selectedProperty, activeStatusTab, filters]);

  // Paginated Complaints
  const paginatedComplaints = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return filteredComplaints.slice(startIndex, startIndex + recordsPerPage);
  }, [filteredComplaints, currentPage, recordsPerPage]);

  // Export to Excel handler
  const handleExport = () => {
    const success = exportComplaintsToExcel(filteredComplaints, {
      propertyName: selectedProperty?.name,
      filterLabel: activeStatusTab,
    });
    if (success) {
      showToast(
        `Successfully exported ${filteredComplaints.length} complaint record(s) to Excel.`,
        "success"
      );
    } else {
      showToast("No complaints to export under active filters.", "error");
    }
  };

  // Refresh handler
  const handleRefresh = () => {
    refreshData();
    showToast("Complaint records reloaded to default dataset.", "success");
  };

  // Workflow Handlers
  const handleMarkAsPending = (id: string) => {
    markAsPending(id);
    showToast("Complaint acknowledged and moved to Pending.", "success");
  };

  const handleConfirmResolve = (
    id: string,
    remarks: string,
    resolutionDate?: string
  ) => {
    resolveComplaint(id, remarks, resolutionDate);
    showToast("Complaint successfully resolved and recorded.", "success");
  };

  const handleConfirmReject = (id: string, reason: string) => {
    rejectComplaint(id, reason);
    showToast("Complaint declined with explanation recorded.", "info");
  };

  const handleConfirmReopen = (id: string, reason: string) => {
    reopenComplaint(id, reason);
    showToast("Complaint reopened to In-Progress status.", "info");
  };

  const handleUpdatePriority = (id: string, newPriority: ComplaintPriority) => {
    updatePriority(id, newPriority);
    showToast(`Priority updated to ${newPriority.toUpperCase()}.`, "success");
  };

  const handleAddInternalNote = (id: string, noteText: string) => {
    addInternalNote(id, noteText);
    showToast("Private internal note added.", "success");
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-brand-obsidian text-white rounded-2xl shadow-xl border border-brand-border/20 text-xs font-semibold animate-scaleUp">
          {toast.type === "success" && (
            <CheckCircle2 className="w-4 h-4 text-brand-lime" />
          )}
          {toast.type === "error" && (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          {toast.type === "info" && (
            <Info className="w-4 h-4 text-cyan-400" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="p-1 hover:text-brand-muted"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <ComplaintsHeader
        onExport={handleExport}
        onRefresh={handleRefresh}
        totalFilteredCount={filteredComplaints.length}
      />

      {/* 5 Dynamic Statistics Cards */}
      <ComplaintStats
        stats={stats}
        activeStatusTab={activeStatusTab}
        onSelectStatus={handleStatusTabChange}
      />

      {/* Status Tabs Navigation */}
      <ComplaintStatusTabs
        activeTab={activeStatusTab}
        onTabChange={handleStatusTabChange}
        stats={stats}
      />

      {/* Interactive Filters Toolbar */}
      <ComplaintFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalFilteredCount={filteredComplaints.length}
        totalCount={complaints.length}
        availableResidents={availableResidents}
        availableRooms={availableRooms}
      />

      {/* Desktop/Tablet Complaints Table */}
      <ComplaintTable
        complaints={paginatedComplaints}
        onSelectComplaint={(c) => setDrawerComplaintId(c.id)}
        onClearFilters={handleResetFilters}
      />

      {/* Mobile Complaints Cards List (< md) */}
      <ComplaintMobileList
        complaints={paginatedComplaints}
        onSelectComplaint={(c) => setDrawerComplaintId(c.id)}
        onClearFilters={handleResetFilters}
      />

      {/* Functional Pagination */}
      {filteredComplaints.length > 0 && (
        <ComplaintPagination
          currentPage={currentPage}
          totalRecords={filteredComplaints.length}
          recordsPerPage={recordsPerPage}
          onPageChange={setCurrentPage}
          onRecordsPerPageChange={(size) => {
            setRecordsPerPage(size);
            setCurrentPage(1);
          }}
        />
      )}

      {/* Right Side Complaint Details Drawer */}
      <ComplaintDetailsDrawer
        isOpen={Boolean(drawerComplaintId)}
        onClose={() => setDrawerComplaintId(null)}
        complaint={selectedComplaintForDrawer}
        onMarkAsPending={handleMarkAsPending}
        onOpenResolveModal={(c) => setResolveTarget(c)}
        onOpenRejectModal={(c) => setRejectTarget(c)}
        onOpenReopenModal={(c) => setReopenTarget(c)}
        onUpdatePriority={handleUpdatePriority}
        onAddInternalNote={handleAddInternalNote}
        onPreviewAttachment={(att) => setPreviewAttachment(att)}
      />

      {/* Resolve Complaint Modal */}
      <ResolveComplaintModal
        isOpen={Boolean(resolveTarget)}
        onClose={() => setResolveTarget(null)}
        complaint={resolveTarget}
        onConfirm={handleConfirmResolve}
      />

      {/* Reject Complaint Modal */}
      <RejectComplaintModal
        isOpen={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        complaint={rejectTarget}
        onConfirm={handleConfirmReject}
      />

      {/* Reopen Complaint Modal */}
      <ReopenComplaintModal
        isOpen={Boolean(reopenTarget)}
        onClose={() => setReopenTarget(null)}
        complaint={reopenTarget}
        onConfirm={handleConfirmReopen}
      />

      {/* Attachment Full Lightbox Modal */}
      <AttachmentPreviewModal
        isOpen={Boolean(previewAttachment)}
        onClose={() => setPreviewAttachment(null)}
        attachment={previewAttachment}
      />
    </div>
  );
}

export default function ComplaintsPage() {
  return (
    <ComplaintProvider>
      <ComplaintsDashboardContent />
    </ComplaintProvider>
  );
}
