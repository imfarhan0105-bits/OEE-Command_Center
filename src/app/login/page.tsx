"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const Logo3D = dynamic(() => import("@/components/three/Logo3D"), { ssr: false });

export default function LoginPage() {
  const { user, loading, signInAsEditor, signInAsGuest } = useAuth();
  const router = useRouter();

  // ── Editor form state
  const [editorEmail, setEditorEmail] = useState("");
  const [editorPassword, setEditorPassword] = useState("");
  const [editorError, setEditorError] = useState("");
  const [editorLoading, setEditorLoading] = useState(false);
  const [showEditorPass, setShowEditorPass] = useState(false);

  // ── Guest form state
  const [guestPassword, setGuestPassword] = useState("");
  const [guestError, setGuestError] = useState("");
  const [guestLoading, setGuestLoading] = useState(false);
  const [showGuestPass, setShowGuestPass] = useState(false);

  useEffect(() => {
    if (user && !loading) router.push("/");
  }, [user, loading, router]); 

  async function handleEditorSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEditorError("");
    setEditorLoading(true);
    const result = await signInAsEditor(editorEmail, editorPassword);
    if (!result.success) {
      setEditorError(result.error ?? "Login failed.");
      setEditorLoading(false);
    }
  }

  async function handleGuestSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGuestError("");
    setGuestLoading(true);
    const result = await signInAsGuest(guestPassword);
    if (!result.success) {
      setGuestError(result.error ?? "Incorrect password.");
      setGuestLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--industrial-bg)] px-4 py-10">
      {/* Background glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,209,255,0.06)_0%,transparent_70%)]"
      />
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/50 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Card */}
        <div className="glass-panel rounded-2xl border border-[var(--industrial-line)]/60 p-8 md:p-12 shadow-2xl shadow-black/60">

          {/* Logo + Title */}
          <div className="flex flex-col items-center">
            <Logo3D className="h-28 w-52 overflow-visible" />
            <h1 className="font-display mt-4 text-2xl font-bold tracking-wide text-[var(--steel-light)]">
              OEE COMMAND CENTER
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-px w-10 bg-[var(--accent-cyan)]/40" />
              <p className="font-mono-industrial text-[10px] tracking-[0.3em] text-[var(--accent-cyan)]">
                RESTRICTED ACCESS
              </p>
              <div className="h-px w-10 bg-[var(--accent-cyan)]/40" />
            </div>
          </div>

          {/* ── EDITOR ACCESS ── */}
          <form onSubmit={handleEditorSubmit} className="mt-10 space-y-3">
            <p className="font-mono-industrial text-xs tracking-[0.25em] text-[var(--accent-cyan)]">
              EDITOR ACCESS
            </p>
            <p className="font-mono-industrial text-[10px] text-[var(--steel)] mb-3">
              Full read + write access to all plant data.
            </p>

            {/* Email */}
            <div className="relative">
              <input
                id="editor-email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
                value={editorEmail}
                onChange={(e) => { setEditorEmail(e.target.value); setEditorError(""); }}
                required
                className="w-full rounded-md border border-[var(--industrial-line)] bg-[var(--industrial-panel)] px-4 py-3 font-mono-industrial text-sm text-[var(--steel-light)] placeholder-[var(--steel)] outline-none transition focus:border-[var(--accent-cyan)]/60 focus:ring-1 focus:ring-[var(--accent-cyan)]/20"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                id="editor-password"
                type={showEditorPass ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={editorPassword}
                onChange={(e) => { setEditorPassword(e.target.value); setEditorError(""); }}
                required
                className="w-full rounded-md border border-[var(--industrial-line)] bg-[var(--industrial-panel)] px-4 py-3 pr-12 font-mono-industrial text-sm text-[var(--steel-light)] placeholder-[var(--steel)] outline-none transition focus:border-[var(--accent-cyan)]/60 focus:ring-1 focus:ring-[var(--accent-cyan)]/20"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowEditorPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--steel)] hover:text-[var(--steel-light)]"
                aria-label={showEditorPass ? "Hide password" : "Show password"}
              >
                {showEditorPass ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>

            {/* Editor error */}
            <AnimatePresence>
              {editorError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-mono-industrial text-xs text-[var(--accent-bad)]"
                >
                  ✕ {editorError}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              id="editor-submit"
              type="submit"
              disabled={editorLoading}
              className="w-full rounded-md bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/40 py-3 font-mono-industrial text-sm tracking-[0.15em] text-[var(--accent-cyan)] transition-all duration-200 hover:bg-[var(--accent-cyan)]/20 hover:border-[var(--accent-cyan)]/70 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editorLoading ? "AUTHENTICATING..." : "SIGN IN AS EDITOR →"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[var(--industrial-line)]" />
            <span className="font-mono-industrial text-[10px] tracking-[0.3em] text-[var(--steel)]">OR</span>
            <div className="h-px flex-1 bg-[var(--industrial-line)]" />
          </div>

          {/* ── GUEST ACCESS ── */}
          <form onSubmit={handleGuestSubmit} className="space-y-3">
            <p className="font-mono-industrial text-xs tracking-[0.25em] text-[var(--accent-warn)]">
              GUEST ACCESS
            </p>
            <p className="font-mono-industrial text-[10px] text-[var(--steel)] mb-3">
              View-only access. No email required. Enter the shared guest password.
            </p>

            <div className="relative">
              <input
                id="guest-password"
                type={showGuestPass ? "text" : "password"}
                autoComplete="off"
                placeholder="Enter guest password"
                value={guestPassword}
                onChange={(e) => { setGuestPassword(e.target.value); setGuestError(""); }}
                required
                className="w-full rounded-md border border-[var(--industrial-line)] bg-[var(--industrial-panel)] px-4 py-3 pr-12 font-mono-industrial text-sm text-[var(--steel-light)] placeholder-[var(--steel)] outline-none transition focus:border-[var(--accent-warn)]/60 focus:ring-1 focus:ring-[var(--accent-warn)]/20"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowGuestPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--steel)] hover:text-[var(--steel-light)]"
              >
                {showGuestPass ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>

            {/* Guest error */}
            <AnimatePresence>
              {guestError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-mono-industrial text-xs text-[var(--accent-bad)]"
                >
                  ✕ {guestError}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              id="guest-submit"
              type="submit"
              disabled={guestLoading}
              className="w-full rounded-md bg-[var(--accent-warn)]/10 border border-[var(--accent-warn)]/30 py-3 font-mono-industrial text-sm tracking-[0.15em] text-[var(--accent-warn)] transition-all duration-200 hover:bg-[var(--accent-warn)]/20 hover:border-[var(--accent-warn)]/60 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {guestLoading ? "ENTERING..." : "ENTER AS GUEST →"}
            </button>
          </form>

          {/* Footer note */}
          <p className="mt-8 text-center font-mono-industrial text-[10px] leading-relaxed text-[var(--steel)] opacity-60">
            Authorised personnel only. All access is session-scoped.
          </p>
        </div>
      </motion.div>
    </main>
  );
}
