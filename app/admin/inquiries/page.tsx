import { requireOwner } from "../../../lib/auth";
import { getAdminInquiries } from "../../../lib/content-db";
import AdminNav from "../../../components/AdminNav";
import AdminInquiriesList from "../../../components/AdminInquiriesList";

export default async function AdminInquiriesPage() {
  await requireOwner();
  const inquiries = await getAdminInquiries();

  const unreadCount = inquiries.filter((i) => i.status === "unread").length;

  return (
    <main className="min-h-screen bg-[#0e0e0e] px-5 py-8 text-[#e5e2e1] sm:px-8 font-sans">
      <div className="mx-auto max-w-6xl">
        <AdminNav />

        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 border-b border-neutral-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              Power Lens / Client Communications
            </p>
            <h1 className="text-4xl font-extrabold uppercase tracking-tight text-white font-montserrat">
              Inquiries &amp; Messages
            </h1>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="bg-[#151515] border border-neutral-800 px-4 py-2 rounded flex items-center gap-2">
              <span className="text-neutral-500 uppercase">Total Messages:</span>
              <span className="text-white font-bold">{inquiries.length}</span>
            </div>
            <div className="bg-[#151515] border border-neutral-800 px-4 py-2 rounded flex items-center gap-2">
              <span className="text-neutral-500 uppercase">Unread:</span>
              <span className="text-amber-400 font-bold">{unreadCount}</span>
            </div>
          </div>
        </header>

        {/* Inquiries Manager List */}
        <AdminInquiriesList initialInquiries={inquiries} />
      </div>
    </main>
  );
}
