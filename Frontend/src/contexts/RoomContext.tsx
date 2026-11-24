"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import {
  Room,
  Bed,
  Resident,
  Booking,
  PaymentRecord,
  SecurityDepositRecord,
  RoomSummaryStats,
  RoomFinancialSummary,
  UpcomingCheckoutItem,
  RoomStatus,
} from "@/types/room";
import {
  MOCK_ROOMS,
  MOCK_BEDS,
  MOCK_RESIDENTS,
  MOCK_BOOKINGS,
  MOCK_PAYMENTS,
  MOCK_SECURITY_DEPOSITS,
} from "@/constants/mockRoomsData";
import { Guest, AddGuestPayload, StayStatus, RentStatus, StayHistoryRecord } from "@/types/guest";
import { MOCK_GUESTS } from "@/constants/mockGuestData";
import { useOwner } from "@/contexts/OwnerContext";

interface RoomContextType {
  // Collections
  rooms: Room[];
  allBeds: Bed[];
  allResidents: Resident[];
  allBookings: Booking[];
  allPayments: PaymentRecord[];
  allDeposits: SecurityDepositRecord[];
  guests: Guest[];

  // Property scoped views
  propertyRooms: Room[];
  stats: RoomSummaryStats;
  upcomingCheckouts: UpcomingCheckoutItem[];

  // CRUD actions for Rooms
  addRoom: (roomData: Omit<Room, "id" | "propertyId" | "occupiedBeds" | "availableBeds" | "reservedBeds" | "maintenanceBeds"> & { totalBeds: number }) => { success: boolean; error?: string; room?: Room };
  updateRoom: (id: string, updatedData: Partial<Room>) => { success: boolean; error?: string; room?: Room };
  toggleRoomStatus: (id: string, newStatus: RoomStatus) => void;
  deleteRoom: (id: string) => { success: boolean; error?: string };

  // CRUD actions for Guests / Residents
  addGuest: (payload: AddGuestPayload) => { success: boolean; error?: string; guest?: Guest };
  updateGuest: (id: string, updatedData: Partial<Guest>) => { success: boolean; error?: string; guest?: Guest };
  checkoutGuest: (id: string, actualCheckoutDate: string, depositRefunded: number, depositAdjustments?: number, notes?: string) => { success: boolean; error?: string };
  deleteGuest: (id: string) => { success: boolean; error?: string };
  getGuestById: (id: string) => Guest | undefined;

  // Queries
  getRoomById: (id: string) => Room | undefined;
  getBedsByRoomId: (roomId: string) => Bed[];
  getResidentsByRoomId: (roomId: string) => Resident[];
  getBookingsByRoomId: (roomId: string) => Booking[];
  getPaymentsByRoomId: (roomId: string) => PaymentRecord[];
  getDepositsByRoomId: (roomId: string) => SecurityDepositRecord[];
  getRoomFinancialSummary: (roomId: string) => RoomFinancialSummary;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const { selectedProperty, allPropertiesList } = useOwner();
  const currentPropertyId = selectedProperty?.id || "prop-1";

