"use client";

import { OEETrendPoint } from "@/types";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Dot } from "recharts";

export default function OEETrendChart({
  data,
  color = "#4fd1ff",
  domain,
  unit = "%",
}: {
  data: OEETrendPoint[];
  color?: string;
  domain?: [number, number];
  unit?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="#1c1f24" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "#5b6270", fontSize: 11, fontFamily: "ui-monospace, monospace" }}
          axisLine={{ stroke: "#24282f" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#5b6270", fontSize: 11, fontFamily: "ui-monospace, monospace" }}
          axisLine={false}
          tickLine={false}
          domain={domain ?? [60, 100]}
          unit={unit}
        />
        <Tooltip
          contentStyle={{
            background: "#101216",
            border: "1px solid #24282f",
            borderRadius: 6,
            fontFamily: "ui-monospace, monospace",
            fontSize: 12,
          }}
          labelStyle={{ color: "#8a929e" }}
          itemStyle={{ color }}
        />
        <Line
          type="monotone"
          dataKey="oee"
          stroke={color}
          strokeWidth={2.5}
          dot={(props) => {
            const isLast = props.index === data.length - 1;
            return (
              <Dot
                key={props.index}
                cx={props.cx}
                cy={props.cy}
                r={isLast ? 5 : 3}
                fill={isLast ? color : "#101216"}
                stroke={color}
                strokeWidth={2}
              />
            );
          }}
          animationDuration={1200}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
