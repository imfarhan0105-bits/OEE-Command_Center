import { ComparisonSnapshot } from "@/types";

/** Core OEE formula: Availability x Performance x Quality (all as 0-100 %) */
export function calculateOEE(availability: number, performance: number, quality: number): number {
  const oee = (availability / 100) * (performance / 100) * (quality / 100) * 100;
  return Math.round(oee * 10) / 10;
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function compare(current: number, previous: number): ComparisonSnapshot {
  const deltaAbsolute = Math.round((current - previous) * 10) / 10;
  const deltaPercent = previous === 0 ? 0 : Math.round(((current - previous) / previous) * 1000) / 10;
  const direction: ComparisonSnapshot["direction"] =
    deltaAbsolute > 0.05 ? "up" : deltaAbsolute < -0.05 ? "down" : "flat";
  return { current, previous, deltaAbsolute, deltaPercent, direction };
}

export const MONTH_LABELS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

export const MONTH_LABELS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function monthLabel(year: number, month: number): string {
  return `${MONTH_LABELS[month - 1]} ${year}`;
}

/** OEE performance -> semantic status color band, matching the industrial
 * green / amber / red data language used across the product. */
export function oeeStatus(oee: number): "good" | "warn" | "bad" {
  if (oee >= 80) return "good";
  if (oee >= 65) return "warn";
  return "bad";
}

export const STATUS_COLORS = {
  good: "#3ddc84",
  warn: "#f5a623",
  bad: "#ff4d4d",
  neutral: "#4fd1ff",
};
