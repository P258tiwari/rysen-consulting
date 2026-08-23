import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

function setMeta(selector: string, attr: "content", value: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    if (selector.includes("property=")) {
      tag.setAttribute("property", selector.match(/property="([^"]+)"/)?.[1] ?? "");
    } else {
      tag.setAttribute("name", selector.match(/name="([^"]+)"/)?.[1] ?? "");
    }
    document.head.appendChild(tag);
  }
  tag.setAttribute(attr, value);
}

function setCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = url;
}

export function Seo({ title, description, path = "/", image = "/assets/rysen-logo-black.png", noIndex = false }: SeoProps) {
  useEffect(() => {
    const configuredOrigin = String(import.meta.env.VITE_SITE_URL || "").replace(/\/$/, "");
    const origin = configuredOrigin || window.location.origin;
    const fullTitle = `${title} | RYSEN Leadership and Coaching`;
    const url = `${origin}${path}`;
    const imageUrl = image.startsWith("http") ? image : `${origin}${image}`;
    const preventIndexing = noIndex || path.startsWith("/admin");
    document.title = fullTitle;
    setCanonical(url);
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[name="robots"]', "content", preventIndexing ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:site_name"]', "content", "RYSEN Leadership and Coaching");
    setMeta('meta[property="og:locale"]', "content", "en_IN");
    setMeta('meta[property="og:image"]', "content", imageUrl);
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", imageUrl);
  }, [title, description, image, noIndex, path]);

  return null;
}
