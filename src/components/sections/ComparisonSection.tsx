"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PlantComparisonData {
  slug: string;
  name: string;
  group: string;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
  downtime: number;
}

import { getAllPlantsLatestOEE } from "@/services/oeeService";

type PlantRow = { slug: string; oee: number; availability: number; performance: number; quality: number; year: number; month: number };

function toComparisonData(rows: PlantRow[]): PlantComparisonData[] {
  return rows.map(r => ({
    slug: r.slug,
    name: r.slug.toUpperCase(),
    group: "",
    oee: r.oee,
    availability: r.availability,
    performance: r.performance,
    quality: r.quality,
    downtime: 0,
  }));
}

export default function ComparisonSection({ serverData }: { serverData?: PlantRow[] }) {
  const [data, setData] = useState<PlantComparisonData[]>(serverData ? toComparisonData(serverData) : []);

  useEffect(() => {
    if (serverData && serverData.length > 0) return; // already have server data
    getAllPlantsLatestOEE()
      .then((d) => setData(toComparisonData(d)))
      .catch(console.error);
  }, [serverData]);

  if (!data.length) return null;

  const sortedByOee = [...data].sort((a, b) => b.oee - a.oee);
  const sortedByDowntime = [...data].sort((a, b) => b.downtime - a.downtime);

  return (
    <section id="analytics" className="relative border-t border-[var(--industrial-line)] bg-[var(--industrial-bg)] px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="font-mono-industrial text-lg tracking-[0.2em] text-[var(--accent-cyan)]">EXECUTIVE COMPARISON</p>
        <h2 className="font-display mt-2 text-4xl font-semibold text-[var(--steel-light)] sm:text-6xl">
          OVERALL PLANTS ANALYSIS
        </h2>
        <p className="mt-4 font-mono-industrial text-base text-[var(--steel)] max-w-2xl">
          Cross-sectional performance comparison of all industrial nodes based on the latest operating month.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-8">
          
          <ChartCard title="OVERALL EQUIPMENT EFFECTIVENESS (OEE) %">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={sortedByOee} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--industrial-line)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--steel)" tick={{ fill: "var(--steel)", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--steel)" tick={{ fill: "var(--steel)", fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  cursor={{ fill: "var(--industrial-panel-2)", opacity: 0.5 }}
                  contentStyle={{ backgroundColor: "var(--industrial-panel)", borderColor: "var(--industrial-line)", borderRadius: "6px" }}
                  itemStyle={{ color: "var(--steel-light)" }}
                />
                <Bar dataKey="oee" fill="var(--accent-cyan)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="A / P / Q BREAKDOWN %">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={sortedByOee} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--industrial-line)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--steel)" tick={{ fill: "var(--steel)", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--steel)" tick={{ fill: "var(--steel)", fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  cursor={{ fill: "var(--industrial-panel-2)", opacity: 0.5 }}
                  contentStyle={{ backgroundColor: "var(--industrial-panel)", borderColor: "var(--industrial-line)", borderRadius: "6px" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", color: "var(--steel)" }} />
                <Bar dataKey="availability" name="Availability" fill="var(--accent-good)" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="performance" name="Performance" fill="var(--accent-warn)" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="quality" name="Quality" fill="var(--accent-cyan)" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="TOTAL DOWNTIME (MINUTES)">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={sortedByDowntime} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--industrial-line)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--steel)" tick={{ fill: "var(--steel)", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--steel)" tick={{ fill: "var(--steel)", fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "var(--industrial-panel-2)", opacity: 0.5 }}
                  contentStyle={{ backgroundColor: "var(--industrial-panel)", borderColor: "var(--industrial-line)", borderRadius: "6px" }}
                  itemStyle={{ color: "var(--accent-bad)" }}
                />
                <Bar dataKey="downtime" name="Total Minutes" fill="var(--accent-bad)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>
      </div>
    </section>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-lg p-6">
      <p className="mb-6 font-mono-industrial text-sm tracking-[0.15em] text-[var(--steel)]">{title}</p>
      {children}
    </div>
  );
}
