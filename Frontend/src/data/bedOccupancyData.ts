export interface BedCategoryMetric {
  name: string;
  count: number;
  percentage: number;
  color: string;
  badge: string;
}

export interface BedSharingBreakdown {
  type: string;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  pricePerBed: string;
  occupancyRate: number;
}

export interface BedOccupancyOverview {
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  reservedBeds: number;
  maintenanceBeds: number;
  occupancyRate: number;
  capacityUtilization: "Optimal" | "High" | "Critical";
  sharingBreakdown: BedSharingBreakdown[];
  categories: BedCategoryMetric[];
  insightNote: string;
}

export const BED_OCCUPANCY_BY_PROPERTY: Record<string, BedOccupancyOverview> = {
  // Aggregate Portfolio
  all: {
    totalBeds: 126,
    occupiedBeds: 115,
    availableBeds: 7,
    reservedBeds: 3,
    maintenanceBeds: 1,
    occupancyRate: 91.3,
    capacityUtilization: "High",
    insightNote: "Notice: 77.2% room occupancy yields 91.3% bed utilization due to multi-sharing configurations.",
    categories: [
      {
        name: "Occupied Beds",
        count: 115,
        percentage: 91.3,
        color: "#10B981", // Green
        badge: "Revenue Generating",
      },
      {
        name: "Available Beds",
        count: 7,
        percentage: 5.6,
        color: "#2563EB", // Blue
        badge: "Ready to Sell",
      },
      {
        name: "Reserved Beds",
        count: 3,
        percentage: 2.3,
        color: "#F59E0B", // Amber
        badge: "Token Paid",
      },
      {
        name: "Maintenance Beds",
        count: 1,
        percentage: 0.8,
        color: "#EF4444", // Red
        badge: "Bed Frame Repair",
      },
    ],
    sharingBreakdown: [
      {
        type: "Single Sharing",
        totalBeds: 24,
        occupiedBeds: 22,
        availableBeds: 2,
        pricePerBed: "₹18,000 / mo",
        occupancyRate: 91.7,
      },
      {
        type: "Double Sharing",
        totalBeds: 62,
        occupiedBeds: 58,
        availableBeds: 3,
        pricePerBed: "₹12,500 / mo",
        occupancyRate: 93.5,
      },
      {
        type: "Triple Sharing",
        totalBeds: 40,
        occupiedBeds: 35,
        availableBeds: 2,
        pricePerBed: "₹8,500 / mo",
        occupancyRate: 87.5,
      },
    ],
  },

  // Property 1: Royal Residency PG (Gurugram)
  "prop-1": {
    totalBeds: 56,
    occupiedBeds: 51,
    availableBeds: 3,
    reservedBeds: 1,
    maintenanceBeds: 1,
    occupancyRate: 91.1,
    capacityUtilization: "High",
    insightNote: "Single & double rooms near Cyber Hub have 96% retention rate.",
    categories: [
      {
        name: "Occupied Beds",
        count: 51,
        percentage: 91.1,
        color: "#10B981",
        badge: "Active",
      },
      {
        name: "Available Beds",
        count: 3,
        percentage: 5.4,
        color: "#2563EB",
        badge: "Open",
      },
      {
        name: "Reserved Beds",
        count: 1,
        percentage: 1.8,
        color: "#F59E0B",
        badge: "Reserved",
      },
      {
        name: "Maintenance Beds",
        count: 1,
        percentage: 1.7,
        color: "#EF4444",
        badge: "Mattress Renewal",
      },
    ],
    sharingBreakdown: [
      {
        type: "Single Sharing",
        totalBeds: 16,
        occupiedBeds: 15,
        availableBeds: 1,
        pricePerBed: "₹20,000 / mo",
        occupancyRate: 93.8,
      },
      {
        type: "Double Sharing",
        totalBeds: 40,
        occupiedBeds: 36,
        availableBeds: 2,
        pricePerBed: "₹14,000 / mo",
        occupancyRate: 90.0,
      },
    ],
  },

  // Property 2: Green Villa PG & Hostel (Greater Noida)
  "prop-2": {
    totalBeds: 40,
    occupiedBeds: 36,
    availableBeds: 2,
    reservedBeds: 2,
    maintenanceBeds: 0,
    occupancyRate: 90.0,
    capacityUtilization: "High",
    insightNote: "Triple sharing student rooms fully booked for semester exams.",
    categories: [
      {
        name: "Occupied Beds",
        count: 36,
        percentage: 90.0,
        color: "#10B981",
        badge: "Active",
      },
      {
        name: "Available Beds",
        count: 2,
        percentage: 5.0,
        color: "#2563EB",
        badge: "Open",
      },
      {
        name: "Reserved Beds",
        count: 2,
        percentage: 5.0,
        color: "#F59E0B",
        badge: "Reserved",
      },
      {
        name: "Maintenance Beds",
        count: 0,
        percentage: 0.0,
        color: "#EF4444",
        badge: "None",
      },
    ],
    sharingBreakdown: [
      {
        type: "Double Sharing",
        totalBeds: 16,
        occupiedBeds: 15,
        availableBeds: 1,
        pricePerBed: "₹10,500 / mo",
        occupancyRate: 93.8,
      },
      {
        type: "Triple Sharing",
        totalBeds: 24,
        occupiedBeds: 21,
        availableBeds: 1,
        pricePerBed: "₹7,500 / mo",
        occupancyRate: 87.5,
      },
    ],
  },

  // Property 3: Urban Oasis Co-Living (South Delhi)
  "prop-3": {
    totalBeds: 30,
    occupiedBeds: 28,
    availableBeds: 2,
    reservedBeds: 0,
    maintenanceBeds: 0,
    occupancyRate: 93.3,
    capacityUtilization: "Critical",
    insightNote: "Only 2 studio beds remaining. High demand for private terrace studios.",
    categories: [
      {
        name: "Occupied Beds",
        count: 28,
        percentage: 93.3,
        color: "#10B981",
        badge: "Active",
      },
      {
        name: "Available Beds",
        count: 2,
        percentage: 6.7,
        color: "#2563EB",
        badge: "Available",
      },
      {
        name: "Reserved Beds",
        count: 0,
        percentage: 0.0,
        color: "#F59E0B",
        badge: "None",
      },
      {
        name: "Maintenance Beds",
        count: 0,
        percentage: 0.0,
        color: "#EF4444",
        badge: "None",
      },
    ],
    sharingBreakdown: [
      {
        type: "Studio Private",
        totalBeds: 8,
        occupiedBeds: 7,
        availableBeds: 1,
        pricePerBed: "₹24,000 / mo",
        occupancyRate: 87.5,
      },
      {
        type: "Double Executive",
        totalBeds: 22,
        occupiedBeds: 21,
        availableBeds: 1,
        pricePerBed: "₹15,000 / mo",
        occupancyRate: 95.5,
      },
    ],
  },
};

export function getBedOccupancyData(propertyId?: string | null): BedOccupancyOverview {
  const key = propertyId && BED_OCCUPANCY_BY_PROPERTY[propertyId] ? propertyId : "all";
  return BED_OCCUPANCY_BY_PROPERTY[key];
}
