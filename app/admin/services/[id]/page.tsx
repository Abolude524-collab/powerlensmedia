import { getAdminServices } from "../../../../lib/content-db";
import { requireOwner } from "../../../../lib/auth";
import AdminNav from "../../../../components/AdminNav";
import EditServiceForm from "./EditServiceForm";

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  await requireOwner();
  const { id } = await params;
  const services = await getAdminServices();
  const service = services.find((s) => s._id === id);

  if (!service) {
    return (
      <main className="min-h-screen bg-[#0e0e0e] px-5 py-8 text-[#e5e2e1] sm:px-8">
        <div className="mx-auto max-w-3xl">
          <AdminNav />
          <p className="text-rose-400">Service not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0e0e0e] px-5 py-8 text-[#e5e2e1] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <AdminNav />
        <header className="mb-8 border-b border-neutral-800 pb-6">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
            Power Lens / Control Room
          </p>
          <h1 className="text-4xl font-extrabold uppercase tracking-tight text-white font-montserrat">
            Edit Photography Service
          </h1>
        </header>
        <EditServiceForm service={service} />
      </div>
    </main>
  );
}
