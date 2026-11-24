export interface RecentBookingRecord {
  id: string;
  tenantName: string;
  tenantPhone: string;
  avatarInitials: string;
  propertyName: string;
  roomBed: string;
  bookingDate: string;
  checkInDate: string;
  bookingAmount: number;
  advancePaid: number;
  status: "confirmed" | "pending" | "cancelled";
}

export const MOCK_RECENT_BOOKINGS: RecentBookingRecord[] = [
  {
    id: "bk-101",
    tenantName: "Aakash Varma",
    tenantPhone: "+91 98234 11029",
    avatarInitials: "AV",
    propertyName: "Royal Residency PG",
    roomBed: "Room 204 • Bed A",
    bookingDate: "24 Nov 2026",
    checkInDate: "28 Nov 2026",
    bookingAmount: 18000,
    advancePaid: 5000,
    status: "confirmed",
  },
  {
    id: "bk-102",
    tenantName: "Sneha Mukherjee",
    tenantPhone: "+91 97118 45920",
    avatarInitials: "SM",
    propertyName: "Green Villa PG & Hostel",
    roomBed: "Room 102 • Bed C",
    bookingDate: "23 Nov 2026",
    checkInDate: "01 Dec 2026",
    bookingAmount: 12500,
    advancePaid: 3000,
    status: "confirmed",
  },
  {
    id: "bk-103",
    tenantName: "Kabir Malhotra",
    tenantPhone: "+91 99580 83112",
    avatarInitials: "KM",
    propertyName: "Urban Oasis Co-Living",
    roomBed: "Studio 301 • Bed 1",
    bookingDate: "23 Nov 2026",
    checkInDate: "30 Nov 2026",
    bookingAmount: 24000,
    advancePaid: 0,
    status: "pending",
  },
  {
    id: "bk-104",
    tenantName: "Divya Nambiar",
    tenantPhone: "+91 96192 74301",
    avatarInitials: "DN",
    propertyName: "Royal Residency PG",
    roomBed: "Room 105 • Bed B",
    bookingDate: "22 Nov 2026",
    checkInDate: "26 Nov 2026",
    bookingAmount: 14000,
    advancePaid: 14000,
    status: "confirmed",
  },
  {
    id: "bk-105",
    tenantName: "Rishabh Goel",
    tenantPhone: "+91 98991 32456",
    avatarInitials: "RG",
    propertyName: "Green Villa PG & Hostel",
    roomBed: "Room 208 • Bed B",
    bookingDate: "20 Nov 2026",
    checkInDate: "25 Nov 2026",
    bookingAmount: 10500,
    advancePaid: 2000,
    status: "cancelled",
  },
];

export function getRecentBookings(propertyId?: string | null): RecentBookingRecord[] {
  if (!propertyId || propertyId === "all") {
    return MOCK_RECENT_BOOKINGS;
  }
  const propNameMap: Record<string, string> = {
    "prop-1": "Royal Residency PG",
    "prop-2": "Green Villa PG & Hostel",
    "prop-3": "Urban Oasis Co-Living",
  };
  const targetName = propNameMap[propertyId];
  return targetName
    ? MOCK_RECENT_BOOKINGS.filter((b) => b.propertyName === targetName)
    : MOCK_RECENT_BOOKINGS;
}
