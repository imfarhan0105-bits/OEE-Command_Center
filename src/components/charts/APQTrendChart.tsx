"use client";

import { useState } from "react";
import { OEETrendPoint } from "@/types";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const SERIES = [
  { key: "availability", label: "AVAILABILITY", color: "#3ddc84" },
  { key: "performance", label: "PERFORMANCE", color: "#f5a623" },
  { key: "quality", label: "QUALITY", color: "#4fd1ff" },
] as const;

export default function APQTrendChart({ data }: { data: OEETrendPoint[] }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    availability: true,
    performance: true,
    quality: true,
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        {SERIES.map((s) => (
          <button
            key={s.key}
            onClick={() => setEnabled((e) => ({ ...e, [s.key]: !e[s.key] }))}
            className="magnetic-btn flex items-center gap-2 rounded-sm border border-white/10 px-3 py-1.5 font-mono-industrial text-[10px]"
            style={{
              opacity: enabled[s.key] ? 1 : 0.35,
              borderColor: enabled[s.key] ? s.color + "55" : undefined,
              color: enabled[s.key] ? s.color : "#5b6270",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
            {s.label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="#1c1f24" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#5b6270", fontSize: 11 }} axisLine={{ stroke: "#24282f" }} tickLine={false} />
          <YAxis tick={{ fill: "#5b6270", fontSize: 11 }} axisLine={false} tickLine={false} domain={[60, 100]} unit="%" />
          <Tooltip
            contentStyle={{ background: "#101216", border: "1px solid #24282f", borderRadius: 6, fontSize: 12 }}
            labelStyle={{ color: "#8a929e" }}
          />
          {SERIES.map(
            (s) =>
              enabled[s.key] && (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: s.color }}
                  animationDuration={1000}
                />
              )
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
