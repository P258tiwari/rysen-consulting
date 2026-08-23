import { createServer } from "node:http";
import { createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { loadEnvFile } from "node:process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { gzip } from "node:zlib";
import { defaultCaseStudies } from "./seed-case-studies.js";
import { defaultBlogs } from "./seed-blogs.js";

const serverDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(serverDirectory, "..");
for (const environmentFile of [".env.local", ".env"]) {
  try {
    loadEnvFile(resolve(projectDirectory, environmentFile));
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}
const databasePath = resolve(serverDirectory, "data", "db.json");
const distributionDirectory = resolve(projectDirectory, "dist");
const port = Number(process.env.PORT || 8787);
const host = String(process.env.HOST || (process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1"));
const siteOrigin = String(process.env.SITE_URL || "https://rysenconsulting.com").replace(/\/$/, "");
const recaptchaSecretKey = String(process.env.RECAPTCHA_SECRET_KEY || "").trim();
const configuredRecaptchaScore = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5);
const recaptchaMinimumScore = Number.isFinite(configuredRecaptchaScore) ? Math.min(1, Math.max(0, configuredRecaptchaScore)) : 0.5;
const developmentAdminPassword = process.env.NODE_ENV === "production" ? "" : "rysen-admin";
const adminPassword = String(process.env.ADMIN_PASSWORD || developmentAdminPassword).trim();
const emptyDatabase = { meta: { caseStudiesSeeded: false, blogsSeeded: false }, categories: [], blogs: [], caseStudies: [], contacts: [], newsletterSubscribers: [] };
const contactAttempts = new Map();
const newsletterAttempts = new Map();
const loginAttempts = new Map();
const sessionDuration = 12 * 60 * 60 * 1000;
const gzipAsync = promisify(gzip);

let writeQueue = Promise.resolve();

async function ensureDatabase() {
  await mkdir(dirname(databasePath), { recursive: true });
  try {
    await stat(databasePath);
  } catch {
    await writeFile(databasePath, JSON.stringify(emptyDatabase, null, 2), "utf8");
  }
  const raw = await readFile(databasePath, "utf8");
  const database = JSON.parse(raw);
  let changed = false;
  if (!database.meta?.caseStudiesSeeded) {
    const existing = Array.isArray(database.caseStudies) ? database.caseStudies : [];
    const titles = new Set(existing.map((study) => String(study.title || "").trim().toLowerCase()));
    const timestamp = new Date().toISOString();
    database.caseStudies = [
      ...existing,
      ...defaultCaseStudies
        .filter((study) => !titles.has(study.title.trim().toLowerCase()))
        .map((study) => ({ ...study, status: "Published", source: "admin", createdAt: timestamp, updatedAt: timestamp })),
    ];
    database.meta = { ...(database.meta || {}), caseStudiesSeeded: true };
    changed = true;
  }
  if (!database.meta?.blogsSeeded) {
    const existingBlogs = Array.isArray(database.blogs) ? database.blogs : [];
    const blogSlugs = new Set(existingBlogs.map((blog) => String(blog.slug || "")));
    const existingCategories = Array.isArray(database.categories) ? database.categories : [];
    const categorySlugs = new Set(existingCategories.map((category) => String(category.slug || "")));
    const timestamp = new Date().toISOString();
    database.blogs = [
      ...existingBlogs,
      ...defaultBlogs
        .filter((blog) => !blogSlugs.has(blog.slug))
        .map((blog) => ({ ...blog, source: "admin", createdAt: timestamp, updatedAt: timestamp })),
    ];
    database.categories = [
      ...existingCategories,
      ...defaultBlogs
        .filter((blog) => !categorySlugs.has(slugify(blog.category)))
        .map((blog) => {
          const slug = slugify(blog.category);
          categorySlugs.add(slug);
          return { id: `category-${slug}`, name: blog.category, slug, description: `${blog.category} insights from RYSEN Leadership and Coaching.`, createdAt: timestamp, updatedAt: timestamp };
        }),
    ];
    database.meta = { ...(database.meta || {}), blogsSeeded: true };
    changed = true;
  }
  if (changed) await writeFile(databasePath, JSON.stringify(database, null, 2), "utf8");
}

async function readDatabase() {
  await ensureDatabase();
  const raw = await readFile(databasePath, "utf8");
  const parsed = JSON.parse(raw);
  return {
    meta: parsed.meta && typeof parsed.meta === "object" ? parsed.meta : { caseStudiesSeeded: true, blogsSeeded: true },
    categories: Array.isArray(parsed.categories) ? parsed.categories : [],
    blogs: Array.isArray(parsed.blogs) ? parsed.blogs : [],
    caseStudies: Array.isArray(parsed.caseStudies) ? parsed.caseStudies : [],
    contacts: Array.isArray(parsed.contacts) ? parsed.contacts : [],
    newsletterSubscribers: Array.isArray(parsed.newsletterSubscribers) ? parsed.newsletterSubscribers : [],
  };
}

function updateDatabase(updater) {
  const operation = writeQueue.then(async () => {
    const database = await readDatabase();
    const result = await updater(database);
    const temporaryPath = `${databasePath}.tmp`;
    await writeFile(temporaryPath, JSON.stringify(database, null, 2), "utf8");
    await rename(temporaryPath, databasePath);
    return result;
  });
  writeQueue = operation.catch(() => undefined);
  return operation;
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(JSON.stringify(payload));
}

function escapeXml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

async function serveSitemap(response) {
  const database = await readDatabase();
  const staticPaths = [
    "/", "/about", "/services", "/services/leadership-development", "/services/executive-presence-influence",
    "/services/executive-coaching", "/services/ai-future-skills", "/services/talent-strategy-organisational-effectiveness",
    "/services/culture-deib-change", "/case-studies", "/testimonials", "/book-speaking", "/resources", "/contact",
  ];
  const entries = [
    ...staticPaths.map((path) => ({ path, updatedAt: "" })),
    ...database.blogs.filter((blog) => blog.status === "Published").map((blog) => ({ path: `/resources/${blog.slug}`, updatedAt: blog.updatedAt })),
  ];
  const urls = entries.map((entry) => {
    const lastModified = entry.updatedAt ? `<lastmod>${escapeXml(String(entry.updatedAt).slice(0, 10))}</lastmod>` : "";
    return `<url><loc>${escapeXml(`${siteOrigin}${entry.path}`)}</loc>${lastModified}</url>`;
  }).join("");
  response.writeHead(200, {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 12 * 1024 * 1024) throw new Error("Request body is too large.");
    chunks.push(chunk);
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function isAdmin(request) {
  const token = readCookies(request).rysen_admin_session;
  return token ? validSessionToken(token) : false;
}

function requireAdmin(request, response) {
  if (isAdmin(request)) return true;
  sendJson(response, 401, { error: "Your admin session has expired. Sign in again with the admin password." });
  return false;
}

function cleanString(value, maximum = 10000) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function cleanStringArray(value) {
  const values = Array.isArray(value) ? value : typeof value === "string" ? value.split(/\r?\n/) : [];
  return values.map((item) => cleanString(item, 1000)).filter(Boolean).slice(0, 30);
}

function cleanStatus(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function readCookies(request) {
  return String(request.headers.cookie || "")
    .split(";")
    .map((item) => item.trim().split("="))
    .reduce((cookies, [name, ...value]) => {
      if (name) cookies[name] = decodeURIComponent(value.join("="));
      return cookies;
    }, {});
}

function safeEqual(value, expected) {
  const valueBuffer = Buffer.from(String(value));
  const expectedBuffer = Buffer.from(String(expected));
  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer);
}

function createSessionToken() {
  const expiresAt = Date.now() + sessionDuration;
  const nonce = randomBytes(24).toString("hex");
  const payload = `${expiresAt}.${nonce}`;
  const signature = createHmac("sha256", adminPassword).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

function validSessionToken(token) {
  if (!adminPassword) return false;
  const [expiresAt, nonce, signature, ...extra] = String(token).split(".");
  if (!expiresAt || !nonce || !signature || extra.length > 0 || Number(expiresAt) <= Date.now()) return false;
  const expected = createHmac("sha256", adminPassword).update(`${expiresAt}.${nonce}`).digest("hex");
  return safeEqual(signature, expected);
}

function loginRateLimited(request, succeeded = false) {
  const key = request.socket.remoteAddress || "unknown";
  if (succeeded) {
    loginAttempts.delete(key);
    return false;
  }
  const now = Date.now();
  const recent = (loginAttempts.get(key) || []).filter((time) => now - time < 15 * 60 * 1000);
  if (recent.length >= 8) return true;
  recent.push(now);
  loginAttempts.set(key, recent);
  return false;
}

function sessionCookie(request, token, maximumAge) {
  const secure = request.headers["x-forwarded-proto"] === "https" ? "; Secure" : "";
  return `rysen_admin_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maximumAge}${secure}`;
}

function slugify(value) {
  return cleanString(value, 160)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function blogPayload(input, current = {}) {
  const title = cleanString(input.title ?? current.title, 200);
  const excerpt = cleanString(input.excerpt ?? current.excerpt, 1000);
  return {
    ...current,
    title,
    slug: slugify(input.slug ?? current.slug ?? title),
    categoryId: cleanString(input.categoryId ?? current.categoryId, 120),
    category: cleanString(input.category ?? current.category, 120),
    excerpt,
    body: cleanString(input.body ?? current.body, 100000),
    author: cleanString(input.author ?? current.author, 120) || "Bidisha Banerjee",
    date: cleanString(input.date ?? current.date, 40) || new Date().toISOString().slice(0, 10),
    status: cleanStatus(input.status ?? current.status, ["Draft", "Published"], "Draft"),
    featuredImage: cleanString(input.featuredImage ?? current.featuredImage, 8_000_000),
    featuredImageAlt: cleanString(input.featuredImageAlt ?? current.featuredImageAlt, 300),
    videoUrl: cleanString(input.videoUrl ?? current.videoUrl, 2000),
    videoFile: cleanString(input.videoFile ?? current.videoFile, 8_000_000),
    seoTitle: cleanString(input.seoTitle ?? current.seoTitle, 250) || title,
    seoDescription: cleanString(input.seoDescription ?? current.seoDescription, 500) || excerpt,
    seoKeywords: cleanString(input.seoKeywords ?? current.seoKeywords, 500),
    canonicalUrl: cleanString(input.canonicalUrl ?? current.canonicalUrl, 1000),
    ogTitle: cleanString(input.ogTitle ?? current.ogTitle, 250) || title,
    ogDescription: cleanString(input.ogDescription ?? current.ogDescription, 500) || excerpt,
    ogImage: cleanString(input.ogImage ?? current.ogImage, 8_000_000),
  };
}

function caseStudyPayload(input, current = {}) {
  return {
    ...current,
    title: cleanString(input.title ?? current.title, 240),
    practiceArea: cleanString(input.practiceArea ?? current.practiceArea, 160),
    challenge: cleanStringArray(input.challenge ?? current.challenge),
    solution: cleanStringArray(input.solution ?? current.solution),
    impact: cleanStringArray(input.impact ?? current.impact),
    image: cleanString(input.image ?? current.image, 8_000_000),
    imageAlt: cleanString(input.imageAlt ?? current.imageAlt, 300),
    status: cleanStatus(input.status ?? current.status, ["Draft", "Published"], "Published"),
  };
}

function validateBlog(blog) {
  if (!blog.title || !blog.slug || !blog.excerpt) return "Title, slug, and excerpt are required.";
  return "";
}

function validateCaseStudy(study) {
  if (!study.title || !study.practiceArea) return "Title and practice area are required.";
  if (study.challenge.length === 0 || study.solution.length === 0 || study.impact.length === 0) {
    return "At least one challenge, solution, and impact item is required.";
  }
  return "";
}

function contactRateLimited(request) {
  const key = request.socket.remoteAddress || "unknown";
  const now = Date.now();
  const recent = (contactAttempts.get(key) || []).filter((time) => now - time < 10 * 60 * 1000);
  if (recent.length >= 5) return true;
  recent.push(now);
  contactAttempts.set(key, recent);
  return false;
}

function newsletterRateLimited(request) {
  const key = request.socket.remoteAddress || "unknown";
  const now = Date.now();
  const recent = (newsletterAttempts.get(key) || []).filter((time) => now - time < 10 * 60 * 1000);
  if (recent.length >= 8) return true;
  recent.push(now);
  newsletterAttempts.set(key, recent);
  return false;
}

async function verifyContactRecaptcha(token, request) {
  if (!recaptchaSecretKey) {
    return process.env.NODE_ENV === "production"
      ? { ok: false, status: 503, error: "Bot protection is not configured on the server." }
      : { ok: true };
  }
  if (!token) return { ok: false, status: 400, error: "Please complete the bot-protection verification." };
  const parameters = new URLSearchParams({ secret: recaptchaSecretKey, response: cleanString(token, 5000) });
  const remoteAddress = String(request.headers["x-forwarded-for"] || request.socket.remoteAddress || "").split(",")[0].trim();
  if (remoteAddress) parameters.set("remoteip", remoteAddress);
  try {
    const verificationResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: parameters,
      signal: AbortSignal.timeout(8000),
    });
    if (!verificationResponse.ok) return { ok: false, status: 502, error: "Bot protection could not be verified. Please try again." };
    const verification = await verificationResponse.json();
    const accepted = verification.success === true && verification.action === "contact" && Number(verification.score) >= recaptchaMinimumScore;
    return accepted ? { ok: true } : { ok: false, status: 403, error: "Bot-protection verification failed. Please refresh and try again." };
  } catch {
    return { ok: false, status: 502, error: "Bot protection is temporarily unavailable. Please try again." };
  }
}

async function handleApi(request, response, url) {
  const segments = url.pathname.split("/").filter(Boolean);
  const collection = segments[1];
  const identifier = segments[2] ? decodeURIComponent(segments[2]) : "";

  if (url.pathname === "/api/admin/login" && request.method === "POST") {
    if (!adminPassword) {
      sendJson(response, 503, { error: "ADMIN_PASSWORD is not configured on the server." });
      return;
    }
    if (loginRateLimited(request)) {
      sendJson(response, 429, { error: "Too many login attempts. Please try again later." });
      return;
    }
    const input = await readJson(request);
    if (!safeEqual(cleanString(input.password, 500), adminPassword)) {
      sendJson(response, 401, { error: "Incorrect admin password." });
      return;
    }
    loginRateLimited(request, true);
    const token = createSessionToken();
    response.setHeader("Set-Cookie", sessionCookie(request, token, Math.floor(sessionDuration / 1000)));
    sendJson(response, 200, { authenticated: true, expiresIn: sessionDuration });
    return;
  }

  if (url.pathname === "/api/admin/session" && request.method === "GET") {
    sendJson(response, 200, { authenticated: isAdmin(request) });
    return;
  }

  if (url.pathname === "/api/admin/logout" && request.method === "POST") {
    response.setHeader("Set-Cookie", sessionCookie(request, "", 0));
    sendJson(response, 200, { authenticated: false });
    return;
  }

  if (url.pathname === "/api/health" && request.method === "GET") {
    const database = await readDatabase();
    sendJson(response, 200, {
      ok: true,
      storage: "json",
      counts: {
        categories: database.categories.length,
        blogs: database.blogs.length,
        caseStudies: database.caseStudies.length,
        contacts: database.contacts.length,
        newsletterSubscribers: database.newsletterSubscribers.length,
      },
      passwordLoginEnabled: Boolean(adminPassword),
      recaptchaEnabled: Boolean(recaptchaSecretKey),
    });
    return;
  }

  if (collection === "categories") {
    if (!requireAdmin(request, response)) return;
    if (request.method === "GET") {
      const database = await readDatabase();
      sendJson(response, 200, database.categories);
      return;
    }
    if (request.method === "POST") {
      const input = await readJson(request);
      const name = cleanString(input.name, 120);
      const slug = slugify(input.slug || name);
      const description = cleanString(input.description, 500);
      if (!name || !slug) return sendJson(response, 400, { error: "Category name is required." });
      const created = await updateDatabase((database) => {
        if (database.categories.some((item) => item.slug === slug)) throw new Error("That category already exists.");
        const timestamp = new Date().toISOString();
        const record = { id: `category-${randomUUID()}`, name, slug, description, createdAt: timestamp, updatedAt: timestamp };
        database.categories.push(record);
        return record;
      });
      sendJson(response, 201, created);
      return;
    }
    if (request.method === "DELETE" && identifier) {
      const removed = await updateDatabase((database) => {
        const index = database.categories.findIndex((item) => item.id === identifier);
        if (index < 0) return false;
        database.categories.splice(index, 1);
        return true;
      });
      sendJson(response, removed ? 200 : 404, removed ? { ok: true } : { error: "Category not found." });
      return;
    }
  }

  if (collection === "blogs") {
    if (request.method === "GET") {
      const database = await readDatabase();
      if (identifier) {
        const blog = database.blogs.find((item) => item.id === identifier || item.slug === identifier);
        const visibleBlog = blog && (blog.status === "Published" || isAdmin(request)) ? blog : null;
        sendJson(response, visibleBlog ? 200 : 404, visibleBlog || { error: "Blog post not found." });
        return;
      }
      const status = url.searchParams.get("status");
      if (status && status !== "Published" && !requireAdmin(request, response)) return;
      if (!status && !requireAdmin(request, response)) return;
      const blogs = status ? database.blogs.filter((blog) => blog.status === status) : database.blogs;
      sendJson(response, 200, blogs);
      return;
    }
    if (!requireAdmin(request, response)) return;
    if (request.method === "POST") {
      const input = await readJson(request);
      const blog = blogPayload(input);
      const error = validateBlog(blog);
      if (error) return sendJson(response, 400, { error });
      const created = await updateDatabase((database) => {
        if (database.blogs.some((item) => item.slug === blog.slug)) throw new Error("A blog post with this slug already exists.");
        const timestamp = new Date().toISOString();
        const record = { ...blog, id: `blog-${randomUUID()}`, createdAt: timestamp, updatedAt: timestamp, source: "admin" };
        database.blogs.unshift(record);
        return record;
      });
      sendJson(response, 201, created);
      return;
    }
    if ((request.method === "PUT" || request.method === "PATCH") && identifier) {
      const input = await readJson(request);
      const updated = await updateDatabase((database) => {
        const index = database.blogs.findIndex((item) => item.id === identifier);
        if (index < 0) return null;
        const blog = blogPayload(input, database.blogs[index]);
        const error = validateBlog(blog);
        if (error) throw new Error(error);
        if (database.blogs.some((item, itemIndex) => itemIndex !== index && item.slug === blog.slug)) {
          throw new Error("A blog post with this slug already exists.");
        }
        database.blogs[index] = { ...blog, id: database.blogs[index].id, createdAt: database.blogs[index].createdAt, updatedAt: new Date().toISOString(), source: "admin" };
        return database.blogs[index];
      });
      sendJson(response, updated ? 200 : 404, updated || { error: "Blog post not found." });
      return;
    }
    if (request.method === "DELETE" && identifier) {
      const removed = await updateDatabase((database) => {
        const index = database.blogs.findIndex((item) => item.id === identifier);
        if (index < 0) return false;
        database.blogs.splice(index, 1);
        return true;
      });
      sendJson(response, removed ? 200 : 404, removed ? { ok: true } : { error: "Blog post not found." });
      return;
    }
  }

  if (collection === "case-studies") {
    if (request.method === "GET") {
      const database = await readDatabase();
      const status = url.searchParams.get("status");
      if (identifier) {
        const study = database.caseStudies.find((item) => item.id === identifier);
        const visibleStudy = study && (study.status === "Published" || isAdmin(request)) ? study : null;
        sendJson(response, visibleStudy ? 200 : 404, visibleStudy || { error: "Case study not found." });
        return;
      }
      if (status && status !== "Published" && !requireAdmin(request, response)) return;
      if (!status && !requireAdmin(request, response)) return;
      const studies = url.searchParams.get("status")
        ? database.caseStudies.filter((study) => study.status === url.searchParams.get("status"))
        : database.caseStudies;
      sendJson(response, 200, studies);
      return;
    }
    if (!requireAdmin(request, response)) return;
    if (request.method === "POST") {
      const input = await readJson(request);
      const study = caseStudyPayload(input);
      const error = validateCaseStudy(study);
      if (error) return sendJson(response, 400, { error });
      const created = await updateDatabase((database) => {
        const timestamp = new Date().toISOString();
        const record = { ...study, id: `case-${randomUUID()}`, createdAt: timestamp, updatedAt: timestamp, source: "admin" };
        database.caseStudies.unshift(record);
        return record;
      });
      sendJson(response, 201, created);
      return;
    }
    if ((request.method === "PUT" || request.method === "PATCH") && identifier) {
      const input = await readJson(request);
      const updated = await updateDatabase((database) => {
        const index = database.caseStudies.findIndex((item) => item.id === identifier);
        if (index < 0) return null;
        const study = caseStudyPayload(input, database.caseStudies[index]);
        const error = validateCaseStudy(study);
        if (error) throw new Error(error);
        database.caseStudies[index] = { ...study, id: database.caseStudies[index].id, createdAt: database.caseStudies[index].createdAt, updatedAt: new Date().toISOString(), source: "admin" };
        return database.caseStudies[index];
      });
      sendJson(response, updated ? 200 : 404, updated || { error: "Case study not found." });
      return;
    }
    if (request.method === "DELETE" && identifier) {
      const removed = await updateDatabase((database) => {
        const index = database.caseStudies.findIndex((item) => item.id === identifier);
        if (index < 0) return false;
        database.caseStudies.splice(index, 1);
        return true;
      });
      sendJson(response, removed ? 200 : 404, removed ? { ok: true } : { error: "Case study not found." });
      return;
    }
  }

  if (collection === "contacts") {
    if (request.method === "POST") {
      if (contactRateLimited(request)) return sendJson(response, 429, { error: "Too many submissions. Please try again later." });
      const input = await readJson(request);
      const contact = {
        name: cleanString(input.name, 120),
        email: cleanString(input.email, 200).toLowerCase(),
        phone: cleanString(input.phone, 80),
        organisation: cleanString(input.organisation, 180),
        role: cleanString(input.role, 160),
        interest: cleanString(input.interest, 200),
        message: cleanString(input.message, 5000),
      };
      if (!contact.name || !contact.email || !contact.interest || !contact.message) {
        return sendJson(response, 400, { error: "Name, email, interest, and message are required." });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
        return sendJson(response, 400, { error: "A valid email address is required." });
      }
      const recaptcha = await verifyContactRecaptcha(input.recaptchaToken, request);
      if (!recaptcha.ok) return sendJson(response, recaptcha.status, { error: recaptcha.error });
      const created = await updateDatabase((database) => {
        const timestamp = new Date().toISOString();
        const record = { ...contact, id: `contact-${randomUUID()}`, status: "New", notes: "", createdAt: timestamp, updatedAt: timestamp };
        database.contacts.unshift(record);
        return record;
      });
      sendJson(response, 201, { id: created.id, createdAt: created.createdAt });
      return;
    }
    if (!requireAdmin(request, response)) return;
    if (request.method === "GET") {
      const database = await readDatabase();
      sendJson(response, 200, database.contacts);
      return;
    }
    if ((request.method === "PUT" || request.method === "PATCH") && identifier) {
      const input = await readJson(request);
      const updated = await updateDatabase((database) => {
        const index = database.contacts.findIndex((item) => item.id === identifier);
        if (index < 0) return null;
        const current = database.contacts[index];
        database.contacts[index] = {
          ...current,
          status: cleanStatus(input.status ?? current.status, ["New", "Contacted", "Closed"], current.status),
          notes: cleanString(input.notes ?? current.notes, 5000),
          updatedAt: new Date().toISOString(),
        };
        return database.contacts[index];
      });
      sendJson(response, updated ? 200 : 404, updated || { error: "Contact entry not found." });
      return;
    }
    if (request.method === "DELETE" && identifier) {
      const removed = await updateDatabase((database) => {
        const index = database.contacts.findIndex((item) => item.id === identifier);
        if (index < 0) return false;
        database.contacts.splice(index, 1);
        return true;
      });
      sendJson(response, removed ? 200 : 404, removed ? { ok: true } : { error: "Contact entry not found." });
      return;
    }
  }

  if (collection === "newsletter") {
    if (request.method === "POST") {
      if (newsletterRateLimited(request)) return sendJson(response, 429, { error: "Too many subscription attempts. Please try again later." });
      const input = await readJson(request);
      if (cleanString(input.website, 200)) return sendJson(response, 200, { subscribed: true, alreadySubscribed: false });
      const email = cleanString(input.email, 200).toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return sendJson(response, 400, { error: "A valid email address is required." });
      const result = await updateDatabase((database) => {
        const existing = database.newsletterSubscribers.find((subscriber) => subscriber.email === email);
        if (existing) return { subscribed: true, alreadySubscribed: true, id: existing.id };
        const record = { id: `newsletter-${randomUUID()}`, email, createdAt: new Date().toISOString() };
        database.newsletterSubscribers.unshift(record);
        return { subscribed: true, alreadySubscribed: false, id: record.id };
      });
      sendJson(response, result.alreadySubscribed ? 200 : 201, result);
      return;
    }
    if (!requireAdmin(request, response)) return;
    if (request.method === "GET") {
      const database = await readDatabase();
      sendJson(response, 200, database.newsletterSubscribers);
      return;
    }
    if (request.method === "DELETE" && identifier) {
      const removed = await updateDatabase((database) => {
        const index = database.newsletterSubscribers.findIndex((subscriber) => subscriber.id === identifier);
        if (index < 0) return false;
        database.newsletterSubscribers.splice(index, 1);
        return true;
      });
      sendJson(response, removed ? 200 : 404, removed ? { ok: true } : { error: "Newsletter subscriber not found." });
      return;
    }
  }

  sendJson(response, 404, { error: "API endpoint not found." });
}

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

async function serveFrontend(request, response, url) {
  const requestedPath = decodeURIComponent(url.pathname);
  const candidate = resolve(distributionDirectory, `.${requestedPath}`);
  const safeCandidate = candidate.startsWith(distributionDirectory) ? candidate : resolve(distributionDirectory, "index.html");
  let filePath = safeCandidate;
  try {
    const fileStats = await stat(filePath);
    if (fileStats.isDirectory()) filePath = resolve(filePath, "index.html");
  } catch {
    filePath = resolve(distributionDirectory, "index.html");
  }
  try {
    const content = await readFile(filePath);
    const extension = extname(filePath).toLowerCase();
    const compressible = [".css", ".html", ".js", ".json", ".svg", ".txt", ".xml"].includes(extension);
    const useGzip = compressible && content.length > 1024 && String(request.headers["accept-encoding"] || "").includes("gzip");
    const body = useGzip ? await gzipAsync(content) : content;
    const isVersionedAsset = requestedPath.startsWith("/assets/") && [".css", ".js"].includes(extension) && /-[A-Za-z0-9_-]{8,}\./.test(requestedPath);
    const cacheControl = extension === ".html" ? "no-cache" : isVersionedAsset ? "public, max-age=31536000, immutable" : requestedPath.startsWith("/assets/") ? "public, max-age=604800" : "public, max-age=3600";
    const headers = {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
      "Cache-Control": cacheControl,
      "Vary": "Accept-Encoding",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    };
    if (useGzip) headers["Content-Encoding"] = "gzip";
    response.writeHead(200, headers);
    response.end(body);
  } catch {
    sendJson(response, 503, { error: "Frontend build not found. Run npm run build first." });
  }
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "127.0.0.1"}`);
    if (url.pathname === "/sitemap.xml") {
      await serveSitemap(response);
      return;
    }
    if (url.pathname.startsWith("/api/")) {
      await handleApi(request, response, url);
      return;
    }
    await serveFrontend(request, response, url);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    const status = message.includes("already exists") || message.includes("required") ? 400 : 500;
    sendJson(response, status, { error: message });
  }
});

await ensureDatabase();
server.listen(port, host, () => {
  console.log(`RYSEN backend listening on http://${host}:${port}`);
});
