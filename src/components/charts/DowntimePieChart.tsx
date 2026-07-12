"use client";

import { useState } from "react";
import { DowntimeCategory } from "@/types";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const PALETTE = ["#ff4d4d", "#f5a623", "#4fd1ff", "#3ddc84", "#a78bfa", "#f472b6", "#8a929e", "#5eead4"];

export default function DowntimePieChart({ categories }: { categories: DowntimeCategory[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const total = categories.reduce((s, c) => s + c.minutes, 0);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={categories}
            dataKey="minutes"
            nameKey="name"
            innerRadius={82}
            outerRadius={130}
            paddingAngle={2}
            animationDuration={1000}
            onMouseEnter={(_, idx) => setActiveIdx(idx)}
            onMouseLeave={() => setActiveIdx(null)}
          >
            {categories.map((c, i) => (
              <Cell
                key={c.id}
                fill={PALETTE[i % PALETTE.length]}
                stroke="#08090b"
                strokeWidth={2}
                opacity={activeIdx === null || activeIdx === i ? 1 : 0.35}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#101216", border: "1px solid #24282f", borderRadius: 6, fontSize: 12 }}
            formatter={(value, name) => {
              const v = typeof value === "number" ? value : Number(value) || 0;
              return [`${v} min (${((v / total) * 100).toFixed(1)}%)`, String(name)];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono-industrial text-[10px] tracking-[0.25em] text-[#5b6270]">TOTAL DOWNTIME</span>
        <span className="font-display text-3xl font-semibold text-[#f1f3f5]">{total.toLocaleString()}</span>
        <span className="font-mono-industrial text-[10px] text-[#5b6270]">MIN</span>
      </div>
    </div>
  );
}
