import { ArrowUpRight, CheckCircle2, Instagram, Linkedin } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonLink } from "../components/ButtonLink";
import { CaseStudyCard } from "../components/CaseStudyCard";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { Seo } from "../components/Seo";
import { ServiceCard } from "../components/ServiceCard";
import { StatCounter } from "../components/StatCounter";
import {
  caseStudies as seededCaseStudies,
  services,
  stats,
  testimonials,
  valuePillars,
  type CaseStudy,
} from "../data/content";
import { getBackendCaseStudies } from "../utils/api";

export function Home() {
  const [featuredCaseStudies, setFeaturedCaseStudies] = useState<CaseStudy[]>(seededCaseStudies);

  useEffect(() => {
    getBackendCaseStudies("Published")
      .then((backendStudies) => setFeaturedCaseStudies(backendStudies))
      .catch(() => undefined);
  }, []);

  return (
    <>
      <Seo
        title="Building leaders who rise"
        description="RYSEN Leadership and Coaching partners with organisations to develop future-ready leaders, strengthen executive presence, transform culture, and unlock performance."
      />
      <section className="relative overflow-hidden bg-rysen-ivory">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/80 to-transparent" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <Reveal>
            <p className="mb-5 inline-flex rounded-full border border-rysen-orange/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-rysen-orange">
              RYSEN Leadership and Coaching
            </p>
            <h1 className="max-w-3xl font-display text-4xl leading-[1.05] text-rysen-ink sm:text-5xl lg:text-6xl">
              Building leaders who rise with clarity, confidence, and measurable impact.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-rysen-charcoal/75 md:text-xl">
              RYSEN Leadership and Coaching partners with organisations to develop future-ready leaders,
              strengthen executive presence, transform culture, and unlock sustainable performance.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/contact">Book a Discovery Call</ButtonLink>
              <ButtonLink to="/services" variant="secondary">
                Explore Services
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="relative overflow-hidden rounded-lg bg-rysen-ink shadow-executive">
              <img
                src="/assets/images/generated-leadership-workshop.webp"
                alt="Diverse senior executives in a warm leadership workshop"
                className="aspect-[16/11] w-full object-cover"
                decoding="async"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rysen-ink/45 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-white/10 bg-white/10 p-5 text-white backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-rysen-orange">Leadership Lab</p>
                <p className="mt-2 text-2xl font-semibold">Clarity to impact</p>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="bg-rysen-ink">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-7 sm:px-6 md:grid-cols-4 lg:px-8">
            {stats.map((stat) => (
              <StatCounter key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-rysen-ink/10 bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-center text-xs font-bold uppercase tracking-[0.24em] text-rysen-charcoal/60">Trusted By</p>
            <div className="mt-8 space-y-4">
              <LogoMarqueeRow logos={trustedLogos.slice(0, 17)} direction="left" />
              <LogoMarqueeRow logos={trustedLogos.slice(17)} direction="right" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-rysen-ink py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-center text-xs font-bold uppercase tracking-[0.24em] text-rysen-orange">Featured In &amp; Associated With</p>
            <div className="mt-9 grid grid-cols-2 items-center gap-x-8 gap-y-9 sm:grid-cols-3 lg:grid-cols-6">
              {featuredLogos.map((logo) => (
                <div key={logo.src} className="flex h-14 items-center justify-center rounded-md bg-white/5 px-4">
                  <img src={logo.src} alt={logo.name} className="max-h-10 max-w-[145px] object-contain grayscale opacity-60 brightness-0 invert transition duration-300 hover:opacity-100" loading="lazy" />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="The RYSEN Edge"
              title="A five-stage methodology built for transfer, not theatre."
              text="Every engagement connects the business context, leader behaviour, and performance outcomes."
              align="center"
            />
          </Reveal>
          <Reveal delay={0.08} className="mt-12">
            <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
              <img
                src="/assets/images/rysen-edge-methodology.webp"
                alt="The RYSEN methodology: Reveal, Yield Insights, Shape Solutions, Elevate Capability, and Nurture Growth"
                className="h-auto min-w-[760px] sm:min-w-0 sm:w-full"
                loading="lazy"
                decoding="async"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-rysen-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <SectionHeader
                eyebrow="Practice Areas"
                title="Leadership solutions for the moments that shape organisations."
                text="From emerging leader journeys to AI adoption, talent systems, and culture transformation."
              />
            </Reveal>
            <ButtonLink to="/services" variant="secondary" className="self-start md:self-auto">
              View all services
            </ButtonLink>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.04}>
                <ServiceCard service={service} index={index} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-rysen-ink text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Featured Case Studies"
              title="Engagements designed around real business movement."
              text="Selected transformation stories across leadership, presence, AI, talent, and culture."
              inverted
            />
          </Reveal>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {featuredCaseStudies.slice(0, 3).map((study, index) => (
              <Reveal key={study.id} delay={index * 0.06}>
                <CaseStudyCard study={study} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="meet-bidisha" className="bg-rysen-ivory py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-7 lg:grid-cols-[0.78fr_1.22fr]">
            <Reveal className="h-full">
              <div className="relative h-full min-h-[390px] overflow-hidden rounded-2xl border-4 border-rysen-orange shadow-warm">
                <img
                  src="/assets/images/bidisha-portrait-smile.webp"
                  alt="Bidisha Banerjee, executive coach and founder of RYSEN"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rysen-ink via-rysen-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-rysen-orange">Founder / Lead</p>
                  <h2 className="mt-3 font-display text-4xl">Bidisha Banerjee</h2>
                  <p className="mt-3 max-w-md text-sm leading-6 text-white/80 sm:text-base">
                    Executive Coach · Leadership Facilitator · Talent Strategist · Author · Keynote Speaker
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="h-full">
              <div className="flex h-full flex-col gap-6 rounded-2xl border border-rysen-ink/10 bg-white p-5 shadow-sm sm:p-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-rysen-orange">Meet Bidisha Banerjee</p>
                  <h2 className="mt-2 max-w-4xl font-display text-3xl leading-tight text-rysen-ink sm:text-4xl lg:text-[2.4rem]">
                    Twenty-five years of HR, leadership, culture, and coaching experience.
                  </h2>
                  <p className="mt-3 max-w-4xl leading-7 text-rysen-charcoal/70">
                    Bidisha has worked across Manufacturing, Retail, BFSI, ITES, Technology, and Consumer businesses, facilitating learning journeys for senior leaders across India and international markets.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    ["25+", "Years"],
                    ["500+", "Leaders"],
                    ["4", "Markets"],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-lg border border-rysen-ink/10 px-3 py-3 text-center">
                      <p className="font-display text-3xl text-rysen-orange">{value}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-rysen-charcoal/60">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-auto flex flex-col gap-4 rounded-xl bg-rysen-ink p-5 text-white sm:flex-row sm:items-center sm:justify-between">
                  <blockquote className="max-w-xl">
                    <p className="font-display text-xl leading-7">Leadership development should create visible movement—not just memorable moments.</p>
                  </blockquote>
                  <ButtonLink to="/about" className="shrink-0">Read Bidisha's Story</ButtonLink>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.16} className="mt-5">
            <div className="grid overflow-hidden rounded-2xl border border-rysen-ink/10 bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-5">
              {valuePillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div key={pillar.title} className="flex min-h-24 items-center gap-4 border-b border-rysen-ink/10 px-5 py-4 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-rysen-orange/10 text-rysen-orange">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-sm font-bold leading-6 text-rysen-charcoal/80">{pillar.title}</h3>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="social" className="section overflow-hidden bg-rysen-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Follow the Journey"
              title="Ideas that move people."
              text="Leadership insights, coaching conversations, event moments, and practical perspectives from Bidisha."
            />
          </Reveal>
          <div className="mt-12 space-y-8">
            <Reveal className="grid items-stretch gap-5 md:grid-cols-2">
              <a href="https://www.linkedin.com/in/bidisha-banerjee" target="_blank" rel="noreferrer" className="group flex h-full flex-col rounded-xl bg-[#0a66c2] p-7 text-white shadow-executive transition hover:-translate-y-1">
                <div className="flex items-start justify-between gap-5">
                  <Linkedin className="h-9 w-9" aria-hidden="true" />
                  <ArrowUpRight className="h-6 w-6 transition group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                </div>
                <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-white/70">LinkedIn</p>
                <h3 className="mt-2 font-display text-3xl">Bidisha Banerjee</h3>
                <p className="mt-4 leading-7 text-white/80">Leadership thinking, executive coaching insights, and conversations for people building what comes next.</p>
                <span className="mt-auto inline-flex pt-7 font-bold">View LinkedIn profile</span>
              </a>
              <a href="https://www.instagram.com/coach_author_bidishabanerjee" target="_blank" rel="noreferrer" className="group flex h-full flex-col rounded-xl bg-gradient-to-br from-[#833ab4] via-[#e1306c] to-[#f77737] p-7 text-white shadow-executive transition hover:-translate-y-1">
                <div className="flex items-start justify-between gap-5">
                  <Instagram className="h-9 w-9" aria-hidden="true" />
                  <ArrowUpRight className="h-6 w-6 transition group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                </div>
                <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-white/75">Instagram</p>
                <h3 className="mt-2 font-display text-2xl">@coach_author_bidishabanerjee</h3>
                <p className="mt-3 text-white/85">Leadership · Coaching · Inspiration</p>
                <span className="mt-auto inline-flex pt-7 font-bold">Follow on Instagram</span>
              </a>
            </Reveal>
            <Reveal delay={0.1} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {socialImages.map((image) => (
                <a key={image.src} href="https://www.instagram.com/coach_author_bidishabanerjee" target="_blank" rel="noreferrer" className="group relative min-h-56 overflow-hidden rounded-xl bg-rysen-ink" aria-label={`View ${image.alt} on Instagram`}>
                  <img src={image.src} alt={image.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                  <span className="absolute inset-0 bg-gradient-to-t from-rysen-ink/55 via-transparent to-transparent opacity-70 transition group-hover:opacity-100" />
                  <Instagram className="absolute bottom-4 right-4 h-5 w-5 text-white" aria-hidden="true" />
                </a>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader eyebrow="Testimonials" title="Trusted by leaders navigating visible growth moments." />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {testimonials.slice(0, 2).map((item, index) => (
              <Reveal key={item.attribution} delay={index * 0.06}>
                <blockquote className="h-full rounded-lg border border-rysen-ink/10 bg-rysen-ivory p-7">
                  <p className="text-lg leading-8 text-rysen-charcoal/80">"{item.quote}"</p>
                  <footer className="mt-6 font-bold text-rysen-ink">{item.attribution}</footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <CheckCircle2 className="mx-auto h-10 w-10 text-rysen-orange" aria-hidden="true" />
            <h2 className="mt-5 font-display text-4xl text-rysen-ink md:text-6xl">
              Let us build leaders who are ready for what comes next.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-rysen-charcoal/70">
              Start with a conversation about your leadership pipeline, culture shifts, talent systems, or executive growth priorities.
            </p>
            <div className="mt-8 flex justify-center">
              <ButtonLink to="/contact">Book a Discovery Call</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

const trustedLogos = [
  { name: "JSW", src: "/assets/images/logos/trusted/01-jsw.png" },
  { name: "Vi", src: "/assets/images/logos/trusted/02-vi.png" },
  { name: "Welspun", src: "/assets/images/logos/trusted/03-welspun.png" },
  { name: "Wockhardt", src: "/assets/images/logos/trusted/04-wockhardt.png" },
  { name: "Zydus", src: "/assets/images/logos/trusted/05-zydus.png" },
  { name: "Glenmark", src: "/assets/images/logos/trusted/06-glenmark.png" },
  { name: "Hetero", src: "/assets/images/logos/trusted/07-hetero.png" },
  { name: "Restaurant Brands Asia", src: "/assets/images/logos/trusted/08-restaurant-brands-asia.png" },
  { name: "Kaya Clinic", src: "/assets/images/logos/trusted/09-kaya-clinic.png" },
  { name: "KEC International", src: "/assets/images/logos/trusted/10-kec-international.png" },
  { name: "Estée Lauder", src: "/assets/images/logos/trusted/11-estee-lauder.png" },
  { name: "Pepe Jeans", src: "/assets/images/logos/trusted/12-pepe-jeans.png" },
  { name: "SUGAR Cosmetics", src: "/assets/images/logos/trusted/13-sugar-cosmetics.png" },
  { name: "Metro Shoes", src: "/assets/images/logos/trusted/14-metro-shoes.png" },
  { name: "K Raheja Corp", src: "/assets/images/logos/trusted/15-k-raheja-corp.png" },
  { name: "KPIL", src: "/assets/images/logos/trusted/16-kpil.png" },
  { name: "Vertis Infrastructure Trust", src: "/assets/images/logos/trusted/17-vertis-infrastructure-trust.png" },
  { name: "Aavas Financiers", src: "/assets/images/logos/trusted/18-aavas-financiers.png" },
  { name: "ICICI Securities", src: "/assets/images/logos/trusted/19-icici-securities.png" },
  { name: "Aditya Birla Fashion and Retail", src: "/assets/images/logos/trusted/20-aditya-birla-fashion-retail.png" },
  { name: "SDA Bocconi Asia Center", src: "/assets/images/logos/trusted/21-sda-bocconi-asia-center.png" },
  { name: "MET Institute", src: "/assets/images/logos/trusted/22-met-institute.png" },
  { name: "HDFC Bank", src: "/assets/images/logos/trusted/23-hdfc-bank.png" },
  { name: "OakNorth", src: "/assets/images/logos/trusted/24-oaknorth.png" },
  { name: "BankDhofar", src: "/assets/images/logos/trusted/25-bank-dhofar.png" },
  { name: "Landmark Group", src: "/assets/images/logos/trusted/26-landmark-group.png" },
  { name: "CFA Institute", src: "/assets/images/logos/trusted/27-cfa-institute.png" },
  { name: "Seclore", src: "/assets/images/logos/trusted/28-seclore.png" },
  { name: "IndoSpace", src: "/assets/images/logos/trusted/29-indospace.png" },
  { name: "Meghmani Group", src: "/assets/images/logos/trusted/30-meghmani-group.png" },
  { name: "Mumbai Port Authority", src: "/assets/images/logos/trusted/31-mumbai-port-authority.png" },
  { name: "NMIMS", src: "/assets/images/logos/trusted/32-nmims.png" },
  { name: "Uplers", src: "/assets/images/logos/trusted/33-uplers.png" },
  { name: "Khazna", src: "/assets/images/logos/trusted/34-khazna.png" },
] as const;

type TrustedLogo = (typeof trustedLogos)[number];

function LogoMarqueeRow({ logos, direction }: { logos: readonly TrustedLogo[]; direction: "left" | "right" }) {
  return (
    <div className="logo-marquee-row relative overflow-hidden" aria-label={`Trusted organisations moving ${direction}`}>
      <div className={`logo-marquee-track ${direction === "left" ? "logo-marquee-left" : "logo-marquee-right"}`}>
        {[false, true].map((duplicate) => (
          <div key={String(duplicate)} className="flex shrink-0 items-center gap-5 pr-5" aria-hidden={duplicate || undefined}>
            {logos.map((logo) => (
              <div key={`${duplicate}-${logo.src}`} className="flex h-20 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-rysen-ink/5 bg-white p-2 sm:h-24 sm:w-44">
                <img
                  src={logo.src}
                  alt={duplicate ? "" : logo.name}
                  className="h-full w-full object-contain grayscale opacity-60 transition duration-300 hover:grayscale-0 hover:opacity-100"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent sm:w-24" />
    </div>
  );
}

const featuredLogos = [
  { name: "Cambridge Judge Business School", src: "/assets/images/logos/logo-cambridge.png" },
  { name: "CNBC", src: "/assets/images/logos/logo-cnbc.png" },
  { name: "ET Now", src: "/assets/images/logos/logo-et-now.png" },
  { name: "People Matters", src: "/assets/images/logos/logo-people-matters.png" },
  { name: "Global Women", src: "/assets/images/logos/logo-global-women.png" },
  { name: "NHRDN", src: "/assets/images/logos/NHRDN.png" },
] as const;

const socialImages = [
  { src: "/assets/images/bidisha-author-event.webp", alt: "Bidisha Banerjee at an author event" },
  { src: "/assets/images/bidisha-welspun-convocation.webp", alt: "Bidisha Banerjee at the Welspun convocation" },
  { src: "/assets/images/bidisha-workshop-performance.webp", alt: "Leadership workshop in progress" },
  { src: "/assets/images/bidisha-book-launch.webp", alt: "Bidisha Banerjee at her book launch" },
  { src: "/assets/images/bidisha-speaking-workshop.webp", alt: "Bidisha Banerjee facilitating a workshop" },
] as const;
