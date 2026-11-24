import React from "react";
import { PlaceholderPage } from "@/components/owner/PlaceholderPage";
import { AlertCircle } from "lucide-react";

export default function ComplaintsPage() {
  return (
    <PlaceholderPage
      moduleName="Maintenance & Complaints"
      moduleSubtitle="Resolve resident service requests, plumbing/electrical repairs, and housekeeping tickets."
      icon={<AlertCircle className="w-6 h-6 text-brand-lime" />}
      features={[
        "Ticket ticketing system: Open, In-progress, and Resolved statuses.",
        "Category assignment: Wi-Fi, Plumbing, Electrical, Cleaning, Noise/Discipline.",
        "Staff assignment and vendor work order dispatch.",
        "Turnaround time (TAT) monitoring and resident feedback scores.",
      ]}
    />
  );
}
