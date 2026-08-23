import { ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { Seo } from "../components/Seo";
import { getBackendBlogs } from "../utils/api";
import { getAllArticles, getAllCategories, type ResourceArticle, type ResourceCategory } from "../utils/resourceStore";

export function Resources() {
  const [articles, setArticles] = useState<ResourceArticle[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const localArticles = getAllArticles().filter((article) => article.status === "Published");
    setArticles(localArticles);
    setCategories(getAllCategories());
    getBackendBlogs("Published")
      .then((backendArticles) => {
        setArticles(backendArticles);
        setCategories(backendArticles.reduce<ResourceCategory[]>((items, article) => {
          if (!article.category || items.some((category) => category.name === article.category)) return items;
          items.push({
            id: article.categoryId || `backend-category-${article.category}`,
            name: article.category,
            slug: article.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            description: `${article.category} insights from RYSEN.`,
            createdAt: article.createdAt,
          });
          return items;
        }, []));
      })
      .catch(() => undefined);
  }, []);

  const visibleArticles = useMemo(() => {
    if (activeCategory === "All") return articles;
    return articles.filter((article) => article.category === activeCategory);
  }, [activeCategory, articles]);

  return (
    <>
      <Seo
        title="Resources and Insights"
        description="Read RYSEN insights on executive presence, leadership development, AI adoption, psychological safety, and influence."
        path="/resources"
      />
      <section className="page-hero">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Resources / Insights</p>
            <h1 className="hero-title max-w-5xl">Ideas for leaders building capability, culture, and trust.</h1>
          </Reveal>
        </div>
      </section>
      <section className="section bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader eyebrow="Insights" title="Practical thinking for leadership moments that matter." />
          </Reveal>
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
            {["All", ...categories.map((category) => category.name)].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
                  activeCategory === category
                    ? "bg-rysen-orange text-white"
                    : "bg-rysen-ivory text-rysen-charcoal hover:text-rysen-orange"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleArticles.map((post, index) => (
              <Reveal key={post.id} delay={index * 0.04}>
                <article className="flex h-full flex-col overflow-hidden rounded-lg border border-rysen-ink/10 bg-rysen-ivory">
                  <img
                    src={post.featuredImage}
                    alt={post.featuredImageAlt || `${post.category} article visual`}
                    className="aspect-[16/9] w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-rysen-orange">{post.category}</p>
                    <h2 className="mt-5 text-2xl font-semibold leading-tight text-rysen-ink">{post.title}</h2>
                    <p className="mt-4 flex-1 leading-7 text-rysen-charcoal/70">{post.excerpt}</p>
                    <div className="mt-6 flex items-center justify-between gap-4 text-sm">
                    <span className="font-semibold text-rysen-charcoal/50">{post.author}</span>
                    <span className="text-rysen-charcoal/40">{post.date}</span>
                  </div>
                    <Link to={`/resources/${post.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-rysen-orange">
                      Read More <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          {visibleArticles.length === 0 && (
            <div className="mt-12 rounded-lg bg-rysen-ivory p-8 text-center font-semibold text-rysen-charcoal/70">
              No published articles found in this category.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
