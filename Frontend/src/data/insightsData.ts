export interface BusinessInsightCard {
  id: string;
  title: string;
  category: "occupancy" | "collection" | "booking" | "performance";
  mainMetric: string;
  secondaryMetric: string;
  changeBadge: {
    value: string;
    isPositive: boolean;
  };
  insightDescription: string;
  recommendation: string;
}

export interface UpcomingCheckInItem {
  id: string;
  tenantName: string;
  phone: string;
  propertyName: string;
  roomBed: string;
  checkInDate: string;
  daysRemaining: string;
}

export interface UpcomingCheckOutItem {
  id: string;
  tenantName: string;
  propertyName: string;
  roomBed: string;
  checkOutDate: string;
  noticeDaysRemaining: string;
  depositRefundStatus: "Pending Inspection" | "Approved" | "Refunded";
}

export interface PendingComplaintItem {
  id: string;
  title: string;
  tenantName: string;
  roomNumber: string;
  propertyName: string;
  priority: "high" | "medium" | "low";
  status: "open" | "in_progress" | "scheduled";
  createdAt: string;
}

export const MOCK_BUSINESS_INSIGHTS: BusinessInsightCard[] = [
  {
    id: "insight-1",
    title: "Occupancy Rate Momentum",
    category: "occupancy",
    mainMetric: "91.3% Bed Occ.",
    secondaryMetric: "7 Available Beds",
    changeBadge: { value: "+4.2% vs last mo", isPositive: true },
    insightDescription: "Double-sharing beds in Sector 45 are operating at near 100% capacity.",
    recommendation: "Consider converting 1 underutilized triple room into a high-demand double room.",
  },
  {
    id: "insight-2",
    title: "Collection Efficiency",
    category: "collection",
    mainMetric: "95.6% Collected",
    secondaryMetric: "₹58,500 Outstanding",
    changeBadge: { value: "3.2 days avg turnaround", isPositive: true },
    insightDescription: "Automatic WhatsApp reminders on the 1st of the month reduced overdue dues by 14.2%.",
    recommendation: "Issue automated SMS reminders to the 5 tenants with pending balances before 26th Nov.",
  },
  {
    id: "insight-3",
    title: "Booking Velocity",
    category: "booking",
    mainMetric: "14 Inquiries This Wk",
    secondaryMetric: "3 Upcoming Check-ins",
    changeBadge: { value: "68% Lead Conversion", isPositive: true },
    insightDescription: "Student semester admissions in Greater Noida generated strong pre-booking tokens.",
    recommendation: "Ensure 2 vacant beds in Room 102 are cleaned and bedding prepared before Nov 28.",
  },
  {
    id: "insight-4",
    title: "Portfolio Yield",
    category: "performance",
    mainMetric: "₹10,200 Avg Rev/Bed",
    secondaryMetric: "+₹850 vs Q2 benchmark",
    changeBadge: { value: "+8.4% Revenue Growth", isPositive: true },
    insightDescription: "High-value executive studio rentals boosted overall revenue across all 3 properties.",
    recommendation: "Introduce optional laundry and meal subscriptions to unlock 6% incremental yield.",
  },
];

export const MOCK_UPCOMING_CHECKINS: UpcomingCheckInItem[] = [
  {
    id: "ci-1",
    tenantName: "Aakash Varma",
    phone: "+91 98234 11029",
    propertyName: "Royal Residency PG",
    roomBed: "Room 204 • Bed A",
    checkInDate: "28 Nov 2026",
    daysRemaining: "In 4 days",
  },
  {
    id: "ci-2",
    tenantName: "Sneha Mukherjee",
    phone: "+91 97118 45920",
    propertyName: "Green Villa PG & Hostel",
    roomBed: "Room 102 • Bed C",
    checkInDate: "01 Dec 2026",
    daysRemaining: "In 7 days",
  },
  {
    id: "ci-3",
    tenantName: "Divya Nambiar",
    phone: "+91 96192 74301",
    propertyName: "Royal Residency PG",
    roomBed: "Room 105 • Bed B",
    checkInDate: "26 Nov 2026",
    daysRemaining: "In 2 days",
  },
];

export const MOCK_UPCOMING_CHECKOUTS: UpcomingCheckOutItem[] = [
  {
    id: "co-1",
    tenantName: "Manish Saxena",
    propertyName: "Royal Residency PG",
    roomBed: "Room 108 • Bed 2",
    checkOutDate: "30 Nov 2026",
    noticeDaysRemaining: "6 days remaining",
    depositRefundStatus: "Pending Inspection",
  },
  {
    id: "co-2",
    tenantName: "Kavita Rao",
    propertyName: "Green Villa PG & Hostel",
    roomBed: "Room 203 • Bed 1",
    checkOutDate: "05 Dec 2026",
    noticeDaysRemaining: "11 days remaining",
    depositRefundStatus: "Approved",
  },
];

export const MOCK_PENDING_COMPLAINTS: PendingComplaintItem[] = [
  {
    id: "cmp-1",
    title: "AC cooling insufficient",
    tenantName: "Kunal Mehra",
    roomNumber: "Room 202",
    propertyName: "Royal Residency PG",
    priority: "high",
    status: "in_progress",
    createdAt: "2 hrs ago",
  },
  {
    id: "cmp-2",
    title: "Geyser thermostat not tripping",
    tenantName: "Tanya Sen",
    roomNumber: "Room 301",
    propertyName: "Green Villa PG & Hostel",
    priority: "high",
    status: "open",
    createdAt: "4 hrs ago",
  },
  {
    id: "cmp-3",
    title: "Cupboard door hinge loose",
    tenantName: "Aditya Mehta",
    roomNumber: "Room 204",
    propertyName: "Royal Residency PG",
    priority: "low",
    status: "scheduled",
    createdAt: "Yesterday",
  },
];

export function getBusinessInsights(propertyId?: string | null): BusinessInsightCard[] {
  return MOCK_BUSINESS_INSIGHTS;
}
