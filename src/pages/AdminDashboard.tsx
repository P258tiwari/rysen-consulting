import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, BriefcaseBusiness, Inbox, Plus, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { getBackendBlogs, getBackendCaseStudies, getContactEntries, type ContactEntry, type BackendCaseStudy } from "../utils/api";
import type { ResourceArticle } from "../utils/resourceStore";

export function AdminDashboard() {
  const [blogs, setBlogs] = useState<ResourceArticle[]>([]);
  const [studies, setStudies] = useState<BackendCaseStudy[]>([]);
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState("");
  async function refresh() {
    setLoading(true); setError("");
    try {
      const [articles, stories, enquiries] = await Promise.all([getBackendBlogs(), getBackendCaseStudies(), getContactEntries()]);
      setBlogs(articles); setStudies(stories); setContacts(enquiries);
      setUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (e) { setError(e instanceof Error ? e.message : "Could not refresh dashboard."); }
    finally { setLoading(false); }
  }
  useEffect(() => { void refresh(); }, []);
  const cards = [
    { label: "Articles", value: blogs.length, detail: `${blogs.filter(item => item.status === "Published").length} published`, icon: BookOpen, to: "/admin/resources" },
    { label: "Case studies", value: studies.length, detail: `${studies.filter(item => item.status === "Published").length} published`, icon: BriefcaseBusiness, to: "/admin/case-studies" },
    { label: "New enquiries", value: contacts.filter(item => item.status === "New").length, detail: `${contacts.length} total conversations`, icon: Inbox, to: "/admin/contacts" },
  ];
  const drafts = [...blogs.map(item => ({ ...item, kind: "Article", url: `/admin/resources/${item.id}/edit` })), ...studies.map(item => ({ ...item, kind: "Case study", url: `/admin/case-studies/${item.id}/edit` }))].filter(item => item.status === "Draft").sort((a,b) => b.updatedAt.localeCompare(a.updatedAt));
  return <>
    <Seo title="Admin Overview" description="Your RYSEN content and enquiry workspace." path="/admin" />
    <AdminPageHeader eyebrow="Your workspace" title="Welcome back." description="A clear view of your content, conversations and what needs your attention." actions={<button type="button" disabled={loading} onClick={refresh} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button>} />
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error} Use Refresh to try again.</p>}
      <div className="grid gap-4 sm:grid-cols-3">{cards.map(({label,value,detail,icon:Icon,to}) => <Link key={label} to={to} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-orange-300"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-rysen-orange"><Icon className="h-5 w-5" /></span><ArrowUpRight className="h-4 w-4 text-slate-400" /></div><p className="mt-5 text-sm text-slate-500">{label}</p><p className="mt-1 text-4xl font-semibold tracking-tight">{loading ? "..." : value}</p><p className="mt-3 text-xs text-slate-400">{loading ? "Loading workspace" : detail}</p></Link>)}</div>
      <div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-[#171b23] p-6 text-white"><div><h2 className="text-lg font-semibold">What will you share next?</h2><p className="mt-1 text-sm text-white/50">Turn your latest insight or engagement into a story.</p></div><div className="flex flex-wrap gap-3"><Link to="/admin/resources/new" className="flex items-center gap-2 rounded-lg bg-rysen-orange px-4 py-3 text-sm font-semibold"><Plus className="h-4 w-4" />New article</Link><Link to="/admin/case-studies/new" className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-3 text-sm font-semibold"><Plus className="h-4 w-4" />New case study</Link></div></div>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-100 p-5"><h2 className="font-semibold">Recent enquiries</h2><Link to="/admin/contacts" className="text-xs font-semibold text-rysen-orange">Open inbox</Link></div>{[...contacts].sort((a,b) => b.createdAt.localeCompare(a.createdAt)).slice(0,5).map(item => <Link key={item.id} to="/admin/contacts" className="flex items-start justify-between gap-3 border-b border-slate-100 p-5 hover:bg-slate-50"><div className="min-w-0"><p className="font-semibold">{item.name}</p><p className="mt-1 truncate text-xs text-slate-500">{item.interest}</p></div><span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${item.status === "New" ? "bg-orange-50 text-orange-700" : "bg-slate-100 text-slate-500"}`}>{item.status}</span></Link>)}{!contacts.length && <p className="p-8 text-sm text-slate-400">{loading ? "Loading enquiries..." : "No enquiries yet. New conversations will appear here."}</p>}</section>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="border-b border-slate-100 p-5"><h2 className="font-semibold">Continue writing</h2><p className="mt-1 text-xs text-slate-400">Your most recently updated drafts</p></div>{drafts.slice(0,5).map(item => <Link key={item.url} to={item.url} className="flex items-center justify-between gap-4 border-b border-slate-100 p-5 hover:bg-slate-50"><div><p className="line-clamp-2 text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs text-slate-400">{item.kind} / Draft</p></div><ArrowUpRight className="h-4 w-4 shrink-0 text-rysen-orange" /></Link>)}{!drafts.length && <p className="p-8 text-sm text-slate-400">{loading ? "Loading drafts..." : "All caught up. Your saved drafts will appear here."}</p>}</section>
      </div>
      <p role="status" className="text-xs text-slate-400">{loading ? "Updating workspace..." : error ? "Workspace could not be refreshed." : `Workspace updated at ${updated}`}</p>
    </div>
  </>;
}
