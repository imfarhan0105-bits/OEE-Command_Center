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
  signInAsGuest: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  signIn: async () => { },
  signInAsGuest: async () => { },
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
    const isGuest = typeof window !== 'undefined' && sessionStorage.getItem("guestMode") === "true";

    if (!isConfigured) {
      if (isGuest) {
        setUser({ email: "guest@ramcosteels.com", uid: "guest-user" } as User);
        setRole("viewer");
      } else {
        if (pathname !== "/login") {
          router.push("/login");
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const isGuest = typeof window !== 'undefined' && sessionStorage.getItem("guestMode") === "true";
      
      if (isGuest) {
        setUser({ email: "guest@ramcosteels.com", uid: "guest-user" } as User);
        setRole("viewer");
        setLoading(false);
        return;
      }

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

  const signInAsGuest = async () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem("guestMode", "true");
    }
    setUser({ email: "guest@ramcosteels.com", uid: "guest-user" } as User);
    setRole("viewer");
    router.push("/");
  };

  const logOut = async () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem("guestMode");
    }
    if (!isConfigured) {
      setUser(null);
      setRole(null);
      router.push("/login");
      return;
    }
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signInAsGuest, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
