"use client";

import React, { useState, useEffect } from "react";
import { Room, RoomType, RoomStatus } from "@/types/room";
import { useRoom } from "@/contexts/RoomContext";
import { getRoomAmenityIcon } from "@/components/owner/rooms/RoomCard";
import {
  X,
  Plus,
  Upload,
  Check,
  AlertCircle,
  Building2,
  BedDouble,
  IndianRupee,
  Sparkles,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomToEdit?: Room | null;
  onSuccessToast?: (msg: string) => void;
}

const STANDARD_AMENITIES = [
  "Air Conditioning",
  "Attached Bathroom",
  "Balcony",
  "Wardrobe",
  "Study Table",
  "Fan",
  "Refrigerator",
  "TV",
  "High-speed Wi-Fi",
  "Geyser",
  "Power Backup",
  "Housekeeping",
];

const ROOM_TYPES: { type: RoomType; defaultBeds: number }[] = [
  { type: "Single Sharing", defaultBeds: 1 },
  { type: "Double Sharing", defaultBeds: 2 },
  { type: "Triple Sharing", defaultBeds: 3 },
  { type: "Four Sharing", defaultBeds: 4 },
  { type: "Custom", defaultBeds: 5 },
];

// Presets covering multi-story and high-rise buildings (up to 20 floors)
const PRESET_FLOORS = [
  "Ground Floor",
  "1st Floor",
  "2nd Floor",
  "3rd Floor",
  "4th Floor",
  "5th Floor"
];

// Smart floor auto-detection from room numbers (e.g. 1002 -> 10th Floor, 804 -> 8th Floor, G-01 -> Ground Floor)
function detectFloorFromRoomNumber(num: string): string | null {
  const clean = num.trim().toUpperCase();
  if (!clean) return null;
  if (clean.startsWith("B") || clean.startsWith("BASE")) return "Basement";
  if (clean.startsWith("LG")) return "Lower Ground";
  if (clean.startsWith("G") || clean.startsWith("GR")) return "Ground Floor";
  if (clean.startsWith("T") || clean.startsWith("TER") || clean.startsWith("PH")) return "Rooftop / Terrace";

  const digits = clean.replace(/\D/g, "");
  if (digits.length >= 4) {
    // e.g. 1001 to 1099 -> 10th Floor, 1202 -> 12th Floor
    const floorNum = parseInt(digits.slice(0, digits.length - 2), 10);
    if (floorNum >= 1 && floorNum <= 50) {
      const suffix = floorNum === 1 ? "st" : floorNum === 2 ? "nd" : floorNum === 3 ? "rd" : "th";
      return `${floorNum}${suffix} Floor`;
    }
  } else if (digits.length === 3) {
    // e.g. 101 to 199 -> 1st Floor, 804 -> 8th Floor
    const floorNum = parseInt(digits[0], 10);
    if (floorNum >= 1 && floorNum <= 9) {
      const suffix = floorNum === 1 ? "st" : floorNum === 2 ? "nd" : floorNum === 3 ? "rd" : "th";
      return `${floorNum}${suffix} Floor`;
    }
  }
  return null;
}

