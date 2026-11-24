"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Plus,
  CreditCard,
  Building2,
  Calendar,
  IndianRupee,
  User,
  Check,
  AlertCircle,
  UploadCloud,
  FileText,
  Paperclip,
  Trash2,
} from "lucide-react";
import {
  PaymentType,
  PaymentMethod,
  RecordPaymentPayload,
  PaymentAllocation,
  PaymentProofAttachment,
  RentLedgerItem,
} from "@/types/payment";
import { Guest } from "@/types/guest";

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: RecordPaymentPayload) => void;
  residents: Guest[];
  propertyId: string;
  propertyName: string;
  outstandingLedgers: RentLedgerItem[];
  preselectedResidentId?: string;
  preselectedBillingMonth?: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  "UPI",
  "Cash",
  "Bank Transfer",
  "Debit Card",
  "Credit Card",
  "Other",
];

const PAYMENT_TYPES: PaymentType[] = [
  "Monthly Rent",
  "Security Deposit",
  "Advance Rent",
  "Other Charges",
];

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  residents,
  propertyId,
  propertyName,
  outstandingLedgers,
  preselectedResidentId,
  preselectedBillingMonth,
}) => {
  const [selectedResidentId, setSelectedResidentId] = useState<string>("");
  const [paymentType, setPaymentType] = useState<PaymentType>("Monthly Rent");
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [billingMonth, setBillingMonth] = useState<string>("November 2026");
  const [transactionReference, setTransactionReference] = useState("");
  const [notes, setNotes] = useState("");
  const [proofAttachment, setProofAttachment] = useState<PaymentProofAttachment | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate selected resident
  useEffect(() => {
    if (preselectedResidentId) {
      setSelectedResidentId(preselectedResidentId);
    } else if (residents.length > 0 && !selectedResidentId) {
      setSelectedResidentId(residents[0].id);
    }
    if (preselectedBillingMonth) {
      setBillingMonth(preselectedBillingMonth);
    }
  }, [preselectedResidentId, preselectedBillingMonth, residents, isOpen]);

  const selectedResident = useMemo(() => {
    return residents.find((r) => r.id === selectedResidentId);
  }, [residents, selectedResidentId]);

  // Outstanding months for selected resident
  const residentOutstanding = useMemo(() => {
    if (!selectedResidentId) return [];
    return outstandingLedgers
      .filter((l) => l.residentId === selectedResidentId && l.pendingAmount > 0)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [outstandingLedgers, selectedResidentId]);

  const totalOutstanding = useMemo(() => {
    return residentOutstanding.reduce((s, i) => s + i.pendingAmount, 0);
  }, [residentOutstanding]);

  // Auto-fill amount with outstanding dues when resident changes
  useEffect(() => {
    if (selectedResident && !amount) {
      const defaultAmt = totalOutstanding > 0 ? totalOutstanding : selectedResident.monthlyRent;
      setAmount(defaultAmt.toString());
    }
  }, [selectedResident, totalOutstanding]);

  // Calculate live multi-month allocation breakdown
  const computedAllocations: PaymentAllocation[] = useMemo(() => {
    const numAmt = parseFloat(amount) || 0;
    if (numAmt <= 0 || paymentType !== "Monthly Rent") return [];

    let remaining = numAmt;
    const allocs: PaymentAllocation[] = [];

    // Allocate to outstanding months first
    for (const item of residentOutstanding) {
      if (remaining <= 0) break;
      const allocAmt = Math.min(item.pendingAmount, remaining);
      allocs.push({
        billingMonth: item.billingMonth,
        amountAllocated: allocAmt,
      });
      remaining -= allocAmt;
    }

    // If remaining exceeds outstanding, allocate to current/selected billing month
    if (remaining > 0) {
      const existingIdx = allocs.findIndex((a) => a.billingMonth === billingMonth);
      if (existingIdx !== -1) {
        allocs[existingIdx].amountAllocated += remaining;
      } else {
        allocs.push({
          billingMonth,
          amountAllocated: remaining,
        });
      }
    }

    return allocs;
  }, [amount, paymentType, residentOutstanding, billingMonth]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofAttachment({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        url: URL.createObjectURL(file),
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!selectedResidentId) errs.resident = "Please select a resident";
    const numAmt = parseFloat(amount);
    if (!amount || isNaN(numAmt) || numAmt <= 0) {
      errs.amount = "Enter a valid positive payment amount";
    }
    if (!paymentDate) errs.date = "Payment date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !selectedResident) return;

    const payload: RecordPaymentPayload = {
      residentId: selectedResident.id,
      residentName: selectedResident.name,
      residentPhone: selectedResident.phone,
      propertyId,
      propertyName,
      roomNumber: selectedResident.roomNumber,
      bedNumber: selectedResident.bedNumber,
      amount: parseFloat(amount),
      paymentDate,
      paymentType,
      paymentMethod,
      billingMonth,
      allocations: computedAllocations,
      transactionReference: transactionReference.trim() || undefined,
      notes: notes.trim() || undefined,
      proofAttachment,
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#E2E5DF] shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F0F2EE] flex items-center justify-between bg-[#FAFAF8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C6F36B] text-[#171A18] flex items-center justify-center font-black">
              <CreditCard className="w-5 h-5 text-[#171A18]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#171A18]">Record Resident Payment</h2>
              <p className="text-xs text-[#777D78]">
                Log rent collection, security deposit, or dues for {propertyName}.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#777D78] hover:text-[#171A18] hover:bg-[#F4F5F2] rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Property Context Badge */}
          <div className="flex items-center gap-2 p-2.5 bg-[#F4F5F2] border border-[#E2E5DF] rounded-xl text-xs">
            <Building2 className="w-4 h-4 text-[#171A18]" />
            <span className="font-bold text-[#171A18]">{propertyName}</span>
            <span className="text-[11px] text-[#777D78] ml-auto">Property Locked</span>
          </div>

          {/* Select Resident */}
          <div>
            <label className="block text-xs font-bold text-[#171A18] uppercase tracking-wider mb-1.5">
              Select Resident *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777D78]" />
              <select
                value={selectedResidentId}
                onChange={(e) => setSelectedResidentId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAF8] border border-[#E2E5DF] rounded-xl text-xs sm:text-sm font-semibold text-[#171A18] focus:outline-hidden focus:border-[#171A18] transition-all cursor-pointer"
              >
                {residents.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} – Room {r.roomNumber} ({r.bedNumber}) • ₹{r.monthlyRent.toLocaleString("en-IN")}/mo
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Resident Quick Info Card */}
          {selectedResident && (
            <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E2E5DF] grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-[#777D78] uppercase font-bold block">Assigned Bed</span>
                <span className="font-bold text-[#171A18]">
                  Room {selectedResident.roomNumber} ({selectedResident.bedNumber})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#777D78] uppercase font-bold block">Monthly Rent</span>
                <span className="font-bold text-[#171A18]">
                  ₹{selectedResident.monthlyRent.toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#777D78] uppercase font-bold block">Outstanding Dues</span>
                <span
                  className={`font-black ${
                    totalOutstanding > 0 ? "text-[#DC2626]" : "text-[#15803D]"
                  }`}
                >
                  ₹{totalOutstanding.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          )}

          {/* Payment Type & Billing Month */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#171A18] uppercase tracking-wider mb-1.5">
                Payment Type *
              </label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E2E5DF] rounded-xl text-xs sm:text-sm font-medium text-[#171A18] focus:outline-hidden focus:border-[#171A18]"
              >
                {PAYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171A18] uppercase tracking-wider mb-1.5">
                Billing Month / Period *
              </label>
              <select
                value={billingMonth}
                onChange={(e) => setBillingMonth(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E2E5DF] rounded-xl text-xs sm:text-sm font-medium text-[#171A18] focus:outline-hidden focus:border-[#171A18]"
              >
                <option value="November 2026">November 2026</option>
                <option value="December 2026">December 2026</option>
                <option value="October 2026">October 2026</option>
                <option value="September 2026">September 2026</option>
              </select>
            </div>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#171A18] uppercase tracking-wider mb-1.5">
                Amount Received (₹ INR) *
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777D78]" />
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 14500"
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#FAFAF8] border rounded-xl text-xs sm:text-sm font-bold text-[#171A18] focus:outline-hidden ${
                    errors.amount ? "border-red-500" : "border-[#E2E5DF] focus:border-[#171A18]"
                  }`}
                />
              </div>
              {errors.amount && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171A18] uppercase tracking-wider mb-1.5">
                Payment Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777D78]" />
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAF8] border border-[#E2E5DF] rounded-xl text-xs sm:text-sm font-medium text-[#171A18] focus:outline-hidden focus:border-[#171A18]"
                />
              </div>
            </div>
          </div>

          {/* Multi-Month Allocation Preview Card */}
          {computedAllocations.length > 0 && paymentType === "Monthly Rent" && (
            <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-xs space-y-1.5">
              <span className="font-bold text-[#065F46] block text-[11px] uppercase">
                Payment Allocation Preview
              </span>
              <div className="space-y-1">
                {computedAllocations.map((alloc) => (
                  <div key={alloc.billingMonth} className="flex justify-between items-center text-[#064E3B]">
                    <span>Toward {alloc.billingMonth}:</span>
                    <strong className="font-extrabold">₹{alloc.amountAllocated.toLocaleString("en-IN")}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Method & UTR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#171A18] uppercase tracking-wider mb-1.5">
                Payment Method *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E2E5DF] rounded-xl text-xs sm:text-sm font-semibold text-[#171A18] focus:outline-hidden focus:border-[#171A18]"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171A18] uppercase tracking-wider mb-1.5">
                Transaction Ref / UPI UTR (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. UPI/329482109821 or Cheque #..."
                value={transactionReference}
                onChange={(e) => setTransactionReference(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E2E5DF] rounded-xl text-xs sm:text-sm text-[#171A18] focus:outline-hidden focus:border-[#171A18]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-[#171A18] uppercase tracking-wider mb-1.5">
              Notes / Remarks (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Handed over cash at reception, balance promised on Friday..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#FAFAF8] border border-[#E2E5DF] rounded-xl text-xs sm:text-sm text-[#171A18] focus:outline-hidden focus:border-[#171A18]"
            />
          </div>

          {/* Payment Proof Attachment */}
          <div>
            <label className="block text-xs font-bold text-[#171A18] uppercase tracking-wider mb-1.5">
              Payment Screenshot / Bank Receipt (Optional)
            </label>
            {proofAttachment ? (
              <div className="flex items-center justify-between p-3 bg-[#F4F5F2] border border-[#E2E5DF] rounded-xl text-xs">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-[#171A18]" />
                  <span className="font-semibold text-[#171A18] truncate max-w-[200px]">
                    {proofAttachment.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setProofAttachment(undefined)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-[#CCD0C8] hover:border-[#171A18] rounded-xl bg-[#FAFAF8] cursor-pointer transition-all">
                <UploadCloud className="w-5 h-5 text-[#777D78] mb-1" />
                <span className="text-xs font-bold text-[#171A18]">Upload UPI screenshot or receipt</span>
                <span className="text-[10px] text-[#777D78]">PNG, JPG, or PDF</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            )}
          </div>

          {/* Footer CTAs */}
          <div className="pt-4 border-t border-[#F0F2EE] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#777D78] hover:text-[#171A18] rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#171A18] hover:bg-[#2A2E2B] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Check className="w-4 h-4 text-[#C6F36B]" />
              <span>Confirm & Record Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
