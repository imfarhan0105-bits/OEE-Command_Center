import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { DowntimeData, DowntimeTrendPoint, PlantSlug } from "@/types";
import { monthLabel } from "@/lib/oee";
import { getPreviousMonthInfo } from "./oeeService";

export async function getDowntime(plantSlug: PlantSlug): Promise<DowntimeData[]> {
  const oeeQuery = query(collection(db, "monthly_oee"), where("plantSlug", "==", plantSlug));
  const oeeSnap = await getDocs(oeeQuery);
  const oeeRows = oeeSnap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      year: data.year as number,
      month: data.month as number,
      totalDowntime: data.totalDowntime as number
    };
  });

  const entriesQuery = query(collection(db, "downtime_entries"), where("plantSlug", "==", plantSlug));
  const entriesSnap = await getDocs(entriesQuery);
  
  const catSnap = await getDocs(collection(db, "downtime_categories"));
  const catMap = new Map();
  for (const doc of catSnap.docs) {
    const data = doc.data();
    catMap.set(doc.id, { name: data.name, color: data.color });
  }

  const result: DowntimeData[] = [];
  
  for (const row of oeeRows) {
    const monthlyEntries = entriesSnap.docs
      .filter(d => d.data().monthlyOeeId === row.id)
      .map(d => {
        const data = d.data();
        const cat = catMap.get(data.categoryId) || { name: "Unknown", color: "#ccc" };
        return {
          id: data.categoryId,
          name: cat.name,
          minutes: data.minutes,
          color: cat.color
        };
      });

    result.push({
      plantSlug,
      year: row.year as number,
      month: row.month as number,
      totalMinutes: (row.totalDowntime as number) || 0,
      categories: monthlyEntries
    });
  }

  return result.sort((a, b) => (a.year - b.year) || (a.month - b.month));
}

export async function getDowntimeFor(
  plantSlug: PlantSlug,
  year: number,
  month: number
): Promise<DowntimeData | undefined> {
  const data = await getDowntime(plantSlug);
  return data.find(d => d.year === year && d.month === month);
}

export async function getDowntimeTrend(plantSlug: PlantSlug): Promise<DowntimeTrendPoint[]> {
  const data = await getDowntime(plantSlug);
  return data.map((r) => ({
    year: r.year,
    month: r.month,
    label: monthLabel(r.year, r.month),
    totalMinutes: r.totalMinutes,
  }));
}

export async function getAllPlantsDowntimeLatest(): Promise<DowntimeData[]> {
  const { year, month } = getPreviousMonthInfo();

  const oeeQuery = query(
    collection(db, "monthly_oee"),
    where("year", "==", year),
    where("month", "==", month)
  );
  const oeeSnap = await getDocs(oeeQuery);
  if (oeeSnap.empty) return [];

  const oeeRows = oeeSnap.docs.map(d => ({
    id: d.id,
    plantSlug: d.data().plantSlug as PlantSlug,
    totalDowntime: d.data().totalDowntime as number
  }));

  const oeeIds = oeeRows.map(r => r.id);
  // Firestore 'in' query supports max 10 elements. We have 9 plants.
  const entriesQuery = query(collection(db, "downtime_entries"), where("monthlyOeeId", "in", oeeIds));
  const entriesSnap = await getDocs(entriesQuery);

  const catSnap = await getDocs(collection(db, "downtime_categories"));
  const catMap = new Map();
  for (const doc of catSnap.docs) {
    const data = doc.data();
    catMap.set(doc.id, { name: data.name, color: data.color });
  }

  const result: DowntimeData[] = [];

  for (const row of oeeRows) {
    const monthlyEntries = entriesSnap.docs
      .filter(d => d.data().monthlyOeeId === row.id)
      .map(d => {
        const data = d.data();
        const cat = catMap.get(data.categoryId) || { name: "Unknown", color: "#ccc" };
        return {
          id: data.categoryId,
          name: cat.name,
          minutes: data.minutes,
          color: cat.color
        };
      });

    result.push({
      plantSlug: row.plantSlug,
      year,
      month,
      totalMinutes: row.totalDowntime || 0,
      categories: monthlyEntries
    });
  }

  return result;
}
