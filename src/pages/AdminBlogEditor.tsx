import { ArrowLeft, FileImage, Globe2, Plus, Save, Send, Video, X } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RichTextEditor } from "../components/RichTextEditor";
import { Seo } from "../components/Seo";
import { createBackendBlog, createBackendCategory, getBackendBlogs, getBackendCategories, updateBackendBlog } from "../utils/api";
import { articleBodyToHtml, defaultResourceImages, fileToDataUrl, getAllCategories, getSeedArticles, slugify, type ResourceArticle, type ResourceCategory } from "../utils/resourceStore";

type ArticleForm = Omit<ResourceArticle, "id" | "createdAt" | "updatedAt" | "source">;

const inputClass = "mt-2 min-h-11 w-full rounded-md border border-rysen-ink/10 bg-white px-3 py-2 text-sm text-rysen-ink outline-none transition placeholder:text-rysen-charcoal/40 focus:border-rysen-orange focus:ring-4 focus:ring-rysen-orange/10";
const labelClass = "text-xs font-bold uppercase tracking-[0.18em] text-rysen-charcoal/55";

function blankArticle(): ArticleForm {
  const category = getAllCategories()[0];
  return {
    title: "", slug: "", categoryId: category?.id ?? "", category: category?.name ?? "Leadership",
    excerpt: "", body: "", author: "Bidisha Banerjee", date: new Date().toISOString().slice(0, 10), status: "Draft",
    featuredImage: defaultResourceImages[0], featuredImageAlt: "", videoUrl: "", videoFile: "", seoTitle: "",
    seoDescription: "", seoKeywords: "", canonicalUrl: "", ogTitle: "", ogDescription: "", ogImage: "",
  };
}

function toForm(article: ResourceArticle): ArticleForm {
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, source: _source, ...form } = article;
  void _id;
  void _createdAt;
  void _updatedAt;
  void _source;
  return { ...form, body: articleBodyToHtml(form.body) };
}

