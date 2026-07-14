"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export type Role = "editor" | "viewer" | null;

export interface SessionUser {
  email: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: SessionUser | null;
  role: Role;
  loading: boolean;
  signInAsEditor: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInAsGuest: (password: string) => Promise<{ success: boolean; error?: string }>;
  logOut: () => void;
}

// ─── Credentials ────────────────────────────────────────────────────────────
// Internal-only tool. Passwords intentionally simple and human-remembered.
const EDITOR_CREDENTIALS: Record<string, { password: string; name: string }> = {
  "kunal.r@ramcosteels.com": { password: "ramco@kunal123", name: "Kunal R." },
  "kamal.sharma@ramcosteels.com": { password: "ramco@kamal123", name: "Kamal Sharma" },
  "imfarhan0105@gmail.com": { password: "ramco@farhan123", name: "Farhan" },
};

const GUEST_PASSWORD = "ramco@guest123";
const SESSION_KEY = "oee_session";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function saveSession(user: SessionUser) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function loadSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

function clearSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  signInAsEditor: async () => ({ success: false }),
  signInAsGuest: async () => ({ success: false }),
  logOut: () => { },
});

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Restore session on mount
  useEffect(() => {
    const existing = loadSession();
    if (existing) {
      setUser(existing);
    } else if (pathname !== "/login") {
      router.push("/login");
    }
    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Redirect unauthenticated users away from protected pages
  useEffect(() => {
    if (!loading && !user && pathname !== "/login") {
      router.push("/login");
    }
  }, [loading, user, pathname, router]);

  const signInAsEditor = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const normalized = email.trim().toLowerCase();
    const creds = EDITOR_CREDENTIALS[normalized];

    if (!creds) {
      return { success: false, error: "Email not recognised. Contact your system administrator." };
    }
    if (creds.password !== password) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    const session: SessionUser = { email: normalized, name: creds.name, role: "editor" };
    saveSession(session);
    setUser(session);
    router.push("/");
    return { success: true };
  };

  const signInAsGuest = async (
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (password !== GUEST_PASSWORD) {
      return { success: false, error: "Incorrect guest password." };
    }

    const session: SessionUser = { email: "guest@ramcosteels.com", name: "Guest", role: "viewer" };
    saveSession(session);
    setUser(session);
    router.push("/");
    return { success: true };
  };

  const logOut = () => {
    clearSession();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, role: user?.role ?? null, loading, signInAsEditor, signInAsGuest, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
