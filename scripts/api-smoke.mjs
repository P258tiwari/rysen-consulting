const baseUrl = process.env.API_BASE_URL || "http://127.0.0.1:8787";
const adminPassword = process.env.ADMIN_PASSWORD || "rysen-admin";
const created = { categories: [], blogs: [], caseStudies: [], contacts: [], newsletters: [] };
let sessionCookie = "";

async function request(path, options = {}, admin = false) {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  if (sessionCookie && admin) headers.set("Cookie", sessionCookie);
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
  const payload = await response.json();
  if (!response.ok) throw new Error(`${options.method || "GET"} ${path}: ${payload.error || response.status}`);
  return payload;
}

try {
  const loginResponse = await fetch(`${baseUrl}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: adminPassword }),
  });
  if (!loginResponse.ok) throw new Error("Admin login failed before API smoke test.");
  sessionCookie = String(loginResponse.headers.get("set-cookie") || "").split(";")[0];
  const health = await request("/api/health");
  if (!health.ok) throw new Error("Health endpoint did not report ok.");
  const publishedCaseStudies = await request("/api/case-studies?status=Published");
  const requiredStudyIds = ["hipo-leadership-journey", "executive-presence-lab", "coaching-across-borders", "ai-active-organisation", "assessment-centres", "generational-inclusion"];
  if (!requiredStudyIds.every((id) => publishedCaseStudies.some((study) => study.id === id))) {
    throw new Error("The six default case studies were not fully migrated into backend storage.");
  }
  const publishedBlogs = await request("/api/blogs?status=Published");
  if (publishedBlogs.length < 6 || !publishedBlogs.every((blog) => blog.body)) {
    throw new Error("The starter resource articles were not fully migrated into backend storage.");
  }

  const category = await request("/api/categories", {
    method: "POST",
    body: JSON.stringify({ name: "API Smoke Category", description: "Temporary category verification." }),
  }, true);
  created.categories.push(category.id);
  const categories = await request("/api/categories", {}, true);
  if (!categories.some((item) => item.id === category.id)) throw new Error("Category creation was not persisted.");

  const blog = await request("/api/blogs", {
    method: "POST",
    body: JSON.stringify({ title: "API Smoke Blog", slug: "api-smoke-blog", excerpt: "Temporary API verification.", category: "Testing", categoryId: "testing", status: "Draft" }),
  }, true);
  created.blogs.push(blog.id);
  const updatedBlog = await request(`/api/blogs/${blog.id}`, { method: "PATCH", body: JSON.stringify({ status: "Published" }) }, true);
  if (updatedBlog.status !== "Published") throw new Error("Blog update was not persisted.");
  const fetchedBlog = await request(`/api/blogs/${blog.slug}`);
  if (fetchedBlog.id !== blog.id) throw new Error("Blog slug lookup failed.");

  const caseStudy = await request("/api/case-studies", {
    method: "POST",
    body: JSON.stringify({ title: "API Smoke Case Study", practiceArea: "Testing", challenge: ["Challenge"], solution: ["Solution"], impact: ["Impact"], image: "", imageAlt: "", status: "Draft" }),
  }, true);
  created.caseStudies.push(caseStudy.id);
  const updatedStudy = await request(`/api/case-studies/${caseStudy.id}`, { method: "PATCH", body: JSON.stringify({ status: "Published" }) }, true);
  if (updatedStudy.status !== "Published") throw new Error("Case-study update was not persisted.");

  if (health.recaptchaEnabled) {
    let rejectedWithoutToken = false;
    try {
      await request("/api/contacts", {
        method: "POST",
        body: JSON.stringify({ name: "API Smoke Contact", email: "api-smoke@example.com", interest: "Testing", message: "This must be rejected without a browser reCAPTCHA token." }),
      });
    } catch (error) {
      rejectedWithoutToken = String(error).includes("bot-protection verification");
    }
    if (!rejectedWithoutToken) throw new Error("Bot-protected contact submission did not reject a missing reCAPTCHA token.");
  } else {
    const contact = await request("/api/contacts", {
      method: "POST",
      body: JSON.stringify({ name: "API Smoke Contact", email: "api-smoke@example.com", phone: "123", organisation: "Test", role: "Tester", interest: "Testing", message: "Temporary API verification." }),
    });
    created.contacts.push(contact.id);
    const updatedContact = await request(`/api/contacts/${contact.id}`, { method: "PATCH", body: JSON.stringify({ status: "Contacted", notes: "Verified" }) }, true);
    if (updatedContact.status !== "Contacted" || updatedContact.notes !== "Verified") throw new Error("Contact follow-up update failed.");
  }

  const newsletter = await request("/api/newsletter", {
    method: "POST",
    body: JSON.stringify({ email: `api-smoke-${Date.now()}@example.com`, website: "" }),
  });
  created.newsletters.push(newsletter.id);
  const subscribers = await request("/api/newsletter", {}, true);
  if (!subscribers.some((subscriber) => subscriber.id === newsletter.id)) throw new Error("Newsletter subscription was not persisted.");

  console.log("API smoke test passed: categories, blogs, case studies, contacts, and newsletter subscriptions are persistent and editable.");
} finally {
  await Promise.all([
    ...created.categories.map((id) => request(`/api/categories/${id}`, { method: "DELETE" }, true).catch(() => undefined)),
    ...created.blogs.map((id) => request(`/api/blogs/${id}`, { method: "DELETE" }, true).catch(() => undefined)),
    ...created.caseStudies.map((id) => request(`/api/case-studies/${id}`, { method: "DELETE" }, true).catch(() => undefined)),
    ...created.contacts.map((id) => request(`/api/contacts/${id}`, { method: "DELETE" }, true).catch(() => undefined)),
    ...created.newsletters.map((id) => request(`/api/newsletter/${id}`, { method: "DELETE" }, true).catch(() => undefined)),
  ]);
}
