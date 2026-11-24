export interface KPICardMetric {
  id: string;
  title: string;
  value: string | number;
  secondaryMetric?: string;
  supportingText: string;
  trend: {
    value: string;
    isPositive: boolean;
    periodText?: string;
  };
  iconName: "Building2" | "BedDouble" | "Bed" | "Users" | "CreditCard" | "AlertCircle" | "TrendingUp" | "ShieldCheck";
  statusColor: "blue" | "green" | "orange" | "red" | "purple";
  progressPercent?: number;
}

export interface PropertyKPISet {
  totalProperties: KPICardMetric;
  totalRooms: KPICardMetric;
  totalBeds: KPICardMetric;
  activeTenants: KPICardMetric;
  monthlyCollection: KPICardMetric;
  pendingPayments: KPICardMetric;
}

export const KPI_DATA_BY_PROPERTY: Record<string, PropertyKPISet> = {
  // Aggregate / Portfolio (All Properties)
  all: {
    totalProperties: {
      id: "total-properties",
      title: "Total Properties",
      value: 3,
      secondaryMetric: "3 Operating",
      supportingText: "100% operational branches",
      trend: { value: "+1 this quarter", isPositive: true, periodText: "vs Q3" },
      iconName: "Building2",
      statusColor: "blue",
    },
    totalRooms: {
      id: "total-rooms",
      title: "Total Rooms",
      value: 57,
      secondaryMetric: "44 Occupied • 8 Available",
      supportingText: "3 Reserved • 2 Maintenance",
      trend: { value: "77.2% Room Occ.", isPositive: true },
      iconName: "BedDouble",
      statusColor: "blue",
      progressPercent: 77.2,
    },
    totalBeds: {
      id: "total-beds",
      title: "Total Beds",
      value: 126,
      secondaryMetric: "115 Occupied • 7 Available",
      supportingText: "3 Reserved • 1 Under Repair",
      trend: { value: "91.3% Bed Occ.", isPositive: true },
      iconName: "Bed",
      statusColor: "green",
      progressPercent: 91.3,
    },
    activeTenants: {
      id: "active-tenants",
      title: "Active Tenants",
      value: 115,
      secondaryMetric: "+8 Admitted",
      supportingText: "98% KYC & police verified",
      trend: { value: "+7.2% vs last mo.", isPositive: true },
      iconName: "Users",
      statusColor: "purple",
    },
    monthlyCollection: {
      id: "monthly-collection",
      title: "Monthly Collection",
      value: "₹12,85,000",
      secondaryMetric: "Target: ₹13.5L",
      supportingText: "95.2% collected of billed rent",
      trend: { value: "+8.4%", isPositive: true, periodText: "vs prev. month" },
      iconName: "TrendingUp",
      statusColor: "green",
      progressPercent: 95.2,
    },
    pendingPayments: {
      id: "pending-payments",
      title: "Pending Payments",
      value: "₹58,500",
      secondaryMetric: "5 Tenants Due",
      supportingText: "3 reminders sent today via SMS/WA",
      trend: { value: "-14.2% dues", isPositive: true, periodText: "improved" },
      iconName: "CreditCard",
      statusColor: "orange",
    },
  },

  // Property 1: Royal Residency PG (Gurugram)
  "prop-1": {
    totalProperties: {
      id: "total-properties",
      title: "Property Type",
      value: "Executive",
      secondaryMetric: "Gurugram, Sec 45",
      supportingText: "Premium Executive PG & Co-living",
      trend: { value: "Top Performer", isPositive: true },
      iconName: "Building2",
      statusColor: "blue",
    },
    totalRooms: {
      id: "total-rooms",
      title: "Total Rooms",
      value: 24,
      secondaryMetric: "20 Occupied • 2 Available",
      supportingText: "1 Reserved • 1 Maintenance",
      trend: { value: "83.3% Occupied", isPositive: true },
      iconName: "BedDouble",
      statusColor: "blue",
      progressPercent: 83.3,
    },
    totalBeds: {
      id: "total-beds",
      title: "Total Beds",
      value: 56,
      secondaryMetric: "51 Occupied • 3 Available",
      supportingText: "1 Reserved • 1 Repair",
      trend: { value: "91.1% Bed Occ.", isPositive: true },
      iconName: "Bed",
      statusColor: "green",
      progressPercent: 91.1,
    },
    activeTenants: {
      id: "active-tenants",
      title: "Active Tenants",
      value: 51,
      secondaryMetric: "+4 This Month",
      supportingText: "100% KYC verified corporate tenants",
      trend: { value: "+5.1%", isPositive: true },
      iconName: "Users",
      statusColor: "purple",
    },
    monthlyCollection: {
      id: "monthly-collection",
      title: "Monthly Collection",
      value: "₹6,45,000",
      secondaryMetric: "Target: ₹6.8L",
      supportingText: "94.8% collection efficiency",
      trend: { value: "+6.2%", isPositive: true },
      iconName: "TrendingUp",
      statusColor: "green",
      progressPercent: 94.8,
    },
    pendingPayments: {
      id: "pending-payments",
      title: "Pending Payments",
      value: "₹28,000",
      secondaryMetric: "2 Tenants Due",
      supportingText: "Payment promises on 26th Nov",
      trend: { value: "Within grace period", isPositive: true },
      iconName: "CreditCard",
      statusColor: "orange",
    },
  },

  // Property 2: Green Villa PG & Hostel (Greater Noida)
  "prop-2": {
    totalProperties: {
      id: "total-properties",
      title: "Property Type",
      value: "Student PG",
      secondaryMetric: "Greater Noida, KP-III",
      supportingText: "Student & Working Women Hostel",
      trend: { value: "Full Semester", isPositive: true },
      iconName: "Building2",
      statusColor: "blue",
    },
    totalRooms: {
      id: "total-rooms",
      title: "Total Rooms",
      value: 18,
      secondaryMetric: "14 Occupied • 3 Available",
      supportingText: "1 Reserved • 0 Maintenance",
      trend: { value: "77.8% Occupied", isPositive: true },
      iconName: "BedDouble",
      statusColor: "blue",
      progressPercent: 77.8,
    },
    totalBeds: {
      id: "total-beds",
      title: "Total Beds",
      value: 40,
      secondaryMetric: "36 Occupied • 2 Available",
      supportingText: "2 Reserved • 0 Maintenance",
      trend: { value: "90.0% Bed Occ.", isPositive: true },
      iconName: "Bed",
      statusColor: "green",
      progressPercent: 90.0,
    },
    activeTenants: {
      id: "active-tenants",
      title: "Active Tenants",
      value: 36,
      secondaryMetric: "+3 Admissions",
      supportingText: "University semester batch enrolled",
      trend: { value: "+9.1%", isPositive: true },
      iconName: "Users",
      statusColor: "purple",
    },
    monthlyCollection: {
      id: "monthly-collection",
      title: "Monthly Collection",
      value: "₹3,90,000",
      secondaryMetric: "Target: ₹4.1L",
      supportingText: "95.1% collection efficiency",
      trend: { value: "+11.5%", isPositive: true },
      iconName: "TrendingUp",
      statusColor: "green",
      progressPercent: 95.1,
    },
    pendingPayments: {
      id: "pending-payments",
      title: "Pending Payments",
      value: "₹18,500",
      secondaryMetric: "2 Tenants Due",
      supportingText: "Parental reminder letters sent",
      trend: { value: "Follow-up active", isPositive: false },
      iconName: "CreditCard",
      statusColor: "orange",
    },
  },

  // Property 3: Urban Oasis Co-Living (South Delhi)
  "prop-3": {
    totalProperties: {
      id: "total-properties",
      title: "Property Type",
      value: "Studio PG",
      secondaryMetric: "Hauz Khas, Delhi",
      supportingText: "Premium Private Studio Living",
      trend: { value: "High Yield", isPositive: true },
      iconName: "Building2",
      statusColor: "blue",
    },
    totalRooms: {
      id: "total-rooms",
      title: "Total Rooms",
      value: 15,
      secondaryMetric: "10 Occupied • 3 Available",
      supportingText: "1 Reserved • 1 Renovation",
      trend: { value: "66.7% Occupied", isPositive: true },
      iconName: "BedDouble",
      statusColor: "blue",
      progressPercent: 66.7,
    },
    totalBeds: {
      id: "total-beds",
      title: "Total Beds",
      value: 30,
      secondaryMetric: "28 Occupied • 2 Available",
      supportingText: "0 Reserved • 0 Repair",
      trend: { value: "93.3% Bed Occ.", isPositive: true },
      iconName: "Bed",
      statusColor: "green",
      progressPercent: 93.3,
    },
    activeTenants: {
      id: "active-tenants",
      title: "Active Tenants",
      value: 28,
      secondaryMetric: "+1 Admitted",
      supportingText: "Creative professionals & entrepreneurs",
      trend: { value: "+3.7%", isPositive: true },
      iconName: "Users",
      statusColor: "purple",
    },
    monthlyCollection: {
      id: "monthly-collection",
      title: "Monthly Collection",
      value: "₹2,50,000",
      secondaryMetric: "Target: ₹2.6L",
      supportingText: "96.2% collection efficiency",
      trend: { value: "+7.8%", isPositive: true },
      iconName: "TrendingUp",
      statusColor: "green",
      progressPercent: 96.2,
    },
    pendingPayments: {
      id: "pending-payments",
      title: "Pending Payments",
      value: "₹12,000",
      secondaryMetric: "1 Tenant Due",
      supportingText: "Pending international bank wire",
      trend: { value: "Due today", isPositive: false },
      iconName: "CreditCard",
      statusColor: "orange",
    },
  },
};

