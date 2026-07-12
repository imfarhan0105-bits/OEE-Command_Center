"use client";

import { useEffect, useState } from "react";
import { PlantSlug } from "@/types";
import { monthLabel } from "@/lib/oee";
import { updateTotalDowntime, updateDowntimeEntries, upsertDowntimeCategory } from "@/actions/downtime";

interface LocalCategory {
  id: string;
  name: string;
  minutes: number;
  isNew?: boolean;
}

interface DowntimeEntryFormProps {
  plantSlug: PlantSlug;
  year: number;
  month: number;
  onSaved?: () => void;
}

const DEFAULT_CATEGORY_COLORS = [
  "#ff4d4f","#ff7a45","#ffa940","#ffc53d","#bae637",
  "#36cfc9","#40a9ff","#9254de","#f759ab","#8c8c8c",
];

function newLocalCategory(): LocalCategory {
  return { id: `new-${Math.random()}`, name: "", minutes: 0, isNew: true };
}

import { getDowntimeCategories, getDowntimeEntriesForMonth } from "@/actions/downtime";

export default function DowntimeEntryForm({ plantSlug, year, month, onSaved }: DowntimeEntryFormProps) {
  const [categories, setCategories] = useState<LocalCategory[]>([newLocalCategory()]);
  const [dbCategories, setDbCategories] = useState<{ id: string; name: string; color: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getDowntimeCategories(),
      getDowntimeEntriesForMonth(plantSlug, year, month)
    ])
      .then(([dbCats, entries]) => {
        setDbCategories(dbCats);
        if (entries && entries.length > 0) {
          setCategories(
            entries.map((c) => ({
              id: c.categoryId,
              name: c.categoryName,
              minutes: c.minutes,
              isNew: false,
            }))
          );
        } else {
          setCategories([newLocalCategory()]);
        }
      })
      .catch(console.error);
  }, [plantSlug, year, month]);

  const total = categories.reduce((s, c) => s + (c.minutes || 0), 0);

  function updateCategory(id: string, patch: Partial<LocalCategory>) {
    setCategories((cats) => cats.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function removeCategory(id: string) {
    setCategories((cats) => cats.filter((c) => c.id !== id));
  }

  function addCategory() {
    setCategories((cats) => [...cats, newLocalCategory()]);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const cleaned = categories.filter((c) => c.name.trim().length > 0);

      const resolvedCategories: { id: string; name: string; minutes: number }[] = [];
      for (const cat of cleaned) {
        if (cat.isNew) {

          const colorIdx = cleaned.indexOf(cat) % DEFAULT_CATEGORY_COLORS.length;
          const newId = await upsertDowntimeCategory({ name: cat.name, color: DEFAULT_CATEGORY_COLORS[colorIdx] });
          resolvedCategories.push({ id: newId, name: cat.name, minutes: cat.minutes });
        } else {
          resolvedCategories.push({ id: cat.id, name: cat.name, minutes: cat.minutes });
        }
      }

      await updateTotalDowntime({ plantSlug, year, month, totalMinutes: total });
      await updateDowntimeEntries({
        plantSlug,
        year,
        month,
        entries: resolvedCategories.map((c) => ({ categoryId: c.id, minutes: c.minutes })),
      });

      if (cleaned.length !== categories.length) {
        setCategories(cleaned.length > 0 ? cleaned : [newLocalCategory()]);
      }

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
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono-industrial text-[11px] tracking-[0.3em] text-[#ff4d4d]">DOWNTIME ANALYSIS</p>
          <p className="mt-1 font-display text-xl text-[#c7ccd4]">{monthLabel(year, month).toUpperCase()}</p>
        </div>
        <div className="text-right">
          <p className="font-mono-industrial text-[10px] tracking-[0.25em] text-[#5b6270]">TOTAL DOWNTIME</p>
          <p className="font-display text-3xl font-semibold text-[#f1f3f5]">
            {total.toLocaleString()} <span className="text-base text-[#5b6270]">MIN</span>
          </p>
        </div>
      </div>

      {dbCategories.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {dbCategories
            .filter((db) => !categories.some((c) => !c.isNew && c.id === db.id))
            .map((db) => (
              <button
                key={db.id}
                onClick={() => setCategories((cats) => [...cats, { id: db.id, name: db.name, minutes: 0, isNew: false }])}
                className="rounded border border-white/10 px-3 py-1 font-mono-industrial text-[10px] tracking-[0.1em] text-[#5b6270] hover:border-white/30 hover:text-[#c7ccd4]"
              >
                + {db.name}
              </button>
            ))}
        </div>
      )}

      <div className="space-y-3">
        {categories.map((c) => (
          <div key={c.id} className="flex flex-wrap items-center gap-3 rounded-md border border-white/[0.06] bg-white/[0.02] p-3 sm:flex-nowrap">
            <input
              type="text"
              placeholder="CATEGORY NAME"
              value={c.name}
              onChange={(e) => updateCategory(c.id, { name: e.target.value })}
              list="category-suggestions"
              className="min-w-[180px] flex-1 rounded-sm border border-white/10 bg-black/30 px-3 py-2 font-mono-industrial text-sm text-[#c7ccd4] outline-none focus:border-[#ff4d4d]/50"
            />
            <datalist id="category-suggestions">
              {dbCategories.map((db) => <option key={db.id} value={db.name} />)}
            </datalist>
            <input
              type="number"
              min={0}
              placeholder="MINUTES"
              value={c.minutes || ""}
              onChange={(e) => updateCategory(c.id, { minutes: parseInt(e.target.value) || 0 })}
              className="w-32 rounded-sm border border-white/10 bg-black/30 px-3 py-2 font-mono-industrial text-sm text-[#c7ccd4] outline-none focus:border-[#ff4d4d]/50"
            />
            <span className="w-16 text-right font-mono-industrial text-xs text-[#5b6270]">
              {total ? ((c.minutes / total) * 100).toFixed(1) : "0.0"}%
            </span>
            <button
              onClick={() => removeCategory(c.id)}
              className="rounded-sm border border-white/10 px-3 py-2 font-mono-industrial text-xs text-[#5b6270] hover:border-[#ff4d4d]/40 hover:text-[#ff4d4d]"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-md border border-[#ff4d4d]/30 bg-[#ff4d4d]/10 px-4 py-2 font-mono-industrial text-xs text-[#ff4d4d]">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={addCategory}
          className="magnetic-btn rounded-md border border-white/10 px-5 py-2.5 font-mono-industrial text-xs tracking-[0.15em] text-[#8a929e] hover:border-white/30 hover:text-[#c7ccd4]"
        >
          + ADD CATEGORY
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="magnetic-btn rounded-md border border-[#ff4d4d]/40 bg-[#ff4d4d]/10 px-6 py-3 font-mono-industrial text-xs tracking-[0.2em] text-[#ff4d4d] hover:bg-[#ff4d4d]/20 disabled:opacity-50"
        >
          {saving ? "SAVING..." : saved ? "✓ SAVED" : "SAVE DOWNTIME DATA"}
        </button>
      </div>
    </div>
  );
}
