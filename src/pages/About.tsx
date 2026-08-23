import { useEffect, useState } from "react";
import { Award, Globe2, Maximize2, X } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { Seo } from "../components/Seo";
import { credentials, industries } from "../data/content";

export function About() {
  const [selectedImage, setSelectedImage] = useState<(typeof gallery)[number] | null>(null);

  useEffect(() => {
    if (!selectedImage) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setSelectedImage(null);
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  return (
    <>
      <Seo
        title="About Bidisha Banerjee"
        description="Learn about Bidisha Banerjee, founder of RYSEN Leadership and Coaching, executive coach, facilitator, talent strategist, author, and keynote speaker."
        path="/about"
      />
      <section className="page-hero">
        <div className="mx-auto grid max-w-7xl items-end gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <Reveal>
            <p className="eyebrow">About RYSEN</p>
            <h1 className="hero-title !text-4xl sm:!text-5xl lg:!text-6xl">Bidisha Banerjee</h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-white/75">
              Executive Coach, Leadership Facilitator, Talent Strategist, Author, and Keynote Speaker.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-white/10 backdrop-blur">
              <img
                src="/assets/images/bidisha-portrait-hero.webp"
                alt="Bidisha Banerjee, founder and lead executive coach at RYSEN"
                className="aspect-[5/4] w-full object-cover"
                decoding="async"
                fetchPriority="high"
              />
              <div className="p-6">
              <Globe2 className="h-9 w-9 text-rysen-orange" aria-hidden="true" />
              <p className="mt-5 text-lg leading-8 text-white/80">
                Facilitating learning journeys for senior leaders across India and international markets including the UK, US, and Gulf countries.
              </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-rysen-ivory">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader eyebrow="In Action" title="Leadership conversations that move people and organisations forward." />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((image, index) => (
              <Reveal key={image.src} delay={index * 0.04}>
                <button
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className="group w-full overflow-hidden rounded-xl bg-white text-left shadow-sm ring-1 ring-rysen-ink/10 transition hover:-translate-y-1 hover:shadow-xl"
                  aria-label={`View details for ${image.title}`}
                >
                  <div className="relative overflow-hidden">
                    <img src={image.src} alt={image.alt} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-rysen-ink/80 text-white backdrop-blur">
                      <Maximize2 className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-2xl text-rysen-ink">{image.title}</h3>
                    <p className="mt-2 line-clamp-2 leading-7 text-rysen-charcoal/70">{image.description}</p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-rysen-ink/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="gallery-dialog-title" onMouseDown={() => setSelectedImage(null)}>
          <div className="relative max-h-[92vh] w-full max-w-5xl overflow-auto rounded-xl bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setSelectedImage(null)} className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-rysen-ink text-white shadow-lg" aria-label="Close image details">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <img src={selectedImage.src} alt={selectedImage.alt} className="max-h-[68vh] w-full bg-rysen-soft object-contain" />
            <div className="p-6 sm:p-8">
              <p className="eyebrow">Leadership Gallery</p>
              <h2 id="gallery-dialog-title" className="mt-3 font-display text-3xl text-rysen-ink sm:text-4xl">{selectedImage.title}</h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-rysen-charcoal/75">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}

      <section className="section bg-rysen-ivory">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">About Bidisha</p>
            <h2 className="mt-5 max-w-5xl font-display text-5xl leading-[1.02] text-rysen-ink sm:text-6xl lg:text-7xl">
              I am Bidisha<br className="hidden sm:block" /> Banerjee.
            </h2>
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
                With over 25 years of global and Indian experience as a former CHRO and Chief Learning Officer, I&apos;ve sat on both sides of the table.
              </p>
              <p>
                I know what organisations look for in the leaders they back — and I know exactly what gets in the way.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader eyebrow="Credentials" title="Certified, international, and deeply grounded in people systems." />
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {credentials.map((credential, index) => (
              <Reveal key={credential} delay={index * 0.03}>
                <div className="flex h-full gap-4 rounded-lg border border-rysen-ink/10 bg-rysen-soft p-5">
                  <Award className="h-6 w-6 shrink-0 text-rysen-orange" aria-hidden="true" />
                  <p className="font-semibold leading-7 text-rysen-charcoal/80">{credential}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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

const gallery = [
  { src: "/assets/images/bidisha-leadership-training.webp", title: "Leadership Training", description: "An engaging leadership development session focused on practical insight, reflection, and action.", alt: "Bidisha Banerjee facilitating a leadership training session" },
  { src: "/assets/images/bidisha-idf-allyship-workshop.webp", title: "IDF Allyship Workshop", description: "Building more inclusive workplaces through meaningful dialogue, shared learning, and active allyship.", alt: "Bidisha Banerjee leading an allyship workshop" },
  { src: "/assets/images/bidisha-executive-coaching.webp", title: "Executive Coaching", description: "Focused coaching conversations that help leaders navigate complexity with clarity and confidence.", alt: "Executive coaching conversation with Bidisha Banerjee" },
  { src: "/assets/images/bidisha-corporate-session.webp", title: "Corporate Leadership Session", description: "A business-relevant learning experience designed to strengthen leadership capability and collaboration.", alt: "Bidisha Banerjee speaking during a corporate leadership session" },
  { src: "/assets/images/bidisha-group-facilitation.webp", title: "Group Facilitation", description: "Creating the space for teams to examine challenges, exchange perspectives, and move forward together.", alt: "Bidisha Banerjee facilitating a group discussion" },
  { src: "/assets/images/leadership-meeting-photorealistic.webp", title: "Leadership in Conversation", description: "A collaborative senior-leadership meeting where thoughtful facilitation turns diverse perspectives into aligned action.", alt: "Leadership facilitator guiding senior professionals in an office meeting" },
] as const;
