"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo3D from "@/components/three/Logo3D";

export default function LoginPage() {
  const { user, loading, signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--industrial-bg)] relative overflow-hidden">
      
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(79,209,255,0.05)_0%,transparent_70%)]" />
      <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/30 to-transparent" />
      
      <div className="z-10 flex flex-col items-center glass-panel p-12 rounded-xl max-w-md w-full border border-[var(--industrial-line)] shadow-2xl shadow-black/50">
        <div className="mb-8 scale-150 transform">
          <Logo3D />
        </div>
        
        <h1 className="font-display text-2xl text-[var(--steel-light)] font-semibold mb-2 text-center">
          OEE COMMAND CENTER
        </h1>
        <p className="font-mono-industrial text-xs tracking-[0.2em] text-[var(--steel)] text-center mb-10">
          RESTRICTED DIGITAL TWIN ACCESS
        </p>
        
        <button
          onClick={signIn}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 px-6 rounded-md font-medium hover:bg-gray-100 transition-colors shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Corporate Google
        </button>

        <p className="mt-8 font-mono-industrial text-[10px] text-[var(--steel)] text-center">
          Access is limited to verified @ramcosteels.com credentials.
        </p>
      </div>
    </main>
  );
}
