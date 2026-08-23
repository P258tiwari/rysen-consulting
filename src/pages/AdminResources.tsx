import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  Edit3,
  FileImage,
  Film,
  FolderPlus,
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { createBackendBlog, deleteBackendBlog, getBackendBlogs, updateBackendBlog } from "../utils/api";
import {
  defaultResourceImages,
  fileToDataUrl,
  getAllArticles,
  getAllCategories,
  getStoredCategories,
  saveStoredCategories,
  slugify,
  type ResourceArticle,
  type ResourceCategory,
} from "../utils/resourceStore";

type ArticleForm = Omit<ResourceArticle, "id" | "createdAt" | "updatedAt" | "source">;

const now = () => new Date().toISOString();

function emptyArticle(categories: ResourceCategory[]): ArticleForm {
  const firstCategory = categories[0];
  return {
    title: "",
    slug: "",
    categoryId: firstCategory?.id ?? "",
    category: firstCategory?.name ?? "",
    excerpt: "",
    body: "",
    author: "Bidisha Banerjee",
    date: new Date().toISOString().slice(0, 10),
    status: "Draft",
    featuredImage: defaultResourceImages[0],
    featuredImageAlt: "",
    videoUrl: "",
    videoFile: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
  };
}

const inputClass =
  "min-h-11 rounded-md border border-rysen-ink/10 bg-white px-3 py-2 text-sm text-rysen-ink outline-none transition placeholder:text-rysen-charcoal/40 focus:border-rysen-orange focus:ring-4 focus:ring-rysen-orange/10";

const labelClass = "text-xs font-bold uppercase tracking-[0.18em] text-rysen-charcoal/55";

