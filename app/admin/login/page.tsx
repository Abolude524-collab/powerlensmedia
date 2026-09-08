"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      setError((await response.json()).error || "Unable to sign in.");
      setBusy(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#0e0e0e] px-6 py-12 text-[#e5e2e1]">
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">Power Lens / Private Archive</p>
        <h1 className="mb-10 text-4xl font-extrabold uppercase tracking-tight text-white">Owner sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-5 border border-neutral-800 bg-[#151515] p-6 shadow-2xl">
          <label className="block text-xs uppercase tracking-widest text-neutral-400">
            Email
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full border border-neutral-700 bg-black px-3 py-3 text-sm text-white outline-none focus:border-white" autoComplete="email" />
          </label>
          <label className="block text-xs uppercase tracking-widest text-neutral-400">
            Password
            <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full border border-neutral-700 bg-black px-3 py-3 text-sm text-white outline-none focus:border-white" autoComplete="current-password" />
          </label>
          {error && <p className="text-sm text-red-300" role="alert">{error}</p>}
          <button disabled={busy} className="w-full bg-white px-4 py-3 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-neutral-200 disabled:cursor-wait disabled:opacity-60">
            {busy ? "Checking access..." : "Enter archive"}
          </button>
        </form>
      </div>
    </main>
  );
}
