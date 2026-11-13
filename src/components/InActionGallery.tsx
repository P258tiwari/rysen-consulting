import { useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { inActionGallery } from "../data/inActionGallery";
import { Modal } from "./Modal";
import { Reveal } from "./Reveal";

const control = "grid h-11 w-11 shrink-0 place-items-center rounded-full border border-rysen-ink/15 transition hover:bg-rysen-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rysen-orange";

export function InActionGallery() {
  const [active, setActive] = useState<number | null>(null);
  const selected = active === null ? null : inActionGallery[active];
  const step = (direction: number) => {
    if (active === null) return;
    setActive((active + direction + inActionGallery.length) % inActionGallery.length);
  };

  return (
    <section id="in-action" className="section bg-rysen-ivory">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col justify-between gap-6 border-b border-rysen-ink/10 pb-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow">In Action</p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-rysen-ink sm:text-4xl lg:text-5xl">Leadership conversations that move people and organisations forward.</h2>
          </div>

        </Reveal>

        <div className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {inActionGallery.map((photo, index) => (
            <Reveal key={photo.src} delay={index * 0.04}>
              <button type="button" onClick={() => setActive(index)} aria-label={`View ${photo.title}`} className="group block w-full rounded-xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rysen-orange">
                <div className="relative overflow-hidden rounded-xl bg-rysen-sand">
                  <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" className="h-64 w-full object-cover object-[center_35%] transition duration-500 group-hover:scale-[1.03] motion-reduce:transform-none" />
                  <span className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full border border-white/40 bg-white/40 text-rysen-ink shadow-sm backdrop-blur-md transition group-hover:bg-white/60"><Maximize2 className="h-4 w-4" aria-hidden="true" /></span>
                </div>
                <div className="flex min-h-12 items-center justify-between gap-3 pt-2">
                  <h3 className="min-w-0 truncate text-base font-semibold leading-7 text-rysen-ink sm:text-lg">{photo.title}</h3>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-rysen-orange transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {selected && active !== null && (
        <Modal labelId="in-action-title" onClose={() => setActive(null)} className="!max-w-3xl">
          <div className="flex h-[82dvh] max-h-[44rem] flex-col" onKeyDown={(event) => {
            if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
            if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
          }}>
            <header className="flex h-24 shrink-0 items-center justify-between gap-3 px-4 sm:px-6">
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-rysen-orange">In Action &middot; {active + 1} of {inActionGallery.length}</p>
                <h2 id="in-action-title" className="truncate text-lg font-semibold sm:text-2xl">{selected.title}</h2>
              </div>
              <button type="button" className={control} onClick={() => setActive(null)} aria-label="Close In Action gallery"><X className="h-5 w-5" /></button>
            </header>
            <div className="relative min-h-0 flex-1 overflow-hidden bg-rysen-sand">
              <img src={selected.src} alt={selected.alt} width={selected.width} height={selected.height} className="absolute inset-0 h-full w-full object-cover object-[center_35%]" />
              <button type="button" className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-white/50 text-rysen-ink shadow-sm backdrop-blur-md transition hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rysen-orange sm:left-4" onClick={() => step(-1)} aria-label="Previous In Action photo"><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-white/50 text-rysen-ink shadow-sm backdrop-blur-md transition hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rysen-orange sm:right-4" onClick={() => step(1)} aria-label="Next In Action photo"><ChevronRight className="h-5 w-5" /></button>
            </div>
            <p className="h-28 shrink-0 overflow-y-auto px-4 py-4 text-sm leading-6 text-rysen-charcoal/75 sm:px-6 sm:text-base" aria-live="polite">{selected.description}</p>
          </div>
        </Modal>
      )}
    </section>
  );
}