export function AdminResources() {
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [storedCategories, setStoredCategories] = useState<ResourceCategory[]>([]);
  const [storedArticles, setStoredArticles] = useState<ResourceArticle[]>([]);
  const [form, setForm] = useState<ArticleForm>(() => emptyArticle([]));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const allCategories = getAllCategories();
    setCategories(allCategories);
    setStoredCategories(getStoredCategories());
    setForm(emptyArticle(allCategories));
    getBackendBlogs()
      .then(setStoredArticles)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Could not load backend articles."));
  }, []);

  const articles = useMemo(() => [...storedArticles, ...getAllArticles().filter((article) => article.source === "seed")], [storedArticles]);

  const filteredArticles = articles.filter((article) => {
    const target = `${article.title} ${article.category} ${article.status}`.toLowerCase();
    return target.includes(query.toLowerCase());
  });

  async function refresh() {
    const allCategories = getAllCategories();
    setCategories(allCategories);
    setStoredCategories(getStoredCategories());
    setStoredArticles(await getBackendBlogs());
  }

  function updateForm<K extends keyof ArticleForm>(field: K, value: ArticleForm[K]) {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "title") {
        next.slug = slugify(String(value));
        next.seoTitle = next.seoTitle || String(value);
        next.ogTitle = next.ogTitle || String(value);
        next.canonicalUrl = `/resources/${next.slug}`;
      }
      if (field === "excerpt") {
        next.seoDescription = next.seoDescription || String(value);
        next.ogDescription = next.ogDescription || String(value);
      }
      if (field === "featuredImage") {
        next.ogImage = next.ogImage || String(value);
      }
      if (field === "categoryId") {
        const selected = categories.find((category) => category.id === value);
        next.category = selected?.name ?? "";
      }
      return next;
    });
    setMessage("");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyArticle(categories));
  }

  function addCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = categoryName.trim();
    if (!name) {
      setMessage("Add a category name first.");
      return;
    }
    const slug = slugify(name);
    if (categories.some((category) => category.slug === slug)) {
      setMessage("That category already exists.");
      return;
    }
    const nextCategory: ResourceCategory = {
      id: `admin-category-${crypto.randomUUID()}`,
      name,
      slug,
      description: categoryDescription.trim(),
      createdAt: now(),
    };
    const nextStored = [...storedCategories, nextCategory];
    saveStoredCategories(nextStored);
    setCategoryName("");
    setCategoryDescription("");
    void refresh().catch((error) => setMessage(error instanceof Error ? error.message : "Could not refresh articles."));
    setMessage("Category created.");
  }

  async function deleteCategory(id: string) {
    const category = storedCategories.find((item) => item.id === id);
    if (!category) return;
    const nextCategories = storedCategories.filter((item) => item.id !== id);
    saveStoredCategories(nextCategories);
    try {
      await Promise.all(
        storedArticles
          .filter((article) => article.categoryId === id)
          .map((article) => updateBackendBlog(article.id, { categoryId: categories[0]?.id ?? "", category: categories[0]?.name ?? "" })),
      );
      await refresh();
      setMessage("Category removed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Category could not be removed.");
    }
  }

  async function handleImageFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    updateForm("featuredImage", dataUrl);
    updateForm("featuredImageAlt", form.featuredImageAlt || file.name.replace(/\.[^.]+$/, ""));
  }

  async function handleVideoFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    updateForm("videoFile", dataUrl);
  }

  async function submitArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title.trim() || !form.categoryId || !form.excerpt.trim()) {
      setMessage("Title, category, and excerpt are required.");
      return;
    }

    const slug = form.slug || slugify(form.title);
    const selectedCategory = categories.find((category) => category.id === form.categoryId);
    const payload = {
      ...form,
      slug,
      category: selectedCategory?.name ?? form.category,
      canonicalUrl: form.canonicalUrl || `/resources/${slug}`,
      seoTitle: form.seoTitle || form.title,
      seoDescription: form.seoDescription || form.excerpt,
      ogTitle: form.ogTitle || form.seoTitle || form.title,
      ogDescription: form.ogDescription || form.seoDescription || form.excerpt,
      ogImage: form.ogImage || form.featuredImage,
    };
    try {
      if (editingId) await updateBackendBlog(editingId, payload);
      else await createBackendBlog(payload);
      await refresh();
      resetForm();
      setMessage(editingId ? "Article updated." : "Article created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Article could not be saved.");
    }
  }

  function editArticle(article: ResourceArticle) {
    if (article.source === "seed") {
      const clone = {
        ...article,
        id: `admin-article-${crypto.randomUUID()}`,
        source: "admin" as const,
        createdAt: now(),
        updatedAt: now(),
      };
      setEditingId(null);
      setForm(clone);
      setMessage("Seed article copied into the editor. Save to create an editable version.");
      return;
    }
    setEditingId(article.id);
    const editable: ArticleForm = {
      title: article.title,
      slug: article.slug,
      categoryId: article.categoryId,
      category: article.category,
      excerpt: article.excerpt,
      body: article.body,
      author: article.author,
      date: article.date,
      status: article.status,
      featuredImage: article.featuredImage,
      featuredImageAlt: article.featuredImageAlt,
      videoUrl: article.videoUrl,
      videoFile: article.videoFile,
      seoTitle: article.seoTitle,
      seoDescription: article.seoDescription,
      seoKeywords: article.seoKeywords,
      canonicalUrl: article.canonicalUrl,
      ogTitle: article.ogTitle,
      ogDescription: article.ogDescription,
      ogImage: article.ogImage,
    };
    setForm(editable);
    setMessage("");
  }

  async function deleteArticle(id: string) {
    try {
      await deleteBackendBlog(id);
      await refresh();
      if (editingId === id) resetForm();
      setMessage("Article deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Article could not be deleted.");
    }
  }

  return (
    <>
      <Seo
        title="Resources Admin"
        description="Admin dashboard for managing RYSEN resource articles, categories, media, and SEO metadata."
        path="/admin/resources"
      />
      <section className="bg-rysen-ink py-10 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Admin Dashboard</p>
            <h1 className="mt-4 font-display text-5xl leading-tight md:text-6xl">Resources manager</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-white/70">
              Create article categories, publish insights, attach images or video, and prepare SEO metadata.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="bg-rysen-soft py-8">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            ["Total articles", articles.length],
            ["Admin articles", storedArticles.length],
            ["Categories", categories.length],
            ["Published", articles.filter((article) => article.status === "Published").length],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-rysen-charcoal/50">{label}</p>
              <p className="mt-2 font-display text-4xl text-rysen-ink">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          <aside className="space-y-6">
            <Reveal>
              <form onSubmit={addCategory} className="rounded-lg border border-rysen-ink/10 bg-rysen-ivory p-6">
                <div className="flex items-center gap-3">
                  <FolderPlus className="h-5 w-5 text-rysen-orange" aria-hidden="true" />
                  <h2 className="text-xl font-semibold text-rysen-ink">Categories</h2>
                </div>
                <label className="mt-5 block">
                  <span className={labelClass}>Name</span>
                  <input className={`${inputClass} mt-2 w-full`} value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="Executive Presence" />
                </label>
                <label className="mt-4 block">
                  <span className={labelClass}>Description</span>
                  <textarea className={`${inputClass} mt-2 min-h-24 w-full resize-y`} value={categoryDescription} onChange={(event) => setCategoryDescription(event.target.value)} placeholder="Short category description" />
                </label>
                <button className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-rysen-ink px-5 py-2 text-sm font-bold text-white">
                  <Plus className="h-4 w-4" aria-hidden="true" /> Create Category
                </button>
              </form>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="rounded-lg border border-rysen-ink/10 bg-white p-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-rysen-charcoal/50">Existing categories</h3>
                <div className="mt-4 grid gap-3">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between gap-3 rounded-md bg-rysen-soft px-4 py-3">
                      <div>
                        <p className="font-semibold text-rysen-ink">{category.name}</p>
                        <p className="text-xs text-rysen-charcoal/50">{category.slug}</p>
                      </div>
                      {category.id.startsWith("admin") && (
                        <button
                          type="button"
                          className="rounded-full p-2 text-rysen-charcoal/60 hover:bg-white hover:text-rysen-ember"
                          aria-label={`Delete ${category.name}`}
                          onClick={() => deleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-lg border border-rysen-ink/10 bg-rysen-ink p-6 text-white">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-rysen-orange" aria-hidden="true" />
                  <h2 className="text-xl font-semibold">Articles</h2>
                </div>
                <input
                  className="mt-5 min-h-11 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-rysen-orange"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search articles"
                />
                <div className="mt-5 max-h-[520px] space-y-3 overflow-auto pr-1">
                  {filteredArticles.map((article) => (
                    <article key={article.id} className="rounded-md bg-white/10 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-rysen-orange">{article.category}</p>
                          <h3 className="mt-2 font-semibold leading-snug">{article.title}</h3>
                          <p className="mt-2 text-xs text-white/55">{article.status} / {article.source}</p>
                        </div>
                        <div className="flex gap-1">
                          <button type="button" className="rounded-full p-2 hover:bg-white/10" aria-label={`Edit ${article.title}`} onClick={() => editArticle(article)}>
                            <Edit3 className="h-4 w-4" aria-hidden="true" />
                          </button>
                          {article.source === "admin" && (
                            <button type="button" className="rounded-full p-2 hover:bg-white/10 hover:text-rysen-ember" aria-label={`Delete ${article.title}`} onClick={() => deleteArticle(article.id)}>
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </Reveal>
          </aside>

          <Reveal delay={0.05}>
            <form onSubmit={submitArticle} className="rounded-lg border border-rysen-ink/10 bg-white p-6 shadow-executive">
              <div className="flex flex-col gap-4 border-b border-rysen-ink/10 pb-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-rysen-orange">Article editor</p>
                  <h2 className="mt-2 text-3xl font-semibold text-rysen-ink">{editingId ? "Edit article" : "Create article"}</h2>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={resetForm} className="rounded-full border border-rysen-ink/10 px-5 py-2 text-sm font-bold text-rysen-ink">
                    New
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-full bg-orange-sheen px-5 py-2 text-sm font-bold text-white">
                    <Save className="h-4 w-4" aria-hidden="true" /> Save Article
                  </button>
                </div>
              </div>

              {message && <p className="mt-5 rounded-md bg-rysen-ivory px-4 py-3 text-sm font-semibold text-rysen-charcoal">{message}</p>}

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className={labelClass}>Title</span>
                  <input className={`${inputClass} mt-2 w-full`} value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="Why Executive Presence Matters Now" />
                </label>
                <label className="block">
                  <span className={labelClass}>Slug</span>
                  <input className={`${inputClass} mt-2 w-full`} value={form.slug} onChange={(event) => updateForm("slug", slugify(event.target.value))} placeholder="why-executive-presence-matters" />
                </label>
                <label className="block">
                  <span className={labelClass}>Category</span>
                  <select className={`${inputClass} mt-2 w-full`} value={form.categoryId} onChange={(event) => updateForm("categoryId", event.target.value)}>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={labelClass}>Author</span>
                  <input className={`${inputClass} mt-2 w-full`} value={form.author} onChange={(event) => updateForm("author", event.target.value)} />
                </label>
                <label className="block">
                  <span className={labelClass}>Publish Date</span>
                  <input type="date" className={`${inputClass} mt-2 w-full`} value={form.date} onChange={(event) => updateForm("date", event.target.value)} />
                </label>
                <label className="block">
                  <span className={labelClass}>Status</span>
                  <select className={`${inputClass} mt-2 w-full`} value={form.status} onChange={(event) => updateForm("status", event.target.value as ArticleForm["status"])}>
                    <option>Draft</option>
                    <option>Published</option>
                  </select>
                </label>
                <label className="block md:col-span-2">
                  <span className={labelClass}>Excerpt</span>
                  <textarea className={`${inputClass} mt-2 min-h-24 w-full resize-y`} value={form.excerpt} onChange={(event) => updateForm("excerpt", event.target.value)} placeholder="Short public card summary" />
                </label>
                <label className="block md:col-span-2">
                  <span className={labelClass}>Article Body</span>
                  <textarea className={`${inputClass} mt-2 min-h-44 w-full resize-y`} value={form.body} onChange={(event) => updateForm("body", event.target.value)} placeholder="Full article content" />
                </label>
              </div>

              <div className="mt-8 grid gap-6 border-t border-rysen-ink/10 pt-6 lg:grid-cols-2">
                <div>
                  <div className="flex items-center gap-3">
                    <FileImage className="h-5 w-5 text-rysen-orange" aria-hidden="true" />
                    <h3 className="text-xl font-semibold text-rysen-ink">Image</h3>
                  </div>
                  <label className="mt-4 block">
                    <span className={labelClass}>Image URL</span>
                    <input className={`${inputClass} mt-2 w-full`} value={form.featuredImage} onChange={(event) => updateForm("featuredImage", event.target.value)} placeholder="/assets/images/executive-presence.svg" />
                  </label>
                  <label className="mt-4 block">
                    <span className={labelClass}>Upload Image</span>
                    <input type="file" accept="image/*" className={`${inputClass} mt-2 w-full file:mr-3 file:rounded-full file:border-0 file:bg-rysen-ink file:px-4 file:py-2 file:text-sm file:font-bold file:text-white`} onChange={handleImageFile} />
                  </label>
                  <label className="mt-4 block">
                    <span className={labelClass}>Alt Text</span>
                    <input className={`${inputClass} mt-2 w-full`} value={form.featuredImageAlt} onChange={(event) => updateForm("featuredImageAlt", event.target.value)} placeholder="Describe the image for accessibility" />
                  </label>
                  {form.featuredImage && <img src={form.featuredImage} alt={form.featuredImageAlt || "Article preview"} className="mt-4 aspect-[16/9] w-full rounded-lg object-cover" />}
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <Film className="h-5 w-5 text-rysen-orange" aria-hidden="true" />
                    <h3 className="text-xl font-semibold text-rysen-ink">Video</h3>
                  </div>
                  <label className="mt-4 block">
                    <span className={labelClass}>Video URL</span>
                    <input className={`${inputClass} mt-2 w-full`} value={form.videoUrl} onChange={(event) => updateForm("videoUrl", event.target.value)} placeholder="https://youtube.com/..." />
                  </label>
                  <label className="mt-4 block">
                    <span className={labelClass}>Upload Video</span>
                    <input type="file" accept="video/*" className={`${inputClass} mt-2 w-full file:mr-3 file:rounded-full file:border-0 file:bg-rysen-ink file:px-4 file:py-2 file:text-sm file:font-bold file:text-white`} onChange={handleVideoFile} />
                  </label>
                  {form.videoFile && <video src={form.videoFile} className="mt-4 aspect-video w-full rounded-lg bg-rysen-ink" controls />}
                  {form.videoUrl && !form.videoFile && (
                    <div className="mt-4 rounded-lg bg-rysen-soft p-4 text-sm font-semibold text-rysen-charcoal/70">
                      Linked video: {form.videoUrl}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 border-t border-rysen-ink/10 pt-6">
                <h3 className="text-xl font-semibold text-rysen-ink">SEO Data</h3>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className={labelClass}>SEO Title</span>
                    <input className={`${inputClass} mt-2 w-full`} value={form.seoTitle} onChange={(event) => updateForm("seoTitle", event.target.value)} />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Canonical URL</span>
                    <input className={`${inputClass} mt-2 w-full`} value={form.canonicalUrl} onChange={(event) => updateForm("canonicalUrl", event.target.value)} />
                  </label>
                  <label className="block md:col-span-2">
                    <span className={labelClass}>SEO Description</span>
                    <textarea className={`${inputClass} mt-2 min-h-20 w-full resize-y`} value={form.seoDescription} onChange={(event) => updateForm("seoDescription", event.target.value)} />
                  </label>
                  <label className="block md:col-span-2">
                    <span className={labelClass}>SEO Keywords</span>
                    <input className={`${inputClass} mt-2 w-full`} value={form.seoKeywords} onChange={(event) => updateForm("seoKeywords", event.target.value)} placeholder="leadership, executive presence, coaching" />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Open Graph Title</span>
                    <input className={`${inputClass} mt-2 w-full`} value={form.ogTitle} onChange={(event) => updateForm("ogTitle", event.target.value)} />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Open Graph Image</span>
                    <input className={`${inputClass} mt-2 w-full`} value={form.ogImage} onChange={(event) => updateForm("ogImage", event.target.value)} />
                  </label>
                  <label className="block md:col-span-2">
                    <span className={labelClass}>Open Graph Description</span>
                    <textarea className={`${inputClass} mt-2 min-h-20 w-full resize-y`} value={form.ogDescription} onChange={(event) => updateForm("ogDescription", event.target.value)} />
                  </label>
                </div>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
