"use client";

import { useEffect, useState } from "react";
import { PlantSlug } from "@/types";
import { calculateOEE, monthLabel } from "@/lib/oee";
import { upsertMonthlyOEE } from "@/actions/oee";

interface OEEDataEntryFormProps {
  plantSlug: PlantSlug;
  year: number;
  month: number;
  onSaved?: () => void;
}

import { getMonthlyOEEFor } from "@/services/oeeService";

export default function OEEDataEntryForm({ plantSlug, year, month, onSaved }: OEEDataEntryFormProps) {
  const [availability, setAvailability] = useState(90);
  const [performance, setPerformance] = useState(88);
  const [quality, setQuality] = useState(97);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMonthlyOEEFor(plantSlug, year, month)
      .then((data) => {
        if (data) {
          setAvailability(data.availability);
          setPerformance(data.performance);
          setQuality(data.quality);
        } else {
          setAvailability(90);
          setPerformance(88);
          setQuality(97);
        }
      })
      .catch(console.error);
  }, [plantSlug, year, month]);

  const oee = calculateOEE(availability, performance, quality);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await upsertMonthlyOEE({ plantSlug, year, month, availability, performance, quality });
      setSaved(true);
      onSaved?.();
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="glass-panel rounded-lg p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="font-mono-industrial text-[11px] tracking-[0.3em] text-[#4fd1ff]">MONTHLY OEE DATA ENTRY</p>
          <p className="mt-1 font-display text-xl text-[#c7ccd4]">{monthLabel(year, month).toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <InputSlider label="AVAILABILITY" color="#3ddc84" value={availability} onChange={setAvailability} />
        <InputSlider label="PERFORMANCE" color="#f5a623" value={performance} onChange={setPerformance} />
        <InputSlider label="QUALITY" color="#4fd1ff" value={quality} onChange={setQuality} />
      </div>

      {/* Live OEE equation */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4 border-y border-white/[0.06] py-8 font-display text-2xl text-[#c7ccd4] sm:text-4xl">
        <EquationValue value={availability} color="#3ddc84" />
        <span className="text-[#5b6270]">×</span>
        <EquationValue value={performance} color="#f5a623" />
        <span className="text-[#5b6270]">×</span>
        <EquationValue value={quality} color="#4fd1ff" />
        <span className="text-[#5b6270]">=</span>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-5xl font-bold text-[#f1f3f5] sm:text-6xl">{oee.toFixed(1)}</span>
          <span className="text-lg text-[#5b6270]">%</span>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-md border border-[#ff4d4d]/30 bg-[#ff4d4d]/10 px-4 py-2 font-mono-industrial text-xs text-[#ff4d4d]">
          {error}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className="font-mono-industrial text-[10px] tracking-[0.25em] text-[#5b6270]">CALCULATED OEE</p>
          <p className="font-display text-3xl font-semibold text-[#f1f3f5]">{oee.toFixed(1)}%</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="magnetic-btn rounded-md border border-[#4fd1ff]/40 bg-[#4fd1ff]/10 px-6 py-3 font-mono-industrial text-xs tracking-[0.2em] text-[#4fd1ff] hover:bg-[#4fd1ff]/20 disabled:opacity-50"
        >
          {saving ? "SAVING..." : saved ? "✓ SAVED" : "SAVE MONTHLY OEE"}
        </button>
      </div>
    </div>
  );
}

function EquationValue({ value, color }: { value: number; color: string }) {
  return (
    <span style={{ color }}>
      {value.toFixed(1)}
      <span className="text-lg opacity-60">%</span>
    </span>
  );
}

function InputSlider({
  label,
  color,
  value,
  onChange,
}: {
  label: string;
  color: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono-industrial text-[10px] tracking-[0.2em] text-[#5b6270]">{label}</span>
        <span className="font-display text-lg font-medium" style={{ color }}>
          {value.toFixed(1)}%
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
        style={{ accentColor: color }}
      />
      <input
        type="number"
        min={0}
        max={100}
        step={0.1}
        value={value}
        onChange={(e) => onChange(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
        className="mt-3 w-full rounded-sm border border-white/10 bg-black/30 px-3 py-1.5 font-mono-industrial text-sm text-[#c7ccd4] outline-none focus:border-[#4fd1ff]/50"
      />
    </div>
  );
}
