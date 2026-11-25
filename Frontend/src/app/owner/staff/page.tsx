"use client";

import React, { useState, useMemo } from "react";
import { StaffProvider, useStaff } from "@/contexts/StaffContext";
import { useOwner } from "@/contexts/OwnerContext";
import {
  StaffMember,
  StaffFiltersState,
  StaffStatus,
  StaffRole,
} from "@/types/staff";
import { StaffHeader } from "@/components/owner/staff/StaffHeader";
import { StaffStats } from "@/components/owner/staff/StaffStats";
import { StaffStatusTabs } from "@/components/owner/staff/StaffStatusTabs";
import { StaffFilters } from "@/components/owner/staff/StaffFilters";
import { StaffTable } from "@/components/owner/staff/StaffTable";
import { StaffMobileList } from "@/components/owner/staff/StaffMobileList";
import { StaffPagination } from "@/components/owner/staff/StaffPagination";
import { StaffProfileDrawer } from "@/components/owner/staff/StaffProfileDrawer";
import { AddEditStaffModal } from "@/components/owner/staff/AddEditStaffModal";
import { ChangeStaffStatusModal } from "@/components/owner/staff/ChangeStaffStatusModal";
import { DeleteStaffModal } from "@/components/owner/staff/DeleteStaffModal";
import { exportStaffToExcel } from "@/utils/exportStaffToExcel";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

