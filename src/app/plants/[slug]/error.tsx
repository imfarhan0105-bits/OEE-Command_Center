"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PlantError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Plant Dashboard] Error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--industrial-bg)] px-6 text-center">
      <div className="max-w-lg">
        <p className="font-mono-industrial text-sm tracking-[0.4em] text-[#ff4d4d]">
          DATA FEED ERROR
        </p>
        <h1 className="font-display mt-4 text-4xl font-semibold text-[var(--steel-light)] sm:text-5xl">
          PLANT OFFLINE
        </h1>
        <p className="mt-4 font-mono-industrial text-sm text-[var(--steel)]">
          Unable to load data for this plant. This may be a temporary network issue.
          Your recorded data is safe in the database.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-md border border-[var(--accent-cyan)]/40 bg-[var(--accent-cyan)]/5 px-8 py-3 font-mono-industrial text-sm tracking-[0.2em] text-[var(--accent-cyan)] transition-all hover:border-[var(--accent-cyan)]/80 hover:bg-[var(--accent-cyan)]/10"
          >
            ↻ RETRY
          </button>
          <Link
            href="/"
            className="rounded-md border border-[var(--industrial-line)] px-8 py-3 font-mono-industrial text-sm tracking-[0.2em] text-[var(--steel)] transition-all hover:border-[var(--steel)] hover:text-[var(--steel-light)]"
          >
            ← ALL PLANTS
          </Link>
        </div>
      </div>
    </main>
  );
}
