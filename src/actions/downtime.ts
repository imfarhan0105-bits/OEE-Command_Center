import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc, query, where, writeBatch } from "firebase/firestore";

export async function updateTotalDowntime({
  plantSlug,
  year,
  month,
  totalMinutes,
}: {
  plantSlug: string;
  year: number;
  month: number;
  totalMinutes: number;
}) {
  const id = `${plantSlug}_${year}_${month}`;
  const docRef = doc(db, "monthly_oee", id);
  const snap = await getDoc(docRef);
  
  if (snap.exists()) {
    await setDoc(docRef, { totalDowntime: totalMinutes }, { merge: true });
  } else {
    await setDoc(docRef, {
      plantSlug,
      year,
      month,
      availability: 0,
      performance: 0,
      quality: 0,
      oee: 0,
      totalDowntime: totalMinutes
    });
  }
}

export async function getDowntimeCategories(): Promise<{ id: string; name: string; color: string }[]> {
  const snap = await getDocs(collection(db, "downtime_categories"));
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name as string,
      color: data.color as string,
    };
  });
}

export async function upsertDowntimeCategory({
  name,
  color,
}: {
  name: string;
  color: string;
}): Promise<string> {
  const categoriesRef = collection(db, "downtime_categories");
  const q = query(categoriesRef, where("name", "==", name));
  const snap = await getDocs(q);
  
  if (!snap.empty) {
    const existing = snap.docs[0];
    await setDoc(doc(db, "downtime_categories", existing.id), { color }, { merge: true });
    return existing.id;
  } else {
    const id = `cat_${Date.now()}`;
    await setDoc(doc(db, "downtime_categories", id), { name, color });
    return id;
  }
}

export async function updateDowntimeEntries({
  plantSlug,
  year,
  month,
  entries,
}: {
  plantSlug: string;
  year: number;
  month: number;
  entries: { categoryId: string; minutes: number }[];
}) {
  const id = `${plantSlug}_${year}_${month}`;

  const q = query(collection(db, "downtime_entries"), where("monthlyOeeId", "==", id));
  const oldSnap = await getDocs(q);
  
  const batch = writeBatch(db);
  for (const oldDoc of oldSnap.docs) {
    batch.delete(oldDoc.ref);
  }

  for (const entry of entries) {
    if (entry.minutes > 0) {
      const entryRef = doc(collection(db, "downtime_entries"), `${id}_${entry.categoryId}`);
      batch.set(entryRef, {
        monthlyOeeId: id,
        categoryId: entry.categoryId,
        minutes: entry.minutes,
        plantSlug,
        year,
        month
      });
    }
  }
  
  await batch.commit();
}

export async function getDowntimeEntriesForMonth(plantSlug: string, year: number, month: number) {
  const id = `${plantSlug}_${year}_${month}`;
  const q = query(collection(db, "downtime_entries"), where("monthlyOeeId", "==", id));
  const snap = await getDocs(q);

  const catSnap = await getDocs(collection(db, "downtime_categories"));
  const catMap = new Map();
  for (const doc of catSnap.docs) {
    catMap.set(doc.id, doc.data().name);
  }

  return snap.docs.map(d => {
    const data = d.data();
    return {
      categoryId: data.categoryId,
      categoryName: catMap.get(data.categoryId) || "Unknown",
      minutes: data.minutes
    };
  });
}
