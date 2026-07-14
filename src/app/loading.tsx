export default function Loading() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#08090b]">
      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-20" />

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes bootPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .shimmer-bar::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(79,209,255,0.08), transparent);
          animation: shimmer 1.8s ease-in-out infinite;
        }
      `}</style>

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-sm px-6">
        {/* Logo / brand mark */}
        <div className="flex flex-col items-center gap-2">
          <p
            className="font-mono-industrial text-xs tracking-[0.5em] text-[#4fd1ff]"
            style={{ animation: "bootPulse 2s ease-in-out infinite" }}
          >
            OEE COMMAND CENTER
          </p>
          <p className="font-mono-industrial text-[10px] tracking-[0.3em] text-[#5b6270]">
            INITIALISING SYSTEM...
          </p>
        </div>

        {/* Progress bar */}
        <div className="relative h-px w-full overflow-hidden bg-[#2a2d35]">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-[#4fd1ff] to-transparent"
            style={{ width: "40%", animation: "shimmer 1.4s ease-in-out infinite" }}
          />
        </div>

        {/* Skeleton stat blocks */}
        <div className="mt-4 flex gap-4 w-full">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="shimmer-bar relative flex-1 overflow-hidden rounded-md border border-[#2a2d35] bg-[#15171b] px-3 py-4"
            >
              <div className="mb-2 h-2 w-8 rounded bg-[#2a2d35]" />
              <div className="h-6 w-12 rounded bg-[#20242b]" />
            </div>
          ))}
        </div>

        {/* Skeleton chart bar */}
        <div className="shimmer-bar relative w-full overflow-hidden rounded-md border border-[#2a2d35] bg-[#15171b] p-4">
          <div className="mb-3 h-2 w-24 rounded bg-[#2a2d35]" />
          <div className="flex items-end gap-2 h-16">
            {[60, 80, 45, 90, 70, 55].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-[#20242b]"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Node status dots */}
        <div className="flex items-center gap-3 mt-2">
          {["#3ddc84", "#f5a623", "#4fd1ff", "#3ddc84", "#f5a623"].map((c, i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: c,
                opacity: 0.5,
                animation: `bootPulse 1.6s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
