export type StaffRole =
  | "Manager"
  | "Warden"
  | "Security Guard"
  | "Cook / Chef"
  | "Housekeeping"
  | "Maintenance Staff"
  | "Receptionist"
  | "Accountant"
  | "Other";

export type StaffStatus = "active" | "on_leave" | "inactive";

export type EmploymentType = "full_time" | "part_time" | "contract" | "temporary";

export type ShiftTiming = "morning" | "evening" | "night" | "rotational" | "custom";

export type SalaryPaymentType = "monthly" | "weekly" | "daily" | "hourly";

export type DocumentType =
  | "Aadhaar Card"
  | "PAN Card"
  | "Identity Proof"
  | "Address Proof"
  | "Employment Agreement"
  | "Police Verification"
  | "Other Document";

export interface StaffDocument {
  id: string;
  name: string;
  type: DocumentType;
  fileSize: string;
  uploadDate: string;
  fileUrl?: string;
}

export interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  primaryPhone: string;
  alternatePhone?: string;
  address?: string;
}

export interface StaffMember {
  id: string;
  employeeId: string; // e.g. "STF-1001"
  name: string;
  profilePhoto?: string;
  dob?: string;
  gender?: "Male" | "Female" | "Other";
  phone: string;
  alternatePhone?: string;
  email?: string;
  currentAddress?: string;
  permanentAddress?: string;
  bloodGroup?: string;

  // Employment
  role: StaffRole;
  customRoleTitle?: string;
  department: string;
  propertyId: string;
  propertyName: string;
  joiningDate: string;
  employmentType: EmploymentType;
  status: StaffStatus;
  shiftTiming: ShiftTiming;
  customShiftDetails?: string;
  responsibilities: string;
  reportingManager?: string;

  // Salary & Payment
  monthlySalary: number;
  salaryPaymentType: SalaryPaymentType;
  salaryPaymentDate?: number; // e.g., 5th of month
  additionalAllowance?: number;
  bonus?: number;
  deductions?: number;
  salaryNotes?: string;
  bankDetails?: BankDetails;

  // Emergency Contact
  emergencyContact: EmergencyContact;

  // Documents
  documents: StaffDocument[];

  // Additional Information
  previousExperience?: string;
  previousEmployer?: string;
  skills?: string[];
  qualifications?: string;
  notes?: string;
  specialInstructions?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface StaffFiltersState {
  search: string;
  status: StaffStatus | "all";
  role: StaffRole | "all";
  propertyId: string | "all";
  joiningDateRange: "all" | "today" | "this_month" | "last_30_days" | "custom";
  customStartDate?: string;
  customEndDate?: string;
  minSalary?: number | "";
  maxSalary?: number | "";
  sortBy: "name" | "joiningDate" | "salary" | "employeeId";
  sortOrder: "asc" | "desc";
}

export interface StaffStatsData {
  totalStaff: number;
  activeStaff: number;
  onLeaveStaff: number;
  inactiveStaff: number;
}