export function getKPIData(propertyId?: string | null, dateRange: string = "thisMonth"): KPICardMetric[] {
  const baseKey = propertyId && KPI_DATA_BY_PROPERTY[propertyId] ? propertyId : "all";
  const propertyKPI = KPI_DATA_BY_PROPERTY[baseKey];

  const cards = [
    propertyKPI.totalProperties,
    propertyKPI.totalRooms,
    propertyKPI.totalBeds,
    propertyKPI.activeTenants,
    propertyKPI.monthlyCollection,
    propertyKPI.pendingPayments,
  ];

  // Dynamically tailor collection values based on the date range
  if (dateRange === "today") {
    return cards.map((c) => {
      if (c.id === "monthly-collection") {
        return {
          ...c,
          title: "Today's Collection",
          value: baseKey === "all" ? "₹42,500" : "₹18,000",
          supportingText: "3 payments received today",
          trend: { value: "On track", isPositive: true },
        };
      }
      return c;
    });
  }

  if (dateRange === "last7days") {
    return cards.map((c) => {
      if (c.id === "monthly-collection") {
        return {
          ...c,
          title: "7-Day Collection",
          value: baseKey === "all" ? "₹3,45,000" : "₹1,60,000",
          supportingText: "Past 7 days rent inflows",
          trend: { value: "+12.1%", isPositive: true },
        };
      }
      return c;
    });
  }

  if (dateRange === "thisYear") {
    return cards.map((c) => {
      if (c.id === "monthly-collection") {
        return {
          ...c,
          title: "YTD Total Collection",
          value: baseKey === "all" ? "₹1,42,80,000" : "₹71,50,000",
          supportingText: "Gross FY 2026-27 inflows",
          trend: { value: "+18.4% YoY", isPositive: true },
        };
      }
      return c;
    });
  }

  return cards;
}
