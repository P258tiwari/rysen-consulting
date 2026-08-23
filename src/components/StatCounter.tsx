import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

type StatCounterProps = {
  value: number;
  suffix?: string;
  label: string;
};

export function StatCounter({ value, suffix = "", label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const totalFrames = 44;
    const timer = window.setInterval(() => {
      frame += 1;
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
      setCount(Math.round(value * progress));
      if (frame >= totalFrames) window.clearInterval(timer);
    }, 24);
    return () => window.clearInterval(timer);
  }, [inView, value]);

  return (
    <div ref={ref} className="min-h-28 rounded-lg border border-white/10 bg-white/10 p-5 backdrop-blur">
      <div className="font-display text-4xl text-white">
        {count}
        {suffix}
      </div>
      <p className="mt-2 text-sm font-medium text-white/75">{label}</p>
    </div>
  );
}
