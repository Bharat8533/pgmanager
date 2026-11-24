export interface CollectionDataPoint {
  label: string;
  rentCollected: number;
  pendingRent: number;
  otherCollections: number;
  totalInflow?: number;
}

export interface FinancialSummaryBreakdown {
  totalRentCollected: number;
  totalRentCollectedFormatted: string;
  rentComparisonText: string;
  isRentUp: boolean;

  pendingRentBalance: number;
  pendingRentFormatted: string;
  tenantsPendingCount: number;

  securityDepositHeld: number; // Strictly separate liability / refundable deposit balance!
  securityDepositFormatted: string;
  activeDepositCount: number;

  otherIncome: number;
  otherIncomeFormatted: string;
  otherIncomeDescription: string;
}

export interface CollectionTrendOverview {
  summary: FinancialSummaryBreakdown;
  trendPoints: CollectionDataPoint[];
  collectionEfficiencyRate: number;
}

// Data generator for different date ranges
export function getCollectionData(
  propertyId?: string | null,
  dateRange: string = "thisMonth"
): CollectionTrendOverview {
  const isAll = !propertyId || propertyId === "all";

  // Scale multiplier for properties:
  // all = 1.0, prop-1 = ~0.50, prop-2 = ~0.30, prop-3 = ~0.20
  const scale = isAll
    ? 1.0
    : propertyId === "prop-1"
    ? 0.5
    : propertyId === "prop-2"
    ? 0.3
    : 0.2;

  let trendPoints: CollectionDataPoint[] = [];

  if (dateRange === "today") {
    trendPoints = [
      { label: "08:00 AM", rentCollected: Math.round(5000 * scale), pendingRent: Math.round(12000 * scale), otherCollections: Math.round(1000 * scale) },
      { label: "11:00 AM", rentCollected: Math.round(14500 * scale), pendingRent: Math.round(10000 * scale), otherCollections: Math.round(2500 * scale) },
      { label: "02:00 PM", rentCollected: Math.round(26000 * scale), pendingRent: Math.round(8000 * scale), otherCollections: Math.round(3000 * scale) },
      { label: "05:00 PM", rentCollected: Math.round(38000 * scale), pendingRent: Math.round(6500 * scale), otherCollections: Math.round(4000 * scale) },
      { label: "08:00 PM", rentCollected: Math.round(42500 * scale), pendingRent: Math.round(5500 * scale), otherCollections: Math.round(5000 * scale) },
    ];
  } else if (dateRange === "last7days") {
    trendPoints = [
      { label: "Mon", rentCollected: Math.round(55000 * scale), pendingRent: Math.round(12000 * scale), otherCollections: Math.round(4500 * scale) },
      { label: "Tue", rentCollected: Math.round(62000 * scale), pendingRent: Math.round(10000 * scale), otherCollections: Math.round(6000 * scale) },
      { label: "Wed", rentCollected: Math.round(48000 * scale), pendingRent: Math.round(11000 * scale), otherCollections: Math.round(5200 * scale) },
      { label: "Thu", rentCollected: Math.round(74000 * scale), pendingRent: Math.round(9000 * scale), otherCollections: Math.round(7100 * scale) },
      { label: "Fri", rentCollected: Math.round(82000 * scale), pendingRent: Math.round(8000 * scale), otherCollections: Math.round(8500 * scale) },
      { label: "Sat", rentCollected: Math.round(40000 * scale), pendingRent: Math.round(9500 * scale), otherCollections: Math.round(6000 * scale) },
      { label: "Sun", rentCollected: Math.round(32000 * scale), pendingRent: Math.round(10500 * scale), otherCollections: Math.round(4700 * scale) },
    ];
  } else if (dateRange === "thisYear") {
    trendPoints = [
      { label: "Apr", rentCollected: Math.round(1080000 * scale), pendingRent: Math.round(65000 * scale), otherCollections: Math.round(35000 * scale) },
      { label: "May", rentCollected: Math.round(1120000 * scale), pendingRent: Math.round(58000 * scale), otherCollections: Math.round(38000 * scale) },
      { label: "Jun", rentCollected: Math.round(1190000 * scale), pendingRent: Math.round(52000 * scale), otherCollections: Math.round(40000 * scale) },
      { label: "Jul", rentCollected: Math.round(1210000 * scale), pendingRent: Math.round(49000 * scale), otherCollections: Math.round(41000 * scale) },
      { label: "Aug", rentCollected: Math.round(1240000 * scale), pendingRent: Math.round(54000 * scale), otherCollections: Math.round(42000 * scale) },
      { label: "Sep", rentCollected: Math.round(1220000 * scale), pendingRent: Math.round(60000 * scale), otherCollections: Math.round(39000 * scale) },
      { label: "Oct", rentCollected: Math.round(1260000 * scale), pendingRent: Math.round(55000 * scale), otherCollections: Math.round(43000 * scale) },
      { label: "Nov (Est)", rentCollected: Math.round(1285000 * scale), pendingRent: Math.round(58500 * scale), otherCollections: Math.round(42000 * scale) },
    ];
  } else {
    // Default: "thisMonth" or "last30days" (weekly breakdown)
    trendPoints = [
      { label: "Week 1 (1-7)", rentCollected: Math.round(540000 * scale), pendingRent: Math.round(120000 * scale), otherCollections: Math.round(12000 * scale) },
      { label: "Week 2 (8-14)", rentCollected: Math.round(395000 * scale), pendingRent: Math.round(85000 * scale), otherCollections: Math.round(11000 * scale) },
      { label: "Week 3 (15-21)", rentCollected: Math.round(210000 * scale), pendingRent: Math.round(62000 * scale), otherCollections: Math.round(9500 * scale) },
      { label: "Week 4 (22-28)", rentCollected: Math.round(140000 * scale), pendingRent: Math.round(58500 * scale), otherCollections: Math.round(9500 * scale) },
    ];
  }

  // Calculate totals
  const totalRentCollected = Math.round(1285000 * scale);
  const pendingRentBalance = Math.round(58500 * scale);
  const securityDepositHeld = Math.round(1150000 * scale);
  const otherIncome = Math.round(42000 * scale);

  const formatINR = (val: number) => "₹" + val.toLocaleString("en-IN");

  return {
    collectionEfficiencyRate: 95.6,
    summary: {
      totalRentCollected,
      totalRentCollectedFormatted: formatINR(totalRentCollected),
      rentComparisonText: "+8.4% vs previous month",
      isRentUp: true,

      pendingRentBalance,
      pendingRentFormatted: formatINR(pendingRentBalance),
      tenantsPendingCount: Math.max(1, Math.round(5 * scale)),

      securityDepositHeld,
      securityDepositFormatted: formatINR(securityDepositHeld),
      activeDepositCount: Math.round(115 * scale),

      otherIncome,
      otherIncomeFormatted: formatINR(otherIncome),
      otherIncomeDescription: "Laundry, meals & electric sub-meters",
    },
    trendPoints,
  };
}
