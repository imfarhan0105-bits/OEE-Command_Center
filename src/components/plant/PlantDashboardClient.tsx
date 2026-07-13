"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Plant, OEETrendPoint, DowntimeData, PlantSlug } from "@/types";
import { AVAILABLE_MONTHS } from "@/data/mockOee";
import { compare, monthLabel } from "@/lib/oee";
import MonthTimeline from "./MonthTimeline";
import OEEDataEntryForm from "./OEEDataEntryForm";
import DowntimeEntryForm from "./DowntimeEntryForm";
import PlantAnalytics from "./PlantAnalytics";
import BigStat from "@/components/ui/BigStat";
import { getOEETrend } from "@/services/oeeService";
import { getDowntime } from "@/services/downtimeService";

const PlantHero3D = dynamic(() => import("./PlantHero3D"), { ssr: false });

export default function PlantDashboardClient({ plant }: { plant: Plant }) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const initial = AVAILABLE_MONTHS.find((m) => m.year === currentYear && m.month === currentMonth) || AVAILABLE_MONTHS[AVAILABLE_MONTHS.length - 1];
  
  const [year, setYear] = useState(initial.year);
  const [month, setMonth] = useState(initial.month);
  const [trend, setTrend] = useState<OEETrendPoint[]>([]);
  const [downtimeSeries, setDowntimeSeries] = useState<DowntimeData[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedTrend, fetchedDowntime] = await Promise.all([
        getOEETrend(plant.slug as PlantSlug),
        getDowntime(plant.slug as PlantSlug)
      ]);
      setTrend(fetchedTrend ?? []);
      setDowntimeSeries(fetchedDowntime ?? []);
    } catch (e) {
      console.error("Failed to load plant data:", e);
    } finally {
      setLoading(false);
    }
  }, [plant.slug]);

  useEffect(() => {
    reload();
  }, [reload, refreshKey]);

  const selectedTrendIndex = trend.findIndex(t => t.year === year && t.month === month);
  const selectedStat = selectedTrendIndex >= 0 ? trend[selectedTrendIndex] : undefined;
  const prevStat = selectedTrendIndex > 0 ? trend[selectedTrendIndex - 1] : undefined;
  const cmp = selectedStat && prevStat ? compare(selectedStat.oee, prevStat.oee) : undefined;
  const currentDowntime = downtimeSeries.find((d) => d.year === year && d.month === month);

  function handleMonthChange(y: number, m: number) {
    setYear(y);
    setMonth(m);
  }

  function handleSaved() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <main className="bg-[var(--industrial-bg)] pt-20">
      
      <section className="relative flex min-h-[80vh] items-center overflow-hidden border-b border-[var(--industrial-line)] px-6 lg:px-10">
        <div className="absolute inset-0 grid-overlay opacity-50" />
        <div className="absolute right-0 top-0 h-full w-full sm:w-1/2">
          <PlantHero3D kind={plant.kind} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <p className="font-mono-industrial text-xs tracking-[0.35em] text-[var(--accent-cyan)]">
            {plant.group === "sector-25" ? "SECTOR 25" : plant.group === "sector-69" ? "SECTOR 69" : "INDEPENDENT"}
          </p>
          <h1 className="font-display mt-3 text-5xl font-semibold text-[var(--steel-light)] sm:text-7xl">{plant.name}</h1>
          <p className="mt-2 font-mono-industrial text-sm tracking-[0.2em] text-[var(--steel)]">OEE PERFORMANCE SYSTEM</p>
          <p className="mt-6 max-w-md text-[var(--steel)]">{plant.description}</p>

          {loading ? (
            <div className="mt-12 font-mono-industrial text-xs text-[var(--steel)] tracking-[0.2em]">LOADING DATA...</div>
          ) : selectedStat ? (
            <div className="mt-12">
              <BigStat label="RECORDED OEE PERFORMANCE" value={selectedStat.oee} comparison={cmp} />
            </div>
          ) : (
            <div className="mt-12 rounded-md border border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/5 px-6 py-4">
              <p className="font-mono-industrial text-xs tracking-[0.2em] text-[var(--accent-cyan)]">NO DATA ENTERED YET</p>
              <p className="mt-1 text-sm text-[var(--steel)]">Use the data entry form below to record OEE for this plant.</p>
            </div>
          )}
        </div>
      </section>

      <section className="border-b border-[var(--industrial-line)] px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <MonthTimeline year={year} month={month} availableMonths={AVAILABLE_MONTHS} onChange={handleMonthChange} />
        </div>
      </section>

      <section className="border-b border-[var(--industrial-line)] px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 lg:grid-cols-2">
          <OEEDataEntryForm plantSlug={plant.slug} year={year} month={month} onSaved={handleSaved} />
          <DowntimeEntryForm plantSlug={plant.slug} year={year} month={month} onSaved={handleSaved} />
        </div>
        <p className="mx-auto mt-4 max-w-[1400px] font-mono-industrial text-[10px] text-[var(--steel)]">
          Editing {monthLabel(year, month)} — data is stored permanently in the database.
        </p>
      </section>

      {!loading && (trend.length > 0 || downtimeSeries.length > 0) && (
        <section className="px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-[1400px]">
            <PlantAnalytics trend={trend} downtimeSeries={downtimeSeries} currentDowntime={currentDowntime} />
          </div>
        </section>
      )}

      {!loading && trend.length === 0 && (
        <section className="px-6 py-20 text-center lg:px-10">
          <p className="font-mono-industrial text-xs tracking-[0.3em] text-[var(--steel)]">
            CHARTS WILL APPEAR AFTER FIRST DATA ENTRY
          </p>
        </section>
      )}
    </main>
  );
}
