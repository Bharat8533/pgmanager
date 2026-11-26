"use client";

import React, { useState, useEffect } from "react";
import { Guest, AddGuestPayload, Gender } from "@/types/guest";
import { Property } from "@/types/owner";
import { Room, Bed } from "@/types/room";
import {
  X,
  User,
  Building2,
  BedDouble,
  CreditCard,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  Check,
  DollarSign,
  Receipt,
} from "lucide-react";

interface GuestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: AddGuestPayload) => { success: boolean; error?: string };
  mode: "add" | "edit";
  initialGuest?: Guest | null;
  activeProperty: Property | null;
  rooms: Room[];
  allBeds: Bed[];
}

export function GuestFormModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialGuest,
  activeProperty,
  rooms,
  allBeds,
}: GuestFormModalProps) {
  const currentPropertyId = activeProperty?.id || "prop-1";
  const currentPropertyName = activeProperty?.name || "StayManage Residency";

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<Gender>("Male");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [aadhaarMasked, setAadhaarMasked] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [workOrCollege, setWorkOrCollege] = useState("");

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("Father");

  // Room & Bed Assignment (Scoped to active property)
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedBedId, setSelectedBedId] = useState("");

  // Stay & Rent
  const [admissionDate, setAdmissionDate] = useState("");
  const [expectedCheckoutDate, setExpectedCheckoutDate] = useState("");
  const [monthlyRent, setMonthlyRent] = useState<number>(14000);
  const [securityDeposit, setSecurityDeposit] = useState<number>(28000);
  const [specialNotes, setSpecialNotes] = useState("");

  // Initial Payment (Add Mode only)
  const [recordInitialPayment, setRecordInitialPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(14000);
  const [paymentType, setPaymentType] = useState<"rent" | "security_deposit">("rent");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Cash" | "Bank Transfer" | "Other">("UPI");
  const [transactionRef, setTransactionRef] = useState("");

  // UI Error State
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate or reset form when modal opens
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      return;
    }

    if (mode === "edit" && initialGuest) {
      setName(initialGuest.name || "");
      setPhone(initialGuest.phone || "");
      setEmail(initialGuest.email || "");
      setGender(initialGuest.gender || "Male");
      setDateOfBirth(initialGuest.dateOfBirth || "");
      setAadhaarMasked(initialGuest.aadhaarMasked || "");
      setPermanentAddress(initialGuest.permanentAddress || "");
      setCity(initialGuest.city || "");
      setState(initialGuest.state || "");
      setWorkOrCollege(initialGuest.workOrCollege || "");
      setEmergencyName(initialGuest.emergencyContactName || "");
      setEmergencyPhone(initialGuest.emergencyContactNumber || "");
      setEmergencyRelation(initialGuest.emergencyRelationship || "Father");
      setSelectedRoomId(initialGuest.roomId || "");
      setSelectedBedId(initialGuest.bedId || "");
      setAdmissionDate(initialGuest.admissionDate || "");
      setExpectedCheckoutDate(initialGuest.expectedCheckoutDate || "");
      setMonthlyRent(initialGuest.monthlyRent || 14000);
      setSecurityDeposit(initialGuest.securityDeposit || 28000);
      setSpecialNotes(initialGuest.specialNotes || "");
      setRecordInitialPayment(false);
    } else {
      const today = new Date().toISOString().split("T")[0];
      setName("");
      setPhone("+91 ");
      setEmail("");
      setGender("Male");
      setDateOfBirth("");
      setAadhaarMasked("");
      setPermanentAddress("");
      setCity("");
      setState("");
      setWorkOrCollege("");
      setEmergencyName("");
      setEmergencyPhone("");
      setEmergencyRelation("Father");
      setSelectedRoomId("");
      setSelectedBedId("");
      setAdmissionDate(today);
      setExpectedCheckoutDate("");
      setMonthlyRent(14500);
      setSecurityDeposit(29000);
      setSpecialNotes("");
      setRecordInitialPayment(false);
      setPaymentAmount(14500);
      setPaymentType("rent");
      setPaymentMethod("UPI");
      setTransactionRef("");
    }
  }, [isOpen, mode, initialGuest]);

  // Available rooms for active property
  const availableRooms = React.useMemo(() => {
    return rooms.filter((r) => r.propertyId === currentPropertyId);
  }, [rooms, currentPropertyId]);

  // Available beds for chosen room
  const availableBeds = React.useMemo(() => {
    if (!selectedRoomId) return [];
    return allBeds.filter((b) => {
      if (b.roomId !== selectedRoomId) return false;
      if (mode === "edit" && initialGuest && b.id === initialGuest.bedId) {
        return true;
      }
      return b.status === "available";
    });
  }, [allBeds, selectedRoomId, mode, initialGuest]);

  // Auto-fill monthly rent when room changes
  const handleRoomChange = (newRoomId: string) => {
    setSelectedRoomId(newRoomId);
    setSelectedBedId("");

    const room = rooms.find((r) => r.id === newRoomId);
    if (room) {
      setMonthlyRent(room.defaultMonthlyRent);
      setSecurityDeposit(room.defaultMonthlyRent * 2);
      setPaymentAmount(room.defaultMonthlyRent);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError("Please enter the resident's full name.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!selectedRoomId) {
      setError("Please select an available room.");
      return;
    }
    if (!selectedBedId) {
      setError("Please select an available bed.");
      return;
    }
    if (!admissionDate) {
      setError("Please specify the admission check-in date.");
      return;
    }
    if (monthlyRent <= 0) {
      setError("Monthly rent must be greater than zero.");
      return;
    }
    if (!emergencyName.trim() || !emergencyPhone.trim()) {
      setError("Please provide emergency contact details (Name and Phone).");
      return;
    }

    setIsSubmitting(true);

    const payload: AddGuestPayload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      gender,
      dateOfBirth: dateOfBirth || undefined,
      aadhaarMasked: aadhaarMasked.trim() || undefined,
      permanentAddress: permanentAddress.trim() || undefined,
      city: city.trim() || undefined,
      state: state.trim() || undefined,
      workOrCollege: workOrCollege.trim() || undefined,
      emergencyContactName: emergencyName.trim(),
      emergencyContactNumber: emergencyPhone.trim(),
      emergencyRelationship: emergencyRelation.trim(),
      propertyId: currentPropertyId,
      roomId: selectedRoomId,
      bedId: selectedBedId,
      admissionDate,
      expectedCheckoutDate: expectedCheckoutDate || undefined,
      monthlyRent: Number(monthlyRent),
      securityDeposit: Number(securityDeposit),
      specialNotes: specialNotes.trim() || undefined,
      initialPayment:
        recordInitialPayment && paymentAmount > 0
          ? {
              amount: Number(paymentAmount),
              paymentDate: admissionDate,
              paymentType,
              paymentMethod,
              transactionRef: transactionRef.trim() || undefined,
            }
          : undefined,
    };

    const res = onSubmit(payload);
    setIsSubmitting(false);

    if (!res.success) {
      setError(res.error || "An error occurred while saving the resident.");
    } else {
      onClose();
    }
  };

  const isFutureAdmission = admissionDate > new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-white dark:bg-[#111622] rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-brand-border dark:border-[#222E42] overflow-hidden animate-slideIn">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-brand-border dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0D111A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-obsidian dark:bg-[#1E2638] text-brand-lime border border-transparent dark:border-[#263346] flex items-center justify-center shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-brand-charcoal dark:text-white">
                {mode === "add" ? "Add New Resident / Guest" : "Edit Resident Details"}
              </h2>
              <p className="text-xs text-brand-muted dark:text-slate-400">
                {mode === "add"
                  ? `Admit a resident to ${currentPropertyName} and allocate a bed.`
                  : `Update records for ${initialGuest?.name}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white dark:bg-[#151D2A] hover:bg-gray-100 dark:hover:bg-[#1E293B] text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white border border-brand-border dark:border-[#263346] flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* SECTION 1: PERSONAL INFORMATION */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-brand-border/60 dark:border-[#1E2638] pb-2">
              <span className="w-5 h-5 rounded-md bg-brand-obsidian dark:bg-[#1E2638] text-brand-lime dark:border dark:border-[#263346] text-[11px] font-black flex items-center justify-center">
                1
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal dark:text-white">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Full Name */}
              <div>
                <label className="block text-brand-charcoal dark:text-slate-300 font-semibold mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aryan Sehgal"
                  className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl text-xs text-brand-charcoal dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-lime"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-brand-charcoal dark:text-slate-300 font-semibold mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl text-xs text-brand-charcoal dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-lime"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-brand-charcoal dark:text-slate-300 font-semibold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aryan@example.com"
                  className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl text-xs text-brand-charcoal dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-lime"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-brand-charcoal dark:text-slate-300 font-semibold mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl text-xs text-brand-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-lime cursor-pointer"
                >
                  <option value="Male" className="dark:bg-[#151D2A]">Male</option>
                  <option value="Female" className="dark:bg-[#151D2A]">Female</option>
                  <option value="Other" className="dark:bg-[#151D2A]">Other</option>
                </select>
              </div>

              {/* Masked Aadhaar / ID */}
              <div>
                <label className="block text-brand-charcoal dark:text-slate-300 font-semibold mb-1">
                  Government ID / Masked Aadhaar
                </label>
                <input
                  type="text"
                  value={aadhaarMasked}
                  onChange={(e) => setAadhaarMasked(e.target.value)}
                  placeholder="•••• •••• 8291"
                  className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl text-xs text-brand-charcoal dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-lime"
                />
              </div>

              {/* Workplace / College */}
              <div>
                <label className="block text-brand-charcoal dark:text-slate-300 font-semibold mb-1">
                  Workplace or College
                </label>
                <input
                  type="text"
                  value={workOrCollege}
                  onChange={(e) => setWorkOrCollege(e.target.value)}
                  placeholder="e.g. Software Engineer @ Infosys"
                  className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl text-xs text-brand-charcoal dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-lime"
                />
              </div>

              {/* Permanent Address */}
              <div className="sm:col-span-2">
                <label className="block text-brand-charcoal dark:text-slate-300 font-semibold mb-1">
                  Permanent Address (Home City / State)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={permanentAddress}
                    onChange={(e) => setPermanentAddress(e.target.value)}
                    placeholder="Address Line"
                    className="col-span-1 px-3 py-2 bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl text-xs text-brand-charcoal dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-lime"
                  />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City (e.g. Jaipur)"
                    className="col-span-1 px-3 py-2 bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl text-xs text-brand-charcoal dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-lime"
                  />
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State (e.g. Rajasthan)"
                    className="col-span-1 px-3 py-2 bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl text-xs text-brand-charcoal dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-lime"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="sm:col-span-2 bg-[#F8FAFC] dark:bg-[#151D2A] p-3 rounded-xl border border-brand-border dark:border-[#263346] space-y-2">
                <label className="block text-brand-charcoal dark:text-white font-bold text-xs">
                  Emergency Contact Details <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="Guardian Name"
                    className="px-3 py-2 bg-white dark:bg-[#0D111A] border border-brand-border dark:border-[#263346] rounded-xl text-xs text-brand-charcoal dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-lime"
                  />
                  <input
                    type="text"
                    required
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="Guardian Phone"
                    className="px-3 py-2 bg-white dark:bg-[#0D111A] border border-brand-border dark:border-[#263346] rounded-xl text-xs text-brand-charcoal dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-lime"
                  />
                  <select
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-[#0D111A] border border-brand-border dark:border-[#263346] rounded-xl text-xs text-brand-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-lime cursor-pointer"
                  >
                    <option value="Father" className="dark:bg-[#151D2A]">Father</option>
                    <option value="Mother" className="dark:bg-[#151D2A]">Mother</option>
                    <option value="Brother" className="dark:bg-[#151D2A]">Brother</option>
                    <option value="Sister" className="dark:bg-[#151D2A]">Sister</option>
                    <option value="Spouse" className="dark:bg-[#151D2A]">Spouse</option>
                    <option value="Guardian" className="dark:bg-[#151D2A]">Guardian</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: ROOM & BED ALLOCATION */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-brand-border/60 dark:border-[#1E2638] pb-2">
              <span className="w-5 h-5 rounded-md bg-brand-obsidian dark:bg-[#1E2638] text-brand-lime dark:border dark:border-[#263346] text-[11px] font-black flex items-center justify-center">
                2
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal dark:text-white">
                Room & Bed Allocation
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Active Property Info */}
              <div>
                <label className="block text-brand-charcoal dark:text-slate-300 font-semibold mb-1">
                  Active PG Property
                </label>
                <div className="flex items-center gap-2 px-3 py-2 bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl text-xs font-bold text-brand-charcoal dark:text-white">
                  <Building2 className="w-3.5 h-3.5 text-brand-obsidian dark:text-brand-lime flex-shrink-0" />
                  <span className="truncate">{currentPropertyName}</span>
                </div>
              </div>

              {/* Room Selector */}
              <div>
                <label className="block text-brand-charcoal dark:text-slate-300 font-semibold mb-1">
                  Select Room <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => handleRoomChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl text-xs text-brand-charcoal dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-brand-lime cursor-pointer"
                >
                  <option value="" className="dark:bg-[#151D2A]">-- Choose Room --</option>
                  {availableRooms.map((r) => (
                    <option key={r.id} value={r.id} className="dark:bg-[#151D2A]">
                      Room {r.roomNumber} ({r.roomType} · {r.availableBeds} free)
                    </option>
                  ))}
                </select>
              </div>

              {/* Bed Selector */}
              <div>
                <label className="block text-brand-charcoal dark:text-slate-300 font-semibold mb-1">
                  Select Bed <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedBedId}
                  onChange={(e) => setSelectedBedId(e.target.value)}
                  disabled={!selectedRoomId}
                  className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl text-xs text-brand-charcoal dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-brand-lime cursor-pointer disabled:opacity-50"
                >
                  <option value="" className="dark:bg-[#151D2A]">-- Choose Bed --</option>
                  {availableBeds.map((b) => (
                    <option key={b.id} value={b.id} className="dark:bg-[#151D2A]">
                      Bed {b.bedNumber} ({b.status === "available" ? "Free" : b.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: STAY & RENT DETAILS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-brand-border/60 dark:border-[#1E2638] pb-2">
              <span className="w-5 h-5 rounded-md bg-brand-obsidian dark:bg-[#1E2638] text-brand-lime dark:border dark:border-[#263346] text-[11px] font-black flex items-center justify-center">
                3
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal dark:text-white">
                Stay Duration & Rent Agreement
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Admission Date */}
              <div>
                <label className="block text-brand-charcoal dark:text-slate-300 font-semibold mb-1">
                  Admission Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl text-xs text-brand-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-lime"
                />
                {isFutureAdmission && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold mt-1">
                    ⚡ Future date selected. Bed will be marked as "Reserved" until check-in.
                  </p>
                )}
              </div>

              {/* Expected Checkout Date */}
              <div>
                <label className="block text-brand-charcoal dark:text-slate-300 font-semibold mb-1">
                  Expected Check-out Date (Optional)
                </label>
                <input
                  type="date"
                  value={expectedCheckoutDate}
                  onChange={(e) => setExpectedCheckoutDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl text-xs text-brand-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-lime"
                />
              </div>

              {/* Monthly Rent */}
              <div>
                <label className="block text-brand-charcoal dark:text-slate-300 font-semibold mb-1">
                  Agreed Monthly Rent (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted dark:text-slate-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl text-xs font-bold text-brand-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-lime"
                  />
                </div>
              </div>

              {/* Security Deposit */}
              <div>
                <label className="block text-brand-charcoal dark:text-slate-300 font-semibold mb-1">
                  Security Deposit (Refundable Escrow ₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted dark:text-slate-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl text-xs font-bold text-brand-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-lime"
                  />
                </div>
              </div>

              {/* Special Notes */}
              <div className="sm:col-span-2">
                <label className="block text-brand-charcoal dark:text-slate-300 font-semibold mb-1">
                  Special Notes or Dietary Preferences
                </label>
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Vegetarian only, bike parking slot required, late night access needed."
                  className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl text-xs text-brand-charcoal dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-lime"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: INITIAL PAYMENT (Add Mode Only) */}
          {mode === "add" && (
            <div className="space-y-3 bg-[#F8FAFC] dark:bg-[#151D2A] p-4 rounded-2xl border border-brand-border dark:border-[#263346]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-brand-obsidian dark:bg-[#1E2638] text-brand-lime dark:border dark:border-[#263346] text-[11px] font-black flex items-center justify-center">
                    4
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal dark:text-white">
                    Record Initial Advance Payment (Optional)
                  </h3>
                </div>

                <label className="flex items-center gap-2 text-xs font-bold text-brand-charcoal dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recordInitialPayment}
                    onChange={(e) => setRecordInitialPayment(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-obsidian focus:ring-brand-lime"
                  />
                  <span>Record Payment Now</span>
                </label>
              </div>

              {recordInitialPayment && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div>
                    <label className="block text-brand-muted dark:text-slate-400 font-medium mb-1">
                      Amount Paid (₹)
                    </label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-[#0D111A] border border-brand-border dark:border-[#263346] rounded-xl text-xs font-bold text-brand-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-lime"
                    />
                  </div>

                  <div>
                    <label className="block text-brand-muted dark:text-slate-400 font-medium mb-1">
                      Payment Towards
                    </label>
                    <select
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#0D111A] border border-brand-border dark:border-[#263346] rounded-xl text-xs text-brand-charcoal dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-lime cursor-pointer"
                    >
                      <option value="rent" className="dark:bg-[#151D2A]">1st Month Rent</option>
                      <option value="security_deposit" className="dark:bg-[#151D2A]">Security Deposit Escrow</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-brand-muted dark:text-slate-400 font-medium mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#0D111A] border border-brand-border dark:border-[#263346] rounded-xl text-xs text-brand-charcoal dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-lime cursor-pointer"
                    >
                      <option value="UPI" className="dark:bg-[#151D2A]">UPI / Google Pay</option>
                      <option value="Cash" className="dark:bg-[#151D2A]">Cash</option>
                      <option value="Bank Transfer" className="dark:bg-[#151D2A]">Bank Transfer (IMPS/NEFT)</option>
                      <option value="Other" className="dark:bg-[#151D2A]">Cheque / Card</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form Action Buttons */}
          <div className="pt-4 border-t border-brand-border dark:border-[#1E2638] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold bg-[#F8FAFC] dark:bg-[#151D2A] hover:bg-black/5 dark:hover:bg-[#1E293B] text-brand-charcoal dark:text-slate-200 border border-brand-border dark:border-[#263346] rounded-xl transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold bg-brand-obsidian dark:bg-brand-lime text-white dark:text-brand-obsidian hover:bg-black dark:hover:bg-[#BCE600] rounded-xl transition-all shadow-xs"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check className="w-4 h-4 text-brand-lime dark:text-brand-obsidian" />
                  <span>
                    {mode === "add" ? "Admit Resident & Assign Bed" : "Save Changes"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
