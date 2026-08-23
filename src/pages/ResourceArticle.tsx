import DOMPurify from "dompurify";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Clock3,
  Copy,
  Linkedin,
  Mail,
  NotebookTabs,
  Share2,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ButtonLink } from "../components/ButtonLink";
import { NewsletterSignup } from "../components/NewsletterSignup";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { getBackendBlog, getBackendBlogs } from "../utils/api";
import { articleBodyToHtml, getAllArticles, type ResourceArticle } from "../utils/resourceStore";

function getVideoEmbedUrl(url: string) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (parsed.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${parsed.pathname.replace("/", "")}`;
    if (parsed.hostname.includes("vimeo.com")) return `https://player.vimeo.com/video/${parsed.pathname.replace("/", "")}`;
    return "";
  } catch {
    return "";
  }
}

function estimateReadingTime(body: string) {
  const words = body.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

function deduplicateArticles(articles: ResourceArticle[]) {
  const seen = new Set<string>();
  return articles.filter((article) => {
    if (seen.has(article.slug)) return false;
    seen.add(article.slug);
    return true;
  });
}

export function ResourceArticle() {
  const { slug } = useParams();
  const fallbackArticles = useMemo(() => getAllArticles().filter((item) => item.status === "Published"), []);
  const [article, setArticle] = useState<ResourceArticle | undefined>(() => fallbackArticles.find((item) => item.slug === slug));
  const [articles, setArticles] = useState<ResourceArticle[]>(fallbackArticles);
  const [loading, setLoading] = useState(!article);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    const fallback = fallbackArticles.find((item) => item.slug === slug);
    setLoading(true);
    Promise.allSettled([getBackendBlog(slug), getBackendBlogs("Published")])
      .then(([articleResult, articlesResult]) => {
        const backendArticle = articleResult.status === "fulfilled" && articleResult.value.status === "Published" ? articleResult.value : undefined;
        const backendAvailable = articleResult.status === "fulfilled" || articlesResult.status === "fulfilled";
        setArticle(backendArticle ?? (backendAvailable ? undefined : fallback));
        if (articlesResult.status === "fulfilled") setArticles(deduplicateArticles(articlesResult.value));
      })
      .finally(() => setLoading(false));
  }, [fallbackArticles, slug]);

  if (loading) {
    return <div className="grid min-h-[50vh] place-items-center bg-white font-semibold text-rysen-charcoal/60">Loading article…</div>;
  }

  if (!article) return <Navigate to="/404" replace />;

  const embedUrl = getVideoEmbedUrl(article.videoUrl);
  const safeBody = DOMPurify.sanitize(articleBodyToHtml(article.body), {
    ALLOWED_TAGS: ["p", "br", "h2", "h3", "strong", "b", "em", "i", "u", "ul", "ol", "li", "blockquote", "a"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
  const recommended = articles
    .filter((item) => item.slug !== article.slug)
    .sort((left, right) => Number(right.category === article.category) - Number(left.category === article.category))
    .slice(0, 3);
  const pageUrl = typeof window === "undefined" ? "" : window.location.href;
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(article.title);
  const shareTitle = article.title;
  const shareExcerpt = article.excerpt;

  async function copyLink() {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function shareArticle() {
    if (navigator.share) {
      await navigator.share({ title: shareTitle, text: shareExcerpt, url: pageUrl }).catch(() => undefined);
      return;
    }
    await copyLink();
  }

  return (
    <>
      <Seo title={article.seoTitle || article.title} description={article.seoDescription || article.excerpt} path={`/resources/${article.slug}`} image={article.ogImage || article.featuredImage} />
      <section className="page-hero">
        <div className="mx-auto grid max-w-7xl items-end gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <Reveal>
            <p className="eyebrow">{article.category}</p>
            <h1 className="hero-title max-w-5xl">{article.title}</h1>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/75">
              <span className="inline-flex items-center gap-2"><NotebookTabs className="h-4 w-4 text-rysen-amber" aria-hidden="true" /> {article.date}</span>
              <span className="inline-flex items-center gap-2"><UserRound className="h-4 w-4 text-rysen-amber" aria-hidden="true" /> {article.author}</span>
              <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-rysen-amber" aria-hidden="true" /> {estimateReadingTime(article.body)}</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <img src={article.featuredImage} alt={article.featuredImageAlt || `${article.title} visual`} className="aspect-[16/10] w-full rounded-lg object-cover shadow-executive" />
          </Reveal>
        </div>
      </section>

      <section className="section bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.34fr_1fr] lg:px-8">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <ButtonLink to="/resources" variant="secondary" showIcon={false}><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Resources</ButtonLink>
            <div className="mt-8 border-t border-rysen-ink/10 pt-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rysen-charcoal/55">Share this article</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={shareArticle} className="grid h-11 w-11 place-items-center rounded-full bg-rysen-ink text-white transition hover:bg-rysen-orange" aria-label="Share article"><Share2 className="h-4 w-4" /></button>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-rysen-ink/10 text-rysen-charcoal transition hover:border-rysen-orange hover:text-rysen-orange" aria-label="Share on LinkedIn"><Linkedin className="h-4 w-4" /></a>
                <a href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`} className="grid h-11 w-11 place-items-center rounded-full border border-rysen-ink/10 text-rysen-charcoal transition hover:border-rysen-orange hover:text-rysen-orange" aria-label="Share by email"><Mail className="h-4 w-4" /></a>
                <button type="button" onClick={copyLink} className="grid h-11 w-11 place-items-center rounded-full border border-rysen-ink/10 text-rysen-charcoal transition hover:border-rysen-orange hover:text-rysen-orange" aria-label="Copy article link">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button>
              </div>
              {copied && <p role="status" className="mt-3 text-sm font-semibold text-rysen-orange">Link copied.</p>}
            </div>
          </aside>
          <article className="max-w-4xl">
            <p className="border-l-4 border-rysen-orange pl-6 text-2xl leading-10 text-rysen-charcoal/80">{article.excerpt}</p>
            <div className="article-rich-content mt-10" dangerouslySetInnerHTML={{ __html: safeBody }} />
            {article.videoFile && <video src={article.videoFile} className="mt-10 aspect-video w-full rounded-lg bg-rysen-ink" controls />}
            {!article.videoFile && embedUrl && <iframe className="mt-10 aspect-video w-full rounded-lg" src={embedUrl} title={`${article.title} video`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />}
            {!article.videoFile && article.videoUrl && !embedUrl && <a href={article.videoUrl} className="mt-10 inline-flex font-bold text-rysen-orange" target="_blank" rel="noreferrer">Watch related video</a>}
          </article>
        </div>
      </section>

      <section className="bg-rysen-ivory py-16 md:py-20">
        <Reveal className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="eyebrow">RYSEN Notes</p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-rysen-ink md:text-5xl">Useful leadership thinking, delivered with restraint.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-rysen-charcoal/70">Join for occasional practical notes on leadership, culture, executive presence, and the future of work.</p>
          <NewsletterSignup />
        </Reveal>
      </section>

      {recommended.length > 0 && (
        <section className="section bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <p className="eyebrow">Best Articles</p>
              <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <h2 className="max-w-3xl font-display text-4xl leading-tight text-rysen-ink md:text-5xl">Continue exploring the ideas shaping better leadership.</h2>
                <Link to="/resources" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-rysen-orange">View all resources <ArrowUpRight className="h-4 w-4" /></Link>
              </div>
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {recommended.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.05}>
                  <article className="flex h-full flex-col overflow-hidden rounded-lg border border-rysen-ink/10 bg-rysen-soft">
                    <img src={item.featuredImage} alt={item.featuredImageAlt || item.title} loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover" />
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-rysen-orange">{item.category}</p>
                      <h3 className="mt-4 text-2xl font-semibold leading-tight text-rysen-ink">{item.title}</h3>
                      <p className="mt-4 flex-1 leading-7 text-rysen-charcoal/70">{item.excerpt}</p>
                      <Link to={`/resources/${item.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-rysen-orange">Read article <ArrowUpRight className="h-4 w-4" /></Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
