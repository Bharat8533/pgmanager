"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { Property, PropertyStatus, Notification, OwnerProfile } from "@/types/owner";
import {
  MOCK_PROPERTIES,
  MOCK_NOTIFICATIONS,
  MOCK_OWNER_PROFILE,
} from "@/constants/mockData";

interface OwnerContextType {
  // Properties state & CRUD
  properties: Property[];
  allPropertiesList: Property[];
  selectedProperty: Property | null;
  selectProperty: (id: string) => void;
  propertyScenario: "multiple" | "single" | "empty";
  setPropertyScenario: (scenario: "multiple" | "single" | "empty") => void;
  addProperty: (property: Omit<Property, "id"> & { id?: string }) => Property;
  updateProperty: (id: string, updatedData: Partial<Property>) => void;
  togglePropertyStatus: (id: string, newStatus: PropertyStatus) => void;
  deleteProperty: (id: string) => void;
  getPropertyById: (id: string) => Property | undefined;

  // Sidebar state
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isMobileSidebarOpen: boolean;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;

  // Notifications state
  notifications: Notification[];
  unreadNotificationCount: number;
  markAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Owner profile
  ownerProfile: OwnerProfile;
}

const OwnerContext = createContext<OwnerContextType | undefined>(undefined);

export function OwnerProvider({ children }: { children: React.ReactNode }) {
  // Property scenario state (allows demoing multiple, single, and no-properties empty states)
  const [propertyScenario, setPropertyScenario] = useState<"multiple" | "single" | "empty">("multiple");
  const [allProperties, setAllProperties] = useState<Property[]>(() => {
    // Attempt hydration from session/local storage if available
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("staymanage_owner_properties");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return MOCK_PROPERTIES;
  });

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(() => {
    return allProperties[0]?.id || "prop-1";
  });

  // Sync properties to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem("staymanage_owner_properties", JSON.stringify(allProperties));
    } catch {
      // Ignore
    }
  }, [allProperties]);

  // Derived properties based on scenario
  const visibleProperties = useMemo(() => {
    if (propertyScenario === "empty") return [];
    if (propertyScenario === "single") return allProperties.slice(0, 1);
    return allProperties;
  }, [propertyScenario, allProperties]);

  const selectedProperty = useMemo(() => {
    if (visibleProperties.length === 0) return null;
    return visibleProperties.find((p) => p.id === selectedPropertyId) || visibleProperties[0];
  }, [visibleProperties, selectedPropertyId]);

  const selectProperty = (id: string) => {
    setSelectedPropertyId(id);
  };

  // Property CRUD actions
  const addProperty = (newPropData: Omit<Property, "id"> & { id?: string }): Property => {
    const newProperty: Property = {
      ...newPropData,
      id: newPropData.id || `prop-${Date.now()}`,
      createdAt: newPropData.createdAt || "Just now",
      totalBeds: Number(newPropData.totalBeds) || (Number(newPropData.occupiedBeds || 0) + Number(newPropData.availableBeds || 0) + Number(newPropData.reservedBeds || 0)),
      occupiedBeds: Number(newPropData.occupiedBeds) || 0,
      availableBeds: Number(newPropData.availableBeds) || 0,
      reservedBeds: Number(newPropData.reservedBeds) || 0,
      totalRooms: Number(newPropData.totalRooms) || 1,
    };

    setAllProperties((prev) => [newProperty, ...prev]);
    return newProperty;
  };

  const updateProperty = (id: string, updatedData: Partial<Property>) => {
    setAllProperties((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const merged = { ...p, ...updatedData };
        if (
          updatedData.totalBeds !== undefined ||
          updatedData.occupiedBeds !== undefined ||
          updatedData.availableBeds !== undefined ||
          updatedData.reservedBeds !== undefined
        ) {
          merged.totalBeds =
            Number(merged.totalBeds) ||
            Number(merged.occupiedBeds || 0) +
              Number(merged.availableBeds || 0) +
              Number(merged.reservedBeds || 0);
        }
        return merged;
      })
    );
  };

  const togglePropertyStatus = (id: string, newStatus: PropertyStatus) => {
    setAllProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const deleteProperty = (id: string) => {
    setAllProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const getPropertyById = (id: string) => {
    return allProperties.find((p) => p.id === id);
  };

  // Sidebar states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Load sidebar preference from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pgmaster_owner_sidebar_collapsed");
      if (saved !== null) {
        setIsSidebarCollapsed(saved === "true");
      }
    } catch {
      // Ignore in SSR
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("pgmaster_owner_sidebar_collapsed", String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const setSidebarCollapsed = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
    try {
      localStorage.setItem("pgmaster_owner_sidebar_collapsed", String(collapsed));
    } catch {
      // Ignore
    }
  };

  const openMobileSidebar = () => setIsMobileSidebarOpen(true);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const value = useMemo(
    () => ({
      properties: visibleProperties,
      allPropertiesList: allProperties,
      selectedProperty,
      selectProperty,
      propertyScenario,
      setPropertyScenario,
      addProperty,
      updateProperty,
      togglePropertyStatus,
      deleteProperty,
      getPropertyById,
      isSidebarCollapsed,
      toggleSidebar,
      setSidebarCollapsed,
      isMobileSidebarOpen,
      openMobileSidebar,
      closeMobileSidebar,
      notifications,
      unreadNotificationCount,
      markAsRead,
      markAllNotificationsAsRead,
      ownerProfile: MOCK_OWNER_PROFILE,
    }),
    [
      visibleProperties,
      allProperties,
      selectedProperty,
      propertyScenario,
      isSidebarCollapsed,
      isMobileSidebarOpen,
      notifications,
      unreadNotificationCount,
    ]
  );

  return <OwnerContext.Provider value={value}>{children}</OwnerContext.Provider>;
}

export function useOwner() {
  const context = useContext(OwnerContext);
  if (!context) {
    throw new Error("useOwner must be used within an OwnerProvider");
  }
  return context;
}
