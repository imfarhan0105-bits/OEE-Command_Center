"use client";

import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, duration = 1200, decimals = 1): number {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);

  useEffect(() => {
    fromRef.current = value;
    startRef.current = null;
    let raf: number;

    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = fromRef.current + (target - fromRef.current) * eased;
      setValue(Math.round(next * 10 ** decimals) / 10 ** decimals);
      if (t < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);

  }, [target, duration, decimals]);

  return value;
}
