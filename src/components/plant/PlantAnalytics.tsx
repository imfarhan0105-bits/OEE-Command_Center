"use client";

import { OEETrendPoint, DowntimeData } from "@/types";
import { compare } from "@/lib/oee";
import OEETrendChart from "@/components/charts/OEETrendChart";
import APQTrendChart from "@/components/charts/APQTrendChart";
import MoMChangeChart from "@/components/charts/MoMChangeChart";
import ComponentComparisonChart from "@/components/charts/ComponentComparisonChart";
import DowntimePieChart from "@/components/charts/DowntimePieChart";
import OEEvsDowntimeChart from "@/components/charts/OEEvsDowntimeChart";

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

  const combined = trend.map((t) => {
    const dt = downtimeSeries.find((d) => d.year === t.year && d.month === t.month);
    return { label: t.label, oee: t.oee, downtime: dt?.totalMinutes ?? 0 };
  });

  const primaryDriver = Math.abs(avCmp.deltaAbsolute) >= Math.abs(pfCmp.deltaAbsolute) ? "AVAILABILITY" : "PERFORMANCE";
  const primaryDelta = primaryDriver === "AVAILABILITY" ? avCmp : pfCmp;

  return (
    <div className="space-y-16">
      <div>
        <SectionLabel>PLANT OEE ANALYTICS</SectionLabel>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard title="MONTHLY OEE TREND">
            <OEETrendChart data={trend} color="#4fd1ff" />
          </ChartCard>
          <ChartCard title="A / P / Q TREND">
            <APQTrendChart data={trend} />
          </ChartCard>
          <ChartCard title="MONTH-OVER-MONTH OEE CHANGE">
            <MoMChangeChart data={trend} />
          </ChartCard>
          <ChartCard title="OEE COMPONENT COMPARISON">
            <ComponentComparisonChart data={trend} />
          </ChartCard>
        </div>

        <div className="mt-6 glass-panel rounded-lg p-6">
          <p className="font-mono-industrial text-[11px] tracking-[0.25em] text-[#4fd1ff]">
            OEE {oeeCmp.direction === "up" ? "INCREASED" : oeeCmp.direction === "down" ? "DECREASED" : "STABLE"}{" "}
            {Math.abs(oeeCmp.deltaAbsolute).toFixed(1)}% FROM {prev.label.toUpperCase()}
          </p>
          <p className="mt-2 text-sm text-[#8a929e]">
            Primary driver: <span className="text-[#c7ccd4]">{primaryDriver}</span>{" "}
            <span className={primaryDelta.direction === "up" ? "text-[#3ddc84]" : "text-[#ff4d4d]"}>
              {primaryDelta.direction === "up" ? "+" : ""}
              {primaryDelta.deltaAbsolute.toFixed(1)}%
            </span>{" "}
            · Quality remained relatively stable across the period.
          </p>
        </div>
      </div>

      <div>
        <SectionLabel accent="#ff4d4d">DOWNTIME ANALYTICS</SectionLabel>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard title="MONTHLY DOWNTIME TREND">
            <DowntimeMini data={downtimeSeries} />
          </ChartCard>
          <ChartCard title="OEE VS DOWNTIME">
            <OEEvsDowntimeChart data={combined} />
          </ChartCard>
          <ChartCard title="MONTH-OVER-MONTH DOWNTIME CHANGE">
            <DowntimeMoMMini data={downtimeSeries} />
          </ChartCard>
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
    <p className="mb-6 font-mono-industrial text-xs tracking-[0.3em]" style={{ color: accent }}>
      {children}
    </p>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-lg p-6">
      <p className="mb-3 font-mono-industrial text-[10px] tracking-[0.25em] text-[#5b6270]">{title}</p>
      {children}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div className="flex h-[280px] items-center justify-center font-mono-industrial text-xs text-[#5b6270]">{label}</div>;
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
