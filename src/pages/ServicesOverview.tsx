import { ButtonLink } from "../components/ButtonLink";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { Seo } from "../components/Seo";
import { ServiceCard } from "../components/ServiceCard";
import { services } from "../data/content";

export function ServicesOverview() {
  return (
    <>
      <Seo
        title="Services"
        description="Explore RYSEN practice areas including leadership development, executive presence, coaching, AI, talent strategy, and culture transformation."
        path="/services"
      />
      <section className="page-hero">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Services</p>
            <h1 className="hero-title max-w-5xl">Practice areas designed for leaders, teams, and organisations in motion.</h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-white/75">
              Bespoke journeys, labs, coaching, and talent systems that connect leadership behaviour to measurable impact.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-rysen-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Six Practice Areas"
              title="Choose the intervention that matches the leadership challenge."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.04}>
                <ServiceCard service={service} index={index} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.slug}>
                <article className="h-full rounded-lg border border-rysen-ink/10 p-6">
                  <Icon className="h-8 w-8 text-rysen-orange" aria-hidden="true" />
                  <h2 className="mt-5 text-2xl font-semibold text-rysen-ink">{service.title}</h2>
                  <p className="mt-3 leading-7 text-rysen-charcoal/70">{service.description}</p>
                  <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-rysen-charcoal/50">Signature solutions</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.signatureSolutions.slice(0, 5).map((solution) => (
                      <span key={solution} className="rounded-full bg-rysen-ivory px-3 py-1 text-xs font-bold text-rysen-charcoal/70">
                        {solution}
                      </span>
                    ))}
                  </div>
                  <ButtonLink to={`/services/${service.slug}`} variant="secondary" className="mt-7">
                    Explore
                  </ButtonLink>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
