"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
            <div className="relative mt-2">
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border border-neutral-700 bg-black px-3 py-3 pr-10 text-sm text-white outline-none focus:border-white"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
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
