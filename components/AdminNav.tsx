"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/admin", label: "Works" },
  { href: "/admin/works/new", label: "New work" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <nav className="mb-8 flex flex-col gap-4 border-b border-neutral-800 pb-4 sm:flex-row sm:items-center sm:justify-between" aria-label="Admin navigation">
      <div className="flex items-center gap-5">
        <Link href="/admin" className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
          Power Lens <span className="text-neutral-600">/</span> Admin
        </Link>
        <div className="hidden h-4 w-px bg-neutral-800 sm:block" />
        <div className="flex items-center gap-4">
          {links.map((link) => {
            const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            return <Link key={link.href} href={link.href} className={`text-xs uppercase tracking-widest transition-colors ${active ? "text-white" : "text-neutral-500 hover:text-white"}`}>{link.label}</Link>;
          })}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xs uppercase tracking-widest text-neutral-500 transition-colors hover:text-white">View site</Link>
        <button type="button" onClick={logout} disabled={busy} className="text-xs uppercase tracking-widest text-neutral-500 transition-colors hover:text-white disabled:opacity-50">{busy ? "Signing out" : "Sign out"}</button>
      </div>
    </nav>
  );
}
