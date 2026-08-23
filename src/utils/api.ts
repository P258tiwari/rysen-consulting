import type { CaseStudy } from "../data/content";
import type { ResourceArticle } from "./resourceStore";

export type BackendCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type BackendCaseStudy = CaseStudy & {
  status: "Draft" | "Published";
  createdAt: string;
  updatedAt: string;
  source: "admin";
};

export type ContactEntry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  organisation: string;
  role: string;
  interest: string;
  message: string;
  status: "New" | "Contacted" | "Closed";
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type ContactSubmission = Pick<
  ContactEntry,
  "name" | "email" | "phone" | "organisation" | "role" | "interest" | "message"
> & { recaptchaToken?: string };

async function apiRequest<T>(path: string, options: RequestInit = {}, admin = false): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(path, { ...options, headers, credentials: "same-origin" });
  const payload = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (response.status === 401 && admin && typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("rysen-admin-unauthorized"));
  }
  if (!response.ok) throw new Error(payload.error || `Request failed with status ${response.status}.`);
  return payload;
}

export function getBackendBlogs(status?: "Draft" | "Published") {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<ResourceArticle[]>(`/api/blogs${query}`, {}, !status);
}

export function getBackendCategories() {
  return apiRequest<BackendCategory[]>("/api/categories", {}, true);
}

export function createBackendCategory(category: Pick<BackendCategory, "name" | "description">) {
  return apiRequest<BackendCategory>("/api/categories", { method: "POST", body: JSON.stringify(category) }, true);
}

export function deleteBackendCategory(id: string) {
  return apiRequest<{ ok: true }>(`/api/categories/${encodeURIComponent(id)}`, { method: "DELETE" }, true);
}

export function getBackendBlog(identifier: string) {
  return apiRequest<ResourceArticle>(`/api/blogs/${encodeURIComponent(identifier)}`);
}

export function createBackendBlog(article: Omit<ResourceArticle, "id" | "createdAt" | "updatedAt" | "source">) {
  return apiRequest<ResourceArticle>("/api/blogs", { method: "POST", body: JSON.stringify(article) }, true);
}

export function updateBackendBlog(id: string, article: Partial<ResourceArticle>) {
  return apiRequest<ResourceArticle>(`/api/blogs/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(article) }, true);
}

export function deleteBackendBlog(id: string) {
  return apiRequest<{ ok: true }>(`/api/blogs/${encodeURIComponent(id)}`, { method: "DELETE" }, true);
}

export function getBackendCaseStudies(status?: "Draft" | "Published") {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<BackendCaseStudy[]>(`/api/case-studies${query}`, {}, !status);
}

export function createBackendCaseStudy(study: Omit<BackendCaseStudy, "id" | "createdAt" | "updatedAt" | "source">) {
  return apiRequest<BackendCaseStudy>("/api/case-studies", { method: "POST", body: JSON.stringify(study) }, true);
}

export function updateBackendCaseStudy(id: string, study: Partial<BackendCaseStudy>) {
  return apiRequest<BackendCaseStudy>(`/api/case-studies/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(study) }, true);
}

export function deleteBackendCaseStudy(id: string) {
  return apiRequest<{ ok: true }>(`/api/case-studies/${encodeURIComponent(id)}`, { method: "DELETE" }, true);
}

export function submitContactEntry(entry: ContactSubmission) {
  return apiRequest<{ id: string; createdAt: string }>("/api/contacts", { method: "POST", body: JSON.stringify(entry) });
}

export function subscribeNewsletter(email: string, website = "") {
  return apiRequest<{ subscribed: true; alreadySubscribed: boolean }>("/api/newsletter", {
    method: "POST",
    body: JSON.stringify({ email, website }),
  });
}

export function getContactEntries() {
  return apiRequest<ContactEntry[]>("/api/contacts", {}, true);
}

export function updateContactEntry(id: string, update: Pick<ContactEntry, "status" | "notes">) {
  return apiRequest<ContactEntry>(`/api/contacts/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(update) }, true);
}

export function deleteContactEntry(id: string) {
  return apiRequest<{ ok: true }>(`/api/contacts/${encodeURIComponent(id)}`, { method: "DELETE" }, true);
}

export function getBackendHealth() {
  return apiRequest<{
    ok: boolean;
    storage: string;
    counts: { categories: number; blogs: number; caseStudies: number; contacts: number; newsletterSubscribers: number };
    passwordLoginEnabled: boolean;
    recaptchaEnabled: boolean;
  }>("/api/health");
}

export function loginAdmin(password: string) {
  return apiRequest<{ authenticated: true; expiresIn: number }>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export function getAdminSession() {
  return apiRequest<{ authenticated: boolean }>("/api/admin/session", {}, true);
}

export function logoutAdmin() {
  return apiRequest<{ authenticated: false }>("/api/admin/logout", { method: "POST" });
}
