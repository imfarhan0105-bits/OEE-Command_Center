"use client";

import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface CombinedPoint {
  label: string;
  oee: number;
  downtime: number;
}

export default function OEEvsDowntimeChart({ data }: { data: CombinedPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="#1c1f24" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "#5b6270", fontSize: 11 }} axisLine={{ stroke: "#24282f" }} tickLine={false} />
        <YAxis yAxisId="left" tick={{ fill: "#5b6270", fontSize: 11 }} axisLine={false} tickLine={false} domain={[60, 100]} unit="%" />
        <YAxis yAxisId="right" orientation="right" tick={{ fill: "#5b6270", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: "#101216", border: "1px solid #24282f", borderRadius: 6, fontSize: 12 }} />
        <Bar yAxisId="right" dataKey="downtime" name="DOWNTIME (MIN)" fill="#ff4d4d" opacity={0.35} radius={[3, 3, 0, 0]} />
        <Line yAxisId="left" type="monotone" dataKey="oee" name="OEE" stroke="#4fd1ff" strokeWidth={2.5} dot={{ r: 3 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
