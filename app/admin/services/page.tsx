import Link from "next/link";
import Image from "next/image";
import { getAdminServices } from "../../../lib/content-db";
import { requireOwner } from "../../../lib/auth";
import AdminNav from "../../../components/AdminNav";
import AdminServiceRowActions from "../../../components/AdminServiceRowActions";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  await requireOwner();
  const services = await getAdminServices();

  return (
    <main className="min-h-screen bg-[#0e0e0e] px-4 py-6 text-[#e5e2e1] sm:px-8 font-sans select-none">
      <div className="mx-auto max-w-6xl">
        <AdminNav />
        
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 border-b border-neutral-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-500 font-semibold">
              Power Lens / Control Room
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-montserrat">
              Photography Services
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/services/new"
              className="bg-amber-500 px-5 py-3 text-xs font-bold uppercase tracking-widest text-black hover:bg-amber-400 transition-colors rounded-lg shadow-md"
            >
              + Add Service
            </Link>
          </div>
        </header>

        {/* Services List Table / Mobile Cards */}
        <section className="border border-neutral-800 bg-[#121212] rounded-xl overflow-hidden shadow-2xl">
          <div className="hidden sm:grid grid-cols-[3.5rem_1fr_auto_auto] gap-4 border-b border-neutral-800 px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
            <span>Cover</span>
            <span>Service &amp; Tagline</span>
            <span>Category</span>
            <span>Actions</span>
          </div>
          {services.length === 0 ? (
            <p className="px-5 py-12 text-sm text-neutral-400 font-mono text-center">
              No services added yet. Click &quot;+ Add Service&quot; to create your first photography offering.
            </p>
          ) : (
            services.map((service) => (
              <div
                key={service._id}
                className="flex flex-col sm:grid sm:grid-cols-[3.5rem_1fr_auto_auto] sm:items-center gap-4 border-b border-neutral-800/70 p-4 sm:px-5 sm:py-4 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-neutral-800 bg-neutral-900 rounded-md">
                    {service.imageUrl && (
                      <Image
                        src={service.imageUrl}
                        alt={service.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 sm:hidden flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-bold text-white text-sm">{service.title}</p>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold tracking-widest bg-amber-950/80 text-amber-400 border border-amber-800">
                        {service.category || "General"}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-neutral-400 font-light">{service.subtitle}</p>
                  </div>
                </div>

                <div className="hidden sm:block min-w-0">
                  <p className="truncate font-semibold text-white text-sm">{service.title}</p>
                  <p className="mt-1 truncate text-xs text-neutral-400 font-light">{service.subtitle}</p>
                </div>
                
                <div className="hidden sm:block font-mono text-xs text-neutral-400">
                  {service.category || "General"}
                </div>
                
                <div className="pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800/60">
                  <AdminServiceRowActions id={service._id} published={Boolean(service.published)} />
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
