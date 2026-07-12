"use client";

import clsx from "clsx";
import { MONTH_LABELS } from "@/lib/oee";

interface MonthTimelineProps {
  year: number;
  month: number;
  availableMonths: { year: number; month: number }[];
  onChange: (year: number, month: number) => void;
}

export default function MonthTimeline({ year, month, availableMonths, onChange }: MonthTimelineProps) {
  const years = Array.from(new Set(availableMonths.map((m) => m.year))).sort();

  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono-industrial text-[10px] tracking-[0.25em] text-[#5b6270]">DATA PERIOD</span>
        <div className="flex gap-2">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => onChange(y, month)}
              className={clsx(
                "font-mono-industrial rounded-sm px-2 py-1 text-[10px] transition-colors",
                y === year ? "bg-[#4fd1ff]/10 text-[#4fd1ff]" : "text-[#5b6270] hover:text-[#c7ccd4]"
              )}
            >
              {y}
            </button>
          ))}
        </div>
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {MONTH_LABELS.map((label, idx) => {
          const m = idx + 1;
          const isAvailable = availableMonths.some((am) => am.year === year && am.month === m);
          const isSelected = m === month;
          return (
            <button
              key={label}
              disabled={!isAvailable}
              onClick={() => onChange(year, m)}
              className={clsx(
                "magnetic-btn min-w-[52px] rounded-md border px-3 py-2 font-mono-industrial text-[11px] transition-all",
                isSelected
                  ? "border-[#4fd1ff]/50 bg-[#4fd1ff]/10 text-[#4fd1ff] shadow-[0_0_20px_-4px_rgba(79,209,255,0.6)]"
                  : isAvailable
                  ? "border-white/10 text-[#8a929e] hover:border-white/20 hover:text-[#c7ccd4]"
                  : "border-white/[0.03] text-[#3a3e45] cursor-not-allowed"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
