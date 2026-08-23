import { ArrowLeft, CheckCircle2, ExternalLink, FilePenLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Seo } from "../components/Seo";
import { getBackendCaseStudies } from "../utils/api";
import { getSeedAdminStudies, type AdminStudy } from "../utils/adminContent";

export function AdminCaseStudyView() {
  const { id = "" } = useParams();
  const location = useLocation();
  const [study, setStudy] = useState<AdminStudy | null>(null);
  const [error, setError] = useState("Loading preview…");
  const notice = (location.state as { message?: string } | null)?.message;

  useEffect(() => {
    getBackendCaseStudies().then((backend) => {
      const found = backend.find((item) => item.id === id) ?? getSeedAdminStudies().find((item) => item.id === id);
      if (!found) throw new Error("Case study not found.");
      setStudy(found); setError("");
    }).catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Could not load case study."));
  }, [id]);

  if (!study) return <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><p className="rounded-xl bg-white p-6 shadow-sm">{error}</p></div>;

  const sections = [{ title: "The challenge", items: study.challenge }, { title: "The solution", items: study.solution }, { title: "Measured impact", items: study.impact }];
  return (
    <>
      <Seo title={`Preview: ${study.title}`} description={study.practiceArea} path={`/admin/case-studies/${study.id}/view`} />
      <section className="border-b border-rysen-ink/10 bg-white py-7"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"><Link to="/admin/case-studies" className="inline-flex items-center gap-2 text-sm font-bold text-rysen-charcoal/60 hover:text-rysen-orange"><ArrowLeft className="h-4 w-4" /> Back to case studies</Link><div className="flex flex-wrap gap-3">{study.status === "Published" && <Link target="_blank" to="/case-studies" className="inline-flex items-center gap-2 rounded-full border border-rysen-ink/15 px-5 py-2.5 text-sm font-bold"><ExternalLink className="h-4 w-4" /> View Live</Link>}<Link to={`/admin/case-studies/${study.id}/edit`} className="inline-flex items-center gap-2 rounded-full bg-orange-sheen px-5 py-2.5 text-sm font-bold text-white"><FilePenLine className="h-4 w-4" /> Edit Case Study</Link></div></div></section>
      <section className="section bg-rysen-soft"><article className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-rysen-ink/8 bg-white shadow-executive">
        {notice && <p className="border-b border-emerald-200 bg-emerald-50 px-6 py-3 text-sm font-bold text-emerald-800">{notice}</p>}
        {study.image && <img src={study.image} alt={study.imageAlt || study.title} className="aspect-[16/7] w-full object-cover" />}
        <div className="p-6 sm:p-10"><div className="flex flex-wrap gap-3"><span className="rounded-full bg-rysen-orange/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-rysen-orange">{study.practiceArea}</span><span className={`rounded-full px-3 py-1 text-xs font-bold ${study.status === "Published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{study.status}</span>{study.source === "seed" && <span className="rounded-full bg-rysen-ink/8 px-3 py-1 text-xs font-bold">Built-in</span>}</div><h1 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">{study.title}</h1>
          <div className="mt-10 grid gap-8 lg:grid-cols-3">{sections.map((section, sectionIndex) => <section key={section.title} className={sectionIndex === 2 ? "rounded-xl bg-rysen-ink p-6 text-white" : "rounded-xl bg-rysen-soft p-6"}><h2 className={`text-xl font-semibold ${sectionIndex === 2 ? "text-white" : "text-rysen-ink"}`}>{section.title}</h2><ul className="mt-5 space-y-4">{section.items.map((item, index) => <li key={index} className={`flex gap-3 text-sm leading-6 ${sectionIndex === 2 ? "text-white/75" : "text-rysen-charcoal/75"}`}><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rysen-orange" />{item}</li>)}</ul></section>)}</div>
        </div>
      </article></section>
    </>
  );
}
