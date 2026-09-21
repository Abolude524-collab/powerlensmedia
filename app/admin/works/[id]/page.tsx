import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwner } from "../../../../lib/auth";
import { getAdminWorks } from "../../../../lib/content-db";
import EditWorkForm from "../../../../components/EditWorkForm";
import AdminNav from "../../../../components/AdminNav";
import NewWorkPage from "../new/page";

export const dynamic = "force-dynamic";

export default async function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
  await requireOwner();
  const { id } = await params;
  
  if (id === "new") {
    return <NewWorkPage />;
  }

  const work = (await getAdminWorks()).find((entry) => entry._id === id);
  if (!work) notFound();
  return (
    <main className="min-h-screen bg-[#0e0e0e] px-5 py-8 text-[#e5e2e1] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <AdminNav />
        <Link href="/admin" className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white">
          Back to works
        </Link>
        <header className="mb-8 mt-6 border-b border-neutral-800 pb-6">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">Archive entry</p>
          <h1 className="text-4xl font-extrabold uppercase tracking-tight text-white">Edit work</h1>
        </header>
        <div className="border border-neutral-800 bg-[#151515] p-6">
          <EditWorkForm work={work} />
        </div>
      </div>
    </main>
  );
}