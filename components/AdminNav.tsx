"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { startAdminTour } from "./AdminTour";

const links = [
  { href: "/admin", label: "Works" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/inquiries", label: "Messages" },
  { href: "/admin/works/new", label: "New Work" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch("/api/admin/inquiries")
      .then((res) => (res.ok ? res.json() : { inquiries: [] }))
      .then((data: { inquiries?: Array<{ status: string }> }) => {
        if (data.inquiries) {
          const unread = data.inquiries.filter((i) => i.status === "unread").length;
          setUnreadCount(unread);
        }
      })
      .catch(() => {});
  }, []);

  async function logout() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  function handleTriggerTour() {
    startAdminTour(pathname);
  }

  return (
    <nav className="mb-8 border-b border-neutral-800 pb-4 font-sans select-none" aria-label="Admin navigation">
      {/* Desktop & Mobile Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
            <span>POWER LENS</span>
            <span className="text-amber-400">/</span>
            <span className="text-neutral-400 text-[10px]">CONTROL ROOM</span>
          </Link>
          <div className="hidden h-4 w-px bg-neutral-800 sm:block" />
          
          {/* Desktop Nav Links */}
          <div id="tour-admin-nav" className="hidden items-center gap-4 sm:flex">
            {links.map((link) => {
              const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
              const isMessages = link.href === "/admin/inquiries";
              const isServices = link.href === "/admin/services";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  id={isServices ? "tour-link-services" : undefined}
                  className={`text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 ${
                    active ? "text-amber-400 font-bold" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  {isMessages && unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-amber-400 text-black font-mono font-bold text-[9px] rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop Quick Actions */}
        <div id="tour-quick-links" className="hidden items-center gap-4 sm:flex">
          <button
            type="button"
            onClick={handleTriggerTour}
            className="text-xs uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-mono font-semibold cursor-pointer"
            title="Take Control Room Tour"
          >
            <span className="material-symbols-outlined text-[15px]">explore</span>
            <span>Tour</span>
          </button>
          <div className="h-4 w-px bg-neutral-800" />
          <Link href="/" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest text-neutral-400 transition-colors hover:text-white flex items-center gap-1">
            <span>View site</span>
            <span className="material-symbols-outlined text-[13px]">open_in_new</span>
          </Link>
          <button
            type="button"
            onClick={logout}
            disabled={busy}
            className="text-xs uppercase tracking-widest text-rose-400 transition-colors hover:text-rose-300 disabled:opacity-50"
          >
            {busy ? "Signing out" : "Sign out"}
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={handleTriggerTour}
            className="px-2 py-1 bg-amber-500/10 border border-amber-500/40 text-amber-400 font-mono font-semibold text-[10px] uppercase tracking-wider rounded-md flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">explore</span>
            <span>Tour</span>
          </button>
          {unreadCount > 0 && (
            <Link href="/admin/inquiries" className="px-2 py-0.5 bg-amber-400 text-black font-mono font-bold text-[10px] rounded-full">
              {unreadCount} new
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white bg-[#161616] border border-neutral-800 rounded-md focus:outline-none active:scale-95"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[20px] block">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mt-4 flex flex-col gap-2 bg-[#121212] border border-neutral-800 p-4 rounded-xl shadow-2xl sm:hidden">
          {links.map((link) => {
            const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            const isMessages = link.href === "/admin/inquiries";
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center justify-between transition-all ${
                  active ? "bg-amber-500 text-black font-bold shadow-md" : "bg-[#181818] text-neutral-300 hover:text-white"
                }`}
              >
                <span>{link.label}</span>
                {isMessages && unreadCount > 0 && (
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${active ? "bg-black text-amber-400" : "bg-amber-400 text-black"}`}>
                    {unreadCount} unread
                  </span>
                )}
              </Link>
            );
          })}
          
          <button
            type="button"
            onClick={() => { setMobileMenuOpen(false); handleTriggerTour(); }}
            className="w-full py-3 px-3 bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-mono uppercase tracking-wider rounded-lg text-center flex items-center justify-center gap-1.5 font-bold my-1"
          >
            <span className="material-symbols-outlined text-[16px]">explore</span>
            <span>Take Control Room Tour</span>
          </button>

          <div className="pt-2 border-t border-neutral-800 grid grid-cols-2 gap-2 mt-1">
            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-3 bg-[#181818] hover:bg-neutral-800 text-neutral-300 text-xs font-mono uppercase tracking-wider rounded-lg text-center flex items-center justify-center gap-1"
            >
              <span>Public Site</span>
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </Link>

            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); logout(); }}
              disabled={busy}
              className="py-3 px-3 bg-rose-950/60 border border-rose-800/80 text-rose-300 hover:bg-rose-900 text-xs font-mono uppercase tracking-wider rounded-lg text-center font-bold"
            >
              {busy ? "Signing out" : "Sign Out"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