export function AdminBlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ResourceCategory[]>(getAllCategories);
  const [form, setForm] = useState<ArticleForm>(blankArticle);
  const [backendId, setBackendId] = useState<string | null>(null);
  const [source, setSource] = useState<"new" | "admin" | "seed">("new");
  const [message, setMessage] = useState(id ? "Loading article…" : "");
  const [saving, setSaving] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryMessage, setCategoryMessage] = useState("");
  const [categorySaving, setCategorySaving] = useState(false);

  useEffect(() => {
    getBackendCategories()
      .then((savedCategories) => {
        setCategories((current) => {
          const combined = [...current, ...savedCategories];
          const seen = new Set<string>();
          return combined.filter((category) => {
            if (seen.has(category.slug)) return false;
            seen.add(category.slug);
            return true;
          });
        });
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Could not load categories."));
  }, []);

  useEffect(() => {
    if (!id) return;
    getBackendBlogs()
      .then((backend) => {
        const managed = backend.find((article) => article.id === id);
        const seed = getSeedArticles().find((article) => article.id === id);
        const article = managed ?? seed;
        if (!article) throw new Error("Article not found.");
        setForm(toForm(article));
        setCategories((current) => current.some((category) => category.slug === slugify(article.category)) ? current : [...current, { id: article.categoryId, name: article.category, slug: slugify(article.category), description: "", createdAt: article.createdAt }]);
        setBackendId(managed?.id ?? null);
        setSource(managed ? "admin" : "seed");
        setMessage("");
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Could not load article."));
  }, [id]);

  function update<K extends keyof ArticleForm>(field: K, value: ArticleForm[K]) {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "title" && (!id || !current.slug)) {
        next.slug = slugify(String(value));
        next.canonicalUrl = `/resources/${next.slug}`;
      }
      if (field === "category") {
        next.categoryId = categories.find((category) => category.name === value)?.id ?? `admin-category-${slugify(String(value))}`;
      }
      return next;
    });
    setMessage("");
  }

  async function upload(field: "featuredImage" | "videoFile", event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    update(field, dataUrl);
    if (field === "featuredImage" && !form.featuredImageAlt) update("featuredImageAlt", file.name.replace(/\.[^.]+$/, ""));
  }

  async function addCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = categoryName.trim();
    if (!name) {
      setCategoryMessage("Enter a category name.");
      return;
    }
    const categorySlug = slugify(name);
    const existing = categories.find((category) => category.slug === categorySlug);
    if (existing) {
      setForm((current) => ({ ...current, categoryId: existing.id, category: existing.name }));
      setCategoryMessage("That category already exists and has been selected.");
      return;
    }
    setCategorySaving(true);
    setCategoryMessage("");
    try {
      const created = await createBackendCategory({ name, description: categoryDescription.trim() });
      setCategories((current) => [...current, created]);
      setForm((current) => ({ ...current, categoryId: created.id, category: created.name }));
      setCategoryName("");
      setCategoryDescription("");
      setCategoryModalOpen(false);
      setMessage(`Category “${created.name}” created and selected.`);
    } catch (error) {
      setCategoryMessage(error instanceof Error ? error.message : "Category could not be created.");
    } finally {
      setCategorySaving(false);
    }
  }

  async function save(status: "Draft" | "Published") {
    if (!form.title.trim() || !form.excerpt.trim() || !form.body.trim()) {
      setMessage("Title, summary, and article content are required.");
      return;
    }
    setSaving(true);
    const slug = form.slug.trim() || slugify(form.title);
    const payload: ArticleForm = {
      ...form,
      status,
      slug,
      categoryId: form.categoryId || `admin-category-${slugify(form.category)}`,
      canonicalUrl: form.canonicalUrl || `/resources/${slug}`,
      seoTitle: form.seoTitle || form.title,
      seoDescription: form.seoDescription || form.excerpt,
      ogTitle: form.ogTitle || form.seoTitle || form.title,
      ogDescription: form.ogDescription || form.seoDescription || form.excerpt,
      ogImage: form.ogImage || form.featuredImage,
    };
    try {
      const saved = backendId ? await updateBackendBlog(backendId, payload) : await createBackendBlog(payload);
      navigate(`/admin/resources/${saved.id}/view`, { replace: true, state: { message: status === "Published" ? "Article published successfully." : "Draft saved successfully." } });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Article could not be saved.");
      setSaving(false);
    }
  }

  return (
    <>
      <Seo title={`${id ? "Edit" : "Create"} Article`} description="RYSEN article editor." path={id ? `/admin/resources/${id}/edit` : "/admin/resources/new"} />
      <section className="border-b border-rysen-ink/10 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <Link to="/admin/resources" className="inline-flex items-center gap-2 text-sm font-bold text-rysen-charcoal/60 transition hover:text-rysen-orange"><ArrowLeft className="h-4 w-4" /> Back to articles</Link>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-rysen-orange">Article Editor</p>
            <h1 className="mt-2 font-display text-4xl text-rysen-ink md:text-5xl">{id ? "Edit article" : "Create a new article"}</h1>
            {source === "seed" && <p className="mt-2 text-sm text-rysen-charcoal/60">Saving creates an editable managed version of this built-in article.</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" disabled={saving} onClick={() => save("Draft")} className="inline-flex items-center gap-2 rounded-full border border-rysen-ink/15 bg-white px-5 py-3 text-sm font-bold text-rysen-ink transition hover:border-rysen-orange disabled:opacity-50"><Save className="h-4 w-4" /> Save Draft</button>
            <button type="button" disabled={saving} onClick={() => save("Published")} className="inline-flex items-center gap-2 rounded-full bg-orange-sheen px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-50"><Send className="h-4 w-4" /> {saving ? "Saving…" : "Publish Article"}</button>
          </div>
        </div>
      </section>

      <section className="section bg-rysen-soft">
        <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
          {message && <p role="alert" className="rounded-lg border border-rysen-orange/20 bg-rysen-ivory px-4 py-3 text-sm font-semibold text-rysen-charcoal/75">{message}</p>}

          <section className="rounded-xl border border-rysen-ink/8 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-rysen-ink">Article details</h2>
            <p className="mt-1 text-sm text-rysen-charcoal/55">The information readers will see in the article header and listing.</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="md:col-span-2"><span className={labelClass}>Title *</span><input required value={form.title} onChange={(event) => update("title", event.target.value)} className={inputClass} placeholder="Why Executive Presence Matters Now" /></label>
              <label><span className={labelClass}>Slug</span><input value={form.slug} onChange={(event) => update("slug", slugify(event.target.value))} className={inputClass} placeholder="article-url-slug" /></label>
              <div>
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="article-category" className={labelClass}>Category</label>
                  <button type="button" onClick={() => { setCategoryMessage(""); setCategoryModalOpen(true); }} className="inline-flex items-center gap-1 text-xs font-bold text-rysen-orange transition hover:text-rysen-ember"><Plus className="h-3.5 w-3.5" /> Add category</button>
                </div>
                <select id="article-category" value={form.category} onChange={(event) => update("category", event.target.value)} className={inputClass}>
                  {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
                </select>
              </div>
              <label><span className={labelClass}>Author</span><input value={form.author} onChange={(event) => update("author", event.target.value)} className={inputClass} /></label>
              <label><span className={labelClass}>Publish date</span><input type="date" value={form.date} onChange={(event) => update("date", event.target.value)} className={inputClass} /></label>
              <label className="md:col-span-2"><span className={labelClass}>Summary *</span><textarea value={form.excerpt} onChange={(event) => update("excerpt", event.target.value)} className={`${inputClass} min-h-28 resize-y`} placeholder="A concise introduction for article cards and search results." /></label>
            </div>
          </section>

          <section className="rounded-xl border border-rysen-ink/8 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-rysen-ink">Article content</h2>
            <p className="mt-1 text-sm text-rysen-charcoal/55">Format headings, emphasis, links, quotes, and lists using the editor toolbar.</p>
            <div className="mt-6"><span className={labelClass}>Body *</span><RichTextEditor value={form.body} onChange={(value) => update("body", value)} /></div>
          </section>

          <section className="rounded-xl border border-rysen-ink/8 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3"><FileImage className="h-5 w-5 text-rysen-orange" /><h2 className="text-2xl font-semibold text-rysen-ink">Featured media</h2></div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label><span className={labelClass}>Image URL</span><input value={form.featuredImage} onChange={(event) => update("featuredImage", event.target.value)} className={inputClass} /></label>
              <label><span className={labelClass}>Upload image</span><input type="file" accept="image/*" onChange={(event) => upload("featuredImage", event)} className={`${inputClass} file:mr-3 file:rounded-full file:border-0 file:bg-rysen-ink file:px-3 file:py-2 file:text-white`} /></label>
              <label className="md:col-span-2"><span className={labelClass}>Image alt text</span><input value={form.featuredImageAlt} onChange={(event) => update("featuredImageAlt", event.target.value)} className={inputClass} placeholder="Describe the image for accessibility" /></label>
            </div>
            {form.featuredImage && <img src={form.featuredImage} alt={form.featuredImageAlt || "Featured preview"} className="mt-5 aspect-[16/7] w-full rounded-lg object-cover" />}
            <div className="mt-7 grid gap-5 border-t border-rysen-ink/10 pt-6 md:grid-cols-2">
              <label><span className={`${labelClass} inline-flex items-center gap-2`}><Video className="h-4 w-4" /> Video URL</span><input value={form.videoUrl} onChange={(event) => update("videoUrl", event.target.value)} className={inputClass} placeholder="https://…" /></label>
              <label><span className={labelClass}>Upload video</span><input type="file" accept="video/*" onChange={(event) => upload("videoFile", event)} className={`${inputClass} file:mr-3 file:rounded-full file:border-0 file:bg-rysen-ink file:px-3 file:py-2 file:text-white`} /></label>
            </div>
          </section>

          <section className="rounded-xl border border-rysen-ink/8 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3"><Globe2 className="h-5 w-5 text-rysen-orange" /><h2 className="text-2xl font-semibold text-rysen-ink">Search and social</h2></div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label><span className={labelClass}>SEO title</span><input value={form.seoTitle} onChange={(event) => update("seoTitle", event.target.value)} className={inputClass} /></label>
              <label><span className={labelClass}>Keywords</span><input value={form.seoKeywords} onChange={(event) => update("seoKeywords", event.target.value)} className={inputClass} placeholder="leadership, coaching, executive presence" /></label>
              <label className="md:col-span-2"><span className={labelClass}>SEO description</span><textarea value={form.seoDescription} onChange={(event) => update("seoDescription", event.target.value)} className={`${inputClass} min-h-24 resize-y`} /></label>
              <label className="md:col-span-2"><span className={labelClass}>Canonical URL</span><input value={form.canonicalUrl} onChange={(event) => update("canonicalUrl", event.target.value)} className={inputClass} /></label>
              <label><span className={labelClass}>Social title</span><input value={form.ogTitle} onChange={(event) => update("ogTitle", event.target.value)} className={inputClass} /></label>
              <label><span className={labelClass}>Social image</span><input value={form.ogImage} onChange={(event) => update("ogImage", event.target.value)} className={inputClass} /></label>
              <label className="md:col-span-2"><span className={labelClass}>Social description</span><textarea value={form.ogDescription} onChange={(event) => update("ogDescription", event.target.value)} className={`${inputClass} min-h-24 resize-y`} /></label>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link to="/admin/resources" className="rounded-full border border-rysen-ink/15 px-6 py-3 text-center text-sm font-bold text-rysen-ink">Cancel</Link>
            <button type="button" disabled={saving} onClick={() => save("Draft")} className="inline-flex items-center justify-center gap-2 rounded-full border border-rysen-ink/15 bg-white px-6 py-3 text-sm font-bold"><Save className="h-4 w-4" /> Save Draft</button>
            <button type="button" disabled={saving} onClick={() => save("Published")} className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-sheen px-6 py-3 text-sm font-bold text-white"><Send className="h-4 w-4" /> Publish Article</button>
          </div>
        </div>
      </section>

      {categoryModalOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-rysen-ink/65 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCategoryModalOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="new-category-title" className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-rysen-orange">Blog categories</p>
                <h2 id="new-category-title" className="mt-2 text-3xl font-semibold text-rysen-ink">Add new category</h2>
                <p className="mt-2 text-sm leading-6 text-rysen-charcoal/60">The new category will be saved and selected for this article.</p>
              </div>
              <button type="button" onClick={() => setCategoryModalOpen(false)} aria-label="Close category popup" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-rysen-ink/10 text-rysen-charcoal hover:text-rysen-orange"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={addCategory} className="mt-7 space-y-5">
              <label className="block"><span className={labelClass}>Category name *</span><input autoFocus value={categoryName} onChange={(event) => { setCategoryName(event.target.value); setCategoryMessage(""); }} className={inputClass} placeholder="Leadership Insights" /></label>
              <label className="block"><span className={labelClass}>Description</span><textarea value={categoryDescription} onChange={(event) => setCategoryDescription(event.target.value)} className={`${inputClass} min-h-28 resize-y`} placeholder="A short description of this category" /></label>
              {categoryMessage && <p role="alert" className="rounded-lg bg-rysen-ivory px-4 py-3 text-sm font-semibold text-rysen-charcoal/75">{categoryMessage}</p>}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setCategoryModalOpen(false)} className="rounded-full border border-rysen-ink/15 px-5 py-3 text-sm font-bold">Cancel</button>
                <button type="submit" disabled={categorySaving} className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-sheen px-5 py-3 text-sm font-bold text-white disabled:opacity-50"><Plus className="h-4 w-4" /> {categorySaving ? "Creating…" : "Create Category"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
