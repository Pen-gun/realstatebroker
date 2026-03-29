"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        router.replace("/dashboard");
      }
    };

    void bootstrap();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to create account.");
        return;
      }

      setSuccess("Account created successfully");
      router.push("/dashboard");
    } catch {
      setError("Network error. Please check if the API is running.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-5 py-8 sm:px-8">
      <section className="grid w-full gap-8 rounded-3xl border border-[#e7dfd2] bg-[#fffaf2] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.08)] sm:p-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <p className="inline-flex rounded-full bg-teal-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-teal-800">
            Buyer Portal
          </p>
          <h1 className="text-4xl leading-tight text-slate-900 sm:text-5xl">Sign up</h1>
          <p className="max-w-md text-sm leading-7 text-slate-500 sm:text-base">
            Create your account and start managing your favourite properties.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#e7dfd2] bg-white p-5 sm:p-6">
          <label className="block text-sm text-slate-700">
            Name
            <input
              name="name"
              autoComplete="name"
              className="mt-1 w-full rounded-xl border border-[#e7dfd2] px-3 py-2 focus-visible:ring-2 focus-visible:ring-teal-500"
              placeholder="Riya Sharma…"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label className="block text-sm text-slate-700">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              className="mt-1 w-full rounded-xl border border-[#e7dfd2] px-3 py-2 focus-visible:ring-2 focus-visible:ring-teal-500"
              placeholder="buyer@example.com…"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block text-sm text-slate-700">
            Password
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              className="mt-1 w-full rounded-xl border border-[#e7dfd2] px-3 py-2 focus-visible:ring-2 focus-visible:ring-teal-500"
              placeholder="Create password…"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          {success ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-slate-50 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Please wait…" : "Create account"}
          </button>

          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-teal-700 underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
