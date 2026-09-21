import Link from "next/link";
import Image from "next/image";
import { getAdminWorks, getAnalyticsSummary, getAdminInquiries } from "../../lib/content-db";
import { destroySession, requireOwner } from "../../lib/auth";
import { redirect } from "next/navigation";
import AdminWorkRowActions from "../../components/AdminWorkRowActions";
import AdminNav from "../../components/AdminNav";
import AdminTour from "../../components/AdminTour";

export default async function AdminPage() {
  await requireOwner();
  const works = await getAdminWorks();
  const analytics = await getAnalyticsSummary();
  const inquiries = await getAdminInquiries();
  const unreadCount = inquiries.filter((i) => i.status === "unread").length;

  async function logout() {
    "use server";
    await destroySession();
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#0e0e0e] px-4 py-6 text-[#e5e2e1] sm:px-8 font-sans select-none">
      <AdminTour />
      <div className="mx-auto max-w-6xl">
        <AdminNav />
        
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 border-b border-neutral-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-500 font-semibold">
              Power Lens / Control Room
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-montserrat">
              Works &amp; Control
            </h1>
          </div>
          
          <div id="tour-header-actions" className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/works/new"
              className="px-4 py-2.5 bg-amber-500 text-black font-bold text-xs font-mono uppercase tracking-wider hover:bg-amber-400 transition-all rounded-lg shadow-md"
            >
              + New Work
            </Link>
            <Link
              href="/admin/inquiries"
              className="px-4 py-2.5 bg-[#141414] border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2"
            >
              <span>Messages</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-400 text-black font-mono font-bold text-[10px] rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link
              href="/admin/settings"
              className="px-4 py-2.5 bg-[#141414] border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-wider rounded-lg transition-all"
            >
              Settings
            </Link>
          </div>
        </header>

        {/* Overview Stats Cards (Compact 2x2 grid on mobile) */}
        <div id="tour-stats-grid" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="border border-neutral-800/90 bg-[#141414] p-4 rounded-xl">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Total Works</p>
            <p className="mt-1 text-2xl sm:text-3xl text-white font-bold font-montserrat">{works.length}</p>
          </div>
          <div className="border border-neutral-800/90 bg-[#141414] p-4 rounded-xl">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Published</p>
            <p className="mt-1 text-2xl sm:text-3xl text-emerald-400 font-bold font-montserrat">{works.filter((w) => w.status === "published").length}</p>
          </div>
          <div className="border border-neutral-800/90 bg-[#141414] p-4 rounded-xl">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-medium font-medium">Drafts</p>
            <p className="mt-1 text-2xl sm:text-3xl text-amber-400 font-bold font-montserrat">{works.filter((w) => w.status === "draft").length}</p>
          </div>
          <Link href="/admin/inquiries" className="border border-neutral-800/90 bg-[#141414] p-4 rounded-xl hover:border-amber-500/50 transition-colors group">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Client Messages</p>
              {unreadCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl text-white font-bold font-montserrat">{inquiries.length}</span>
              <span className="text-[10px] font-mono text-amber-400 group-hover:underline">
                {unreadCount} UNREAD →
              </span>
            </div>
          </Link>
        </div>

        {/* Analytics Telemetry Bar (Compact 2x2 grid on mobile) */}
        <section id="tour-analytics-grid" className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="border border-neutral-800/80 bg-[#141414] p-3.5 rounded-xl">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Gallery Opens</p>
            <p className="mt-1 text-xl text-white font-bold">{analytics.galleryOpens}</p>
          </div>
          <div className="border border-neutral-800/80 bg-[#141414] p-3.5 rounded-xl">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Email Clicks</p>
            <p className="mt-1 text-xl text-white font-bold">{analytics.contactClicks}</p>
          </div>
          <div className="border border-neutral-800/80 bg-[#141414] p-3.5 rounded-xl">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">WhatsApp</p>
            <p className="mt-1 text-xl text-white font-bold">{analytics.whatsappClicks}</p>
          </div>
          <div className="border border-neutral-800/80 bg-[#141414] p-3.5 rounded-xl">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Social Clicks</p>
            <p className="mt-1 text-xl text-white font-bold">{analytics.socialClicks}</p>
          </div>
        </section>

        {/* Works Archive Table / Card List */}
        <section id="tour-works-table" className="mt-8 border border-neutral-800 bg-[#121212] rounded-xl overflow-hidden shadow-2xl">
          <div className="hidden sm:grid grid-cols-[3.5rem_1fr_auto_auto] gap-4 border-b border-neutral-800 px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
            <span>Preview</span>
            <span>Work</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {works.length === 0 ? (
            <p className="px-5 py-12 text-sm text-neutral-400 font-mono text-center">No works yet. Add the first frame to begin the archive.</p>
          ) : (
            works.map((work) => (
              <div key={work._id} className="flex flex-col sm:grid sm:grid-cols-[3.5rem_1fr_auto_auto] sm:items-center gap-4 border-b border-neutral-800/70 p-4 sm:px-5 sm:py-4 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-neutral-800 bg-neutral-900">
                    <Image src={work.imageUrl} alt={work.altText || work.title} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="min-w-0 sm:hidden flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-bold text-white text-sm">{work.title}</p>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold tracking-widest ${work.status === "published" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-neutral-900 text-neutral-400 border border-neutral-800"}`}>
                        {work.status}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-neutral-400 font-mono">{work.category || "Uncategorized"} • {work.location || "No location"}</p>
                  </div>
                </div>

                <div className="hidden sm:block min-w-0">
                  <p className="truncate font-semibold text-white text-sm">{work.title}</p>
                  <p className="mt-1 truncate text-xs text-neutral-400 font-light">{work.category || "Uncategorized"} / {work.location || "No location"}</p>
                </div>
                
                <span className="hidden sm:block font-mono text-[10px] uppercase tracking-widest text-neutral-400">{work.status}</span>
                
                <div className="pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800/60">
                  <AdminWorkRowActions id={work._id} status={work.status} hero={Boolean(work.hero)} />
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
