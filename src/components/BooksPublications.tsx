import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function BooksPublications() {
  return (
    <section id="books-publications" className="section bg-rysen-ivory">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-8">
        <Reveal>
          <figure className="mx-auto max-w-md overflow-hidden rounded-xl bg-rysen-sand shadow-executive">
            <img src="/assets/images/your-turn-to-rise.webp" alt="Bidisha Banerjee holding her book, Your Turn to Rise" width={1080} height={1183} className="h-auto w-full" loading="lazy" decoding="async" />
          </figure>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="eyebrow">Books &amp; Publications</h2>
          <h3 className="mt-5 font-display text-4xl leading-tight text-rysen-ink sm:text-5xl lg:text-6xl">Your Turn to Rise</h3>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-rysen-charcoal/60">By Bidisha Banerjee</p>
          <div className="mt-7 space-y-5 text-base leading-8 text-rysen-charcoal/75 sm:text-lg">
            <p><em>Your Turn to Rise</em>, authored by Bidisha, brings together years of leadership experience and a deep understanding of the challenges women face in the workplace.</p>
            <p>Offering practical insights, reflections, and strategies drawn from both research and lived experience, the book addresses common career challenges, from building confidence and influence to navigating transitions, relationships, and growth opportunities.</p>
            <p>It reflects the belief that while workplace challenges remain real, every woman has the potential to navigate her own path forward and achieve lasting success.</p>
          </div>
          <a href="https://amzn.in/d/06Uh2pLy" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-rysen-ink px-7 py-4 text-sm font-bold text-white transition hover:bg-rysen-orange">Available on Amazon <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
        </Reveal>
      </div>
    </section>
  );
}
