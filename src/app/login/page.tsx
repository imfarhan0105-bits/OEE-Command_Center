"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo3D from "@/components/three/Logo3D";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { user, loading, signIn, signInAsGuest } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--industrial-bg)] relative overflow-hidden">


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(79,209,255,0.08)_0%,transparent_70%)]"
      />
      <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/50 to-transparent shadow-[0_0_15px_var(--accent-cyan)]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center glass-panel p-10 md:p-14 rounded-2xl max-w-md w-full border border-[var(--industrial-line)]/50 shadow-2xl shadow-cyan-900/20 backdrop-blur-xl relative overflow-hidden group"
      >
        {/* Subtle hover glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-10 transition duration-1000 blur-lg pointer-events-none" />

        <div className="mb-6 flex w-full justify-center relative z-10">
          <Logo3D className="h-32 w-64 md:h-40 md:w-72 flex items-center justify-center overflow-visible drop-shadow-2xl" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="w-full flex flex-col items-center relative z-10"
        >
          <h1 className="font-display text-2xl md:text-3xl text-white font-bold tracking-wide mb-2 text-center drop-shadow-md">
            OEE COMMAND CENTER
          </h1>
          <div className="flex items-center gap-3 mb-10">
            <div className="h-[1px] w-8 bg-[var(--accent-cyan)]/50" />
            <p className="font-mono-industrial text-[10px] tracking-[0.25em] text-[var(--accent-cyan)] text-center font-semibold uppercase">
              Restricted Access
            </p>
            <div className="h-[1px] w-8 bg-[var(--accent-cyan)]/50" />
          </div>

          <div className="w-full space-y-4">
            <button
              onClick={signIn}
              className="w-full relative flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white py-3.5 px-6 rounded-lg font-medium border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-white/5 group/btn overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
              <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="relative z-10 text-sm tracking-wide font-semibold">Sign in with Corporate Google</span>
            </button>

            <button
              onClick={signInAsGuest}
              className="w-full relative flex items-center justify-center gap-2 bg-[var(--accent-cyan)]/10 hover:bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] py-3 px-6 rounded-lg font-medium border border-[var(--accent-cyan)]/30 hover:border-[var(--accent-cyan)]/60 transition-all duration-300 shadow-lg hover:shadow-[var(--accent-cyan)]/10"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-sm tracking-wide font-semibold">Demo Access</span>
            </button>
          </div>

          <p className="mt-8 font-mono-industrial text-[10px] text-[var(--steel)] text-center leading-relaxed opacity-70">
            System requires verified @ramcosteels.com credentials. <br />
            Unauthorized access is strictly prohibited.
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
