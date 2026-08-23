import { motion } from "framer-motion";

export function InfinityVisual() {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-lg bg-rysen-ink p-6 shadow-executive">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(240,112,0,0.28),transparent_32%),radial-gradient(circle_at_80%_60%,rgba(240,64,0,0.22),transparent_34%)]" />
      <motion.div
        className="absolute left-1/2 top-1/2 h-56 w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border-[22px] border-rysen-orange/75"
        animate={{ rotate: [0, 3, -2, 0], scale: [1, 1.02, 0.98, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-44 w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border-[14px] border-rysen-amber/70"
        animate={{ rotate: [0, -4, 2, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative z-10 grid h-full min-h-[370px] content-between">
        <div className="flex justify-end">
          <div className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Leadership Lab</p>
            <p className="mt-2 text-2xl font-semibold text-white">Clarity to impact</p>
          </div>
        </div>
        <div className="max-w-xs rounded-lg border border-white/10 bg-white/10 p-5 backdrop-blur">
          <p className="text-sm leading-6 text-white/70">
            Bespoke journeys combining facilitation, coaching, action learning, and measurable business outcomes.
          </p>
        </div>
      </div>
    </div>
  );
}
