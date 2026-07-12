import { DowntimeCategory, DowntimeData, MonthlyOEEData, PlantSlug } from "@/types";
import { calculateOEE } from "@/lib/oee";
import { PLANTS } from "./plants";

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const MOCK_MONTHS: { year: number; month: number }[] = [
  { year: 2026, month: 1 },
  { year: 2026, month: 2 },
  { year: 2026, month: 3 },
  { year: 2026, month: 4 },
  { year: 2026, month: 5 },
  { year: 2026, month: 6 },
];

const DEFAULT_CATEGORY_NAMES = [
  'Power Cut/MAN POWER/audit',
  'Meeting/Shift Setup',
  'Training',
  'Trials/sample insp./audit',
  'Production Not Schedule/ machine shiffting (Excess Capacity)',
  'Planned Tool/ bolster setting',
  'Change Time',
  'Preventive/Predictive/ daily preventive Maintenance Time',
  'M/c Breakdown Time',
  'Tool/Insert/Die Breakdown',
  'Setup and Adjustment/Rework/BILLETS SHOT',
  'Ejector pin Breakdown',
  'Die crack Breakdown',
  'Die Correction /Die Wear/POLISH Breakdown',
  'Idling and minor stops Loss (Nos.)',
  'Reduced Speed Loss (Nos)',
];

function plantSeedBase(slug: PlantSlug): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) % 100000;
  return hash;
}

function buildMonthlyOEE(slug: PlantSlug): MonthlyOEEData[] {
  return MOCK_MONTHS.map(({ year, month }) => {
    return {
      plantSlug: slug,
      year,
      month,
      availability: 0,
      performance: 0,
      quality: 0,
      oee: 0,
    };
  });
}

function buildDowntime(slug: PlantSlug): DowntimeData[] {
  return MOCK_MONTHS.map(({ year, month }) => {
    return {
      plantSlug: slug,
      year,
      month,
      totalMinutes: 0,
      categories: DEFAULT_CATEGORY_NAMES.map((name, cIdx) => ({
        id: `${slug}-${year}-${month}-${cIdx}`,
        name,
        minutes: 0,
      })),
    };
  });
}

export const MOCK_OEE_DB: Record<PlantSlug, MonthlyOEEData[]> = PLANTS.reduce(
  (acc, p) => {
    acc[p.slug] = buildMonthlyOEE(p.slug);
    return acc;
  },
  {} as Record<PlantSlug, MonthlyOEEData[]>
);

export const MOCK_DOWNTIME_DB: Record<PlantSlug, DowntimeData[]> = PLANTS.reduce(
  (acc, p) => {
    acc[p.slug] = buildDowntime(p.slug);
    return acc;
  },
  {} as Record<PlantSlug, DowntimeData[]>
);

export const AVAILABLE_MONTHS = (() => {
  const months: { year: number; month: number }[] = [];
  for (let y = 2024; y <= 2030; y++) {
    for (let m = 1; m <= 12; m++) {
      months.push({ year: y, month: m });
    }
  }
  return months;
})();
