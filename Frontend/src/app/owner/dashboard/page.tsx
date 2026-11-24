"use client";

import React, { useState } from "react";
import { useOwner } from "@/contexts/OwnerContext";
import {
  DashboardHeader,
  DateRangeOption,
} from "@/components/owner/dashboard/DashboardHeader";
import { PrimaryKPICards } from "@/components/owner/dashboard/PrimaryKPICards";
import { RoomOccupancyChart } from "@/components/owner/dashboard/RoomOccupancyChart";
import { BedOccupancyChart } from "@/components/owner/dashboard/BedOccupancyChart";
import { CollectionTrendChart } from "@/components/owner/dashboard/CollectionTrendChart";
import { FinancialSummaryCards } from "@/components/owner/dashboard/FinancialSummaryCards";
import { RecentBookingsTable } from "@/components/owner/dashboard/RecentBookingsTable";
import { RecentTransactionsTable } from "@/components/owner/dashboard/RecentTransactionsTable";
import { RecentActivitiesTimeline } from "@/components/owner/dashboard/RecentActivitiesTimeline";
import { OperationsWidgets } from "@/components/owner/dashboard/OperationsWidgets";
import { QuickActionsBar } from "@/components/owner/dashboard/QuickActionsBar";

// Data resolvers
import { getKPIData } from "@/data/dashboardStats";
import { getRoomOccupancyData } from "@/data/roomOccupancyData";
import { getBedOccupancyData } from "@/data/bedOccupancyData";
import { getCollectionData } from "@/data/collectionData";
import { getRecentBookings } from "@/data/bookingsData";
import { getRecentTransactions } from "@/data/transactionsData";
import { getActivitiesData } from "@/data/activitiesData";
import {
  getBusinessInsights,
  MOCK_UPCOMING_CHECKINS,
  MOCK_UPCOMING_CHECKOUTS,
  MOCK_PENDING_COMPLAINTS,
} from "@/data/insightsData";

export default function DashboardPage() {
  const { selectedProperty } = useOwner();
  const [dateRange, setDateRange] = useState<DateRangeOption>("thisMonth");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedText, setLastUpdatedText] = useState("Just now");

  const propertyId = selectedProperty?.id || null;

  // Resolved dynamic datasets
  const kpiCards = React.useMemo(() => {
    return getKPIData(propertyId, dateRange);
  }, [propertyId, dateRange]);

  const roomOccupancy = React.useMemo(() => {
    return getRoomOccupancyData(propertyId);
  }, [propertyId]);

  const bedOccupancy = React.useMemo(() => {
    return getBedOccupancyData(propertyId);
  }, [propertyId]);

  const collectionOverview = React.useMemo(() => {
    return getCollectionData(propertyId, dateRange);
  }, [propertyId, dateRange]);

  const recentBookings = React.useMemo(() => {
    return getRecentBookings(propertyId);
  }, [propertyId]);

  const recentTransactions = React.useMemo(() => {
    return getRecentTransactions(propertyId);
  }, [propertyId]);

  const recentActivities = React.useMemo(() => {
    return getActivitiesData(propertyId);
  }, [propertyId]);

  const businessInsights = React.useMemo(() => {
    return getBusinessInsights(propertyId);
  }, [propertyId]);

  // Operational items filtered by property
  const checkIns = React.useMemo(() => {
    if (!selectedProperty) return MOCK_UPCOMING_CHECKINS;
    return MOCK_UPCOMING_CHECKINS.filter(
      (c) => c.propertyName === selectedProperty.name
    );
  }, [selectedProperty]);

  const checkOuts = React.useMemo(() => {
    if (!selectedProperty) return MOCK_UPCOMING_CHECKOUTS;
    return MOCK_UPCOMING_CHECKOUTS.filter(
      (c) => c.propertyName === selectedProperty.name
    );
  }, [selectedProperty]);

  const complaints = React.useMemo(() => {
    if (!selectedProperty) return MOCK_PENDING_COMPLAINTS;
    return MOCK_PENDING_COMPLAINTS.filter(
      (c) => c.propertyName === selectedProperty.name
    );
  }, [selectedProperty]);

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdatedText("Just now");
    }, 450);
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-fadeIn pb-10">
      {/* SECTION 1: Welcome Header & Quick Filter Bar */}
      <DashboardHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastUpdatedText={lastUpdatedText}
      />

      {/* Quick Operational Shortcuts */}
      <QuickActionsBar />

      {/* SECTION 2: Six Primary KPI Summary Cards */}
      <section aria-label="Primary KPIs">
        <PrimaryKPICards cards={kpiCards} />
      </section>

      {/* SECTION 3: Occupancy Analytics (Room Donut + Bed Capacity Horizontal Stack) */}
      <section aria-label="Occupancy Analytics" className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <RoomOccupancyChart data={roomOccupancy} />
        <BedOccupancyChart data={bedOccupancy} />
      </section>

      {/* SECTION 4: Financial Overview (Collection Trend Area Chart + 4 Financial Cards) */}
      <section aria-label="Financial Overview" className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Collection Trend Chart (7 cols on lg) */}
        <div className="lg:col-span-7">
          <CollectionTrendChart
            trendPoints={collectionOverview.trendPoints}
            dateRange={dateRange}
          />
        </div>

        {/* 4 Financial Summary Cards with Strict Deposit Liability (5 cols on lg) */}
        <div className="lg:col-span-5">
          <FinancialSummaryCards summary={collectionOverview.summary} />
        </div>
      </section>

      {/* SECTION 5: Recent Bookings Table & Live Activity Stream */}
      <section aria-label="Bookings and Activities" className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Bookings Table (7 cols on lg) */}
        <div className="lg:col-span-7">
          <RecentBookingsTable bookings={recentBookings} />
        </div>

        {/* Recent Activities Timeline (5 cols on lg) */}
        <div className="lg:col-span-5">
          <RecentActivitiesTimeline activities={recentActivities} />
        </div>
      </section>

      {/* SECTION 6: Recent Transactions & Payment Ledger */}
      <section aria-label="Recent Transactions">
        <RecentTransactionsTable transactions={recentTransactions} />
      </section>

      {/* SECTION 8: Operational Widgets (Upcoming Check-ins, Check-outs & Complaints) */}
      <section aria-label="Operational Schedule">
        <OperationsWidgets
          checkIns={checkIns}
          checkOuts={checkOuts}
          complaints={complaints}
        />
      </section>
    </div>
  );
}