function StaffManagementContent() {
  const {
    staffList,
    addStaff,
    updateStaff,
    changeStaffStatus,
    deleteStaff,
    getStaffStats,
    generateNextEmployeeId,
    refreshData,
  } = useStaff();

  const { properties, selectedProperty } = useOwner();

  // Active status tab filter
  const [activeStatusTab, setActiveStatusTab] = useState<StaffStatus | "all">("all");

  // Filters State
  const [filters, setFilters] = useState<StaffFiltersState>({
    search: "",
    status: "all",
    role: "all",
    propertyId: "all",
    joiningDateRange: "all",
    customStartDate: "",
    customEndDate: "",
    minSalary: "",
    maxSalary: "",
    sortBy: "joiningDate",
    sortOrder: "desc",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Modals & Drawer State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<StaffMember | null>(null);
  const [staffToView, setStaffToView] = useState<StaffMember | null>(null);
  const [staffToChangeStatus, setStaffToChangeStatus] = useState<StaffMember | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

  // UI Toast Feedback
  const [toast, setToast] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Status Tab counts dynamically calculated from current property filter
  const statusCounts = useMemo(() => {
    const list =
      filters.propertyId === "all"
        ? staffList
        : staffList.filter((s) => s.propertyId === filters.propertyId);

    return {
      all: list.length,
      active: list.filter((s) => s.status === "active").length,
      on_leave: list.filter((s) => s.status === "on_leave").length,
      inactive: list.filter((s) => s.status === "inactive").length,
    };
  }, [staffList, filters.propertyId]);

  // Overall statistics (for the top KPI cards)
  const stats = useMemo(() => {
    return getStaffStats(filters.propertyId);
  }, [getStaffStats, filters.propertyId]);

  // Handle Tab Switch
  const handleStatusTabChange = (tab: StaffStatus | "all") => {
    setActiveStatusTab(tab);
    setFilters((prev) => ({ ...prev, status: tab }));
    setCurrentPage(1);
  };

  // Handle Filter Update
  const handleFilterChange = (updates: Partial<StaffFiltersState>) => {
    setFilters((prev) => {
      const next = { ...prev, ...updates };
      // Keep active tab in sync if status is changed via dropdown
      if (updates.status !== undefined) {
        setActiveStatusTab(updates.status);
      }
      return next;
    });
    setCurrentPage(1);
  };

  // Handle Clear All Filters
  const handleClearAllFilters = () => {
    setFilters({
      search: "",
      status: "all",
      role: "all",
      propertyId: "all",
      joiningDateRange: "all",
      customStartDate: "",
      customEndDate: "",
      minSalary: "",
      maxSalary: "",
      sortBy: "joiningDate",
      sortOrder: "desc",
    });
    setActiveStatusTab("all");
    setCurrentPage(1);
  };

  // Filter and Sort Staff Records
  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      // 1. Status Filter
      if (filters.status !== "all" && staff.status !== filters.status) {
        return false;
      }

      // 2. Role Filter
      if (filters.role !== "all" && staff.role !== filters.role) {
        return false;
      }

      // 3. Property Filter
      if (filters.propertyId !== "all" && staff.propertyId !== filters.propertyId) {
        return false;
      }

      // 4. Global Search
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesName = staff.name.toLowerCase().includes(query);
        const matchesId = staff.employeeId.toLowerCase().includes(query);
        const matchesRole = staff.role.toLowerCase().includes(query);
        const matchesCustomRole = (staff.customRoleTitle || "").toLowerCase().includes(query);
        const matchesPhone = staff.phone.includes(query);
        const matchesEmail = (staff.email || "").toLowerCase().includes(query);
        const matchesProperty = staff.propertyName.toLowerCase().includes(query);

        if (
          !matchesName &&
          !matchesId &&
          !matchesRole &&
          !matchesCustomRole &&
          !matchesPhone &&
          !matchesEmail &&
          !matchesProperty
        ) {
          return false;
        }
      }

      // 5. Joining Date Range Filter
      if (filters.joiningDateRange !== "all") {
        const joining = new Date(staff.joiningDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (filters.joiningDateRange === "today") {
          const joiningDay = new Date(joining);
          joiningDay.setHours(0, 0, 0, 0);
          if (joiningDay.getTime() !== today.getTime()) return false;
        } else if (filters.joiningDateRange === "this_month") {
          const isThisMonth =
            joining.getMonth() === today.getMonth() &&
            joining.getFullYear() === today.getFullYear();
          if (!isThisMonth) return false;
        } else if (filters.joiningDateRange === "last_30_days") {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          thirtyDaysAgo.setHours(0, 0, 0, 0);
          if (joining < thirtyDaysAgo || joining > today) return false;
        } else if (filters.joiningDateRange === "custom") {
          if (filters.customStartDate) {
            const start = new Date(filters.customStartDate);
            start.setHours(0, 0, 0, 0);
            if (joining < start) return false;
          }
          if (filters.customEndDate) {
            const end = new Date(filters.customEndDate);
            end.setHours(23, 59, 59, 999);
            if (joining > end) return false;
          }
        }
      }

      // 6. Salary Range Filter
      if (filters.minSalary !== "" && filters.minSalary !== undefined) {
        if (staff.monthlySalary < Number(filters.minSalary)) return false;
      }
      if (filters.maxSalary !== "" && filters.maxSalary !== undefined) {
        if (staff.monthlySalary > Number(filters.maxSalary)) return false;
      }

      return true;
    });
  }, [staffList, filters]);

  // Sort Staff: active employees prioritised if default, or explicit sorting
  const sortedStaff = useMemo(() => {
    return [...filteredStaff].sort((a, b) => {
      let comparison = 0;

      if (filters.sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (filters.sortBy === "salary") {
        comparison = a.monthlySalary - b.monthlySalary;
      } else if (filters.sortBy === "employeeId") {
        comparison = a.employeeId.localeCompare(b.employeeId);
      } else {
        // joiningDate (default)
        comparison = new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime();
      }

      return filters.sortOrder === "asc" ? comparison : -comparison;
    });
  }, [filteredStaff, filters.sortBy, filters.sortOrder]);

  // Paginated Slices
  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return sortedStaff.slice(start, start + recordsPerPage);
  }, [sortedStaff, currentPage, recordsPerPage]);

  // Property options for dropdowns & modals
  const propertyOptions = useMemo(() => {
    if (properties && properties.length > 0) {
      return properties.map((p) => ({ id: p.id, name: p.name }));
    }
    return [
      { id: "prop-1", name: "StayManage Residency (Royal PG)" },
      { id: "prop-2", name: "Green Valley Residency" },
      { id: "prop-3", name: "Urban Nest PG & Co-Living" },
    ];
  }, [properties]);

  // Handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("Staff roster refreshed to default sample records", "info");
    }, 600);
  };

  const handleExport = () => {
    const selectedProp =
      filters.propertyId !== "all"
        ? properties.find((p) => p.id === filters.propertyId)?.name
        : "All Properties";

    const success = exportStaffToExcel(sortedStaff, {
      propertyName: selectedProp || "All Properties",
      filterLabel: filters.status !== "all" ? `Status: ${filters.status}` : undefined,
    });

    if (success) {
      showToast(
        `Exported ${sortedStaff.length} staff records to Excel (.xlsx) successfully!`,
        "success"
      );
    } else {
      showToast("No staff records available to export.", "error");
    }
  };

  const handleSaveStaff = (staffData: any) => {
    if (staffData.id) {
      // Edit existing
      updateStaff(staffData.id, staffData);
      showToast(`Updated profile for ${staffData.name} successfully!`, "success");
      // Update viewing modal if open
      if (staffToView && staffToView.id === staffData.id) {
        setStaffToView({ ...staffToView, ...staffData });
      }
    } else {
      // Add new
      const created = addStaff(staffData);
      showToast(`Registered new staff member ${created.name} (${created.employeeId})!`, "success");
    }
  };

  const handleStatusChangeConfirm = (staffId: string, newStatus: StaffStatus) => {
    changeStaffStatus(staffId, newStatus);
    const target = staffList.find((s) => s.id === staffId);
    showToast(
      `Status for ${target?.name || "Staff"} changed to ${newStatus.replace("_", " ").toUpperCase()}`,
      "success"
    );
    if (staffToView && staffToView.id === staffId) {
      setStaffToView({ ...staffToView, status: newStatus });
    }
  };

  const handleDeleteConfirm = (staffId: string) => {
    const target = staffList.find((s) => s.id === staffId);
    deleteStaff(staffId);
    showToast(`Removed ${target?.name || "Staff member"} from active staff records`, "info");
    if (staffToView && staffToView.id === staffId) {
      setStaffToView(null);
    }
  };

  return (
    <div className="min-w-0 max-w-full overflow-x-hidden space-y-6 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-70 animate-in slide-in-from-bottom-4 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold ${
              toast.type === "success"
                ? "bg-brand-obsidian text-brand-lime border-brand-obsidian"
                : toast.type === "error"
                ? "bg-rose-600 text-white border-rose-700"
                : "bg-blue-600 text-white border-blue-700"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {toast.type === "error" && <AlertCircle className="w-4 h-4 shrink-0" />}
            {toast.type === "info" && <Info className="w-4 h-4 shrink-0" />}
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 hover:opacity-80"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Header */}
      <StaffHeader
        onAddStaff={() => {
          setStaffToEdit(null);
          setIsAddModalOpen(true);
        }}
        onExportStaff={handleExport}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* 2. Top Statistics Cards */}
      <StaffStats stats={stats} />

      {/* 3. Status Tabs Navigation */}
      <StaffStatusTabs
        activeTab={activeStatusTab}
        onTabChange={handleStatusTabChange}
        counts={statusCounts}
      />

      {/* 4. Search and Filter Bar */}
      <StaffFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAllFilters}
        totalMatching={sortedStaff.length}
      />

      {/* 5. Staff Listing: Desktop Table & Mobile Cards */}
      <div>
        {/* Desktop & Tablet Table (Hidden on small mobile) */}
        <div className="hidden md:block">
          <StaffTable
            staffList={paginatedStaff}
            onViewStaff={(staff) => setStaffToView(staff)}
            onEditStaff={(staff) => {
              setStaffToEdit(staff);
              setIsAddModalOpen(true);
            }}
            onChangeStatus={(staff) => setStaffToChangeStatus(staff)}
            onDeleteStaff={(staff) => setStaffToDelete(staff)}
          />
        </div>

        {/* Mobile Responsive Cards (Visible only on mobile) */}
        <div className="block md:hidden">
          <StaffMobileList
            staffList={paginatedStaff}
            onViewProfile={(staff) => setStaffToView(staff)}
            onEditStaff={(staff) => {
              setStaffToEdit(staff);
              setIsAddModalOpen(true);
            }}
            onChangeStatus={(staff) => setStaffToChangeStatus(staff)}
            onDeleteStaff={(staff) => setStaffToDelete(staff)}
            onClearFilters={handleClearAllFilters}
          />
        </div>
      </div>

      {/* 6. Pagination */}
      {sortedStaff.length > 0 && (
        <StaffPagination
          currentPage={currentPage}
          totalRecords={sortedStaff.length}
          recordsPerPage={recordsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
          onRecordsPerPageChange={(size) => {
            setRecordsPerPage(size);
            setCurrentPage(1);
          }}
        />
      )}

      {/* 7. Staff Profile Slide-over Drawer */}
      <StaffProfileDrawer
        staff={staffToView}
        isOpen={Boolean(staffToView)}
        onClose={() => setStaffToView(null)}
        onEdit={(staff) => {
          setStaffToView(null);
          setStaffToEdit(staff);
          setIsAddModalOpen(true);
        }}
        onChangeStatus={(staff) => {
          setStaffToChangeStatus(staff);
        }}
        onDelete={(staff) => {
          setStaffToDelete(staff);
        }}
      />

      {/* 8. Add / Edit Staff Modal */}
      <AddEditStaffModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setStaffToEdit(null);
        }}
        staffToEdit={staffToEdit}
        properties={propertyOptions}
        nextEmployeeId={generateNextEmployeeId()}
        onSave={handleSaveStaff}
      />

      {/* 9. Change Status Modal */}
      <ChangeStaffStatusModal
        isOpen={Boolean(staffToChangeStatus)}
        onClose={() => setStaffToChangeStatus(null)}
        staff={staffToChangeStatus}
        onConfirm={handleStatusChangeConfirm}
      />

      {/* 10. Delete Staff Confirmation Modal */}
      <DeleteStaffModal
        isOpen={Boolean(staffToDelete)}
        onClose={() => setStaffToDelete(null)}
        staff={staffToDelete}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default function StaffPage() {
  return (
    <StaffProvider>
      <StaffManagementContent />
    </StaffProvider>
  );
}
