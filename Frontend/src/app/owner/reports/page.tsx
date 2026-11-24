import React from "react";
import { PlaceholderPage } from "@/components/owner/PlaceholderPage";
import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <PlaceholderPage
      moduleName="Reports & Business Analytics"
      moduleSubtitle="Comprehensive financial audits, occupancy charts, and operational statements."
      icon={<BarChart3 className="w-6 h-6 text-brand-lime" />}
      features={[
        "Monthly revenue vs. expense comparison across all active properties.",
        "Occupancy velocity and bed vacancy duration analytics.",
        "Tenant churn rates, average stay length, and admission forecasts.",
        "One-click tax report and GST/accounting export formats (Excel / CSV / PDF).",
      ]}
    />
  );
}
