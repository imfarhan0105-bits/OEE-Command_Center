"use client";

import { OEETrendPoint } from "@/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

export default function ComponentComparisonChart({ data }: { data: OEETrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="#1c1f24" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "#5b6270", fontSize: 11 }} axisLine={{ stroke: "#24282f" }} tickLine={false} />
        <YAxis tick={{ fill: "#5b6270", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
        <Tooltip
          contentStyle={{ background: "#101216", border: "1px solid #24282f", borderRadius: 6, fontSize: 12 }}
          labelStyle={{ color: "#8a929e" }}
        />
        <Legend wrapperStyle={{ fontSize: 11, fontFamily: "ui-monospace, monospace", color: "#8a929e" }} />
        <Bar dataKey="availability" name="AVAILABILITY" fill="#3ddc84" radius={[2, 2, 0, 0]} />
        <Bar dataKey="performance" name="PERFORMANCE" fill="#f5a623" radius={[2, 2, 0, 0]} />
        <Bar dataKey="quality" name="QUALITY" fill="#4fd1ff" radius={[2, 2, 0, 0]} />
        <Bar dataKey="oee" name="OEE" fill="#c7ccd4" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
