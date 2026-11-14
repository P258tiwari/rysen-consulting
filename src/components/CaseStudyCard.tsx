import { useId, useState } from "react";
import { ArrowUpRight, CheckCircle2, Lightbulb, Target, TrendingUp, X } from "lucide-react";
import { Link } from "react-router-dom";
import type { CaseStudy } from "../data/content";
import { Modal } from "./Modal";

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const sections = [
    { title: "The challenge", items: study.challenge, icon: Target, dark: false },
    { title: "The solution", items: study.solution, icon: Lightbulb, dark: false },
    { title: "Measured impact", items: study.impact, icon: TrendingUp, dark: true },
  ];

  return (
    <>
      <article className="h-full">
        <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={`Read case study: ${study.title}`} className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-rysen-ink/10 bg-white text-rysen-ink text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rysen-orange">
          <div className="relative w-full overflow-hidden bg-rysen-ink">
            <img src={study.image} alt={study.imageAlt} className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-[1.04] motion-reduce:transform-none" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-rysen-ink/70 to-transparent" />
            <span className="absolute bottom-4 left-4 right-4 text-xs font-bold uppercase tracking-[0.16em] text-white">{study.practiceArea}</span>
          </div>
          <div className="flex flex-1 flex-col p-6 sm:p-7">
            <h3 className="font-display text-[1.7rem] leading-[1.15] text-rysen-ink">{study.title}</h3>
            <p className="mt-4 line-clamp-3 leading-7 text-rysen-charcoal/75">{study.challenge[0]}</p>
            {study.impact[0] && <div className="my-6 flex items-start gap-3 rounded-xl bg-rysen-soft p-4"><TrendingUp className="mt-1 h-5 w-5 shrink-0 text-rysen-orange" aria-hidden="true" /><p className="line-clamp-3 text-sm font-semibold leading-6">{study.impact[0]}</p></div>}
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-rysen-ink/10 pt-5 text-sm font-bold">
              Read the full case study
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rysen-orange text-white"><ArrowUpRight className="h-4 w-4" aria-hidden="true" /></span>
            </div>
          </div>
        </button>
      </article>
      {open && (
        <Modal labelId={titleId} onClose={() => setOpen(false)}>
          <div className="flex max-h-[92dvh] flex-col">
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-rysen-ink/10 px-5 py-5 sm:px-8 sm:py-6">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-rysen-orange">{study.practiceArea}</p>
                <h2 id={titleId} className="mt-2 font-display text-2xl leading-tight sm:text-3xl">{study.title}</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close case study" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-rysen-ink/15 transition hover:bg-rysen-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-rysen-orange"><X className="h-5 w-5" /></button>
            </header>
            <div className="min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-8">
              <div className="grid gap-5 lg:grid-cols-3">
                {sections.map(({ title, items, icon: Icon, dark }) => (
                  <section key={title} className={`min-w-0 rounded-xl p-5 sm:p-6 ${dark ? "bg-rysen-ink text-white" : "bg-rysen-soft text-rysen-ink"}`}>
                    <Icon className="mb-4 h-6 w-6 text-rysen-orange" aria-hidden="true" />
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <ul className="mt-5 space-y-5">
                      {items.map((item, index) => <li key={index} className="flex items-start gap-3"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-rysen-orange" aria-hidden="true" /><span className={`break-words text-base leading-7 ${dark ? "text-white/85" : "text-rysen-charcoal/80"}`}>{item}</span></li>)}
                    </ul>
                  </section>
                ))}
              </div>
              <div className="mt-6 flex justify-end border-t border-rysen-ink/10 pt-6">
                <Link to="/contact" onClick={() => setOpen(false)} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-rysen-orange px-6 py-3 text-sm font-bold text-white transition hover:bg-rysen-ink">Discuss a similar challenge <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
