import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Node Not Found — OEE Command Center",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#08090b] px-6 text-center">
      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-20" />

      {/* Animated scan line */}
      <div
        className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#4fd1ff]/40 to-transparent"
        style={{ animation: "scanLine 4s linear infinite", top: "30%" }}
      />

      <style>{`
        @keyframes scanLine {
          0%   { top: 0%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes flicker {
          0%, 95%, 100% { opacity: 1; }
          96% { opacity: 0.4; }
          97% { opacity: 1; }
          98% { opacity: 0.3; }
        }
      `}</style>

      <div className="relative z-10 max-w-xl">
        {/* Error code */}
        <p className="font-mono-industrial text-sm tracking-[0.4em] text-[#4fd1ff]">
          SIGNAL LOST · CODE 404
        </p>

        {/* Big 404 */}
        <div
          className="font-display mt-4 text-[10rem] font-bold leading-none text-[#e2e8f0] sm:text-[14rem]"
          style={{ animation: "flicker 6s ease-in-out infinite" }}
        >
          404
        </div>

        {/* Message */}
        <h1 className="font-display mt-2 text-3xl font-semibold text-[#e2e8f0] sm:text-4xl">
          NODE NOT FOUND
        </h1>
        <p className="mt-4 font-mono-industrial text-sm text-[#8c95a3]">
          The industrial node you requested does not exist or has been decommissioned.
          Return to the command center.
        </p>

        {/* Status strip */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#ff4d4d]" style={{ boxShadow: "0 0 8px #ff4d4d" }} />
          <span className="font-mono-industrial text-xs tracking-[0.25em] text-[#ff4d4d]">
            CONNECTION TERMINATED
          </span>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="mt-10 inline-block rounded-md border border-[#4fd1ff]/40 bg-[#4fd1ff]/5 px-8 py-3 font-mono-industrial text-sm tracking-[0.2em] text-[#4fd1ff] transition-all duration-200 hover:border-[#4fd1ff]/80 hover:bg-[#4fd1ff]/10 hover:shadow-lg hover:shadow-[#4fd1ff]/10"
        >
          ← RETURN TO COMMAND CENTER
        </Link>
      </div>
    </main>
  );
}
