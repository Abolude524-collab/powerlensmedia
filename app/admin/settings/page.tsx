import { requireOwner } from "../../../lib/auth";
import { getSiteSettings } from "../../../lib/content-db";
import SettingsForm from "../../../components/SettingsForm";
import AdminNav from "../../../components/AdminNav";

export default async function SettingsPage() {
  await requireOwner();
  return <main className="min-h-screen bg-[#0e0e0e] px-5 py-8 text-[#e5e2e1] sm:px-8"><div className="mx-auto max-w-3xl"><AdminNav /><p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">Power Lens / Control Room</p><h1 className="mb-8 text-4xl font-extrabold uppercase tracking-tight text-white">Profile settings</h1><div className="border border-neutral-800 bg-[#151515] p-6"><SettingsForm settings={await getSiteSettings()} /></div></div></main>;
}