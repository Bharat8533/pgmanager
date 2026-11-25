"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Complaint,
  ComplaintPriority,
  ComplaintStatus,
  ComplaintTimelineItem,
  ComplaintInternalNote,
} from "@/types/complaint";
import { MOCK_COMPLAINTS } from "@/constants/mockComplaintsData";

interface ComplaintContextType {
  complaints: Complaint[];
  markAsPending: (complaintId: string, note?: string) => void;
  resolveComplaint: (
    complaintId: string,
    remarks: string,
    resolutionDate?: string
  ) => void;
  rejectComplaint: (complaintId: string, reason: string) => void;
  reopenComplaint: (complaintId: string, reason: string) => void;
  updatePriority: (complaintId: string, priority: ComplaintPriority) => void;
  addInternalNote: (complaintId: string, noteText: string) => void;
  refreshData: () => void;
  getComplaintById: (id: string) => Complaint | undefined;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(
  undefined
);

const STORAGE_KEY = "staymanage_complaints_dataset";

export function ComplaintProvider({ children }: { children: React.ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Fallback to initial mock data
      }
    }
    return MOCK_COMPLAINTS;
  });

  // Sync state to localStorage for session persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    } catch {
      // Ignore
    }
  }, [complaints]);

  const markAsPending = (complaintId: string, note?: string) => {
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        const newTimelineItem: ComplaintTimelineItem = {
          id: `act-${Date.now()}`,
          action: "Status Changed",
          description:
            note ||
            "Owner acknowledged complaint and marked ticket as in-progress.",
          timestamp: formattedDate,
          performedBy: "Vikramaditya Rao",
          performedByRole: "Owner",
          statusAfter: "pending",
        };

        return {
          ...c,
          status: "pending",
          updatedAt: nowIso,
          activityTimeline: [newTimelineItem, ...c.activityTimeline],
        };
      })
    );
  };

  const resolveComplaint = (
    complaintId: string,
    remarks: string,
    resolutionDate?: string
  ) => {
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        const newTimelineItem: ComplaintTimelineItem = {
          id: `act-${Date.now()}`,
          action: "Complaint Resolved",
          description: `Complaint successfully resolved. Resolution remarks: "${remarks}"`,
          timestamp: formattedDate,
          performedBy: "Vikramaditya Rao",
          performedByRole: "Owner",
          statusAfter: "resolved",
        };

        return {
          ...c,
          status: "resolved",
          resolvedAt: resolutionDate || nowIso,
          resolutionRemarks: remarks,
          updatedAt: nowIso,
          activityTimeline: [newTimelineItem, ...c.activityTimeline],
        };
      })
    );
  };

  const rejectComplaint = (complaintId: string, reason: string) => {
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        const newTimelineItem: ComplaintTimelineItem = {
          id: `act-${Date.now()}`,
          action: "Complaint Rejected",
          description: `Complaint declined with reason: "${reason}"`,
          timestamp: formattedDate,
          performedBy: "Vikramaditya Rao",
          performedByRole: "Owner",
          statusAfter: "rejected",
        };

        return {
          ...c,
          status: "rejected",
          rejectionReason: reason,
          updatedAt: nowIso,
          activityTimeline: [newTimelineItem, ...c.activityTimeline],
        };
      })
    );
  };

  const reopenComplaint = (complaintId: string, reason: string) => {
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        const newTimelineItem: ComplaintTimelineItem = {
          id: `act-${Date.now()}`,
          action: "Complaint Reopened",
          description: `Complaint reopened to In-Progress. Reason: "${reason}"`,
          timestamp: formattedDate,
          performedBy: "Vikramaditya Rao",
          performedByRole: "Owner",
          statusAfter: "pending",
        };

        return {
          ...c,
          status: "pending",
          reopenedAt: nowIso,
          reopeningReason: reason,
          updatedAt: nowIso,
          activityTimeline: [newTimelineItem, ...c.activityTimeline],
        };
      })
    );
  };

  const updatePriority = (
    complaintId: string,
    newPriority: ComplaintPriority
  ) => {
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        const newTimelineItem: ComplaintTimelineItem = {
          id: `act-${Date.now()}`,
          action: "Priority Updated",
          description: `Priority adjusted from ${c.priority.toUpperCase()} to ${newPriority.toUpperCase()}.`,
          timestamp: formattedDate,
          performedBy: "Vikramaditya Rao",
          performedByRole: "Owner",
          priorityAfter: newPriority,
        };

        return {
          ...c,
          priority: newPriority,
          updatedAt: nowIso,
          activityTimeline: [newTimelineItem, ...c.activityTimeline],
        };
      })
    );
  };

  const addInternalNote = (complaintId: string, noteText: string) => {
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newNote: ComplaintInternalNote = {
      id: `note-${Date.now()}`,
      note: noteText.trim(),
      createdAt: formattedDate,
      authorName: "Vikramaditya Rao",
      authorRole: "Owner",
    };

    const newTimelineItem: ComplaintTimelineItem = {
      id: `act-${Date.now()}`,
      action: "Internal Note Added",
      description: "Owner appended a private operational note.",
      timestamp: formattedDate,
      performedBy: "Vikramaditya Rao",
      performedByRole: "Owner",
    };

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          internalNotes: [newNote, ...c.internalNotes],
          updatedAt: nowIso,
          activityTimeline: [newTimelineItem, ...c.activityTimeline],
        };
      })
    );
  };

  const refreshData = () => {
    setComplaints(MOCK_COMPLAINTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const getComplaintById = (id: string) => {
    return complaints.find((c) => c.id === id);
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        markAsPending,
        resolveComplaint,
        rejectComplaint,
        reopenComplaint,
        updatePriority,
        addInternalNote,
        refreshData,
        getComplaintById,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaint() {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error("useComplaint must be used within a ComplaintProvider");
  }
  return context;
}
