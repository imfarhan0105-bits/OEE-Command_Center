"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CinematicCanvas = dynamic(() => import("@/components/three/CinematicCanvas"), { ssr: false });

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function HeroScrollExperience({ companyOee = 0, oeeMonthLabel = "" }: { companyOee?: number; oeeMonthLabel?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!wrapperRef.current || !pinRef.current) return;

    const st = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: pinRef.current,
      pinSpacing: false,
      scrub: 0.6,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        setProgress(self.progress);
      },
    });

    return () => st.kill();
  }, []);

  return (
    <div ref={wrapperRef} className="relative" style={{ height: "420vh" }}>
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-[#08090b]">
        <div className="absolute inset-0">
          <CinematicCanvas progressRef={progressRef} />
        </div>

        <div className="pointer-events-none absolute inset-0 grid-overlay opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

        <SceneText active={progress < 0.18} localProgress={progress / 0.18} startVisible>
          <h1 className="font-display mt-4 text-5xl font-semibold tracking-tight text-[#f1f3f5] sm:text-7xl">
            OEE COMMAND CENTER
          </h1>
          <p className="font-display mt-6 max-w-xl text-xl text-[#c7ccd4] sm:text-3xl">
            THE FACTORY. <span className="text-[#e2e8f0]">MEASURED IN REAL TIME.</span>
          </p>
        </SceneText>

        <SceneText active={progress >= 0.18 && progress < 0.38} localProgress={(progress - 0.18) / 0.2}>
          <div className="flex items-center gap-4 font-display text-3xl font-semibold text-[#c7ccd4] sm:text-5xl">
            <span className="text-[#3ddc84]">A</span>
            <span className="text-[#8c95a3]">×</span>
            <span className="text-[#f5a623]">P</span>
            <span className="text-[#8c95a3]">×</span>
            <span className="text-[#4fd1ff]">Q</span>
          </div>
          <p className="font-mono-industrial mt-4 text-base tracking-[0.25em] text-[#a0abb8]">
            AVAILABILITY × PERFORMANCE × QUALITY
          </p>
          <div className="mt-8 font-display text-7xl font-bold text-[#f1f3f5] sm:text-9xl">
            {Number(companyOee).toFixed(1)}
            <span className="text-3xl text-[#8c95a3] sm:text-5xl">%</span>
          </div>
          <p className="font-mono-industrial mt-3 text-lg tracking-[0.2em] text-[#4fd1ff]">
            OVERALL PLANT OEE{oeeMonthLabel ? ` — ${oeeMonthLabel.toUpperCase()}` : ""}
          </p>
        </SceneText>

        <SceneText active={progress >= 0.38 && progress < 0.62} localProgress={(progress - 0.38) / 0.24}>
          <p className="font-mono-industrial text-lg tracking-[0.2em] text-[#4fd1ff]">INDUSTRIAL NODES</p>
          <div className="mt-6 grid grid-cols-2 gap-10 sm:grid-cols-5 text-center">
            <div>
              <h2 className="font-display text-3xl font-semibold text-[#e2e8f0]">SECTOR 25</h2>
              <p className="mt-2 font-mono-industrial text-sm text-[#a0abb8]">FORGING · CNC · VMC</p>
            </div>
            <div>
              <h2 className="font-display text-3xl font-semibold text-[#e2e8f0]">SECTOR 69 IMT</h2>
              <p className="mt-2 font-mono-industrial text-sm text-[#a0abb8]">BLOCK B · C · D</p>
            </div>
            <div>
              <h2 className="font-display text-3xl font-semibold text-[#e2e8f0]">SECTOR 58</h2>
              <p className="mt-2 font-mono-industrial text-sm text-[#a0abb8]">PRODUCTION LINE</p>
            </div>
            <div>
              <h2 className="font-display text-3xl font-semibold text-[#e2e8f0]">UNIT 97</h2>
              <p className="mt-2 font-mono-industrial text-sm text-[#a0abb8]">MECHANICAL</p>
            </div>
            <div>
              <h2 className="font-display text-3xl font-semibold text-[#e2e8f0]">UNIT 94</h2>
              <p className="mt-2 font-mono-industrial text-sm text-[#a0abb8]">PRECISION CELL</p>
            </div>
          </div>
        </SceneText>

        {progress < 0.05 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="h-9 w-5 rounded-full border border-white/20 p-1">
              <div className="h-1.5 w-1.5 rounded-full bg-[#4fd1ff]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SceneText({
  active,
  localProgress,
  children,
  startVisible = false,
}: {
  active: boolean;
  localProgress: number;
  children: React.ReactNode;
  startVisible?: boolean;
}) {
  const fade = startVisible 
    ? Math.min(1, (1 - localProgress) * 6 + 0.15)
    : Math.min(1, localProgress * 6) * Math.min(1, (1 - localProgress) * 6 + 0.15);
  
  return (
    <div
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-150"
      style={{ opacity: active ? Math.max(0, Math.min(1, fade)) : 0 }}
    >
      {children}
    </div>
  );
}
