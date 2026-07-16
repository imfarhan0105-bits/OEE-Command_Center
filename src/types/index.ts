

export type PlantSlug =
  | "sector-25-forging"
  | "sector-25-cnc"
  | "sector-25-vmc"
  | "sector-69-block-b"
  | "sector-69-block-c"
  | "sector-69-block-d"
  | "sector-58"
  | "unit-94"
  | "unit-97";

export type PlantGroupSlug = "sector-25" | "sector-69" | "none";

export type PlantKind =
  | "forging"
  | "cnc"
  | "vmc"
  | "cnc-vmc"
  | "integrated"
  | "production-line"
  | "precision-cell"
  | "mechanical";

export interface Plant {
  slug: PlantSlug;
  name: string;
  shortName: string;
  group: PlantGroupSlug;
  kind: PlantKind;
  description: string;
}

export interface PlantGroup {
  slug: PlantGroupSlug;
  name: string;
  fullName: string;
  plantSlugs: PlantSlug[];
}

/** One calendar month of OEE inputs for a single plant. */
export interface MonthlyOEEData {
  plantSlug: PlantSlug;
  year: number;
  /** 1 - 12 */
  month: number;
  availability: number; // percentage 0-100
  performance: number; // percentage 0-100
  quality: number; // percentage 0-100
  /** Derived = availability * performance * quality / 10000. Persisted for
   * convenience but should always be re-derivable from the three inputs. */
  oee: number;
  totalDowntime?: number;
}

export interface DowntimeCategory {
  id: string;
  name: string;
  minutes: number;
}

export interface DowntimeData {
  plantSlug: PlantSlug;
  year: number;
  month: number;
  totalMinutes: number;
  categories: DowntimeCategory[];
}

export interface MonthKey {
  year: number;
  month: number; // 1-12
}

export interface OEETrendPoint {
  year: number;
  month: number;
  label: string; // "Jan 2026"
  availability: number;
  performance: number;
  quality: number;
  oee: number;
}

export interface DowntimeTrendPoint {
  year: number;
  month: number;
  label: string;
  totalMinutes: number;
}

export interface AggregatedOEE {
  groupSlug: PlantGroupSlug;
  year: number;
  month: number;
  availability: number;
  performance: number;
  quality: number;
  oee: number;
}

export interface ComparisonSnapshot {
  current: number;
  previous: number;
  deltaAbsolute: number;
  deltaPercent: number;
  direction: "up" | "down" | "flat";
}