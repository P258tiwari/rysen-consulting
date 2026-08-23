import { Navigate, useParams } from "react-router-dom";
import { ButtonLink } from "../components/ButtonLink";
import { CaseStudyCard } from "../components/CaseStudyCard";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { Seo } from "../components/Seo";
import { caseStudies, leadershipSteps, services } from "../data/content";

export function ServicePage() {
  const { slug } = useParams();
  const service = services.find((item) => item.slug === slug);

  if (!service) return <Navigate to="/404" replace />;

  const Icon = service.icon;
  const study = caseStudies.find((item) => item.practiceArea === service.title);

  return (
    <>
      <Seo title={service.title} description={service.hero} path={`/services/${service.slug}`} />
      <section className="page-hero">
        <div className="mx-auto grid max-w-7xl items-end gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <Reveal>
            <p className="eyebrow">{service.eyebrow}</p>
            <h1 className="hero-title">{service.hero}</h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-white/75">{service.description}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-white/10 backdrop-blur">
              <img src={service.image} alt={service.imageAlt} className="aspect-[16/10] w-full object-cover" />
              <div className="p-7">
                <Icon className="h-11 w-11 text-rysen-orange" aria-hidden="true" />
                <h2 className="mt-6 text-2xl font-semibold text-white">{service.title}</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {service.outcomes.map((outcome) => (
                    <span key={outcome} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/75">
                      {outcome}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Signature Solutions"
              title={`What RYSEN delivers in ${service.title}.`}
              text="Each solution can stand alone or combine into a longer leadership journey with diagnostics, practice, coaching, and measurement."
            />
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {service.signatureSolutions.map((solution, index) => (
              <Reveal key={solution} delay={index * 0.03}>
                <div className="h-full rounded-lg border border-rysen-ink/10 bg-rysen-ivory p-5">
                  <span className="text-sm font-bold text-rysen-orange">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-5 text-xl font-semibold leading-tight text-rysen-ink">{solution}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {service.slug === "leadership-development" && (
        <section className="section bg-rysen-soft">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeader
                eyebrow="8 Steps of Excellence"
                title="Leadership growth mapped from early career to enterprise authority."
              />
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {leadershipSteps.map((step, index) => (
                <Reveal key={step.title} delay={index * 0.03}>
                  <article className="h-full rounded-lg bg-white p-6 shadow-sm">
                    <span className="text-sm font-bold text-rysen-orange">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="mt-4 text-2xl font-semibold text-rysen-ink">{step.title}</h3>
                    <dl className="mt-5 grid gap-4 text-sm leading-6">
                      <div>
                        <dt className="font-bold uppercase tracking-[0.16em] text-rysen-charcoal/50">Audience</dt>
                        <dd className="mt-1 text-rysen-charcoal/75">{step.audience}</dd>
                      </div>
                      <div>
                        <dt className="font-bold uppercase tracking-[0.16em] text-rysen-charcoal/50">Shift</dt>
                        <dd className="mt-1 text-rysen-charcoal/75">{step.shift}</dd>
                      </div>
                      <div>
                        <dt className="font-bold uppercase tracking-[0.16em] text-rysen-charcoal/50">Outcome</dt>
                        <dd className="mt-1 text-rysen-charcoal/75">{step.outcome}</dd>
                      </div>
                    </dl>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {study && (
        <section className="section bg-rysen-ink">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
            <Reveal>
              <SectionHeader
                eyebrow="Case Study"
                title="A representative transformation story."
                text="Challenge, intervention design, and measurable impact from a related RYSEN engagement."
                inverted
              />
            </Reveal>
            <Reveal delay={0.1}>
              <CaseStudyCard study={study} />
            </Reveal>
          </div>
        </section>
      )}

      <section className="section bg-rysen-ivory">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-rysen-orange">Next step</p>
            <h2 className="mt-3 font-display text-4xl text-rysen-ink">Discuss a {service.title.toLowerCase()} challenge.</h2>
          </div>
          <ButtonLink to="/contact">Book a Discovery Call</ButtonLink>
        </div>
      </section>
    </>
  );
}
