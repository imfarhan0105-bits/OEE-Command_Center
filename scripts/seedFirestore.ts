import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

const PLANTS = [
  { slug: 'sector-25-forging' },
  { slug: 'sector-25-cnc' },
  { slug: 'sector-25-vmc' },
  { slug: 'sector-69-block-b' },
  { slug: 'sector-69-block-c' },
  { slug: 'sector-69-block-d' },
  { slug: 'sector-58' },
  { slug: 'unit-94' },
  { slug: 'unit-97' },
];

async function seedFirestore() {
  console.log("Seeding Firestore...");

  // Seed Categories
  const colors = ["#ff4d4f","#ff7a45","#ffa940","#ffc53d","#bae637","#7cb305","#13c2c2","#1677ff","#2f54eb","#722ed1","#eb2f96","#f5222d","#fa541c","#fa8c16","#faad14","#fadb14"];
  for (let i = 0; i < DEFAULT_CATEGORY_NAMES.length; i++) {
    const name = DEFAULT_CATEGORY_NAMES[i];
    await setDoc(doc(collection(db, "downtime_categories"), `cat-${i}`), {
      name,
      color: colors[i]
    });
  }

  // Seed zeroed data for 2024-2026
  for (const plant of PLANTS) {
    for (let year = 2024; year <= 2026; year++) {
      for (let month = 1; month <= 12; month++) {
        const id = `${plant.slug}_${year}_${month}`;
        await setDoc(doc(collection(db, "monthly_oee"), id), {
          plantSlug: plant.slug,
          year,
          month,
          availability: 0,
          performance: 0,
          quality: 0,
          oee: 0,
          totalDowntime: 0
        });

        for (let i = 0; i < DEFAULT_CATEGORY_NAMES.length; i++) {
          const entryId = `${id}_cat-${i}`;
          await setDoc(doc(collection(db, "downtime_entries"), entryId), {
            monthlyOeeId: id,
            categoryId: `cat-${i}`,
            plantSlug: plant.slug,
            year,
            month,
            minutes: 0
          });
        }
      }
    }
  }

  console.log("Firestore seeding complete!");
}

seedFirestore().catch(console.error);
