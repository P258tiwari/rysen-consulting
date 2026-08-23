import { ArrowUpRight, Check, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import type { CaseStudy } from "../data/content";

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-rysen-ink/10 bg-white shadow-[0_24px_70px_rgba(9,9,9,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(9,9,9,0.18)]">
      <div className="relative overflow-hidden bg-rysen-ink">
        <img
          src={study.image}
          alt={study.imageAlt}
          className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rysen-ink/80 via-rysen-ink/5 to-transparent" />
        <p className="absolute bottom-5 left-5 right-5 text-xs font-bold uppercase tracking-[0.2em] text-white">
          <span className="inline-flex rounded-full border border-white/20 bg-rysen-ink/70 px-3 py-2 backdrop-blur-md">
            {study.practiceArea}
          </span>
        </p>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="font-display text-[1.7rem] leading-[1.15] text-rysen-ink">{study.title}</h3>

        <div className="mt-6 rounded-xl border border-rysen-ink/10 bg-rysen-soft p-4">
          <div className="flex items-center gap-2 text-rysen-orange">
            <Target className="h-4 w-4" aria-hidden="true" />
            <h4 className="text-xs font-bold uppercase tracking-[0.18em]">Business challenge</h4>
          </div>
          <p className="mt-3 leading-7 text-rysen-charcoal/70">{study.challenge[0]}</p>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2 text-rysen-orange">
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
            <h4 className="text-xs font-bold uppercase tracking-[0.18em]">Measured impact</h4>
          </div>
          <ul className="mt-3 space-y-3">
            {study.impact.slice(0, 2).map((metric) => (
              <li key={metric} className="flex items-start gap-3 rounded-xl bg-rysen-ink px-4 py-4 text-sm font-semibold leading-6 text-white">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rysen-orange text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <span>{metric}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link
          to="/contact"
          className="mt-auto flex items-center justify-between border-t border-rysen-ink/10 pt-6 text-sm font-bold text-rysen-ink transition hover:text-rysen-orange"
        >
          Discuss a similar challenge
          <span className="grid h-10 w-10 place-items-center rounded-full bg-rysen-orange text-white transition group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </Link>
      </div>
    </article>
  );
}
