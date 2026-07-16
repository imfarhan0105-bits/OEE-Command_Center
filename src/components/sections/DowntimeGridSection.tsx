"use client";

import { useEffect, useState } from "react";
import { PLANTS } from "@/data/plants";
import { DowntimeData } from "@/types";
import { getAllPlantsDowntimeLatest } from "@/services/downtimeService";
import DowntimePieChart from "@/components/charts/DowntimePieChart";

export default function DowntimeGridSection({ serverDowntimeData }: { serverDowntimeData?: DowntimeData[] }) {
  const [dataByPlant, setDataByPlant] = useState<Record<string, DowntimeData>>(
    serverDowntimeData ? Object.fromEntries(serverDowntimeData.map(v => [v.plantSlug, v])) : {}
  );

  useEffect(() => {
    if (serverDowntimeData && serverDowntimeData.length > 0) return; // already have server data
    getAllPlantsDowntimeLatest()
      .then((data) => {
        const entries = data.map((v) => [v.plantSlug, v] as const);
        setDataByPlant(Object.fromEntries(entries));
      })
      .catch(console.error);
  }, [serverDowntimeData]);

  return (
    <section id="downtime" className="relative border-t border-[var(--industrial-line)] bg-[var(--industrial-bg)] px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="font-mono-industrial text-lg tracking-[0.2em] text-[var(--accent-warn)]">DOWNTIME ANALYSIS IN DETAIL</p>
        <h2 className="font-display mt-2 text-4xl font-semibold text-[var(--steel-light)] sm:text-6xl">
          SYSTEM INTERRUPTIONS
        </h2>
        <p className="mt-4 font-mono-industrial text-base text-[var(--steel)] max-w-2xl">
          Breakdown of downtime categories for all industrial nodes based on the latest operating month.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLANTS.map((plant) => {
            const downtimeData = dataByPlant[plant.slug];
            const hasData = downtimeData && downtimeData.totalMinutes > 0 && downtimeData.categories.length > 0;

            return (
              <div
                key={plant.slug}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-[var(--industrial-line)] bg-[var(--industrial-panel)] p-7 transition-all duration-300 hover:border-[var(--steel)] hover:shadow-xl hover:shadow-[var(--accent-warn)]/5 hover:-translate-y-1"
              >
                <div
                  className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-10"
                  style={{ background: "var(--accent-warn)" }}
                />
                
                <div className="mb-6">
                  <p className="font-mono-industrial text-xs font-bold tracking-[0.15em] text-[var(--steel)] relative z-10">
                    {plant.group === "sector-25" ? "SECTOR 25" : plant.group === "sector-69" ? "SECTOR 69" : "INDIVIDUAL UNIT"}
                  </p>
                  <h3 className="font-display mt-2 text-2xl font-semibold text-[var(--steel-light)] relative z-10">{plant.name}</h3>
                </div>

                <div className="relative z-10 flex-1 flex flex-col justify-center">
                  {hasData ? (
                    <DowntimePieChart categories={downtimeData.categories} />
                  ) : (
                    <div className="flex h-[320px] items-center justify-center rounded-lg border border-dashed border-[var(--industrial-line)] bg-[#0c0e12]">
                      <div className="text-center">
                        <span className="font-mono-industrial text-xs tracking-[0.1em] text-[var(--steel)]">No Downtime data filled yet</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
