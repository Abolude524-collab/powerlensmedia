"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "../lib/analytics";

interface InteractiveBookingProps {
  contactEmail: string;
  onSuccess?: () => void;
}

export default function InteractiveBooking({ contactEmail, onSuccess }: InteractiveBookingProps) {
  // Helper: Check if date is Saturday (6) or Sunday (0)
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // Helper: Check if date is strictly before today (midnight)
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    return target < today;
  };

  // Helper: Get first available weekday starting from today
  const getFirstAvailableWeekday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let d = new Date(today);
    while (isWeekend(d)) {
      d.setDate(d.getDate() + 1);
    }
    return d;
  };

  // Helper: Get previous available weekday
  const getPrevWeekday = (from: Date) => {
    const prev = new Date(from);
    prev.setDate(prev.getDate() - 1);
    while (isWeekend(prev)) {
      prev.setDate(prev.getDate() - 1);
    }
    return prev;
  };

  // Helper: Get next available weekday
  const getNextWeekday = (from: Date) => {
    const next = new Date(from);
    next.setDate(next.getDate() + 1);
    while (isWeekend(next)) {
      next.setDate(next.getDate() + 1);
    }
    return next;
  };

  const firstAvailable = getFirstAvailableWeekday();

  // State
  const [currentDate, setCurrentDate] = useState<Date>(firstAvailable);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<"slot" | "details">("slot");

  // Client Details Form State
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Categorized Time Slots
  const morningSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];
  const afternoonSlots = ["01:30 PM", "03:00 PM", "04:30 PM", "06:00 PM"];

  // Generate Next 14 Calendar Days for the scrollable date chip strip
  const upcomingDays = Array.from({ length: 14 }).map((_, index) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(today);
    d.setDate(d.getDate() + index);
    return d;
  });

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Responsive Date Formats
  const formatDateHeaderMobile = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateHeaderFull = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Prev / Next Day Navigation
  const isPrevDisabled = getPrevWeekday(currentDate) < firstAvailable;

  const handlePrevDay = () => {
    if (isPrevDisabled) return;
    const prev = getPrevWeekday(currentDate);
    setCurrentDate(prev);
    setSelectedTime(null);
  };

  const handleNextDay = () => {
    const next = getNextWeekday(currentDate);
    setCurrentDate(next);
    setSelectedTime(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg("");
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) {
      setErrorMsg("Please select a time slot for your appointment.");
      return;
    }
    if (!form.name || !form.email || !form.phone) {
      setErrorMsg("Please complete all required contact fields.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formattedDate = formatDateHeaderFull(currentDate);
    const fullMessage = `[APPOINTMENT BOOKED]\nDate: ${formattedDate}\nTime: ${selectedTime}\nDetails: ${
      form.message || "No additional notes provided."
    }`;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: fullMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reserve appointment.");

      trackEvent("contact_form_submit", "appointment_booking");
      setSuccessMsg(`Session Confirmed! Reserved for ${formattedDate} at ${selectedTime}. Confirmation email sent to ${form.email}.`);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#151515] border border-neutral-800 rounded-sm p-4 sm:p-6 lg:p-8 flex flex-col gap-5 shadow-2xl overflow-hidden">
      {/* Header & Stepper */}
      <div className="flex flex-col gap-3.5 border-b border-neutral-800 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-400">
                APPOINTMENT SCHEDULER
              </span>
              <span className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-700/60 rounded text-[8px] sm:text-[9px] font-mono text-neutral-300 uppercase tracking-wider">
                MON – FRI ONLY
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold uppercase tracking-tight text-white font-montserrat mt-0.5">
              Reserve A Session
            </h2>
          </div>

          <span className="font-mono text-[11px] text-neutral-400 hidden sm:inline">
            {contactEmail}
          </span>
        </div>

        {/* Interactive Progress Tabs (Ultra-Responsive) */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setStep("slot")}
            className={`py-2 px-2.5 sm:px-3 text-left font-mono text-[10px] sm:text-[11px] uppercase tracking-wider border transition-all flex items-center gap-2 rounded-xs ${
              step === "slot"
                ? "bg-white text-black border-white font-bold"
                : "bg-[#0e0e0e] text-neutral-400 border-neutral-800 hover:border-neutral-700"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[9px] font-bold shrink-0">1</span>
            <span className="truncate">Date &amp; Time</span>
          </button>

          <button
            type="button"
            disabled={!selectedTime}
            onClick={() => selectedTime && setStep("details")}
            className={`py-2 px-2.5 sm:px-3 text-left font-mono text-[10px] sm:text-[11px] uppercase tracking-wider border transition-all flex items-center gap-2 rounded-xs ${
              step === "details"
                ? "bg-white text-black border-white font-bold"
                : !selectedTime
                ? "bg-[#0e0e0e]/50 text-neutral-600 border-neutral-900 cursor-not-allowed"
                : "bg-[#0e0e0e] text-neutral-400 border-neutral-800 hover:border-neutral-700"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[9px] font-bold shrink-0">2</span>
            <span className="truncate">Client Dossier</span>
          </button>
        </div>
      </div>

      {successMsg ? (
        <div className="p-4 sm:p-6 bg-emerald-950/80 border border-emerald-700/80 rounded-xs flex flex-col gap-4 text-emerald-300">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[24px] sm:text-[28px] text-emerald-400 shrink-0">check_circle</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold uppercase text-white font-montserrat">
                Appointment Reserved!
              </h3>
              <p className="text-xs font-mono text-emerald-300 mt-1">{successMsg}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSuccessMsg("");
              setStep("slot");
              setSelectedTime(null);
            }}
            className="self-start px-4 py-2 bg-white text-black font-mono text-xs uppercase tracking-wider font-bold rounded-xs hover:bg-neutral-200 transition-colors shadow-md"
          >
            Book Another Session
          </button>
        </div>
      ) : (
        <>
          {errorMsg && (
            <div className="p-3.5 bg-rose-950/80 border border-rose-700/80 text-rose-300 text-xs font-mono rounded-xs flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-rose-400 shrink-0">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP TRANSITIONS */}
          <AnimatePresence mode="wait">
            {step === "slot" && (
              <motion.div
                key="step-slot"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-5"
              >
                {/* Day Navigation Banner - Responsive layout */}
                <div className="flex items-center justify-between bg-[#0e0e0e] p-2.5 sm:p-3.5 border border-neutral-800 rounded-xs gap-2">
                  <button
                    type="button"
                    onClick={handlePrevDay}
                    disabled={isPrevDisabled}
                    className={`p-2 sm:px-3 sm:py-2 rounded-xs border font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 shrink-0 ${
                      isPrevDisabled
                        ? "bg-[#121212] text-neutral-600 border-neutral-800/80 cursor-not-allowed opacity-40"
                        : "bg-[#1b1b1b] hover:bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white active:scale-95 cursor-pointer"
                    }`}
                    title={isPrevDisabled ? "Cannot select previous or past days" : "Previous Weekday"}
                  >
                    <span className="material-symbols-outlined text-[18px] sm:text-[16px]">arrow_back</span>
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  <div className="text-center min-w-0 flex-1 px-1">
                    <span className="font-mono text-[8px] sm:text-[9px] text-neutral-500 uppercase tracking-widest block truncate">
                      SELECTED BUSINESS DAY
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-white font-montserrat block truncate mt-0.5">
                      <span className="sm:hidden">{formatDateHeaderMobile(currentDate)}</span>
                      <span className="hidden sm:inline">{formatDateHeaderFull(currentDate)}</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextDay}
                    className="p-2 sm:px-3 sm:py-2 bg-[#1b1b1b] hover:bg-neutral-800 border border-neutral-700 rounded-xs text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer shrink-0"
                    title="Next Weekday"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="material-symbols-outlined text-[18px] sm:text-[16px]">arrow_forward</span>
                  </button>
                </div>

                {/* Date Chips Carousel */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px] text-neutral-400 uppercase tracking-wider px-0.5">
                    <span>14-DAY CALENDAR VIEW</span>
                    <span className="text-neutral-500 text-[8px] sm:text-[9px]">SAT &amp; SUN CLOSED</span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-neutral-700">
                    {upcomingDays.map((d, i) => {
                      const active = isSameDay(d, currentDate);
                      const satSun = isWeekend(d);
                      const past = isPastDate(d);
                      const disabled = satSun || past;

                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={disabled}
                          onClick={() => {
                            if (!disabled) {
                              setCurrentDate(d);
                              setSelectedTime(null);
                            }
                          }}
                          className={`flex flex-col items-center justify-center min-w-[70px] sm:min-w-[76px] py-2 sm:py-2.5 px-2 rounded-xs border transition-all shrink-0 font-mono text-xs ${
                            active
                              ? "bg-white text-black font-bold border-white scale-102 shadow-lg z-10"
                              : disabled
                              ? "bg-[#0b0b0b] text-neutral-600 border-neutral-900 opacity-40 cursor-not-allowed"
                              : "bg-[#0e0e0e] text-neutral-300 border-neutral-800 hover:border-neutral-600 hover:text-white cursor-pointer"
                          }`}
                        >
                          <span className="text-[9px] uppercase tracking-wider opacity-80">
                            {d.toLocaleDateString("en-US", { weekday: "short" })}
                          </span>
                          <span className="text-xs sm:text-sm font-extrabold my-0.5">
                            {d.getDate()} {d.toLocaleDateString("en-US", { month: "short" })}
                          </span>
                          {satSun ? (
                            <span className="text-[8px] font-sans font-bold text-rose-400/90 uppercase tracking-tight">
                              CLOSED
                            </span>
                          ) : active ? (
                            <span className="text-[8px] font-mono text-black font-bold uppercase">
                              ACTIVE
                            </span>
                          ) : (
                            <span className="text-[8px] font-mono text-emerald-400 opacity-80 uppercase">
                              OPEN
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Categorized Time Slots */}
                <div className="flex flex-col gap-3.5 border-t border-neutral-800 pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-neutral-300 font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-white">schedule</span>
                      <span>SELECT SESSION TIME</span>
                    </span>
                    {selectedTime ? (
                      <span className="font-mono text-[10px] sm:text-xs text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 border border-emerald-800/80 rounded">
                        Selected: {selectedTime} ✓
                      </span>
                    ) : (
                      <span className="font-mono text-[9px] text-neutral-500 uppercase">
                        30 MIN SLOTS
                      </span>
                    )}
                  </div>

                  {/* Morning Slots */}
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9px] sm:text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-amber-400">light_mode</span>
                      <span>Morning Slots</span>
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {morningSlots.map((time) => {
                        const isSelected = selectedTime === time;
                        return (
                          <motion.button
                            key={time}
                            whileTap={{ scale: 0.96 }}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`py-2.5 px-2 rounded-xs border text-[11px] sm:text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? "bg-white text-black font-bold border-white shadow-xl"
                                : "bg-[#0e0e0e] text-neutral-300 border-neutral-800 hover:border-neutral-600 hover:bg-[#191919] hover:text-white"
                            }`}
                          >
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            <span className="truncate">{time}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Afternoon Slots */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <span className="font-mono text-[9px] sm:text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-indigo-400">dark_mode</span>
                      <span>Afternoon &amp; Evening Slots</span>
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {afternoonSlots.map((time) => {
                        const isSelected = selectedTime === time;
                        return (
                          <motion.button
                            key={time}
                            whileTap={{ scale: 0.96 }}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`py-2.5 px-2 rounded-xs border text-[11px] sm:text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? "bg-white text-black font-bold border-white shadow-xl"
                                : "bg-[#0e0e0e] text-neutral-300 border-neutral-800 hover:border-neutral-600 hover:bg-[#191919] hover:text-white"
                            }`}
                          >
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            <span className="truncate">{time}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Next Step Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-neutral-800 pt-5 gap-3">
                  <span className="font-mono text-[10px] sm:text-xs text-neutral-500">
                    Step 1 of 2: Select Slot
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    disabled={!selectedTime}
                    onClick={() => setStep("details")}
                    className="w-full sm:w-auto px-6 py-3 bg-white text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-md rounded-xs cursor-pointer"
                  >
                    <span>Continue to Details</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: CLIENT DETAILS FORM */}
            {step === "details" && (
              <motion.div
                key="step-details"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5">
                  {/* Selected Slot Summary Header Card */}
                  <div className="p-3.5 bg-[#0e0e0e] border border-neutral-800 rounded-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xs bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-emerald-400 shrink-0">
                        <span className="material-symbols-outlined text-[18px]">event_available</span>
                      </div>
                      <div className="min-w-0">
                        <span className="font-mono text-[8px] sm:text-[9px] text-neutral-500 uppercase tracking-widest block truncate">
                          RESERVED SESSION SLOT
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-white font-montserrat block truncate">
                          <span className="sm:hidden">{formatDateHeaderMobile(currentDate)} @ {selectedTime}</span>
                          <span className="hidden sm:inline">{formatDateHeaderFull(currentDate)} @ {selectedTime}</span>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep("slot")}
                      className="px-2.5 py-1 bg-[#1b1b1b] hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 rounded-xs text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <span className="material-symbols-outlined text-[12px]">edit</span>
                      <span className="hidden sm:inline">Change</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        placeholder="e.g. Marcus Vance"
                        required
                        className="w-full px-3.5 py-2.5 bg-[#0e0e0e] border border-neutral-800 rounded-xs focus:border-white focus:outline-none text-xs text-white placeholder-neutral-600 transition-colors font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleFormChange}
                        placeholder="e.g. +234 801 234 5678"
                        required
                        className="w-full px-3.5 py-2.5 bg-[#0e0e0e] border border-neutral-800 rounded-xs focus:border-white focus:outline-none text-xs text-white placeholder-neutral-600 transition-colors font-sans"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleFormChange}
                      placeholder="e.g. marcus@example.com"
                      required
                      className="w-full px-3.5 py-2.5 bg-[#0e0e0e] border border-neutral-800 rounded-xs focus:border-white focus:outline-none text-xs text-white placeholder-neutral-600 transition-colors font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                      Session Type / Project Notes (Optional)
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={form.message}
                      onChange={handleFormChange}
                      placeholder="Tell us about your shoot ideas, portrait style, or location preferences..."
                      className="w-full px-3.5 py-2.5 bg-[#0e0e0e] border border-neutral-800 rounded-xs focus:border-white focus:outline-none text-xs text-white placeholder-neutral-600 transition-colors font-sans resize-none"
                    />
                  </div>

                  {/* Form Action Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between border-t border-neutral-800 pt-4 gap-3">
                    <button
                      type="button"
                      onClick={() => setStep("slot")}
                      className="w-full sm:w-auto px-4 py-2.5 bg-[#1b1b1b] hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 rounded-xs font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                      <span>Back to Times</span>
                    </button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md rounded-xs cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Confirming Session...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirm Appointment</span>
                          <span aria-hidden="true">→</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
