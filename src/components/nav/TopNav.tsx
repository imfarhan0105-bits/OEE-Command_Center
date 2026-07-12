"use client";

import Link from "next/link";
import { useState } from "react";
import { PLANTS } from "@/data/plants";
import { monthLabel } from "@/lib/oee";
import dynamic from "next/dynamic";
const Logo3D = dynamic(() => import("@/components/three/Logo3D"), { 
  ssr: false,
  loading: () => <div className="h-12 w-32 md:w-40 flex-shrink-0" />
});

const LINKS = [
  { href: "/#overview", label: "OVERVIEW" },
  { href: "/#sector-25", label: "SECTOR 25" },
  { href: "/#sector-69", label: "SECTOR 69 IMT" },
  { href: "/#plants", label: "PLANTS" },
  { href: "/#analytics", label: "ANALYTICS" },
];


export default function TopNav() {
  const [switcherOpen, setSwitcherOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--industrial-line)] bg-[var(--industrial-bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <Logo3D />
          <Link href="/" className="font-display text-sm font-medium tracking-[0.2em] text-[var(--steel-light)] mt-1">
            OEE <span className="text-[var(--accent-cyan)]">COMMAND CENTER</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono-industrial text-[11px] text-[var(--steel)] transition-colors hover:text-[var(--steel-light)]"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/plants/sector-25-forging"
            className="font-mono-industrial text-[11px] text-[var(--steel)] transition-colors hover:text-[var(--steel-light)]"
          >
            DATA ENTRY
          </Link>
        </nav>

        <div className="flex items-center gap-5">
          <div className="relative">
            <button
              onClick={() => setSwitcherOpen((v) => !v)}
              className="magnetic-btn rounded-sm border border-[var(--industrial-line)] bg-[var(--industrial-panel)] px-3 py-1.5 font-mono-industrial text-[10px] text-[var(--steel-light)] hover:border-[var(--accent-cyan)] hover:bg-[var(--industrial-panel-2)]"
            >
              SWITCH PLANT
            </button>
            {switcherOpen && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-md border border-[var(--industrial-line)] bg-[var(--industrial-panel)]/95 backdrop-blur-xl">
                {PLANTS.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/plants/${p.slug}`}
                    onClick={() => setSwitcherOpen(false)}
                    className="block border-b border-[var(--industrial-line)] px-4 py-2.5 font-mono-industrial text-[11px] text-[var(--steel)] last:border-0 hover:bg-[var(--industrial-panel-2)] hover:text-[var(--accent-cyan)]"
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
