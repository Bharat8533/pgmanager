"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  StaffMember,
  StaffRole,
  StaffStatus,
  EmploymentType,
  ShiftTiming,
  SalaryPaymentType,
  StaffDocument,
  DocumentType,
} from "@/types/staff";
import {
  X,
  User,
  Briefcase,
  IndianRupee,
  HeartPulse,
  FileText,
  GraduationCap,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Upload,
  Calendar,
  Building2,
  Clock,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyOption {
  id: string;
  name: string;
}

interface AddEditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffToEdit?: StaffMember | null;
  properties: PropertyOption[];
  nextEmployeeId: string;
  onSave: (
    staffData: Omit<StaffMember, "id" | "createdAt" | "updatedAt"> & {
      id?: string;
    }
  ) => void;
}

const ROLES: StaffRole[] = [
  "Manager",
  "Warden",
  "Security Guard",
  "Cook / Chef",
  "Housekeeping",
  "Maintenance Staff",
  "Receptionist",
  "Accountant",
  "Other",
];

const DEPARTMENTS = [
  "Management",
  "Property Operations",
  "Security & Safety",
  "Kitchen & Dining",
  "Housekeeping & Hygiene",
  "Maintenance & Utilities",
  "Front Desk & Support",
  "Accounts & Finance",
  "Administration",
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const DOCUMENT_TYPES: DocumentType[] = [
  "Aadhaar Card",
  "PAN Card",
  "Identity Proof",
  "Address Proof",
  "Employment Agreement",
  "Police Verification",
  "Other Document",
];

export function AddEditStaffModal({
  isOpen,
  onClose,
  staffToEdit,
  properties,
  nextEmployeeId,
  onSave,
}: AddEditStaffModalProps) {
  const isEditing = Boolean(staffToEdit);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    profilePhoto: "",
    dob: "",
    gender: "Male" as "Male" | "Female" | "Other",
    phone: "",
    alternatePhone: "",
    email: "",
    currentAddress: "",
    permanentAddress: "",
    bloodGroup: "",

    // Employment
    employeeId: nextEmployeeId,
    role: "Housekeeping" as StaffRole,
    customRoleTitle: "",
    department: "Housekeeping & Hygiene",
    propertyId: properties[0]?.id || "prop-1",
    propertyName: properties[0]?.name || "Main Residency",
    joiningDate: new Date().toISOString().split("T")[0],
    employmentType: "full_time" as EmploymentType,
    status: "active" as StaffStatus,
    shiftTiming: "morning" as ShiftTiming,
    customShiftDetails: "",
    responsibilities: "",
    reportingManager: "",

    // Salary & Payment
    monthlySalary: 18000,
    salaryPaymentType: "monthly" as SalaryPaymentType,
    salaryPaymentDate: 5,
    additionalAllowance: 0,
    bonus: 0,
    deductions: 0,
    salaryNotes: "",
    bankAccountHolder: "",
    bankName: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    bankUpiId: "",

    // Emergency Contact
    emergencyName: "",
    emergencyRelationship: "Spouse",
    emergencyPhone: "",
    emergencyAlternatePhone: "",
    emergencyAddress: "",

    // Documents
    documents: [] as StaffDocument[],

    // Additional
    previousExperience: "",
    previousEmployer: "",
    skillsInput: "",
    qualifications: "",
    notes: "",
    specialInstructions: "",
  });

  const [activeFormTab, setActiveFormTab] = useState<
    "personal" | "employment" | "salary" | "emergency" | "documents" | "additional"
  >("personal");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Sync state when editing or opening
  useEffect(() => {
    if (staffToEdit) {
      setFormData({
        name: staffToEdit.name,
        profilePhoto: staffToEdit.profilePhoto || "",
        dob: staffToEdit.dob || "",
        gender: staffToEdit.gender || "Male",
        phone: staffToEdit.phone,
        alternatePhone: staffToEdit.alternatePhone || "",
        email: staffToEdit.email || "",
        currentAddress: staffToEdit.currentAddress || "",
        permanentAddress: staffToEdit.permanentAddress || "",
        bloodGroup: staffToEdit.bloodGroup || "",

        employeeId: staffToEdit.employeeId,
        role: staffToEdit.role,
        customRoleTitle: staffToEdit.customRoleTitle || "",
        department: staffToEdit.department,
        propertyId: staffToEdit.propertyId,
        propertyName: staffToEdit.propertyName,
        joiningDate: staffToEdit.joiningDate,
        employmentType: staffToEdit.employmentType,
        status: staffToEdit.status,
        shiftTiming: staffToEdit.shiftTiming,
        customShiftDetails: staffToEdit.customShiftDetails || "",
        responsibilities: staffToEdit.responsibilities,
        reportingManager: staffToEdit.reportingManager || "",

        monthlySalary: staffToEdit.monthlySalary,
        salaryPaymentType: staffToEdit.salaryPaymentType,
        salaryPaymentDate: staffToEdit.salaryPaymentDate || 5,
        additionalAllowance: staffToEdit.additionalAllowance || 0,
        bonus: staffToEdit.bonus || 0,
        deductions: staffToEdit.deductions || 0,
        salaryNotes: staffToEdit.salaryNotes || "",
        bankAccountHolder: staffToEdit.bankDetails?.accountHolderName || "",
        bankName: staffToEdit.bankDetails?.bankName || "",
        bankAccountNumber: staffToEdit.bankDetails?.accountNumber || "",
        bankIfscCode: staffToEdit.bankDetails?.ifscCode || "",
        bankUpiId: staffToEdit.bankDetails?.upiId || "",

        emergencyName: staffToEdit.emergencyContact.name,
        emergencyRelationship: staffToEdit.emergencyContact.relationship,
        emergencyPhone: staffToEdit.emergencyContact.primaryPhone,
        emergencyAlternatePhone: staffToEdit.emergencyContact.alternatePhone || "",
        emergencyAddress: staffToEdit.emergencyContact.address || "",

        documents: [...staffToEdit.documents],

        previousExperience: staffToEdit.previousExperience || "",
        previousEmployer: staffToEdit.previousEmployer || "",
        skillsInput: staffToEdit.skills ? staffToEdit.skills.join(", ") : "",
        qualifications: staffToEdit.qualifications || "",
        notes: staffToEdit.notes || "",
        specialInstructions: staffToEdit.specialInstructions || "",
      });
      setIsDirty(false);
    } else {
      setFormData((prev) => ({
        ...prev,
        employeeId: nextEmployeeId,
        propertyId: properties[0]?.id || "prop-1",
        propertyName: properties[0]?.name || "Main Residency",
        joiningDate: new Date().toISOString().split("T")[0],
      }));
      setIsDirty(false);
    }
    setErrors({});
    setShowDiscardConfirm(false);
  }, [staffToEdit, nextEmployeeId, properties, isOpen]);

  // Net Salary preview
  const netSalaryPreview = useMemo(() => {
    const base = Number(formData.monthlySalary) || 0;
    const allow = Number(formData.additionalAllowance) || 0;
    const bon = Number(formData.bonus) || 0;
    const ded = Number(formData.deductions) || 0;
    return base + allow + bon - ded;
  }, [
    formData.monthlySalary,
    formData.additionalAllowance,
    formData.bonus,
    formData.deductions,
  ]);

  if (!isOpen) return null;

  const handleFieldChange = (field: string, value: any) => {
    setIsDirty(true);
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-update propertyName if propertyId changes
      if (field === "propertyId") {
        const selected = properties.find((p) => p.id === value);
        if (selected) updated.propertyName = selected.name;
      }
      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Personal
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Mobile Number is required";
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    // Employment
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.propertyId) newErrors.propertyId = "Property assignment is required";
    if (!formData.joiningDate) newErrors.joiningDate = "Joining Date is required";

    // Salary
    if (!formData.monthlySalary || Number(formData.monthlySalary) <= 0) {
      newErrors.monthlySalary = "Enter a valid positive monthly salary";
    }

    // Emergency Contact
    if (!formData.emergencyName.trim()) {
      newErrors.emergencyName = "Emergency contact name is required";
    }
    if (!formData.emergencyRelationship.trim()) {
      newErrors.emergencyRelationship = "Relationship is required";
    }
    if (!formData.emergencyPhone.trim()) {
      newErrors.emergencyPhone = "Emergency contact mobile is required";
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.emergencyPhone.trim())) {
      newErrors.emergencyPhone = "Enter a valid 10-digit emergency number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Focus on tab with error
      if (errors.name || errors.phone || errors.email) {
        setActiveFormTab("personal");
      } else if (errors.role || errors.propertyId || errors.joiningDate) {
        setActiveFormTab("employment");
      } else if (errors.monthlySalary) {
        setActiveFormTab("salary");
      } else if (errors.emergencyName || errors.emergencyRelationship || errors.emergencyPhone) {
        setActiveFormTab("emergency");
      }
      return;
    }

    // Format skills array
    const skillsArray = formData.skillsInput
      ? formData.skillsInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const finalStaffData: any = {
      ...(staffToEdit ? { id: staffToEdit.id } : {}),
      employeeId: formData.employeeId || nextEmployeeId,
      name: formData.name.trim(),
      profilePhoto: formData.profilePhoto.trim() || undefined,
      dob: formData.dob || undefined,
      gender: formData.gender,
      phone: formData.phone.trim(),
      alternatePhone: formData.alternatePhone.trim() || undefined,
      email: formData.email.trim() || undefined,
      currentAddress: formData.currentAddress.trim() || undefined,
      permanentAddress: formData.permanentAddress.trim() || undefined,
      bloodGroup: formData.bloodGroup || undefined,

      role: formData.role,
      customRoleTitle: formData.customRoleTitle.trim() || undefined,
      department: formData.department,
      propertyId: formData.propertyId,
      propertyName: formData.propertyName,
      joiningDate: formData.joiningDate,
      employmentType: formData.employmentType,
      status: formData.status,
      shiftTiming: formData.shiftTiming,
      customShiftDetails: formData.customShiftDetails.trim() || undefined,
      responsibilities: formData.responsibilities.trim() || "General maintenance and duties.",
      reportingManager: formData.reportingManager.trim() || undefined,

      monthlySalary: Number(formData.monthlySalary),
      salaryPaymentType: formData.salaryPaymentType,
      salaryPaymentDate: Number(formData.salaryPaymentDate) || 5,
      additionalAllowance: Number(formData.additionalAllowance) || 0,
      bonus: Number(formData.bonus) || 0,
      deductions: Number(formData.deductions) || 0,
      salaryNotes: formData.salaryNotes.trim() || undefined,

      bankDetails:
        formData.bankAccountNumber.trim() || formData.bankIfscCode.trim()
          ? {
              accountHolderName: formData.bankAccountHolder.trim() || formData.name.trim(),
              bankName: formData.bankName.trim() || "National Bank",
              accountNumber: formData.bankAccountNumber.trim(),
              ifscCode: formData.bankIfscCode.trim().toUpperCase(),
              upiId: formData.bankUpiId.trim() || undefined,
            }
          : undefined,

      emergencyContact: {
        name: formData.emergencyName.trim(),
        relationship: formData.emergencyRelationship.trim(),
        primaryPhone: formData.emergencyPhone.trim(),
        alternatePhone: formData.emergencyAlternatePhone.trim() || undefined,
        address: formData.emergencyAddress.trim() || undefined,
      },

      documents: formData.documents,

      previousExperience: formData.previousExperience.trim() || undefined,
      previousEmployer: formData.previousEmployer.trim() || undefined,
      skills: skillsArray.length > 0 ? skillsArray : undefined,
      qualifications: formData.qualifications.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      specialInstructions: formData.specialInstructions.trim() || undefined,
    };

    onSave(finalStaffData);
    setIsDirty(false);
    onClose();
  };

  const handleClose = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  // Mock add document
  const handleAddDocument = (type: DocumentType) => {
    const newDoc: StaffDocument = {
      id: `doc-${Date.now()}`,
      name: `${formData.name ? formData.name.replace(/\s+/g, "_") : "Staff"}_${type.replace(
        /\s+/g,
        "_"
      )}.pdf`,
      type,
      fileSize: "1.4 MB",
      uploadDate: new Date().toISOString().split("T")[0],
    };
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, newDoc],
    }));
    setIsDirty(true);
  };

  const handleRemoveDocument = (docId: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== docId),
    }));
    setIsDirty(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-obsidian/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#111622] rounded-3xl shadow-2xl border border-brand-border dark:border-[#222E42] flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-brand-border dark:border-[#1E2638] flex items-center justify-between shrink-0 bg-white dark:bg-[#111622]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-obsidian text-brand-lime flex items-center justify-center font-bold shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-brand-charcoal dark:text-white">
                {isEditing ? `Edit Staff: ${staffToEdit?.name}` : "Add New Staff Member"}
              </h2>
              <p className="text-xs text-brand-muted dark:text-slate-400">
                {isEditing
                  ? `Updating employee profile record (${staffToEdit?.employeeId})`
                  : `Assign responsibilities and register details (${formData.employeeId})`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl hover:bg-brand-offwhite dark:hover:bg-[#182232] text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="px-4 border-b border-brand-border dark:border-[#1E2638] bg-white dark:bg-[#0D111A] flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveFormTab("personal")}
            className={cn(
              "flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors",
              activeFormTab === "personal"
                ? "border-brand-obsidian dark:border-brand-lime text-brand-charcoal dark:text-brand-lime font-bold"
                : "border-transparent text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-slate-200"
            )}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Personal Info</span>
            {(errors.name || errors.phone) && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveFormTab("employment")}
            className={cn(
              "flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors",
              activeFormTab === "employment"
                ? "border-brand-obsidian dark:border-brand-lime text-brand-charcoal dark:text-brand-lime font-bold"
                : "border-transparent text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-slate-200"
            )}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>2. Employment</span>
            {(errors.role || errors.propertyId || errors.joiningDate) && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveFormTab("salary")}
            className={cn(
              "flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors",
              activeFormTab === "salary"
                ? "border-brand-obsidian dark:border-brand-lime text-brand-charcoal dark:text-brand-lime font-bold"
                : "border-transparent text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-slate-200"
            )}
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>3. Salary & Bank</span>
            {errors.monthlySalary && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveFormTab("emergency")}
            className={cn(
              "flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors",
              activeFormTab === "emergency"
                ? "border-brand-obsidian dark:border-brand-lime text-brand-charcoal dark:text-brand-lime font-bold"
                : "border-transparent text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-slate-200"
            )}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>4. Emergency</span>
            {(errors.emergencyName || errors.emergencyPhone) && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveFormTab("documents")}
            className={cn(
              "flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors",
              activeFormTab === "documents"
                ? "border-brand-obsidian dark:border-brand-lime text-brand-charcoal dark:text-brand-lime font-bold"
                : "border-transparent text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-slate-200"
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>5. Documents ({formData.documents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFormTab("additional")}
            className={cn(
              "flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors",
              activeFormTab === "additional"
                ? "border-brand-obsidian dark:border-brand-lime text-brand-charcoal dark:text-brand-lime font-bold"
                : "border-transparent text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-slate-200"
            )}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>6. Experience & Notes</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: PERSONAL INFORMATION */}
          {activeFormTab === "personal" && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    placeholder="e.g. Ramesh Kumar Verma"
                    className={cn(
                      "w-full text-xs py-2 px-3 rounded-xl border bg-white focus:outline-none focus:ring-1 transition-all",
                      errors.name
                        ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200"
                        : "border-brand-border focus:border-brand-charcoal"
                    )}
                  />
                  {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                </div>

                {/* Mobile Phone */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Primary Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className={cn(
                      "w-full text-xs py-2 px-3 rounded-xl border bg-white focus:outline-none focus:ring-1 transition-all",
                      errors.phone
                        ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200"
                        : "border-brand-border focus:border-brand-charcoal"
                    )}
                  />
                  {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
                </div>

                {/* Alternate Mobile */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Alternate Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={formData.alternatePhone}
                    onChange={(e) => handleFieldChange("alternatePhone", e.target.value)}
                    placeholder="+91 98111 22334"
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    placeholder="ramesh.verma@example.com"
                    className={cn(
                      "w-full text-xs py-2 px-3 rounded-xl border bg-white focus:outline-none focus:ring-1 transition-all",
                      errors.email
                        ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200"
                        : "border-brand-border focus:border-brand-charcoal"
                    )}
                  />
                  {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleFieldChange("dob", e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleFieldChange("gender", e.target.value as any)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => handleFieldChange("bloodGroup", e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  >
                    <option value="">Select Blood Group</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Profile Photo URL */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Profile Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.profilePhoto}
                    onChange={(e) => handleFieldChange("profilePhoto", e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  />
                </div>

                {/* Current Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Current Residential Address
                  </label>
                  <textarea
                    rows={2}
                    value={formData.currentAddress}
                    onChange={(e) => handleFieldChange("currentAddress", e.target.value)}
                    placeholder="Staff quarters or current local address..."
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal resize-none"
                  />
                </div>

                {/* Permanent Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Permanent Hometown Address
                  </label>
                  <textarea
                    rows={2}
                    value={formData.permanentAddress}
                    onChange={(e) => handleFieldChange("permanentAddress", e.target.value)}
                    placeholder="Permanent address as recorded in Aadhaar/ID..."
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMPLOYMENT DETAILS */}
          {activeFormTab === "employment" && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Employee ID (Auto / Read-only or editable) */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => handleFieldChange("employeeId", e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-brand-offwhite/60 font-mono font-semibold text-brand-charcoal focus:outline-none focus:border-brand-charcoal"
                  />
                </div>

                {/* Property Assignment */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Assigned Property <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.propertyId}
                    onChange={(e) => handleFieldChange("propertyId", e.target.value)}
                    className={cn(
                      "w-full text-xs py-2 px-3 rounded-xl border bg-white focus:outline-none focus:ring-1 transition-all",
                      errors.propertyId
                        ? "border-rose-300 focus:border-rose-500"
                        : "border-brand-border focus:border-brand-charcoal"
                    )}
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {errors.propertyId && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.propertyId}</p>
                  )}
                </div>

                {/* Role / Designation */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Job Role / Designation <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleFieldChange("role", e.target.value as StaffRole)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Role Title */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Custom Designation Title
                  </label>
                  <input
                    type="text"
                    value={formData.customRoleTitle}
                    onChange={(e) => handleFieldChange("customRoleTitle", e.target.value)}
                    placeholder="e.g. Senior Warden / Head Chef"
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleFieldChange("department", e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Joining Date */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Joining Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.joiningDate}
                    onChange={(e) => handleFieldChange("joiningDate", e.target.value)}
                    className={cn(
                      "w-full text-xs py-2 px-3 rounded-xl border bg-white focus:outline-none focus:ring-1 transition-all",
                      errors.joiningDate
                        ? "border-rose-300 focus:border-rose-500"
                        : "border-brand-border focus:border-brand-charcoal"
                    )}
                  />
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Employment Type
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) =>
                      handleFieldChange("employmentType", e.target.value as EmploymentType)
                    }
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  >
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contractual</option>
                    <option value="temporary">Temporary</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Employment Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFieldChange("status", e.target.value as StaffStatus)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  >
                    <option value="active">Active</option>
                    <option value="on_leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Shift Timing */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Shift Timing
                  </label>
                  <select
                    value={formData.shiftTiming}
                    onChange={(e) =>
                      handleFieldChange("shiftTiming", e.target.value as ShiftTiming)
                    }
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  >
                    <option value="morning">Morning (7:00 AM – 3:30 PM)</option>
                    <option value="evening">Evening (3:00 PM – 11:30 PM)</option>
                    <option value="night">Night (11:00 PM – 7:30 AM)</option>
                    <option value="rotational">Rotational Shifts</option>
                    <option value="custom">Custom Timing</option>
                  </select>
                </div>

                {/* Reporting Manager */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Reporting Manager
                  </label>
                  <input
                    type="text"
                    value={formData.reportingManager}
                    onChange={(e) => handleFieldChange("reportingManager", e.target.value)}
                    placeholder="e.g. Vikramaditya Rao (Owner)"
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  />
                </div>

                {/* Responsibilities */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Key Responsibilities & Scope of Work
                  </label>
                  <textarea
                    rows={3}
                    value={formData.responsibilities}
                    onChange={(e) => handleFieldChange("responsibilities", e.target.value)}
                    placeholder="Detail the daily duties, cleaning areas, meal shifts, gate security protocols..."
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SALARY & PAYMENT DETAILS */}
          {activeFormTab === "salary" && (
            <div className="space-y-4 animate-in fade-in duration-100">
              {/* Dynamic Net Salary Preview Card */}
              <div className="bg-brand-obsidian text-white p-4 rounded-2xl flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-white/70 font-semibold block uppercase tracking-wider">
                    Calculated Net Monthly Salary
                  </span>
                  <div className="text-2xl font-black text-white flex items-center gap-1 mt-0.5">
                    <span>₹{netSalaryPreview.toLocaleString("en-IN")}</span>
                    <span className="text-xs font-normal text-white/60">/ month</span>
                  </div>
                </div>
                <div className="text-right text-[11px] text-white/60">
                  <span>Base: ₹{Number(formData.monthlySalary || 0).toLocaleString("en-IN")}</span>
                  <br />
                  <span>
                    Allowances: +₹{Number(formData.additionalAllowance || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Monthly Base Salary */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Base Monthly Salary (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.monthlySalary}
                    onChange={(e) => handleFieldChange("monthlySalary", Number(e.target.value))}
                    className={cn(
                      "w-full text-xs py-2 px-3 rounded-xl border bg-white focus:outline-none focus:ring-1 transition-all",
                      errors.monthlySalary
                        ? "border-rose-300 focus:border-rose-500"
                        : "border-brand-border focus:border-brand-charcoal"
                    )}
                  />
                  {errors.monthlySalary && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.monthlySalary}</p>
                  )}
                </div>

                {/* Payment Type */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Payment Cycle
                  </label>
                  <select
                    value={formData.salaryPaymentType}
                    onChange={(e) =>
                      handleFieldChange("salaryPaymentType", e.target.value as SalaryPaymentType)
                    }
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>

                {/* Additional Allowance */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Additional Allowance (Food/Travel) (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.additionalAllowance}
                    onChange={(e) =>
                      handleFieldChange("additionalAllowance", Number(e.target.value))
                    }
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  />
                </div>

                {/* Bonus */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Performance Bonus / Overtime (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.bonus}
                    onChange={(e) => handleFieldChange("bonus", Number(e.target.value))}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  />
                </div>

                {/* Deductions */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Monthly Deductions (PF/Advance) (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.deductions}
                    onChange={(e) => handleFieldChange("deductions", Number(e.target.value))}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  />
                </div>

                {/* Payment Date */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Monthly Payment Due Day
                  </label>
                  <select
                    value={formData.salaryPaymentDate}
                    onChange={(e) =>
                      handleFieldChange("salaryPaymentDate", Number(e.target.value))
                    }
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  >
                    <option value={1}>1st of month</option>
                    <option value={5}>5th of month</option>
                    <option value={7}>7th of month</option>
                    <option value={10}>10th of month</option>
                    <option value={15}>15th of month</option>
                  </select>
                </div>
              </div>

              {/* Bank Details Sub-section */}
              <div className="pt-3 border-t border-brand-border">
                <h3 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-brand-muted" />
                  Bank Account Information (Optional)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={formData.bankAccountHolder}
                      onChange={(e) => handleFieldChange("bankAccountHolder", e.target.value)}
                      placeholder={formData.name || "Account holder name"}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => handleFieldChange("bankName", e.target.value)}
                      placeholder="e.g. State Bank of India"
                      className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={formData.bankAccountNumber}
                      onChange={(e) => handleFieldChange("bankAccountNumber", e.target.value)}
                      placeholder="e.g. 501004928172"
                      className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white font-mono focus:outline-none focus:border-brand-charcoal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={formData.bankIfscCode}
                      onChange={(e) =>
                        handleFieldChange("bankIfscCode", e.target.value.toUpperCase())
                      }
                      placeholder="e.g. SBIN0004210"
                      className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white font-mono uppercase focus:outline-none focus:border-brand-charcoal"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                      UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      value={formData.bankUpiId}
                      onChange={(e) => handleFieldChange("bankUpiId", e.target.value)}
                      placeholder="e.g. ramesh@okaxis"
                      className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white font-mono focus:outline-none focus:border-brand-charcoal"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EMERGENCY CONTACT DETAILS */}
          {activeFormTab === "emergency" && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  Emergency contact information is vital for prompt reachout during sudden medical or duty emergencies.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Emergency Contact Name */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Contact Person Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.emergencyName}
                    onChange={(e) => handleFieldChange("emergencyName", e.target.value)}
                    placeholder="e.g. Sunita Verma"
                    className={cn(
                      "w-full text-xs py-2 px-3 rounded-xl border bg-white focus:outline-none focus:ring-1 transition-all",
                      errors.emergencyName
                        ? "border-rose-300 focus:border-rose-500"
                        : "border-brand-border focus:border-brand-charcoal"
                    )}
                  />
                  {errors.emergencyName && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.emergencyName}</p>
                  )}
                </div>

                {/* Relationship */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Relationship <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.emergencyRelationship}
                    onChange={(e) => handleFieldChange("emergencyRelationship", e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Relative">Relative</option>
                    <option value="Friend">Friend / Village Neighbor</option>
                  </select>
                </div>

                {/* Emergency Mobile */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Emergency Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.emergencyPhone}
                    onChange={(e) => handleFieldChange("emergencyPhone", e.target.value)}
                    placeholder="+91 98222 33445"
                    className={cn(
                      "w-full text-xs py-2 px-3 rounded-xl border bg-white focus:outline-none focus:ring-1 transition-all",
                      errors.emergencyPhone
                        ? "border-rose-300 focus:border-rose-500"
                        : "border-brand-border focus:border-brand-charcoal"
                    )}
                  />
                  {errors.emergencyPhone && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.emergencyPhone}</p>
                  )}
                </div>

                {/* Alternate Emergency Phone */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Alternate Emergency Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyAlternatePhone}
                    onChange={(e) =>
                      handleFieldChange("emergencyAlternatePhone", e.target.value)
                    }
                    placeholder="+91 98444 55667"
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  />
                </div>

                {/* Emergency Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Emergency Contact Residential Address
                  </label>
                  <textarea
                    rows={2}
                    value={formData.emergencyAddress}
                    onChange={(e) => handleFieldChange("emergencyAddress", e.target.value)}
                    placeholder="Village, Tehsil, District, PIN code..."
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DOCUMENTS & KYC */}
          {activeFormTab === "documents" && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                    Staff Identity Proofs & Legal Documents
                  </h3>
                  <p className="text-[11px] text-brand-muted mt-0.5">
                    Attach identity verification, police clearance, and employment contracts.
                  </p>
                </div>
              </div>

              {/* Upload Dropdown Action */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-brand-offwhite/50 border border-brand-border rounded-2xl">
                <span className="text-xs font-semibold text-brand-charcoal">Quick Add:</span>
                {DOCUMENT_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleAddDocument(type)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-neutral-100 text-brand-charcoal border border-brand-border rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3 h-3 text-brand-muted" />
                    {type}
                  </button>
                ))}
              </div>

              {/* Document List */}
              <div className="space-y-2">
                {formData.documents.length === 0 ? (
                  <div className="p-6 text-center bg-brand-offwhite/30 rounded-2xl border border-dashed border-brand-border">
                    <Upload className="w-8 h-8 text-brand-muted mx-auto mb-2" />
                    <p className="text-xs font-medium text-brand-charcoal">
                      No documents attached yet
                    </p>
                    <p className="text-[11px] text-brand-muted mt-0.5">
                      Click any of the document types above to attach KYC verification.
                    </p>
                  </div>
                ) : (
                  formData.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-brand-border bg-white"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-brand-muted shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-brand-charcoal truncate">
                            {doc.name}
                          </p>
                          <span className="text-[11px] text-brand-muted">
                            {doc.type} • {doc.fileSize}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(doc.id)}
                        className="p-1 rounded-lg hover:bg-rose-50 text-brand-muted hover:text-rose-600 transition-colors"
                        title="Remove Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: EXPERIENCE & NOTES */}
          {activeFormTab === "additional" && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Previous Experience */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Total Prior Experience
                  </label>
                  <input
                    type="text"
                    value={formData.previousExperience}
                    onChange={(e) => handleFieldChange("previousExperience", e.target.value)}
                    placeholder="e.g. 4 Years in hospitality PG"
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  />
                </div>

                {/* Previous Employer */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Previous Employer / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.previousEmployer}
                    onChange={(e) => handleFieldChange("previousEmployer", e.target.value)}
                    placeholder="e.g. Oxford Boys Hostel, Kota"
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  />
                </div>

                {/* Qualifications */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Educational Qualifications & Certifications
                  </label>
                  <input
                    type="text"
                    value={formData.qualifications}
                    onChange={(e) => handleFieldChange("qualifications", e.target.value)}
                    placeholder="e.g. 10th Pass, Fire Safety Certified, Electrician License"
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  />
                </div>

                {/* Skills (comma separated) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Skills & Key Competencies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.skillsInput}
                    onChange={(e) => handleFieldChange("skillsInput", e.target.value)}
                    placeholder="e.g. Deep Cleaning, Plumbing, CCTV Monitoring, North Indian Cooking"
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal"
                  />
                </div>

                {/* Administrative Notes */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Internal Owner Notes
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => handleFieldChange("notes", e.target.value)}
                    placeholder="Internal reference notes regarding interview or verification..."
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal resize-none"
                  />
                </div>

                {/* Special Instructions */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Special Instructions / Operational Directives
                  </label>
                  <textarea
                    rows={2}
                    value={formData.specialInstructions}
                    onChange={(e) => handleFieldChange("specialInstructions", e.target.value)}
                    placeholder="e.g. Gate closes strictly at 10:30 PM. Weekly water pump inspection on Monday morning."
                    className="w-full text-xs py-2 px-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-charcoal resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer (Sticky) */}
          <div className="pt-4 border-t border-brand-border dark:border-[#1E2638] flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sticky bottom-0 bg-white dark:bg-[#111622]">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-brand-border dark:border-[#263346] bg-brand-offwhite dark:bg-[#182232] hover:bg-neutral-200 dark:hover:bg-[#222E42] text-brand-charcoal dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <div className="w-full sm:w-auto flex items-center justify-end gap-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-obsidian text-brand-lime hover:bg-black dark:bg-brand-lime dark:text-[#0A0D12] dark:hover:bg-[#b8e85c] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEditing ? "Save Staff Changes" : "Register Staff Member"}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Unsaved Changes Discard Confirmation Dialog */}
        {showDiscardConfirm && (
          <div className="absolute inset-0 z-60 bg-brand-obsidian/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#151D2A] rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-brand-border dark:border-[#263346] text-center">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-brand-charcoal dark:text-white mb-1">
                Discard Unsaved Changes?
              </h3>
              <p className="text-xs text-brand-muted dark:text-slate-400 mb-4">
                You have modified information on this staff form. Discarding will lose all unsaved inputs.
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDiscardConfirm(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-brand-border dark:border-[#263346] bg-white dark:bg-[#182232] hover:bg-brand-offwhite dark:hover:bg-[#222E42] text-brand-charcoal dark:text-slate-200"
                >
                  Keep Editing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDiscardConfirm(false);
                    setIsDirty(false);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
