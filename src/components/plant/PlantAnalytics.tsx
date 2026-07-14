"use client";

import { OEETrendPoint, DowntimeData } from "@/types";
import { compare, monthLabel } from "@/lib/oee";
import OEETrendChart from "@/components/charts/OEETrendChart";
import APQTrendChart from "@/components/charts/APQTrendChart";
import MoMChangeChart from "@/components/charts/MoMChangeChart";
import ComponentComparisonChart from "@/components/charts/ComponentComparisonChart";
import DowntimePieChart from "@/components/charts/DowntimePieChart";
// import OEEvsDowntimeChart from "@/components/charts/OEEvsDowntimeChart";

interface PlantAnalyticsProps {
  trend: OEETrendPoint[];
  downtimeSeries: DowntimeData[];
  currentDowntime?: DowntimeData;
}

export default function PlantAnalytics({ trend, downtimeSeries, currentDowntime }: PlantAnalyticsProps) {
  if (!trend.length) return null;
  const latest = trend[trend.length - 1];
  const prev = trend[trend.length - 2] ?? latest;
  const oeeCmp = compare(latest.oee, prev.oee);
  const avCmp = compare(latest.availability, prev.availability);
  const pfCmp = compare(latest.performance, prev.performance);

  const primaryDriver = Math.abs(avCmp.deltaAbsolute) >= Math.abs(pfCmp.deltaAbsolute) ? "AVAILABILITY" : "PERFORMANCE";
  const primaryDelta = primaryDriver === "AVAILABILITY" ? avCmp : pfCmp;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const windowMonths = [];
  for (let i = -4; i <= 1; i++) {
    let y = currentYear;
    let m = currentMonth + i;
    if (m < 1) { m += 12; y -= 1; }
    else if (m > 12) { m -= 12; y += 1; }
    
    if (y > 2026 || (y === 2026 && m >= 6)) {
      windowMonths.push({ year: y, month: m, label: monthLabel(y, m) });
    }
  }

  const displayTrend = windowMonths.map(wm => {
    const existing = trend.find(t => t.year === wm.year && t.month === wm.month);
    return existing || { year: wm.year, month: wm.month, label: wm.label, availability: 0, performance: 0, quality: 0, oee: 0 };
  });

  const displayDowntime = windowMonths.map(wm => {
    const existing = downtimeSeries.find(d => d.year === wm.year && d.month === wm.month);
    return existing || ({ plantSlug: "" as any, year: wm.year, month: wm.month, totalMinutes: 0, categories: [] } as DowntimeData);
  });

  const displayCombined = windowMonths.map(wm => {
    const t = displayTrend.find(dt => dt.year === wm.year && dt.month === wm.month)!;
    const d = displayDowntime.find(dd => dd.year === wm.year && dd.month === wm.month)!;
    return { label: wm.label, oee: t.oee, downtime: d.totalMinutes };
  });

  return (
    <div className="space-y-16">
      <div>
        <SectionLabel>PLANT OEE ANALYTICS</SectionLabel>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard title="MONTHLY OEE TREND">
            <OEETrendChart data={displayTrend} color="#4fd1ff" />
          </ChartCard>
          <ChartCard title="A / P / Q TREND">
            <APQTrendChart data={displayTrend} />
          </ChartCard>
          <ChartCard title="MONTH-OVER-MONTH OEE CHANGE">
            <MoMChangeChart data={displayTrend} />
          </ChartCard>
          <ChartCard title="OEE COMPONENT COMPARISON">
            <ComponentComparisonChart data={displayTrend} />
          </ChartCard>
        </div>

      </div>

      <div>
        <SectionLabel accent="#ff4d4d">DOWNTIME ANALYTICS</SectionLabel>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard title="MONTHLY DOWNTIME TREND">
            <DowntimeMini data={displayDowntime} />
          </ChartCard>
          {/* <ChartCard title="OEE VS DOWNTIME">
            <OEEvsDowntimeChart data={displayCombined} />
          </ChartCard> */}
          {/* <ChartCard title="MONTH-OVER-MONTH DOWNTIME CHANGE">
            <DowntimeMoMMini data={displayDowntime} />
          </ChartCard> */}
          <ChartCard title="DOWNTIME CONSTITUTION">
            {currentDowntime?.categories.length ? (
              <DowntimePieChart categories={currentDowntime.categories} />
            ) : (
              <EmptyState label="No downtime categories recorded for this month." />
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children, accent = "#4fd1ff" }: { children: React.ReactNode; accent?: string }) {
  return (
    <p className="mb-6 font-mono-industrial text-lg tracking-[0.2em]" style={{ color: accent }}>
      {children}
    </p>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-lg p-6">
      <p className="mb-3 font-mono-industrial text-sm tracking-[0.15em] text-[var(--steel)]">{title}</p>
      {children}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div className="flex h-[280px] items-center justify-center font-mono-industrial text-sm text-[var(--steel)]">{label}</div>;
}

function DowntimeMini({ data }: { data: DowntimeData[] }) {
  const mapped = data.map((d) => ({
    year: d.year,
    month: d.month,
    label: `${d.month}/${d.year}`,
    availability: 0,
    performance: 0,
    quality: 0,
    oee: d.totalMinutes,
  }));
  const max = Math.max(...mapped.map((m) => m.oee), 100);
  return <OEETrendChart data={mapped} color="#ff4d4d" domain={[0, Math.ceil(max / 100) * 100]} unit=" min" />;
}

function DowntimeMoMMini({ data }: { data: DowntimeData[] }) {
  const mapped = data.map((d) => ({
    year: d.year,
    month: d.month,
    label: `${d.month}/${d.year}`,
    availability: 0,
    performance: 0,
    quality: 0,
    oee: d.totalMinutes,
  }));
  return <MoMChangeChart data={mapped} />;
}
