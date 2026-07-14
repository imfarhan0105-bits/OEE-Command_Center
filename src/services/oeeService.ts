import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { AggregatedOEE, MonthlyOEEData, OEETrendPoint, PlantGroupSlug, PlantSlug } from "@/types";
import { monthLabel } from "@/lib/oee";

export async function getAvailableMonths() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const windowMonths = [];
  for (let i = -4; i <= 1; i++) {
    let y = currentYear;
    let m = currentMonth + i;
    if (m < 1) {
      m += 12;
      y -= 1;
    } else if (m > 12) {
      m -= 12;
      y += 1;
    }
    if (y > 2026 || (y === 2026 && m >= 6)) {
      windowMonths.push({ year: y, month: m });
    }
  }
  return windowMonths;
}

export async function getMonthlyOEEData(plantSlug: PlantSlug): Promise<MonthlyOEEData[]> {
  const q = query(
    collection(db, "monthly_oee"), 
    where("plantSlug", "==", plantSlug)
  );
  const snap = await getDocs(q);
  const data = snap.docs.map(d => d.data() as MonthlyOEEData);
  return data.sort((a, b) => (a.year - b.year) || (a.month - b.month));
}

export async function getMonthlyOEEFor(
  plantSlug: PlantSlug,
  year: number,
  month: number
): Promise<MonthlyOEEData | undefined> {
  const q = query(
    collection(db, "monthly_oee"), 
    where("plantSlug", "==", plantSlug),
    where("year", "==", year),
    where("month", "==", month)
  );
  const snap = await getDocs(q);
  if (snap.empty) return undefined;
  return snap.docs[0].data() as MonthlyOEEData;
}

export async function getOEETrend(plantSlug: PlantSlug): Promise<OEETrendPoint[]> {
  const data = await getMonthlyOEEData(plantSlug);
  return data.map((r) => ({ 
    year: r.year, 
    month: r.month, 
    label: monthLabel(r.year, r.month), 
    availability: r.availability, 
    performance: r.performance, 
    quality: r.quality, 
    oee: r.oee 
  }));
}

export async function getAggregatedGroupOEE(groupSlug: PlantGroupSlug): Promise<OEETrendPoint[]> {
  const SECTOR25 = ["sector-25-forging", "sector-25-cnc", "sector-25-vmc"];
  const IMT = ["sector-69-block-b", "sector-69-block-c", "sector-69-block-d", "sector-58", "unit-94", "unit-97"];
  const slugs = groupSlug === "sector-25" ? SECTOR25 : IMT;

  const q = query(
    collection(db, "monthly_oee"),
    where("plantSlug", "in", slugs)
  );
  
  const snap = await getDocs(q);
  const rows = snap.docs.map(d => d.data() as MonthlyOEEData);

  const availableMonths = await getAvailableMonths();

  return availableMonths.map(({ year, month }) => {
    const monthRows = rows.filter(r => r.year === year && r.month === month);
    const avg = (key: "availability" | "performance" | "quality" | "oee") =>
      monthRows.length ? Math.round((monthRows.reduce((s, r) => s + (r[key] as number), 0) / monthRows.length) * 10) / 10 : 0;
    
    return { 
      year, 
      month, 
      label: monthLabel(year, month), 
      availability: avg("availability"), 
      performance: avg("performance"), 
      quality: avg("quality"), 
      oee: avg("oee") 
    };
  });
}

export async function getLatestGroupOEE(groupSlug: PlantGroupSlug): Promise<AggregatedOEE> {
  const trend = await getAggregatedGroupOEE(groupSlug);
  if (trend.length === 0) return { groupSlug, year: 2026, month: 1, availability: 0, performance: 0, quality: 0, oee: 0 };
  const latest = trend[trend.length - 1];
  return { groupSlug, ...latest };
}

export function getPreviousMonthInfo(): { year: number; month: number; label: string } {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth(); // 0-indexed → this is already "previous month" (Jan=0 means Dec of prev year)
  if (month === 0) {
    month = 12;
    year -= 1;
  }
  const label = monthLabel(year, month);
  return { year, month, label };
}

export async function getCompanyOEE(): Promise<{ oee: number; monthLabel: string }> {
  const { year, month, label } = getPreviousMonthInfo();

  const q = query(
    collection(db, "monthly_oee"),
    where("year", "==", year),
    where("month", "==", month)
  );
  const snap = await getDocs(q);
  const rows = snap.docs.map(d => d.data() as MonthlyOEEData);

  if (rows.length === 0) return { oee: 0, monthLabel: label };

  const avgOee = Math.round((rows.reduce((s, r) => s + (r.oee || 0), 0) / rows.length) * 10) / 10;
  return { oee: avgOee, monthLabel: label };
}

export async function getAllPlantsLatestOEE() {
  const q = query(collection(db, "monthly_oee"));
  const snap = await getDocs(q);
  const allRows = snap.docs.map(d => d.data() as MonthlyOEEData);

  const latestMap = new Map<string, MonthlyOEEData>();
  for (const row of allRows) {
    const existing = latestMap.get(row.plantSlug);
    if (!existing || row.year > existing.year || (row.year === existing.year && row.month > existing.month)) {
      latestMap.set(row.plantSlug, row);
    }
  }

  return Array.from(latestMap.values()).map(r => ({
    slug: r.plantSlug,
    oee: r.oee,
    availability: r.availability,
    performance: r.performance,
    quality: r.quality,
    year: r.year,
    month: r.month
  }));
}

/** Batch-fetches all data needed by the homepage in parallel — call once from page.tsx */
export async function getHomePageData() {
  const [companyOeeResult, sector25Trend, sector69Trend, allPlantsLatest] = await Promise.all([
    getCompanyOEE(),
    getAggregatedGroupOEE("sector-25"),
    getAggregatedGroupOEE("sector-69"),
    getAllPlantsLatestOEE(),
  ]);

  return {
    companyOee: companyOeeResult.oee,
    oeeMonthLabel: companyOeeResult.monthLabel,
    sector25Trend,
    sector69Trend,
    allPlantsLatest,
  };
}
