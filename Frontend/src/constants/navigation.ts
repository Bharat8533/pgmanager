import { NavItem, BreadcrumbItem } from "@/types/owner";

export const OWNER_NAVIGATION: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/owner/dashboard",
    iconName: "LayoutDashboard",
  },
  {
    id: "properties",
    label: "Properties",
    href: "/owner/properties",
    iconName: "Building2",
  },
  {
    id: "rooms",
    label: "Rooms",
    href: "/owner/rooms",
    iconName: "BedDouble",
  },
  {
    id: "bookings",
    label: "Bookings",
    href: "/owner/bookings",
    iconName: "CalendarCheck",
    badge: "3 New",
    badgeVariant: "primary",
  },
  {
    id: "payments",
    label: "Rent & Payments",
    href: "/owner/rent-payments",
    iconName: "CreditCard",
  },
  {
    id: "expenses",
    label: "Expenses",
    href: "/owner/expenses",
    iconName: "Wallet",
  },
  {
    id: "complaints",
    label: "Complaints",
    href: "/owner/complaints",
    iconName: "AlertCircle",
    badge: "2",
    badgeVariant: "warning",
  },
  {
    id: "staff",
    label: "Staff",
    href: "/owner/staff",
    iconName: "UserCheck",
  },
  {
    id: "settings",
    label: "Settings",
    href: "/owner/settings",
    iconName: "Settings",
  },
];

export interface PageMetadata {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
}

export function getOwnerPageMetadata(pathname: string): PageMetadata {
  // Normalize path without trailing slash
  const cleanPath = pathname.replace(/\/$/, "");

  const routeMap: Record<string, PageMetadata> = {
    "/owner": {
      title: "Dashboard",
      description: "Overview of your PG properties and daily operations.",
      breadcrumbs: [{ label: "Owner Panel" }, { label: "Dashboard" }],
    },
    "/owner/dashboard": {
      title: "Dashboard",
      description: "Overview of your PG properties and daily operations.",
      breadcrumbs: [{ label: "Owner Panel" }, { label: "Dashboard" }],
    },
    "/owner/properties": {
      title: "Properties",
      description: "Manage your PG locations, buildings, and branch details.",
      breadcrumbs: [{ label: "Owner Panel", href: "/owner/dashboard" }, { label: "Properties" }],
    },
    "/owner/rooms": {
      title: "Rooms & Beds",
      description: "Configure room capacities, bed allocations, and availability matrix.",
      breadcrumbs: [{ label: "Owner Panel", href: "/owner/dashboard" }, { label: "Rooms" }],
    },
    "/owner/bookings": {
      title: "Bookings & Residents",
      description: "Manage your residents, room assignments, stay details, and payments.",
      breadcrumbs: [{ label: "Owner Panel", href: "/owner/dashboard" }, { label: "Bookings & Residents" }],
    },
    "/owner/payments": {
      title: "Rent & Payments",
      description: "Track monthly rent cycles, security deposits, and dues.",
      breadcrumbs: [{ label: "Owner Panel", href: "/owner/dashboard" }, { label: "Rent & Payments" }],
    },
    "/owner/rent-payments": {
      title: "Rent & Payments",
      description: "Manage monthly rent, track collections, monitor pending dues, and export financial reports.",
      breadcrumbs: [{ label: "Owner Panel", href: "/owner/dashboard" }, { label: "Rent & Payments" }],
    },
    "/owner/expenses": {
      title: "Expenses",
      description: "Record utility bills, maintenance costs, and operational expenditures.",
      breadcrumbs: [{ label: "Owner Panel", href: "/owner/dashboard" }, { label: "Expenses" }],
    },
    "/owner/complaints": {
      title: "Complaints",
      description: "Manage tenant service requests, repairs, and resolution status.",
      breadcrumbs: [{ label: "Owner Panel", href: "/owner/dashboard" }, { label: "Complaints" }],
    },
    "/owner/staff": {
      title: "Staff",
      description: "Manage property caretakers, cooks, housekeeping, and security personnel.",
      breadcrumbs: [{ label: "Owner Panel", href: "/owner/dashboard" }, { label: "Staff" }],
    },
    "/owner/settings": {
      title: "Settings",
      description: "Configure PG preferences, rent reminder rules, and account parameters.",
      breadcrumbs: [{ label: "Owner Panel", href: "/owner/dashboard" }, { label: "Settings" }],
    },
    "/owner/profile": {
      title: "Owner Profile",
      description: "Manage your personal profile, credentials, and business identity.",
      breadcrumbs: [{ label: "Owner Panel", href: "/owner/dashboard" }, { label: "Profile" }],
    },
  };

  if (cleanPath.startsWith("/owner/properties/") && cleanPath.endsWith("/rooms")) {
    return {
      title: "Property Rooms & Beds",
      description: "Manage rooms, beds, occupancy, and tenant assignments for this property.",
      breadcrumbs: [
        { label: "Owner Panel", href: "/owner/dashboard" },
        { label: "Properties", href: "/owner/properties" },
        { label: "Rooms" },
      ],
    };
  }

  if (cleanPath.startsWith("/owner/properties/") && cleanPath.endsWith("/edit")) {
    return {
      title: "Edit Property",
      description: "Modify property specifications, location, amenities, and room inventories.",
      breadcrumbs: [
        { label: "Owner Panel", href: "/owner/dashboard" },
        { label: "Properties", href: "/owner/properties" },
        { label: "Edit Property" },
      ],
    };
  }

  return (
    routeMap[cleanPath] || {
      title: "Owner Panel",
      description: "Manage your PG properties and daily operations.",
      breadcrumbs: [{ label: "Owner Panel" }],
    }
  );
}
