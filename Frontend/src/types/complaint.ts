export type ComplaintStatus = "new" | "pending" | "resolved" | "rejected";

export type ComplaintPriority = "low" | "medium" | "high" | "urgent";

export type ComplaintCategory =
  | "maintenance_repairs"
  | "food_mess"
  | "cleanliness_hygiene"
  | "water_electricity"
  | "security_safety"
  | "room_facilities"
  | "payment_deposit"
  | "privacy_rules"
  | "other";

export interface ComplaintAttachment {
  id: string;
  name: string;
  url: string;
  type: "image" | "document";
  size?: string;
  uploadedAt: string;
}

export interface ComplaintTimelineItem {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  performedBy: string;
  performedByRole: "Owner" | "Resident" | "Manager" | "Staff" | "System";
  statusAfter?: ComplaintStatus;
  priorityAfter?: ComplaintPriority;
}

export interface ComplaintInternalNote {
  id: string;
  note: string;
  createdAt: string;
  authorName: string;
  authorRole: string;
}

export interface Complaint {
  id: string;
  complaintNumber: string; // e.g. CMP-2026-101
  residentId: string;
  residentName: string;
  residentPhone: string;
  residentAvatar?: string;
  roomId: string;
  roomNumber: string;
  bedNumber?: string;
  propertyId: string;
  propertyName: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  attachments: ComplaintAttachment[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionRemarks?: string;
  rejectionReason?: string;
  reopenedAt?: string;
  reopeningReason?: string;
  internalNotes: ComplaintInternalNote[];
  activityTimeline: ComplaintTimelineItem[];
}

export interface ComplaintFiltersState {
  search: string;
  status: ComplaintStatus | "all";
  category: ComplaintCategory | "all";
  priority: ComplaintPriority | "all";
  dateRange:
    | "all"
    | "today"
    | "yesterday"
    | "last_7_days"
    | "last_30_days"
    | "this_month"
    | "previous_month"
    | "custom";
  customStartDate: string;
  customEndDate: string;
  residentId: string | "all";
  roomNumber: string | "all";
  propertyId: string | "all";
  sortBy: "newest" | "oldest" | "priority_desc" | "priority_asc" | "status";
}

export interface ComplaintStatsData {
  total: number;
  new: number;
  pending: number;
  resolved: number;
  rejected: number;
  urgentCount: number;
  resolutionRatePercent: number;
}
