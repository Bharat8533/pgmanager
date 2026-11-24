export type StayStatus = "active" | "upcoming" | "checked_out";
export type RentStatus = "paid" | "partial" | "pending" | "overdue";
export type Gender = "Male" | "Female" | "Other";

export interface StayHistoryRecord {
  id: string;
  propertyName: string;
  roomNumber: string;
  bedNumber: string;
  admissionDate: string;
  checkoutDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: "completed" | "transferred" | "cancelled";
  notes?: string;
}

export interface Guest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  gender?: Gender;
  dateOfBirth?: string;
  avatar?: string;
  permanentAddress?: string;
  city?: string;
  state?: string;
  aadhaarMasked?: string; // Fictional masked format e.g. "•••• •••• 8291"
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyRelationship: string;
  propertyId: string;
  propertyName: string;
  roomId: string;
  roomNumber: string;
  bedId: string;
  bedNumber: string;
  admissionDate: string;
  livingSince: string;
  expectedCheckoutDate?: string;
  actualCheckoutDate?: string;
  stayStatus: StayStatus;
  monthlyRent: number;
  rentStatus: RentStatus;
  totalRentBilled: number;
  totalRentCollected: number;
  pendingAmount: number;
  securityDeposit: number;
  depositAdjustments: number;
  depositRefunded: number;
  depositBalance: number;
  workOrCollege?: string;
  specialNotes?: string;
  stayHistory: StayHistoryRecord[];
  createdAt?: string;
}

export interface GuestSummaryStats {
  totalGuests: number;
  currentlyLiving: number;
  upcomingCheckouts: number;
  checkedOutGuests: number;
  pendingRent: number;
  securityDepositsHeld: number;
}

export interface GuestFiltersState {
  searchQuery: string;
  propertyId: string; // "all" | propertyId
  stayStatus: "all" | StayStatus;
  rentStatus: "all" | RentStatus;
  sortBy: "name_asc" | "name_desc" | "admission_desc" | "admission_asc" | "pending_desc" | "checkout_asc";
}

export interface InitialPaymentPayload {
  amount: number;
  paymentDate: string;
  paymentMethod: "Cash" | "UPI" | "Bank Transfer" | "Other";
  paymentType: "rent" | "security_deposit";
  transactionRef?: string;
  notes?: string;
}

export interface AddGuestPayload {
  name: string;
  phone: string;
  email?: string;
  gender?: Gender;
  dateOfBirth?: string;
  avatar?: string;
  permanentAddress?: string;
  city?: string;
  state?: string;
  aadhaarMasked?: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyRelationship: string;
  propertyId: string;
  roomId: string;
  bedId: string;
  admissionDate: string;
  expectedCheckoutDate?: string;
  monthlyRent: number;
  securityDeposit: number;
  workOrCollege?: string;
  specialNotes?: string;
  initialPayment?: InitialPaymentPayload;
}

