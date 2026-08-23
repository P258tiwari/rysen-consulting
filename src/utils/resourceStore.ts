import { resources } from "../data/content";

export type ResourceCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
};

export type ResourceArticle = {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  category: string;
  excerpt: string;
  body: string;
  author: string;
  date: string;
  status: "Draft" | "Published";
  featuredImage: string;
  featuredImageAlt: string;
  videoUrl: string;
  videoFile: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  createdAt: string;
  updatedAt: string;
  source: "seed" | "admin";
};

const CATEGORY_KEY = "rysen-resource-categories";
const ARTICLE_KEY = "rysen-resource-articles";

export const defaultResourceImages = [
  "/assets/images/bidisha-hero-v2.webp",
  "/assets/images/bidisha-welspun-program.webp",
  "/assets/images/bidisha-hero.webp",
  "/assets/images/bidisha-hero-moible.webp",
  "/assets/images/bidisha-corporate-session.webp",
  "/assets/images/bidisha-executive-coaching.webp",
];

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function articleBodyToHtml(body: string) {
  const trimmed = body.trim();
  if (!trimmed) return "";
  if (/<\/?[a-z][\s\S]*>/i.test(trimmed)) return trimmed;
  return trimmed
    .split(/\n\s*\n/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function getSeedCategories(): ResourceCategory[] {
  const names = Array.from(new Set(resources.map((post) => post.category)));
  return names.map((name, index) => ({
    id: `seed-category-${slugify(name)}`,
    name,
    slug: slugify(name),
    description: `${name} insights from RYSEN Leadership and Coaching.`,
    createdAt: `2026-01-${String(index + 1).padStart(2, "0")}`,
  }));
}

export function getSeedArticles(): ResourceArticle[] {
  const categories = getSeedCategories();
  return resources.map((post, index) => {
    const slug = slugify(post.title);
    const category = categories.find((item) => item.name === post.category) ?? categories[0];
    return {
      id: `seed-article-${slug}`,
      title: post.title,
      slug,
      categoryId: category.id,
      category: post.category,
      excerpt: post.excerpt,
      body: `<p>${post.excerpt}</p><p>This resource can be expanded into a full article from the admin dashboard when final editorial copy is ready.</p>`,
      author: "Bidisha Banerjee",
      date: post.date,
      status: "Published",
      featuredImage: defaultResourceImages[index % defaultResourceImages.length],
      featuredImageAlt: `${post.category} insight visual`,
      videoUrl: "",
      videoFile: "",
      seoTitle: post.title,
      seoDescription: post.excerpt,
      seoKeywords: post.category,
      canonicalUrl: `/resources/${slug}`,
      ogTitle: post.title,
      ogDescription: post.excerpt,
      ogImage: defaultResourceImages[index % defaultResourceImages.length],
      createdAt: `2026-01-${String(index + 1).padStart(2, "0")}`,
      updatedAt: `2026-01-${String(index + 1).padStart(2, "0")}`,
      source: "seed",
    };
  });
}

export function getStoredCategories() {
  if (!isBrowser()) return [];
  return safeParse<ResourceCategory[]>(window.localStorage.getItem(CATEGORY_KEY), []);
}

export function getStoredArticles() {
  if (!isBrowser()) return [];
  return safeParse<ResourceArticle[]>(window.localStorage.getItem(ARTICLE_KEY), []);
}

export function saveStoredCategories(categories: ResourceCategory[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
}

export function saveStoredArticles(articles: ResourceArticle[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(ARTICLE_KEY, JSON.stringify(articles));
}

export function getAllCategories() {
  const combined = [...getSeedCategories(), ...getStoredCategories()];
  const seen = new Set<string>();
  return combined.filter((category) => {
    if (seen.has(category.slug)) return false;
    seen.add(category.slug);
    return true;
  });
}

export function getAllArticles() {
  return [...getStoredArticles(), ...getSeedArticles()];
}

export function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
