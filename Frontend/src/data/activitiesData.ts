export interface ModernActivityItem {
  id: string;
  title: string;
  description: string;
  category: "tenant" | "booking" | "payment" | "room" | "complaint" | "property";
  timestamp: string;
  timeAgo: string;
  actor: string;
  propertyName: string;
  highlightText?: string;
}

export const MOCK_TIMELINE_ACTIVITIES: ModernActivityItem[] = [
  {
    id: "act-1",
    title: "New Tenant Registered",
    description: "Aditya Mehta admitted into Room 204 (Bed 1). Police verification completed.",
    category: "tenant",
    timestamp: "Today, 10:30 AM",
    timeAgo: "15 mins ago",
    actor: "Manager Sharma",
    propertyName: "Royal Residency PG",
    highlightText: "Room 204",
  },
  {
    id: "act-2",
    title: "Rent Payment Received",
    description: "Received ₹14,500 online UPI transfer from Rohan Sharma for Nov rent cycle.",
    category: "payment",
    timestamp: "Today, 09:15 AM",
    timeAgo: "1 hour ago",
    actor: "Auto UPI Hook",
    propertyName: "Royal Residency PG",
    highlightText: "₹14,500",
  },
  {
    id: "act-3",
    title: "New Booking Reserved",
    description: "Sneha Mukherjee paid ₹3,000 token advance for Room 102 (Triple Sharing).",
    category: "booking",
    timestamp: "Yesterday, 06:40 PM",
    timeAgo: "14 hours ago",
    actor: "Direct Booking",
    propertyName: "Green Villa PG & Hostel",
    highlightText: "Token ₹3,000",
  },
  {
    id: "act-4",
    title: "Complaint Resolved",
    description: "Wi-Fi fiber repair and router replacement completed on 2nd Floor.",
    category: "complaint",
    timestamp: "Yesterday, 04:30 PM",
    timeAgo: "16 hours ago",
    actor: "Staff Ravi",
    propertyName: "Urban Oasis Co-Living",
    highlightText: "Wi-Fi Fixed",
  },
  {
    id: "act-5",
    title: "Room Marked Available",
    description: "Room 105 sanitized and deep cleaned. 2 beds available for immediate allocation.",
    category: "room",
    timestamp: "23 Nov, 02:15 PM",
    timeAgo: "1 day ago",
    actor: "Housekeeping",
    propertyName: "Royal Residency PG",
    highlightText: "2 Beds Ready",
  },
  {
    id: "act-6",
    title: "Tenant Checked Out",
    description: "Amit Kumar vacated Room 302. Refundable deposit of ₹10,000 processed.",
    category: "tenant",
    timestamp: "22 Nov, 11:00 AM",
    timeAgo: "2 days ago",
    actor: "Caretaker Sunil",
    propertyName: "Green Villa PG & Hostel",
    highlightText: "Deposit Refunded",
  },
];

export function getActivitiesData(propertyId?: string | null): ModernActivityItem[] {
  if (!propertyId || propertyId === "all") {
    return MOCK_TIMELINE_ACTIVITIES;
  }
  const propNameMap: Record<string, string> = {
    "prop-1": "Royal Residency PG",
    "prop-2": "Green Villa PG & Hostel",
    "prop-3": "Urban Oasis Co-Living",
  };
  const targetName = propNameMap[propertyId];
  return targetName
    ? MOCK_TIMELINE_ACTIVITIES.filter((a) => a.propertyName === targetName)
    : MOCK_TIMELINE_ACTIVITIES;
}
