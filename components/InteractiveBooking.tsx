"use client";

import React, { useState } from "react";
import { trackEvent } from "../lib/analytics";

interface InteractiveBookingProps {
  contactEmail: string;
  onSuccess?: () => void;
}

export default function InteractiveBooking({ contactEmail, onSuccess }: InteractiveBookingProps) {
  // Date State - Default to tomorrow
  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  };

  const [currentDate, setCurrentDate] = useState<Date>(getTomorrow());
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

  // Generate Available Time Slots (e.g., 9:00 AM to 6:00 PM)
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:30 PM",
    "03:00 PM",
    "04:30 PM",
    "06:00 PM",
  ];

  // Generate Next 14 Days for Quick Bar
  const upcomingDays = Array.from({ length: 14 }).map((_, index) => {
    const d = new Date();
    d.setDate(d.getDate() + index + 1);
    return d;
  });

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const formatDateHeader = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePrevDay = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    if (prev >= today) {
      setCurrentDate(prev);
      setSelectedTime(null);
    }
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
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

    const formattedDate = formatDateHeader(currentDate);
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
    <div className="w-full bg-[#151515] border border-neutral-800 rounded-lg p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-neutral-800 pb-4 gap-3">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block">
            CUSTOM APPOINTMENT SCHEDULER
          </span>
          <h2 className="text-2xl font-bold uppercase tracking-tight text-white font-montserrat mt-0.5">
            Select Date &amp; Time
          </h2>
        </div>
        <span className="font-mono text-xs text-neutral-500 hidden sm:inline">
          {contactEmail}
        </span>
      </div>

      {successMsg ? (
        <div className="p-6 bg-emerald-950/80 border border-emerald-700/80 rounded flex flex-col gap-4 text-emerald-300">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px] text-emerald-400">check_circle</span>
            <div>
              <h3 className="text-lg font-bold uppercase text-white font-montserrat">
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
            className="self-start px-4 py-2 bg-emerald-900/60 hover:bg-emerald-800 text-white font-mono text-xs uppercase tracking-wider rounded border border-emerald-700 transition-colors"
          >
            Book Another Session
          </button>
        </div>
      ) : (
        <>
          {errorMsg && (
            <div className="p-4 bg-rose-950/80 border border-rose-700/80 text-rose-300 text-xs font-mono rounded flex items-start gap-3">
              <span className="material-symbols-outlined text-[18px] text-rose-400 shrink-0">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: DATE & TIME SLOT SELECTION */}
          {step === "slot" && (
            <div className="flex flex-col gap-6">
              {/* Day Navigation Controls (Prev / Next) */}
              <div className="flex items-center justify-between bg-[#0e0e0e] p-4 border border-neutral-800 rounded-md">
                <button
                  type="button"
                  onClick={handlePrevDay}
                  className="px-3.5 py-2 bg-[#1b1b1b] hover:bg-neutral-800 border border-neutral-700 rounded text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Previous Day</span>
                </button>

                <div className="text-center min-w-0 px-2">
                  <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest block">
                    SELECTED DATE
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white font-montserrat truncate block">
                    {formatDateHeader(currentDate)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleNextDay}
                  className="px-3.5 py-2 bg-[#1b1b1b] hover:bg-neutral-800 border border-neutral-700 rounded text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <span>Next Day</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              {/* Quick Date Chips Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {upcomingDays.map((d, i) => {
                  const active = isSameDay(d, currentDate);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setCurrentDate(d);
                        setSelectedTime(null);
                      }}
                      className={`flex flex-col items-center justify-center min-w-[70px] px-3 py-2 rounded border transition-all shrink-0 font-mono text-xs ${
                        active
                          ? "bg-white text-black font-bold border-white scale-105 shadow-md"
                          : "bg-[#0e0e0e] text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white"
                      }`}
                    >
                      <span className="text-[10px] uppercase opacity-70">
                        {d.toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <span className="text-sm font-semibold">
                        {d.getDate()} {d.toLocaleDateString("en-US", { month: "short" })}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Time Slots Display (Vertical Stack + Grid Options) */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                    SELECT A TIME SLOT (30 MIN SESSION)
                  </span>
                  {selectedTime && (
                    <span className="font-mono text-xs text-emerald-400 font-semibold">
                      Selected: {selectedTime} ✓
                    </span>
                  )}
                </div>

                {/* Vertical / Grid Slots */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                  {timeSlots.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-3.5 px-4 rounded border text-sm font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                          isSelected
                            ? "bg-white text-black font-bold border-white shadow-lg scale-102"
                            : "bg-[#0e0e0e] text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:bg-[#181818] hover:text-white"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        <span>{time}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Next Step Action Button */}
              <div className="flex items-center justify-between border-t border-neutral-800 pt-6">
                <span className="font-mono text-xs text-neutral-500">
                  Step 1 of 2: Select Date &amp; Time
                </span>

                <button
                  type="button"
                  disabled={!selectedTime}
                  onClick={() => setStep("details")}
                  className="px-8 py-3.5 bg-white text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                >
                  <span>Continue to Details</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CLIENT DETAILS FORM */}
          {step === "details" && (
            <form onSubmit={handleBookingSubmit} className="flex flex-col gap-6">
              {/* Selected Slot Summary Header */}
              <div className="p-4 bg-[#0e0e0e] border border-neutral-800 rounded flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest block">
                    RESERVED APPOINTMENT SLOT
                  </span>
                  <span className="text-sm font-bold text-white font-montserrat">
                    {formatDateHeader(currentDate)} @ {selectedTime}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("slot")}
                  className="px-3 py-1.5 bg-[#1b1b1b] hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 rounded text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  <span>Change Time</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="w-full px-4 py-3 bg-[#0e0e0e] border border-neutral-800 rounded focus:border-white focus:outline-none text-xs text-white placeholder-neutral-600 transition-colors font-sans"
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
                    className="w-full px-4 py-3 bg-[#0e0e0e] border border-neutral-800 rounded focus:border-white focus:outline-none text-xs text-white placeholder-neutral-600 transition-colors font-sans"
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
                  className="w-full px-4 py-3 bg-[#0e0e0e] border border-neutral-800 rounded focus:border-white focus:outline-none text-xs text-white placeholder-neutral-600 transition-colors font-sans"
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
                  className="w-full px-4 py-3 bg-[#0e0e0e] border border-neutral-800 rounded focus:border-white focus:outline-none text-xs text-white placeholder-neutral-600 transition-colors font-sans resize-none"
                />
              </div>

              {/* Form Action Controls */}
              <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
                <button
                  type="button"
                  onClick={() => setStep("slot")}
                  className="px-4 py-2.5 bg-[#1b1b1b] hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 rounded font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Back to Times</span>
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 bg-white text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center gap-2 disabled:opacity-50 shadow-md"
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
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
