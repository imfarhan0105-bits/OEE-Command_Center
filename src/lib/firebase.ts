import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Only initialize Firebase if we have the config
const app = firebaseConfig.apiKey 
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : ({} as any);

const auth = firebaseConfig.apiKey ? getAuth(app) : ({} as any);
const db = firebaseConfig.apiKey ? getFirestore(app) : ({} as any);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
