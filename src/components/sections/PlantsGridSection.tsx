"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PLANTS } from "@/data/plants";
import { oeeStatus, STATUS_COLORS } from "@/lib/oee";
import dynamic from "next/dynamic";

const PlantHero3D = dynamic(() => import("@/components/plant/PlantHero3D"), {
  ssr: false,
  loading: () => <div className="h-32 w-full rounded bg-[#15171b]" />,
});

import { getAllPlantsLatestOEE } from "@/services/oeeService";

type PlantRow = { slug: string; oee: number };

export default function PlantsGridSection({ serverLatest }: { serverLatest?: PlantRow[] }) {
  const [latestByPlant, setLatestByPlant] = useState<Record<string, number>>(
    serverLatest ? Object.fromEntries(serverLatest.map(v => [v.slug, v.oee])) : {}
  );

  useEffect(() => {
    if (serverLatest && serverLatest.length > 0) return; // already have server data
    getAllPlantsLatestOEE()
      .then((data) => {
        const entries = data.map((v) => [v.slug, v.oee] as const);
        setLatestByPlant(Object.fromEntries(entries));
      })
      .catch(console.error);
  }, [serverLatest]);

  return (
    <section id="plants" className="relative border-t border-[var(--industrial-line)] bg-[var(--industrial-bg)] px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="font-mono-industrial text-lg tracking-[0.2em] text-[var(--accent-cyan)]">ENTER THE PLANTS</p>
        <h2 className="font-display mt-2 text-4xl font-semibold text-[var(--steel-light)] sm:text-6xl">INDUSTRIAL NODES</h2>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLANTS.map((plant) => {
            const oee = latestByPlant[plant.slug] ?? 0;
            const status = oeeStatus(oee);
            const color = oee > 0 ? STATUS_COLORS[status] : STATUS_COLORS.neutral;
            return (
              <Link
                key={plant.slug}
                href={`/plants/${plant.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-[var(--industrial-line)] bg-[var(--industrial-panel)] p-7 transition-all duration-300 hover:border-[var(--steel)] hover:shadow-xl hover:shadow-[var(--accent-cyan)]/5 hover:-translate-y-1"
              >
                <div
                  className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-10"
                  style={{ background: color }}
                />
                <p className="font-mono-industrial text-xs font-bold tracking-[0.15em] text-[var(--steel)] relative z-10">
                  {plant.group === "sector-25" ? "SECTOR 25" : plant.group === "sector-69" ? "SECTOR 69" : "INDIVIDUAL UNIT"}
                </p>
                <h3 className="font-display mt-2 text-2xl font-semibold text-[var(--steel-light)] relative z-10">{plant.name}</h3>

                <div className="relative z-0 mt-4 h-32 w-full overflow-visible opacity-60 transition-opacity duration-300 group-hover:opacity-100">
                  <PlantHero3D kind={plant.kind} />
                </div>

                <p className="mt-4 text-sm text-[var(--steel-light)] relative z-10">{plant.description}</p>

                <div className="mt-8 flex items-end justify-between">
                  <div>
                    <p className="font-mono-industrial text-xs tracking-[0.15em] text-[var(--steel)]">LATEST OEE</p>
                    <p className="font-display text-4xl font-semibold" style={{ color }}>
                      {oee > 0 ? oee.toFixed(1) : "—"}
                      <span className="text-lg text-[var(--steel)]">%</span>
                    </p>
                  </div>
                  <span className="font-mono-industrial text-xs text-[var(--steel)] transition-colors group-hover:text-[var(--steel-light)]">
                    OPEN DASHBOARD →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
