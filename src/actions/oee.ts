import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { calculateOEE } from "@/lib/oee";

export async function upsertMonthlyOEE({
  plantSlug,
  year,
  month,
  availability,
  performance,
  quality,
}: {
  plantSlug: string;
  year: number;
  month: number;
  availability: number;
  performance: number;
  quality: number;
}) {
  const oee = calculateOEE(availability, performance, quality);
  const id = `${plantSlug}_${year}_${month}`;
  
  const docRef = doc(db, "monthly_oee", id);
  const snap = await getDoc(docRef);
  
  if (snap.exists()) {
    await setDoc(docRef, {
      availability,
      performance,
      quality,
      oee,
    }, { merge: true });
  } else {
    await setDoc(docRef, {
      plantSlug,
      year,
      month,
      availability,
      performance,
      quality,
      oee,
      totalDowntime: 0
    });
  }
}
