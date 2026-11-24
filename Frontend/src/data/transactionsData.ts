export interface RecentTransactionRecord {
  id: string;
  transactionId: string;
  tenantName: string;
  avatarInitials: string;
  propertyName: string;
  roomNumber: string;
  transactionType: "Monthly Rent" | "Security Deposit" | "Booking Advance" | "Maintenance Charges" | "Other Charges";
  amount: number;
  paymentMethod: "UPI" | "Cash" | "Bank Transfer" | "Card";
  transactionDate: string;
  status: "successful" | "pending" | "failed";
  receiptUrl?: string;
}

export const MOCK_RECENT_TRANSACTIONS: RecentTransactionRecord[] = [
  {
    id: "tx-1",
    transactionId: "TXN-849201",
    tenantName: "Rohan Sharma",
    avatarInitials: "RS",
    propertyName: "Royal Residency PG",
    roomNumber: "Room 204",
    transactionType: "Monthly Rent",
    amount: 14500,
    paymentMethod: "UPI",
    transactionDate: "24 Nov 2026, 10:15 AM",
    status: "successful",
  },
  {
    id: "tx-2",
    transactionId: "TXN-849182",
    tenantName: "Aakash Varma",
    avatarInitials: "AV",
    propertyName: "Royal Residency PG",
    roomNumber: "Room 204",
    transactionType: "Security Deposit",
    amount: 18000,
    paymentMethod: "Bank Transfer",
    transactionDate: "24 Nov 2026, 09:40 AM",
    status: "successful",
  },
  {
    id: "tx-3",
    transactionId: "TXN-849150",
    tenantName: "Priya Sen",
    avatarInitials: "PS",
    propertyName: "Green Villa PG & Hostel",
    roomNumber: "Room 108",
    transactionType: "Monthly Rent",
    amount: 12000,
    paymentMethod: "UPI",
    transactionDate: "23 Nov 2026, 06:20 PM",
    status: "successful",
  },
  {
    id: "tx-4",
    transactionId: "TXN-849114",
    tenantName: "Vikrant Chauhan",
    avatarInitials: "VC",
    propertyName: "Urban Oasis Co-Living",
    roomNumber: "Room 301",
    transactionType: "Monthly Rent",
    amount: 16000,
    paymentMethod: "UPI",
    transactionDate: "22 Nov 2026, 02:10 PM",
    status: "pending",
  },
  {
    id: "tx-5",
    transactionId: "TXN-849098",
    tenantName: "Sneha Mukherjee",
    avatarInitials: "SM",
    propertyName: "Green Villa PG & Hostel",
    roomNumber: "Room 102",
    transactionType: "Booking Advance",
    amount: 3000,
    paymentMethod: "Card",
    transactionDate: "22 Nov 2026, 11:35 AM",
    status: "successful",
  },
  {
    id: "tx-6",
    transactionId: "TXN-849045",
    tenantName: "Ankit Trivedi",
    avatarInitials: "AT",
    propertyName: "Royal Residency PG",
    roomNumber: "Room 105",
    transactionType: "Monthly Rent",
    amount: 11000,
    paymentMethod: "UPI",
    transactionDate: "21 Nov 2026, 08:50 PM",
    status: "failed",
  },
  {
    id: "tx-7",
    transactionId: "TXN-848980",
    tenantName: "Kunal Mehra",
    avatarInitials: "KM",
    propertyName: "Urban Oasis Co-Living",
    roomNumber: "Room 202",
    transactionType: "Maintenance Charges",
    amount: 1500,
    paymentMethod: "Cash",
    transactionDate: "20 Nov 2026, 04:15 PM",
    status: "successful",
  },
];

export function getRecentTransactions(propertyId?: string | null): RecentTransactionRecord[] {
  if (!propertyId || propertyId === "all") {
    return MOCK_RECENT_TRANSACTIONS;
  }
  const propNameMap: Record<string, string> = {
    "prop-1": "Royal Residency PG",
    "prop-2": "Green Villa PG & Hostel",
    "prop-3": "Urban Oasis Co-Living",
  };
  const targetName = propNameMap[propertyId];
  return targetName
    ? MOCK_RECENT_TRANSACTIONS.filter((t) => t.propertyName === targetName)
    : MOCK_RECENT_TRANSACTIONS;
}
