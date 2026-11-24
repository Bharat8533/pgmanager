import React from "react";
import { PlaceholderPage } from "@/components/owner/PlaceholderPage";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <PlaceholderPage
      moduleName="Owner Profile & Business Identity"
      moduleSubtitle="Manage your personal contact info, registered PG business entity, and branding."
      icon={<User className="w-6 h-6 text-brand-lime" />}
      features={[
        "Owner identity: Full Name, verified mobile number, and primary email.",
        "Business registration details, GSTIN, and company PAN information.",
        "Bank account & UPI VPA details for receiving direct tenant rent collections.",
        "Notification preferences and daily summary email subscriptions.",
      ]}
    />
  );
}