export function RoomFormModal({
  isOpen,
  onClose,
  roomToEdit,
  onSuccessToast,
}: RoomFormModalProps) {
  const { addRoom, updateRoom, getBedsByRoomId } = useRoom();

  const isEdit = !!roomToEdit;

  // Form State
  const [roomNumber, setRoomNumber] = useState("");
  const [floor, setFloor] = useState("1st Floor");
  const [isCustomFloor, setIsCustomFloor] = useState(false);
  const [customFloorInput, setCustomFloorInput] = useState("");
  const [autoDetectedFloor, setAutoDetectedFloor] = useState<string | null>(null);

  const [roomType, setRoomType] = useState<RoomType>("Double Sharing");
  const [totalBeds, setTotalBeds] = useState(2);
  const [defaultMonthlyRent, setDefaultMonthlyRent] = useState(14000);
  const [roomStatus, setRoomStatus] = useState<RoomStatus>("available");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string>("");
  const [amenities, setAmenities] = useState<string[]>([
    "Air Conditioning",
    "Attached Bathroom",
    "Wardrobe",
    "High-speed Wi-Fi",
  ]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When roomToEdit changes or modal opens
  useEffect(() => {
    if (roomToEdit) {
      setRoomNumber(roomToEdit.roomNumber);
      const isPreset = PRESET_FLOORS.includes(roomToEdit.floor);
      if (isPreset) {
        setFloor(roomToEdit.floor);
        setIsCustomFloor(false);
        setCustomFloorInput("");
      } else {
        setFloor("custom");
        setIsCustomFloor(true);
        setCustomFloorInput(roomToEdit.floor);
      }
      setRoomType(roomToEdit.roomType);
      setTotalBeds(roomToEdit.totalBeds);
      setDefaultMonthlyRent(roomToEdit.defaultMonthlyRent);
      setRoomStatus(roomToEdit.roomStatus);
      setDescription(roomToEdit.description || "");
      setImage(roomToEdit.image || "");
      setAmenities(roomToEdit.amenities || []);
    } else {
      setRoomNumber("");
      setFloor("1st Floor");
      setIsCustomFloor(false);
      setCustomFloorInput("");
      setAutoDetectedFloor(null);
      setRoomType("Double Sharing");
      setTotalBeds(2);
      setDefaultMonthlyRent(14000);
      setRoomStatus("available");
      setDescription("");
      setImage("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80");
      setAmenities([
        "Air Conditioning",
        "Attached Bathroom",
        "Wardrobe",
        "High-speed Wi-Fi",
      ]);
    }
    setErrorMsg(null);
  }, [roomToEdit, isOpen]);

  // Handle Room Number change with smart floor auto-detection
  const handleRoomNumberChange = (val: string) => {
    setRoomNumber(val);
    if (!isEdit && !isCustomFloor) {
      const detected = detectFloorFromRoomNumber(val);
      if (detected) {
        setAutoDetectedFloor(detected);
        if (PRESET_FLOORS.includes(detected)) {
          setFloor(detected);
        } else {
          setIsCustomFloor(true);
          setCustomFloorInput(detected);
        }
      } else {
        setAutoDetectedFloor(null);
      }
    }
  };

  // Handle Room Type change auto-setting totalBeds
  const handleRoomTypeChange = (newType: RoomType) => {
    setRoomType(newType);
    const found = ROOM_TYPES.find((r) => r.type === newType);
    if (found && newType !== "Custom") {
      setTotalBeds(found.defaultBeds);
    }
  };

  // Toggle Amenity
  const toggleAmenity = (name: string) => {
    setAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  // Add Custom Amenity
  const handleAddCustomAmenity = () => {
    const trimmed = customAmenity.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities((prev) => [...prev, trimmed]);
      setCustomAmenity("");
    }
  };

  // Image Upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file (PNG, JPG, or WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 5MB. Please choose a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Safety rule: Calculate min allowed beds if editing an existing room
  const currentBeds = isEdit && roomToEdit ? getBedsByRoomId(roomToEdit.id) : [];
  const currentOccupiedBeds = currentBeds.filter((b) => b.status === "occupied").length;
  const currentReservedBeds = currentBeds.filter((b) => b.status === "reserved").length;
  const minAllowedBeds = currentOccupiedBeds + currentReservedBeds;

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedNumber = roomNumber.trim();
    if (!trimmedNumber) {
      setErrorMsg("Room number is required.");
      return;
    }

    const resolvedFloor = isCustomFloor ? customFloorInput.trim() : floor;
    if (!resolvedFloor) {
      setErrorMsg("Please specify or enter a valid floor.");
      return;
    }

    if (totalBeds < 1) {
      setErrorMsg("Total beds must be at least 1.");
      return;
    }

    if (isEdit && totalBeds < minAllowedBeds) {
      setErrorMsg(
        `Cannot reduce bed capacity to ${totalBeds}. This room has ${currentOccupiedBeds} occupied and ${currentReservedBeds} reserved bed(s). Minimum capacity is ${minAllowedBeds}.`
      );
      return;
    }

    if (defaultMonthlyRent < 0) {
      setErrorMsg("Monthly rent cannot be negative.");
      return;
    }

    setIsSubmitting(true);

    if (isEdit && roomToEdit) {
      const res = updateRoom(roomToEdit.id, {
        roomNumber: trimmedNumber,
        floor: resolvedFloor,
        roomType,
        totalBeds: Number(totalBeds),
        defaultMonthlyRent: Number(defaultMonthlyRent),
        roomStatus,
        description,
        image,
        amenities,
      });

      setIsSubmitting(false);

      if (!res.success) {
        setErrorMsg(res.error || "Failed to update room.");
        return;
      }

      if (onSuccessToast) {
        onSuccessToast(`Room ${trimmedNumber} successfully updated.`);
      }
      onClose();
    } else {
      const res = addRoom({
        roomNumber: trimmedNumber,
        floor: resolvedFloor,
        roomType,
        totalBeds: Number(totalBeds),
        defaultMonthlyRent: Number(defaultMonthlyRent),
        roomStatus,
        description,
        image,
        amenities,
      });

      setIsSubmitting(false);

      if (!res.success) {
        setErrorMsg(res.error || "Failed to create room.");
        return;
      }

      if (onSuccessToast) {
        onSuccessToast(`Room ${trimmedNumber} (${roomType}) on ${resolvedFloor} successfully added.`);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-white dark:bg-[#111622] rounded-3xl border border-brand-border dark:border-[#222E42] shadow-2xl overflow-y-auto z-10 animate-scaleUp no-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-[#111622]/95 backdrop-blur-md px-5 sm:px-6 py-4 border-b border-brand-border dark:border-[#1E2638] flex items-center justify-between z-20">
          <div>
            <h3 className="text-base sm:text-lg font-black text-brand-charcoal dark:text-white">
              {isEdit ? `Edit Room ${roomToEdit?.roomNumber}` : "Add New Room"}
            </h3>
            <p className="text-xs text-brand-muted dark:text-slate-400 mt-0.5">
              {isEdit
                ? "Update room specifications, sharing capacity, pricing, and facilities."
                : "Add a room to any floor (1st, 10th story, custom wing) and configure capacity."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1E2638] hover:bg-slate-200 dark:hover:bg-[#253248] text-brand-charcoal dark:text-white flex items-center justify-center transition-colors shadow-2xs"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 sm:space-y-5">
          {/* Validation Error Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/80 dark:border-rose-500/30 flex items-start gap-2.5 text-rose-800 dark:text-rose-300 text-xs animate-fadeIn shadow-2xs">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* Bed Capacity Safety Rule Warning (Edit Mode) */}
          {isEdit && minAllowedBeds > 0 && (
            <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2 shadow-2xs">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Bed Capacity Safety:</strong> This room has{" "}
                <strong>{currentOccupiedBeds} occupied</strong> and{" "}
                <strong>{currentReservedBeds} reserved</strong> bed(s). Total bed capacity cannot be reduced below{" "}
                <span className="font-extrabold">{minAllowedBeds}</span>.
              </div>
            </div>
          )}

          {/* Basic Room Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {/* Room Number */}
            <div>
              <label className="text-xs font-bold text-brand-charcoal dark:text-white block mb-1">
                Room Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={roomNumber}
                onChange={(e) => handleRoomNumberChange(e.target.value)}
                placeholder="e.g. 101, 1002, 1004"
                className="w-full h-10 px-3 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white dark:bg-[#151D2A] dark:hover:bg-[#1A2332] dark:focus:bg-[#151D2A] rounded-xl border border-brand-border/80 dark:border-[#263346] focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 dark:focus:ring-brand-lime/20 focus:border-brand-obsidian dark:focus:border-brand-lime font-semibold text-brand-charcoal dark:text-white"
              />
              <span className="text-[10px] text-brand-muted dark:text-slate-400 mt-0.5 block">
                Type room number (e.g. 1002 auto-detects 10th Floor)
              </span>
            </div>

            {/* Floor Selection / Custom Floor Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-brand-charcoal dark:text-white">
                  Floor <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomFloor(!isCustomFloor);
                    if (!isCustomFloor && !customFloorInput) {
                      setCustomFloorInput(floor !== "custom" ? floor : "10th Floor");
                    }
                  }}
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                >
                  {isCustomFloor ? "Choose from Presets" : "+ Custom / 10th+ Floor"}
                </button>
              </div>

              {isCustomFloor ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    required
                    value={customFloorInput}
                    onChange={(e) => setCustomFloorInput(e.target.value)}
                    placeholder="e.g. 10th Floor, Tower B - 8th Floor, Mezzanine"
                    className="w-full h-10 px-3 text-xs bg-white dark:bg-[#151D2A] rounded-xl border-2 border-brand-obsidian dark:border-brand-lime focus:outline-none focus:ring-2 focus:ring-brand-lime font-bold text-brand-charcoal dark:text-white"
                  />
                  <span className="text-[10px] text-brand-muted dark:text-slate-400 block">
                    Supports any story building (e.g. 10th Floor, 15th Floor, Tower 2)
                  </span>
                </div>
              ) : (
                <select
                  value={floor}
                  onChange={(e) => {
                    if (e.target.value === "custom") {
                      setIsCustomFloor(true);
                      setCustomFloorInput("10th Floor");
                    } else {
                      setFloor(e.target.value);
                    }
                  }}
                  className="w-full h-10 px-3 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white dark:bg-[#151D2A] dark:hover:bg-[#1A2332] dark:focus:bg-[#151D2A] rounded-xl border border-brand-border/80 dark:border-[#263346] focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 dark:focus:ring-brand-lime/20 font-semibold text-brand-charcoal dark:text-white cursor-pointer"
                >
                  {PRESET_FLOORS.map((f) => (
                    <option key={f} value={f} className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">
                      {f}
                    </option>
                  ))}
                  <option value="custom" className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">✍️ + Type Custom Floor Name...</option>
                </select>
              )}

              {autoDetectedFloor && !isCustomFloor && (
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Auto-detected {autoDetectedFloor} from room number</span>
                </div>
              )}
            </div>

            {/* Room Type */}
            <div>
              <label className="text-xs font-bold text-brand-charcoal dark:text-white block mb-1">
                Room Sharing Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={roomType}
                onChange={(e) => handleRoomTypeChange(e.target.value as RoomType)}
                className="w-full h-10 px-3 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white dark:bg-[#151D2A] dark:hover:bg-[#1A2332] dark:focus:bg-[#151D2A] rounded-xl border border-brand-border/80 dark:border-[#263346] focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 dark:focus:ring-brand-lime/20 font-semibold text-brand-charcoal dark:text-white cursor-pointer"
              >
                {ROOM_TYPES.map((rt) => (
                  <option key={rt.type} value={rt.type} className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">
                    {rt.type}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Beds */}
            <div>
              <label className="text-xs font-bold text-brand-charcoal dark:text-white block mb-1">
                Total Beds <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={minAllowedBeds > 0 ? minAllowedBeds : 1}
                max={12}
                value={totalBeds}
                onChange={(e) => setTotalBeds(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full h-10 px-3 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white dark:bg-[#151D2A] dark:hover:bg-[#1A2332] dark:focus:bg-[#151D2A] rounded-xl border border-brand-border/80 dark:border-[#263346] focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 dark:focus:ring-brand-lime/20 font-semibold text-brand-charcoal dark:text-white"
              />
              <span className="text-[10px] text-brand-muted dark:text-slate-400 mt-0.5 block">
                {roomType === "Custom"
                  ? "Specify custom bed count"
                  : `Default for ${roomType}`}
              </span>
            </div>

            {/* Default Monthly Rent Per Bed */}
            <div>
              <label className="text-xs font-bold text-brand-charcoal dark:text-white block mb-1">
                Default Monthly Rent Per Bed (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted dark:text-slate-400 text-xs font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min={0}
                  step={500}
                  required
                  value={defaultMonthlyRent}
                  onChange={(e) => setDefaultMonthlyRent(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full h-10 pl-7 pr-3 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white dark:bg-[#151D2A] dark:hover:bg-[#1A2332] dark:focus:bg-[#151D2A] rounded-xl border border-brand-border/80 dark:border-[#263346] focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 dark:focus:ring-brand-lime/20 font-semibold text-brand-charcoal dark:text-white"
                />
              </div>
            </div>

            {/* Initial Room Status */}
            <div>
              <label className="text-xs font-bold text-brand-charcoal dark:text-white block mb-1">
                Initial Room Status
              </label>
              <select
                value={roomStatus}
                onChange={(e) => setRoomStatus(e.target.value as RoomStatus)}
                className="w-full h-10 px-3 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white dark:bg-[#151D2A] dark:hover:bg-[#1A2332] dark:focus:bg-[#151D2A] rounded-xl border border-brand-border/80 dark:border-[#263346] focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 dark:focus:ring-brand-lime/20 font-semibold text-brand-charcoal dark:text-white cursor-pointer"
              >
                <option value="available" className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">Available for Bookings</option>
                <option value="under_maintenance" className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">Under Maintenance</option>
                <option value="inactive" className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">Inactive</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-brand-charcoal dark:text-white block mb-1">
              Room Description & Special Features
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 10th floor corner room with city skyline view, dedicated work desks, balcony access, and inverter backup..."
              className="w-full p-3 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white dark:bg-[#151D2A] dark:hover:bg-[#1A2332] dark:focus:bg-[#151D2A] rounded-xl border border-brand-border/80 dark:border-[#263346] focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 dark:focus:ring-brand-lime/20 text-brand-charcoal dark:text-white resize-none placeholder:text-brand-muted/70 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Amenities Selector */}
          <div>
            <label className="text-xs font-bold text-brand-charcoal dark:text-white block mb-2">
              Room Amenities ({amenities.length} selected)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STANDARD_AMENITIES.map((name) => {
                const isSelected = amenities.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleAmenity(name)}
                    className={cn(
                      "flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left",
                      isSelected
                        ? "bg-brand-obsidian dark:bg-[#1E2638] text-white border-brand-obsidian dark:border-brand-lime/40 shadow-2xs font-semibold"
                        : "bg-slate-50/80 hover:bg-slate-100/80 dark:bg-[#151D2A] dark:hover:bg-[#1A2332] border-brand-border/80 dark:border-[#263346] text-brand-charcoal dark:text-slate-200"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 text-[10px]",
                        isSelected ? "bg-brand-lime text-brand-obsidian" : "bg-white dark:bg-[#111622] border border-brand-border dark:border-[#263346]"
                      )}
                    >
                      {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : null}
                    </div>
                    <span className="truncate">{name}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Amenity Input */}
            <div className="flex items-center gap-2 mt-2.5">
              <input
                type="text"
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomAmenity();
                  }
                }}
                placeholder="+ Add custom facility (e.g. Microwave, Smart Door Lock)..."
                className="flex-1 h-9 px-3 text-xs bg-slate-50 dark:bg-[#151D2A] rounded-xl border border-brand-border/80 dark:border-[#263346] focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 dark:focus:ring-brand-lime/20 text-brand-charcoal dark:text-white placeholder:text-brand-muted/70 dark:placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={handleAddCustomAmenity}
                className="h-9 px-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#1E2638] dark:hover:bg-[#253248] text-brand-charcoal dark:text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
              >
                Add
              </button>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-brand-border dark:border-[#1E2638] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E2638] rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-lime hover:bg-brand-lime-hover text-brand-obsidian font-extrabold text-xs shadow-xs hover:shadow-sm active:scale-98 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : isEdit ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Update Room</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add Room to Inventory</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
