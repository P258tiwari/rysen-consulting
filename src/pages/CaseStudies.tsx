import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CaseStudyCard } from "../components/CaseStudyCard";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { caseStudies as seededCaseStudies, type CaseStudy } from "../data/content";
import { getBackendCaseStudies } from "../utils/api";

export function CaseStudies() {
  const [filter, setFilter] = useState("All");
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(seededCaseStudies);
  const filtersRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    getBackendCaseStudies("Published")
      .then((backendStudies) => setCaseStudies(backendStudies))
      .catch(() => undefined);
  }, []);

  const areas = useMemo(() => ["All", ...new Set(caseStudies.map((study) => study.practiceArea))], [caseStudies]);
  const visible = filter === "All" ? caseStudies : caseStudies.filter((study) => study.practiceArea === filter);

  function updateScrollButtons() {
    const element = filtersRef.current;
    if (!element) return;
    setCanScrollLeft(element.scrollLeft > 4);
    setCanScrollRight(element.scrollLeft + element.clientWidth < element.scrollWidth - 4);
  }

  function scrollFilters(direction: -1 | 1) {
    filtersRef.current?.scrollBy({ left: direction * Math.max(260, filtersRef.current.clientWidth * 0.65), behavior: "smooth" });
  }

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, [areas]);

  return (
    <>
      <Seo
        title="Case Studies"
        description="Explore RYSEN case studies across leadership development, executive presence, coaching, AI, talent strategy, and culture transformation."
        path="/case-studies"
      />
      <section className="page-hero">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Case Studies</p>
            <h1 className="hero-title max-w-5xl">Transformation stories with measurable leadership and business impact.</h1>
          </Reveal>
        </div>
      </section>
      <section className="section bg-rysen-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2" aria-label="Case study practice-area filters">
            <button type="button" onClick={() => scrollFilters(-1)} disabled={!canScrollLeft} aria-label="Show previous practice areas" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-rysen-ink/10 bg-white text-rysen-ink shadow-sm transition enabled:hover:border-rysen-orange enabled:hover:text-rysen-orange disabled:pointer-events-none disabled:opacity-0"><ChevronLeft className="h-5 w-5" /></button>
            <div ref={filtersRef} onScroll={updateScrollButtons} className="min-w-0 flex-1 overflow-x-hidden scroll-smooth">
              <div className="flex w-max gap-2 pr-1">
                {areas.map((area) => (
                  <button
                    key={area}
                    onClick={() => setFilter(area)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
                      filter === area ? "bg-rysen-orange text-white" : "bg-white text-rysen-charcoal hover:text-rysen-orange"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
            <button type="button" onClick={() => scrollFilters(1)} disabled={!canScrollRight} aria-label="Show more practice areas" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rysen-ink text-white shadow-sm transition enabled:hover:bg-rysen-orange disabled:pointer-events-none disabled:opacity-25"><ChevronRight className="h-5 w-5" /></button>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {visible.map((study, index) => (
              <Reveal key={study.id} delay={index * 0.04}>
                <CaseStudyCard study={study} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
