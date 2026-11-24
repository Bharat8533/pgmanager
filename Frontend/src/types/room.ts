export type RoomType =
  | "Single Sharing"
  | "Double Sharing"
  | "Triple Sharing"
  | "Four Sharing"
  | "Custom";

export type RoomStatus =
  | "available"
  | "partially_occupied"
  | "fully_occupied"
  | "fully_reserved"
  | "under_maintenance"
  | "inactive";

export type BedStatus =
  | "available"
  | "occupied"
  | "reserved"
  | "under_maintenance"
  | "inactive";

export interface Bed {
  id: string;
  bedNumber: string; // e.g. "101-A", "101-B"
  roomId: string;
  propertyId: string;
  residentId?: string;
  bookingId?: string;
  status: BedStatus;
  assignedRent?: number;
}

export interface Resident {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
  email: string;
  emergencyContact: string;
  address?: string;
  propertyId: string;
  propertyName?: string;
  roomId: string;
  roomNumber: string;
  bedId: string;
  bedNumber: string;
  admissionDate: string;
  livingSince: string;
  expectedCheckoutDate?: string; // If set, resident has notice or checkout planned
  monthlyRent: number;
  securityDeposit: number;
  paymentStatus: "paid" | "pending" | "overdue";
  totalRentBilled: number;
  totalRentCollected: number;
  pendingAmount: number;
  status: "active" | "notice" | "checked_out";
  workOrCollege?: string;
  notes?: string;
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "expired"
  | "converted";

export interface Booking {
  id: string;
  bookingCode: string; // e.g. "BK-8021"
  residentName: string;
  phone: string;
  propertyId: string;
  roomId: string;
  roomNumber: string;
  bedId: string;
  bedNumber: string;
  bookingDate: string;
  checkInDate: string;
  checkOutDate?: string;
  advanceAmount: number;
  status: BookingStatus;
  notes?: string;
}

export type PaymentMethod = "UPI" | "Bank Transfer" | "Cash" | "Card" | "Net Banking";
export type PaymentStatus = "completed" | "pending" | "overdue";
export type PaymentType = "rent" | "security_deposit";

export interface PaymentRecord {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-104"
  residentId: string;
  residentName: string;
  roomId: string;
  roomNumber: string;
  bedNumber: string;
  amount: number;
  date: string;
  dueDate?: string;
  method?: PaymentMethod;
  status: PaymentStatus;
  type: PaymentType;
  daysOverdue?: number;
  notes?: string;
}

export interface SecurityDepositRecord {
  id: string;
  residentId: string;
  residentName: string;
  roomId: string;
  roomNumber: string;
  bedNumber: string;
  receivedAmount: number;
  receivedDate: string;
  adjustments: number; // e.g. damages or unbilled utilities
  refunds: number;
  currentHeld: number; // receivedAmount - adjustments - refunds
  status: "held" | "partially_refunded" | "fully_refunded" | "forfeited";
}

export interface Room {
  id: string;
  propertyId: string;
  roomNumber: string;
  floor: string; // "Ground Floor", "1st Floor", "2nd Floor", "3rd Floor"
  roomType: RoomType;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  reservedBeds: number;
  maintenanceBeds: number;
  defaultMonthlyRent: number;
  roomStatus: RoomStatus;
  image?: string;
  description?: string;
  amenities: string[];
  createdAt?: string;
}

export interface RoomSummaryStats {
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  reservedBeds: number;
  maintenanceBeds: number;
  occupancyRate: number; // Occupied Beds / Total Beds * 100
  rentCollectedThisMonth: number;
  pendingRent: number;
  upcomingCheckoutsCount: number;
  securityDepositsHeld: number;
}

export interface RoomFinancialSummary {
  totalRentBilled: number;
  totalRentCollected: number;
  pendingRent: number;
  securityDepositsHeld: number;
}

export interface RoomFiltersState {
  searchQuery: string;
  roomType: string; // "all" | RoomType
  roomStatus: string; // "all" | RoomStatus
  floor: string; // "all" | floor name
  sortBy: "room_asc" | "room_desc" | "occupancy_high" | "occupancy_low" | "beds_high" | "beds_low";
}

export interface UpcomingCheckoutItem {
  resident: Resident;
  room: Room;
  daysRemaining: number;
}
