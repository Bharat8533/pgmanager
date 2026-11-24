import React from "react";
import { PlaceholderPage } from "@/components/owner/PlaceholderPage";
import { UserCheck } from "lucide-react";

export default function StaffPage() {
  return (
    <PlaceholderPage
      moduleName="Staff & Caretakers"
      moduleSubtitle="Manage property wardens, cooks, security guards, and cleaning personnel."
      icon={<UserCheck className="w-6 h-6 text-brand-lime" />}
      features={[
        "Staff roster by property with designated roles and mobile numbers.",
        "Monthly payroll, salary advances, and bonus management.",
        "Daily shift logs, attendance tracking, and duty assignments.",
        "Role-based permission controls for property caretakers.",
      ]}
    />
  );
}
