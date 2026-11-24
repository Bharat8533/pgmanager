"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  PaymentRecord,
  RentLedgerItem,
  ResidentDepositRecord,
  RecordPaymentPayload,
  PaymentAllocation,
} from "@/types/payment";
import {
  MOCK_PAYMENT_RECORDS,
  MOCK_RENT_LEDGER,
  MOCK_RESIDENT_DEPOSITS,
} from "@/constants/mockPaymentData";
import { Guest } from "@/types/guest";

interface PaymentContextType {
  payments: PaymentRecord[];
  ledger: RentLedgerItem[];
  deposits: ResidentDepositRecord[];
  recordPayment: (payload: RecordPaymentPayload) => { success: boolean; payment?: PaymentRecord; error?: string };
  reversePayment: (paymentId: string, reason: string) => { success: boolean; error?: string };
  generateMonthlyBilling: (
    propertyId: string,
    propertyName: string,
    billingMonth: string,
    dueDate: string,
    activeGuests: Guest[]
  ) => { success: boolean; generatedCount: number; message: string };
  adjustDeposit: (
    residentId: string,
    type: "adjustment" | "refund",
    amount: number,
    notes?: string
  ) => { success: boolean; error?: string };
  getOutstandingForResident: (residentId: string) => {
    totalPending: number;
    outstandingLedgers: RentLedgerItem[];
  };
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  // 1. Payments State
  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("staymanage_payments");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return MOCK_PAYMENT_RECORDS;
  });

  // 2. Ledger State
  const [ledger, setLedger] = useState<RentLedgerItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("staymanage_rent_ledger");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return MOCK_RENT_LEDGER;
  });

  // 3. Deposits State
  const [deposits, setDeposits] = useState<ResidentDepositRecord[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("staymanage_deposits");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return MOCK_RESIDENT_DEPOSITS;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("staymanage_payments", JSON.stringify(payments));
    } catch {}
  }, [payments]);

  useEffect(() => {
    try {
      localStorage.setItem("staymanage_rent_ledger", JSON.stringify(ledger));
    } catch {}
  }, [ledger]);

  useEffect(() => {
    try {
      localStorage.setItem("staymanage_deposits", JSON.stringify(deposits));
    } catch {}
  }, [deposits]);

  // Helper: Get outstanding records for a resident
  const getOutstandingForResident = (residentId: string) => {
    const outstandingLedgers = ledger.filter(
      (item) => item.residentId === residentId && item.pendingAmount > 0
    );
    const totalPending = outstandingLedgers.reduce((sum, item) => sum + item.pendingAmount, 0);
    return { totalPending, outstandingLedgers };
  };

  // Action: Record a payment
  const recordPayment = (payload: RecordPaymentPayload) => {
    if (payload.amount <= 0) {
      return { success: false, error: "Payment amount must be greater than zero." };
    }
    if (!payload.residentId) {
      return { success: false, error: "Please select a resident." };
    }

    const uniqueId = `PAY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    // Calculate allocation if not provided or if multi-month
    let finalAllocations: PaymentAllocation[] = payload.allocations || [];
    let updatedLedger = [...ledger];

    if (payload.paymentType === "Monthly Rent") {
      if (!finalAllocations || finalAllocations.length === 0) {
        // Auto-allocate across resident's outstanding months (oldest first)
        const residentLedgers = updatedLedger
          .filter((l) => l.residentId === payload.residentId && l.pendingAmount > 0)
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

        let remainingToAllocate = payload.amount;
        finalAllocations = [];

        for (const item of residentLedgers) {
          if (remainingToAllocate <= 0) break;
          const allocationAmt = Math.min(item.pendingAmount, remainingToAllocate);
          finalAllocations.push({
            billingMonth: item.billingMonth,
            amountAllocated: allocationAmt,
          });
          remainingToAllocate -= allocationAmt;
        }

        // If extra remains, allocate to selected billing month
        if (remainingToAllocate > 0) {
          finalAllocations.push({
            billingMonth: payload.billingMonth,
            amountAllocated: remainingToAllocate,
          });
        }
      }

      // Apply allocations to ledger items
      finalAllocations.forEach((alloc) => {
        const ledgerIndex = updatedLedger.findIndex(
          (l) => l.residentId === payload.residentId && l.billingMonth === alloc.billingMonth
        );

        if (ledgerIndex !== -1) {
          const item = updatedLedger[ledgerIndex];
          const newPaid = item.paidAmount + alloc.amountAllocated;
          const newPending = Math.max(0, item.rentAmount - newPaid);
          const newStatus =
            newPending === 0
              ? "paid"
              : newPaid > 0
              ? "partial"
              : item.paymentStatus;

          updatedLedger[ledgerIndex] = {
            ...item,
            paidAmount: newPaid,
            pendingAmount: newPending,
            paymentStatus: newStatus,
            lastPaymentDate: payload.paymentDate,
          };
        }
      });

      setLedger(updatedLedger);
    } else if (payload.paymentType === "Security Deposit") {
      // Update deposit record
      setDeposits((prev) => {
        const found = prev.find((d) => d.residentId === payload.residentId);
        if (found) {
          return prev.map((d) =>
            d.residentId === payload.residentId
              ? {
                  ...d,
                  depositReceived: d.depositReceived + payload.amount,
                  currentBalance: d.currentBalance + payload.amount,
                  notes: `${d.notes || ""} | +₹${payload.amount} added on ${payload.paymentDate}`.trim(),
                }
              : d
          );
        } else {
          return [
            ...prev,
            {
              residentId: payload.residentId,
              residentName: payload.residentName,
              residentPhone: payload.residentPhone,
              roomNumber: payload.roomNumber,
              bedNumber: payload.bedNumber,
              propertyId: payload.propertyId,
              propertyName: payload.propertyName,
              depositReceived: payload.amount,
              dateReceived: payload.paymentDate,
              adjustments: 0,
              refunds: 0,
              currentBalance: payload.amount,
            },
          ];
        }
      });
    }

    const newPaymentRecord: PaymentRecord = {
      id: uniqueId,
      propertyId: payload.propertyId,
      propertyName: payload.propertyName,
      residentId: payload.residentId,
      residentName: payload.residentName,
      residentPhone: payload.residentPhone,
      roomNumber: payload.roomNumber,
      bedNumber: payload.bedNumber,
      amount: payload.amount,
      paymentDate: payload.paymentDate,
      paymentType: payload.paymentType,
      paymentMethod: payload.paymentMethod,
      billingMonth: payload.billingMonth,
      allocations: finalAllocations,
      transactionReference: payload.transactionReference?.trim() || undefined,
      notes: payload.notes?.trim() || undefined,
      proofAttachment: payload.proofAttachment,
      status: "completed",
      createdAt: nowIso,
    };

    setPayments((prev) => [newPaymentRecord, ...prev]);
    return { success: true, payment: newPaymentRecord };
  };

  // Action: Safe Payment Reversal / Cancellation with Audit Trail
  const reversePayment = (paymentId: string, reason: string) => {
    if (!reason.trim()) {
      return { success: false, error: "A mandatory cancellation reason is required." };
    }

    const targetPayment = payments.find((p) => p.id === paymentId);
    if (!targetPayment) {
      return { success: false, error: "Payment record not found." };
    }
    if (targetPayment.status === "reversed") {
      return { success: false, error: "This payment has already been reversed." };
    }

    // 1. Mark payment as reversed
    const nowIso = new Date().toISOString();
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: "reversed",
              reversedAt: nowIso,
              reversalReason: reason.trim(),
            }
          : p
      )
    );

    // 2. Reverse allocations from ledger
    if (targetPayment.allocations && targetPayment.allocations.length > 0) {
      setLedger((prev) => {
        let updated = [...prev];
        targetPayment.allocations?.forEach((alloc) => {
          const idx = updated.findIndex(
            (l) =>
              l.residentId === targetPayment.residentId &&
              l.billingMonth === alloc.billingMonth
          );
          if (idx !== -1) {
            const item = updated[idx];
            const revertedPaid = Math.max(0, item.paidAmount - alloc.amountAllocated);
            const revertedPending = item.rentAmount - revertedPaid;
            const isDuePassed = new Date(item.dueDate) < new Date();
            const revertedStatus =
              revertedPending === item.rentAmount
                ? isDuePassed
                  ? "overdue"
                  : "pending"
                : revertedPaid > 0
                ? "partial"
                : "pending";

            updated[idx] = {
              ...item,
              paidAmount: revertedPaid,
              pendingAmount: revertedPending,
              paymentStatus: revertedStatus,
            };
          }
        });
        return updated;
      });
    }

    // 3. If security deposit was reversed
    if (targetPayment.paymentType === "Security Deposit") {
      setDeposits((prev) =>
        prev.map((d) =>
          d.residentId === targetPayment.residentId
            ? {
                ...d,
                depositReceived: Math.max(0, d.depositReceived - targetPayment.amount),
                currentBalance: Math.max(0, d.currentBalance - targetPayment.amount),
              }
            : d
        )
      );
    }

    return { success: true };
  };

  // Action: Monthly Rent Billing Generator
  const generateMonthlyBilling = (
    propertyId: string,
    propertyName: string,
    billingMonth: string,
    dueDate: string,
    activeGuests: Guest[]
  ) => {
    // Filter active residents for this property
    const eligibleResidents = activeGuests.filter(
      (g) => g.propertyId === propertyId && g.stayStatus === "active"
    );

    if (eligibleResidents.length === 0) {
      return {
        success: false,
        generatedCount: 0,
        message: `No active residents found in ${propertyName} to bill for ${billingMonth}.`,
      };
    }

    // Prevent duplicate billing for the same resident and billing month
    let generatedCount = 0;
    const newLedgerItems: RentLedgerItem[] = [];

    eligibleResidents.forEach((resident) => {
      const alreadyBilled = ledger.some(
        (l) => l.residentId === resident.id && l.billingMonth === billingMonth
      );

      if (!alreadyBilled) {
        newLedgerItems.push({
          id: `LEDGER-${resident.roomNumber}-${billingMonth.replace(/\s+/g, "").toUpperCase()}`,
          residentId: resident.id,
          residentName: resident.name,
          residentPhone: resident.phone,
          residentEmail: resident.email,
          propertyId,
          propertyName,
          roomId: resident.roomId,
          roomNumber: resident.roomNumber,
          bedNumber: resident.bedNumber,
          billingMonth,
          rentAmount: resident.monthlyRent,
          paidAmount: 0,
          pendingAmount: resident.monthlyRent,
          dueDate,
          paymentStatus: new Date(dueDate) < new Date() ? "overdue" : "pending",
          stayStatus: "active",
          notes: "Generated via Monthly Billing workflow.",
        });
        generatedCount++;
      }
    });

    if (generatedCount === 0) {
      return {
        success: false,
        generatedCount: 0,
        message: `All ${eligibleResidents.length} active residents in ${propertyName} have already been billed for ${billingMonth}. No duplicates created.`,
      };
    }

    setLedger((prev) => [...newLedgerItems, ...prev]);
    return {
      success: true,
      generatedCount,
      message: `Successfully generated ${generatedCount} rent billing records for ${billingMonth} in ${propertyName}!`,
    };
  };

  // Action: Security Deposit Adjustment or Refund
  const adjustDeposit = (
    residentId: string,
    type: "adjustment" | "refund",
    amount: number,
    notes?: string
  ) => {
    if (amount <= 0) return { success: false, error: "Amount must be greater than zero." };

    const depositRecord = deposits.find((d) => d.residentId === residentId);
    if (!depositRecord) return { success: false, error: "Deposit record not found for resident." };

    if (amount > depositRecord.currentBalance) {
      return {
        success: false,
        error: `Cannot ${type} ₹${amount}. Current available deposit balance is ₹${depositRecord.currentBalance}.`,
      };
    }

    setDeposits((prev) =>
      prev.map((d) => {
        if (d.residentId !== residentId) return d;
        const newBalance = d.currentBalance - amount;
        return {
          ...d,
          adjustments: type === "adjustment" ? d.adjustments + amount : d.adjustments,
          refunds: type === "refund" ? d.refunds + amount : d.refunds,
          currentBalance: newBalance,
          notes: `${d.notes || ""} | ${type === "refund" ? "Refund" : "Adjustment"} of ₹${amount} recorded on ${new Date().toISOString().split("T")[0]}: ${notes || ""}`.trim(),
        };
      })
    );

    return { success: true };
  };

  return (
    <PaymentContext.Provider
      value={{
        payments,
        ledger,
        deposits,
        recordPayment,
        reversePayment,
        generateMonthlyBilling,
        adjustDeposit,
        getOutstandingForResident,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
}
