"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  TrendingUp,
  PieChart as PieIcon,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  MonthlyCollectionTrendPoint,
  PaymentMethodDataPoint,
  CollectionPerformanceDistribution,
} from "@/types/payment";

interface CollectionAnalyticsProps {
  trendData: MonthlyCollectionTrendPoint[];
  methodData: PaymentMethodDataPoint[];
  performance: CollectionPerformanceDistribution;
}

const METHOD_COLORS: Record<string, string> = {
  UPI: "#10B981",
  Cash: "#F59E0B",
  "Bank Transfer": "#3B82F6",
  "Debit Card": "#8B5CF6",
  "Credit Card": "#EC4899",
  Other: "#64748B",
};

export const CollectionAnalytics: React.FC<CollectionAnalyticsProps> = ({
  trendData,
  methodData,
  performance,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-white dark:bg-[#111622] rounded-2xl border border-[#E2E5DF] dark:border-[#222E42] shadow-xs overflow-hidden transition-all duration-200">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-[#F0F2EE] dark:border-[#1E2638] bg-[#FAFAF8] dark:bg-[#151D2A]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#C6F36B]/20 dark:bg-brand-lime/15 text-[#171A18] dark:text-brand-lime flex items-center justify-center font-bold">
            <TrendingUp className="w-4 h-4 text-[#171A18] dark:text-brand-lime" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#171A18] dark:text-white">
              Rent Collection Analytics & Channel Insights
            </h3>
            <p className="text-xs text-[#777D78] dark:text-slate-400">
              Monthly recovery vs pending trajectory, payment methods, and resident compliance
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#777D78] dark:text-slate-300 hover:text-[#171A18] dark:hover:text-white bg-white dark:bg-[#111622] border border-[#E2E5DF] dark:border-[#263346] hover:border-[#CCD0C8] dark:hover:border-[#334155] rounded-xl transition-all shadow-2xs"
        >
          {isCollapsed ? (
            <>
              <span>Show Analytics</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>Collapse</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Monthly Collection Comparison (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#777D78] dark:text-slate-400">
                Monthly Collection Trajectory
              </h4>
              <span className="text-[10px] font-semibold text-[#777D78] dark:text-slate-300 bg-[#F4F5F2] dark:bg-[#151D2A] border border-transparent dark:border-[#263346] px-2 py-0.5 rounded-md">
                ₹ INR
              </span>
            </div>

            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748B" opacity={0.25} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 500 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 11 }}
                    tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#171A18",
                      borderRadius: "10px",
                      border: "1px solid #334155",
                      color: "#FFFFFF",
                      fontSize: "12px",
                    }}
                    formatter={(val: any, name: any) => [`₹${Number(val || 0).toLocaleString("en-IN")}`, String(name || "")]}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
                  />
                  <Bar dataKey="expectedRent" name="Expected" fill="#94A3B8" opacity={0.7} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="collectedRent" name="Collected" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pendingRent" name="Pending" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Payment Method Donut (3 cols) */}
          <div className="lg:col-span-3 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#F0F2EE] dark:border-[#1E2638] lg:pl-6 pt-6 lg:pt-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#777D78] dark:text-slate-400 mb-2">
              Payment Method Share
            </h4>

            <div className="h-[140px] w-full flex items-center justify-center">
              {methodData.length === 0 ? (
                <div className="text-xs text-[#777D78] dark:text-slate-400">No transaction records</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#171A18",
                        borderRadius: "8px",
                        border: "1px solid #334155",
                        color: "#FFF",
                        fontSize: "11px",
                      }}
                      formatter={(val: any) => [`₹${Number(val || 0).toLocaleString("en-IN")}`, "Collected"]}
                    />
                    <Pie
                      data={methodData}
                      dataKey="amount"
                      nameKey="method"
                      innerRadius={38}
                      outerRadius={58}
                      paddingAngle={3}
                    >
                      {methodData.map((entry, index) => (
                        <Cell
                          key={`pie-${index}`}
                          fill={METHOD_COLORS[entry.method] || "#94A3B8"}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Top 3 Methods */}
            <div className="space-y-1.5 text-xs mt-2 border-t border-[#F0F2EE] dark:border-[#1E2638] pt-2">
              {methodData.slice(0, 3).map((item) => (
                <div key={item.method} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: METHOD_COLORS[item.method] || "#94A3B8" }}
                    />
                    <span className="font-medium text-[#171A18] dark:text-slate-200 truncate">{item.method}</span>
                  </div>
                  <span className="font-bold text-[#171A18] dark:text-white">
                    {item.percentage}% (₹{(item.amount / 1000).toFixed(0)}k)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Resident Performance Status (3 cols) */}
          <div className="lg:col-span-3 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#F0F2EE] dark:border-[#1E2638] lg:pl-6 pt-6 lg:pt-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#777D78] dark:text-slate-400 mb-2">
              Resident Compliance
            </h4>

            <div className="space-y-2.5">
              {/* Paid in Full */}
              <div className="p-2.5 rounded-xl bg-[#DCFCE7]/60 dark:bg-emerald-500/10 border border-[#86EFAC]/40 dark:border-emerald-500/25 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] dark:text-emerald-400" />
                  <div>
                    <span className="block text-xs font-bold text-[#15803D] dark:text-emerald-400">Fully Paid</span>
                    <span className="text-[10px] text-[#15803D]/80 dark:text-emerald-300/80">
                      ₹{performance.paidAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-[#15803D] dark:text-emerald-400">{performance.paidCount}</span>
              </div>

              {/* Partially Paid */}
              <div className="p-2.5 rounded-xl bg-[#FEF3C7]/60 dark:bg-amber-500/10 border border-[#FDE68A]/40 dark:border-amber-500/25 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#B45309] dark:text-amber-400" />
                  <div>
                    <span className="block text-xs font-bold text-[#B45309] dark:text-amber-400">Partially Paid</span>
                    <span className="text-[10px] text-[#B45309]/80 dark:text-amber-300/80">
                      ₹{performance.partialAmount.toLocaleString("en-IN")} due
                    </span>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-[#B45309] dark:text-amber-400">{performance.partialCount}</span>
              </div>

              {/* Overdue */}
              <div className="p-2.5 rounded-xl bg-[#FEE2E2]/60 dark:bg-rose-500/10 border border-[#FCA5A5]/40 dark:border-rose-500/25 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#B91C1C] dark:text-rose-400" />
                  <div>
                    <span className="block text-xs font-bold text-[#B91C1C] dark:text-rose-400">Overdue Dues</span>
                    <span className="text-[10px] text-[#B91C1C]/80 dark:text-rose-300/80">
                      ₹{performance.overdueAmount.toLocaleString("en-IN")} pending
                    </span>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-[#B91C1C] dark:text-rose-400">{performance.overdueCount}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F0F2EE] dark:border-[#1E2638] text-[11px] text-[#777D78] dark:text-slate-400 flex justify-between items-center">
              <span>Pending Invoices:</span>
              <span className="font-bold text-[#171A18] dark:text-white">{performance.pendingCount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
