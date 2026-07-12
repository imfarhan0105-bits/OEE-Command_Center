"use client";

import { OEETrendPoint } from "@/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, ReferenceLine } from "recharts";

export default function MoMChangeChart({ data, valueKey = "oee" }: { data: OEETrendPoint[]; valueKey?: keyof OEETrendPoint }) {
  const rows = data.slice(1).map((d, i) => {
    const prev = data[i][valueKey] as number;
    const cur = d[valueKey] as number;
    return { label: d.label, change: Math.round((cur - prev) * 10) / 10 };
  });

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={rows} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="#1c1f24" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "#5b6270", fontSize: 11 }} axisLine={{ stroke: "#24282f" }} tickLine={false} />
        <YAxis tick={{ fill: "#5b6270", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
        <ReferenceLine y={0} stroke="#24282f" />
        <Tooltip
          contentStyle={{ background: "#101216", border: "1px solid #24282f", borderRadius: 6, fontSize: 12 }}
          labelStyle={{ color: "#8a929e" }}
        />
        <Bar dataKey="change" radius={[3, 3, 3, 3]} animationDuration={900}>
          {rows.map((r, i) => (
            <Cell key={i} fill={r.change >= 0 ? "#3ddc84" : "#ff4d4d"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
