"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { StaffMember, StaffStatus, StaffStatsData } from "@/types/staff";
import { MOCK_STAFF_MEMBERS } from "@/data/staffData";

interface StaffContextType {
  staffList: StaffMember[];
  addStaff: (
    data: Omit<StaffMember, "id" | "employeeId" | "createdAt" | "updatedAt"> & {
      id?: string;
      employeeId?: string;
    }
  ) => StaffMember;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  changeStaffStatus: (id: string, newStatus: StaffStatus) => void;
  deleteStaff: (id: string) => void;
  getStaffById: (id: string) => StaffMember | undefined;
  getStaffStats: (propertyId?: string | "all") => StaffStatsData;
  generateNextEmployeeId: () => string;
  refreshData: () => void;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

const STORAGE_KEY = "staymanage_staff_roster";

export function StaffProvider({ children }: { children: React.ReactNode }) {
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback to mock data
      }
    }
    return MOCK_STAFF_MEMBERS;
  });

  // Save to localStorage when changed
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(staffList));
      } catch (err) {
        console.error("Failed to save staff to localStorage:", err);
      }
    }
  }, [staffList]);

  // Generate next Employee ID
  const generateNextEmployeeId = () => {
    const numbers = staffList.map((s) => {
      const match = s.employeeId.match(/STF-(\d+)/);
      return match ? parseInt(match[1], 10) : 1000;
    });
    const maxNum = numbers.length > 0 ? Math.max(...numbers) : 1000;
    return `STF-${maxNum + 1}`;
  };

  // Add staff
  const addStaff = (
    data: Omit<StaffMember, "id" | "employeeId" | "createdAt" | "updatedAt"> & {
      id?: string;
      employeeId?: string;
    }
  ): StaffMember => {
    const now = new Date().toISOString();
    const newStaff: StaffMember = {
      ...data,
      id: data.id || `staff-${Date.now()}`,
      employeeId: data.employeeId || generateNextEmployeeId(),
      createdAt: now,
      updatedAt: now,
    };

    setStaffList((prev) => [newStaff, ...prev]);
    return newStaff;
  };

  // Update staff
  const updateStaff = (id: string, updates: Partial<StaffMember>) => {
    const now = new Date().toISOString();
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: now } : s))
    );
  };

  // Change staff status
  const changeStaffStatus = (id: string, newStatus: StaffStatus) => {
    updateStaff(id, { status: newStatus });
  };

  // Delete staff
  const deleteStaff = (id: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
  };

  // Get single staff by ID
  const getStaffById = (id: string) => {
    return staffList.find((s) => s.id === id);
  };

  // Get statistics calculated dynamically
  const getStaffStats = (propertyId: string | "all" = "all"): StaffStatsData => {
    const filtered =
      propertyId === "all"
        ? staffList
        : staffList.filter((s) => s.propertyId === propertyId);

    const totalStaff = filtered.length;
    const activeStaff = filtered.filter((s) => s.status === "active").length;
    const onLeaveStaff = filtered.filter((s) => s.status === "on_leave").length;
    const inactiveStaff = filtered.filter((s) => s.status === "inactive").length;

    return {
      totalStaff,
      activeStaff,
      onLeaveStaff,
      inactiveStaff,
    };
  };

  // Refresh data
  const refreshData = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    setStaffList(MOCK_STAFF_MEMBERS);
  };

  const value = useMemo(
    () => ({
      staffList,
      addStaff,
      updateStaff,
      changeStaffStatus,
      deleteStaff,
      getStaffById,
      getStaffStats,
      generateNextEmployeeId,
      refreshData,
    }),
    [staffList]
  );

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
}

export function useStaff() {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error("useStaff must be used within a StaffProvider");
  }
  return context;
}
