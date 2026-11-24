import React from "react";
import { PlaceholderPage } from "@/components/owner/PlaceholderPage";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      moduleName="Owner & System Settings"
      moduleSubtitle="Configure automated WhatsApp reminders, rent cycle dates, and property policies."
      icon={<Settings className="w-6 h-6 text-brand-lime" />}
      features={[
        "Billing rules: Default rent due dates, grace periods, and late penalty fees.",
        "Automated WhatsApp & SMS gateway templates for receipts and notices.",
        "Security deposit refund policies and minimum notice period controls.",
        "User credentials, 2-Factor Authentication, and team permissions.",
      ]}
    />
  );
}
