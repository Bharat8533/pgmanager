import React from "react";

export type PropertyStatus = "active" | "inactive" | "under_maintenance";
export type PropertyType = "Boys PG" | "Girls PG" | "Co-living" | "Family Accommodation" | "Other";

export interface Property {
  id: string;
  name: string;
  type: PropertyType | string;
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  address: string; // Address Line 1
  addressLine2?: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  reservedBeds: number;
  status: PropertyStatus;
  coverImage: string;
  images: string[];
  amenities: string[];
  createdAt?: string;
  monthlyStartingRent?: number;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  type: "payment" | "complaint" | "admission" | "system";
}

export interface OwnerProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  businessName: string;
  avatarUrl?: string;
  initials: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  iconName: string;
  badge?: string;
  badgeVariant?: "primary" | "warning" | "neutral";
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface DashboardSummaryCardData {
  id: string;
  title: string;
  value: string | number;
  description: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconName: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: "tenant" | "room" | "payment" | "complaint";
}

export interface RecentPayment {
  id: string;
  tenantName: string;
  roomNumber: string;
  amount: number;
  date: string;
  status: "received" | "pending" | "overdue";
  paymentMode: string;
}
