"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";

export type Role = "editor" | "viewer" | null;

interface AuthContextType {
  user: User | null;
  role: Role;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  signIn: async () => { },
  logOut: async () => { },
});

const EDITORS = [
  "kunal.r@ramcosteels.com",
  "kamal.sharma@ramcosteels.com",
  "imfarhan0105@gmail.com"
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        const email = firebaseUser.email.toLowerCase();

        if (email.endsWith("@ramcosteels.com") || EDITORS.includes(email)) {
          setUser(firebaseUser);
          setRole(EDITORS.includes(email) ? "editor" : "viewer");
        } else {

          signOut(auth);
          setUser(null);
          setRole(null);
          alert("Unauthorized access. Must use a @ramcosteels.com email.");
        }
      } else {
        setUser(null);
        setRole(null);
        if (pathname !== "/login") {
          router.push("/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logOut = async () => {
    if (!isConfigured) return;
    await signOut(auth);
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--industrial-bg)] text-[var(--steel-light)] p-6 text-center">
        <h1 className="font-display text-3xl mb-4 text-[#ff4d4d]">FIREBASE KEYS MISSING</h1>
        <p className="font-mono-industrial max-w-md text-sm leading-relaxed mb-6">
          The application has been successfully migrated to Firebase, but it cannot connect to the database.
          Please add your <span className="text-[var(--accent-cyan)]">NEXT_PUBLIC_FIREBASE_*</span> keys to a <span className="text-[var(--accent-cyan)]">.env.local</span> file in the root directory and restart the development server.
        </p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
