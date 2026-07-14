"use client";

import { useEffect, useState } from "react";
import { PlantGroupSlug } from "@/types";
import { getPlantsInGroup } from "@/data/plants";
import { compare } from "@/lib/oee";
import BigStat from "@/components/ui/BigStat";
import OEETrendChart from "@/components/charts/OEETrendChart";
import type { OEETrendPoint } from "@/types";
import Link from "next/link";

import { getAggregatedGroupOEE } from "@/services/oeeService";

export default function GroupOEESection({
  groupSlug,
  groupName,
  id,
  accent = "#4fd1ff",
  serverTrend,
}: {
  groupSlug: PlantGroupSlug;
  groupName: string;
  id: string;
  accent?: string;
  serverTrend?: OEETrendPoint[];
}) {
  const [trend, setTrend] = useState<OEETrendPoint[]>(serverTrend ?? []);
  const plants = getPlantsInGroup(groupSlug);

  useEffect(() => {
    if (serverTrend && serverTrend.length > 0) return; // already have server data
    getAggregatedGroupOEE(groupSlug)
      .then((data) => setTrend(data ?? []))
      .catch(console.error);
  }, [groupSlug, serverTrend]);

  if (!trend.length) {
    return (
      <section id={id} className="relative border-t border-white/[0.06] bg-[#08090b] px-6 py-28 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="font-mono-industrial text-xs tracking-[0.35em]" style={{ color: accent }}>
            MANUFACTURING GROUP
          </p>
          <h2 className="font-display mt-2 text-4xl font-semibold text-[#f1f3f5] sm:text-6xl">{groupName}</h2>
          <p className="mt-4 font-mono-industrial text-xs text-[#3a3e45]">
            NO DATA ENTERED YET — Enter monthly data for each plant to see group analytics.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {plants.map((p) => (
              <Link
                key={p.slug}
                href={`/plants/${p.slug}`}
                className="rounded-md border border-white/10 px-4 py-2 font-mono-industrial text-xs tracking-[0.15em] text-[#5b6270] hover:border-white/30 hover:text-[#c7ccd4]"
              >
                {p.shortName} →
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const latest = trend[trend.length - 1];
  const prev = trend[trend.length - 2] ?? latest;
  const cmp = compare(latest.oee, prev.oee);

  return (
    <section id={id} className="relative border-t border-[var(--industrial-line)] bg-[var(--industrial-bg)] px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono-industrial text-lg tracking-[0.2em]" style={{ color: accent }}>
              MANUFACTURING GROUP
            </p>
            <h2 className="font-display mt-2 text-4xl font-semibold text-[var(--steel-light)] sm:text-6xl">{groupName}</h2>
            <p className="mt-2 font-mono-industrial text-sm text-[var(--steel)]">
              {plants.map((p) => p.shortName).join(" · ")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {plants.map((p) => (
              <Link
                key={p.slug}
                href={`/plants/${p.slug}`}
                className="rounded-md border border-[var(--industrial-line)] px-4 py-2 font-mono-industrial text-xs tracking-[0.15em] text-[var(--steel)] hover:border-[var(--steel)] hover:text-[var(--steel-light)] transition-colors"
              >
                {p.shortName} →
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.4fr]">
          <div className="glass-panel rounded-lg p-8">
            <BigStat label={`${groupName} COMBINED OEE`} value={latest.oee} comparison={cmp} />
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-[var(--industrial-line)] pt-6">
              <MiniMetric label="AVAILABILITY" value={latest.availability} color="var(--accent-good)" />
              <MiniMetric label="PERFORMANCE" value={latest.performance} color="var(--accent-warn)" />
              <MiniMetric label="QUALITY" value={latest.quality} color="var(--accent-cyan)" />
            </div>
          </div>

          <div className="glass-panel rounded-lg p-8">
            <p className="mb-4 font-mono-industrial text-sm tracking-[0.2em] text-[var(--steel)]">OEE MONTHLY TREND</p>
            <OEETrendChart data={trend.slice(-6)} color={accent} />
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniMetric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <p className="font-mono-industrial text-xs tracking-[0.15em] text-[#8c95a3]">{label}</p>
      <p className="font-display text-2xl font-medium" style={{ color }}>
        {value.toFixed(1)}%
      </p>
    </div>
  );
}
