export interface RoomCategoryData {
  name: string;
  count: number;
  percentage: number;
  color: string;
  description: string;
}

export interface RoomOccupancyOverview {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  reservedRooms: number;
  maintenanceRooms: number;
  occupancyRate: number;
  categories: RoomCategoryData[];
  statusSummary: string;
}

export const ROOM_OCCUPANCY_BY_PROPERTY: Record<string, RoomOccupancyOverview> = {
  // Aggregate Portfolio
  all: {
    totalRooms: 57,
    occupiedRooms: 44,
    availableRooms: 8,
    reservedRooms: 3,
    maintenanceRooms: 2,
    occupancyRate: 77.2,
    statusSummary: "Optimal room distribution. 8 rooms are move-in ready across branches.",
    categories: [
      {
        name: "Occupied Rooms",
        count: 44,
        percentage: 77.2,
        color: "#2563EB", // Primary Blue
        description: "Active residing tenants",
      },
      {
        name: "Available Rooms",
        count: 8,
        percentage: 14.0,
        color: "#10B981", // Emerald Green
        description: "Ready for immediate move-in",
      },
      {
        name: "Reserved Rooms",
        count: 3,
        percentage: 5.3,
        color: "#F59E0B", // Amber Orange
        description: "Advance tokens received",
      },
      {
        name: "Maintenance Rooms",
        count: 2,
        percentage: 3.5,
        color: "#EF4444", // Rose Red
        description: "Painting & plumbing overhaul",
      },
    ],
  },

  // Property 1: Royal Residency PG (Gurugram)
  "prop-1": {
    totalRooms: 24,
    occupiedRooms: 20,
    availableRooms: 2,
    reservedRooms: 1,
    maintenanceRooms: 1,
    occupancyRate: 83.3,
    statusSummary: "High executive occupancy in Gurugram. 2 rooms available on 3rd floor.",
    categories: [
      {
        name: "Occupied Rooms",
        count: 20,
        percentage: 83.3,
        color: "#2563EB",
        description: "Active corporate tenants",
      },
      {
        name: "Available Rooms",
        count: 2,
        percentage: 8.3,
        color: "#10B981",
        description: "Available for admission",
      },
      {
        name: "Reserved Rooms",
        count: 1,
        percentage: 4.2,
        color: "#F59E0B",
        description: "Booking token received",
      },
      {
        name: "Maintenance Rooms",
        count: 1,
        percentage: 4.2,
        color: "#EF4444",
        description: "AC servicing underway",
      },
    ],
  },

  // Property 2: Green Villa PG & Hostel (Greater Noida)
  "prop-2": {
    totalRooms: 18,
    occupiedRooms: 14,
    availableRooms: 3,
    reservedRooms: 1,
    maintenanceRooms: 0,
    occupancyRate: 77.8,
    statusSummary: "Student semester occupancy steady. 0 rooms down for maintenance.",
    categories: [
      {
        name: "Occupied Rooms",
        count: 14,
        percentage: 77.8,
        color: "#2563EB",
        description: "Enrolled university students",
      },
      {
        name: "Available Rooms",
        count: 3,
        percentage: 16.7,
        color: "#10B981",
        description: "Triple sharing rooms open",
      },
      {
        name: "Reserved Rooms",
        count: 1,
        percentage: 5.5,
        color: "#F59E0B",
        description: "Admissions joining Nov 28",
      },
      {
        name: "Maintenance Rooms",
        count: 0,
        percentage: 0.0,
        color: "#EF4444",
        description: "All rooms operational",
      },
    ],
  },

  // Property 3: Urban Oasis Co-Living (South Delhi)
  "prop-3": {
    totalRooms: 15,
    occupiedRooms: 10,
    availableRooms: 3,
    reservedRooms: 1,
    maintenanceRooms: 1,
    occupancyRate: 66.7,
    statusSummary: "Boutique studio rooms. 1 studio undergoing premium interior refresh.",
    categories: [
      {
        name: "Occupied Rooms",
        count: 10,
        percentage: 66.7,
        color: "#2563EB",
        description: "Occupied luxury studios",
      },
      {
        name: "Available Rooms",
        count: 3,
        percentage: 20.0,
        color: "#10B981",
        description: "Vacant premium suites",
      },
      {
        name: "Reserved Rooms",
        count: 1,
        percentage: 6.7,
        color: "#F59E0B",
        description: "Check-in on Dec 1st",
      },
      {
        name: "Maintenance Rooms",
        count: 1,
        percentage: 6.6,
        color: "#EF4444",
        description: "Bathroom tiling upgrade",
      },
    ],
  },
};

export function getRoomOccupancyData(propertyId?: string | null): RoomOccupancyOverview {
  const key = propertyId && ROOM_OCCUPANCY_BY_PROPERTY[propertyId] ? propertyId : "all";
  return ROOM_OCCUPANCY_BY_PROPERTY[key];
}
