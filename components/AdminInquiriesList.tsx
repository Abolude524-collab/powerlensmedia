"use client";

import React, { useState } from "react";
import { InquiryRecord } from "../lib/content-db";

interface AdminInquiriesListProps {
  initialInquiries: InquiryRecord[];
}

export default function AdminInquiriesList({ initialInquiries }: AdminInquiriesListProps) {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(initialInquiries);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "unread" ? "read" : "unread";
    setLoadingId(id);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
        );
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/inquiries?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete inquiry:", err);
    } finally {
      setLoadingId(null);
    }
  };

  const filteredInquiries = inquiries.filter((item) => {
    const matchesFilter =
      filter === "all" ? true : filter === "unread" ? item.status === "unread" : item.status === "read";
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = inquiries.filter((i) => i.status === "unread").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#151515] p-4 border border-neutral-800 rounded">
        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors ${
              filter === "all"
                ? "bg-white text-black font-bold"
                : "bg-[#0e0e0e] text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            All ({inquiries.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 ${
              filter === "unread"
                ? "bg-amber-400 text-black font-bold"
                : "bg-[#0e0e0e] text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
            <span>({unreadCount})</span>
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors ${
              filter === "read"
                ? "bg-white text-black font-bold"
                : "bg-[#0e0e0e] text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            Read ({inquiries.length - unreadCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search by client name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#0e0e0e] border border-neutral-800 rounded text-xs text-white placeholder-neutral-500 focus:border-white focus:outline-none font-sans"
          />
        </div>
      </div>

      {/* Message Cards List */}
      {filteredInquiries.length === 0 ? (
        <div className="p-12 text-center border border-neutral-800 bg-[#121212] rounded">
          <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
            No client messages found.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredInquiries.map((item) => {
            const isUnread = item.status === "unread";
            const isLoading = loadingId === item.id;

            return (
              <div
                key={item.id}
                className={`p-6 border rounded-lg transition-all ${
                  isUnread
                    ? "bg-[#171717] border-amber-500/40 shadow-lg"
                    : "bg-[#121212] border-neutral-800 opacity-90 hover:opacity-100"
                }`}
              >
                {/* Card Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold uppercase tracking-tight text-white font-montserrat">
                      {item.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest rounded border ${
                        isUnread
                          ? "bg-amber-950/80 border-amber-700 text-amber-300 font-bold"
                          : "bg-neutral-800 border-neutral-700 text-neutral-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <span className="font-mono text-[11px] text-neutral-400">
                    {new Date(item.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                {/* Client Contact Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 font-mono text-xs">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <span className="text-neutral-500 uppercase">Email:</span>
                    <a
                      href={`mailto:${item.email}?subject=Re:%20Photography%20Inquiry%20-%20Power%20Lens`}
                      className="text-white hover:underline truncate"
                    >
                      {item.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <span className="text-neutral-500 uppercase">Phone:</span>
                    <a href={`tel:${item.phone}`} className="text-white hover:underline">
                      {item.phone}
                    </a>
                  </div>
                </div>

                {/* Message Payload Box */}
                <div className="p-4 bg-[#0a0a0a] border border-neutral-800/80 rounded mb-4 text-xs text-neutral-200 leading-relaxed font-sans whitespace-pre-wrap">
                  {item.message}
                </div>

                {/* Card Bottom Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800/60">
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${item.email}?subject=Re:%20Photography%20Inquiry%20-%20Power%20Lens`}
                      className="px-3 py-1.5 bg-white text-black font-bold font-mono text-[10px] uppercase tracking-wider hover:bg-neutral-200 transition-colors rounded flex items-center gap-1"
                    >
                      <span>Reply Email</span>
                      <span className="material-symbols-outlined text-[14px]">mail</span>
                    </a>
                    <a
                      href={`tel:${item.phone}`}
                      className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 text-neutral-300 font-mono text-[10px] uppercase tracking-wider hover:text-white transition-colors rounded flex items-center gap-1"
                    >
                      <span>Call Client</span>
                      <span className="material-symbols-outlined text-[14px]">call</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(item.id, item.status)}
                      disabled={isLoading}
                      className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 text-neutral-400 font-mono text-[10px] uppercase tracking-wider hover:text-white transition-colors rounded disabled:opacity-50"
                    >
                      {isUnread ? "Mark as Read" : "Mark as Unread"}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isLoading}
                      className="px-3 py-1.5 bg-rose-950/40 border border-rose-800/60 text-rose-400 font-mono text-[10px] uppercase tracking-wider hover:bg-rose-900/60 hover:text-white transition-colors rounded disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