  // Hydration state for Rooms
  const [rooms, setRooms] = useState<Room[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("staymanage_owner_rooms");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return MOCK_ROOMS;
  });

  // Beds state
  const [beds, setBeds] = useState<Bed[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("staymanage_owner_beds");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return MOCK_BEDS;
  });

  // Residents, Bookings, Payments, Security Deposits
  const [residents, setResidents] = useState<Resident[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("staymanage_owner_residents");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return MOCK_RESIDENTS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("staymanage_owner_bookings");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return MOCK_BOOKINGS;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("staymanage_owner_payments");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return MOCK_PAYMENTS;
  });

  const [deposits, setDeposits] = useState<SecurityDepositRecord[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("staymanage_owner_deposits");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return MOCK_SECURITY_DEPOSITS;
  });

  // Guests state (Centralized Guest Directory)
  const [guests, setGuests] = useState<Guest[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("staymanage_owner_guests");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return MOCK_GUESTS;
  });

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("staymanage_owner_rooms", JSON.stringify(rooms));
      localStorage.setItem("staymanage_owner_beds", JSON.stringify(beds));
      localStorage.setItem("staymanage_owner_residents", JSON.stringify(residents));
      localStorage.setItem("staymanage_owner_bookings", JSON.stringify(bookings));
      localStorage.setItem("staymanage_owner_payments", JSON.stringify(payments));
      localStorage.setItem("staymanage_owner_deposits", JSON.stringify(deposits));
      localStorage.setItem("staymanage_owner_guests", JSON.stringify(guests));
    } catch {
      // Ignore
    }
  }, [rooms, beds, residents, bookings, payments, deposits, guests]);

  // Scoped rooms for the currently selected property
  const propertyRooms = useMemo(() => {
    return rooms.filter((r) => r.propertyId === currentPropertyId);
  }, [rooms, currentPropertyId]);

  // Scoped residents for current property
  const propertyResidents = useMemo(() => {
    return residents.filter((res) => res.propertyId === currentPropertyId);
  }, [residents, currentPropertyId]);

  // Dynamic Room Summary Stats calculation (per specification)
  const stats: RoomSummaryStats = useMemo(() => {
    const totalRooms = propertyRooms.length;
    let totalBeds = 0;
    let occupiedBeds = 0;
    let availableBeds = 0;
    let reservedBeds = 0;
    let maintenanceBeds = 0;

    propertyRooms.forEach((r) => {
      totalBeds += r.totalBeds;
      occupiedBeds += r.occupiedBeds;
      availableBeds += r.availableBeds;
      reservedBeds += r.reservedBeds;
      maintenanceBeds += r.maintenanceBeds;
    });

    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
    const propertyRoomIds = new Set(propertyRooms.map((r) => r.id));

    const rentCollectedThisMonth = payments
      .filter((p) => propertyRoomIds.has(p.roomId) && p.type === "rent" && p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingRent = payments
      .filter((p) => propertyRoomIds.has(p.roomId) && p.type === "rent" && (p.status === "pending" || p.status === "overdue"))
      .reduce((sum, p) => sum + p.amount, 0);

    const securityDepositsHeld = deposits
      .filter((d) => propertyRoomIds.has(d.roomId))
      .reduce((sum, d) => sum + d.currentHeld, 0);

    const upcomingCheckoutsCount = propertyResidents.filter((res) => !!res.expectedCheckoutDate).length;

    return {
      totalRooms,
      totalBeds,
      occupiedBeds,
      availableBeds,
      reservedBeds,
      maintenanceBeds,
      occupancyRate,
      rentCollectedThisMonth,
      pendingRent,
      upcomingCheckoutsCount,
      securityDepositsHeld,
    };
  }, [propertyRooms, payments, deposits, propertyResidents]);

  // Upcoming check-outs list
  const upcomingCheckouts: UpcomingCheckoutItem[] = useMemo(() => {
    const list: UpcomingCheckoutItem[] = [];
    propertyResidents.forEach((res) => {
      if (res.expectedCheckoutDate) {
        const room = propertyRooms.find((r) => r.id === res.roomId);
        if (room) {
          list.push({
            resident: res,
            room,
            daysRemaining: 5,
          });
        }
      }
    });
    return list;
  }, [propertyResidents, propertyRooms]);

  // Queries
  const getRoomById = (id: string) => {
    return rooms.find((r) => r.id === id);
  };

  const getBedsByRoomId = (roomId: string) => {
    return beds.filter((b) => b.roomId === roomId);
  };

  const getResidentsByRoomId = (roomId: string) => {
    return residents.filter((r) => r.roomId === roomId && r.status !== "checked_out");
  };

  const getBookingsByRoomId = (roomId: string) => {
    return bookings.filter((b) => b.roomId === roomId);
  };

  const getPaymentsByRoomId = (roomId: string) => {
    return payments.filter((p) => p.roomId === roomId);
  };

  const getDepositsByRoomId = (roomId: string) => {
    return deposits.filter((d) => d.roomId === roomId);
  };

  const getGuestById = (id: string) => {
    return guests.find((g) => g.id === id);
  };

  const getRoomFinancialSummary = (roomId: string): RoomFinancialSummary => {
    const roomPayments = payments.filter((p) => p.roomId === roomId && p.type === "rent");
    const roomDeposits = deposits.filter((d) => d.roomId === roomId);

    const totalRentBilled = roomPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalRentCollected = roomPayments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingRent = roomPayments
      .filter((p) => p.status === "pending" || p.status === "overdue")
      .reduce((sum, p) => sum + p.amount, 0);
    const securityDepositsHeld = roomDeposits.reduce((sum, d) => sum + d.currentHeld, 0);

    return {
      totalRentBilled,
      totalRentCollected,
      pendingRent,
      securityDepositsHeld,
    };
  };

  // Add Room
  const addRoom = (roomData: Omit<Room, "id" | "propertyId" | "occupiedBeds" | "availableBeds" | "reservedBeds" | "maintenanceBeds"> & { totalBeds: number }) => {
    const trimmedNumber = roomData.roomNumber.trim();

    const isDuplicate = propertyRooms.some(
      (r) => r.roomNumber.toLowerCase() === trimmedNumber.toLowerCase()
    );
    if (isDuplicate) {
      return {
        success: false,
        error: `Room ${trimmedNumber} already exists in ${selectedProperty?.name || "this property"}. Please choose a unique room number.`,
      };
    }

    const roomId = `room-${Date.now()}`;
    const totalBeds = Number(roomData.totalBeds) || 1;
    const isMaintenance = roomData.roomStatus === "under_maintenance";

    const newBeds: Bed[] = [];
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

    for (let i = 0; i < totalBeds; i++) {
      const letter = letters[i] || `${i + 1}`;
      newBeds.push({
        id: `bed-${roomId}-${letter}`,
        bedNumber: `${trimmedNumber}-${letter}`,
        roomId: roomId,
        propertyId: currentPropertyId,
        status: isMaintenance ? "under_maintenance" : "available",
        assignedRent: roomData.defaultMonthlyRent,
      });
    }

    const newRoom: Room = {
      ...roomData,
      id: roomId,
      propertyId: currentPropertyId,
      roomNumber: trimmedNumber,
      totalBeds,
      occupiedBeds: 0,
      availableBeds: isMaintenance ? 0 : totalBeds,
      reservedBeds: 0,
      maintenanceBeds: isMaintenance ? totalBeds : 0,
      roomStatus: roomData.roomStatus || (isMaintenance ? "under_maintenance" : "available"),
      createdAt: "Just now",
    };

    setRooms((prev) => [newRoom, ...prev]);
    setBeds((prev) => [...prev, ...newBeds]);

    return { success: true, room: newRoom };
  };

  // Edit Room
  const updateRoom = (id: string, updatedData: Partial<Room>) => {
    const existingRoom = rooms.find((r) => r.id === id);
    if (!existingRoom) {
      return { success: false, error: "Room not found." };
    }

    if (
      updatedData.roomNumber &&
      updatedData.roomNumber.trim().toLowerCase() !== existingRoom.roomNumber.toLowerCase()
    ) {
      const isDuplicate = propertyRooms.some(
        (r) => r.id !== id && r.roomNumber.toLowerCase() === updatedData.roomNumber!.trim().toLowerCase()
      );
      if (isDuplicate) {
        return {
          success: false,
          error: `Room ${updatedData.roomNumber.trim()} already exists in this property.`,
        };
      }
    }

    const roomBeds = beds.filter((b) => b.roomId === id);
    const occupiedCount = roomBeds.filter((b) => b.status === "occupied").length;
    const reservedCount = roomBeds.filter((b) => b.status === "reserved").length;
    const minRequiredBeds = occupiedCount + reservedCount;

    if (updatedData.totalBeds !== undefined && updatedData.totalBeds < minRequiredBeds) {
      return {
        success: false,
        error: `Cannot reduce bed capacity to ${updatedData.totalBeds}. This room currently has ${occupiedCount} active resident(s) and ${reservedCount} confirmed reservation(s). Minimum capacity must be at least ${minRequiredBeds}.`,
      };
    }

    if (updatedData.totalBeds !== undefined && updatedData.totalBeds !== existingRoom.totalBeds) {
      const newTotal = updatedData.totalBeds;
      const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

      if (newTotal > existingRoom.totalBeds) {
        const bedsToAdd = newTotal - existingRoom.totalBeds;
        const additionalBeds: Bed[] = [];
        for (let i = 0; i < bedsToAdd; i++) {
          const index = existingRoom.totalBeds + i;
          const letter = letters[index] || `${index + 1}`;
          const roomNum = updatedData.roomNumber?.trim() || existingRoom.roomNumber;
          additionalBeds.push({
            id: `bed-${id}-${letter}`,
            bedNumber: `${roomNum}-${letter}`,
            roomId: id,
            propertyId: existingRoom.propertyId,
            status: "available",
            assignedRent: updatedData.defaultMonthlyRent || existingRoom.defaultMonthlyRent,
          });
        }
        setBeds((prev) => [...prev, ...additionalBeds]);
      } else if (newTotal < existingRoom.totalBeds) {
        const removableBedsCount = existingRoom.totalBeds - newTotal;
        let removed = 0;
        setBeds((prev) => {
          const roomBedsList = prev.filter((b) => b.roomId === id);
          const otherBeds = prev.filter((b) => b.roomId !== id);
          const keepRoomBeds: Bed[] = [];
          for (let i = roomBedsList.length - 1; i >= 0; i--) {
            const b = roomBedsList[i];
            if (b.status === "available" && removed < removableBedsCount) {
              removed++;
            } else {
              keepRoomBeds.unshift(b);
            }
          }
          return [...otherBeds, ...keepRoomBeds];
        });
      }
    }

    const newTotalBeds = updatedData.totalBeds !== undefined ? updatedData.totalBeds : existingRoom.totalBeds;
    const isMaintenance = (updatedData.roomStatus || existingRoom.roomStatus) === "under_maintenance";

    let occupiedBeds = existingRoom.occupiedBeds;
    let reservedBeds = existingRoom.reservedBeds;
    let maintenanceBeds = isMaintenance ? newTotalBeds : (existingRoom.maintenanceBeds || 0);
    let availableBeds = Math.max(0, newTotalBeds - occupiedBeds - reservedBeds - maintenanceBeds);

    let finalRoomStatus = updatedData.roomStatus || existingRoom.roomStatus;
    if (finalRoomStatus !== "under_maintenance" && finalRoomStatus !== "inactive") {
      if (occupiedBeds === newTotalBeds) {
        finalRoomStatus = "fully_occupied";
      } else if (reservedBeds === newTotalBeds) {
        finalRoomStatus = "fully_reserved";
      } else if (occupiedBeds > 0 || reservedBeds > 0) {
        finalRoomStatus = "partially_occupied";
      } else {
        finalRoomStatus = "available";
      }
    }

    const merged: Room = {
      ...existingRoom,
      ...updatedData,
      totalBeds: newTotalBeds,
      occupiedBeds,
      reservedBeds,
      maintenanceBeds,
      availableBeds,
      roomStatus: finalRoomStatus,
    };

    setRooms((prev) => prev.map((r) => (r.id === id ? merged : r)));

    return { success: true, room: merged };
  };

  const toggleRoomStatus = (id: string, newStatus: RoomStatus) => {
    updateRoom(id, { roomStatus: newStatus });
  };

  const deleteRoom = (id: string) => {
    const roomBeds = beds.filter((b) => b.roomId === id);
    const hasOccupied = roomBeds.some((b) => b.status === "occupied");
    const hasReserved = roomBeds.some((b) => b.status === "reserved");

    if (hasOccupied || hasReserved) {
      return {
        success: false,
        error: "Cannot delete room with active residents or confirmed bookings. Please reassign or check out residents first.",
      };
    }

    setRooms((prev) => prev.filter((r) => r.id !== id));
    setBeds((prev) => prev.filter((b) => b.roomId !== id));
    return { success: true };
  };

  // =========================================================================
  // GUEST / RESIDENT CRUD ACTIONS
  // =========================================================================

  const addGuest = (payload: AddGuestPayload) => {
    const targetRoom = rooms.find((r) => r.id === payload.roomId);
    const targetBed = beds.find((b) => b.id === payload.bedId);

    if (!targetBed) {
      return { success: false, error: "Selected bed could not be found." };
    }

    if (targetBed.status === "occupied") {
      return {
        success: false,
        error: `Bed ${targetBed.bedNumber} is already occupied. Please select an available bed.`,
      };
    }

    // Determine if admission is future date
    const todayStr = new Date().toISOString().split("T")[0];
    const isFuture = payload.admissionDate > todayStr;
    const stayStatus: StayStatus = isFuture ? "upcoming" : "active";
    const bedStatus = isFuture ? "reserved" : "occupied";

    // Property lookup
    const targetProperty =
      allPropertiesList.find((p) => p.id === payload.propertyId) || selectedProperty;
    const propertyName = targetProperty?.name || "StayManage Residency";

    // Calculate initial payments & pending balance
    let initialPending = payload.monthlyRent;
    let rentStatus: RentStatus = "pending";
    let totalCollected = 0;
    let depositBalance = payload.securityDeposit;

    if (payload.initialPayment && payload.initialPayment.amount > 0) {
      if (payload.initialPayment.paymentType === "rent") {
        totalCollected = payload.initialPayment.amount;
        initialPending = Math.max(0, payload.monthlyRent - payload.initialPayment.amount);
        rentStatus = initialPending === 0 ? "paid" : "partial";
      } else if (payload.initialPayment.paymentType === "security_deposit") {
        depositBalance = payload.securityDeposit;
      }
    }

    const guestId = `guest-${Date.now()}`;
    const newGuest: Guest = {
      id: guestId,
      name: payload.name.trim(),
      phone: payload.phone.trim(),
      email: payload.email?.trim() || undefined,
      gender: payload.gender || "Male",
      dateOfBirth: payload.dateOfBirth || undefined,
      avatar:
        payload.avatar ||
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      permanentAddress: payload.permanentAddress?.trim() || undefined,
      city: payload.city?.trim() || undefined,
      state: payload.state?.trim() || undefined,
      aadhaarMasked:
        payload.aadhaarMasked ||
        `•••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
      emergencyContactName: payload.emergencyContactName.trim(),
      emergencyContactNumber: payload.emergencyContactNumber.trim(),
      emergencyRelationship: payload.emergencyRelationship.trim(),
      propertyId: payload.propertyId,
      propertyName: propertyName,
      roomId: payload.roomId,
      roomNumber: targetRoom ? targetRoom.roomNumber : payload.roomId,
      bedId: payload.bedId,
      bedNumber: targetBed.bedNumber,
      admissionDate: payload.admissionDate,
      livingSince: isFuture ? "Upcoming" : "Just moved in",
      expectedCheckoutDate: payload.expectedCheckoutDate || undefined,
      stayStatus: stayStatus,
      monthlyRent: payload.monthlyRent,
      rentStatus: rentStatus,
      totalRentBilled: payload.monthlyRent,
      totalRentCollected: totalCollected,
      pendingAmount: initialPending,
      securityDeposit: payload.securityDeposit,
      depositAdjustments: 0,
      depositRefunded: 0,
      depositBalance: depositBalance,
      workOrCollege: payload.workOrCollege?.trim() || undefined,
      specialNotes: payload.specialNotes?.trim() || undefined,
      stayHistory: [
        {
          id: `hist-${Date.now()}`,
          propertyName: propertyName,
          roomNumber: targetRoom ? targetRoom.roomNumber : payload.roomId,
          bedNumber: targetBed.bedNumber,
          admissionDate: payload.admissionDate,
          checkoutDate: isFuture ? "Upcoming" : "Present",
          monthlyRent: payload.monthlyRent,
          securityDeposit: payload.securityDeposit,
          status: "completed",
          notes: "Initial admission and bed assignment.",
        },
      ],
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Update beds list
    setBeds((prev) =>
      prev.map((b) =>
        b.id === payload.bedId
          ? {
              ...b,
              status: bedStatus,
              assignedResidentName: newGuest.name,
              assignedResidentId: newGuest.id,
              assignedRent: newGuest.monthlyRent,
            }
          : b
      )
    );

    // Update room occupancy
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === payload.roomId) {
          const newOccupied = r.occupiedBeds + (bedStatus === "occupied" ? 1 : 0);
          const newReserved = r.reservedBeds + (bedStatus === "reserved" ? 1 : 0);
          const newAvailable = Math.max(
            0,
            r.totalBeds - newOccupied - newReserved - (r.maintenanceBeds || 0)
          );
          let newRoomStatus: RoomStatus = r.roomStatus;
          if (newRoomStatus !== "under_maintenance" && newRoomStatus !== "inactive") {
            if (newOccupied === r.totalBeds) newRoomStatus = "fully_occupied";
            else if (newReserved === r.totalBeds) newRoomStatus = "fully_reserved";
            else if (newOccupied > 0 || newReserved > 0) newRoomStatus = "partially_occupied";
            else newRoomStatus = "available";
          }
          return {
            ...r,
            occupiedBeds: newOccupied,
            reservedBeds: newReserved,
            availableBeds: newAvailable,
            roomStatus: newRoomStatus,
          };
        }
        return r;
      })
    );

    // Also register payment record if initial payment was made
    if (payload.initialPayment && payload.initialPayment.amount > 0) {
      const newPayment: PaymentRecord = {
        id: `pay-${Date.now()}`,
        residentId: newGuest.id,
        residentName: newGuest.name,
        propertyId: newGuest.propertyId,
        roomId: newGuest.roomId,
        amount: payload.initialPayment.amount,
        type: payload.initialPayment.paymentType,
        paymentDate: payload.initialPayment.paymentDate || todayStr,
        paymentMethod: payload.initialPayment.paymentMethod,
        transactionRef: payload.initialPayment.transactionRef || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        status: "completed",
        notes: payload.initialPayment.notes || "Initial check-in payment.",
      };
      setPayments((prev) => [newPayment, ...prev]);

      if (payload.initialPayment.paymentType === "security_deposit") {
        const newDeposit: SecurityDepositRecord = {
          id: `dep-${Date.now()}`,
          residentId: newGuest.id,
          residentName: newGuest.name,
          propertyId: newGuest.propertyId,
          roomId: newGuest.roomId,
          originalAmount: payload.initialPayment.amount,
          currentHeld: payload.initialPayment.amount,
          status: "held",
          receivedDate: payload.initialPayment.paymentDate || todayStr,
        };
        setDeposits((prev) => [newDeposit, ...prev]);
      }
    }

    setGuests((prev) => [newGuest, ...prev]);

    return { success: true, guest: newGuest };
  };

  const updateGuest = (id: string, updatedData: Partial<Guest>) => {
    const existing = guests.find((g) => g.id === id);
    if (!existing) {
      return { success: false, error: "Guest not found." };
    }

    // If bed or room changed, handle re-assignment
    if (updatedData.bedId && updatedData.bedId !== existing.bedId) {
      const newBed = beds.find((b) => b.id === updatedData.bedId);
      if (!newBed) {
        return { success: false, error: "New bed not found." };
      }
      if (newBed.status === "occupied") {
        return { success: false, error: `Bed ${newBed.bedNumber} is already occupied.` };
      }

      // Free old bed
      setBeds((prev) =>
        prev.map((b) =>
          b.id === existing.bedId
            ? { ...b, status: "available", assignedResidentName: undefined, assignedResidentId: undefined }
            : b.id === updatedData.bedId
            ? {
                ...b,
                status: existing.stayStatus === "upcoming" ? "reserved" : "occupied",
                assignedResidentName: existing.name,
                assignedResidentId: existing.id,
              }
            : b
        )
      );
    }

    const merged: Guest = {
      ...existing,
      ...updatedData,
    };

    setGuests((prev) => prev.map((g) => (g.id === id ? merged : g)));

    return { success: true, guest: merged };
  };

  const checkoutGuest = (
    id: string,
    actualCheckoutDate: string,
    depositRefunded: number,
    depositAdjustments: number = 0,
    notes?: string
  ) => {
    const guest = guests.find((g) => g.id === id);
    if (!guest) {
      return { success: false, error: "Guest not found." };
    }

    const checkoutDate = actualCheckoutDate || new Date().toISOString().split("T")[0];
    const finalRefunded = Number(depositRefunded) || 0;
    const finalAdjustments = Number(depositAdjustments) || 0;
    const finalBalance = Math.max(0, guest.securityDeposit - finalAdjustments - finalRefunded);

    // Free bed
    setBeds((prev) =>
      prev.map((b) =>
        b.id === guest.bedId
          ? {
              ...b,
              status: "available",
              assignedResidentName: undefined,
              assignedResidentId: undefined,
            }
          : b
      )
    );

    // Update room occupancy counts
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === guest.roomId) {
          const wasOccupied = guest.stayStatus === "active";
          const wasReserved = guest.stayStatus === "upcoming";
          const newOccupied = Math.max(0, r.occupiedBeds - (wasOccupied ? 1 : 0));
          const newReserved = Math.max(0, r.reservedBeds - (wasReserved ? 1 : 0));
          const newAvailable = Math.min(r.totalBeds, r.availableBeds + 1);

          let newRoomStatus: RoomStatus = r.roomStatus;
          if (newRoomStatus !== "under_maintenance" && newRoomStatus !== "inactive") {
            if (newOccupied === r.totalBeds) newRoomStatus = "fully_occupied";
            else if (newReserved === r.totalBeds) newRoomStatus = "fully_reserved";
            else if (newOccupied > 0 || newReserved > 0) newRoomStatus = "partially_occupied";
            else newRoomStatus = "available";
          }

          return {
            ...r,
            occupiedBeds: newOccupied,
            reservedBeds: newReserved,
            availableBeds: newAvailable,
            roomStatus: newRoomStatus,
          };
        }
        return r;
      })
    );

    // Append checkout record to stay history
    const completedStay: StayHistoryRecord = {
      id: `hist-${Date.now()}`,
      propertyName: guest.propertyName,
      roomNumber: guest.roomNumber,
      bedNumber: guest.bedNumber,
      admissionDate: guest.admissionDate,
      checkoutDate: checkoutDate,
      monthlyRent: guest.monthlyRent,
      securityDeposit: guest.securityDeposit,
      status: "completed",
      notes: notes || "Checked out successfully. Security deposit settled.",
    };

    // Update guest record (Never deleted!)
    setGuests((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const existingWithoutPresent = g.stayHistory.filter(
            (h) => h.checkoutDate !== "Present" && h.checkoutDate !== "Upcoming"
          );
          return {
            ...g,
            stayStatus: "checked_out",
            actualCheckoutDate: checkoutDate,
            depositRefunded: finalRefunded,
            depositAdjustments: finalAdjustments,
            depositBalance: finalBalance,
            livingSince: "Checked Out",
            stayHistory: [...existingWithoutPresent, completedStay],
          };
        }
        return g;
      })
    );

    return { success: true };
  };

  const deleteGuest = (id: string) => {
    const guest = guests.find((g) => g.id === id);
    if (!guest) {
      return { success: false, error: "Guest not found." };
    }

    // If guest was occupying or reserved on a bed, free that bed!
    if (guest.stayStatus === "active" || guest.stayStatus === "upcoming") {
      setBeds((prev) =>
        prev.map((b) =>
          b.id === guest.bedId
            ? {
                ...b,
                status: "available",
                assignedResidentName: undefined,
                assignedResidentId: undefined,
              }
            : b
        )
      );

      // Recalculate room counts
      setRooms((prev) =>
        prev.map((r) => {
          if (r.id === guest.roomId) {
            const wasOccupied = guest.stayStatus === "active";
            const wasReserved = guest.stayStatus === "upcoming";
            const newOccupied = Math.max(0, r.occupiedBeds - (wasOccupied ? 1 : 0));
            const newReserved = Math.max(0, r.reservedBeds - (wasReserved ? 1 : 0));
            const newAvailable = Math.min(r.totalBeds, r.availableBeds + 1);

            let newRoomStatus: RoomStatus = r.roomStatus;
            if (newRoomStatus !== "under_maintenance" && newRoomStatus !== "inactive") {
              if (newOccupied === r.totalBeds) newRoomStatus = "fully_occupied";
              else if (newReserved === r.totalBeds) newRoomStatus = "fully_reserved";
              else if (newOccupied > 0 || newReserved > 0) newRoomStatus = "partially_occupied";
              else newRoomStatus = "available";
            }

            return {
              ...r,
              occupiedBeds: newOccupied,
              reservedBeds: newReserved,
              availableBeds: newAvailable,
              roomStatus: newRoomStatus,
            };
          }
          return r;
        })
      );
    }

    // Permanently remove from guests list
    setGuests((prev) => prev.filter((g) => g.id !== id));
    return { success: true };
  };

  return (
    <RoomContext.Provider
      value={{
        rooms,
        allBeds: beds,
        allResidents: residents,
        allBookings: bookings,
        allPayments: payments,
        allDeposits: deposits,
        guests,
        propertyRooms,
        stats,
        upcomingCheckouts,
        addRoom,
        updateRoom,
        toggleRoomStatus,
        deleteRoom,
        addGuest,
        updateGuest,
        checkoutGuest,
        deleteGuest,
        getGuestById,
        getRoomById,
        getBedsByRoomId,
        getResidentsByRoomId,
        getBookingsByRoomId,
        getPaymentsByRoomId,
        getDepositsByRoomId,
        getRoomFinancialSummary,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
}
