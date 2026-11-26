"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Edit2,
  Building2,
  Calendar,
  CreditCard,
  Tag,
  FileText,
  UploadCloud,
  Check,
  IndianRupee,
  Paperclip,
  Trash2,
} from "lucide-react";
import {
  Expense,
  ExpensePayload,
  ExpenseCategory,
  PaymentMode,
  DEFAULT_EXPENSE_CATEGORIES,
  ExpenseAttachment,
} from "@/types/expense";

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: ExpensePayload) => void;
  initialExpense?: Expense | null;
  currentPropertyId?: string;
  currentPropertyName?: string;
}

const PAYMENT_MODES: PaymentMode[] = [
  "Cash",
  "UPI",
  "Bank Transfer",
  "Cheque",
  "Credit Card",
  "Debit Card",
];

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialExpense,
  currentPropertyId = "prop-1",
  currentPropertyName = "Green Valley Residency",
}) => {
  const isEditing = Boolean(initialExpense);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("Electricity & Power");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryText, setCustomCategoryText] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("UPI");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [remark, setRemark] = useState("");
  const [attachment, setAttachment] = useState<ExpenseAttachment | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialExpense) {
      setTitle(initialExpense.title);
      const isDefault = DEFAULT_EXPENSE_CATEGORIES.includes(initialExpense.category as any);
      if (isDefault) {
        setCategory(initialExpense.category);
        setIsCustomCategory(false);
        setCustomCategoryText("");
      } else {
        setCategory("OTHER");
        setIsCustomCategory(true);
        setCustomCategoryText(initialExpense.category);
      }
      setAmount(initialExpense.amount.toString());
      setPaymentMode(initialExpense.paymentMode);
      setDate(initialExpense.date);
      setRemark(initialExpense.remark || "");
      setAttachment(initialExpense.attachment);
    } else {
      // Reset form
      setTitle("");
      setCategory("Electricity & Power");
      setIsCustomCategory(false);
      setCustomCategoryText("");
      setAmount("");
      setPaymentMode("UPI");
      setDate(new Date().toISOString().split("T")[0]);
      setRemark("");
      setAttachment(undefined);
    }
    setErrors({});
  }, [initialExpense, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const mockAttachment: ExpenseAttachment = {
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        url: URL.createObjectURL(file),
      };
      setAttachment(mockAttachment);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Expense title or vendor name is required";
    if (isCustomCategory && !customCategoryText.trim()) {
      newErrors.category = "Please enter your custom category name";
    }
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = "Enter a valid positive expense amount";
    }
    if (!date) newErrors.date = "Expense date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalCategory = isCustomCategory ? customCategoryText.trim() : category;

    const payload: ExpensePayload = {
      propertyId: initialExpense?.propertyId || currentPropertyId,
      propertyName: initialExpense?.propertyName || currentPropertyName,
      title: title.trim(),
      category: finalCategory,
      amount: parseFloat(amount),
      paymentMode,
      date,
      remark: remark.trim() || undefined,
      attachment,
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111622] rounded-3xl border border-[#E2E5DF] dark:border-[#222E42] shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F0F2EE] dark:border-[#1E2638] flex items-center justify-between bg-[#FAFAF8] dark:bg-[#0D111A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#171A18] dark:bg-[#151D2A] text-[#C6F36B] dark:text-brand-lime border border-transparent dark:border-[#263346] flex items-center justify-center font-bold">
              {isEditing ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#171A18] dark:text-white">
                {isEditing ? "Edit Expense Record" : "Add New Expense"}
              </h2>
              <p className="text-xs text-[#777D78] dark:text-slate-400">
                {isEditing
                  ? "Update payment details, vendor info, or category."
                  : `Record daily operational expense for ${currentPropertyName}.`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#777D78] dark:text-slate-400 hover:text-[#171A18] dark:hover:text-white hover:bg-[#F4F5F2] dark:hover:bg-[#1E293B] rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Active Property Card */}
          <div>
            <label className="block text-xs font-bold text-[#171A18] dark:text-slate-200 uppercase tracking-wider mb-1.5">
              Property
            </label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#F4F5F2] dark:bg-[#151D2A] border border-[#E2E5DF] dark:border-[#263346] rounded-xl text-xs sm:text-sm font-semibold text-[#171A18] dark:text-white">
              <Building2 className="w-4 h-4 text-[#171A18] dark:text-brand-lime" />
              <span>{initialExpense?.propertyName || currentPropertyName}</span>
              <span className="ml-auto text-[11px] font-medium text-[#777D78] dark:text-slate-300 bg-white dark:bg-[#111622] px-2 py-0.5 rounded-md border border-[#E2E5DF] dark:border-[#263346]">
                Active Property
              </span>
            </div>
          </div>

          {/* Title / Description */}
          <div>
            <label className="block text-xs font-bold text-[#171A18] dark:text-slate-200 uppercase tracking-wider mb-1.5">
              Expense Title / Vendor Description *
            </label>
            <input
              type="text"
              placeholder="e.g. BESCOM Electricity Bill Oct, Tata Play WiFi recharge..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2.5 bg-[#FAFAF8] dark:bg-[#151D2A] border rounded-xl text-xs sm:text-sm text-[#171A18] dark:text-white placeholder-[#777D78] dark:placeholder-slate-500 focus:outline-hidden transition-all ${
                errors.title ? "border-red-500 bg-red-50/20" : "border-[#E2E5DF] dark:border-[#263346] focus:border-[#171A18] dark:focus:border-brand-lime"
              }`}
            />
            {errors.title && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.title}</p>}
          </div>

          {/* Category Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#171A18] dark:text-slate-200 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777D78] dark:text-slate-400" />
                <select
                  value={isCustomCategory ? "OTHER" : category}
                  onChange={(e) => {
                    if (e.target.value === "OTHER") {
                      setIsCustomCategory(true);
                    } else {
                      setIsCustomCategory(false);
                      setCategory(e.target.value);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAF8] dark:bg-[#151D2A] border border-[#E2E5DF] dark:border-[#263346] rounded-xl text-xs sm:text-sm font-medium text-[#171A18] dark:text-white focus:outline-hidden focus:border-[#171A18] dark:focus:border-brand-lime transition-all cursor-pointer"
                >
                  {DEFAULT_EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="dark:bg-[#151D2A] dark:text-white">
                      {cat}
                    </option>
                  ))}
                  <option value="OTHER" className="dark:bg-[#151D2A] dark:text-white">+ Other / Custom Category</option>
                </select>
              </div>
            </div>

            {/* Custom Category Input if selected */}
            {isCustomCategory && (
              <div>
                <label className="block text-xs font-bold text-[#171A18] dark:text-slate-200 uppercase tracking-wider mb-1.5">
                  Custom Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gym Maintenance, Elevator AMC..."
                  value={customCategoryText}
                  onChange={(e) => setCustomCategoryText(e.target.value)}
                  className={`w-full px-4 py-2.5 bg-[#FAFAF8] dark:bg-[#151D2A] border rounded-xl text-xs sm:text-sm text-[#171A18] dark:text-white placeholder-[#777D78] dark:placeholder-slate-500 focus:outline-hidden transition-all ${
                    errors.category ? "border-red-500 bg-red-50/20" : "border-[#E2E5DF] dark:border-[#263346] focus:border-[#171A18] dark:focus:border-brand-lime"
                  }`}
                />
                {errors.category && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.category}</p>
                )}
              </div>
            )}
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#171A18] dark:text-slate-200 uppercase tracking-wider mb-1.5">
                Amount (₹ INR) *
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777D78] dark:text-slate-400" />
                <input
                  type="number"
                  step="any"
                  min="1"
                  placeholder="e.g. 4500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#FAFAF8] dark:bg-[#151D2A] border rounded-xl text-xs sm:text-sm font-bold text-[#171A18] dark:text-white focus:outline-hidden transition-all ${
                    errors.amount ? "border-red-500 bg-red-50/20" : "border-[#E2E5DF] dark:border-[#263346] focus:border-[#171A18] dark:focus:border-brand-lime"
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171A18] dark:text-slate-200 uppercase tracking-wider mb-1.5">
                Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777D78] dark:text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#FAFAF8] dark:bg-[#151D2A] border rounded-xl text-xs sm:text-sm font-medium text-[#171A18] dark:text-white focus:outline-hidden transition-all ${
                    errors.date ? "border-red-500" : "border-[#E2E5DF] dark:border-[#263346] focus:border-[#171A18] dark:focus:border-brand-lime"
                  }`}
                />
              </div>
              {errors.date && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.date}</p>
              )}
            </div>
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-xs font-bold text-[#171A18] dark:text-slate-200 uppercase tracking-wider mb-1.5">
              Payment Mode *
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777D78] dark:text-slate-400" />
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAF8] dark:bg-[#151D2A] border border-[#E2E5DF] dark:border-[#263346] rounded-xl text-xs sm:text-sm font-medium text-[#171A18] dark:text-white focus:outline-hidden focus:border-[#171A18] dark:focus:border-brand-lime transition-all cursor-pointer"
              >
                {PAYMENT_MODES.map((mode) => (
                  <option key={mode} value={mode} className="dark:bg-[#151D2A] dark:text-white">
                    {mode}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Remark / Notes */}
          <div>
            <label className="block text-xs font-bold text-[#171A18] dark:text-slate-200 uppercase tracking-wider mb-1.5">
              Remark / Vendor Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Paid to plumber Ramesh for fixing 2nd floor bathroom leakage, bill #481..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full px-4 py-2 bg-[#FAFAF8] dark:bg-[#151D2A] border border-[#E2E5DF] dark:border-[#263346] rounded-xl text-xs sm:text-sm text-[#171A18] dark:text-white placeholder-[#777D78] dark:placeholder-slate-500 focus:outline-hidden focus:border-[#171A18] dark:focus:border-brand-lime transition-all"
            />
          </div>

          {/* Receipt Upload / Preview */}
          <div>
            <label className="block text-xs font-bold text-[#171A18] dark:text-slate-200 uppercase tracking-wider mb-1.5">
              Receipt / Bill Attachment (Optional)
            </label>
            {attachment ? (
              <div className="flex items-center justify-between p-3 bg-[#F4F5F2] dark:bg-[#151D2A] border border-[#E2E5DF] dark:border-[#263346] rounded-xl text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Paperclip className="w-4 h-4 text-[#171A18] dark:text-brand-lime shrink-0" />
                  <span className="font-semibold text-[#171A18] dark:text-white truncate max-w-[200px]">
                    {attachment.name}
                  </span>
                  {attachment.size && (
                    <span className="text-[#777D78] dark:text-slate-400 text-[11px]">({attachment.size})</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setAttachment(undefined)}
                  className="p-1 text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-500/15 rounded-lg transition-all cursor-pointer"
                  title="Remove attachment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#CCD0C8] dark:border-[#263346] hover:border-[#171A18] dark:hover:border-brand-lime rounded-2xl bg-[#FAFAF8] dark:bg-[#151D2A] cursor-pointer transition-all">
                <UploadCloud className="w-6 h-6 text-[#777D78] dark:text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-[#171A18] dark:text-white">
                  Click to attach bill receipt
                </span>
                <span className="text-[11px] text-[#777D78] dark:text-slate-400">
                  Supports PNG, JPG, or PDF up to 5MB
                </span>
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
          <div className="pt-4 border-t border-[#F0F2EE] dark:border-[#1E2638] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#777D78] dark:text-slate-400 hover:text-[#171A18] dark:hover:text-white hover:bg-[#F4F5F2] dark:hover:bg-[#1E293B] rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#171A18] dark:bg-brand-lime hover:bg-[#2A2E2B] dark:hover:bg-[#BCE600] text-white dark:text-brand-obsidian rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Check className="w-4 h-4 text-[#C6F36B] dark:text-brand-obsidian" />
              <span>{isEditing ? "Save Changes" : "Record Expense"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
