import DOMPurify from "dompurify";
import { ArrowLeft, ExternalLink, FilePenLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Seo } from "../components/Seo";
import { getBackendBlogs } from "../utils/api";
import { articleBodyToHtml, getSeedArticles, type ResourceArticle } from "../utils/resourceStore";

export function AdminBlogView() {
  const { id = "" } = useParams();
  const location = useLocation();
  const [article, setArticle] = useState<ResourceArticle | null>(null);
  const [error, setError] = useState("Loading preview…");
  const notice = (location.state as { message?: string } | null)?.message;

  useEffect(() => {
    getBackendBlogs()
      .then((backend) => {
        const found = backend.find((item) => item.id === id) ?? getSeedArticles().find((item) => item.id === id);
        if (!found) throw new Error("Article not found.");
        setArticle(found);
        setError("");
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Could not load the article."));
  }, [id]);

  if (!article) {
    return <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><p className="rounded-xl bg-white p-6 text-rysen-charcoal shadow-sm">{error}</p></div>;
  }

  return (
    <>
      <Seo title={`Preview: ${article.title}`} description={article.excerpt} path={`/admin/resources/${article.id}/view`} />
      <section className="border-b border-rysen-ink/10 bg-white py-7">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link to="/admin/resources" className="inline-flex items-center gap-2 text-sm font-bold text-rysen-charcoal/60 hover:text-rysen-orange"><ArrowLeft className="h-4 w-4" /> Back to articles</Link>
          <div className="flex flex-wrap gap-3">
            {article.status === "Published" && <Link target="_blank" to={`/resources/${article.slug}`} className="inline-flex items-center gap-2 rounded-full border border-rysen-ink/15 px-5 py-2.5 text-sm font-bold text-rysen-ink"><ExternalLink className="h-4 w-4" /> View Live</Link>}
            <Link to={`/admin/resources/${article.id}/edit`} className="inline-flex items-center gap-2 rounded-full bg-orange-sheen px-5 py-2.5 text-sm font-bold text-white"><FilePenLine className="h-4 w-4" /> Edit Article</Link>
          </div>
        </div>
      </section>
      <section className="section bg-rysen-soft">
        <article className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-rysen-ink/8 bg-white shadow-executive">
          {notice && <p className="border-b border-emerald-200 bg-emerald-50 px-6 py-3 text-sm font-bold text-emerald-800">{notice}</p>}
          {article.featuredImage && <img src={article.featuredImage} alt={article.featuredImageAlt || article.title} className="aspect-[16/7] w-full object-cover" />}
          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-rysen-orange/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-rysen-orange">{article.category}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${article.status === "Published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{article.status}</span>
              {article.source === "seed" && <span className="rounded-full bg-rysen-ink/8 px-3 py-1 text-xs font-bold text-rysen-charcoal">Built-in</span>}
            </div>
            <h1 className="mt-6 font-display text-4xl leading-tight text-rysen-ink sm:text-5xl">{article.title}</h1>
            <p className="mt-5 text-sm font-semibold text-rysen-charcoal/55">{article.author} · {article.date}</p>
            <p className="mt-7 border-l-4 border-rysen-orange pl-5 text-xl leading-8 text-rysen-charcoal/80">{article.excerpt}</p>
            <div className="article-rich-content mt-9" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(articleBodyToHtml(article.body)) }} />
            {(article.videoUrl || article.videoFile) && <div className="mt-9"><video src={article.videoFile || article.videoUrl} controls className="w-full rounded-lg">Your browser does not support video.</video></div>}
          </div>
        </article>
      </section>
    </>
  );
}
