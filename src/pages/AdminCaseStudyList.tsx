import { Eye, FilePenLine, FilePlus2, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { deleteBackendCaseStudy, getBackendCaseStudies, type BackendCaseStudy } from "../utils/api";
type StatusFilter = "All" | "Published" | "Draft";

export function AdminCaseStudyList() {
  const [backend, setBackend] = useState<BackendCaseStudy[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [message, setMessage] = useState("Loading case studies…");

  async function refresh() { setBackend(await getBackendCaseStudies()); }
  useEffect(() => { refresh().then(() => setMessage("")).catch((error) => setMessage(error instanceof Error ? error.message : "Could not load case studies.")); }, []);

  const studies = useMemo(() => backend, [backend]);

  const visible = studies.filter((study) => {
    const matchesQuery = `${study.title} ${study.practiceArea}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "All" || study.status === filter;
    return matchesQuery && matchesFilter;
  });

  async function remove(study: BackendCaseStudy) {
    if (!window.confirm(`Delete “${study.title}”? This cannot be undone.`)) return;
    try { await deleteBackendCaseStudy(study.id); await refresh(); setMessage("Case study deleted."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Case study could not be deleted."); }
  }

  return (
    <>
      <Seo title="Case Studies Admin" description="Manage RYSEN case studies." path="/admin/case-studies" />
      <section className="bg-rysen-ink py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div><p className="eyebrow">Content Management</p><h1 className="mt-4 font-display text-5xl md:text-6xl">Case studies</h1><p className="mt-4 max-w-2xl text-lg text-white/65">Manage transformation stories, measurable impact, and the evidence behind RYSEN’s work.</p></div>
          <Link to="/admin/case-studies/new" className="inline-flex w-fit items-center gap-2 rounded-full bg-orange-sheen px-6 py-3 text-sm font-bold text-white shadow-lg"><FilePlus2 className="h-4 w-4" /> Add New Case Study</Link>
        </div>
      </section>
      <section className="section bg-rysen-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {[{ label: "Total stories", value: studies.length }, { label: "Published", value: studies.filter((study) => study.status === "Published").length }, { label: "Drafts", value: studies.filter((study) => study.status === "Draft").length }].map((item) => <div key={item.label} className="rounded-xl border border-rysen-ink/8 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.18em] text-rysen-charcoal/50">{item.label}</p><p className="mt-2 text-4xl font-semibold">{item.value}</p></div>)}
          </div>
          <div className="mt-7 rounded-xl border border-rysen-ink/8 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-rysen-ink/10 p-5 lg:flex-row lg:items-center lg:justify-between">
              <label className="relative block w-full max-w-md"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rysen-charcoal/45" /><span className="sr-only">Search case studies</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title or practice area" className="min-h-11 w-full rounded-full border border-rysen-ink/10 pl-11 pr-4 text-sm outline-none focus:border-rysen-orange focus:ring-4 focus:ring-rysen-orange/10" /></label>
              <div className="flex gap-2 overflow-x-auto">{(["All", "Published", "Draft"] as StatusFilter[]).map((status) => <button key={status} type="button" onClick={() => setFilter(status)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${filter === status ? "bg-rysen-ink text-white" : "bg-rysen-soft text-rysen-charcoal"}`}>{status}</button>)}</div>
            </div>
            {message && <p className="border-b border-rysen-ink/10 bg-rysen-ivory px-5 py-3 text-sm font-semibold text-rysen-charcoal/70">{message}</p>}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left">
                <thead className="bg-rysen-soft/70 text-xs uppercase tracking-[0.14em] text-rysen-charcoal/55"><tr><th className="px-5 py-4">Case study</th><th className="px-5 py-4">Practice area</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr></thead>
                <tbody className="divide-y divide-rysen-ink/8">{visible.map((study) => <tr key={study.id} className="hover:bg-rysen-soft/45"><td className="px-5 py-4"><p className="max-w-md font-semibold text-rysen-ink">{study.title}</p></td><td className="px-5 py-4 text-sm text-rysen-charcoal/70">{study.practiceArea}</td><td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${study.status === "Published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{study.status}</span></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><Link to={`/admin/case-studies/${study.id}/view`} aria-label={`View ${study.title}`} className="grid h-10 w-10 place-items-center rounded-full border border-rysen-ink/10 hover:text-rysen-orange"><Eye className="h-4 w-4" /></Link><Link to={`/admin/case-studies/${study.id}/edit`} aria-label={`Edit ${study.title}`} className="grid h-10 w-10 place-items-center rounded-full border border-rysen-ink/10 hover:text-rysen-orange"><FilePenLine className="h-4 w-4" /></Link><button type="button" onClick={() => remove(study)} aria-label={`Delete ${study.title}`} title="Delete" className="grid h-10 w-10 place-items-center rounded-full border border-rysen-ink/10 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody>
              </table>
              {visible.length === 0 && <div className="p-10 text-center text-rysen-charcoal/60">No case studies match this view.</div>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
