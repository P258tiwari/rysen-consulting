import { AdminPageHeader } from "../components/AdminPageHeader";
import { Eye, FilePenLine, FilePlus2, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { deleteBackendBlog, getBackendBlogs } from "../utils/api";
import type { ResourceArticle } from "../utils/resourceStore";

type StatusFilter = "All" | "Published" | "Draft" | "Built-in";

function StatusBadge({ article }: { article: ResourceArticle }) {
  const builtIn = article.source === "seed";
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
      builtIn ? "bg-rysen-ink/8 text-rysen-charcoal" : article.status === "Published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
    }`}>
      {builtIn ? "Built-in · Published" : article.status}
    </span>
  );
}

export function AdminBlogs() {
  const [backendArticles, setBackendArticles] = useState<ResourceArticle[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [message, setMessage] = useState("Loading articles…");

  async function refresh() {
    const items = await getBackendBlogs();
    setBackendArticles(items);
  }

  useEffect(() => {
    refresh().then(() => setMessage("")).catch((error) => setMessage(error instanceof Error ? error.message : "Could not load articles."));
  }, []);

  const articles = useMemo(() => [...backendArticles].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [backendArticles]);

  const visible = articles.filter((article) => {
    const matchesQuery = `${article.title} ${article.category} ${article.author}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "All" || (filter === "Built-in" ? article.source === "seed" : article.status === filter);
    return matchesQuery && matchesFilter;
  });

  async function remove(article: ResourceArticle) {
    if (article.source !== "admin" || !window.confirm(`Delete “${article.title}”? This cannot be undone.`)) return;
    try {
      await deleteBackendBlog(article.id);
      await refresh();
      setMessage("Article deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Article could not be deleted.");
    }
  }

  const publishedCount = articles.filter((article) => article.status === "Published").length;
  const draftCount = articles.filter((article) => article.source === "admin" && article.status === "Draft").length;

  return (
    <>
      <Seo title="Blog Admin" description="Manage RYSEN blog articles." path="/admin/resources" />
      <AdminPageHeader eyebrow="Content library" title="Articles" description="Write, organise and publish insights for your readers." actions={<Link to="/admin/resources/new" className="inline-flex items-center gap-2 rounded-lg bg-rysen-orange px-5 py-3 text-sm font-semibold text-white hover:bg-rysen-ember"><FilePlus2 className="h-4 w-4" />New article</Link>} />

      <section className="section bg-rysen-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {[{ label: "Total articles", value: articles.length }, { label: "Published", value: publishedCount }, { label: "Drafts", value: draftCount }].map((item) => (
              <div key={item.label} className="rounded-xl border border-rysen-ink/8 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-rysen-charcoal/50">{item.label}</p>
                <p className="mt-2 text-4xl font-semibold text-rysen-ink">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-xl border border-rysen-ink/8 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-rysen-ink/10 p-5 lg:flex-row lg:items-center lg:justify-between">
              <label className="relative block w-full max-w-md">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rysen-charcoal/45" />
                <span className="sr-only">Search articles</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, category, or author" className="min-h-11 w-full rounded-full border border-rysen-ink/10 pl-11 pr-4 text-sm outline-none focus:border-rysen-orange focus:ring-4 focus:ring-rysen-orange/10" />
              </label>
              <div className="flex gap-2 overflow-x-auto">
                {(["All", "Published", "Draft", "Built-in"] as StatusFilter[]).map((status) => (
                  <button key={status} type="button" onClick={() => setFilter(status)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${filter === status ? "bg-rysen-ink text-white" : "bg-rysen-soft text-rysen-charcoal hover:text-rysen-orange"}`}>{status}</button>
                ))}
              </div>
            </div>

            {message && <p role="status" className="border-b border-rysen-ink/10 bg-rysen-ivory px-5 py-3 text-sm font-semibold text-rysen-charcoal/70">{message}</p>}

            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Articles table">
              <table className="w-full min-w-[860px] text-left">
                <thead className="bg-rysen-soft/70 text-xs uppercase tracking-[0.14em] text-rysen-charcoal/55">
                  <tr><th className="px-5 py-4">Article</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Publish date</th><th className="px-5 py-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-rysen-ink/8">
                  {visible.map((article) => (
                    <tr key={`${article.source}-${article.id}`} className="align-middle transition hover:bg-rysen-soft/45">
                      <td className="px-5 py-4"><div className="flex items-center gap-3"><img src={article.featuredImage} alt="" className="h-12 w-16 shrink-0 rounded-lg bg-slate-100 object-cover" loading="lazy" /><div><Link to={`/admin/resources/${article.id}/edit`} className="line-clamp-2 max-w-md font-semibold text-rysen-ink hover:text-rysen-orange">{article.title}</Link><p className="mt-1 text-xs text-rysen-charcoal/50">By {article.author}</p></div></div></td>
                      <td className="px-5 py-4 text-sm text-rysen-charcoal/75">{article.category}</td>
                      <td className="px-5 py-4"><StatusBadge article={article} /></td>
                      <td className="px-5 py-4 text-sm text-rysen-charcoal/65">{article.date}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/resources/${article.id}/view`} title="View" aria-label={`View ${article.title}`} className="grid h-10 w-10 place-items-center rounded-full border border-rysen-ink/10 text-rysen-charcoal transition hover:border-rysen-orange hover:text-rysen-orange"><Eye className="h-4 w-4" /></Link>
                          <Link to={`/admin/resources/${article.id}/edit`} title="Edit" aria-label={`Edit ${article.title}`} className="grid h-10 w-10 place-items-center rounded-full border border-rysen-ink/10 text-rysen-charcoal transition hover:border-rysen-orange hover:text-rysen-orange"><FilePenLine className="h-4 w-4" /></Link>
                          <button type="button" onClick={() => remove(article)} disabled={article.source !== "admin"} title={article.source === "admin" ? "Delete" : "Built-in articles cannot be deleted"} aria-label={`Delete ${article.title}`} className="grid h-10 w-10 place-items-center rounded-full border border-rysen-ink/10 text-rysen-charcoal transition enabled:hover:border-red-300 enabled:hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table><p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">Showing {visible.length} of {articles.length} articles</p>
              {visible.length === 0 && <div className="p-10 text-center text-rysen-charcoal/60">No articles match this view.</div>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
