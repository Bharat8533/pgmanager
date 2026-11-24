"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Expense, ExpensePayload } from "@/types/expense";
import { MOCK_EXPENSES } from "@/constants/mockExpenseData";
import { useOwner } from "@/contexts/OwnerContext";

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (payload: ExpensePayload) => { success: boolean; error?: string; expense?: Expense };
  updateExpense: (id: string, payload: Partial<ExpensePayload>) => { success: boolean; error?: string; expense?: Expense };
  deleteExpense: (id: string) => { success: boolean; error?: string };
  getExpenseById: (id: string) => Expense | undefined;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const { allPropertiesList } = useOwner();

  // Hydration state for Expenses
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("staymanage_owner_expenses");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return MOCK_EXPENSES;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("staymanage_owner_expenses", JSON.stringify(expenses));
    } catch {
      // Ignore
    }
  }, [expenses]);

  // Helper to resolve property name
  const resolvePropertyName = (propertyId: string): string => {
    if (propertyId === "common") return "Common Business Expense";
    const found = allPropertiesList.find((p) => p.id === propertyId);
    return found ? found.name : "StayManage Residency";
  };

  const addExpense = (payload: ExpensePayload) => {
    if (!payload.title.trim()) {
      return { success: false, error: "Expense title is required." };
    }
    if (!payload.category.trim()) {
      return { success: false, error: "Please select an expense category." };
    }
    if (!payload.propertyId) {
      return { success: false, error: "Please select an associated property or Common Business." };
    }
    if (payload.amount <= 0) {
      return { success: false, error: "Amount must be greater than zero." };
    }
    if (!payload.date) {
      return { success: false, error: "Expense date is required." };
    }

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      title: payload.title.trim(),
      category: payload.category.trim(),
      propertyId: payload.propertyId,
      propertyName: resolvePropertyName(payload.propertyId),
      amount: Number(payload.amount),
      paymentMode: payload.paymentMode,
      date: payload.date,
      remark: payload.remark?.trim() || undefined,
      attachment: payload.attachment,
      createdAt: new Date().toISOString(),
    };

    setExpenses((prev) => [newExpense, ...prev]);
    return { success: true, expense: newExpense };
  };

  const updateExpense = (id: string, payload: Partial<ExpensePayload>) => {
    const existing = expenses.find((e) => e.id === id);
    if (!existing) {
      return { success: false, error: "Expense record not found." };
    }

    const updatedPropertyId = payload.propertyId || existing.propertyId;
    const merged: Expense = {
      ...existing,
      ...payload,
      propertyName: resolvePropertyName(updatedPropertyId),
      amount: payload.amount !== undefined ? Number(payload.amount) : existing.amount,
    };

    setExpenses((prev) => prev.map((e) => (e.id === id ? merged : e)));
    return { success: true, expense: merged };
  };

  const deleteExpense = (id: string) => {
    const existing = expenses.find((e) => e.id === id);
    if (!existing) {
      return { success: false, error: "Expense record not found." };
    }

    setExpenses((prev) => prev.filter((e) => e.id !== id));
    return { success: true };
  };

  const getExpenseById = (id: string) => {
    return expenses.find((e) => e.id === id);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpenseById,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpense must be used within an ExpenseProvider");
  }
  return context;
}
