import { ButtonLink } from "../components/ButtonLink";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { Seo } from "../components/Seo";
import { speakingThemes } from "../data/content";

export function BookSpeaking() {
  return (
    <>
      <Seo
        title="Book & Speaking"
        description="Invite Bidisha Banerjee for keynotes, leadership forums, corporate events, panels, author talks, and workshops."
        path="/book-speaking"
      />
      <section className="page-hero">
        <div className="mx-auto grid max-w-7xl items-end gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <Reveal>
            <p className="eyebrow">Book & Speaking</p>
            <h1 className="hero-title max-w-5xl">Keynotes and forums for leaders shaping what comes next.</h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-white/75">
              Invite Bidisha for leadership forums, corporate events, panels, author talks, and immersive workshops.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <img
              src="/assets/images/bidisha-book-speach.webp"
              alt="Bidisha Banerjee speaking on stage about her book Your Turn to Rise"
              className="aspect-[16/10] w-full rounded-lg object-cover shadow-executive"
            />
          </Reveal>
        </div>
      </section>
      <section className="section bg-rysen-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader eyebrow="Themes" title="Insight-rich sessions for modern leadership challenges." />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {speakingThemes.map((theme, index) => {
              const Icon = theme.icon;
              return (
                <Reveal key={theme.title} delay={index * 0.04}>
                  <article className="h-full rounded-lg bg-white p-6 shadow-sm">
                    <Icon className="h-8 w-8 text-rysen-orange" aria-hidden="true" />
                    <h2 className="mt-5 text-2xl font-semibold text-rysen-ink">{theme.title}</h2>
                  </article>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-12">
            <ButtonLink to="/contact">Invite Bidisha to Speak</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
