import { Award, Globe2 } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { credentials, industries } from "../data/content";
import { BooksPublications } from "../components/BooksPublications";
import { WorkGallery } from "../components/WorkGallery";
import { InActionGallery } from "../components/InActionGallery";

export function About() {

  return (
    <>
      <Seo
        title="About Bidisha Banerjee"
        description="Learn about Bidisha Banerjee, Founder & CEO of RYSEN Leadership and Consulting, executive coach, facilitator, talent strategist, author, and keynote speaker."
        path="/about"
      />
      <section className="page-hero">
        <div className="mx-auto grid max-w-7xl items-end gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <Reveal>
            <p className="eyebrow">About RYSEN</p>
            <h1 className="hero-title !text-4xl sm:!text-5xl lg:!text-6xl">Bidisha Banerjee</h1>
            <p className="mt-4 text-xl font-semibold text-rysen-orange">Founder &amp; CEO</p>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-white/75">
              Executive Coach, Leadership Facilitator, Talent Strategist, Author, and Keynote Speaker.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-white/10 backdrop-blur">
              <img
                src="/assets/images/bidisha-portrait-hero.webp"
                alt="Bidisha Banerjee, Founder & CEO of RYSEN"
                className="aspect-video w-full object-cover object-right"
                decoding="async"
                fetchPriority="high"
              />
              <div className="p-6">
              <Globe2 className="h-9 w-9 text-rysen-orange" aria-hidden="true" />
              <p className="mt-5 text-lg leading-8 text-white/80">
                Facilitating learning journeys for senior leaders across India and international markets including the EU, UK, US, and Gulf countries.
              </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <InActionGallery />

      <WorkGallery />

      <section className="section bg-rysen-ivory">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Bidisha Banerjee</p>
            <h2 className="mt-5 max-w-5xl font-display text-5xl leading-[1.02] text-rysen-ink sm:text-6xl lg:text-7xl">
              About Our Founder
            </h2>
            <p className="mt-5 text-xl font-semibold text-rysen-orange sm:text-2xl">Founder &amp; CEO</p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-10 flex flex-wrap gap-3">
              {["ICF PCC Certified", "Former CHRO", "Published Author", "Keynote Speaker"].map((item) => (
                <span key={item} className="rounded-full border border-rysen-ink/15 bg-white px-5 py-2.5 text-sm font-medium text-rysen-charcoal/75 shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="mt-10 max-w-5xl space-y-6 text-xl leading-9 text-rysen-charcoal/75 sm:text-2xl sm:leading-10">
              <p>
                With over 25 years of leadership experience across India and global markets, Bidisha brings a distinctive perspective shaped by her experience as a former CHRO and Chief Learning Officer.
              </p>
              <p>
                Having worked at the intersection of business strategy, talent and leadership, she understands what organisations look for in their leaders, the challenges that hold them back, and what it takes to unlock their potential.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="credentials-title" className="section bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Credentials</p>
            <h2 id="credentials-title" className="mt-4 font-display text-4xl leading-tight text-rysen-ink sm:text-5xl">
              Qualifications &amp; certifications
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
              {credentials.map((credential) => (
                <li key={credential} className="flex items-center gap-4 rounded-xl border border-rysen-ink/10 bg-[#fcfaf7] px-5 py-6 sm:min-h-28">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rysen-orange/10">
                    <Award className="h-5 w-5 text-rysen-orange" strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <p className="text-base font-medium leading-6 text-rysen-charcoal">{credential}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <BooksPublications />

      <section className="bg-rysen-ink py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-rysen-orange">Sector Experience</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {industries.map((industry) => (
              <span key={industry} className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white/75">
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
