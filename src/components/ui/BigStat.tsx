"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { ComparisonSnapshot } from "@/types";
import clsx from "clsx";

interface BigStatProps {
  label: string;
  value: number;
  suffix?: string;
  comparison?: ComparisonSnapshot;
  size?: "lg" | "xl";
}

export default function BigStat({ label, value, suffix = "%", comparison, size = "xl" }: BigStatProps) {
  const animated = useCountUp(value, 1400, 1);

  return (
    <div>
      <p className="font-mono-industrial text-[11px] tracking-[0.3em] text-[#5b6270]">{label}</p>
      <div
        className={clsx(
          "font-display font-semibold text-[#f1f3f5] leading-none",
          size === "xl" ? "text-7xl sm:text-8xl" : "text-5xl sm:text-6xl"
        )}
      >
        {animated.toFixed(1)}
        <span className="text-[0.35em] text-[#5b6270]">{suffix}</span>
      </div>
      {comparison && (
        <div
          className={clsx(
            "mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono-industrial text-xs",
            comparison.direction === "up" && "border-[#3ddc84]/30 text-[#3ddc84]",
            comparison.direction === "down" && "border-[#ff4d4d]/30 text-[#ff4d4d]",
            comparison.direction === "flat" && "border-white/10 text-[#8a929e]"
          )}
        >
          {comparison.direction === "up" ? "↑" : comparison.direction === "down" ? "↓" : "→"}
          {Math.abs(comparison.deltaAbsolute).toFixed(1)}%
        </div>
      )}
    </div>
  );
}
