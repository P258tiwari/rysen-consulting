import { Quote } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { Seo } from "../components/Seo";
import { testimonials } from "../data/content";

export function Testimonials() {
  return (
    <>
      <Seo
        title="Testimonials"
        description="Read testimonials from leaders and organisations who have worked with RYSEN Leadership and Coaching."
        path="/testimonials"
      />
      <section className="page-hero">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Testimonials</p>
            <h1 className="hero-title max-w-5xl">Experiences leaders remember because they changed how work moved.</h1>
          </Reveal>
        </div>
      </section>
      <section className="section bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Client Voices"
              title="Immersive, practical, reflective, and tied to measurable progress."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {testimonials.map((item, index) => (
              <Reveal key={item.attribution} delay={index * 0.05}>
                <blockquote className="h-full rounded-lg border border-rysen-ink/10 bg-rysen-ivory p-7">
                  <Quote className="h-8 w-8 text-rysen-orange" aria-hidden="true" />
                  <p className="mt-5 text-lg leading-8 text-rysen-charcoal/80">"{item.quote}"</p>
                  <footer className="mt-6 font-bold text-rysen-ink">{item.attribution}</footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
