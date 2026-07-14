"use client";

import { useEffect } from "react";

// global-error.tsx wraps the ROOT layout — must include <html> and <body>
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[OEE Command Center] Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#08090b", color: "#e2e8f0", fontFamily: "monospace" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "1.5rem",
          }}
        >
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.4em", color: "#ff4d4d", marginBottom: "1rem" }}>
            CRITICAL FAULT · SYSTEM CORE ERROR
          </p>
          <h1 style={{ fontSize: "3rem", fontWeight: 700, margin: 0 }}>COMMAND CENTER OFFLINE</h1>
          <p style={{ marginTop: "1rem", color: "#8c95a3", maxWidth: "30rem", fontSize: "0.875rem" }}>
            A critical error has occurred at the root level. This is typically caused by a missing
            environment configuration or an unrecoverable network failure.
          </p>
          {error?.digest && (
            <p style={{ marginTop: "0.75rem", fontSize: "0.7rem", color: "#5b6270" }}>
              FAULT ID: {error.digest}
            </p>
          )}
          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
            <button
              onClick={reset}
              style={{
                border: "1px solid rgba(79,209,255,0.4)",
                background: "rgba(79,209,255,0.05)",
                color: "#4fd1ff",
                padding: "0.75rem 2rem",
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                cursor: "pointer",
                borderRadius: "6px",
              }}
            >
              ↻ RETRY
            </button>
            <a
              href="/"
              style={{
                border: "1px solid #2a2d35",
                background: "transparent",
                color: "#8c95a3",
                padding: "0.75rem 2rem",
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textDecoration: "none",
                borderRadius: "6px",
              }}
            >
              ← HOME
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
