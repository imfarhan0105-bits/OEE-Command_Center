"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[OEE Command Center] Runtime error:", error);
  }, [error]);

  const isNetworkError =
    error?.message?.toLowerCase().includes("network") ||
    error?.message?.toLowerCase().includes("fetch") ||
    error?.message?.toLowerCase().includes("firebase") ||
    error?.message?.toLowerCase().includes("failed to load");

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#08090b] px-6 text-center">
      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-20" />

      <style>{`
        @keyframes pulse-red {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,77,77,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(255,77,77,0); }
        }
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>

      <div className="relative z-10 max-w-xl">
        {/* Alert indicator */}
        <div
          className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#ff4d4d]/40 bg-[#ff4d4d]/10"
          style={{ animation: "pulse-red 2s ease-in-out infinite" }}
        >
          <span className="font-display text-2xl font-bold text-[#ff4d4d]">!</span>
        </div>

        {/* Label */}
        <p className="font-mono-industrial text-sm tracking-[0.4em] text-[#ff4d4d]">
          {isNetworkError ? "NETWORK FAULT · FIREBASE UNREACHABLE" : "SYSTEM FAULT · RUNTIME ERROR"}
        </p>

        <h1 className="font-display mt-4 text-4xl font-semibold text-[#e2e8f0] sm:text-5xl">
          {isNetworkError ? "CONNECTION LOST" : "SYSTEM DISRUPTION"}
        </h1>

        <p className="mt-4 font-mono-industrial text-sm text-[#8c95a3]">
          {isNetworkError
            ? "Unable to reach the data network. Check your connection and try again. Data was not lost."
            : "An unexpected fault occurred in the command center. The system can attempt to recover."}
        </p>

        {/* Error digest for debugging */}
        {error?.digest && (
          <p className="mt-4 font-mono-industrial text-xs text-[#5b6270]">
            FAULT ID: {error.digest}
          </p>
        )}

        {/* Status strip */}
        <div className="mt-8 flex items-center justify-center gap-6 rounded-md border border-[#2a2d35] bg-[#15171b] px-6 py-3">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full bg-[#ff4d4d]"
              style={{ animation: "blink 1s step-end infinite" }}
            />
            <span className="font-mono-industrial text-xs tracking-[0.2em] text-[#8c95a3]">
              {isNetworkError ? "FIREBASE OFFLINE" : "PROCESS HALTED"}
            </span>
          </div>
          <div className="h-4 w-px bg-[#2a2d35]" />
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#f5a623]" />
            <span className="font-mono-industrial text-xs tracking-[0.2em] text-[#8c95a3]">
              RECOVERY AVAILABLE
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-md border border-[#4fd1ff]/40 bg-[#4fd1ff]/5 px-8 py-3 font-mono-industrial text-sm tracking-[0.2em] text-[#4fd1ff] transition-all duration-200 hover:border-[#4fd1ff]/80 hover:bg-[#4fd1ff]/10 hover:shadow-lg hover:shadow-[#4fd1ff]/10"
          >
            ↻ RETRY
          </button>
          <a
            href="/"
            className="rounded-md border border-[#2a2d35] bg-transparent px-8 py-3 font-mono-industrial text-sm tracking-[0.2em] text-[#8c95a3] transition-all duration-200 hover:border-[#8c95a3]/40 hover:text-[#e2e8f0]"
          >
            ← COMMAND CENTER
          </a>
        </div>
      </div>
    </main>
  );
}
