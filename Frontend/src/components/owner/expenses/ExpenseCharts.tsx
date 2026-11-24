"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { ChevronDown, ChevronUp, TrendingUp, PieChart as PieIcon, BarChart3 } from "lucide-react";
import { MonthlyTrendDataPoint, CategoryBreakdownDataPoint } from "@/types/expense";

interface ExpenseChartsProps {
  trendData: MonthlyTrendDataPoint[];
  categoryData: CategoryBreakdownDataPoint[];
  totalFilteredAmount: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Electricity & Power": "#3B82F6",
  "Water & Tanker": "#06B6D4",
  "Internet & WiFi": "#8B5CF6",
  "Repairs & Maintenance": "#F59E0B",
  "Cleaning & Housekeeping": "#10B981",
  "Groceries & Food Supplies": "#EC4899",
  "Staff Salary": "#6366F1",
  "Property Tax & Municipal": "#64748B",
  "Waste Management": "#84CC16",
  "Pest Control": "#14B8A6",
  "Security & CCTV": "#F97316",
  "Marketing & Brokerage": "#D946EF",
  "Furniture & Equipment": "#EAB308",
  "Legal & Professional": "#6B7280",
  "Miscellaneous": "#94A3B8",
};

export const ExpenseCharts: React.FC<ExpenseChartsProps> = ({
  trendData,
  categoryData,
  totalFilteredAmount,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [chartType, setChartType] = useState<"area" | "bar">("area");

  return (
    <div className="bg-white rounded-2xl border border-[#E2E5DF] shadow-xs overflow-hidden transition-all duration-200">
      {/* Header with Collapse toggle */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-[#F0F2EE] bg-[#FAFAF8]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#C6F36B]/20 text-[#171A18] flex items-center justify-center font-bold">
            <TrendingUp className="w-4 h-4 text-[#171A18]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#171A18]">Expense Analytics & Trends</h3>
            <p className="text-xs text-[#777D78]">
              Monthly spending trajectory and category-wise cost distribution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <div className="hidden sm:flex items-center bg-[#EBECE7] p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setChartType("area")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  chartType === "area"
                    ? "bg-white text-[#171A18] shadow-2xs"
                    : "text-[#777D78] hover:text-[#171A18]"
                }`}
              >
                Area Trend
              </button>
              <button
                type="button"
                onClick={() => setChartType("bar")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  chartType === "bar"
                    ? "bg-white text-[#171A18] shadow-2xs"
                    : "text-[#777D78] hover:text-[#171A18]"
                }`}
              >
                Bar Chart
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#777D78] hover:text-[#171A18] bg-white border border-[#E2E5DF] hover:border-[#CCD0C8] rounded-xl transition-all shadow-2xs"
          >
            {isCollapsed ? (
              <>
                <span>Show Charts</span>
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
      </div>

      {!isCollapsed && (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Monthly Trend (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#777D78]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#777D78]">
                  Monthly Spending Trend (Last 6 Months)
                </h4>
              </div>
              <span className="text-xs font-medium text-[#777D78]">
                Amounts in <span className="font-bold text-[#171A18]">₹ INR</span>
              </span>
            </div>

            <div className="h-[220px] w-full">
              {trendData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-[#777D78]">
                  No trend data available for current selection
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "area" ? (
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <defs>
                        <linearGradient id="expenseTrendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C6F36B" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#C6F36B" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F2EE" />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#777D78", fontSize: 11, fontWeight: 500 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#777D78", fontSize: 11 }}
                        tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#171A18",
                          borderRadius: "10px",
                          border: "none",
                          color: "#FFFFFF",
                          fontSize: "12px",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        }}
                        itemStyle={{ color: "#C6F36B" }}
                        formatter={(val: any) => [`₹${Number(val || 0).toLocaleString("en-IN")}`, "Total Expense"]}
                        labelStyle={{ color: "#9CA3AF", fontWeight: 600, marginBottom: "4px" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#171A18"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#expenseTrendGradient)"
                        activeDot={{ r: 5, fill: "#171A18", stroke: "#C6F36B", strokeWidth: 2 }}
                      />
                    </AreaChart>
                  ) : (
                    <BarChart data={trendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F2EE" />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#777D78", fontSize: 11, fontWeight: 500 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#777D78", fontSize: 11 }}
                        tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#171A18",
                          borderRadius: "10px",
                          border: "none",
                          color: "#FFFFFF",
                          fontSize: "12px",
                        }}
                        formatter={(val: any) => [`₹${Number(val || 0).toLocaleString("en-IN")}`, "Total Expense"]}
                        cursor={{ fill: "#F4F5F2" }}
                      />
                      <Bar dataKey="amount" fill="#171A18" radius={[6, 6, 0, 0]}>
                        {trendData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === trendData.length - 1 ? "#C6F36B" : "#171A18"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart 2: Category Breakdown (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#F0F2EE] lg:pl-6 pt-6 lg:pt-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-[#777D78]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#777D78]">
                  Category-Wise Distribution
                </h4>
              </div>
              <span className="text-xs font-semibold text-[#171A18]">
                {categoryData.length} Categories
              </span>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="w-[130px] h-[130px] shrink-0">
                {categoryData.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#777D78]">
                    No data
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#171A18",
                          borderRadius: "8px",
                          border: "none",
                          color: "#FFF",
                          fontSize: "11px",
                        }}
                        formatter={(val: any) => [`₹${Number(val || 0).toLocaleString("en-IN")}`, "Cost"]}
                      />
                      <Pie
                        data={categoryData}
                        dataKey="amount"
                        nameKey="category"
                        innerRadius={36}
                        outerRadius={58}
                        paddingAngle={3}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`pie-cell-${index}`}
                            fill={CATEGORY_COLORS[entry.category] || "#94A3B8"}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Top Category List */}
              <div className="flex-1 space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {categoryData.slice(0, 5).map((item) => {
                  const color = CATEGORY_COLORS[item.category] || "#94A3B8";
                  return (
                    <div key={item.category} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[#171A18] font-medium truncate max-w-[110px]" title={item.category}>
                          {item.category}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-semibold text-[#171A18]">
                          ₹{item.amount.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[#777D78] text-[10px] ml-1">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-[#F0F2EE] flex items-center justify-between text-xs">
              <span className="text-[#777D78]">Filtered Total:</span>
              <span className="font-bold text-[#171A18] text-sm">
                ₹{totalFilteredAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
