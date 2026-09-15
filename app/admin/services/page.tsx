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
    <main className="min-h-screen bg-[#0e0e0e] px-5 py-8 text-[#e5e2e1] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <AdminNav />
        <header className="mb-10 flex flex-col gap-5 border-b border-neutral-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              Power Lens / Control Room
            </p>
            <h1 className="text-4xl font-extrabold uppercase tracking-tight text-white font-montserrat">
              Photography Services
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/services/new"
              className="bg-amber-400 px-5 py-3 text-xs font-bold uppercase tracking-widest text-black hover:bg-amber-300 transition-colors"
            >
              + Add Service
            </Link>
          </div>
        </header>

        {/* Services List Table */}
        <section className="border border-neutral-800 bg-[#121212] rounded-xs overflow-hidden">
          <div className="grid grid-cols-[3.5rem_1fr_auto_auto] gap-4 border-b border-neutral-800 px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            <span>Cover</span>
            <span>Service &amp; Tagline</span>
            <span>Category</span>
            <span>Actions</span>
          </div>
          {services.length === 0 ? (
            <p className="px-5 py-12 text-sm text-neutral-500">
              No services added yet. Click "+ Add Service" to create your first photography offering.
            </p>
          ) : (
            services.map((service) => (
              <div
                key={service._id}
                className="grid grid-cols-[3.5rem_1fr_auto_auto] items-center gap-4 border-b border-neutral-800/70 px-5 py-4 last:border-0"
              >
                <div className="relative h-14 w-14 overflow-hidden border border-neutral-800 bg-neutral-900 rounded-sm">
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
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white text-sm">{service.title}</p>
                  <p className="mt-1 truncate text-xs text-neutral-400 font-light">{service.subtitle}</p>
                </div>
                <div className="font-mono text-xs text-neutral-400">
                  {service.category || "General"}
                </div>
                <AdminServiceRowActions id={service._id} published={Boolean(service.published)} />
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
