import Link from "next/link";
import Image from "next/image";
import { getAdminWorks, getAnalyticsSummary, getAdminInquiries } from "../../lib/content-db";
import { destroySession, requireOwner } from "../../lib/auth";
import { redirect } from "next/navigation";
import AdminWorkRowActions from "../../components/AdminWorkRowActions";
import AdminNav from "../../components/AdminNav";

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
    <main className="min-h-screen bg-[#0e0e0e] px-5 py-8 text-[#e5e2e1] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <AdminNav />
        <header className="mb-10 flex flex-col gap-5 border-b border-neutral-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              Power Lens / Control Room
            </p>
            <h1 className="text-4xl font-extrabold uppercase tracking-tight text-white font-montserrat">
              Works &amp; Control
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/inquiries" className="border border-neutral-700 px-4 py-3 text-xs uppercase tracking-widest text-neutral-300 hover:border-white hover:text-white flex items-center gap-2">
              <span>Messages</span>
              {unreadCount > 0 && <span className="px-1.5 py-0.5 bg-amber-400 text-black font-mono font-bold text-[10px] rounded-xs">{unreadCount}</span>}
            </Link>
            <Link href="/admin/settings" className="border border-neutral-700 px-4 py-3 text-xs uppercase tracking-widest text-neutral-300 hover:border-white hover:text-white">
              Settings
            </Link>
            <Link href="/admin/works/new" className="bg-white px-4 py-3 text-xs font-bold uppercase tracking-widest text-black hover:bg-neutral-200">
              New work
            </Link>
            <form action={logout}>
              <button className="border border-neutral-700 px-4 py-3 text-xs uppercase tracking-widest text-neutral-300 hover:border-white hover:text-white">
                Sign out
              </button>
            </form>
          </div>
        </header>

        {/* Overview Stats Cards */}
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="border border-neutral-800 bg-[#151515] p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Total Works</p>
            <p className="mt-2 text-3xl text-white">{works.length}</p>
          </div>
          <div className="border border-neutral-800 bg-[#151515] p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Published</p>
            <p className="mt-2 text-3xl text-white">{works.filter((work) => work.status === "published").length}</p>
          </div>
          <div className="border border-neutral-800 bg-[#151515] p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Drafts</p>
            <p className="mt-2 text-3xl text-white">{works.filter((work) => work.status === "draft").length}</p>
          </div>
          <Link href="/admin/inquiries" className="border border-neutral-800 bg-[#151515] p-5 hover:border-white transition-colors group">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Client Messages</p>
              {unreadCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl text-white font-bold">{inquiries.length}</span>
              <span className="text-[11px] font-mono text-amber-400 group-hover:underline">
                {unreadCount} UNREAD →
              </span>
            </div>
          </Link>
        </div>

        {/* Analytics Telemetry Bar */}
        <section className="mt-3 grid gap-3 sm:grid-cols-4">
          <div className="border border-neutral-800 bg-[#151515] p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Gallery opens / 30d</p>
            <p className="mt-2 text-2xl text-white">{analytics.galleryOpens}</p>
          </div>
          <div className="border border-neutral-800 bg-[#151515] p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Email clicks / 30d</p>
            <p className="mt-2 text-2xl text-white">{analytics.contactClicks}</p>
          </div>
          <div className="border border-neutral-800 bg-[#151515] p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">WhatsApp / 30d</p>
            <p className="mt-2 text-2xl text-white">{analytics.whatsappClicks}</p>
          </div>
          <div className="border border-neutral-800 bg-[#151515] p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Social clicks / 30d</p>
            <p className="mt-2 text-2xl text-white">{analytics.socialClicks}</p>
          </div>
        </section>

        {/* Works Archive Table */}
        <section className="mt-10 border border-neutral-800 bg-[#121212]">
          <div className="grid grid-cols-[3.5rem_1fr_auto_auto] gap-4 border-b border-neutral-800 px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            <span>Preview</span>
            <span>Work</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {works.length === 0 ? (
            <p className="px-5 py-12 text-sm text-neutral-500">No works yet. Add the first frame to begin the archive.</p>
          ) : (
            works.map((work) => (
              <div key={work._id} className="grid grid-cols-[3.5rem_1fr_auto_auto] items-center gap-4 border-b border-neutral-800/70 px-5 py-4 last:border-0">
                <div className="relative h-14 w-14 overflow-hidden border border-neutral-800 bg-neutral-900">
                  <Image src={work.imageUrl} alt={work.altText || work.title} fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{work.title}</p>
                  <p className="mt-1 truncate text-xs text-neutral-500">{work.category || "Uncategorized"} / {work.location || "No location"}</p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">{work.status}</span>
                <AdminWorkRowActions id={work._id} status={work.status} hero={Boolean(work.hero)} />
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
